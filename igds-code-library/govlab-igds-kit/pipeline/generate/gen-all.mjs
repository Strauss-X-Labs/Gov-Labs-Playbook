#!/usr/bin/env node
// Generic generator (plan v3 §6, G2): every normalized Figma spec (spec/sets/*.json) -> one generated web component.
// Deterministic, offline, re-runnable. Values come only from the spec: Figma variable -> CSS token when the token's
// value equals Figma (status css-token), Figma-only variable -> --igdsx-* token with the light/dark values from Figma
// modes, otherwise the Figma literal. Unsupported Figma features are not approximated silently: each one is counted per
// component in catalog "gaps" (and fails L1/L2 where it shows).
// Rules (documented): R-PHYS Figma auto layout is physical (left->right), so containers use direction:ltr and text uses
// the component direction; R-STATE interactive State options follow real interaction; R-DUP duplicate variant names are
// all kept (first in Figma order is used for that property combination, the others stay addressable in data + catalog).
// Output: src/gen/components/<tag>.js, src/gen/index.js, src/gen/catalog.json, src/tokens/igdsx-gen-tokens.css
// Usage: node pipeline/generate/gen-all.mjs [--only setId,setId]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDefs } from '../figma-rest/defs.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REG = path.resolve(KIT, '../igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const args = process.argv.slice(2);
const ONLY = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;
const SKIP = new Map([['81:1195', 'igdsx-button']]); // has a dedicated, verified generator (gen-button.mjs)
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const r2 = (x) => Math.round(x * 100) / 100;

const master = rd(path.join(KIT, 'master-list.json'));
const kindById = new Map(master.rows.map((r) => [r.id, r]));
const iconIds = new Set(master.rows.filter((r) => r.kind === 'icon-set' || r.kind === 'icon-component').map((r) => r.id));
const { byName: DEFS } = loadDefs(KIT);
const vk = rd(path.join(REG, 'knowledge/figma/variables.json'));
const varIndex = new Map(); for (const col of vk.collections) for (const [n, , vals] of col.v) varIndex.set(`${col.c}/${n}`, { modes: col.modes, vals });
const resolveMode = (name, mode, d = 0) => { const v = varIndex.get(name.replace(/^\[remote\]/, '')); if (!v || d > 10) return null; let i = v.modes.indexOf(mode); if (i < 0) i = 0; const x = v.vals[i]; return typeof x === 'string' && x.startsWith('→') ? resolveMode(x.slice(1), mode, d + 1) : x; };
const MODES = { light: 'מותג ממשלתי ראשי', dark: 'Dark IGDS' };
const iconSvgDir = path.join(KIT, 'spec/icons');
// Figma-exported SVG -> sized to its box; a single-colour SVG gets currentColor so the bound Figma variable (token) colours
// it (and dark mode switches it); multi-colour SVGs keep their Figma colours. Geometry is never changed.
const prepSvg = (raw) => {
  let s = raw.replace(/<\?xml[^>]*>\s*/, '').replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1').replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1').replace('<svg', '<svg width="100%" height="100%" style="display:block;overflow:visible"');
  const cols = new Set([...s.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,8}|black|white)"/g)].map((m) => m[1].toLowerCase()));
  const mono = cols.size === 1;
  if (mono) s = s.replace(/(fill|stroke)="(#[0-9a-fA-F]{3,8}|black|white)"/g, '$1="currentColor"');
  return { svg: s, mono, color: mono ? [...cols][0] : null };
};
const iconSvg = (id) => { const f = path.join(iconSvgDir, id.replace(/:/g, '-') + '.svg'); return fs.existsSync(f) ? prepSvg(fs.readFileSync(f, 'utf8')) : null; };
const shapeSvgDir = path.join(KIT, 'spec/shapes');
const shapeSvg = (id) => { const f = path.join(shapeSvgDir, id.replace(/:/g, '-') + '.svg'); return fs.existsSync(f) ? prepSvg(fs.readFileSync(f, 'utf8')) : null; };

// ---------- load specs ----------
const specs = fs.readdirSync(path.join(KIT, 'spec/sets')).filter((f) => f.endsWith('.json')).sort().map((f) => rd(path.join(KIT, 'spec/sets', f)));
const usedTags = new Set(['igdsx-button']);
const tagOf = new Map();
for (const s of specs) {
  if (SKIP.has(s.set.id)) { tagOf.set(s.set.id, SKIP.get(s.set.id)); continue; }
  let t = 'igdsx-' + (slug(s.set.name) || 'set-' + slug(s.set.id));
  if (/^igdsx-\d/.test(t)) t = 'igdsx-c' + t.slice(6);
  if (usedTags.has(t)) t = t + '-' + slug(s.set.id);
  usedTags.add(t); tagOf.set(s.set.id, t);
}

// ---------- property model ----------
const RESERVED = new Set(['state', 'disabled', 'dir', 'id', 'class', 'style', 'slot', 'hidden', 'title', 'part', 'lang', 'role', 'tabindex', 'name']);
const INTERACTIVE = { hover: ['Hover'], pressed: ['Pressed', 'While pressing'], focus: ['Focused', 'Focus', 'Focoused'], disabled: ['Disabled', 'Disable'] };
function model(s) {
  const variants = s.variants.filter((v) => v.detail === 'tree');
  const defs = s.set.defs || DEFS[s.set.id] || {};
  const vnames = []; const opts = {};
  for (const v of variants) for (const [k, x] of Object.entries(v.props)) { if (!opts[k]) { opts[k] = []; vnames.push(k); } if (!opts[k].includes(x)) opts[k].push(x); }
  const order = [...vnames]; // variant properties in Figma order of appearance; option order from defs when known
  const props = []; const attrs = new Set();
  const attrName = (n) => { let a = slug(n) || 'prop'; if (RESERVED.has(a) || attrs.has(a) || /^\d/.test(a)) a = 'p-' + a; let b = a, i = 2; while (attrs.has(b)) b = `${a}-${i++}`; attrs.add(b); return b; };
  let rtl = null, state = null;
  for (const n of vnames) {
    const d = defs[n] && defs[n].t === 'VARIANT' ? defs[n] : null;
    const options = d && d.o ? [...d.o.filter((o) => opts[n].includes(o)), ...opts[n].filter((o) => !d.o.includes(o))] : opts[n];
    const dflt = d && options.includes(d.d) ? d.d : options[0];
    if (/^rtl$/i.test(n.trim()) && options.every((o) => /^(true|false)$/i.test(o))) { rtl = { prop: n, on: options.find((o) => /^true$/i.test(o)), off: options.find((o) => /^false$/i.test(o)) }; continue; }
    if (/^ltr$/i.test(n.trim()) && options.every((o) => /^(true|false)$/i.test(o))) { rtl = { prop: n, on: options.find((o) => /^false$/i.test(o)), off: options.find((o) => /^true$/i.test(o)) }; continue; }
    if (/^(state|states|status)$/i.test(n.trim()) && options.some((o) => Object.values(INTERACTIVE).flat().includes(o))) {
      const pick = (k) => options.find((o) => INTERACTIVE[k].includes(o)) || null;
      state = { prop: n, options, slugs: options.map(slug), default: dflt, hover: pick('hover'), pressed: pick('pressed'), focus: pick('focus'), disabled: pick('disabled') };
      continue;
    }
    props.push({ name: n, kind: 'variant', attr: attrName(n), options, slugs: options.map((o) => slug(o) || o), default: dflt });
  }
  for (const [k, d] of Object.entries(defs)) {
    if (d.t === 'VARIANT' || k.includes('#')) continue;
    props.push({ name: k, kind: { TEXT: 'text', BOOLEAN: 'boolean', INSTANCE_SWAP: 'swap' }[d.t] || d.t, attr: attrName(k), default: d.t === 'INSTANCE_SWAP' ? undefined : d.d });
  }
  return { variants, props, order, rtl, state };
}
const models = new Map(specs.map((s) => [s.set.id, model(s)]));

// ---------- styles ----------
const tokenDefs = new Map();
const gaps = new Map(); const gap = (tag, g) => { if (!gaps.has(tag)) gaps.set(tag, {}); gaps.get(tag)[g] = (gaps.get(tag)[g] || 0) + 1; };
function mk(spec, tag) {
  const token = (varName, literal, unit = 'px') => {
    const lit = typeof literal === 'number' ? `${r2(literal)}${unit}` : literal;
    const r = varName && spec.variables[varName];
    if (!r) return lit;
    if (r.status === 'css-token') return `var(${r.css})`;
    if (typeof literal === 'string' && literal.startsWith('#')) {
      const light = resolveMode(varName, MODES.light), dark = resolveMode(varName, MODES.dark);
      if (light && dark && String(light).toLowerCase().startsWith(literal.slice(0, 7).toLowerCase())) {
        const name = '--igdsx-' + slug(varName.replace(/^\[remote\]/, '').replace(/^Colors\//, 'color/'));
        tokenDefs.set(name, { light, dark, figma: varName });
        return `var(${name})`;
      }
    }
    return lit;
  };
  const color = (p) => { if (!p) return null; const a = p.a !== undefined && p.a < 1 ? Math.round(p.a * 255).toString(16).padStart(2, '0') : ''; return token(p.v, p.c + a); };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
  const gradient = (p, w, h) => {
    const stops = p.stops.map(([c, a, pos]) => `${rgba(c, a)} ${r2(pos * 100)}%`).join(',');
    if (!p.gh) { gap(tag, 'gradient-without-handles'); return null; }
    const [[x0, y0], [x1, y1]] = p.gh;
    if (p.t === 'GRADIENT_LINEAR') { const deg = r2(90 + (Math.atan2((y1 - y0) * h, (x1 - x0) * w) * 180) / Math.PI); return `linear-gradient(${deg}deg,${stops})`; }
    if (p.t === 'GRADIENT_RADIAL' || p.t === 'GRADIENT_DIAMOND') { if (p.t === 'GRADIENT_DIAMOND') gap(tag, 'diamond-gradient-as-radial'); const rx = Math.hypot((x1 - x0) * w, (y1 - y0) * h), ry = p.gh[2] ? Math.hypot((p.gh[2][0] - x0) * w, (p.gh[2][1] - y0) * h) : rx; return `radial-gradient(${r2(rx)}px ${r2(ry)}px at ${r2(x0 * 100)}% ${r2(y0 * 100)}%,${stops})`; }
    gap(tag, 'angular-gradient'); return null;
  };
  const backgrounds = (n) => {
    const fills = (n.f || []).slice().reverse(); // Figma: last fill on top; CSS: first layer on top
    const layers = [];
    for (const p of fills) {
      if (p.t === 'SOLID') { const c = color(p); layers.push(fills.length === 1 ? c : `linear-gradient(${c},${c})`); }
      else if (p.t.startsWith('GRADIENT')) { const g = gradient(p, n.w, n.h); if (g) layers.push(g); }
      else { gap(tag, 'fill-' + p.t.toLowerCase()); }
    }
    if (!layers.length) return null;
    return layers.length === 1 && !layers[0].includes('gradient(') ? { 'background-color': layers[0] } : { background: layers.join(',') };
  };
  const WEIGHT = { thin: 100, extralight: 200, 'extra light': 200, light: 300, regular: 400, normal: 400, medium: 500, semibold: 600, 'semi bold': 600, bold: 700, extrabold: 800, 'extra bold': 800, black: 900 };
  function css(n, parent, isRoot) {
    const d = {}; const v = n.v || {};
    // ---- position & size ----
    const pal = parent && parent.al && !n.abs ? parent.al : null;
    let [sh, sv] = n.al ? [n.al.sh, n.al.sv] : n.sz || ['FIXED', 'FIXED'];
    // Figma keeps the last size of a hugging auto-layout frame whose children are all hidden; CSS would collapse it
    if (n.al && !(n.c || []).some((c) => !c.hid)) { if (sh === 'HUG') sh = 'FIXED'; if (sv === 'HUG') sv = 'FIXED'; }
    if (isRoot) { d.position = 'relative'; d.width = sh === 'FIXED' ? `${n.w}px` : sh === 'FILL' ? '100%' : 'auto'; d.height = sv === 'FIXED' ? `${n.h}px` : sv === 'FILL' ? '100%' : 'auto'; }
    else if (pal) {
      const horiz = pal.m === 'HORIZONTAL';
      const main = horiz ? sh : sv, cross = horiz ? sv : sh;
      const [mp, cp] = horiz ? ['width', 'height'] : ['height', 'width'];
      const mv = horiz ? n.w : n.h, cv = horiz ? n.h : n.w;
      if (main === 'FILL' || n.grow) { d.flex = '1 1 0'; d[horiz ? 'min-width' : 'min-height'] = '0'; } else { d.flex = 'none'; d[mp] = main === 'FIXED' ? `${mv}px` : 'auto'; }
      if (cross === 'FILL') d['align-self'] = 'stretch'; else d[cp] = cross === 'FIXED' ? `${cv}px` : 'auto';
      d.position = 'relative';
    } else { d.position = 'absolute'; d.left = `${r2(n.x - parent.x)}px`; d.top = `${r2(n.y - parent.y)}px`; d.width = `${n.w}px`; d.height = `${n.h}px`; }
    if (n.mm) { const [a, b, c, e] = n.mm; if (a) d['min-width'] = `${a}px`; if (b) d['max-width'] = `${b}px`; if (c) d['min-height'] = `${c}px`; if (e) d['max-height'] = `${e}px`; }
    // ---- own layout ----
    if (n.al) {
      d.display = 'flex'; d.direction = 'ltr'; d['flex-direction'] = n.al.m === 'HORIZONTAL' ? 'row' : 'column';
      if (n.al.m === 'GRID') gap(tag, 'grid-layout-as-flex');
      if (n.al.wr) { d['flex-wrap'] = 'wrap'; d['row-gap'] = token(v.counterAxisSpacing, n.al.cg || 0); }
      const [pt, pr, pb, pl] = n.al.p;
      d.padding = [token(v.paddingTop, pt), token(v.paddingRight, pr), token(v.paddingBottom, pb), token(v.paddingLeft, pl)].join(' ');
      d[n.al.wr ? 'column-gap' : 'gap'] = n.al.pa === 'SPACE_BETWEEN' ? '0px' : token(v.itemSpacing, n.al.g);
      d['justify-content'] = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', SPACE_BETWEEN: 'space-between' }[n.al.pa] || 'flex-start';
      d['align-items'] = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', BASELINE: 'baseline' }[n.al.ca] || 'flex-start';
    } else if (n.t !== 'TEXT') d.display = 'block';
    // ---- paint ----
    if (n.t === 'TEXT') {
      const c = color((n.f || []).find((p) => p.t === 'SOLID')); if (c) d.color = c;
      if ((n.f || []).some((p) => p.t !== 'SOLID')) gap(tag, 'text-non-solid-fill');
      if (Array.isArray(n.font)) { d['font-family'] = `'${n.font[0]}'`; const st = n.font[1].toLowerCase(); d['font-weight'] = token(v.fontWeight, WEIGHT[st.replace(/ ?italic/, '').trim()] || 400, ''); if (/italic/.test(st)) d['font-style'] = 'italic'; } else gap(tag, 'mixed-font');
      if (typeof n.fsz === 'number') d['font-size'] = token(v.fontSize, n.fsz); else gap(tag, 'mixed-font-size');
      d['line-height'] = Array.isArray(n.lh) ? (n.lh[1] === 'PERCENT' ? String(r2(n.lh[0] / 100)) : `${n.lh[0]}px`) : 'normal';
      if (Array.isArray(n.ls) && n.ls[0]) d['letter-spacing'] = `${n.ls[0]}px`;
      d['text-align'] = { LEFT: 'left', CENTER: 'center', RIGHT: 'right', JUSTIFIED: 'justify' }[n.ta[0]] || 'left';
      d['text-decoration'] = n.td === 'UNDERLINE' ? 'underline' : n.td === 'STRIKETHROUGH' ? 'line-through' : 'none';
      if (n.tc) d['text-transform'] = { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' }[n.tc] || 'none';
      d['white-space'] = n.tar === 'WIDTH_AND_HEIGHT' ? 'pre' : 'pre-wrap';
      d.direction = 'var(--igdsx-dir, inherit)'; d['unicode-bidi'] = 'plaintext';
      d.display = 'flex'; d['flex-direction'] = 'column'; d['justify-content'] = { TOP: 'flex-start', CENTER: 'center', BOTTOM: 'flex-end' }[n.ta[1]] || 'flex-start';
      if (n.tar === 'NONE' || n.tar === 'TRUNCATE') d.overflow = 'hidden';
    } else if (n.t !== 'INSTANCE' || true) {
      const bg = backgrounds(n); if (bg && !['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'REGULAR_POLYGON'].includes(n.t)) Object.assign(d, bg);
    }
    if (n.t === 'ELLIPSE') d['border-radius'] = '50%';
    else if (n.r !== undefined) { const rs = Array.isArray(n.r) ? n.r : [n.r, n.r, n.r, n.r]; d['border-radius'] = [token(v.topLeftRadius, rs[0]), token(v.topRightRadius, rs[1]), token(v.bottomRightRadius, rs[2]), token(v.bottomLeftRadius, rs[3])].join(' '); }
    const shadows = [];
    if (n.s && n.s.length && n.t !== 'TEXT' && !['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'REGULAR_POLYGON'].includes(n.t)) {
      const sp = n.s.find((p) => p.t === 'SOLID'); if (n.s.some((p) => p.t !== 'SOLID')) gap(tag, 'stroke-non-solid');
      if (sp) {
        const col = color(sp);
        if (Array.isArray(n.sw) && new Set(n.sw).size > 1) {
          const [t, rr, b, l] = n.sw; // per-side weights -> borders (inside: box-sizing border-box)
          if (n.sa !== 'INSIDE') gap(tag, 'per-side-stroke-not-inside');
          d['border-style'] = n.dash ? 'dashed' : 'solid'; d['border-color'] = col;
          d['border-width'] = [token(v.strokeTopWeight, t), token(v.strokeRightWeight, rr), token(v.strokeBottomWeight, b), token(v.strokeLeftWeight, l)].join(' ');
        } else {
          const w = Array.isArray(n.sw) ? n.sw[0] : n.sw; const ww = token(v.strokeTopWeight || v.strokeWeight, w);
          if (n.dash) { d.outline = `${ww} dashed ${col}`; d['outline-offset'] = n.sa === 'INSIDE' ? `calc(-1 * ${ww})` : n.sa === 'CENTER' ? `calc(-0.5 * ${ww})` : '0px'; }
          else if (n.t === 'LINE') { d.outline = `calc(${ww} / 2) solid ${col}`; d.height = '0px'; } // stroke centred on a 0-height line: drawn, takes no layout space (as in Figma)
          else shadows.push(n.sa === 'OUTSIDE' ? `0 0 0 ${ww} ${col}` : n.sa === 'CENTER' ? `inset 0 0 0 calc(${ww} / 2) ${col}, 0 0 0 calc(${ww} / 2) ${col}` : `inset 0 0 0 ${ww} ${col}`);
        }
      }
    }
    for (const e of n.fx || []) {
      if (e.t === 'DROP_SHADOW' || e.t === 'INNER_SHADOW') shadows.push(`${e.t === 'INNER_SHADOW' ? 'inset ' : ''}${e.o ? e.o[0] : 0}px ${e.o ? e.o[1] : 0}px ${e.rad}px ${e.sp || 0}px ${rgba(e.c || '#000000', e.a ?? 1)}`);
      else if (e.t === 'LAYER_BLUR') d.filter = `blur(${r2(e.rad / 2)}px)`;
      else if (e.t === 'BACKGROUND_BLUR') d['backdrop-filter'] = `blur(${r2(e.rad / 2)}px)`;
    }
    if (shadows.length) d['box-shadow'] = shadows.join(',');
    if (n.op !== undefined) d.opacity = String(n.op);
    if (n.clip) d.overflow = 'hidden';
    d['box-sizing'] = 'border-box'; d.margin = '0';
    return Object.entries(d).map(([k, x]) => `${k}:${x}`).join(';');
  }
  return { css, color };
}

// ---------- tree -> compact nodes ----------
function compile(s, M, tag) {
  const { css, color } = mk(s, tag);
  const styles = [], styleIx = new Map(), svgs = [], svgIx = new Map();
  const S = (c) => { let i = styleIx.get(c); if (i === undefined) { i = styles.length; styles.push(c); styleIx.set(c, i); } return i; };
  const V = (svg) => { let i = svgIx.get(svg); if (i === undefined) { i = svgs.length; svgs.push(svg); svgIx.set(svg, i); } return i; };
  const stripHash = (k) => (k ? k.split('#')[0] : k);
  const build = (n, parent, isRoot, ctr) => {
    const x = { i: ctr.i++ };
    if (n.ref && n.ref.visible) { x.vp = stripHash(n.ref.visible); const p = M.props.find((q) => q.name === x.vp); x.vd = n.hid ? false : true; if (!p) gap(tag, 'visibility-bound-to-unknown-property'); }
    if (n.ref && n.ref.mainComponent) x.sp = stripHash(n.ref.mainComponent);
    const style = S(css(n, parent, isRoot));
    if (n.t === 'TEXT') { x.tx = n.tx; if (n.ref && n.ref.characters) x.tp = stripHash(n.ref.characters); if (n.tar === 'WIDTH_AND_HEIGHT') x.hug = 1; return ['t', style, x]; }
    if (n.t === 'INSTANCE') {
      const sid = n.inst && n.inst.setId;
      if (sid && iconIds.has(sid)) {
        const svg = iconSvg(n.mcid || sid);
        if (svg) x.fs = V(svg.svg); else gap(tag, 'icon-svg-missing');
        // colour: the instance's own vector fill (override) when single; else the exported literal stays in the SVG
        const f = n.ifill && n.ifill.length === 1 && n.ifill[0].t === 'SOLID' ? n.ifill[0] : null;
        if (svg && svg.mono && !f) gap(tag, 'icon-colour-from-main-component');
        const col = f ? color(f) : svg && svg.mono ? svg.color : null;
        return ['icon', S(css({ ...n, f: undefined, s: undefined, fx: undefined }, parent, isRoot) + (col ? `;color:${col}` : '')), x];
      }
      // component definition not available (remote library set returned empty / not extracted): show the Figma
      // instance itself as exported SVG (exact appearance, static) and record it
      if (sid !== '81:1195' && !(models.get(sid) && models.get(sid).variants.length)) {
        const sv = n.nid && shapeSvg(n.nid);
        if (sv) { x.svg = V(sv.svg); gap(tag, 'instance-of-unavailable-component-shown-as-figma-svg'); return ['svg', S(css({ ...n, f: undefined, s: undefined, fx: undefined, al: undefined, sz: n.al ? [n.al.sh, n.al.sv] : n.sz }, parent, isRoot) + (sv.mono ? `;color:${sv.color}` : '')), x]; }
      }
      x.set = sid;
      const T = models.get(sid) && models.get(sid).variants.length ? models.get(sid) : null;
      const attrs = {};
      if (T && !SKIP.has(sid)) { // Button (81:1195) has its own component: handled below
        const vp = n.inst.variant ? Object.fromEntries(n.inst.variant.split(', ').map((kv) => kv.split('='))) : {};
        for (const p of T.props) {
          if (p.kind === 'variant' && vp[p.name] !== undefined && vp[p.name] !== p.default) attrs[p.attr] = p.slugs[p.options.indexOf(vp[p.name])];
          const cv = n.cp && (n.cp[p.name] !== undefined ? n.cp[p.name] : undefined);
          if (cv !== undefined && p.kind === 'text') attrs[p.attr] = String(cv);
          if (cv !== undefined && p.kind === 'boolean') attrs[p.attr] = cv ? 'true' : 'false';
          if (cv !== undefined && p.kind === 'swap') { const sv = typeof cv === 'string' && iconSvg(cv); if (sv) (x.kids ||= []).push({ slot: p.attr, svg: V(sv.svg) }); else gap(tag, 'nested-swap-to-non-icon'); }
        }
        if (T.rtl && vp[T.rtl.prop] !== undefined) attrs.dir = vp[T.rtl.prop] === T.rtl.on ? 'rtl' : 'ltr';
        if (T.state && vp[T.state.prop] !== undefined && vp[T.state.prop] !== T.state.default) attrs.state = T.state.slugs[T.state.options.indexOf(vp[T.state.prop])];
        // instance-level overrides of the nested root (padding, gap, fills, strokes, radius, opacity, effects): only the
        // declarations that differ from the main component's root, applied through the nested root's part (::part(n0))
        const tv0 = T.variants.find((q) => (n.inst.variant ? q.name === n.inst.variant : true));
        if (tv0) {
          const decl = (c) => Object.fromEntries(c.split(';').map((kv) => { const k = kv.indexOf(':'); return [kv.slice(0, k), kv.slice(k + 1)]; }));
          const KEYS = ['padding', 'gap', 'row-gap', 'column-gap', 'background-color', 'background', 'box-shadow', 'border-radius', 'opacity', 'border-style', 'border-color', 'border-width', 'outline', 'filter', 'backdrop-filter', 'justify-content', 'align-items', 'overflow'];
          const saved = JSON.stringify(gaps.get(tag) || {}); // comparison only: do not count gaps twice
          const a = decl(css({ ...n, x: 0, y: 0 }, null, true)), b = decl(css(tv0.tree, null, true));
          gaps.set(tag, JSON.parse(saved));
          const diff = KEYS.filter((k) => (a[k] || '') !== (b[k] || '')).map((k) => `${k}:${a[k] || (k.startsWith('background') ? 'transparent' : k === 'box-shadow' ? 'none' : k === 'opacity' ? '1' : 'initial')}!important`);
          if (diff.length) x.ov = diff.join(';');
        }
        // the instance resizes the nested root only on axes where it is FIXED/FILL; a HUG axis keeps the nested size
        const [ish, isv] = n.al ? [n.al.sh, n.al.sv] : n.sz || ['FIXED', 'FIXED'];
        const sized = [ish !== 'HUG' ? 'w' : '', isv !== 'HUG' ? 'h' : ''].filter(Boolean).join(' ');
        if (sized) attrs['data-sized'] = sized;
      } else if (sid === '81:1195') {
        const vp = Object.fromEntries((n.inst.variant || '').split(', ').map((kv) => kv.split('=')));
        Object.assign(attrs, { variant: slug(vp.Type || 'Primary'), size: slug(vp.Size || 'Small'), intent: slug(vp.Intent || 'Default'), dir: vp.RTL === 'False' ? 'ltr' : 'rtl' });
        if (vp['Icon Button'] === 'True') attrs['icon-only'] = ''; if (vp.State === 'Disabled') attrs.disabled = '';
        if (n.itx && n.itx[0]) attrs.label = n.itx[0];
        // icons shown by the Figma instance: swap value from the instance, else the Button definition default
        const bd = DEFS['81:1195'] || {}; const cpv = (k) => (n.cp && n.cp[k] !== undefined ? n.cp[k] : bd[k] ? bd[k].d : undefined);
        const put = (slotName, swapKey) => { const id = cpv(swapKey); const sv = typeof id === 'string' && iconSvg(id); if (sv) (x.kids ||= []).push({ slot: slotName, svg: V(sv.svg) }); else gap(tag, 'nested-button-icon-missing'); };
        if (vp['Icon Button'] === 'True') put('icon', 'Icon Op');
        else { if (cpv(' Left Icon') !== false && cpv('Left Icon') !== false) put('left-icon', 'Left Icon op.'); if (cpv('Right Icon') !== false) put('right-icon', 'Right Icon op.'); }
        if (vp.State && !['Default', 'Disabled'].includes(vp.State)) gap(tag, 'nested-button-interactive-state-shown-as-default');
        { // instance overrides of the Button root -> igdsx-button ::part(wrap) (the Figma Button root; Focused variants keep a ring wrapper -> not overridable)
          const bs = models.get('81:1195'); const bv = bs && bs.variants.find((q) => q.name === n.inst.variant);
          if (bv) {
            const ring = bv.tree.c && bv.tree.c.length === 1 && bv.tree.c[0].t === 'FRAME';
            const decl = (c) => Object.fromEntries(c.split(';').map((kv) => { const k = kv.indexOf(':'); return [kv.slice(0, k), kv.slice(k + 1)]; }));
            const saved = JSON.stringify(gaps.get(tag) || {});
            const A = decl(css({ ...n, x: 0, y: 0, sz: undefined, al: n.al ? { ...n.al, sh: 'FIXED', sv: 'FIXED' } : n.al }, null, true)), B = decl(css({ ...bv.tree, al: bv.tree.al ? { ...bv.tree.al, sh: 'FIXED', sv: 'FIXED' } : bv.tree.al }, null, true));
            gaps.set(tag, JSON.parse(saved));
            const KEYS = ['width', 'height', 'padding', 'gap', 'background-color', 'background', 'box-shadow', 'border-radius', 'opacity', 'justify-content', 'align-items'];
            const diff = KEYS.filter((k) => (A[k] || '') !== (B[k] || '')).map((k) => `${k}:${A[k] || (k.startsWith('background') ? 'transparent' : k === 'box-shadow' ? 'none' : 'initial')}!important`);
            if (diff.length) { if (ring) gap(tag, 'nested-button-override-on-focus-ring-variant'); else { x.ov = diff.join(';'); x.ovp = 'wrap'; const sz = diff.filter((d) => /^(width|height):/.test(d)); if (sz.length) x.ov2 = sz.join(';'); } } // .root carries the same fixed size as .wrap
          }
        }
      } else gap(tag, 'instance-of-unextracted-component');
      // text overrides inside the instance: Figma lists the instance's visible texts in document order (itx); map them
      // onto the nested component's text nodes in the same order (visibility from the instance's boolean properties)
      if (n.itx && T) {
        const tv = T.variants.find((q) => (n.inst.variant ? q.name === n.inst.variant : true));
        if (tv) {
          const boolOf = (name) => { const p = T.props.find((q) => q.name === name); if (!p) return null; const cv = n.cp && n.cp[name]; return cv !== undefined ? !!cv : !!p.default; };
          const list = [];
          const walkT = (m, pathPre, ctr, top) => {
            const idx = ctr.i++;
            let vis = !m.hid;
            if (top && m.ref && m.ref.visible) { const b = boolOf(stripHash(m.ref.visible)); if (b !== null) vis = b; }
            if (!vis) { skipCount(m, ctr); return; }
            if (m.t === 'TEXT') { list.push({ path: pathPre + idx, tx: m.tx }); return; }
            if (m.t === 'INSTANCE') { const T2 = models.get(m.inst && m.inst.setId); const v2 = T2 && T2.variants.find((q) => (m.inst.variant ? q.name === m.inst.variant : true)); if (v2) walkT(v2.tree, pathPre + idx + '/', { i: 0 }, false); return; }
            for (const ch of m.c || []) walkT(ch, pathPre, ctr, top);
          };
          const skipCount = (m, ctr) => { if (m.t !== 'INSTANCE' && m.t !== 'TEXT') for (const ch of m.c || []) { ctr.i++; skipCount(ch, ctr); } };
          walkT(tv.tree, '', { i: 0 }, true);
          if (list.length === n.itx.length) { const ov = {}; list.forEach((e, k) => { if (n.itx[k] !== e.tx) ov[e.path] = n.itx[k]; }); if (Object.keys(ov).length) attrs['data-tx'] = JSON.stringify(ov); }
          else gap(tag, 'nested-text-override-count-mismatch');
        }
      }
      x.attrs = attrs;
      return ['inst', S(css({ ...n, f: undefined, s: undefined, fx: undefined, al: undefined, sz: n.al ? [n.al.sh, n.al.sv] : n.sz }, parent, isRoot)), x];
    }
    if (['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'REGULAR_POLYGON'].includes(n.t)) {
      const svg = n.nid && shapeSvg(n.nid);
      if (svg) {
        x.svg = V(svg.svg);
        const p = (n.f || []).find((q) => q.t === 'SOLID') || (n.s || []).find((q) => q.t === 'SOLID');
        const col = svg.mono ? (p && p.c.toLowerCase() === svg.color ? color(p) : svg.color) : null;
        return ['svg', col ? S(styles[style] + `;color:${col}`) : style, x];
      }
      gap(tag, 'vector-svg-missing'); return ['div', style, x];
    }
    const kids = (n.c || []).map((c) => build(c, n, false, ctr));
    return ['div', style, x, kids];
  };
  const variants = []; const seen = new Set(); const dupes = [];
  for (const v of M.variants) {
    const vals = M.order.map((p) => v.props[p]);
    const key = vals.join('\u0001');
    if (seen.has(key)) dupes.push({ id: v.id, name: v.name });
    seen.add(key);
    const t = build(v.tree, null, true, { i: 0 }); // root keeps its own Figma size; nested instances resize it via [data-sized]
    variants.push({ id: v.id, name: v.name, p: vals, t });
  }
  return { styles, svgs, variants, dupes };
}

// ---------- write ----------
const outDir = path.join(KIT, 'src/gen'); const compDir = path.join(outDir, 'components');
fs.rmSync(compDir, { recursive: true, force: true }); fs.mkdirSync(compDir, { recursive: true });
const catalog = { schema: 'igdsx-gen-catalog/1', generator: 'pipeline/generate/gen-all.mjs', contract: 'src/gen/_runtime.js header', components: [] };
const BASE = ':host{display:inline-block;vertical-align:top;--igdsx-dir:ltr}:host(:dir(rtl)){--igdsx-dir:rtl}:host([hidden]){display:none}:host([data-sized~="w"])>div{width:100%!important}:host([data-sized~="h"])>div{height:100%!important}slot{display:contents}';
let nVariants = 0;
for (const s of specs) {
  if (SKIP.has(s.set.id) || (ONLY && !ONLY.has(s.set.id))) continue;
  const tag = tagOf.get(s.set.id), M = models.get(s.set.id);
  if (!M.variants.length) { catalog.components.push({ tag, figma: { id: s.set.id, name: s.set.name }, variants: 0, note: 'no variants in Figma data' }); continue; }
  const C = compile(s, M, tag);
  const data = { base: BASE, props: M.props, order: M.order, rtl: M.rtl, state: M.state, interactive: M.state && (M.state.hover || M.state.pressed || M.state.focus) ? { hover: !!M.state.hover, pressed: !!M.state.pressed, focus: !!M.state.focus } : null, styles: C.styles, svgs: C.svgs, variants: C.variants };
  fs.writeFileSync(path.join(compDir, `${tag}.js`), `// GENERATED by pipeline/generate/gen-all.mjs from spec/sets/${s.set.id.replace(/:/g, '-')}.json (Figma "${s.set.name.replace(/\*\//g, '')}"). Do not edit.\nimport { defineFigmaComponent } from '../_runtime.js';\ndefineFigmaComponent(${JSON.stringify(tag)}, ${JSON.stringify(s.set.id)}, ${JSON.stringify(data)});\n`);
  nVariants += C.variants.length;
  const row = kindById.get(s.set.id);
  catalog.components.push({ tag, figma: { id: s.set.id, name: s.set.name, kind: row ? row.kind : 'dependency', page: row ? row.page : null }, variants: C.variants.length,
    attributes: M.props.filter((p) => p.kind === 'variant').map((p) => ({ attr: p.attr, figma: p.name, values: p.slugs, default: p.slugs[p.options.indexOf(p.default)] })),
    text: M.props.filter((p) => p.kind === 'text').map((p) => ({ attr: p.attr, slot: p.attr, figma: p.name, default: p.default })),
    booleans: M.props.filter((p) => p.kind === 'boolean').map((p) => ({ attr: p.attr, figma: p.name, default: p.default ? 'true' : 'false' })),
    swapSlots: M.props.filter((p) => p.kind === 'swap').map((p) => ({ slot: p.attr, figma: p.name })),
    state: M.state ? { figma: M.state.prop, values: M.state.slugs, interactive: { hover: M.state.hover, pressed: M.state.pressed, focus: M.state.focus, disabled: M.state.disabled } } : null,
    direction: M.rtl ? `Figma "${M.rtl.prop}" follows dir (rtl/ltr)` : null,
    duplicateVariantNames: C.dupes, gaps: gaps.get(tag) || {} });
}
fs.writeFileSync(path.join(outDir, 'index.js'), `// GENERATED by pipeline/generate/gen-all.mjs\nimport { registerFigmaTag } from './_runtime.js';\n${[...SKIP].map(([id, t]) => `registerFigmaTag('${id}', '${t}'); // dedicated component`).join('\n')}\n${catalog.components.filter((c) => c.variants).map((c) => `import './components/${c.tag}.js';`).join('\n')}\n`);
fs.writeFileSync(path.join(outDir, 'catalog.json'), JSON.stringify(catalog, null, 1) + '\n');
const tokCss = `/* igdsx tokens for generated components: Figma variables with no equal CSS token in @igds/tokens; values from Figma modes "${MODES.light}" / "${MODES.dark}". GENERATED. */\n:root{${[...tokenDefs].sort().map(([n, t]) => `${n}:${t.light}`).join(';')}}\n:root[data-theme="dark"],.igds-dark-theme{${[...tokenDefs].sort().map(([n, t]) => `${n}:${t.dark}`).join(';')}}\n`;
fs.writeFileSync(path.join(KIT, 'src/tokens/igdsx-gen-tokens.css'), tokCss);
const gapTotals = {}; for (const g of gaps.values()) for (const [k, n] of Object.entries(g)) gapTotals[k] = (gapTotals[k] || 0) + n;
const size = fs.readdirSync(compDir).reduce((a, f) => a + fs.statSync(path.join(compDir, f)).size, 0);
console.log(JSON.stringify({ components: catalog.components.filter((c) => c.variants).length, variants: nVariants, igdsxTokens: tokenDefs.size, bytes: size, gapTotals }));

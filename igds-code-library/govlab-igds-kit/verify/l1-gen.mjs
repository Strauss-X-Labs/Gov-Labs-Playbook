#!/usr/bin/env node
// L1 for GENERATED components (generic, plan v3 §5.1): every Figma variant × theme (light / Dark IGDS) is rendered from
// the generated code and every Figma node is compared with its DOM element ([data-i] = same pre-order index the
// generator used): x, y, w, h relative to the variant root; background colour (single solid fill); text colour,
// font-size, font-weight, line-height. Expected dark values = bound Figma variable resolved in "Dark IGDS"; unbound
// values are mode-independent. Variants are selected the way a consumer would: attributes (+ state="..." for
// interactive states, dir for RTL).
// R-TEXT-CEIL (generic): Figma rounds a hugging text box UP to a whole px. Per variant the δ of every hugging text (and of
// every hugging nested instance, bounded by its number of hugging texts) is MEASURED; a node w may differ by the sum of δ inside it,
// its x (centred / end-aligned rows shift either way) by the sum of δ on its row. Nothing else beyond 0.5px.
// Usage: node verify/l1-gen.mjs [--only tag,tag] [--limit N]   Output: verify/out/gen-l1.json + ledger rows (level L1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium
import * as esbuild from 'esbuild';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(KIT, '..');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const args = process.argv.slice(2);
const ONLY = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;
const cat = rd(path.join(KIT, 'src/gen/catalog.json'));
const vk = rd(path.join(PROJ, 'igds-registry/knowledge/figma/variables.json'));
const vidx = new Map(); for (const col of vk.collections) for (const [n, , vals] of col.v) vidx.set(`${col.c}/${n}`, { modes: col.modes, vals });
const resolve = (name, mode, d = 0) => { const v = vidx.get(name.replace(/^\[remote\]/, '')); if (!v || d > 10) return null; let i = v.modes.indexOf(mode); if (i < 0) i = 0; const x = v.vals[i]; return typeof x === 'string' && x.startsWith('→') ? resolve(x.slice(1), mode, d + 1) : x; };
const THEMES = [{ id: 'light', mode: 'מותג ממשלתי ראשי' }, { id: 'dark', mode: 'Dark IGDS' }];
const expColor = (p, theme) => { if (!p) return null; const a = p.a !== undefined && p.a < 1 ? `@${p.a}` : ''; if (theme.id === 'light' || !p.v) return p.c.toLowerCase() + a; const r = resolve(p.v, theme.mode); return r ? String(r).toLowerCase().slice(0, 7) + a : 'unresolvable'; };
const WEIGHT = { thin: 100, extralight: 200, light: 300, regular: 400, normal: 400, medium: 500, semibold: 600, 'semi bold': 600, bold: 700, extrabold: 800, black: 900 };

// number of hugging texts a nested instance contributes (recursively through its own nested instances)
const specCache = new Map(); const specOf = (id) => { if (!specCache.has(id)) { const p = path.join(KIT, 'spec/sets', id.replace(/:/g, '-') + '.json'); specCache.set(id, fs.existsSync(p) ? rd(p) : null); } return specCache.get(id); };
function hugTexts(n, depth = 0) {
  if (depth > 8) return 0;
  if (n.t === 'TEXT') return n.tar === 'WIDTH_AND_HEIGHT' ? 1 : 0;
  if (n.t === 'INSTANCE') { const s = n.inst && specOf(n.inst.setId); if (!s) return 0; const v = s.variants.find((x) => n.inst.variant ? x.name === n.inst.variant : true); return v && v.tree ? hugTexts(v.tree, depth + 1) : 0; }
  return (n.c || []).reduce((a, c) => a + hugTexts(c, depth), 0);
}
// expected per node, same pre-order as gen-all.mjs build()
function expected(tree, theme) {
  const out = []; let i = 0;
  const walk = (n, hiddenAncestor) => {
    const idx = i++; const hidden = hiddenAncestor || !!n.hid;
    const e = { i: idx, t: n.t, x: n.x, y: n.y, w: n.w, h: n.h, hidden, hugText: n.t === 'TEXT' && n.tar === 'WIDTH_AND_HEIGHT' };
    if (n.t === 'INSTANCE' && ((n.al ? n.al.sh : (n.sz || [])[0]) === 'HUG')) { const k = hugTexts(n); if (k) { e.hugInst = true; e.hugN = k; } }
    const solid = (n.f || []).filter((p) => p.t === 'SOLID');
    if (n.t === 'TEXT') { e.color = solid.length === 1 ? expColor(solid[0], theme) : null; if (typeof n.fsz === 'number') e.fsz = n.fsz; if (Array.isArray(n.font)) e.fw = WEIGHT[n.font[1].toLowerCase().replace(/ ?italic/, '').trim()] || null; if (Array.isArray(n.lh) && typeof n.fsz === 'number') e.lh = n.lh[1] === 'PERCENT' ? n.fsz * n.lh[0] / 100 : n.lh[0]; }
    else if (['FRAME', 'COMPONENT', 'RECTANGLE', 'ELLIPSE'].includes(n.t) && (n.f || []).length === 1 && solid.length === 1) e.bg = expColor(solid[0], theme);
    out.push(e);
    if (n.t !== 'INSTANCE' && n.t !== 'TEXT') for (const c of n.c || []) walk(c, hidden);
  };
  walk(tree, false);
  return out;
}

// bundle the generated library (runtime + all components) for file:// pages
const outDir = path.join(KIT, 'verify/out'); fs.mkdirSync(outDir, { recursive: true });
const bundle = path.join(outDir, '_gen.bundle.js');
// same component set as the shipped package: generic components + the dedicated igdsx-button (nested Button instances)
await esbuild.build({ stdin: { contents: "import './gen/index.js'; import './ext/igdsx-button/igdsx-button.js';", resolveDir: path.join(KIT, 'src') }, bundle: true, format: 'iife', outfile: bundle, logLevel: 'error' });
const tokenCss = fs.readdirSync(path.join(KIT, 'src/tokens')).map((f) => pathToFileURL(path.join(KIT, 'src/tokens', f)).href);
const browser = await launchBrowser();
const results = [];
const comps = cat.components.filter((c) => c.variants && (!ONLY || ONLY.has(c.tag) || ONLY.has(c.figma.id)));
for (const theme of THEMES) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  const hp = path.join(outDir, `_gen-${theme.id}.html`);
  fs.writeFileSync(hp, `<!doctype html><html dir="rtl" lang="he" ${theme.id === 'dark' ? 'data-theme="dark"' : ''}><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/local.css'))}">
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/library-fonts.css'))}">
${tokenCss.map((h) => `<link rel="stylesheet" href="${h}">`).join('')}
<script src="${pathToFileURL(bundle)}"></script><style>body{margin:0;padding:20px}</style></head><body><div id="stage"></div></body></html>`);
  await page.goto(pathToFileURL(hp).href);
  await page.evaluate(async () => { for (const w of [300, 400, 500, 600, 700]) for (const s of [12, 14, 16, 18, 20, 24, 32]) await document.fonts.load(`${w} ${s}px Rubik`, 'אבג Abc'); await document.fonts.ready; });
  for (const c of comps) {
    const spec = rd(path.join(KIT, 'spec/sets', c.figma.id.replace(/:/g, '-') + '.json'));
    const byId = new Map(spec.variants.map((v) => [v.id, v]));
    const data = await page.evaluate((t) => { const C = customElements.get(t); return C ? { variants: C.data.variants.map((v) => ({ id: v.id, name: v.name, p: v.p })), order: C.data.order, props: C.data.props.map((p) => ({ name: p.name, kind: p.kind, attr: p.attr, options: p.options, slugs: p.slugs, default: p.default })), rtl: C.data.rtl, state: C.data.state } : null; }, c.tag);
    if (!data) { results.push({ tag: c.tag, setId: c.figma.id, theme: theme.id, status: 'fail', error: 'not registered' }); continue; }
    const jobs = data.variants.map((v) => {
      const props = Object.fromEntries(data.order.map((n, j) => [n, v.p[j]]));
      const attrs = {};
      for (const p of data.props) if (p.kind === 'variant' && props[p.name] !== undefined && props[p.name] !== p.default) attrs[p.attr] = p.slugs[p.options.indexOf(props[p.name])];
      if (data.state && props[data.state.prop] !== undefined) attrs.state = data.state.slugs[data.state.options.indexOf(props[data.state.prop])];
      const dir = data.rtl ? (props[data.rtl.prop] === data.rtl.on ? 'rtl' : 'ltr') : 'rtl';
      return { id: v.id, name: v.name, attrs, dir, exp: expected(byId.get(v.id).tree, theme) };
    });
    const res = await page.evaluate(async ({ tag, jobs }) => {
      const hex = (rgb) => { const m = /rgba?\(([^)]+)\)/.exec(rgb || ''); if (!m) return rgb; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); if (a === 0) return 'transparent'; return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('') + (a < 1 ? `@${Math.round(a * 100) / 100}` : ''); };
      const out = []; const st = document.getElementById('stage');
      for (const j of jobs) {
        st.innerHTML = ''; st.setAttribute('dir', j.dir);
        const el = document.createElement(tag); for (const [a, v] of Object.entries(j.attrs)) el.setAttribute(a, v); st.appendChild(el);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const sr = el.shadowRoot; const root = sr.querySelector('[data-i="0"]'); const o = root.getBoundingClientRect();
        const got = {}; const chk = [];
        for (const e of j.exp) {
          if (e.hidden) continue;
          const n = sr.querySelector(`[data-i="${e.i}"]`);
          if (!n) { chk.push({ i: e.i, p: 'present', ok: false }); continue; }
          const b = n.getBoundingClientRect(); const cs = getComputedStyle(n);
          if (cs.display === 'none') { chk.push({ i: e.i, p: 'visible', ok: false }); continue; }
          got[e.i] = { x: b.left - o.left, y: b.top - o.top, w: b.width, h: b.height };
          if (e.bg !== undefined) chk.push({ i: e.i, p: 'bg', e: e.bg, a: hex(cs.backgroundColor), ok: e.bg === 'unresolvable' ? null : hex(cs.backgroundColor) === e.bg });
          if (e.t === 'TEXT') {
            if (e.color) chk.push({ i: e.i, p: 'color', e: e.color, a: hex(cs.color), ok: e.color === 'unresolvable' ? null : hex(cs.color) === e.color });
            if (e.fsz) chk.push({ i: e.i, p: 'font-size', e: e.fsz, a: parseFloat(cs.fontSize), ok: Math.abs(parseFloat(cs.fontSize) - e.fsz) <= 0.5 });
            if (e.fw) chk.push({ i: e.i, p: 'font-weight', e: e.fw, a: Number(cs.fontWeight), ok: Number(cs.fontWeight) === e.fw });
            if (e.lh) chk.push({ i: e.i, p: 'line-height', e: e.lh, a: parseFloat(cs.lineHeight), ok: Math.abs(parseFloat(cs.lineHeight) - e.lh) <= 0.5 });
          }
        }
        // R-TEXT-CEIL: measured δ of hugging texts
        const deltas = j.exp.filter((e) => (e.hugText || e.hugInst) && got[e.i]).map((e) => ({ e, d: e.w - got[e.i].w, max: e.hugN || 1 }));
        const bad = deltas.filter((x) => x.d < -0.5 || x.d >= x.max);
        const ok = (e, k) => {
          const a = got[e.i][k], ex = e[k], diff = ex - a;
          if (Math.abs(diff) <= 0.5) return true;
          if (k === 'w' && (e.hugInst || e.hugText)) { const own = deltas.find((x) => x.e === e); if (own && own.d >= -0.5 && own.d < own.max) return true; }
          if (k === 'w') { const inside = deltas.filter((x) => x.e !== e && x.e.x >= e.x - 0.5 && x.e.x + x.e.w <= e.x + e.w + 0.5 && x.d >= 0 && x.d < x.max).reduce((s, x) => s + x.d, 0); return diff >= -0.5 && diff <= inside + 0.5; }
          if (k === 'x') { const row = deltas.filter((x) => x.e !== e && x.e.y < e.y + e.h && x.e.y + x.e.h > e.y && !(x.e.x >= e.x - 0.5 && x.e.x + x.e.w <= e.x + e.w + 0.5) && x.d >= 0 && x.d < x.max).reduce((s, x) => s + x.d, 0); return Math.abs(diff) <= row + 0.5; }
          return false;
        };
        for (const e of j.exp) if (got[e.i]) for (const k of ['x', 'y', 'w', 'h']) chk.push({ i: e.i, p: k, e: e[k], a: Math.round(got[e.i][k] * 100) / 100, ok: ok(e, k) });
        for (const x of bad) chk.push({ i: x.e.i, p: 'text-ceil-delta', e: '[0,1)', a: x.d, ok: false });
        const failed = chk.filter((c) => c.ok === false);
        out.push({ id: j.id, name: j.name, checks: chk.length, failed: failed.slice(0, 12), nFailed: failed.length, unknown: chk.filter((c) => c.ok === null).length });
      }
      return out;
    }, { tag: c.tag, jobs });
    for (const r of res) results.push({ tag: c.tag, setId: c.figma.id, set: c.figma.name, theme: theme.id, variantId: r.id, variant: r.name, status: r.nFailed ? 'fail' : r.unknown ? 'partial' : 'pass', checks: r.checks, nFailed: r.nFailed, failed: r.failed });
    process.stdout.write(`${theme.id} ${c.tag}: ${res.filter((r) => !r.nFailed).length}/${res.length}\n`);
  }
  await page.close(); fs.rmSync(hp, { force: true });
}
await browser.close();
const tally = {}; for (const r of results) tally[r.status] = (tally[r.status] || 0) + 1;
const byProp = {}; for (const r of results) for (const f of r.failed || []) byProp[f.p] = (byProp[f.p] || 0) + 1;
fs.writeFileSync(path.join(outDir, ONLY ? 'gen-l1.partial.json' : 'gen-l1.json'), JSON.stringify({ generatedAt: new Date().toISOString(), tally, byProp, results }, null, 1) + '\n');
if (!ONLY) {
  const lp = path.join(KIT, 'verify/ledger.json'); const ledger = rd(lp);
  const tags = new Set(results.map((r) => r.tag));
  ledger.rows = ledger.rows.filter((r) => !(tags.has(r.tag) && r.level === 'L1'));
  for (const r of results) ledger.rows.push({ setId: r.setId, set: r.set, tag: r.tag, variant: r.variant, variantId: r.variantId, theme: r.theme, level: 'L1', status: r.status, checks: r.checks, failed: (r.failed || []).map((f) => `n${f.i}.${f.p}`), evidence: 'verify/out/gen-l1.json' });
  fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
}
console.log(JSON.stringify({ tally, byProp }));

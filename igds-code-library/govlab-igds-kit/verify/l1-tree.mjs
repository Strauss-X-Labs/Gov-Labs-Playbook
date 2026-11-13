#!/usr/bin/env node
// Level-1 verification of a GENERATED component against its full-tree Figma spec (plan v3 §5.1).
// For every variant × theme: render the component in Edge, force the Figma state through CDP, and compare every Figma
// node of the variant (frame, focus ring, icons, text frame, text) with the rendered part: x, y, w, h (relative to the
// Figma frame origin), background, stroke (colour + width), corner radius, opacity, text colour/size/weight/line-height/
// decoration. Expected dark values = the bound Figma variable resolved in "Dark IGDS"; unbound values are mode-independent.
// Usage: node verify/l1-tree.mjs <setId> <tag> [--mutate]     Output: verify/out/<setId>.<tag>.l1.json + ledger rows
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium
import * as esbuild from 'esbuild';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(KIT, '..');
const REG = path.join(PROJ, 'igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const [setId, TAG] = process.argv.slice(2);
const MUTATE = process.argv.includes('--mutate');
const sid = setId.replace(/:/g, '-');
const spec = rd(path.join(KIT, 'spec/sets', sid + '.json'));
const contract = rd(path.join(KIT, 'src/ext', TAG, 'contract.json'));
const TOL = 0.5;

const vk = rd(path.join(REG, 'knowledge/figma/variables.json'));
const vidx = new Map(); for (const col of vk.collections) for (const [n, , vals] of col.v) vidx.set(`${col.c}/${n}`, { modes: col.modes, vals });
const resolve = (name, mode, d = 0) => { const v = vidx.get(name); if (!v || d > 10) return null; let i = v.modes.indexOf(mode); if (i < 0) i = 0; const x = v.vals[i]; return typeof x === 'string' && x.startsWith('→') ? resolve(x.slice(1), mode, d + 1) : x; };
const THEMES = [{ id: 'light', mode: 'מותג ממשלתי ראשי', attr: '' }, { id: 'dark', mode: 'Dark IGDS', attr: 'data-theme="dark"' }];
const expColor = (paint, theme) => {
  if (!paint) return 'transparent';
  const alpha = paint.a !== undefined && paint.a < 1 ? `@${paint.a}` : '';
  if (theme.id === 'light' || !paint.v) return paint.c.toLowerCase() + alpha;
  const r = resolve(paint.v.replace(/^\[remote\]/, ''), theme.mode);
  return r ? String(r).toLowerCase() + alpha : null; // null = not checkable (variable not resolvable)
};
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const decisionById = new Map((contract.decisions || []).map((d) => [d.variantId, d]));

function parts(tree) {
  const ring = tree.c && tree.c.length === 1 && tree.c[0].t === 'FRAME';
  const wrap = ring ? tree.c[0] : tree; const kids = wrap.c || [];
  const tf = kids.find((k) => k.t === 'FRAME');
  const map = { root: tree, wrap: ring ? wrap : null };
  if (!tf) { map.i0 = kids[0]; } else { if (kids[0]?.t === 'INSTANCE') map.i0 = kids[0]; map.tf = tf; map.t = tf.c?.find((x) => x.t === 'TEXT'); if (kids[2]?.t === 'INSTANCE') map.i2 = kids[2]; }
  return { ring, iconOnly: !tf, map };
}

// bundle the component (lit included) for the browser
const outDir = path.join(KIT, 'verify/out'); fs.mkdirSync(outDir, { recursive: true });
const bundle = path.join(outDir, `_${TAG}.bundle.js`);
await esbuild.build({ entryPoints: [path.join(KIT, 'src/ext', TAG, `${TAG}.js`)], bundle: true, format: 'iife', outfile: bundle, logLevel: 'error' });
const tokenCss = fs.readdirSync(path.join(KIT, 'src/tokens')).map((f) => pathToFileURL(path.join(KIT, 'src/tokens', f)).href);
const mutateCss = MUTATE ? '<style>igdsx-button{--igds-ref-space-550:21px;--igds-base-color-button-background-primary:#0068f6;--igds-ref-font-size-s:17px}</style>' : '';

const browser = await launchBrowser();
const results = [];
for (const theme of THEMES) {
  const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 900, height: 300 } });
  const hp = path.join(outDir, `_tree-${theme.id}.html`);
  fs.writeFileSync(hp, `<!doctype html><html dir="rtl" lang="he" ${theme.attr}><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/local.css'))}">
${tokenCss.map((h) => `<link rel="stylesheet" href="${h}">`).join('')}${mutateCss}
<script src="${pathToFileURL(bundle)}"></script><style>body{margin:0;padding:40px}</style></head><body><div id="stage"></div></body></html>`);
  await page.goto(pathToFileURL(hp).href);
  await page.waitForFunction((t) => !!customElements.get(t), TAG);
  // fonts load lazily on first use: load every Rubik weight/size used by Figma before the first measurement
  await page.evaluate(async () => { for (const w of [300, 400, 500, 600, 700]) for (const s of [16, 20]) await document.fonts.load(`${w} ${s}px Rubik`, 'אבג Button'); await document.fonts.ready; });
  const webFonts = await page.evaluate(() => [...document.fonts].filter((f) => /Rubik/.test(f.family) && f.status === 'loaded').length);
  if (!webFonts) throw new Error('official Rubik FontFace (@igds/tokens library-fonts.css) not loaded - refusing to measure with a system font');
  const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  for (const v of spec.variants) {
    const p = { ...v.props }; const dec = decisionById.get(v.id); if (dec) p.Intent = 'Danger';
    const key = { setId, tag: TAG, variant: v.name + (dec ? ' [treated as Intent=Danger, R-DUP-SYMMETRY]' : ''), variantId: v.id, theme: theme.id };
    const P = parts(v.tree);
    const attrs = { variant: slug(p.Type), size: slug(p.Size), intent: slug(p.Intent) };
    if (p['Icon Button'] === 'True') attrs['icon-only'] = ''; if (p.State === 'Disabled') attrs.disabled = '';
    // same string as Figma; runs of spaces kept (HTML would collapse them) by turning extra spaces into NBSP
    const text = (P.map.t?.tx ?? '').replace(/ {2,}/g, (s) => ' ' + ' '.repeat(s.length - 1));
    await page.evaluate(({ tag, attrs, dir, text, icons }) => {
      const st = document.getElementById('stage'); st.innerHTML = ''; st.setAttribute('dir', dir);
      const el = document.createElement(tag); for (const [a, x] of Object.entries(attrs)) el.setAttribute(a, x);
      const ic = (slot) => { const s = document.createElement('span'); s.slot = slot; s.style.cssText = 'display:block;width:24px;height:24px'; return s; };
      if (icons.iconOnly) el.appendChild(ic('icon')); else { if (icons.i0) el.appendChild(ic('left-icon')); el.appendChild(document.createTextNode(text)); if (icons.i2) el.appendChild(ic('right-icon')); }
      st.appendChild(el);
    }, { tag: TAG, attrs, dir: p.RTL === 'True' ? 'rtl' : 'ltr', text, icons: { iconOnly: P.iconOnly, i0: !!P.map.i0, i2: !!P.map.i2 } });
    await page.evaluate(async (t) => { const el = document.querySelector(t); await el.updateComplete; await new Promise((r) => requestAnimationFrame(() => r())); }, TAG);
    const force = { Hover: ['hover'], Pressed: ['hover', 'active'], Focused: ['focus-visible'] }[p.State] || [];
    const forced = [];
    if (force.length) {
      await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
      for (const expr of [`document.querySelector('${TAG}')`, `document.querySelector('${TAG}').shadowRoot.querySelector('.root')`]) {
        const { result } = await cdp.send('Runtime.evaluate', { expression: expr }); const { nodeId } = await cdp.send('DOM.requestNode', { objectId: result.objectId });
        await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: force }); forced.push(nodeId);
      }
    }
    const m = await page.evaluate((t) => {
      const el = document.querySelector(t), sr = el.shadowRoot, root = sr.querySelector('.root');
      sr.getAnimations?.({ subtree: true })?.forEach((a) => a.finish());
      const o = root.getBoundingClientRect();
      const box = (sel) => { const n = sr.querySelector(sel); if (!n || n.hidden) return null; const b = n.getBoundingClientRect(); const cs = getComputedStyle(n); return { x: b.left - o.left, y: b.top - o.top, w: b.width, h: b.height, bg: cs.backgroundColor, shadow: cs.boxShadow, radius: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(parseFloat), opacity: cs.opacity, color: cs.color, fontSize: parseFloat(cs.fontSize), fontWeight: Number(cs.fontWeight), lineHeight: cs.lineHeight, deco: cs.textDecorationLine, family: cs.fontFamily }; };
      return { root: box('.root'), wrap: box('.wrap'), i0: box('.i0'), tf: box('.tf'), t: box('.t'), i2: box('.i2') };
    }, TAG);
    for (const n of forced) await cdp.send('CSS.forcePseudoState', { nodeId: n, forcedPseudoClasses: [] });
    // compare
    const hex = (rgb) => { const mm = /rgba?\(([^)]+)\)/.exec(rgb || ''); if (!mm) return rgb; const [r, g, b, a = 1] = mm[1].split(/[ ,/]+/).filter(Boolean).map(Number); if (a === 0) return 'transparent'; return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('') + (a < 1 ? `@${Math.round(a * 100) / 100}` : ''); };
    const shadowOf = (s) => { if (!s || s === 'none') return null; const mm = /(rgba?\([^)]+\))\s+0px\s+0px\s+0px\s+([\d.]+)px\s*(inset)?/.exec(s); return mm ? { color: hex(mm[1]), w: Number(mm[2]), inset: !!mm[3] } : { raw: s }; };
    const checks = [];
    const add = (part, prop, exp, act, ok) => checks.push({ part, prop, expected: exp, actual: act, ok });
    const domFor = { root: P.ring ? 'root' : 'wrap', wrap: 'wrap', i0: 'i0', tf: 'tf', t: 't', i2: 'i2' };
    for (const [role, fn] of Object.entries(P.map)) {
      if (!fn) continue; const a = m[domFor[role]];
      if (!a) { add(role, 'present', true, false, false); continue; }
      for (const k of ['x', 'y', 'w', 'h']) add(role, k, fn[k], Math.round(a[k] * 100) / 100, Math.abs(a[k] - fn[k]) <= TOL);
      if (fn.t === 'TEXT') {
        const ec = expColor(fn.f?.[0], theme); add(role, 'color', ec, hex(a.color), ec === null ? null : hex(a.color) === ec);
        add(role, 'font-size', fn.fsz, a.fontSize, Math.abs(a.fontSize - fn.fsz) <= TOL);
        const wt = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, Light: 300 }[fn.font[1]]; add(role, 'font-weight', wt, a.fontWeight, wt === a.fontWeight);
        add(role, 'font-family', fn.font[0], a.family.split(',')[0].replace(/['"]/g, ''), a.family.replace(/['"]/g, '').startsWith(fn.font[0]));
        if (Array.isArray(fn.lh) && fn.lh[1] === 'PERCENT') add(role, 'line-height', fn.fsz * fn.lh[0] / 100, parseFloat(a.lineHeight), Math.abs(parseFloat(a.lineHeight) - fn.fsz * fn.lh[0] / 100) <= TOL);
        add(role, 'text-decoration', fn.td === 'UNDERLINE' ? 'underline' : 'none', a.deco, (fn.td === 'UNDERLINE' ? 'underline' : 'none') === a.deco);
      } else if (fn.t !== 'INSTANCE') {
        const ebg = expColor(fn.f?.[0], theme); add(role, 'background', ebg, hex(a.bg), ebg === null ? null : hex(a.bg) === ebg);
        const er = fn.r === undefined ? [0, 0, 0, 0] : Array.isArray(fn.r) ? fn.r : [fn.r, fn.r, fn.r, fn.r];
        add(role, 'radius', er, a.radius, er.every((r, i) => Math.abs(r - a.radius[i]) <= TOL));
        const es = fn.s?.[0] ? { color: expColor(fn.s[0], theme), w: typeof fn.sw === 'number' ? fn.sw : fn.sw[0] } : null; const as = shadowOf(a.shadow);
        add(role, 'stroke', es, as, es ? (es.color === null ? null : !!as && as.color === es.color && Math.abs(as.w - es.w) <= TOL && as.inset === (fn.sa !== 'OUTSIDE')) : !as);
        add(role, 'opacity', fn.op ?? 1, Number(a.opacity), Math.abs(Number(a.opacity) - (fn.op ?? 1)) < 0.01);
      }
    }
    // R-TEXT-CEIL: Figma reports a hugging text box width rounded UP to a whole pixel; the browser keeps the fraction.
    // Accept 0 <= figma - code < 1 on the text width (δ), and the same δ (±TOL) on geometry that depends on it:
    // widths of hugging ancestors and x of nodes laid out after the text (physical left-to-right order).
    const tw = checks.find((c) => c.part === 't' && c.prop === 'w');
    if (tw) {
      const delta = tw.expected - tw.actual;
      if (delta >= 0 && delta < 1) {
        tw.ok = true; tw.rule = 'R-TEXT-CEIL';
        const after = new Set(['i2']);
        for (const c of checks) if (c.ok === false && ((c.prop === 'w' && ['tf', 'wrap', 'root'].includes(c.part)) || (c.prop === 'x' && after.has(c.part))) && Math.abs(c.expected - c.actual - delta) <= TOL) { c.ok = true; c.rule = 'R-TEXT-CEIL'; }
      }
    }
    const failed = checks.filter((c) => c.ok === false), unknown = checks.filter((c) => c.ok === null);
    results.push({ ...key, status: failed.length ? 'fail' : unknown.length ? 'partial' : 'pass', checks: checks.length, failed, unknown: unknown.map((u) => `${u.part}.${u.prop}`) });
  }
  await page.close();
}
await browser.close();
const tally = {}; for (const r of results) tally[r.status] = (tally[r.status] || 0) + 1;
fs.writeFileSync(path.join(outDir, `${sid}.${TAG}${MUTATE ? '.mutate' : ''}.l1.json`), JSON.stringify({ setId, tag: TAG, mutate: MUTATE, generatedAt: new Date().toISOString(), tolerancePx: TOL, tally, results }, null, 1) + '\n');
for (const f of fs.readdirSync(outDir)) if (f.startsWith('_tree-')) fs.unlinkSync(path.join(outDir, f));
if (!MUTATE) {
  const lp = path.join(KIT, 'verify/ledger.json'); const ledger = fs.existsSync(lp) ? rd(lp) : { schema: 'igdsx-ledger/1', rows: [] };
  ledger.rows = ledger.rows.filter((r) => !(r.setId === setId && r.tag === TAG && r.level === 'L1'));
  for (const r of results) ledger.rows.push({ setId, set: spec.set.name, tag: TAG, variant: r.variant, variantId: r.variantId, theme: r.theme, level: 'L1', status: r.status, checks: r.checks, failed: r.failed.map((f) => `${f.part}.${f.prop}`), evidence: `verify/out/${sid}.${TAG}.l1.json` });
  ledger.rows.sort((a, b) => (a.setId + (a.tag || '') + a.variant + a.theme).localeCompare(b.setId + (b.tag || '') + b.variant + b.theme));
  fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
}
const byProp = {}; for (const r of results) for (const f of r.failed) byProp[`${f.part}.${f.prop}`] = (byProp[`${f.part}.${f.prop}`] || 0) + 1;
console.log(`${spec.set.name} -> ${TAG}${MUTATE ? ' [MUTATION TEST]' : ''}: ${JSON.stringify(tally)}  checks/row≈${Math.round(results.reduce((s, r) => s + r.checks, 0) / results.length)}`);
console.log('failed by part.prop:', JSON.stringify(byProp));

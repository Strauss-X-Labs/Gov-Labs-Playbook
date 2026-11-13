#!/usr/bin/env node
// Level-2 verification (plan v3 §5.1): pixel comparison of every variant of a GENERATED component against Figma's own
// rendering of that variant. Reference = Figma REST /v1/images (PNG, scale 2, use_absolute_bounds = exact node box),
// cached under spec/ref-png/<setId>/. Candidate = the SHIPPED package (dist/igds-kit.css + dist/igds-kit.js) rendered in
// Edge at deviceScaleFactor 2, Figma state forced through CDP, icons as consumers write them (<igds-icon name=...>).
// Theme: light only — Figma renders a node in the mode it has in the file; dark is covered by L1 (resolved variables).
// Metric: pixelmatch (threshold 0.1, anti-aliased pixels excluded) -> share of differing pixels, split by region
// (icon boxes / text box / rest). Threshold for "pass" is calibrated, not guessed: see --calibrate (a 1px shift and a
// colour change on the same variants must exceed it).
// Usage: node verify/l2-pixel.mjs <setId> <tag> [--calibrate]     (FIGMA_TOKEN in env for the first run; then cache)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { get, FILE_KEY, sha } from '../pipeline/figma-rest/client.mjs';
import { compareRegions, PASS } from './lib/pixel-metric.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const [setId, TAG] = process.argv.slice(2);
const CAL = process.argv.includes('--calibrate');
const sid = setId.replace(/:/g, '-');
const spec = rd(path.join(KIT, 'spec/sets', sid + '.json'));
const contract = rd(path.join(KIT, 'src/ext', TAG, 'contract.json'));
const SCALE = 2;
const PASS_MAX = 0.005; // max share of differing (non-AA) pixels; justified by --calibrate output (verify/out/<sid>.<tag>.l2-calibration.json)

// ---- references from Figma ----
const refDir = path.join(KIT, 'spec/ref-png', sid); fs.mkdirSync(refDir, { recursive: true });
const refPath = (id) => path.join(refDir, id.replace(/:/g, '-') + `@${SCALE}x.png`);
const missing = spec.variants.filter((v) => !fs.existsSync(refPath(v.id))).map((v) => v.id);
for (let i = 0; i < missing.length; i += 40) {
  const ids = missing.slice(i, i + 40);
  const j = JSON.parse((await get(`/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids.join(','))}&format=png&scale=${SCALE}&use_absolute_bounds=true`)).toString('utf8'));
  if (j.err) throw new Error('images: ' + j.err);
  for (const id of ids) {
    const url = j.images[id]; if (!url) throw new Error('no image for ' + id);
    if (!/^https:\/\/[a-z0-9.-]+\.(amazonaws\.com|figma\.com)\//.test(url)) throw new Error('unexpected image host for ' + id);
    const r = await fetch(url); if (!r.ok) throw new Error(`image ${id}: HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(refPath(id), buf);
    fs.writeFileSync(refPath(id) + '.meta.json', JSON.stringify({ nodeId: id, scale: SCALE, use_absolute_bounds: true, fetchedAt: new Date().toISOString(), sha256: sha(buf) }));
  }
  process.stdout.write(`fetched ${Math.min(i + 40, missing.length)}/${missing.length} reference PNGs\n`);
}

// ---- render candidates from dist ----
const DIST = path.join(KIT, 'dist');
const outDir = path.join(KIT, 'verify/out'); const diffDir = path.join(outDir, `l2-${sid}-${TAG}`); fs.rmSync(diffDir, { recursive: true, force: true }); fs.mkdirSync(diffDir, { recursive: true });
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const decisionById = new Map((contract.decisions || []).map((d) => [d.variantId, d]));
const officialIcons = new Set(fs.readdirSync(path.join(KIT, '..', 'node_modules/@igds/icons/lib')).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => f.slice(0, -3)));
function parts(tree) {
  const ring = tree.c && tree.c.length === 1 && tree.c[0].t === 'FRAME';
  const wrap = ring ? tree.c[0] : tree; const kids = wrap.c || [];
  const tf = kids.find((k) => k.t === 'FRAME');
  const map = {};
  if (!tf) map.i0 = kids[0]; else { if (kids[0]?.t === 'INSTANCE') map.i0 = kids[0]; map.tf = tf; map.t = tf.c?.find((x) => x.t === 'TEXT'); if (kids[2]?.t === 'INSTANCE') map.i2 = kids[2]; }
  return { iconOnly: !tf, map };
}
const hp = path.join(outDir, '_l2.html');
fs.writeFileSync(hp, `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(DIST, 'igds-kit.css'))}"><script src="${pathToFileURL(path.join(DIST, 'igds-kit.js'))}" defer></script>
<style>html,body{background:transparent!important;margin:0}#stage{position:absolute;left:40px;top:40px}</style><style id="mut"></style></head><body><div id="stage"></div></body></html>`);
const browser = await launchBrowser();
const page = await browser.newPage({ deviceScaleFactor: SCALE, viewport: { width: 900, height: 300 } });
await page.goto(pathToFileURL(hp).href);
await page.waitForFunction((t) => !!customElements.get(t) && !!customElements.get('igds-icon') && !!window.IGDSIcons, TAG);
await page.evaluate(async () => { for (const w of [300, 400, 500, 600, 700]) for (const s of [16, 20]) await document.fonts.load(`${w} ${s}px Rubik`, 'אבג Button'); await document.fonts.ready; });
if (!(await page.evaluate(() => [...document.fonts].some((f) => /Rubik/.test(f.family) && f.status === 'loaded')))) throw new Error('package Rubik not loaded');
const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');

async function shoot(v, mutation) {
  const p = { ...v.props }; if (decisionById.get(v.id)) p.Intent = 'Danger';
  const P = parts(v.tree);
  const attrs = { variant: slug(p.Type), size: slug(p.Size), intent: slug(p.Intent) };
  if (p['Icon Button'] === 'True') attrs['icon-only'] = ''; if (p.State === 'Disabled') attrs.disabled = '';
  const text = (P.map.t?.tx ?? '').replace(/ {2,}/g, (s) => ' ' + '\u00a0'.repeat(s.length - 1));
  const iconName = (n) => (n && n.inst && officialIcons.has(n.inst.set) ? n.inst.set : null);
  const icons = { iconOnly: P.iconOnly, i0: P.map.i0 ? iconName(P.map.i0) || '?' : null, i2: P.map.i2 ? iconName(P.map.i2) || '?' : null };
  await page.evaluate(({ tag, attrs, dir, text, icons, mutation }) => {
    document.getElementById('mut').textContent = mutation || '';
    const st = document.getElementById('stage'); st.innerHTML = ''; st.setAttribute('dir', dir);
    const el = document.createElement(tag); for (const [a, x] of Object.entries(attrs)) el.setAttribute(a, x);
    const camel = (x) => x.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    const ic = (slot, name) => { const s = document.createElement('igds-icon'); s.node = window.IGDSIcons[camel(name)]; s.slot = slot; return s; };
    if (icons.iconOnly) el.appendChild(ic('icon', icons.i0)); else { if (icons.i0) el.appendChild(ic('left-icon', icons.i0)); el.appendChild(document.createTextNode(text)); if (icons.i2) el.appendChild(ic('right-icon', icons.i2)); }
    st.appendChild(el);
  }, { tag: TAG, attrs, dir: p.RTL === 'True' ? 'rtl' : 'ltr', text, icons, mutation });
  await page.evaluate(async (t) => { const el = document.querySelector(t); await el.updateComplete; for (const i of el.querySelectorAll('igds-icon')) await i.updateComplete; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, TAG);
  // forced states mirror a real browser: hover/active hold on host and inner button; keyboard focus = host :focus, inner button :focus + :focus-visible (verified with a real Tab press)
  const force = { Hover: [['hover'], ['hover']], Pressed: [['hover', 'active'], ['hover', 'active']], Focused: [['focus'], ['focus', 'focus-visible']] }[p.State] || null;
  const forced = [];
  if (force) {
    await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
    for (const [ix, expr] of [`document.querySelector('${TAG}')`, `document.querySelector('${TAG}').shadowRoot.querySelector('.root')`].entries()) {
      const { result } = await cdp.send('Runtime.evaluate', { expression: expr }); const { nodeId } = await cdp.send('DOM.requestNode', { objectId: result.objectId });
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: force[ix] }); forced.push(nodeId);
    }
  }
  const box = await page.evaluate((t) => {
    const sr = document.querySelector(t).shadowRoot; sr.getAnimations?.({ subtree: true })?.forEach((a) => a.finish());
    document.getAnimations().forEach((a) => a.finish());
    const r = (sel) => { const n = sr.querySelector(sel); if (!n || n.hidden) return null; const b = n.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
    const tc = getComputedStyle(sr.querySelector('.t') || sr.querySelector('.root'));
    return { root: r('.root'), i0: r('.i0'), i2: r('.i2'), t: r('.t'), font: [tc.fontFamily, tc.fontSize, tc.fontWeight, tc.letterSpacing, tc.textDecorationLine].join(' ') };
  }, TAG);
  const buf = await page.screenshot({ clip: { x: box.root.x, y: box.root.y, width: box.root.w, height: box.root.h }, omitBackground: true, animations: 'disabled', caret: 'hide' });
  for (const n of forced) await cdp.send('CSS.forcePseudoState', { nodeId: n, forcedPseudoClasses: [] });
  return { png: PNG.sync.read(buf), box, icons };
}

function compare(v, shot, write) {
  const ref = PNG.sync.read(fs.readFileSync(refPath(v.id)));
  let rule = null;
  // R-TEXT-CEIL (same rule as L1): Figma rounds a hugging text box UP to a whole px, so the Figma frame can be wider by
  // δ in (0, 1] CSS px, all of it inside the text box. Insert that δ at the text box centre (columns copied from the
  // centre column) so the remaining pixels can be compared. Only width, only ≤ 1 CSS px, only when there is text.
  const dw = ref.width - shot.png.width;
  if (ref.height === shot.png.height && dw > 0 && dw <= SCALE && shot.box.t) {
    const o = shot.box.root, cut = Math.round((shot.box.t.x - o.x + shot.box.t.w / 2) * SCALE);
    const src = shot.png, out = new PNG({ width: ref.width, height: ref.height });
    for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) { const sx = x < cut ? x : x < cut + dw ? cut : x - dw; src.data.copy(out.data, (y * out.width + x) * 4, (y * src.width + sx) * 4, (y * src.width + sx) * 4 + 4); }
    shot = { ...shot, png: out }; rule = `R-TEXT-CEIL(+${dw / SCALE}px)`;
  }
  if (ref.width !== shot.png.width || ref.height !== shot.png.height) return { size: { figma: [ref.width, ref.height], code: [shot.png.width, shot.png.height] }, ratio: 1, regions: null };
  const { width: W, height: H } = ref; const diff = new PNG({ width: W, height: H });
  const n = pixelmatch(ref.data, shot.png.data, diff.data, W, H, { threshold: 0.1, includeAA: false, alpha: 0.2 });
  const o = shot.box.root; const inBox = (b, x, y) => b && x >= (b.x - o.x) * SCALE && x < (b.x - o.x + b.w) * SCALE && y >= (b.y - o.y) * SCALE && y < (b.y - o.y + b.h) * SCALE;
  const regions = { icon: 0, text: 0, rest: 0 };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; if (diff.data[k] === 255 && diff.data[k + 1] === 0 && diff.data[k + 2] === 0) { if (inBox(shot.box.i0, x, y) || inBox(shot.box.i2, x, y)) regions.icon++; else if (inBox(shot.box.t, x, y)) regions.text++; else regions.rest++; } }
  const tb = shot.box.t ? [{ x: (shot.box.t.x - o.x) * SCALE, y: (shot.box.t.y - o.y) * SCALE, w: shot.box.t.w * SCALE, h: shot.box.t.h * SCALE }] : [];
  const m = compareRegions(ref, shot.png, tb);
  if (write) { const base = path.join(diffDir, v.id.replace(/:/g, '-')); fs.writeFileSync(base + '.diff.png', PNG.sync.write(diff)); fs.writeFileSync(base + '.code.png', PNG.sync.write(shot.png)); }
  return { ratio: n / (W * H), diffPixels: n, regions, metric: { restShare: m.restShare, textShare: m.textShare, rest: m.rest, text: m.text }, pass: m.pass, ...(rule ? { rule } : {}) };
}

const results = [];
for (const v of spec.variants) {
  const shot = await shoot(v);
  const c = compare(v, shot, true);
  if (process.env.L2_DEBUG === v.id) console.log("DEBUG boxes", JSON.stringify(shot.box), JSON.stringify(shot.icons));
  const status = c.size ? 'fail' : c.pass ? 'pass' : 'fail';
  if (status === 'pass') for (const f of ['.diff.png', '.code.png']) fs.rmSync(path.join(diffDir, v.id.replace(/:/g, '-') + f), { force: true });
  results.push({ variant: v.name, variantId: v.id, theme: 'light', status, ...(status === 'fail' && c.regions ? { dominant: Object.entries(c.regions).sort((a, b) => b[1] - a[1])[0][0] } : {}), ratio: Math.round(c.ratio * 1e5) / 1e5, ...c, icons: shot.icons, unmappedIcon: shot.icons.i0 === '?' || shot.icons.i2 === '?' });
}
let calibration = null;
if (CAL) {
  // Calibration: mutations that MUST be caught (1px shift, text weight 500->400, text colour, background colour) vs the
  // correct renders. Per region: max share over correct renders, min share over mutated renders that the mutation touched.
  const muts = {
    'shift-1px': `${TAG}{--igds-ref-space-550:21px;--igds-ref-space-400:17px;--igds-ref-space-300:13px;--igds-ref-space-200:5px}`,
    'text-weight-500-to-400': `${TAG}{--igds-ref-font-weight-medium:400}`,
    'text-colour': `${TAG}{--igds-base-color-button-text-primary:#e0e8f5;--igds-base-color-button-text-secondary:#1f5fc0}`,
    'background-colour': `${TAG}{--igds-base-color-button-background-primary:#2f7ff0;--igds-base-color-button-background-secondary:#f0f0f0}`,
  };
  const ok = results.filter((r) => r.metric);
  calibration = { PASS, baseline: { restMax: Math.max(...ok.map((r) => r.metric.restShare)), textMax: Math.max(...ok.map((r) => r.metric.textShare)), passing: ok.filter((r) => r.pass).length, of: results.length }, mutations: {} };
  for (const [name, css] of Object.entries(muts)) {
    const rows = [];
    for (const v of spec.variants.filter((x) => x.props.State === 'Default')) {
      const base = results.find((x) => x.variantId === v.id); const c2 = compare(v, await shoot(v, css), false);
      if (c2.size) { rows.push({ id: v.id, size: true, caught: true }); continue; }
      if (!base.metric) continue;
      if (c2.metric.restShare - base.metric.restShare <= 1e-6 && c2.metric.textShare - base.metric.textShare <= 1e-6) continue; // not touched
      rows.push({ id: v.id, restShare: c2.metric.restShare, textShare: c2.metric.textShare, caught: !c2.pass });
    }
    const px = rows.filter((r) => !r.size);
    calibration.mutations[name] = { affected: rows.length, caught: rows.filter((r) => r.caught).length, minRestShare: px.length ? Math.min(...px.map((r) => r.restShare)) : null, minTextShare: px.length ? Math.min(...px.map((r) => r.textShare)) : null };
  }
  fs.writeFileSync(path.join(outDir, `${sid}.${TAG}.l2-calibration.json`), JSON.stringify(calibration, null, 1) + '\n');
}
await browser.close(); fs.rmSync(hp, { force: true });
const tally = {}; for (const r of results) tally[r.status] = (tally[r.status] || 0) + 1;
const regionTotals = results.reduce((a, r) => { if (r.regions) for (const k in r.regions) a[k] = (a[k] || 0) + r.regions[k]; return a; }, {});
fs.writeFileSync(path.join(outDir, `${sid}.${TAG}.l2.json`), JSON.stringify({ setId, tag: TAG, generatedAt: new Date().toISOString(), scale: SCALE, pass: PASS, tally, regionTotals, sizeMismatch: results.filter((r) => r.size).length, unmappedIcon: results.filter((r) => r.unmappedIcon).length, results }, null, 1) + '\n');
const lp = path.join(KIT, 'verify/ledger.json'); const ledger = rd(lp);
ledger.rows = ledger.rows.filter((r) => !(r.setId === setId && r.tag === TAG && r.level === 'L2'));
for (const r of results) ledger.rows.push({ setId, set: spec.set.name, tag: TAG, variant: r.variant, variantId: r.variantId, theme: 'light', level: 'L2', status: r.status, ratio: r.ratio, dominant: r.dominant, rule: r.rule, evidence: `verify/out/${sid}.${TAG}.l2.json` });
fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
console.log(`${spec.set.name} -> ${TAG} L2: ${JSON.stringify(tally)} sizeMismatch=${results.filter((r) => r.size).length} regions=${JSON.stringify(regionTotals)} worst=${JSON.stringify(results.slice().sort((a, b) => b.ratio - a.ratio).slice(0, 3).map((r) => [r.variant, r.ratio, r.regions || r.size]))}${calibration ? '\ncalibration ' + JSON.stringify(calibration) : ''}`);

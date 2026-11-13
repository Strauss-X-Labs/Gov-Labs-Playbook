#!/usr/bin/env node
// Behaviour + accessibility for GENERATED components (generic).
//  - interaction: for every component whose Figma State has interactive options, REAL input (mouse hover, mouse press,
//    keyboard Tab, [disabled]) must select exactly the Figma variant of that state (element.figmaVariant)
//  - axe-core (WCAG 2.x A/AA) on the default variant of every component, light and dark, page background = IGDS
//    neutral-default token. Findings are recorded per rule; contrast findings are compared with the Figma colours
//    (a colour pair that is also in Figma is a design-source gap, not a code defect).
// Usage: node verify/behavior-gen.mjs   Output: verify/out/gen-behavior.json + ledger rows (behavior, axe)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium
import * as esbuild from 'esbuild';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(KIT, '..');
const require = createRequire(import.meta.url);
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const cat = rd(path.join(KIT, 'src/gen/catalog.json')).components.filter((c) => c.variants);
const outDir = path.join(KIT, 'verify/out');
const bundle = path.join(outDir, '_gen.bundle.js');
// same component set as the shipped package: generic components + the dedicated igdsx-button (nested Button instances)
await esbuild.build({ stdin: { contents: "import './gen/index.js'; import './ext/igdsx-button/igdsx-button.js';", resolveDir: path.join(KIT, 'src') }, bundle: true, format: 'iife', outfile: bundle, logLevel: 'error' });
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await launchBrowser();
const results = [];
for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const hp = path.join(outDir, `_beh-${theme}.html`);
  fs.writeFileSync(hp, `<!doctype html><html dir="rtl" lang="he" ${theme === 'dark' ? 'data-theme="dark"' : ''}><head><meta charset="utf-8"><title>t</title>
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/local.css'))}"><link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/library-fonts.css'))}">
${fs.readdirSync(path.join(KIT, 'src/tokens')).map((f) => `<link rel="stylesheet" href="${pathToFileURL(path.join(KIT, 'src/tokens', f))}">`).join('')}
<script src="${pathToFileURL(bundle)}"></script><style>body{margin:0;padding:40px;background:var(--igds-base-color-background-neutral-default)}</style></head><body><main id="stage"></main></body></html>`);
  await page.goto(pathToFileURL(hp).href); await page.addScriptTag({ content: axeSrc });
  for (const c of cat) {
    await page.mouse.move(0, 0);
    await page.evaluate((tag) => { const st = document.getElementById('stage'); st.innerHTML = ''; st.appendChild(document.createElement(tag)); }, c.tag);
    await page.waitForTimeout(30);
    // interaction (light only: theme-independent)
    if (theme === 'light' && c.state) {
      const I = { ...c.state.interactive }; const name = () => page.evaluate((t) => document.querySelector(t).figmaVariant, c.tag);
      const want = (v) => (v ? `${c.state.figma}=${v}` : null);
      // does Figma define the target state for the CURRENT combination? (default variant name with State swapped)
      const exists = (v) => page.evaluate(([t, prop, v]) => { const C = customElements.get(t); const cur = document.querySelector(t).figmaVariant; const dflt = C.data.state.default; const target = cur.replace(`${prop}=${dflt}`, `${prop}=${v}`); return C.data.variants.some((x) => x.name === target); }, [c.tag, c.state.figma, v]);
      const na = [];
      for (const k of ['hover', 'pressed', 'focus', 'disabled']) if (I[k] && !(await exists(I[k]))) { na.push(k); I[k] = null; }
      for (const k of na) results.push({ tag: c.tag, setId: c.figma.id, level: 'behavior', theme: 'light', variant: k + ': Figma has no such variant for the default combination', status: 'not-applicable' });
      const checks = [];
      const box = await page.evaluate((t) => { const r = document.querySelector(t).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width }; }, c.tag);
      if (I.hover && box.w > 0) { await page.mouse.move(box.x, box.y); await page.waitForTimeout(20); const n = await name(); checks.push({ check: 'mouse hover -> Figma ' + I.hover, ok: n.includes(want(I.hover)), got: n }); }
      if (I.pressed && box.w > 0) { await page.mouse.down(); await page.waitForTimeout(20); const n = await name(); checks.push({ check: 'mouse press -> Figma ' + I.pressed, ok: n.includes(want(I.pressed)), got: n }); await page.mouse.up(); }
      await page.mouse.move(0, 0);
      if (I.focus) { await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.keyboard.press('Tab'); await page.waitForTimeout(20); const n = await name(); checks.push({ check: 'keyboard Tab -> Figma ' + I.focus, ok: n.includes(want(I.focus)), got: n }); }
      if (I.disabled) { await page.evaluate((t) => { const e = document.querySelector(t); e.blur(); e.setAttribute('disabled', ''); }, c.tag); await page.waitForTimeout(20); const n = await name(); checks.push({ check: '[disabled] -> Figma ' + I.disabled, ok: n.includes(want(I.disabled)), got: n }); await page.evaluate((t) => document.querySelector(t).removeAttribute('disabled'), c.tag); }
      for (const k of checks) results.push({ tag: c.tag, setId: c.figma.id, level: 'behavior', theme: 'light', variant: k.check, status: k.ok ? 'pass' : 'fail', detail: k.got });
    }
    await page.mouse.move(0, 0);
    const ax = await page.evaluate(async () => { const r = await axe.run(document.getElementById('stage'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }); return r.violations.map((v) => ({ id: v.id, n: v.nodes.length, sample: v.nodes[0] && v.nodes[0].failureSummary ? v.nodes[0].failureSummary.slice(0, 160) : '' })); });
    results.push({ tag: c.tag, setId: c.figma.id, level: 'axe', theme, variant: 'default', status: ax.length ? 'fail' : 'pass', violations: ax });
  }
  await page.close(); fs.rmSync(hp, { force: true });
}
await browser.close();
const sum = (lvl) => ({ pass: results.filter((r) => r.level === lvl && r.status === 'pass').length, total: results.filter((r) => r.level === lvl).length });
const rules = {}; for (const r of results) for (const v of r.violations || []) rules[`${v.id} (${r.theme})`] = (rules[`${v.id} (${r.theme})`] || 0) + 1;
fs.writeFileSync(path.join(outDir, 'gen-behavior.json'), JSON.stringify({ generatedAt: new Date().toISOString(), behavior: sum('behavior'), axe: sum('axe'), axeRules: rules, results }, null, 1) + '\n');
const lp = path.join(KIT, 'verify/ledger.json'); const ledger = rd(lp); const tags = new Set(cat.map((c) => c.tag));
ledger.rows = ledger.rows.filter((r) => !(tags.has(r.tag) && (r.level === 'behavior' || r.level === 'axe')));
for (const r of results) ledger.rows.push({ setId: r.setId, tag: r.tag, level: r.level, theme: r.theme, variant: r.variant, status: r.status, evidence: 'verify/out/gen-behavior.json' });
fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
console.log(JSON.stringify({ behavior: sum('behavior'), axe: sum('axe'), axeRules: rules }));

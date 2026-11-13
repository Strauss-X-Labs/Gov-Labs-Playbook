#!/usr/bin/env node
// Behaviour + accessibility checks for <igdsx-button> (plan v3 §6.3). Each check carries its source label:
//   documented                      = in Figma (prototype reactions) or the generated contract
//   required-for-working-component  = needed for a usable button, not described in Figma (HTML/WAI-ARIA button pattern)
// axe-core (WCAG 2.0/2.1/2.2 A+AA rules) runs on every valid combination × light/dark.
// Output: verify/out/igdsx-button.behavior.json + ledger rows (level "behavior" / "axe")
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium
import * as esbuild from 'esbuild';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(KIT, '..');
const require = createRequire(import.meta.url);
const TAG = 'igdsx-button';
const contract = JSON.parse(fs.readFileSync(path.join(KIT, 'src/ext', TAG, 'contract.json'), 'utf8'));
const outDir = path.join(KIT, 'verify/out'); fs.mkdirSync(outDir, { recursive: true });
const bundle = path.join(outDir, `_${TAG}.bundle.js`);
await esbuild.build({ entryPoints: [path.join(KIT, 'src/ext', TAG, `${TAG}.js`)], bundle: true, format: 'iife', outfile: bundle, logLevel: 'error' });
const axePath = require.resolve('axe-core/axe.min.js');
const tokenCss = fs.readdirSync(path.join(KIT, 'src/tokens')).map((f) => `<link rel="stylesheet" href="${pathToFileURL(path.join(KIT, 'src/tokens', f))}">`).join('');

const browser = await launchBrowser();
const page = await browser.newPage();
const hp = path.join(outDir, '_behavior.html');
fs.writeFileSync(hp, `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><title>igdsx-button behaviour</title>
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/local.css'))}">${tokenCss}
<script src="${pathToFileURL(bundle)}"></script><script src="${pathToFileURL(axePath)}"></script><style>body{background:var(--igds-base-color-background-neutral-default);color:var(--igds-base-color-text-primary, inherit)}</style></head><body><main><h1>בדיקה</h1><div id="stage"></div></main></body></html>`);
await page.goto(pathToFileURL(hp).href);
await page.waitForFunction(() => !!customElements.get('igdsx-button'));

const checks = [];
const check = async (name, source, fn) => { try { const r = await fn(); checks.push({ name, source, ok: r === true, detail: r === true ? undefined : r }); } catch (e) { checks.push({ name, source, ok: false, detail: String(e.message || e) }); } };
const stage = (html) => page.evaluate(async (h) => { const s = document.getElementById('stage'); s.innerHTML = h; await Promise.all([...s.querySelectorAll('igdsx-button')].map((b) => b.updateComplete)); }, html);

await check('Tab focuses the button and :focus-visible applies (Figma ON_KEY_DOWN -> Focused)', 'documented', async () => {
  await stage('<input id="before"><igdsx-button variant="primary" size="medium">שמירה</igdsx-button>');
  await page.focus('#before'); await page.keyboard.press('Tab');
  return page.evaluate(() => { const r = document.querySelector('igdsx-button').shadowRoot.querySelector('.root'); return r.matches(':focus-visible') || 'not focus-visible'; });
});
await check('Enter and Space activate click (native button)', 'required-for-working-component', async () => {
  await stage('<igdsx-button variant="primary" size="medium">שמירה</igdsx-button>');
  await page.evaluate(() => { window.clicks = 0; document.querySelector('igdsx-button').addEventListener('click', () => window.clicks++); document.querySelector('igdsx-button').focus(); });
  await page.keyboard.press('Enter'); await page.keyboard.press('Space');
  const n = await page.evaluate(() => window.clicks); return n === 2 || `clicks=${n}`;
});
await check('Pointer click fires one click event', 'documented', async () => {
  await stage('<igdsx-button variant="secondary" size="medium">שמירה</igdsx-button>');
  await page.evaluate(() => { window.clicks = 0; document.querySelector('igdsx-button').addEventListener('click', () => window.clicks++); });
  await page.click('igdsx-button'); const n = await page.evaluate(() => window.clicks); return n === 1 || `clicks=${n}`;
});
await check('disabled: not focusable by Tab and no click event', 'documented', async () => {
  await stage('<input id="before"><igdsx-button disabled variant="primary" size="medium">שמירה</igdsx-button><input id="after">');
  await page.evaluate(() => { window.clicks = 0; document.querySelector('igdsx-button').addEventListener('click', () => window.clicks++); });
  await page.focus('#before'); await page.keyboard.press('Tab');
  const active = await page.evaluate(() => document.activeElement.id); await page.click('igdsx-button', { force: true });
  const n = await page.evaluate(() => window.clicks); return (active === 'after' && n === 0) || `active=${active} clicks=${n}`;
});
await check('type=submit submits the parent form (form-associated)', 'required-for-working-component', async () => {
  await stage('<form id="f"><input name="a" value="1"><igdsx-button type="submit" variant="primary" size="medium">שליחה</igdsx-button></form>');
  await page.evaluate(() => { window.submitted = 0; document.getElementById('f').addEventListener('submit', (e) => { e.preventDefault(); window.submitted++; }); });
  await page.click('igdsx-button'); const n = await page.evaluate(() => window.submitted); return n === 1 || `submitted=${n}`;
});
await check('type=button (default) does not submit the form', 'required-for-working-component', async () => {
  await stage('<form id="f"><igdsx-button variant="primary" size="medium">ביטול</igdsx-button></form>');
  await page.evaluate(() => { window.submitted = 0; document.getElementById('f').addEventListener('submit', (e) => { e.preventDefault(); window.submitted++; }); });
  await page.click('igdsx-button'); const n = await page.evaluate(() => window.submitted); return n === 0 || `submitted=${n}`;
});
await check('icon-only exposes the label attribute as accessible name', 'required-for-working-component', async () => {
  await stage('<igdsx-button icon-only label="הוספה" variant="primary" size="medium"><span slot="icon" aria-hidden="true" style="display:block;width:24px;height:24px"></span></igdsx-button>');
  const snap = await page.accessibility?.snapshot?.({ interestingOnly: true });
  const name = await page.evaluate(() => document.querySelector('igdsx-button').shadowRoot.querySelector('.root').getAttribute('aria-label'));
  return name === 'הוספה' || `aria-label=${name} ${snap ? '' : ''}`;
});
await check('Empty icon slots are not rendered (Figma boolean off = hidden)', 'documented', async () => {
  await stage('<igdsx-button variant="primary" size="medium">שמירה</igdsx-button>');
  return page.evaluate(() => { const sr = document.querySelector('igdsx-button').shadowRoot; return (sr.querySelector('.i0').hidden && sr.querySelector('.i2').hidden) || 'icon wrappers visible without content'; });
});
await check('Combination not present in Figma is reported (console warning)', 'documented', async () => {
  const msgs = []; page.on('console', (m) => msgs.push(m.text()));
  await stage('<igdsx-button variant="link" size="large">קישור</igdsx-button>');
  await page.waitForTimeout(50); return msgs.some((t) => t.includes('combination not in Figma')) || 'no warning';
});

// axe on every valid combination, light + dark
const combos = contract.validCombinations;
await page.mouse.move(0, 0); // no element may stay in :hover from the click checks above
const axeResults = [];
for (const theme of ['light', 'dark']) {
  await page.evaluate((t) => { if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme'); }, theme);
  for (const c of combos) {
    const html = `<div dir="${c.dir}"><igdsx-button variant="${c.variant}" size="${c.size}" intent="${c.intent}" ${c.iconOnly ? 'icon-only label="הוספה"' : ''}>${c.iconOnly ? '<span slot="icon" aria-hidden="true" style="display:block;width:24px;height:24px"></span>' : c.dir === 'rtl' ? 'טקסט כפתור' : 'Button Text'}</igdsx-button></div>`;
    await stage(html);
    const r = await page.evaluate(async () => { const res = await axe.run(document.getElementById('stage'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }); return res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, summary: v.nodes[0]?.failureSummary?.slice(0, 200) })); });
    axeResults.push({ theme, combo: c, violations: r });
  }
}
await browser.close();
fs.unlinkSync(hp);
const axeFail = axeResults.filter((r) => r.violations.length);
const out = { tag: TAG, generatedAt: new Date().toISOString(), behavior: checks, axe: { runs: axeResults.length, withViolations: axeFail.length, violations: axeFail } };
fs.writeFileSync(path.join(outDir, `${TAG}.behavior.json`), JSON.stringify(out, null, 1) + '\n');
const lp = path.join(KIT, 'verify/ledger.json'); const ledger = JSON.parse(fs.readFileSync(lp, 'utf8'));
ledger.rows = ledger.rows.filter((r) => !(r.tag === TAG && (r.level === 'behavior' || r.level === 'axe')));
for (const c of checks) ledger.rows.push({ setId: contract.figma.setId, set: contract.figma.name, tag: TAG, variant: '(component)', theme: '-', level: 'behavior', check: c.name, source: c.source, status: c.ok ? 'pass' : 'fail', evidence: `verify/out/${TAG}.behavior.json` });
for (const r of axeResults) ledger.rows.push({ setId: contract.figma.setId, set: contract.figma.name, tag: TAG, variant: JSON.stringify(r.combo), theme: r.theme, level: 'axe', status: r.violations.length ? 'fail' : 'pass', failed: r.violations.map((v) => v.id), evidence: `verify/out/${TAG}.behavior.json` });
fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
for (const c of checks) console.log(c.ok ? 'PASS' : 'FAIL', `[${c.source}]`, c.name, c.ok ? '' : JSON.stringify(c.detail));
const ids = {}; for (const r of axeFail) for (const v of r.violations) ids[v.id + ' (' + r.theme + ')'] = (ids[v.id + ' (' + r.theme + ')'] || 0) + 1;
console.log(`axe: ${axeResults.length} runs, ${axeFail.length} with violations`, JSON.stringify(ids));

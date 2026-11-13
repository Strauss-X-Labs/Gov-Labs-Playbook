#!/usr/bin/env node
// Proves dist/ is self-contained (plan v3 §2.1): copies ONLY dist/ to an empty folder outside the project (no node_modules,
// no Figma, no network), loads a page that uses official and generated components, and checks:
// every tag registers, the official Rubik font loads from the package, no request fails, no request leaves the folder,
// no console error, and INTEGRITY.json hashes still match the vendored files (= official code unchanged).
// Usage: node verify/self-contained.mjs <emptyTargetDir>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || '');
if (!process.argv[2]) { console.error('usage: self-contained.mjs <emptyTargetDir>'); process.exit(2); }
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(path.join(KIT, 'dist'), path.join(target, 'igds-kit'), { recursive: true });
// integrity
const integ = JSON.parse(fs.readFileSync(path.join(target, 'igds-kit/INTEGRITY.json'), 'utf8'));
let bad = 0, n = 0;
for (const [pkg, p] of Object.entries(integ.packages)) for (const [rel, h] of Object.entries(p.files)) { n++; const f = path.join(target, 'igds-kit/vendor/igds', pkg.split('/')[1], rel); if (crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') !== h) bad++; }
const js = fs.readFileSync(path.join(target, 'igds-kit/igds-kit.js'));
for (const [rel, d] of Object.entries(integ.derived || {})) { n++; const der = fs.readFileSync(path.join(target, 'igds-kit/vendor/igds', rel), 'utf8'); const orig = fs.readFileSync(path.join(target, 'igds-kit/vendor/igds/tokens/lib/index.min.css'), 'utf8'); if (d.removedPrefix + der !== orig) bad++; }
const segOk = crypto.createHash('sha256').update(js.subarray(integ.bundle.officialSegment.from, integ.bundle.officialSegment.to)).digest('hex') === integ.bundle.officialSegment.sha256;
fs.writeFileSync(path.join(target, 'index.html'), `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><title>New project</title>
<link rel="stylesheet" href="igds-kit/igds-kit.css"><script src="igds-kit/igds-kit.js" defer></script></head>
<body><main><igds-input label="שם פרטי" required></igds-input><igds-date-picker label="תאריך"></igds-date-picker>
<igdsx-button variant="primary" size="medium">שליחה</igdsx-button><igdsx-button variant="link-button" size="medium" intent="danger">מחיקה</igdsx-button><igdsx-input-field></igdsx-input-field><igdsx-radio-button></igdsx-radio-button></main></body></html>`);
const browser = await launchBrowser();
const page = await browser.newPage();
const failed = [], outside = [], errors = [];
page.on('requestfailed', (r) => failed.push(r.url()));
page.on('request', (r) => { const u = r.url(); if (!u.startsWith(pathToFileURL(target).href) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(pathToFileURL(path.join(target, 'index.html')).href);
await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
const res = await page.evaluate(async ([tags, gen]) => {
  await Promise.all([...document.querySelectorAll('igdsx-button')].map((b) => b.updateComplete));
  return { registered: tags.filter((t) => customElements.get(t)).length, total: tags.length, missing: tags.filter((t) => !customElements.get(t)), igdsx: !!customElements.get('igdsx-button'),
    rubik: [...document.fonts].filter((f) => /Rubik/.test(f.family) && f.status === 'loaded').length,
    buttonBg: getComputedStyle(document.querySelector('igdsx-button').shadowRoot.querySelector('.wrap')).backgroundColor,
    inputRendered: !!document.querySelector('igds-input').shadowRoot?.childElementCount,
    genRegistered: gen.filter((t) => customElements.get(t)).length, genTotal: gen.length, genRendered: !!document.querySelector('igdsx-input-field')?.shadowRoot?.querySelector('[data-i="0"]') };
}, ((c) => [c.official.map((o) => o.tag), (c.generatedFromFigma || []).filter((g) => g.variants).map((g) => g.tag)])(JSON.parse(fs.readFileSync(path.join(target, 'igds-kit/catalog.json'), 'utf8'))));
await page.screenshot({ path: path.join(target, 'screenshot.png') });
await browser.close();
const ok = bad === 0 && segOk && res.registered === res.total && res.igdsx && res.rubik > 0 && !failed.length && !outside.length && !errors.length && res.inputRendered && res.genRegistered === res.genTotal && res.genRendered;
console.log(JSON.stringify({ ok, vendorFilesChecked: n, vendorHashMismatches: bad, officialSegmentUnchanged: segOk, ...res, failedRequests: failed, requestsOutsideFolder: outside, consoleErrors: errors, screenshot: path.join(target, 'screenshot.png') }, null, 1));
process.exit(ok ? 0 : 1);

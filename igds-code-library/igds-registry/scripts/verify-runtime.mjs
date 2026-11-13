#!/usr/bin/env node
/**
 * igds-registry / verify-runtime.mjs
 *
 * Runtime ground truth for the code-extracted registry. Loads the OFFICIAL browser bundle
 * (@igds/core-web/lib/index.min.js) in a real headless Chromium (Edge or Chrome already
 * installed on the machine — no npm dependency) and checks, for every component in
 * components.generated.json:
 *   - the tag is registered by the bundle
 *   - observedAttributes === registry attributes (exact set equality)
 *   - every method the registry presents as consumer API exists on the element
 *   - every <slot> the element renders by default is known to the registry
 *   - default property values (recorded for the catalog — runtime fact)
 * plus a loading-order probe: bundle in <head> WITHOUT defer (the documented failure mode).
 *
 * Browser: IGDS_BROWSER=<path> overrides auto-detection.
 * Output: igds-registry/runtime-verification.generated.json   · exit 1 on any mismatch.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryRoot = path.resolve(__dirname, '..');
const projectRoot = process.env.IGDS_PROJECT_ROOT ? path.resolve(process.env.IGDS_PROJECT_ROOT) : path.resolve(registryRoot, '..');
const registryFile = path.join(registryRoot, 'components.generated.json');
if (!fs.existsSync(registryFile)) { console.error('ERROR: run build-registry.mjs first'); process.exit(1); }
const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'));

const CANDIDATE_BROWSERS = [
  process.env.IGDS_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);
const browser = CANDIDATE_BROWSERS.find((p) => fs.existsSync(p));
if (!browser) { console.error('ERROR: no Chromium-based browser found. Set IGDS_BROWSER=<path to chrome/edge>.'); process.exit(2); }

// What the page needs from the registry (kept small).
const spec = registry.components.map((c) => ({
  tag: c.tag,
  attributes: c.props.filter((p) => p.isHtmlAttribute).map((p) => p.attribute),
  props: c.props.map((p) => p.name),
  consumerMethods: c.publicApiMethods.filter((m) => m.classification === 'consumer-api-standard-element' || m.classification === 'candidate-consumer-api').map((m) => m.name),
  slots: c.slots.map((s) => s.name),
}));

const MAIN_PAGE = `<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8">
<link rel="stylesheet" href="/node_modules/@igds/tokens/lib/index.min.css">
<script src="/node_modules/@igds/core-web/lib/index.min.js" defer></script></head>
<body><div id="stage" style="position:absolute;inset-inline-start:-99999px"></div>
<script type="module">
const spec = await (await fetch('/__spec')).json();
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));
await new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r)));
const safe = (v) => { try { if (v === undefined) return { undefined: true }; if (typeof v === 'function') return { function: true }; if (v instanceof Element) return { element: v.tagName.toLowerCase() }; return JSON.parse(JSON.stringify(v)); } catch { return { unserializable: String(v) }; } };
const out = [];
for (const s of spec) {
  const r = { tag: s.tag };
  const ctor = customElements.get(s.tag);
  r.registered = !!ctor;
  if (!ctor) { out.push(r); continue; }
  const observed = [...(ctor.observedAttributes || [])];
  r.attributesMissingAtRuntime = s.attributes.filter((a) => !observed.includes(a));
  r.attributesOnlyAtRuntime = observed.filter((a) => !s.attributes.includes(a));
  r.methodsMissingAtRuntime = s.consumerMethods.filter((m) => typeof ctor.prototype[m] !== 'function');
  const el = document.createElement(s.tag);
  r.defaults = {};
  for (const p of s.props) r.defaults[p] = safe(el[p]);
  try {
    document.getElementById('stage').appendChild(el);
    const t0 = performance.now();
    r.updateCompleteResolved = await Promise.race([el.updateComplete.then(() => true, (e) => { r.renderError = String(e && e.message || e); return true; }), new Promise((res) => setTimeout(() => res(false), 400))]);
    r.renderMs = Math.round(performance.now() - t0);
    const names = [...(el.shadowRoot?.querySelectorAll('slot') ?? [])].map((x) => x.getAttribute('name') || '(default)');
    r.slotsRenderedByDefault = [...new Set(names)];
    r.slotsRenderedButUnknown = r.slotsRenderedByDefault.filter((n) => !s.slots.includes(n));
  } catch (e) { r.renderError = String(e && e.message || e); }
  el.remove();
  // Attributes the component itself rejects at runtime: set each one on a fresh element and record console warnings
  // that name it as unsupported/deprecated (e.g. igds-icon "no longer supports the name property").
  r.attributesRejectedAtRuntime = [];
  for (const a of s.attributes) {
    const seen = []; const orig = console.warn; console.warn = (...x) => { seen.push(x.map(String).join(' ')); };
    try { const e2 = document.createElement(s.tag); e2.setAttribute(a, 'probe'); document.getElementById('stage').appendChild(e2); await Promise.race([e2.updateComplete, new Promise((res) => setTimeout(res, 200))]); e2.remove(); } catch (e) {}
    console.warn = orig;
    const prop = s.props.find((p) => p.toLowerCase() === a.replace(/-/g, '')) || a;
    const hit = seen.find((w) => /no longer supports|not supported|deprecated/i.test(w) && new RegExp('(^|[^a-z])(' + a + '|' + prop + ')([^a-z]|$)', 'i').test(w));
    if (hit) r.attributesRejectedAtRuntime.push({ attribute: a, warning: hit.split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean).join(' ') }); // (no regex escapes: this code lives in a template literal)
  }
  out.push(r);
}
await fetch('/__result?page=main', { method: 'POST', body: JSON.stringify({ results: out, pageErrors: errors }) });
</script></body></html>`;

const HEAD_NO_DEFER_PAGE = `<!doctype html><html><head><meta charset="utf-8">
<script>window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)));</script>
<script src="/node_modules/@igds/core-web/lib/index.min.js"></script></head><body>
<script>addEventListener('load',()=>fetch('/__result?page=headNoDefer',{method:'POST',body:JSON.stringify({
  registered: ${JSON.stringify(spec.map((s) => s.tag))}.filter(t=>customElements.get(t)).length, errors: __errs })}));</script></body></html>`;

const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const results = {};
let resolveDone;
const done = new Promise((r) => (resolveDone = r));
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/__result') {
    let body = ''; req.on('data', (c) => (body += c)); req.on('end', () => {
      results[url.searchParams.get('page')] = JSON.parse(body); res.end('ok');
      if (results.main && results.headNoDefer) resolveDone();
    });
    return;
  }
  if (url.pathname === '/__spec') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(spec)); }
  if (url.pathname === '/__main') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(MAIN_PAGE); }
  if (url.pathname === '/__head') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(HEAD_NO_DEFER_PAGE); }
  const file = path.resolve(projectRoot, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(path.resolve(projectRoot, 'node_modules', '@igds'))) { res.writeHead(403); return res.end(); } // read-only, @igds only
  fs.readFile(file, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); res.end(d); });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'igds-verify-'));
// Linux containers (CI / Codex) usually run as root, where Chromium requires --no-sandbox; Windows unchanged
const linuxFlags = process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage'] : [];
const launch = (url) => spawn(browser, [...linuxFlags, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}-${Math.random().toString(36).slice(2)}`, url], { stdio: 'ignore' });
const procs = [launch(`http://127.0.0.1:${port}/__main`), launch(`http://127.0.0.1:${port}/__head`)];
const TIMEOUT_MS = 120000;
let timer;
const timedOut = await Promise.race([done.then(() => false), new Promise((r) => { timer = setTimeout(() => r(true), TIMEOUT_MS); })]);
clearTimeout(timer);
procs.forEach((p) => { try { p.kill(); } catch {} });
server.close();
if (timedOut) { console.error(`ERROR: browser did not report within ${TIMEOUT_MS / 1000}s (got: ${Object.keys(results).join(',') || 'nothing'})`); process.exit(2); }

const rows = results.main.results;
const fail = (pred) => rows.filter(pred).map((r) => r.tag);
const checks = { passed: [], failed: [] };
const check = (name, ok, detail) => (ok ? checks.passed : checks.failed).push({ name, detail });
check('every registry tag is registered by the official browser bundle', fail((r) => !r.registered).length === 0, fail((r) => !r.registered));
check('observedAttributes exactly equal registry attributes (no missing)', fail((r) => r.attributesMissingAtRuntime?.length).length === 0, rows.filter((r) => r.attributesMissingAtRuntime?.length).map((r) => ({ tag: r.tag, missing: r.attributesMissingAtRuntime })));
check('observedAttributes exactly equal registry attributes (no extra)', fail((r) => r.attributesOnlyAtRuntime?.length).length === 0, rows.filter((r) => r.attributesOnlyAtRuntime?.length).map((r) => ({ tag: r.tag, extra: r.attributesOnlyAtRuntime })));
check('every method presented as consumer API exists on the element prototype', fail((r) => r.methodsMissingAtRuntime?.length).length === 0, rows.filter((r) => r.methodsMissingAtRuntime?.length).map((r) => ({ tag: r.tag, missing: r.methodsMissingAtRuntime })));
check('every slot rendered by default is known to the registry', fail((r) => r.slotsRenderedButUnknown?.length).length === 0, rows.filter((r) => r.slotsRenderedButUnknown?.length).map((r) => ({ tag: r.tag, unknown: r.slotsRenderedButUnknown })));
// A component that throws when rendered standalone usually needs a parent/context element. That is a usage
// fact for the catalog (warning), not an extraction failure.
const warnings = rows.filter((r) => r.renderError).map((r) => ({ tag: r.tag, kind: 'throws-when-rendered-standalone (likely requires a parent/context element)', error: r.renderError }));
for (const r of rows) for (const x of r.attributesRejectedAtRuntime || []) warnings.push({ tag: r.tag, kind: 'attribute-rejected-at-runtime', attribute: x.attribute, error: x.warning });

const head = results.headNoDefer;
const out = {
  generatedAt: new Date().toISOString(),
  generatedBy: 'igds-registry/scripts/verify-runtime.mjs',
  dataSource: 'runtime: official @igds/core-web browser bundle in headless Chromium',
  browser: path.basename(browser),
  sourcePackages: registry.sourcePackages,
  summary: { components: rows.length, registered: rows.filter((r) => r.registered).length, checksPassed: checks.passed.length, checksFailed: checks.failed.length },
  loadingOrderProbe: {
    scenario: 'bundle <script> in <head> without defer',
    registeredComponents: head.registered, ofTotal: rows.length, errors: head.errors,
    conclusion: head.registered < rows.length ? 'BROKEN — bundle must be loaded with defer or at end of <body>' : 'works in this version — rule may be relaxed',
  },
  pageErrorsWithDefer: results.main.pageErrors,
  checks,
  warnings,
  components: rows,
};
fs.writeFileSync(path.join(registryRoot, 'runtime-verification.generated.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`[igds-runtime] ${path.basename(browser)} · registered ${out.summary.registered}/${rows.length} · checks ${checks.passed.length} passed, ${checks.failed.length} failed`);
console.log(`[igds-runtime] head-without-defer probe: ${head.registered}/${rows.length} registered → ${out.loadingOrderProbe.conclusion}`);
for (const w of warnings) console.log(`  ⚠️  ${w.tag}: ${w.kind} — ${w.error}`);
for (const c of checks.failed) console.log(`  ❌ ${c.name}: ${JSON.stringify(c.detail).slice(0, 600)}`);
if (checks.failed.length) process.exitCode = 1;

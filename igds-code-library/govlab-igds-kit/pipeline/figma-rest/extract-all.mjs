#!/usr/bin/env node
// Automatic full extraction of every component item in master-list.json through the Figma REST API (plan v3 §3.4).
// Read-only. For each set/component: GET /v1/files/:key/nodes?ids=<id> (cached byte-exact in spec/rest-cache/),
// convert with rest-to-v5.mjs to the same v5 format the MCP extractor writes, save spec/raw/rest-<id>.json.
// Property definitions (absent from REST) come from spec/raw-defs/*.json (MCP capture, extract-defs.figma.js).
// Resumable: already-cached responses are reused; --refresh refetches. Safe to re-run; output is deterministic.
// Usage (token only in the environment):  NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=../corp-ca.pem node pipeline/figma-rest/extract-all.mjs [--only id,id] [--refresh]
import fs from 'node:fs';
import path from 'node:path';
import { KIT, FILE_KEY, cachedGet } from './client.mjs';
import { convertSet, makeVarNamer } from './rest-to-v5.mjs';
import { loadDefs } from './defs.mjs';

const args = process.argv.slice(2);
const REFRESH = args.includes('--refresh');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const KINDS = ['component-set', 'building-block', 'standalone-component', 'dependency'];

const master = JSON.parse(fs.readFileSync(path.join(KIT, 'master-list.json'), 'utf8'));
let targets = master.rows.filter((r) => KINDS.includes(r.kind));
if (only) targets = targets.filter((r) => only.includes(r.id));


const { byName: defsBySet, list: defsList } = loadDefs(KIT);
const t0 = Date.now();
const vars = await cachedGet('variables-local.json', `/v1/files/${FILE_KEY}/variables/local`, { refresh: REFRESH });
const extraNames = {};
const vnDir = path.join(KIT, 'spec/raw-varnames');
if (fs.existsSync(vnDir)) for (const f of fs.readdirSync(vnDir).filter((x) => x.endsWith('.json')).sort()) Object.assign(extraNames, JSON.parse(fs.readFileSync(path.join(vnDir, f), 'utf8')).names);
const vn = makeVarNamer(vars.json, extraNames);
const report = { startedAt: new Date().toISOString(), figmaFile: FILE_KEY, variablesSha256: vars.sha256, targets: targets.length, done: [], failed: [] };
let i = 0;
for (const r of targets) {
  i++;
  const safe = r.id.replace(/:/g, '-');
  try {
    const res = await cachedGet(`nodes-${safe}.json`, `/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(r.id)}`, { refresh: REFRESH });
    if (!res.json.nodes || !res.json.nodes[r.id] || !res.json.nodes[r.id].document) throw new Error('node not returned by REST (deleted or moved?)');
    const conv = convertSet(res.json, r.id, vn, { defs: defsBySet[r.id] || (r.kind === 'standalone-component' ? {} : null), defsList });
    conv.restResponseSha256 = res.sha256; conv.figmaVersion = res.json.version ?? null; conv.restVariablesSha256 = vars.sha256;
    fs.writeFileSync(path.join(KIT, 'spec/raw', `rest-${safe}.json`), JSON.stringify(conv));
    report.done.push({ id: r.id, name: r.name, kind: r.kind, variants: conv.variants.length, expected: r.variants, cached: res.cached, ...conv.restStats });
    process.stdout.write(`[${i}/${targets.length}] ${r.id} ${r.name}: ${conv.variants.length} variants${res.cached ? ' (cache)' : ''}\n`);
  } catch (e) {
    report.failed.push({ id: r.id, name: r.name, error: String(e.message || e) });
    process.stdout.write(`[${i}/${targets.length}] ${r.id} ${r.name}: FAILED ${e.message}\n`);
  }
}
report.finishedAt = new Date().toISOString(); report.seconds = Math.round((Date.now() - t0) / 1000);
report.variantsExtracted = report.done.reduce((a, d) => a + d.variants, 0);
report.variantsExpected = targets.reduce((a, r) => a + (r.variants || 0), 0);
report.countMismatch = report.done.filter((d) => d.expected && d.variants !== d.expected).map((d) => ({ id: d.id, name: d.name, got: d.variants, expected: d.expected }));
fs.writeFileSync(path.join(KIT, 'spec/REST-EXTRACT-REPORT.json'), JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify({ done: report.done.length, failed: report.failed.length, variantsExtracted: report.variantsExtracted, variantsExpected: report.variantsExpected, countMismatch: report.countMismatch.length, seconds: report.seconds }));
process.exit(report.failed.length ? 1 : 0);

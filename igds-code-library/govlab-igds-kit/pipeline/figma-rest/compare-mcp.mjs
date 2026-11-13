// Equivalence check REST vs MCP: converts a cached REST response and compares every variant tree, field by field,
// with the normalized MCP spec (spec/sets/<id>.json). Prints diff counts per field (and examples).
// Usage: node pipeline/figma-rest/compare-mcp.mjs <restResponse.json> <variables.json> <setId>
import fs from 'node:fs';
import { convertSet, makeVarNamer } from './rest-to-v5.mjs';
const [resF, varsF, setId] = process.argv.slice(2);
const conv = convertSet(JSON.parse(fs.readFileSync(resF, 'utf8')), setId, makeVarNamer(JSON.parse(fs.readFileSync(varsF, 'utf8'))));
const spec = JSON.parse(fs.readFileSync(new URL(`../../spec/sets/${setId.replace(':', '-')}.json`, import.meta.url), 'utf8'));
const byId = new Map(spec.variants.map((v) => [v.id, v]));
const counts = {}, ex = {};
const canon = (x) => JSON.stringify(x, (k, val) => (val && typeof val === "object" && !Array.isArray(val) ? Object.fromEntries(Object.keys(val).sort().map((kk) => [kk, val[kk]])) : val));
const lsPx = ([v, u], fsz) => Math.round((u === "PERCENT" ? v * fsz / 100 : v) * 100) / 100;
let compared = 0, identical = 0;
for (const v of conv.variants) {
  const m = byId.get(v.id); if (!m || m.detail !== 'tree') continue; compared++;
  const flatR = {}; for (const rec of v.n) { const o = {}; for (let i = 1; i < rec.length; i += 2) o[conv.keys[rec[i]]] = conv.vals[rec[i + 1]]; flatR[conv.paths[rec[0]]] = o; }
  const flatM = {}; const walk = (n, p) => { const { c, ...o } = n; flatM[p] = o; (c || []).forEach((ch, i) => walk(ch, p + '/' + i + ':' + ch.n)); }; walk(m.tree, '');
  let same = true;
  for (const p of new Set([...Object.keys(flatR), ...Object.keys(flatM)])) {
    const a = flatR[p], b = flatM[p];
    if (!a || !b) { same = false; const k = !a ? 'node-only-in-mcp' : 'node-only-in-rest'; counts[k] = (counts[k] || 0) + 1; ex[k] ??= `${v.name} ${p}`; continue; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (canon(a[k]) === canon(b[k])) continue;
      if (k === "ls" && Array.isArray(a[k]) && Array.isArray(b[k]) && lsPx(a[k], a.fsz) === lsPx(b[k], b.fsz)) { counts["ls(unit-only, same px)"] = (counts["ls(unit-only, same px)"] || 0) + 1; continue; }
      same = false; counts[k] = (counts[k] || 0) + 1; ex[k] ??= `${a.t || b.t} ${p || '(root)'} rest=${JSON.stringify(a[k])} mcp=${JSON.stringify(b[k])}`;
    }
  }
  const rxM = JSON.stringify(m.reactions || null), rxR = JSON.stringify(v.rx ? v.rx.map(([t, a, d]) => [t, a, d && (conv.variants.find((x) => x.id === d)?.name || d)]) : null);
  if (rxM !== rxR) { same = false; counts.reactions = (counts.reactions || 0) + 1; ex.reactions ??= `${v.name} rest=${rxR} mcp=${rxM}`; }
  if (same) identical++;
}
console.log(JSON.stringify({ restVariants: conv.variants.length, mcpTrees: spec.variants.filter((v) => v.detail === 'tree').length, compared, identical, diffsByField: counts, examples: ex, restStats: conv.restStats }, null, 1));

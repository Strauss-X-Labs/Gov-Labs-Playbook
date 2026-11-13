#!/usr/bin/env node
// Copies a Figma MCP tool result byte-exact from the agent session log (.jsonl) into a file.
// Usage: node pull-tool-result.mjs <session.jsonl> <startsWith> <out.json> [mustContain]
// Picks the LAST matching tool_result. Verifies it parses as JSON. Never retypes data.
import fs from 'node:fs';
const [log, prefix, out, contain] = process.argv.slice(2);
let hit = null;
for (const line of fs.readFileSync(log, 'utf8').split('\n')) {
  if (!line.includes('tool_result')) continue;
  let o; try { o = JSON.parse(line); } catch { continue; }
  const items = o?.message?.content; if (!Array.isArray(items)) continue;
  for (const c of items) {
    if (c.type !== 'tool_result') continue;
    const t = Array.isArray(c.content) ? c.content.map((x) => x.text ?? '').join('') : String(c.content ?? '');
    if (t.startsWith(prefix) && (!contain || t.includes(contain))) hit = t;
  }
}
if (!hit) { console.error(`NOT FOUND: ${prefix}`); process.exit(1); }
JSON.parse(hit);
fs.writeFileSync(out, hit);
console.log(`saved ${out} (${hit.length} chars)`);

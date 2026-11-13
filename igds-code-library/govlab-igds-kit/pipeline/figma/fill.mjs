// Prints extract-spec.figma.js with JOBS filled (this exact text is what is sent to Figma MCP use_figma).
// Usage: node fill.mjs '[["36951:3690",null,0,1000],["81:1195","/Intent=Danger/",0,20]]'
import fs from 'node:fs';
const jobs = JSON.parse(process.argv[2]).map(([id, re, o = 0, c = 1000]) => `[${JSON.stringify(id)}, ${re ?? 'null'}, ${o}, ${c}]`).join(', ');
const s = fs.readFileSync(new URL(process.env.EXTRACTOR || './extract-spec.figma.js', import.meta.url), 'utf8').replace('__JOBS__', '[' + jobs + ']');
process.stdout.write(s.split('\n').filter((l) => !l.startsWith('//')).join('\n'));

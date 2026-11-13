#!/usr/bin/env node
/**
 * igds-registry / diff-registry.mjs <previous-dir> <current-dir>
 *
 * Compares two registry generations (components + tokens) and writes registry-changes.md:
 * what was added / removed / changed in the PUBLIC API between library versions. This is what
 * lets a team upgrade @igds/* without manually re-checking dozens of components.
 * Breaking changes (removed tag/attribute/value/event/slot/token) are listed first; exit code 3 if any.
 */
import fs from 'node:fs';
import path from 'node:path';

const [prevDir, curDir, outFile] = process.argv.slice(2);
const load = (d, f) => { const p = path.join(d, f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
const pc = load(prevDir, 'components.generated.json'), cc = load(curDir, 'components.generated.json');
const pt = load(prevDir, 'tokens.generated.json'), ct = load(curDir, 'tokens.generated.json');
if (!cc || !ct) { console.error('ERROR: current registry missing'); process.exit(1); }

const breaking = [], additions = [], changes = [];
const api = (reg) => new Map((reg?.components ?? []).map((c) => [c.tag, {
  attrs: new Map(c.props.filter((p) => p.isHtmlAttribute).map((p) => [p.attribute, p])),
  props: new Map(c.props.map((p) => [p.name, p])),
  events: new Set(c.events.map((e) => e.name)),
  slots: new Set(c.slots.map((s) => s.name)),
  methods: new Set(c.publicApiMethods.filter((m) => /consumer/.test(m.classification)).map((m) => m.name)),
}]));
const vals = (p) => [...String(p.type).matchAll(/"([^"]*)"/g)].map((m) => m[1]);
const P = api(pc), C = api(cc);
if (pc) {
  for (const [tag] of P) if (!C.has(tag)) breaking.push(`tag removed: \`${tag}\``);
  for (const [tag] of C) if (!P.has(tag)) additions.push(`tag added: \`${tag}\``);
  for (const [tag, cur] of C) {
    const prev = P.get(tag); if (!prev) continue;
    for (const [a, p] of prev.attrs) {
      if (!cur.attrs.has(a)) { const renamed = [...cur.attrs.values()].find((x) => x.name === p.name); breaking.push(renamed ? `\`${tag}\` attribute renamed: \`${a}\` → \`${renamed.attribute}\`` : `\`${tag}\` attribute removed: \`${a}\``); continue; }
      const q = cur.attrs.get(a);
      const pv = vals(p), qv = vals(q);
      for (const v of pv) if (qv.length && !qv.includes(v)) breaking.push(`\`${tag}[${a}]\` value removed: "${v}"`);
      for (const v of qv) if (!pv.includes(v)) additions.push(`\`${tag}[${a}]\` value added: "${v}"`);
      if (!pv.length && !qv.length && p.type !== q.type) changes.push(`\`${tag}.${p.name}\` type: \`${p.type}\` → \`${q.type}\``);
    }
    for (const [a] of cur.attrs) if (!prev.attrs.has(a) && ![...prev.attrs.values()].some((x) => x.name === cur.attrs.get(a).name)) additions.push(`\`${tag}\` attribute added: \`${a}\``);
    for (const [n] of prev.props) if (!cur.props.has(n)) breaking.push(`\`${tag}\` property removed: \`${n}\``);
    for (const k of ['events', 'slots', 'methods']) {
      for (const x of prev[k]) if (!cur[k].has(x)) breaking.push(`\`${tag}\` ${k.slice(0, -1)} removed: \`${x}\``);
      for (const x of cur[k]) if (!prev[k].has(x)) additions.push(`\`${tag}\` ${k.slice(0, -1)} added: \`${x}\``);
    }
  }
}
if (pt) {
  const PT = new Map(pt.tokens.map((t) => [t.name, t])), CT = new Map(ct.tokens.map((t) => [t.name, t]));
  for (const [n, t] of PT) if (!CT.has(n) && !t.themeNamespace) breaking.push(`token removed: \`${n}\``);
  for (const [n, t] of CT) if (!PT.has(n) && !t.themeNamespace) additions.push(`token added: \`${n}\``);
  for (const [n, t] of CT) { const o = PT.get(n); if (o && !t.themeNamespace && JSON.stringify(o.resolvedValues) !== JSON.stringify(t.resolvedValues)) changes.push(`token value changed: \`${n}\` ${JSON.stringify(o.resolvedValues)} → ${JSON.stringify(t.resolvedValues)}`); }
}

const L = ['# IGDS registry — changes between generations', ''];
L.push(`Previous: ${pc ? `@igds/core-web ${pc.sourcePackages['@igds/core-web']} · @igds/tokens ${pt?.sourcePackages?.['@igds/tokens']} (generated ${pc.generatedAt})` : '(none — first generation)'}`);
L.push(`Current:  @igds/core-web ${cc.sourcePackages['@igds/core-web']} · @igds/tokens ${ct.sourcePackages['@igds/tokens']} (generated ${cc.generatedAt})`, '');
L.push(`## ⚠️ Breaking for existing code (${breaking.length})`, '', ...(breaking.length ? breaking.map((x) => `- ${x}`) : ['(none)']), '');
L.push('Run `npm run igds:lint` on every consuming project — it will point at each usage that broke.', '');
L.push(`## Added (${additions.length})`, '', ...(additions.length ? additions.map((x) => `- ${x}`) : ['(none)']), '');
L.push(`## Changed (${changes.length})`, '', ...(changes.length ? changes.map((x) => `- ${x}`) : ['(none)']), '');
fs.writeFileSync(outFile ?? path.join(curDir, 'registry-changes.md'), L.join('\n'), 'utf8');
console.log(`[igds-diff] breaking ${breaking.length} · added ${additions.length} · changed ${changes.length}`);
if (breaking.length) process.exitCode = 3;

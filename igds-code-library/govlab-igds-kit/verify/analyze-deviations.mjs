#!/usr/bin/env node
// Deviation source analysis (plan v3 §2.2 step 2). For every failed L1 check of a set, determine WHERE the difference
// comes from, using verified data only:
//   token-value      the Figma variable's CSS token exists but resolves to a different value than Figma
//   component-css    the CSS token equals Figma, yet the component renders another value -> component uses a different token/value
//   figma-no-fill    Figma has no paint (transparent) where the component paints a colour
//   token-missing    the Figma variable has no CSS token at all
//   unknown          none of the above can be shown -> decision-required
// It also proposes the Figma-faithful fix rung (§2.2 step 3) but marks every proposal "to-implement", never applied here.
// Usage: node verify/analyze-deviations.mjs <setId>  -> verify/out/<setId>.deviations.json + verify/DEVIATIONS-<setId>.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REG = path.resolve(KIT, '../igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const setId = process.argv[2];
const sid = setId.replace(/:/g, '-');
const l1 = rd(path.join(KIT, 'verify/out', sid + '.l1.json'));
const spec = rd(path.join(KIT, 'spec/sets', sid + '.json'));
const vvc = new Map(rd(path.join(REG, 'knowledge/verified/variables-vs-css.json')).rows.map((r) => [r.figma, r]));

const rows = [];
for (const r of l1.results) {
  if (r.status !== 'fail') continue;
  const v = spec.variants.find((x) => x.name === r.variant);
  for (const c of r.checks.filter((x) => x.ok === false)) {
    const figVar = c.note?.startsWith('figma var ') ? c.note.slice(10) : (c.prop === 'stroke' ? v?.summary?.stroke?.var : null);
    const row = { variant: r.variant, theme: r.theme, prop: c.prop, figma: c.expected, code: c.actual, figmaVariable: figVar ?? null };
    if (c.prop === 'background' && c.expected === 'transparent') { row.source = 'figma-no-fill'; row.fix = 'fixed-by-hook or fixed-by-wrapper: render without background, as in Figma'; }
    else if (figVar) {
      const m = vvc.get(figVar);
      if (!m) { row.source = 'token-missing'; row.fix = 'fixed-by-token: igdsx token with the Figma value, applied via hook/wrapper'; }
      else {
        const tokenVal = r.theme === 'dark' ? m.dark?.css ?? m.light?.css : m.light?.css;
        row.cssToken = m.css; row.cssTokenValue = tokenVal;
        const want = typeof c.expected === 'object' ? c.expected.color : c.expected;
        if (String(tokenVal).toLowerCase() !== String(want).toLowerCase()) { row.source = 'token-value'; row.fix = `fixed-by-token: kit sets ${m.css} to the Figma value (scoped), decision if it affects other components`; }
        else { row.source = 'component-css'; row.fix = `fixed-by-hook/wrapper: make ${'igds-button'} use ${m.css} for this state (Figma binds ${figVar})`; }
      }
    } else { row.source = 'unknown'; row.fix = 'decision-required'; }
    rows.push(row);
  }
}
const bySource = {}; for (const x of rows) bySource[x.source] = (bySource[x.source] || 0) + 1;
fs.writeFileSync(path.join(KIT, 'verify/out', sid + '.deviations.json'), JSON.stringify({ setId, set: spec.set.name, tag: l1.tag, bySource, rows }, null, 1) + '\n');

// grouped markdown: one line per (prop, theme, figma var, figma value, code value, source)
const groups = new Map();
for (const x of rows) {
  const k = [x.prop, x.theme, x.figmaVariable, JSON.stringify(x.figma), JSON.stringify(x.code), x.source].join('|');
  if (!groups.has(k)) groups.set(k, { ...x, variants: [] });
  groups.get(k).variants.push(x.variant.replace(', Intent=Default', '').replace(/^State=/, ''));
}
const L = [`# Deviations: ${spec.set.name} (${setId}) vs ${l1.tag} — generated`, '', `Source: \`verify/out/${sid}.l1.json\` · Figma is the reference (plan v3 §2.2). Nothing below is applied yet.`, '', `By source: ${Object.entries(bySource).map(([k, n]) => `${k} ${n}`).join(' · ')}`, '', '| Property | Theme | Figma (variable) | Code (token) | Source | Variants | Proposed Figma-faithful fix |', '|---|---|---|---|---|---|---|'];
for (const g of groups.values()) {
  const fig = typeof g.figma === 'object' ? `${g.figma.color} ${g.figma.weight}px` : g.figma;
  const code = Array.isArray(g.code) ? g.code.map((x) => `${x.via} ${x.color ?? x.value} ${x.w ?? ''}`).join('; ') : g.code;
  L.push(`| ${g.prop} | ${g.theme} | ${fig}${g.figmaVariable ? ` (\`${g.figmaVariable}\`)` : ''} | ${code}${g.cssToken ? ` (\`${g.cssToken}\` = ${g.cssTokenValue})` : ''} | ${g.source} | ${g.variants.join('<br>')} | ${g.fix} |`);
}
fs.writeFileSync(path.join(KIT, `verify/DEVIATIONS-${sid}.md`), L.join('\n') + '\n');
console.log(JSON.stringify(bySource)); console.log(L.slice(6).join('\n'));

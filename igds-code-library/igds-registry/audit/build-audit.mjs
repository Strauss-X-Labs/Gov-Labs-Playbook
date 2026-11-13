#!/usr/bin/env node
/**
 * igds-registry / audit / build-audit.mjs — completeness & coverage audit (read-only).
 *
 * Inputs (all evidence is saved byte-exact; nothing here is typed by hand):
 *   audit/evidence/*.json           Figma: full-file inventory, sections, docs/styles, guideline content,
 *                                   remote instances, icons/atoms names, extra pages, libraries (Figma MCP)
 *   audit/evidence/code-runtime-defines.txt   every customElements.define() intercepted while the official bundle loads
 *   ../figma/snapshot/*.json, ../figma/figma-mapping.generated.json, ../components.generated.json,
 *   ../tokens.generated.json, ../runtime-verification.generated.json, node_modules/@igds/*
 * Outputs: audit/coverage.generated.json, audit/COVERAGE.generated.md
 *
 * Every number states its denominator. Nothing is called "verified" without an independent second method.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const A = path.dirname(fileURLToPath(import.meta.url));
const R = path.resolve(A, '..');
const P = path.resolve(R, '..');
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ev = (f) => J(path.join(A, 'evidence', f));

const inv = ev('figma-page-inventory.json');
const docs = ev('figma-docs-styles.json');
const guide = ev('figma-guidelines-content.json');
const remote = ev('figma-remote-instances.json');
const iconsAtoms = ev('figma-icons-atoms.json');
const part3 = ev('figma-part3-other-pages.json');
const libs1 = ev('figma-libraries-p1.json');
const vars = J(path.join(R, 'figma', 'snapshot', 'variables.json'));
const snapPages = [...J(path.join(R, 'figma', 'snapshot', 'part1.json')), ...J(path.join(R, 'figma', 'snapshot', 'part2.json'))];
const mapping = J(path.join(R, 'figma', 'figma-mapping.generated.json'));
const reg = J(path.join(R, 'components.generated.json'));
const tok = J(path.join(R, 'tokens.generated.json'));
const rt = fs.existsSync(path.join(R, 'runtime-verification.generated.json')) ? J(path.join(R, 'runtime-verification.generated.json')) : null;
const defines = JSON.parse(fs.readFileSync(path.join(A, 'evidence', 'code-runtime-defines.txt'), 'utf8').replace(/^DEFS:/, '').trim());

const compact = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');

// ───────────── 1. Figma page roles (by position between separator pages) ─────────────
const pages = inv.rows.map(([id, name, sets, variants, solo, instances, sections, tops, children, text]) => ({ id, name, sets, variants, solo, instances, sections, text }));
const idx = (id) => pages.findIndex((p) => p.id === id);
const role = (i) => {
  const p = pages[i];
  if (/^-+$/.test(p.name)) return 'separator';
  if (i < idx('4212:706')) return ['36363:8125', '82:38'].includes(p.id) ? 'foundation-library' : 'documentation';
  if (i < idx('78:562')) return 'documentation';           // Responsive Layout
  if (i < idx('3830:157')) return 'web-component';         // Accordion .. Updates
  if (i < idx('26026:5448')) return 'native-mobile';
  if (i < idx('22334:3')) return 'pattern-or-template';
  return 'test-or-scratch';
};
pages.forEach((p, i) => (p.role = role(i)));
const snapIds = new Set(snapPages.map((p) => p[0]));
const part3Ids = new Set(part3.map((p) => p[0]));
for (const p of pages) {
  const inSnap = snapPages.find((s) => s[0] === p.id) ?? part3.find((s) => s[0] === p.id);
  p.capturedInDetail = !!inSnap;                           // variant props captured
  p.capturedSets = inSnap ? inSnap[2].length : (p.id === '82:38' || p.id === '36363:8125') ? 'names only' : 0;
  p.missedByCapture = inSnap ? p.sets - inSnap[2].length : null; // second method vs first method
  p.mappedToCode = snapIds.has(p.id);                       // the Figma↔code mapping only ran on these pages
}
const byRole = {};
for (const p of pages) { const r = (byRole[p.role] ??= { pages: 0, sets: 0, variants: 0, solo: 0, instances: 0 }); r.pages++; r.sets += p.sets; r.variants += p.variants; r.solo += p.solo; r.instances += p.instances; }

// ───────────── 2. De-duplication (icons copied onto .Atoms) ─────────────
const iconSetNames = iconsAtoms.Icons.sets.map((s) => compact(s[1]));
const atomSets = iconsAtoms['.Atoms'].sets;
const atomDupOfIcons = atomSets.filter((s) => iconSetNames.includes(compact(s[1])));
const atomOwn = atomSets.filter((s) => !iconSetNames.includes(compact(s[1])));

// ───────────── 3. Icons: Figma vs @igds/icons ─────────────
const iconFiles = fs.readdirSync(path.join(P, 'node_modules', '@igds', 'icons', 'lib')).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => f.replace(/\.js$/, ''));
const codeIconBases = new Set(iconFiles.map((n) => compact(n.replace(/-(filled|outlined|outline|secondary-filled|failure-filled)$/, ''))));
const figmaIconSets = iconsAtoms.Icons.sets.filter((s) => s[1].trim());
const flags = iconsAtoms.Icons.solo.filter((s) => /^[A-Z]{2}$/.test(s[1]));
const iconMatched = figmaIconSets.filter((s) => codeIconBases.has(compact(s[1])) || [...codeIconBases].some((b) => b === compact(s[1]).replace(/ai$/, '-ai'.replace('-', ''))));
const iconUnmatched = figmaIconSets.filter((s) => !iconMatched.includes(s));
const figmaIconBases = new Set(figmaIconSets.map((s) => compact(s[1])));
const codeIconOnly = [...codeIconBases].filter((b) => !figmaIconBases.has(b));

// ───────────── 4. Component classification (5 categories) ─────────────
const pubWeb = mapping.componentSets.filter((m) => !m.figma.isPrivateBuildingBlock);
const strong = (m) => m.match.confidence === 'high' && !m.match.conflict && (m.comparison?.variantProps ?? []).some((v) => v.status === 'aligned' || v.status === 'state-ok' || v.status === 'maps-to-prop');
const cat = { A: [], B: [], C: [], D: [], E: [] };
for (const m of pubWeb) {
  const row = { figma: m.figma.name, page: m.figma.page, id: m.figma.id, tag: m.match.tag, confidence: m.match.confidence };
  if (!m.match.tag) cat.C.push({ ...row, reason: 'no code component (automatic)' });
  else if (strong(m)) cat.A.push({ ...row, reason: 'name + page + aligned prop/state (automatic, not human-reviewed)' });
  else cat.B.push({ ...row, reason: m.match.conflict ?? `confidence ${m.match.confidence}` });
}
// Figma public sets on pages the mapping never ran on (mobile, WIP)
for (const [pid, pname, sets] of part3) for (const s of sets) {
  if (/^[._]/.test(s[1].trim())) continue;
  const r = pages.find((p) => p.id === pid)?.role;
  cat.E.push({ figma: s[1].trim(), page: pname, id: s[0], tag: null, reason: r === 'native-mobile' ? 'native-mobile page — not mapped (web library scope); likely Figma-only' : 'pattern/WIP page — not mapped' });
}
// code tags without a public Figma set
const tagsWithPublic = new Set(pubWeb.map((m) => m.match.tag).filter(Boolean));
const privateSets = mapping.componentSets.filter((m) => m.figma.isPrivateBuildingBlock);
for (const c of reg.components) {
  if (tagsWithPublic.has(c.tag)) continue;
  const core = compact(c.tag.replace(/^igds-/, ''));
  const priv = privateSets.find((m) => compact(m.figma.name) === core || compact(m.figma.name).includes(core) && core.length > 4);
  if (priv) cat.B.push({ figma: priv.figma.name, page: priv.figma.page, id: priv.figma.id, tag: c.tag, confidence: 'private-building-block-name', reason: 'code tag matches a PRIVATE Figma building block by name only' });
  else cat.D.push({ tag: c.tag, reason: 'no public or private Figma set matched (often a sub-part drawn inside its parent)' });
}
// private building blocks with no code tag = undetermined (internal Figma construction)
const privUnmatched = privateSets.filter((m) => !cat.B.some((b) => b.id === m.figma.id));
const counts = Object.fromEntries(Object.entries(cat).map(([k, v]) => [k, v.length]));

// ───────────── 5. Tokens / styles ─────────────
const tokNames = new Set(tok.tokens.map((t) => t.name));
const textStyles = docs.styles.textNames;
const textMatched = textStyles.filter((n) => tokNames.has('--igds-base-type-' + n.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')));
const effectNames = docs.styles.effectNames;
const shadowTokens = tok.tokens.filter((t) => t.category === 'shadow' && !t.themeNamespace).map((t) => t.name);
const varTotals = mapping.tokens.collections.reduce((a, c) => ({ total: a.total + c.count, matched: a.matched + c.matched, figmaOnly: a.figmaOnly + c.figmaOnly, notInCode: a.notInCode + c.rows.filter((r) => r.status === 'collection-not-in-code').length }), { total: 0, matched: 0, figmaOnly: 0, notInCode: 0 });

// ───────────── 6. Code ─────────────
const enumTags = Object.values(reg.allKnownTags);
const code = {
  tags: { enumMembers: enumTags.length, extractedTS: reg.components.length, definedAtRuntimeIntercept: defines.filter((d) => d.startsWith('igds-')).length, registeredRuntimeCheck: rt?.summary?.registered ?? null,
    agreementAll4: enumTags.length === reg.components.length && reg.components.length === defines.filter((d) => d.startsWith('igds-')).length && defines.every((d) => !d.startsWith('igds-') || enumTags.includes(d)) },
  modules: Object.keys(J(path.join(P, 'node_modules', '@igds', 'core-web', 'package.json')).exports).length - 1,
  props: reg.summary.totalConsumerConfigurablePropsExtracted,
  attributesRuntimeVerified: rt ? reg.components.reduce((s, c) => s + c.props.filter((p) => p.isHtmlAttribute).length, 0) : 0,
  events: reg.components.reduce((s, c) => s + c.events.length, 0),
  slots: reg.components.reduce((s, c) => s + c.slots.length, 0),
  methodsConsumer: reg.components.reduce((s, c) => s + c.publicApiMethods.filter((m) => /consumer/.test(m.classification)).length, 0),
  icons: { inPackage: iconFiles.length, inRegistry: 0 },
  tokens: { inPackage: tok.summary.totalTokens, extracted: tok.summary.totalTokens },
  otherPackages: { '@igds/react': 'UNKNOWN — registry returned 401 (no NPM_TOKEN in audit shell)', '@igds/angular': 'UNKNOWN — 401', note: 'referenced by MD/MD/frontend-constitution.md; not installed' },
};

const out = {
  generatedAt: new Date().toISOString(),
  figma: {
    file: 'FXkIGvCtnuZZDrMjiSm29r', pages: pages.length, totals: inv.totals, byRole,
    pages: pages.map(({ id, name, role, sets, variants, solo, instances, sections, text, capturedInDetail, capturedSets, missedByCapture, mappedToCode }) => ({ id, name, role, sets, variants, solo, instances, sections, text, capturedInDetail, capturedSets, missedByCapture, mappedToCode })),
    dedup: { atomsSets: atomSets.length, atomsDuplicatingIconSets: atomDupOfIcons.length, atomsOwn: atomOwn.map((s) => s[1]) },
    documentation: { setsWithDescription: docs.agg.withDesc, publicSets: docs.agg.publicSets, publicWithDescription: docs.agg.publicWithDesc, docLinks: docs.agg.withLinks, sectionsByKind: guide.agg, extractedIntoRegistry: 0 },
    styles: { text: docs.styles.text, effect: docs.styles.effect, grid: docs.styles.grid, paint: docs.styles.paint, textStylesWithCssToken: textMatched.length, effectStyles: effectNames, shadowTokensInCode: shadowTokens.length },
    variables: { collections: vars.length, ...varTotals },
    libraries: { addedToFile: libs1.libraries_added_to_file.map((l) => `${l.name} (${l.source})`), remoteInstanceSample: remote.agg, distinctRemoteMainComponents: remote.distinctRemoteMainComponents },
    layoutTemplates: part3.find((p) => p[0] === '5820:27710')[3].map((s) => s[1]),
  },
  icons: { figmaIconSets: figmaIconSets.length, figmaFlags: flags.length, matchedToCodeIcon: iconMatched.length, figmaOnly: iconUnmatched.map((s) => s[1]), codeIconFiles: iconFiles.length, codeIconBaseNames: codeIconBases.size, codeOnlyBaseNames: codeIconOnly.length },
  componentClassification: { definition: { A: 'in Figma & code — strong automatic match (name+page+aligned prop/state); NOT human-reviewed', B: 'in both — match needs review', C: 'Figma only', D: 'code only', E: 'cannot determine (not mapped)' }, counts, privateBuildingBlocksUnmatched: privUnmatched.length, rows: cat },
  code,
};
fs.writeFileSync(path.join(A, 'coverage.generated.json'), JSON.stringify(out, null, 2));

// ───────────── markdown ─────────────
const L = [];
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');
L.push('# IGDS — Coverage audit (generated)', '', `Generated ${out.generatedAt} by \`igds-registry/audit/build-audit.mjs\` from \`audit/evidence/\` (byte-exact Figma MCP results) + registry outputs.`, '');
L.push('## Figma — pages by role', '', '| role | pages | component sets | variants | standalone comps | instances |', '|---|---|---|---|---|---|');
for (const [r, v] of Object.entries(byRole)) L.push(`| ${r} | ${v.pages} | ${v.sets} | ${v.variants} | ${v.solo} | ${v.instances} |`);
L.push(`| **total** | ${pages.length} | ${inv.totals.sets} | ${inv.totals.variants} | ${inv.totals.solo} | ${inv.totals.inst} |`, '');
L.push('## Figma — per page: discovered vs captured vs mapped', '', '| page | role | sets (inventory) | captured in detail | missed by capture | mapped to code |', '|---|---|---|---|---|---|');
for (const p of pages.filter((x) => x.role !== 'separator')) L.push(`| ${p.name} | ${p.role} | ${p.sets} | ${p.capturedInDetail ? p.capturedSets : p.capturedSets || 'no'} | ${p.missedByCapture ?? '—'} | ${p.mappedToCode ? 'yes' : 'no'} |`);
L.push('', '## Component classification', '', '| category | count |', '|---|---|');
for (const [k, d] of Object.entries(out.componentClassification.definition)) L.push(`| ${k} — ${d} | ${counts[k]} |`);
L.push(`| private Figma building blocks not linked to code (internal construction) | ${privUnmatched.length} |`, '');
for (const k of ['A', 'B', 'C', 'D', 'E']) { L.push(`### ${k} — ${out.componentClassification.definition[k]}`, ''); L.push(cat[k].map((r) => r.tag && r.figma ? `${r.figma} → \`${r.tag}\`` : r.tag ? `\`${r.tag}\`` : `${r.figma} (${r.page})`).join(' · ') || '(none)', ''); }
L.push('## Icons', '', `Figma icon sets ${figmaIconSets.length} (+${flags.length} country flags) · matched to @igds/icons by name ${iconMatched.length} (${pct(iconMatched.length, figmaIconSets.length)}) · @igds/icons files ${iconFiles.length} (${codeIconBases.size} base names) · in registry: 0`, '', `Figma-only icon names: ${iconUnmatched.map((s) => s[1]).join(', ')}`, '');
fs.writeFileSync(path.join(A, 'COVERAGE.generated.md'), L.join('\n'));
console.log(JSON.stringify({ figmaTotals: inv.totals, byRole, counts, privUnmatched: privUnmatched.length, icons: { figma: figmaIconSets.length, matched: iconMatched.length, code: iconFiles.length }, atomsDup: atomDupOfIcons.length, textStylesWithToken: textMatched.length, missedByCapture: pages.filter((p) => p.missedByCapture).map((p) => [p.name, p.missedByCapture]), code: code.tags }, null, 1));

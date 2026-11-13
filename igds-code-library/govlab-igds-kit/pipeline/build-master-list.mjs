#!/usr/bin/env node
// Master list (plan v3 §3): one row per Figma DS item that the web library must cover, with pipeline status.
// Built only from data already captured (no Figma call): igds-registry/figma/snapshot + mapping, knowledge/figma/*,
// and govlab-igds-kit/spec/sets (normalized specs). Pipeline status fields that are not yet produced stay "pending".
// Existing per-row human fields (decision, owner, notes) in master-list.json are preserved on rebuild.
//
// Usage: node pipeline/build-master-list.mjs   -> master-list.json + MASTER-STATUS.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REG = path.resolve(KIT, '../igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const mapping = rd(path.join(REG, 'figma/figma-mapping.generated.json'));
const overrides = fs.existsSync(path.join(REG, 'figma/figma-mapping.overrides.json')) ? rd(path.join(REG, 'figma/figma-mapping.overrides.json')) : {};
const pages = [...rd(path.join(REG, 'figma/snapshot/part1.json')), ...rd(path.join(REG, 'figma/snapshot/part2.json'))];
const pageCounts = rd(path.join(REG, 'figma/snapshot/pageCounts.json')).pages;
const icons = rd(path.join(REG, 'knowledge/figma/icons.json'));
const iconsVsCode = rd(path.join(REG, 'knowledge/verified/icons-vs-code.json'));
const patterns = rd(path.join(REG, 'knowledge/figma/patterns.json'));
const layouts = rd(path.join(REG, 'knowledge/figma/layouts.json'));
const variables = rd(path.join(REG, 'knowledge/figma/variables.json'));
const styles = rd(path.join(REG, 'knowledge/figma/styles.json'));

// normalized specs
const specDir = path.join(KIT, 'spec/sets');
const specs = new Map();
if (fs.existsSync(specDir)) for (const f of fs.readdirSync(specDir)) { const s = rd(path.join(specDir, f)); specs.set(s.set.id, { file: 'spec/sets/' + f, spec: s }); }
// verification ledger (written by the verifier; absent until it runs)
const ledgerPath = path.join(KIT, 'verify/ledger.json');
const ledger = fs.existsSync(ledgerPath) ? rd(ledgerPath) : { rows: [] };
// implementation that SHIPS for a Figma set: a generated component (src/ext/*/contract.json) wins over the official
// candidate; only that implementation's ledger rows count as verification. Other rows remain evidence (e.g. why replaced).
const implBySet = new Map();
const extRoot = path.join(KIT, 'src/ext');
if (fs.existsSync(extRoot)) for (const d of fs.readdirSync(extRoot)) { const c = rd(path.join(extRoot, d, 'contract.json')); implBySet.set(c.figma.setId, { tag: d, layer: 'generated', contract: c }); }
// generic generator (pipeline/generate/gen-all.mjs): every other set with variants
const genCat = path.join(KIT, 'src/gen/catalog.json');
if (fs.existsSync(genCat)) for (const c of rd(genCat).components) if (c.variants && !implBySet.has(c.figma.id)) implBySet.set(c.figma.id, { tag: c.tag, layer: 'generated-generic', contract: null });
const verifiedBySet = new Map();
for (const r of ledger.rows) {
  if (r.level !== 'L1') continue;
  const impl = implBySet.get(r.setId); if (impl && r.tag !== impl.tag) continue;
  const k = r.setId; if (!verifiedBySet.has(k)) verifiedBySet.set(k, { pass: new Set(), other: new Set() });
  (r.status === 'pass' ? verifiedBySet.get(k).pass : verifiedBySet.get(k).other).add((r.variantId || r.variant) + '|' + r.theme);
}
const extra = (tag, level) => { const x = ledger.rows.filter((r) => r.tag === tag && r.level === level); return { pass: x.filter((r) => r.status === 'pass').length, total: x.length }; };

const prev = fs.existsSync(path.join(KIT, 'master-list.json')) ? rd(path.join(KIT, 'master-list.json')) : { rows: [] };
const human = new Map(prev.rows.map((r) => [r.key, { decision: r.decision ?? null, owner: r.owner ?? null, notes: r.notes ?? null }]));

const rows = [];
const add = (r) => rows.push({ ...r, ...(human.get(r.key) || { decision: null, owner: null, notes: null }) });

// Figma's own variant count for an item known only through its spec (dependencies): the largest 'totalMatching' any
// capture reported for the unfiltered set (REST captures report the full child count of the set node).
const figmaTotal = (id) => { const s = specs.get(id); if (!s) return null; const t = s.spec.sources.filter((x) => x.filter === null).map((x) => x.totalMatching); return t.length ? Math.max(...t) : null; };
const extractStatus = (id, variantCount) => {
  const s = specs.get(id);
  if (!s) return { extract: 'pending', extractedVariants: 0, extractDetail: null, spec: null };
  const c = s.spec.coverage;
  const n = c.uniqueVariants;
  return { extract: variantCount != null && n >= variantCount && c.detail.summary === 0 ? 'done' : 'partial', extractedVariants: n, extractDetail: c.detail, spec: s.file };
};
const verifyStatus = (id, variantCount) => {
  const v = verifiedBySet.get(id);
  const passed = v ? v.pass.size : 0;
  const impl = implBySet.get(id);
  const out = { verify: !v ? 'pending' : v.other.size === 0 && variantCount && passed >= variantCount * 2 ? 'L1-done' : 'in-progress', verifiedVariantThemes: passed, targetVariantThemes: variantCount != null ? variantCount * 2 : null };
  if (impl) Object.assign(out, { path: 'generated', implementation: impl.tag, layer: impl.layer, generate: 'done', behavior: extra(impl.tag, 'behavior'), axe: extra(impl.tag, 'axe'), L2: extra(impl.tag, 'L2') });
  return out;
};

// 1) component sets on web pages (199) — from the mapping (which already carries the snapshot facts)
const known = new Set();
for (const cs of mapping.componentSets) {
  const f = cs.figma; known.add(f.id);
  const ov = overrides[f.id] || overrides[f.name];
  const tag = ov?.tag ?? cs.match.tag;
  add({
    key: 'set:' + f.id, kind: f.isPrivateBuildingBlock ? 'building-block' : 'component-set', id: f.id, name: f.name, page: f.page,
    variants: f.variantCount,
    officialCandidate: tag ? { tag, confidence: ov ? 'human' : cs.match.confidence } : null,
    path: 'unclassified', tier: null,
    ...extractStatus(f.id, f.variantCount), generate: 'pending', ...verifyStatus(f.id, f.variantCount), blocker: null,
  });
}
// 2) standalone components on web pages
const webPageIds = new Set(mapping.componentSets.map((c) => c.figma.pageId));
for (const [pageId, pageName, , standalone] of pages) {
  if (!webPageIds.has(pageId) && !standalone?.length) continue;
  for (const [id, name] of standalone || []) {
    known.add(id);
    add({ key: 'comp:' + id, kind: 'standalone-component', id, name, page: pageName, variants: 1, officialCandidate: null, path: 'unclassified', tier: null, ...extractStatus(id, 1), generate: 'pending', ...verifyStatus(id, 1), blocker: null });
  }
}
// 3) atoms (.Atoms page, non-icon) and dependency sets discovered inside extracted specs
for (const a of icons.atoms || []) {
  known.add(a.id);
  add({ key: 'set:' + a.id, kind: 'building-block', id: a.id, name: a.name, page: '.Atoms', variants: a.variants, officialCandidate: null, path: 'unclassified', tier: null, ...extractStatus(a.id, a.variants), generate: 'pending', ...verifyStatus(a.id, a.variants), blocker: null });
}
const deps = new Map();
const walk = (n, from) => { if (n.inst?.setId && !known.has(n.inst.setId)) { const d = deps.get(n.inst.setId) || { name: n.inst.set, usedBy: new Set(), remote: !!n.inst.remote }; d.usedBy.add(from); deps.set(n.inst.setId, d); } for (const c of n.c || []) walk(c, from); };
for (const { spec } of specs.values()) for (const v of spec.variants) if (v.tree) walk(v.tree, spec.set.name);
const iconIds = new Set(icons.iconSets.map((i) => i.id));
for (const [id, d] of deps) {
  if (iconIds.has(id)) continue; // icons are covered by icon rows
  known.add(id);
  const s = specs.get(id);
  add({ key: 'set:' + id, kind: 'dependency', id, name: d.name, page: s ? null : 'unknown (discovered as instance)', variants: figmaTotal(id), usedBy: [...d.usedBy].sort(), remote: d.remote || undefined, officialCandidate: null, path: 'unclassified', tier: null, ...extractStatus(id, figmaTotal(id)), generate: 'pending', ...verifyStatus(id, figmaTotal(id)), blocker: null });
}
// sets that were extracted but are in none of the above (e.g. orphaned in Figma)
for (const [id, { spec, file }] of specs) if (!known.has(id)) {
  known.add(id);
  add({ key: 'set:' + id, kind: 'dependency', id, name: spec.set.name, page: 'not in web snapshot', variants: figmaTotal(id), officialCandidate: null, path: 'unclassified', tier: null, ...extractStatus(id, figmaTotal(id)), generate: 'pending', ...verifyStatus(id, figmaTotal(id)), blocker: null });
}
// 4) icons
const iconStatus = new Map(iconsVsCode.rows.map((r) => [r.id, r]));
for (const i of icons.iconSets) add({ key: 'icon:' + i.id, kind: 'icon-set', id: i.id, name: i.name, page: 'Icons', variants: null, inOfficialIcons: !!iconStatus.get(i.id)?.inCode, path: iconStatus.get(i.id)?.inCode ? 'official-icon' : 'export-svg', extract: 'pending', generate: 'pending', verify: 'pending', blocker: null });
// 4b) standalone components on the Icons page (country flags etc.), captured byte-exact in spec/inventory/
const iconStandalonePath = path.join(KIT, 'spec/inventory/icons-page-standalone.json');
if (fs.existsSync(iconStandalonePath)) for (const [id, name, w, h] of rd(iconStandalonePath).comps) {
  const k = 'icon:' + id; if (rows.some((r) => r.key === k)) continue;
  const i = rows.findIndex((r) => r.kind === 'dependency' && r.id === id); if (i >= 0) rows.splice(i, 1);
  add({ key: k, kind: 'icon-component', id, name, page: 'Icons', size: [w, h], path: /^[A-Z]{2}$/.test(name) ? 'export-svg (flag)' : 'export-svg', extract: 'pending', generate: 'pending', verify: 'pending', blocker: null });
}
// the icon instance used inside Button ("plus", .Atoms page standalone) is an icon, not a component dependency
for (const r of rows) if (r.kind === 'dependency' && /^(plus)$/.test(r.name)) { r.kind = 'icon-component'; r.page = '.Atoms (standalone)'; r.path = 'official-icon-or-export'; }
// 5) patterns, layouts, grids
for (const p of patterns.patterns) add({ key: 'pattern:' + p.id, kind: 'pattern', id: p.id, name: p.name, page: 'Design patterns', path: 'template', extract: 'pending', generate: 'pending', verify: 'pending', blocker: null });
for (const l of layouts.layouts) add({ key: 'layout:' + l.id, kind: 'layout', id: l.id, name: l.name, page: 'Responsive Layout', path: 'template', extract: 'pending', generate: 'pending', verify: 'pending', blocker: null });
for (const [name] of layouts.grids) add({ key: 'grid:' + name, kind: 'grid', id: null, name, page: 'Responsive Layout', path: 'tokens', extract: 'done', generate: 'pending', verify: 'pending', blocker: null });
// 6) design settings: variable collections and style groups
for (const c of variables.collections) add({ key: 'vars:' + c.c, kind: 'token-collection', id: c.id, name: c.c, modes: c.modes, count: c.v.length, path: 'tokens', extract: 'done', generate: 'pending', verify: 'pending', blocker: null });
for (const g of ['text', 'effect', 'grid', 'paint']) add({ key: 'styles:' + g, kind: 'style-group', id: null, name: g + ' styles', count: styles[g].length, path: 'tokens', extract: 'done', generate: 'pending', verify: 'pending', blocker: null });

// 7) pages outside the web scope — recorded so nothing silently disappears
const scopeOf = (name) => (/mobile|NATIVE/i.test(name) ? 'native-mobile (decision D3)' : /🚧/.test(name) ? 'work-in-progress page (decision required)' : null);
for (const [id, name, setsN, compN] of pageCounts) {
  const scope = scopeOf(name);
  if (!scope || setsN + compN === 0) continue;
  add({ key: 'page:' + id, kind: 'excluded-page', id, name, sets: setsN, standalone: compN, path: 'excluded', reason: scope, extract: 'n/a', generate: 'n/a', verify: 'n/a', blocker: null });
}

rows.sort((a, b) => a.key.localeCompare(b.key));
const out = { schema: 'igdsx-master-list/1', figmaFile: mapping.figmaFile.key, sources: { snapshot: mapping.layers.figmaFacts, specs: specs.size, ledgerRows: ledger.rows.length }, rows };
fs.writeFileSync(path.join(KIT, 'master-list.json'), JSON.stringify(out, null, 1) + '\n');

// ---------- status report ----------
const by = (k) => rows.filter((r) => r.kind === k);
const sum = (arr, f) => arr.reduce((s, r) => s + (f(r) || 0), 0);
const compKinds = ['component-set', 'building-block', 'standalone-component', 'dependency'];
const lines = [];
lines.push('# Master list status (generated, do not edit)', '', `Source: \`master-list.json\` · rebuild: \`node pipeline/build-master-list.mjs\``, '');
lines.push('## Components and variants', '', '| Kind | Items | Variants in Figma | Variants extracted (tree) | Variants extracted (summary only) | Items fully extracted | Variant×theme verified (pass) |', '|---|---|---|---|---|---|---|');
for (const k of compKinds) {
  const a = by(k);
  lines.push(`| ${k} | ${a.length} | ${sum(a, (r) => r.variants) || (a.every((r) => r.variants == null) ? 'unknown' : sum(a, (r) => r.variants))} | ${sum(a, (r) => r.extractDetail?.tree)} | ${sum(a, (r) => r.extractDetail?.summary)} | ${a.filter((r) => r.extract === 'done').length} | ${sum(a, (r) => r.verifiedVariantThemes)} |`);
}
const all = rows.filter((r) => compKinds.includes(r.kind));
lines.push(`| **total** | **${all.length}** | **${sum(all, (r) => r.variants)}**${all.some((r) => r.variants == null) ? " (+ unknown for some discovered dependencies)" : ""} | **${sum(all, (r) => r.extractDetail?.tree)}** | **${sum(all, (r) => r.extractDetail?.summary)}** | **${all.filter((r) => r.extract === 'done').length}** | **${sum(all, (r) => r.verifiedVariantThemes)}** |`, '');
const impl = all.filter((r) => r.implementation);
lines.push('## Components implemented in the kit (code exists in dist/)', '', '"Fully verified" = every Figma variant × theme passes L1 (per-node geometry, colour, typography) + every applicable behaviour check (real hover / press / keyboard focus / disabled select the Figma state; not-applicable where Figma has no such variant) + axe with 0 violations. L2 (pixel diff against Figma PNG) is DIAGNOSTIC: calibration (verify/out/81-1195.igdsx-button.l2-calibration.json) shows Figma vs browser glyph rasterisation overlaps real defects, so it does not decide pass/fail.', '', '| Component | Figma set | Variants | L1 variant×theme pass | Behaviour | axe runs clean | L2 (diagnostic) | Fully verified |', '|---|---|---|---|---|---|---|---|');
let nFull = 0, nVar = 0, nVarL1 = 0;
for (const r of impl) { const beh = { pass: r.behavior.pass, total: r.behavior.total - ledger.rows.filter((x) => x.tag === r.implementation && x.level === 'behavior' && x.status === 'not-applicable').length }; const full = r.verifiedVariantThemes === r.targetVariantThemes && beh.pass === beh.total && r.axe.pass === r.axe.total && r.axe.total > 0; if (full) nFull++; nVar += r.variants || 0; nVarL1 += r.verifiedVariantThemes || 0; lines.push(`| \`${r.implementation}\` | ${String(r.name).replace(/\|/g, '/')} (${r.id}) | ${r.variants} | ${r.verifiedVariantThemes}/${r.targetVariantThemes} | ${beh.pass}/${beh.total} | ${r.axe.pass}/${r.axe.total} | ${r.L2.total ? r.L2.pass + '/' + r.L2.total : '—'} | ${full ? 'yes' : 'no'} |`); }
lines.splice(lines.indexOf('## Components implemented in the kit (code exists in dist/)') + 1, 0, '', `**Summary: ${impl.length} components in code · ${nVar} Figma variants implemented · ${nVarL1}/${nVar * 2} variant×theme rows pass L1 · ${nFull} components fully verified.**`);
lines.push('', `Official components shipped unchanged (vendored, not yet verified against Figma): 73 tags from @igds/core-web.`, '');
lines.push('## Design settings, icons, templates', '', '| Kind | Items | Generated | Verified |', '|---|---|---|---|');
for (const k of ['token-collection', 'style-group', 'grid', 'icon-set', 'icon-component', 'pattern', 'layout']) { const a = by(k); lines.push(`| ${k} | ${a.length} | ${a.filter((r) => r.generate === 'done').length} | ${a.filter((r) => r.verify === 'done').length} |`); }
lines.push('', '## Excluded pages (recorded, not silently dropped)', '', '| Page | Sets | Standalone | Reason |', '|---|---|---|---|');
for (const r of by('excluded-page')) lines.push(`| ${r.name} | ${r.sets} | ${r.standalone} | ${r.reason} |`);
lines.push('', '## Items with extracted specs', '', '| Item | Kind | Variants in Figma | Extracted | Status | Spec |', '|---|---|---|---|---|---|');
for (const r of all.filter((r) => r.spec)) lines.push(`| ${r.name} (${r.id}) | ${r.kind} | ${r.variants ?? 'unknown'} | ${r.extractedVariants}${r.extractDetail?.summary ? ` (${r.extractDetail.summary} summary-only)` : ''} | ${r.extract} | \`${r.spec}\` |`);
const deps2 = by('dependency').filter((r) => !r.spec);
if (deps2.length) { lines.push('', '## Dependencies discovered inside extracted specs (not yet extracted)', '', '| Set | Used by |', '|---|---|'); for (const r of deps2) lines.push(`| ${r.name} (${r.id})${r.remote ? ' — remote library' : ''} | ${r.usedBy.join(', ')} |`); }
fs.writeFileSync(path.join(KIT, 'MASTER-STATUS.md'), lines.join('\n') + '\n');
console.log(lines.slice(0, 20).join('\n'));

#!/usr/bin/env node
/**
 * igds-registry / build-figma-mapping.mjs
 *
 * Joins three SEPARATE layers and never mixes them:
 *   1. Figma facts   — igds-registry/figma/snapshot/*.json   (captured via Figma MCP, read-only; see figma/README.md)
 *   2. Code facts    — components.generated.json, tokens.generated.json (from the installed packages)
 *   3. Human decisions — igds-registry/figma/figma-mapping.overrides.json (optional, reviewed, version-controlled)
 * and writes DERIVED conclusions, each carrying its method + confidence:
 *   - igds-registry/figma/figma-mapping.generated.json
 *   - igds-registry/figma/figma-gaps.generated.md   (the single gaps report)
 *
 * Matching is automatic (name normalization + page context + variant-value overlap). Nothing is
 * hand-mapped per component here; ambiguous results are marked "needs-review", not guessed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryRoot = path.resolve(__dirname, '..');
const figmaDir = path.join(registryRoot, 'figma');
const snapDir = path.join(figmaDir, 'snapshot');
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
for (const f of ['meta.json', 'part1.json', 'part2.json', 'variables.json']) {
  if (!fs.existsSync(path.join(snapDir, f))) { console.error(`ERROR: missing Figma snapshot ${f}. See igds-registry/figma/README.md`); process.exit(1); }
}
const meta = readJSON(path.join(snapDir, 'meta.json'));
const pages = [...readJSON(path.join(snapDir, 'part1.json')), ...readJSON(path.join(snapDir, 'part2.json'))];
const variables = readJSON(path.join(snapDir, 'variables.json'));
const components = readJSON(path.join(registryRoot, 'components.generated.json'));
const tokens = readJSON(path.join(registryRoot, 'tokens.generated.json'));
const overridesFile = path.join(figmaDir, 'figma-mapping.overrides.json');
const overrides = fs.existsSync(overridesFile) ? readJSON(overridesFile) : { componentSets: {} };

// ---------------- normalization ----------------
const STOP = new Set(['new', 'old', 'desktop', 'mobile', 'atom', 'atoms', 'item', 'items', 'bar', 'field', 'component', 'regular', 'default', 'the']);
const stem = (w) => w.replace(/(ies)$/, 'y').replace(/(ers|er|s)$/, '').replace(/ing$/, '');
const words = (s) => String(s).replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const tokensOf = (s) => new Set(words(s).filter((w) => !STOP.has(w)).map(stem));
const compact = (s) => words(s).join('');
const jaccard = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / (a.size + b.size - i || 1); };
const normValue = (v) => String(v).toLowerCase().trim().replace(/[\s_/]+/g, '-');

// ---------------- code side ----------------
const code = components.components.map((c) => {
  const enums = {};
  for (const p of c.props) { const vals = [...String(p.type).matchAll(/"([^"]+)"/g)].map((m) => m[1]); if (vals.length > 1) enums[p.name] = vals; }
  return { tag: c.tag, className: c.className, module: c.npmModule, tokens: new Set([...tokensOf(c.tag.replace(/^igds-/, '')), ...tokensOf(c.className)]), compact: compact(c.tag.replace(/^igds-/, '')), enums, props: c.props, slots: c.slots };
});

// ---------------- Figma side ----------------
const figmaSets = [];
for (const [pageId, pageName, sets, solo] of pages) {
  for (const [id, name, variantCount, variantProps, otherProps] of sets) {
    figmaSets.push({ id, name: name.trim(), pageId, pageName, variantCount, variantProps, otherProps, isPrivate: /^[._]/.test(name.trim()) });
  }
}

// interaction states are not component props (they are runtime CSS states), except those that map to props
const INTERACTION_STATES = new Set(['default', 'hover', 'pressed', 'focused', 'focus', 'active', 'while-pressing', 'hover-selected', 'pressed-selected', 'hover-edit']);
const STATE_TO_PROP = { disabled: ['disabled'], error: ['invalid', 'error'], errorfocused: ['invalid', 'error'], 'pre-filled': ['value', 'defaultValue'], selected: ['checked', 'selected'], expanded: ['expanded', 'open'], current: ['current'] };
const LAYOUT_AXES = new Set(['rtl', 'ltr', 'device', 'format', 'mobile']); // RTL = dir attribute; device/format = responsive
const PROP_SYNONYMS = { type: ['variant', 'type'], size: ['size'], positioning: ['orientation'], direction: ['direction', 'orientation'], position: ['position', 'placement'], status: ['variant', 'type', 'status'], style: ['variant', 'inverted'], width: ['width'], expanded: ['expanded', 'open'] };
const BOOL_SYNONYMS = { mandatory: ['required'], help: ['helpText'], 'help text': ['helpText'], 'show help text': ['helpText'], tooltip: ['tooltip'], 'question tooltip': ['tooltipQuestion'], label: ['label'], 'show label': ['label'], icon: ['icon', 'iconOnly'], divider: ['divider'], 'close button': ['closable', 'dismissible', 'showCloseButton'] };

function matchSet(fs_) {
  const ov = overrides.componentSets?.[fs_.id];
  if (ov) return { tag: ov.tag ?? null, method: 'human-override', confidence: 'decided', note: ov.note ?? null };
  const setTok = tokensOf(fs_.name), pageTok = tokensOf(fs_.pageName), setC = compact(fs_.name), pageC = compact(fs_.pageName);
  const scored = code.map((c) => {
    let s = 0; const why = [];
    if (setC === c.compact) { s += 1.0; why.push('name-equal'); }
    else if (setC && c.compact && (setC.startsWith(c.compact) || c.compact.startsWith(setC))) { s += 0.6; why.push('name-prefix'); }
    const j = jaccard(setTok, c.tokens); if (j > 0) { s += j * 0.6; why.push(`name-tokens:${j.toFixed(2)}`); }
    const pj = Math.max(pageC === c.compact ? 1 : 0, jaccard(pageTok, c.tokens)); if (pj > 0) { s += pj * 0.3; why.push(`page:${pj.toFixed(2)}`); }
    // variant-value overlap
    const figVals = new Set(Object.entries(fs_.variantProps).filter(([k]) => !LAYOUT_AXES.has(k.toLowerCase())).flatMap(([, v]) => v.map(normValue)));
    const codeVals = new Set(Object.values(c.enums).flat().map(normValue));
    const ov2 = [...figVals].filter((v) => codeVals.has(v) && !INTERACTION_STATES.has(v)).length;
    if (ov2) { s += Math.min(ov2, 4) * 0.2; why.push(`values:${ov2}`); }
    return { tag: c.tag, score: +s.toFixed(3), why, pageSignal: pj };
  }).sort((a, b) => b.score - a.score);
  const [best, second] = scored;
  if (!best || best.score < 0.45) return { tag: null, method: 'auto', confidence: 'none', closest: scored.slice(0, 2).filter((x) => x.score > 0.15) };
  const margin = best.score - (second?.score ?? 0);
  const strongName = best.why.includes('name-equal') || best.why.includes('name-prefix');
  // 'high' needs: a strong name signal, a clear margin over the runner-up, AND agreement with the page it lives on.
  let confidence = strongName && margin >= 0.25 && best.pageSignal > 0 ? 'high' : margin >= 0.25 ? 'medium' : 'needs-review';
  // Value-evidence conflict: best shares NO variant values, but another name/page-related candidate does
  // (e.g. "Checkbox vertical/horizontal" Positioning=Vertical|Horizontal vs igds-checkbox-group orientation).
  const hasValues = (x) => x.why.some((w) => w.startsWith('values:'));
  const valueRival = scored.slice(1).find((x) => hasValues(x) && x.pageSignal > 0 && x.score > 0.3);
  let conflict = null;
  if (!hasValues(best) && valueRival) { confidence = 'needs-review'; conflict = `variant values match ${valueRival.tag}, not ${best.tag}`; }
  const runnerUp = valueRival && !hasValues(best) ? valueRival : second;
  return { tag: best.tag, method: 'auto', confidence, score: best.score, evidence: best.why, conflict, runnerUp: runnerUp && runnerUp.score > 0.3 ? { tag: runnerUp.tag, score: runnerUp.score } : null };
}

function compareProps(fs_, c) {
  const out = { variantProps: [], booleanTextProps: [] };
  for (const [prop, values] of Object.entries(fs_.variantProps)) {
    const key = prop.toLowerCase().trim();
    if (LAYOUT_AXES.has(key)) { out.variantProps.push({ figmaProp: prop, kind: key === 'rtl' || key === 'ltr' ? 'direction (use dir attribute)' : 'responsive (no prop — layout/CSS)', status: 'not-a-component-prop' }); continue; }
    if (key === 'state' || key === 'states' || key === 'status' && values.some((v) => INTERACTION_STATES.has(normValue(v)))) {
      const mapped = values.map((v) => {
        const nv = normValue(v).replace(/-/g, '');
        if (INTERACTION_STATES.has(normValue(v))) return { value: v, status: 'interaction-state (runtime, no prop)' };
        const cands = STATE_TO_PROP[nv] || STATE_TO_PROP[normValue(v)];
        const hit = cands?.find((p) => c.props.some((x) => x.name === p));
        return hit ? { value: v, status: 'maps-to-prop', prop: hit } : { value: v, status: cands ? 'GAP-no-matching-prop' : 'unclassified-state' };
      });
      out.variantProps.push({ figmaProp: prop, kind: 'state', status: mapped.some((m) => m.status.startsWith('GAP')) ? 'state-gaps' : 'state-ok', values: mapped });
      continue;
    }
    // find code enum prop by synonym, else by best value overlap
    const fv = values.map(normValue);
    let target = null, how = null;
    const propAlias = overrides.propAliases?.[c.tag]?.[prop];
    if (propAlias && (c.enums[propAlias] || c.props.some((p) => p.name === propAlias))) { target = propAlias; how = 'human-override'; }
    if (!target) for (const syn of PROP_SYNONYMS[key] ?? [key]) if (c.enums[syn]) { target = syn; how = 'name'; break; }
    if (!target) {
      let best = 0;
      for (const [p, vals] of Object.entries(c.enums)) { const o = fv.filter((v) => vals.map(normValue).includes(v)).length; if (o > best) { best = o; target = p; how = 'value-overlap'; } }
    }
    const isBoolLike = fv.every((v) => v === 'true' || v === 'false');
    if (target && !c.enums[target] && isBoolLike) { out.variantProps.push({ figmaProp: prop, kind: 'boolean-variant', status: 'maps-to-prop', prop: target, matchedBy: how }); continue; }
    if (!target && isBoolLike) {
      const bp = c.props.find((p) => p.type === 'boolean' && compact(p.name) === compact(prop));
      out.variantProps.push({ figmaProp: prop, kind: 'boolean-variant', status: bp ? 'maps-to-prop' : 'GAP-no-matching-boolean-prop', prop: bp?.name ?? null });
      continue;
    }
    if (!target) { out.variantProps.push({ figmaProp: prop, kind: 'variant', figmaValues: values, status: 'GAP-no-matching-prop' }); continue; }
    const aliases = overrides.valueAliases?.[c.tag]?.[target] ?? {};
    const toCode = (v) => normValue(aliases[v] ?? v);
    const cv = c.enums[target].map(normValue);
    const fvMapped = values.map(toCode);
    out.variantProps.push({
      figmaProp: prop, kind: 'variant', codeProp: target, matchedBy: how,
      figmaValues: values, codeValues: c.enums[target],
      valueAliasesApplied: Object.keys(aliases).length ? aliases : undefined,
      figmaValuesMissingInCode: values.filter((v) => !cv.includes(toCode(v))),
      codeValuesMissingInFigma: c.enums[target].filter((v) => !fvMapped.includes(normValue(v))),
      status: values.every((v) => cv.includes(toCode(v))) ? 'aligned' : 'value-mismatch',
    });
  }
  for (const op of fs_.otherProps) {
    const [name, t] = op.split(':'); const type = { T: 'TEXT', B: 'BOOLEAN', I: 'INSTANCE_SWAP' }[t] ?? t;
    const n = name.trim().toLowerCase();
    if (/\bltr\b|lrt\b/.test(n)) { out.booleanTextProps.push({ figmaProp: name.trim(), type, status: 'design-only (LTR preview text)' }); continue; }
    const cands = BOOL_SYNONYMS[n] ?? [name.trim()];
    const hit = cands.find((p) => c.props.some((x) => compact(x.name) === compact(p)));
    const slotHit = c.slots.find((s) => compact(s.name) === compact(name));
    out.booleanTextProps.push({ figmaProp: name.trim(), type, status: hit ? 'maps-to-prop' : slotHit ? 'maps-to-slot' : 'unmatched (review)', prop: hit ? c.props.find((x) => compact(x.name) === compact(hit)).name : null, slot: slotHit?.name ?? null });
  }
  return out;
}

// ---------------- run component mapping ----------------
const mapped = figmaSets.map((s) => ({ figma: { id: s.id, name: s.name, page: s.pageName, pageId: s.pageId, variantCount: s.variantCount, isPrivateBuildingBlock: s.isPrivate }, match: s.isPrivate ? { tag: null, method: 'skipped', confidence: 'n/a', note: 'private building block (name starts with "." or "_")' } : matchSet(s), _s: s }));
for (const m of mapped) {
  if (m.match.tag) m.comparison = compareProps(m._s, code.find((c) => c.tag === m.match.tag));
  delete m._s;
}
const publicSets = mapped.filter((m) => !m.figma.isPrivateBuildingBlock);
const tagsWithFigma = new Set(publicSets.filter((m) => m.match.tag).map((m) => m.match.tag));
const codeOnly = code.filter((c) => !tagsWithFigma.has(c.tag)).map((c) => c.tag);

// ---------------- token mapping ----------------
const tokenNames = new Set(tokens.tokens.map((t) => t.name));
function cssNameFor(collection, name) {
  const n = name.toLowerCase().replace(/text & icon/g, 'text').replace(/\s+/g, '-');
  const segs = n.split('/');
  switch (collection) {
    case 'Colors': return `--igds-base-color-${segs.join('-')}`;
    case 'Brand': return n === 'shadow' ? null : `--igds-ref-${segs.join('-').replace('white-000', 'white')}`;
    case 'Space': return `--igds-ref-${n}`;
    case 'Border': return `--igds-ref-border-${n}`.replace('border-radius-xxs', 'border-radius-2xs');
    case 'Typography': return `--igds-ref-${segs.join('-')}`;
    case 'Stroke': return `--igds-ref-border-${n.replace('weight', 'width')}`;
    case 'Screen Sizes': return `--igds-ref-device-width-${n.replace('desktop-small', 'desktop-s').replace('desktop-medium', 'desktop-m').replace('desktop-large', 'desktop-l')}`;
    default: return undefined; // collection has no code counterpart by design
  }
}
const tokenMap = { collections: [] };
const figmaMappedCss = new Set();
for (const col of variables) {
  const rows = col.names.map((n) => { const css = cssNameFor(col.name, n); if (css && tokenNames.has(css)) figmaMappedCss.add(css); return { figma: n, css: css ?? null, status: css === undefined ? 'collection-not-in-code' : css === null ? 'no-css-equivalent' : tokenNames.has(css) ? 'matched' : 'GAP-figma-only' }; });
  tokenMap.collections.push({ name: col.name, modes: col.modes, count: col.count, matched: rows.filter((r) => r.status === 'matched').length, figmaOnly: rows.filter((r) => r.status === 'GAP-figma-only').length, rows });
}
// code tokens of the same families that Figma does not have (semantic colors + un-namespaced primitives)
const codeOnlyTokens = tokens.tokens.filter((t) => !t.themeNamespace && (t.tier === 'semantic' && t.category === 'color' || t.tier === 'reference' && ['color-palette', 'space', 'border-radius', 'typography'].includes(t.category)) && !figmaMappedCss.has(t.name)).map((t) => t.name);
const themeModes = { figmaColorModes: variables.find((v) => v.name === 'Colors')?.modes ?? [], codeThemes: Object.keys(tokens.themes) };

// ---------------- write ----------------
const count = (arr, f) => arr.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
const variantRows = publicSets.flatMap((m) => (m.comparison?.variantProps ?? []).map((v) => ({ ...v, tag: m.match.tag, set: m.figma.name })));
const out = {
  generatedAt: new Date().toISOString(),
  generatedBy: 'igds-registry/scripts/build-figma-mapping.mjs',
  layers: { figmaFacts: `figma/snapshot (captured ${meta.capturedAt} via ${meta.capturedVia})`, codeFacts: `components.generated.json + tokens.generated.json (@igds/core-web ${components.sourcePackages['@igds/core-web']})`, humanDecisions: fs.existsSync(overridesFile) ? 'figma/figma-mapping.overrides.json' : '(none yet)' },
  figmaFile: { key: meta.fileKey, name: meta.fileName, scope: meta.scope },
  summary: {
    figmaComponentSets: figmaSets.length,
    publicComponentSets: publicSets.length,
    privateBuildingBlocksSkipped: figmaSets.length - publicSets.length,
    publicSetsByConfidence: count(publicSets, (m) => m.match.confidence),
    codeTagsWithFigmaCounterpart: tagsWithFigma.size,
    codeTagsWithoutFigmaCounterpart: codeOnly.length,
    variantPropertyComparisons: count(variantRows, (v) => v.status),
    figmaVariables: variables.reduce((s, c) => s + c.count, 0),
    figmaVariablesMatchedToCssTokens: figmaMappedCss.size,
    figmaVariablesWithoutCssToken: tokenMap.collections.reduce((s, c) => s + c.figmaOnly, 0),
    codeTokensWithoutFigmaVariable: codeOnlyTokens.length,
  },
  componentSets: mapped,
  codeTagsWithoutFigmaCounterpart: codeOnly,
  tokens: { ...tokenMap, codeTokensWithoutFigmaVariable: codeOnlyTokens, themeModes },
};
fs.writeFileSync(path.join(figmaDir, 'figma-mapping.generated.json'), JSON.stringify(out, null, 2), 'utf8');

// ---------------- gaps report (single document) ----------------
const L = [];
const nodeLink = (id) => `[${id}](https://www.figma.com/design/${meta.fileKey}/?node-id=${id.replace(':', '-')})`;
L.push('# IGDS — Figma ↔ Code gaps report (generated)', '');
L.push(`Generated ${out.generatedAt}. Figma snapshot: ${meta.capturedAt}. Code: @igds/core-web ${components.sourcePackages['@igds/core-web']}, @igds/tokens ${tokens.sourcePackages['@igds/tokens']}.`, '');
L.push('> Derived conclusions — not facts. Each row shows how it was derived. Fix a wrong automatic match by adding a reviewed entry to `figma/figma-mapping.overrides.json`, never by editing this file.', '');
L.push('## Summary', '', '```json', JSON.stringify(out.summary, null, 2), '```', '');
L.push('## 1. Figma components with no code component', '', 'These must NOT be built as look-alikes. An AI tool must report `IGDS-GAP` for them.', '', '| Figma component | page | node | closest code tag (score) |', '|---|---|---|---|');
for (const m of publicSets.filter((x) => !x.match.tag)) L.push(`| ${m.figma.name} | ${m.figma.page} | ${nodeLink(m.figma.id)} | ${(m.match.closest ?? []).map((c) => `\`${c.tag}\` (${c.score})`).join(', ') || '—'} |`);
L.push('', '## 2. Matches that need human review', '', '| Figma component | page | node | suggested tag | runner-up | evidence |', '|---|---|---|---|---|---|');
for (const m of publicSets.filter((x) => x.match.tag && ['needs-review', 'medium'].includes(x.match.confidence))) L.push(`| ${m.figma.name} | ${m.figma.page} | ${nodeLink(m.figma.id)} | \`${m.match.tag}\` (${m.match.confidence}) | ${m.match.runnerUp ? `\`${m.match.runnerUp.tag}\`` : '—'} | ${m.match.evidence?.join(' ')} |`);
L.push('', '## 3. Variant values: Figma vs code', '', '| tag | Figma set | Figma prop → code prop | in Figma, not in code | in code, not in Figma |', '|---|---|---|---|---|');
for (const v of variantRows.filter((r) => r.status === 'value-mismatch')) L.push(`| \`${v.tag}\` | ${v.set} | ${v.figmaProp} → \`${v.codeProp}\` | ${v.figmaValuesMissingInCode.join(', ') || '—'} | ${v.codeValuesMissingInFigma.join(', ') || '—'} |`);
L.push('', '### Figma variant properties with no code prop', '', '| tag | Figma set | Figma prop | values |', '|---|---|---|---|');
for (const v of variantRows.filter((r) => String(r.status).startsWith('GAP'))) L.push(`| \`${v.tag}\` | ${v.set} | ${v.figmaProp} | ${(v.figmaValues ?? []).join(', ')} |`);
L.push('', '### Figma states that have no prop in code', '', '| tag | Figma set | state |', '|---|---|---|');
for (const m of publicSets) for (const v of m.comparison?.variantProps ?? []) if (v.kind === 'state') for (const s of v.values) if (s.status.startsWith('GAP')) L.push(`| \`${m.match.tag}\` | ${m.figma.name} | ${s.value} |`);
L.push('', '## 4. Code components with no public Figma component set', '', codeOnly.map((t) => `\`${t}\``).join(' · '), '', 'Usually children/sub-parts (e.g. `*-item`) that Figma draws inside the parent set, or utilities.', '');
L.push('## 5. Tokens', '', '| Figma collection | modes | variables | matched to CSS token | Figma-only |', '|---|---|---|---|---|');
for (const c of tokenMap.collections) L.push(`| ${c.name} | ${c.modes.join(', ')} | ${c.count} | ${c.matched} | ${c.figmaOnly} |`);
L.push('', '### Figma variables with no CSS token', '');
for (const c of tokenMap.collections) { const g = c.rows.filter((r) => r.status === 'GAP-figma-only'); if (g.length) L.push(`- **${c.name}** (${g.length}): ${g.map((r) => `\`${r.figma}\``).join(', ')}`); }
L.push('', `### CSS tokens with no Figma variable (${codeOnlyTokens.length})`, '', codeOnlyTokens.map((t) => `\`${t}\``).join(', '), '');
L.push('### Theme modes', '', `Figma color modes: ${themeModes.figmaColorModes.join(', ')} · Code themes: ${themeModes.codeThemes.join(', ')}. Figma brand modes other than the main and dark mode have no counterpart in @igds/tokens.`, '');
L.push('## 6. Upstream library findings (code)', '');
for (const f of tokens.upstreamFindings ?? []) L.push(`- \`${f.name}\` is read by \`${f.readByModules.join(', ')}\` but defined nowhere (${f.impact}).`);
fs.writeFileSync(path.join(figmaDir, 'figma-gaps.generated.md'), L.join('\n'), 'utf8');

console.log(`[igds-figma] sets: ${figmaSets.length} (public ${publicSets.length}) · by confidence ${JSON.stringify(out.summary.publicSetsByConfidence)}`);
console.log(`[igds-figma] code tags with Figma counterpart: ${tagsWithFigma.size}/${code.length} · variant comparisons ${JSON.stringify(out.summary.variantPropertyComparisons)}`);
console.log(`[igds-figma] variables matched: ${figmaMappedCss.size} · Figma-only: ${out.summary.figmaVariablesWithoutCssToken} · code-only tokens: ${codeOnlyTokens.length}`);

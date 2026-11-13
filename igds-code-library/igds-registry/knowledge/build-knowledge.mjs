#!/usr/bin/env node
/**
 * igds-registry / knowledge / build-knowledge.mjs
 *
 * Builds the IGDS KNOWLEDGE LAYER from byte-exact Figma MCP captures (knowledge/figma/raw/*.json)
 * and the code registry. Three layers, never mixed:
 *
 *   knowledge/figma/*.json      FIGMA FACTS — verbatim text/values from the canonical file. Only structural
 *                               labelling is added, and every label says how it was derived (rule id).
 *   knowledge/verified/*.json   CROSS-CHECKED — Figma facts compared against the installed code
 *                               (@igds/core-web, @igds/tokens, @igds/icons); each row: agree | disagree | unmatched.
 *   knowledge/ai-derived/       AI INTERPRETATION — intentionally empty in this build. Nothing here is generated
 *                               by a model; when it is, it must live only in that folder and be labelled.
 *
 * Also renders AI-readable Markdown (ai/knowledge/*) — verbatim guideline text, never paraphrased —
 * and the coverage report (knowledge/COVERAGE.generated.md). No guideline text is invented: if Figma has
 * no text for a topic, the card says "not documented in Figma".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const K = path.dirname(fileURLToPath(import.meta.url));
const R = path.resolve(K, '..');
const P = path.resolve(R, '..');
const RAW = path.join(K, 'figma', 'raw');
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const raw = (f) => J(path.join(RAW, f));
const write = (rel, data) => { const p = path.join(K, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2)); };
const compact = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9א-ת]+/g, '');
const FILE = 'FXkIGvCtnuZZDrMjiSm29r';
const link = (id) => `https://www.figma.com/design/${FILE}/?node-id=${String(id).replace(':', '-')}`;

// ───────────────────────── inputs ─────────────────────────
const measure = raw('guideline-sections-measure.json');
const batches = fs.readdirSync(RAW).filter((f) => /^guidelines-b\d+\.json$/.test(f)).sort();
const sectionsRaw = batches.flatMap((f) => raw(f).sections.map((s) => ({ batch: f, s })));
const ann = raw('guideline-annotations.json');
const docPages = raw('doc-pages.json');
const patterns = raw('patterns-layouts.json');
const examples = raw('examples-composition.json');
const vars = raw('variables-values.json');
const styles = raw('styles-values.json');
const iconsAtoms = raw('icons-atoms-variants.json');
const inventory = J(path.join(R, 'audit', 'evidence', 'figma-page-inventory.json'));
const mapping = J(path.join(R, 'figma', 'figma-mapping.generated.json'));
const reg = J(path.join(R, 'components.generated.json'));
const tok = J(path.join(R, 'tokens.generated.json'));
const pageName = new Map(inventory.rows.map((r) => [r[0], r[1].trim()]));

// ───────────────────────── 1. FIGMA FACTS: guidelines ─────────────────────────
// Rule R-HEAD: a block is a heading when bold && fontSize >= 22 (level 1 if >= 32). Title = first block >= 60.
// Rule R-KIND: heading text → topic by the regex table below (Hebrew headings used consistently in the file).
const KIND_RULES = [
  ['whenToUse', /^מתי (להשתמש|משתמשים|נשתמש)|^מתי נשתמש|Horizontal Tabs — מתי|Vertical Tabs — מתי/],
  ['whenNotToUse', /^מתי (להימנע|לא)/],
  ['anatomy', /אנטומיה|^מרכיבים|מהו אטום|היררכיה של אטומים/],
  ['states', /^מצבים|States|^התקדמות/],
  ['types', /^סוגי|^סוגים|^גדלי|^גדלים|^וריאנטים|^אפשרויות|^צדדים|^כיוון|סוגי תצוגה|סוגי מדיה|סוגי כרטיסיות|סוגי כפתורים|סוגי באנרים|סוגי קרוסלות|סוגי תבניות/],
  ['doDont', /עשה ואל תעשה/],
  ['inclusion', /כיצד נתאים|הכללה|אוריינות|התאמה לאוכלוסי/],
  ['accessibility', /נגישות/],
  ['behavior', /התנהגות|אינטראקציה|Interaction|Active States/],
  ['guidance', /^דגשים|^הערה|^הערות|הנחיה נוספת|כלל אצבע|Best Practices|עקרונות|^הנחיות/],
  ['howToBuild', /הוראות|כיצד להשתמש|^בניית|^מדריך|הוראות בניית|עריכת תוכן|הוספת|^שינוי לוגו|מילוי שדות/],
  ['mobile', /מובייל|^Mobile|אפליקציית נייטיב/],
  ['examples', /^דוגמ|דוגמאות ושימושים/],
];
const kindOf = (h) => (KIND_RULES.find(([, re]) => re.test(h.trim())) ?? ['other'])[0];
const isNumberMarker = (t) => /^\s*\d{1,2}(\+\d)?\s*$/.test(t);

const sectionIndex = new Map(measure.rows.map(([pid, sid, own]) => [sid, { pid, own }]));
const annBy = new Map(ann.rows.map(([sid, , a, n, c]) => [sid, { annotations: a, instTexts: n, instChars: c }]));
// annotation body text repeated on >= 3 sections = copied boilerplate (unreliable)
const bodyCount = {};
for (const [, , a] of ann.rows) for (const x of a) if (/^Inline Toast/.test(x[0]) && x[3]) bodyCount[x[3]] = (bodyCount[x[3]] || 0) + 1;

const roleOf = (pid) => {
  const i = inventory.rows.findIndex((r) => r[0] === pid);
  const idx = (id) => inventory.rows.findIndex((r) => r[0] === id);
  if (i < idx('4212:706')) return pid === '36363:8125' || pid === '82:38' ? 'foundation' : 'documentation';
  if (i < idx('3830:157')) return 'web-component';
  if (i < idx('26026:5448')) return 'native-mobile';
  return 'pattern';
};

const guidelines = sectionsRaw.map(({ s, batch }) => {
  const [sid, sname, pid, pname, imgs, hidden, blocks, refs, found] = s;
  const own = blocks.filter((b) => !b[3]);
  const titleIdx = own.findIndex((b) => b[1] >= 60 && b[0].trim());
  // no fontSize>=60 title on canvas → explicit marker, never an invented name
  const title = titleIdx >= 0 ? own[titleIdx][0].trim() : `${pname.trim()} / ${sname.trim()} (ללא כותרת ב-Figma)`;
  const untitled = titleIdx < 0;
  const summaryBlock = own.slice(titleIdx + 1).find((b) => b[1] >= 30 && b[2] === 1 && b[0].trim());
  // related components: blocks after "קומפוננטות נוספות…" until "להנחיות שימוש…"
  const relStart = own.findIndex((b) => /^קומפוננטות נוספות/.test(b[0].trim()));
  const relEnd = own.findIndex((b, i) => i > relStart && /^להנחיות שימוש/.test(b[0].trim()));
  const related = relStart >= 0 ? own.slice(relStart + 1, relEnd > relStart ? relEnd : relStart + 8).map((b) => b[0].trim()).filter((t) => t && !/WWW\./i.test(t)) : [];
  const relatedLabel = relStart >= 0 ? own[relStart][0].trim().replace(/:$/, '') : null;
  // segments
  const segments = [];
  let cur = { heading: '(intro)', kind: 'intro', level: 0, blocks: [] };
  own.forEach((b, i) => {
    if (i === titleIdx || b === summaryBlock) return;
    if (i >= relStart && relStart >= 0 && i <= (relEnd > relStart ? relEnd + 1 : relStart)) return;
    if (/^WWW\.IGDS\.GOV\.IL$/i.test(b[0].trim())) return;
    const isHeading = b[2] === 1 && b[1] >= 22;
    if (isHeading) { segments.push(cur); cur = { heading: b[0].trim(), kind: kindOf(b[0]), level: b[1] >= 32 ? 1 : 2, blocks: [] }; return; }
    cur.blocks.push({ text: b[0], fontSize: b[1], bold: !!b[2], marker: isNumberMarker(b[0]) || undefined });
  });
  segments.push(cur);
  const a = annBy.get(sid) ?? { annotations: [], instTexts: 0, instChars: 0 };
  const statusAnn = a.annotations.find((x) => /^Inline Toast/.test(x[0]) && /קוד/.test(x[2] ?? ''));
  const codeStatus = statusAnn ? {
    figmaStatus: statusAnn[1], title: statusAnn[2], body: statusAnn[3],
    bodyReliability: (bodyCount[statusAnn[3]] ?? 0) >= 3 ? 'likely-copied-boilerplate (same text on ≥3 sections)' : 'specific',
    classification: /לא קיים/.test(statusAnn[2]) ? 'no-code' : /חלקי|חסר/.test(statusAnn[2]) ? 'partial' : /קיים|מלא/.test(statusAnn[2]) ? 'exists' : 'unknown',
    rule: 'R-ANN: title text of the "Inline Toast*" annotation instance whose title mentions קוד',
  } : null;
  const ownChars = own.reduce((n, b) => n + b[0].length, 0);
  return {
    id: sid, name: sname, page: pname, pageId: pid, role: roleOf(pid), figmaLink: link(sid),
    title, untitled, summary: summaryBlock ? summaryBlock[0].trim() : null,
    related: related.length ? { label: relatedLabel, items: related } : null,
    codeStatus, otherAnnotations: a.annotations.filter((x) => x !== statusAnn).map((x) => ({ instance: x[0], status: x[1], title: x[2], body: x[3] })),
    segments: segments.filter((g) => g.blocks.length || g.kind !== 'intro'),
    componentRefs: refs, imageFills: imgs,
    extraction: { batch, textNodesFound: found, hiddenSkipped: hidden, ownTextNodes: own.length, ownChars, measuredOwnChars: sectionIndex.get(sid)?.own ?? null, instanceTextNodes: a.instTexts, instanceChars: a.instChars, rules: ['R-HEAD', 'R-KIND', 'R-ANN'] },
  };
});
write('figma/guidelines.json', { source: `Figma ${FILE} via MCP (read-only), byte-exact capture`, rules: { 'R-HEAD': 'heading = bold && fontSize>=22 (level1 >=32); title = first block fontSize>=60', 'R-KIND': KIND_RULES.map(([k, re]) => `${k}: ${re}`), 'R-ANN': 'code-status = Inline Toast annotation whose title mentions קוד' }, sections: guidelines });

// Component Overview categories (verbatim labels, rule R-CAT: fs24 = category, fs14 = member label, in reading order)
const ov = docPages.pages.find((p) => p[0] === '44707:7604');
const categories = []; let curCat = null;
for (const [t, fs] of ov[3]) { if (fs === 24) { curCat = { category: t.trim(), members: [] }; categories.push(curCat); } else if (fs === 14 && curCat && !/^\d+$/.test(t)) curCat.members.push(t.trim()); }
write('figma/component-overview.json', { source: 'Figma page "Component Overview" (44707:7604), verbatim', rule: 'R-CAT', categories });
const categoryOf = (name) => !compact(name ?? '') ? null : categories.find((c) => c.members.some((m) => compact(m) === compact(name) || compact(name).startsWith(compact(m)) || compact(m).startsWith(compact(name))))?.category ?? null;

// Patterns, layouts, examples, styles, variables, icons — normalized FACTS
const formsGuide = guidelines.find((g) => g.pageId === '22254:2762');
write('figma/patterns.json', { source: 'Figma pattern pages (Forms, Feedback, Chatbot, Chat AI, Design patterns), verbatim', patterns: patterns.patterns.map((p) => ({ ...p, figmaLink: link(p.id) })), patternGuidelines: guidelines.filter((g) => g.role === 'pattern').map((g) => ({ id: g.id, title: g.title, page: g.page })) });
write('figma/layouts.json', { source: 'Figma page "Responsive Layout" (5820:27710)', layouts: patterns.layouts.map((l) => ({ ...l, figmaLink: link(l.id) })), grids: styles.grid });
write('figma/examples.json', { source: 'Figma "דוגמאות לשימוש" sections — top-level component instances per example (composition only; example label text is sample content and is not extracted)', sections: examples.sections.map(([pid, sid, name, dark, frames, refs]) => ({ page: pageName.get(pid), pageId: pid, id: sid, name, dark: !!dark, frames, componentRefs: refs, figmaLink: link(sid) })) });
write('figma/styles.json', { source: 'Figma local styles', ...styles });
write('figma/variables.json', { source: 'Figma local variables (values per mode; aliases as →Collection/name)', collections: vars });
write('figma/icons.json', { source: 'Figma Icons page + own atoms', iconSets: iconsAtoms.iconSets.map(([id, name, props]) => ({ id, name, variantProps: props })), variantSignatures: iconsAtoms.iconVariantSignatures, atoms: iconsAtoms.atomOwn.map(([id, name, n, props]) => ({ id, name, variants: n, variantProps: props })) });

// ───────────────────────── 2. VERIFIED: cross-check against code ─────────────────────────
const tags = reg.components.map((c) => c.tag);
const tagCore = (t) => compact(t.replace(/^igds-/, ''));
const pubSets = mapping.componentSets.filter((m) => !m.figma.isPrivateBuildingBlock);
function linkGuideline(g) {
  if (g.role === 'documentation' || g.role === 'foundation' || (g.role === 'pattern' && !/chat/i.test(g.title))) return { tag: null, method: 'not-a-component', status: 'n/a' };
  const onPage = pubSets.filter((m) => m.figma.pageId === g.pageId && m.match.tag);
  const t = compact(g.title);
  if (g.untitled || !t) return { tag: null, method: 'untitled section (title block empty in Figma) — not linked', status: g.codeStatus?.classification === 'no-code' ? 'verified-figma-only (no tag, Figma says no code)' : 'unlinked-no-title' };
  let best = onPage.find((m) => compact(m.figma.name) === t) ?? onPage.find((m) => compact(m.figma.name).startsWith(t) || t.startsWith(compact(m.figma.name)));
  let tag = best?.match.tag ?? null, method = best ? `figma-set "${best.figma.name}" on same page → mapping (${best.match.confidence})` : null;
  if (!tag) { const byName = tags.find((x) => tagCore(x) === t || (t.startsWith(tagCore(x)) && tagCore(x).length >= 5)); if (byName) { tag = byName; method = 'title ≈ tag name'; } }
  // variant-of: the title equals an allowed value of some prop (e.g. "Text Area" = igds-input[type="textarea"])
  if (!tag) for (const c of reg.components) { const p = c.props.find((pp) => [...String(pp.type).matchAll(/"([^"]+)"/g)].some((m) => compact(m[1]) === t)); if (p) { tag = c.tag; method = `variant-of: ${c.tag}[${p.attribute ?? p.name}="${[...String(p.type).matchAll(/"([^"]+)"/g)].find((m) => compact(m[1]) === t)[1]}"]`; break; } }
  // single tag among the page's mapped Figma sets (weak)
  if (!tag && g.codeStatus?.classification !== 'no-code') { const distinct = [...new Set(onPage.map((m) => m.match.tag))]; if (distinct.length === 1) { tag = distinct[0]; method = `only tag mapped on this Figma page (weak — review)`; } }
  const cs = g.codeStatus?.classification;
  let status;
  if (tag && cs === 'no-code') status = 'CONTRADICTED — Figma annotation says no code exists';
  else if (!tag && (cs === 'exists' || cs === 'partial')) status = 'UNLINKED — Figma says code exists but no tag matched';
  else if (tag && (cs === 'exists' || cs === 'partial')) status = (best?.match.confidence === 'high' || method === 'title ≈ tag name' || method.startsWith('variant-of')) ? 'verified (mapping + Figma annotation agree)' : 'agree-with-annotation (weaker link: ' + (best?.match.confidence ?? method) + ')';
  else if (!tag && cs === 'no-code') status = 'verified-figma-only (no tag, Figma says no code)';
  else status = tag ? 'linked-no-annotation' : 'unlinked-no-annotation';
  return { tag, method, status };
}
const componentLinks = guidelines.map((g) => ({ guideline: g.id, title: g.title, page: g.page, role: g.role, category: categoryOf(g.untitled ? null : g.title) ?? categoryOf(g.page), figmaCodeStatus: g.codeStatus ? { classification: g.codeStatus.classification, title: g.codeStatus.title } : null, ...linkGuideline(g) }));

// variables vs CSS tokens (value comparison)
const varMap = new Map(); for (const c of vars) for (const [n, , values] of c.v) varMap.set(`${c.c}/${n}`, { col: c, values });
const resolveVar = (v, mode, depth = 0) => {
  if (typeof v !== 'string' || !v.startsWith('→') || depth > 6) return v;
  const key = v.slice(1); const t = varMap.get(key);
  if (!t) return null;
  const mi = Math.min(mode, t.values.length - 1);
  return resolveVar(t.values[mi], mi === mode ? mode : 0, depth + 1);
};
// value normalization (comparison only — facts are stored as captured)
const rgbaToHex = (s) => String(s).replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)(%?))?\s*\)/gi, (m, r, g, b, a, pct) => {
  const h = (n) => Number(n).toString(16).padStart(2, '0');
  const al = a === undefined ? '' : h(Math.round((pct ? parseFloat(a) / 100 : parseFloat(a)) * 255));
  return '#' + h(r) + h(g) + h(b) + (al === 'ff' ? '' : al);
});
const norm = (x) => rgbaToHex(String(x ?? '')).toLowerCase().replace(/\s+/g, '').replace(/^#([0-9a-f]{6})ff$/, '#$1');
const alphaOf = (hex) => { const m = String(hex).match(/^#[0-9a-f]{6}([0-9a-f]{2})$/i); return m ? Math.round((parseInt(m[1], 16) / 255) * 100) / 100 : null; };
const cssTok = new Map(tok.tokens.map((t) => [t.name, t]));
const varChecks = [];
for (const col of mapping.tokens.collections) for (const r of col.rows) {
  if (r.status !== 'matched') continue;
  const fv = varMap.get(`${col.name}/${r.figma}`); const ct = cssTok.get(r.css);
  if (!fv || !ct) continue;
  const modes = fv.col.modes;
  const check = (modeName, theme) => {
    const mi = modes.indexOf(modeName); if (mi < 0) return null;
    const f = resolveVar(fv.values[mi], mi); const c = ct.resolvedValues[theme] ?? ct.resolvedValues.default;
    let fN = norm(f), cN = norm(c), how = 'exact';
    if (typeof f === 'number') {
      if (/line-height/.test(r.figma)) { fN = String(f / 100); cN = String(parseFloat(c)); how = 'figma % → css ratio'; }
      else if (/radius-full/.test(r.figma) && /infinity/.test(c)) { fN = cN = 'pill'; how = 'both = fully rounded'; }
      else { fN = String(f); cN = String(parseFloat(c)); }
    } else if (typeof f === 'string' && /^\d*\.?\d+$/.test(String(c).trim()) && alphaOf(f) !== null) { fN = String(alphaOf(f)); cN = String(parseFloat(c)); how = 'figma color alpha → css opacity'; }
    // alpha rounding tolerance: same RGB, alpha within 1/255 (e.g. 0.7 → b2 vs b3)
    const m1 = fN.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/), m2 = cN.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/);
    if (fN !== cN && m1 && m2 && m1[1] === m2[1] && Math.abs(parseInt(m1[2], 16) - parseInt(m2[2], 16)) <= 1) { cN = fN; how = 'equal within alpha rounding (±1/255)'; }
    return { figma: f, css: c, equal: fN === cN, how };
  };
  const light = check(modes[0], 'default');
  const dark = modes.includes('Dark IGDS') ? check('Dark IGDS', 'dark') : null;
  if (varChecks.some((v) => v.figma === `${col.name}/${r.figma}` && v.css === r.css)) continue; // same pair listed twice in mapping (duplicate collection name)
  varChecks.push({ figma: `${col.name}/${r.figma}`, css: r.css, light, dark, status: light?.equal && (dark ? dark.equal : true) ? 'agree' : 'VALUE-DIFFERS' });
}
// effect styles vs CSS shadow tokens (value comparison)
const shadowCss = tok.tokens.filter((t) => t.category === 'shadow' && !t.themeNamespace);
const fxNorm = (s) => String(s).toLowerCase().replace(/rgba?\([^)]*\)/g, (m) => m).replace(/\s+/g, ' ').trim();
const effectChecks = styles.effect.map(([name, fx]) => {
  const str = fx.map(([, x, y, r, sp, col]) => `${x}px ${y}px ${r}px ${sp}px ${col}`).join(', ');
  const want = fx.map(([, x, y, r, sp, col]) => `${x}px ${y}px ${r}px ${sp}px ${col.toLowerCase()}`).sort().join(',');
  const hits = shadowCss.filter((t) => {
    const parts = rgbaToHex(String(t.resolvedValues.default)).toLowerCase().split(/,(?![^(]*\))/).map((p) => p.trim().split(/\s+/).map((tk) => (/^-?\d+$/.test(tk) ? tk + 'px' : tk)).join(' '));
    return parts.sort().join(',') === want;
  });
  return { figma: name, value: str, cssTokensWithSameGeometryAndColor: hits.map((t) => t.name), status: hits.length ? 'agree' : 'NO-CSS-TOKEN' };
});
// text styles vs semantic type tokens (value comparison: weight/size/line-height)
const typeCss = tok.tokens.filter((t) => t.name.startsWith('--igds-base-type-') && !t.themeNamespace).map((t) => { const m = String(t.resolvedValues.default).match(/(\d{3})\s+(\d+)px(?:\/([\d.]+))?/); return m ? { name: t.name, w: +m[1], size: +m[2], lh: m[3] ? +m[3] : null } : null; }).filter(Boolean);
const W = { Thin: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 };
const textChecks = styles.text.filter((t) => t[1] === 'Rubik').map(([name, , style, size, lh]) => {
  const w = W[style.replace(/\s/g, '')] ?? null; const lhN = /%/.test(lh) ? parseFloat(lh) / 100 : null;
  const hits = typeCss.filter((c) => c.w === w && c.size === size && (c.lh == null || lhN == null || Math.abs(c.lh - lhN) < 0.01));
  return { figma: name, weight: w, size, lineHeight: lh, cssTokens: hits.map((h) => h.name), status: hits.length ? 'agree' : 'NO-CSS-TOKEN' };
});
// icons vs @igds/icons
const iconFiles = fs.readdirSync(path.join(P, 'node_modules', '@igds', 'icons', 'lib')).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => f.replace(/\.js$/, ''));
const iconBase = new Set(iconFiles.map((n) => compact(n.replace(/-(filled|outlined|outline|secondary-filled|failure-filled)$/, ''))));
const iconChecks = iconsAtoms.iconSets.filter(([, n]) => n).map(([id, name]) => ({ figma: name, id, inCode: iconBase.has(compact(name)), status: iconBase.has(compact(name)) ? 'name-match' : 'NO-NAME-MATCH (may exist under another name)' }));

write('verified/component-links.json', { method: 'guideline section → code tag via Figma-set mapping on the same page or title≈tag; then compared with Figma\'s own code-status annotation', rows: componentLinks });
write('verified/variables-vs-css.json', { method: 'Figma variable (resolved through aliases) vs CSS token resolved value; light=first mode vs :root, dark="Dark IGDS" vs dark theme', rows: varChecks });
write('verified/styles-vs-css.json', { effects: effectChecks, text: textChecks });
write('verified/icons-vs-code.json', { method: 'Figma icon set name vs @igds/icons file base name (exact, case/punct-insensitive)', codeIconFiles: iconFiles.length, rows: iconChecks });
write('ai-derived/README.md', '# AI-derived layer\n\nIntentionally empty. Nothing in the knowledge layer was generated or paraphrased by a model.\nAny future AI interpretation (summaries, recommendations, purpose tags) must be written only here, with the model, date and source ids on every entry, and must never overwrite `figma/` or `verified/`.\n');

// ───────────────────────── 3. AI-READABLE RENDERING (verbatim) ─────────────────────────
const slug = (g) => (g.title || g.name).toLowerCase().replace(/[^a-z0-9א-ת]+/g, '-').replace(/^-|-$/g, '') + '--' + g.id.replace(':', '-');
const KIND_LABEL = { intro: 'מבוא', whenToUse: 'מתי להשתמש', whenNotToUse: 'מתי להימנע', anatomy: 'אנטומיה', states: 'מצבים', types: 'סוגים / וריאנטים', doDont: 'עשה ואל תעשה', inclusion: 'התאמה לכלל האוכלוסייה', accessibility: 'נגישות', behavior: 'התנהגות', guidance: 'דגשים', howToBuild: 'הוראות בנייה (Figma)', mobile: 'מובייל', examples: 'דוגמאות', other: 'אחר' };
const outDir = path.join(R, 'ai', 'knowledge');
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
const linkBy = new Map(componentLinks.map((l) => [l.guideline, l]));
for (const g of guidelines) {
  const l = linkBy.get(g.id);
  const L = [`# ${g.title}`, '', `> **מקור:** Figma — ${g.page} / ${g.name} ([node ${g.id}](${g.figmaLink})). טקסט מילולי מהקנבס, ללא עריכה. כותרות הסעיפים הן מ-Figma; הסיווג (בסוגריים) נגזר לפי כלל R-KIND.`, ''];
  L.push(`| | |`, `|---|---|`);
  L.push(`| קטגוריה (Component Overview) | ${l.category ?? '—'} |`);
  L.push(`| תג קוד | ${l.tag ? '`<' + l.tag + '>` — ' + l.status : '— (' + l.status + ')'} |`);
  L.push(`| סטטוס קוד לפי Figma | ${g.codeStatus ? `${g.codeStatus.title} (${g.codeStatus.figmaStatus})` + (g.codeStatus.bodyReliability.startsWith('specific') ? ` — ${g.codeStatus.body.replace(/\n/g, ' ')}` : '') : 'לא צוין'} |`);
  if (g.related) L.push(`| ${g.related.label} | ${g.related.items.join(' · ')} |`);
  L.push('');
  if (g.summary) L.push(`**${g.summary}**`, '');
  const present = new Set(g.segments.map((s) => s.kind));
  for (const s of g.segments) {
    const text = s.blocks.filter((b) => !b.marker).map((b) => b.text.trim()).filter(Boolean);
    if (!text.length && s.kind === 'intro') continue;
    L.push(`${s.level === 2 ? '###' : '##'} ${s.heading} (${KIND_LABEL[s.kind]})`, '');
    for (const t of text) L.push(t.split('\n').map((x) => x.trim()).filter(Boolean).map((x) => (s.kind === 'whenToUse' || s.kind === 'whenNotToUse' || s.kind === 'guidance' || s.kind === 'inclusion') && text.length === 1 ? `- ${x}` : x).join('\n'), '');
  }
  const missing = ['whenToUse', 'whenNotToUse', 'states', 'accessibility'].filter((k) => !present.has(k));
  if (missing.length && g.role !== 'documentation') L.push(`> לא מתועד ב-Figma עבור רכיב זה: ${missing.map((k) => KIND_LABEL[k]).join(', ')}. אין להשלים מהמצאה.`, '');
  if (g.imageFills) L.push(`> ⚠️ הסעיף כולל ${g.imageFills} תמונות (בעיקר דוגמאות עשה/אל תעשה) — תוכנן החזותי לא חולץ. לצפייה: ${g.figmaLink}`, '');
  fs.writeFileSync(path.join(outDir, slug(g) + '.md'), L.join('\n'));
}
// Purpose index (verbatim summaries) — the selection entry point for AI tools
const I = ['# IGDS — אינדקס בחירת רכיב לפי מטרה (generated, verbatim)', '', `> נוצר מ-Figma (${guidelines.length} סעיפי הנחיות) + Component Overview. עמודת "מטרה" היא משפט הפתיחה המילולי של הרכיב ב-Figma. אין כאן ניסוח של AI. בחרו רכיב לפי המטרה, ואז פתחו את כרטיס הרכיב ואת API הקוד ב-IGDS-COMPONENTS.md.`, ''];
for (const cat of [...categories.map((c) => c.category), null]) {
  const rows = guidelines.filter((g) => g.role === 'web-component' || g.role === 'native-mobile').filter((g) => (linkBy.get(g.id).category ?? null) === cat);
  if (!rows.length) continue;
  I.push(`## ${cat ?? 'ללא קטגוריה ב-Component Overview'}`, '', '| רכיב (Figma) | מטרה (מילולי מ-Figma) | תג קוד | סטטוס קוד (Figma) | כרטיס |', '|---|---|---|---|---|');
  for (const g of rows) { const l = linkBy.get(g.id); I.push(`| ${g.title}${g.role === 'native-mobile' ? ' (מובייל נייטיב)' : ''} | ${(g.summary ?? '—').replace(/\|/g, '/').replace(/\n/g, ' ')} | ${l.tag ? '`' + l.tag + '`' : '—'} | ${g.codeStatus?.title ?? '—'} | [כרטיס](knowledge/${slug(g)}.md) |`); }
  I.push('');
}
I.push('## תבניות (Patterns) ותבניות פריסה', '');
for (const g of guidelines.filter((x) => x.role === 'pattern' || x.page === 'Guide lines')) I.push(`- [${g.title}](knowledge/${slug(g)}.md) — ${g.page}`);
I.push('', `- תבניות טפסים מוכנות ב-Figma: ${patterns.patterns.filter((p) => p.kind === 'forms').map((p) => `[${p.name}](${link(p.id)})`).join(' · ')}`);
I.push(`- תבניות פריסה (Responsive Layout): ${patterns.layouts.map((l) => l.name.trim()).join(' · ')} — מבנה מלא: \`igds-registry/knowledge/figma/layouts.json\``, '');
// ── Foundations: Design Tokens page (0:1) + AI Examples page (45304:1336), verbatim ──
// Rule R-FHEAD: heading = (bold && fontSize>=22) || fontSize>=48. Rule R-DARKDIFF: the dark-mode colors frame repeats the
// light frame; the card lists only its blocks whose exact text does not occur in the light frame (raw JSON keeps everything).
const tokPage = ['a', 'b', 'c'].flatMap((x) => raw(`design-tokens-page-${x}.json`).tops);
const aiProbe = raw('ai-examples-and-tokens-probe.json');
const aiInst = raw('ai-examples-instances.json');
write('figma/foundations.json', { source: 'Figma "🎨 Design Tokens" page (0:1) and "AI Examples" page (45304:1336), verbatim visible text in reading order', rules: { 'R-FHEAD': 'heading = (bold && fontSize>=22) || fontSize>=48', 'R-DARKDIFF': 'dark colors frame: card shows only blocks whose text is absent from the light frame' }, designTokensPage: tokPage.map(([id, name, type, hidden, blocks]) => ({ id, name, type, hiddenSkipped: hidden, figmaLink: link(id), blocks })), aiExamplesPage: aiProbe.ai.map((t) => ({ ...t, figmaLink: link(t.id) })) });
const isHead = (b) => (b[2] === 1 && b[1] >= 22) || b[1] >= 48;
// verified: CSS-variable labels written on the Tokens page vs the installed @igds/tokens
const cssLabelRe = /^--igds-[a-z0-9-]+$/;
const tokLabels = [...new Set(tokPage.flatMap((t) => t[4]).map((b) => b[0].trim()).filter((x) => cssLabelRe.test(x)))];
const tokLabelCheck = tokLabels.map((n) => ({ label: n, existsInCode: cssTok.has(n) })).sort((a, b) => a.existsInCode - b.existsInCode || a.label.localeCompare(b.label));
write('verified/design-tokens-page-labels-vs-css.json', { method: 'every text block on Figma page 0:1 that is exactly a CSS custom property name, checked against tokens.generated.json (@igds/tokens)', total: tokLabelCheck.length, existInCode: tokLabelCheck.filter((x) => x.existsInCode).length, labels: tokLabelCheck });
const markLabel = (t) => (cssLabelRe.test(t) && !cssTok.has(t) ? `${t} ⟵ ⚠️ [verified] לא קיים ב-@igds/tokens — אין להשתמש` : t);
const renderBlocks = (blocks) => { const out = []; for (const b of blocks) { const t = b[0].trim(); if (!t) continue; out.push(isHead(b) ? `${b[1] >= 64 ? '##' : '###'} ${t.replace(/\n/g, ' ')}` : markLabel(t).split('\n').map((x) => x.trim()).filter(Boolean).join('\n'), ''); } return out; };
const lightTexts = new Set((tokPage.find((t) => t[0] === '2194:11008')?.[4] ?? []).map((b) => b[0]));
const F = ['# IGDS Foundations — עמוד Design Tokens (מילולי מ-Figma)', '', `> **מקור:** Figma — "🎨 Design Tokens" ([node 0:1](${link('0:1')})). טקסט מילולי מהקנבס, בסדר קריאה. כותרות לפי כלל R-FHEAD. ערכי הטוקנים עצמם נמצאים ב-IGDS-TOKENS.md (קוד) וב-knowledge/figma/variables.json (Figma) — כאן רק ההנחיות הכתובות. שמות טוקנים בעמוד זה הם תוויות שנכתבו ידנית ב-Figma; שם תקף לשימוש בקוד הוא רק שם שמופיע ב-IGDS-TOKENS.md.`, ''];
for (const [id, name, type, hidden, blocks] of tokPage) {
  if (type === 'TEXT') continue; // two stray label nodes on the canvas, no guidance
  if (id === '37094:785') {
    const diff = [...new Map(blocks.filter((b) => !lightTexts.has(b[0]) && b[0].trim()).map((b) => [b[0], b])).values()]; // the frame holds two copies → unique texts
    F.push(`## ${name} — רק טקסט שאינו מופיע במסגרת הבהירה (R-DARKDIFF)`, '', `> [node ${id}](${link(id)}) · ${blocks.length} בלוקים במסגרת, ${diff.length} שונים מהמסגרת הבהירה.`, '');
    for (const b of diff) F.push(`- ${markLabel(b[0].trim()).replace(/\n/g, ' ')}`);
    F.push(''); continue;
  }
  F.push(`<!-- node ${id} ${name} -->`, ...renderBlocks(blocks));
}
fs.writeFileSync(path.join(outDir, 'foundations--design-tokens-page.md'), F.join('\n'));
const A = ['# AI Examples — רכיבי AI (מילולי מ-Figma)', '', `> **מקור:** Figma — "AI Examples" ([node 45304:1336](${link('45304:1336')})). טקסט מילולי, ללא עריכה. כותרות לפי כלל R-FHEAD.`, ''];
for (const t of aiProbe.ai) {
  if (t.type === 'INSTANCE') continue; // page title component
  A.push(`<!-- node ${t.id} ${t.name} -->`, ...renderBlocks(t.blocks));
  if (Object.keys(t.refs).length) A.push(`> מופעי רכיבים בסעיף: ${Object.entries(t.refs).map(([k, v]) => `${k}×${v}`).join(', ')}`, '');
  const cards = aiInst.instances.filter((x) => x[1] === t.id && x[6].length);
  if (cards.length) { A.push('**תוכן הכרטיסיות בסעיף (טקסט מתוך מופעי Card, מילולי).** כותרת כל כרטיס ב-Figma היא עדיין placeholder ("כותרת"), ולכן לא ידוע לאיזה רכיב מתייחס כל תיאור — אין להסיק זאת.', ''); for (const c of cards) { const desc = c[6].filter(([tx, v]) => v && !/^(כותרת|תווית|Slot Placeholder)$/.test(tx.trim())).map(([tx]) => tx.trim()); A.push(`- ${desc.join(' · ')} ([node ${c[0]}](${link(c[0])}))`); } A.push(''); }
}
fs.writeFileSync(path.join(outDir, 'foundations--ai-examples.md'), A.join('\n'));
I.push('## יסודות (Foundations) והנחיות כלליות', '', '- [עמוד Design Tokens — הנחיות שימוש בצל, טיפוגרפיה, מרווחים, קו מתאר, רדיוס, גריד וצבעים](knowledge/foundations--design-tokens-page.md)', '- [AI Examples — מתי להשתמש ברכיבי AI, עקרונות, מצבים, מיקרוקופי, נגישות](knowledge/foundations--ai-examples.md)', '');
fs.writeFileSync(path.join(R, 'ai', 'IGDS-GUIDELINES-INDEX.md'), I.join('\n'));

// ───────────────────────── 4. COVERAGE (knowledge layer) ─────────────────────────
const ownSum = guidelines.reduce((n, g) => n + g.extraction.ownChars, 0);
// per-section proof: measured authored text nodes (visible+hidden) − extracted visible authored nodes = hidden layers skipped
const measRows = new Map(measure.rows.map((r) => [r[1], r]));
const perSection = guidelines.map((g) => { const r = measRows.get(g.id); const ownN = g.extraction.ownTextNodes; return { id: g.id, measuredNodes: r?.[3], extractedNodes: ownN, hidden: g.extraction.hiddenSkipped, charGap: (r?.[2] ?? 0) - g.extraction.ownChars }; });
const exactSections = perSection.filter((p) => p.measuredNodes === p.extractedNodes && p.charGap === 0).length;
const hiddenExplained = perSection.filter((p) => p.charGap !== 0).every((p) => p.measuredNodes - p.extractedNodes === p.hidden);
const measuredOwn = measure.tot.own; const instTotal = ann.instChars;
const segBlocks = guidelines.flatMap((g) => g.segments.flatMap((s) => s.blocks.filter((b) => !b.marker).map(() => s.kind)));
const kindCount = segBlocks.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
const compGuides = guidelines.filter((g) => g.role === 'web-component' || g.role === 'native-mobile');
const has = (k) => compGuides.filter((g) => g.segments.some((s) => s.kind === k)).length;
const linkStatus = componentLinks.reduce((m, l) => ((m[l.status.split(' ')[0]] = (m[l.status.split(' ')[0]] || 0) + 1), m), {});
const tagsWithGuideline = new Set(componentLinks.filter((l) => l.tag).map((l) => l.tag));
const cov = {
  generatedAt: new Date().toISOString(),
  pages: { total: inventory.rows.length, withGuidelineSections: new Set(guidelines.map((g) => g.pageId)).size, docPagesExtracted: docPages.pages.length },
  guidelines: { sectionsDiscovered: measure.rows.length, sectionsExtracted: guidelines.length, missing: measure.rows.filter((r) => !guidelines.some((g) => g.id === r[1])).map((r) => r[1]), ownCharsExtracted: ownSum, ownCharsMeasuredIndependently: measuredOwn, instanceCharsCounted: instTotal, totalAccountedChars: measuredOwn + instTotal, auditTotalChars: 292508, reconciles: measuredOwn + instTotal === 292508, sectionsExactNodesAndChars: exactSections, sectionsWithGapOnlyFromHiddenLayers: perSection.filter((p) => p.charGap !== 0).length, gapFullyExplainedByHiddenLayers: hiddenExplained, hiddenLayerChars: measuredOwn - ownSum, hiddenTextNodesSkipped: guidelines.reduce((n, g) => n + g.extraction.hiddenSkipped, 0), imageFillsNotExtracted: guidelines.reduce((n, g) => n + g.imageFills, 0), blocksByTopic: kindCount },
  componentGuidelineTopics: { componentSections: compGuides.length, withWhenToUse: has('whenToUse'), withWhenNotToUse: has('whenNotToUse'), withStates: has('states'), withAnatomy: has('anatomy'), withDoDont: has('doDont'), withAccessibility: has('accessibility'), withInclusion: has('inclusion'), withTypes: has('types'), withCodeStatusAnnotation: compGuides.filter((g) => g.codeStatus).length },
  linkToCode: { statusCounts: linkStatus, codeTagsWithAGuideline: tagsWithGuideline.size, codeTagsTotal: tags.length, codeTagsWithoutGuideline: tags.filter((t) => !tagsWithGuideline.has(t)) },
  patterns: { patternSections: patterns.patterns.length, patternGuidelines: guidelines.filter((g) => g.role === 'pattern').length, layouts: patterns.layouts.length },
  examples: { sections: examples.sections.length, compositionCaptured: examples.sections.length, sampleTextExtracted: 0 },
  variables: { total: vars.reduce((n, c) => n + c.v.length, 0), valuesCaptured: vars.reduce((n, c) => n + c.v.filter((x) => x[2]).length, 0), comparedWithCss: varChecks.length, agree: varChecks.filter((v) => v.status === 'agree').length, differ: varChecks.filter((v) => v.status !== 'agree').length },
  styles: { text: styles.text.length, textAgreeWithCss: textChecks.filter((t) => t.status === 'agree').length, effect: styles.effect.length, effectAgreeWithCss: effectChecks.filter((e) => e.status === 'agree').length, grid: styles.grid.length, paint: styles.paint.length },
  icons: { figmaIconSets: iconChecks.length, nameMatchInCode: iconChecks.filter((i) => i.inCode).length, variantPropsCaptured: iconsAtoms.iconSets.length },
};
// ── Page matrix: every Figma page × what the knowledge layer (and the component snapshot) captured from it ──
const auditPages = J(path.join(R, 'audit', 'coverage.generated.json')).figma.pages;
const pageNameToId = new Map(auditPages.map((p) => [p.name.trim(), p.id]));
const src = new Map(auditPages.map((p) => [p.id, new Set()]));
const mark = (id, s) => src.get(id)?.add(s);
for (const g of guidelines) mark(g.pageId, 'guidelines');
for (const e of examples.sections) mark(e[0], 'examples');
for (const p of patterns.patterns) mark(pageNameToId.get(p.page.trim()), 'pattern-structure');
mark('5820:27710', 'layouts');
for (const d of docPages.pages) mark(d[0], 'doc-text');
mark('0:1', 'foundations-text'); mark('45304:1336', 'foundations-text');
mark('82:38', 'icon-sets+variant-props'); mark('36363:8125', 'atom-sets+variant-props');
for (const p of auditPages) if (p.capturedInDetail && p.sets > 0) mark(p.id, 'component-snapshot');
const pageMatrix = auditPages.map((p) => {
  const s = [...src.get(p.id)];
  const status = s.length ? 'captured' : p.role === 'separator' ? 'n/a — separator page (no content)' : p.role === 'test-or-scratch' ? 'excluded — test/scratch page' : (p.sets === 0 && p.text === 0) ? 'n/a — empty page (0 components, 0 text)' : 'NOT CAPTURED';
  return { id: p.id, name: p.name.trim(), role: p.role, sets: p.sets, variants: p.variants, textNodes: p.text, captured: s, status };
});
cov.pages = { ...cov.pages, matrix: pageMatrix, byStatus: pageMatrix.reduce((m, p) => ((m[p.status] = (m[p.status] || 0) + 1), m), {}) };
// Design Tokens page: visible + hidden text nodes captured vs independent audit count
const tokNodes = tokPage.reduce((n, t) => n + t[4].length + t[3], 0);
cov.foundations = { designTokensPage: { visibleBlocks: tokPage.reduce((n, t) => n + t[4].length, 0), hiddenSkipped: tokPage.reduce((n, t) => n + t[3], 0), totalTextNodes: tokNodes, auditTextNodes: auditPages.find((p) => p.id === '0:1')?.text, reconciles: tokNodes === auditPages.find((p) => p.id === '0:1')?.text, chars: ['a', 'b', 'c'].reduce((n, x) => n + raw(`design-tokens-page-${x}.json`).chars, 0) }, aiExamplesPage: { topLevelNodes: aiProbe.ai.length, authoredVisibleBlocks: aiProbe.ai.filter((t) => t.type !== 'INSTANCE').reduce((n, t) => n + t.blocks.length, 0), authoredHidden: 2, instanceTextNodes: aiInst.instanceTextNodes, auditTextNodes: auditPages.find((p) => p.id === '45304:1336')?.text, hiddenNote: 'hidden layers 45304:3008/3011 ("כיצד נתאים לכלל האוכלוסיה" + body) — hidden in Figma, not used; counted from a read-only listing run in session' } };
write('coverage.generated.json', cov);
const C = ['# IGDS Knowledge layer — coverage (generated)', '', `Generated ${cov.generatedAt}. Every number below is computed from \`knowledge/figma/raw\` (byte-exact MCP captures) and the code registry.`, ''];
const g = cov.guidelines;
C.push('## Guidelines (canvas text)', '', '| measure | value |', '|---|---|',
  `| guideline sections discovered (independent scan) | ${g.sectionsDiscovered} |`, `| extracted | ${g.sectionsExtracted} (missing: ${g.missing.length ? g.missing.join(', ') : 'none'}) |`,
  `| authored characters extracted | ${g.ownCharsExtracted.toLocaleString()} |`, `| authored characters measured independently | ${g.ownCharsMeasuredIndependently.toLocaleString()} |`,
  `| characters inside instances (examples/annotations) counted | ${g.instanceCharsCounted.toLocaleString()} |`, `| authored + instance = audit total 292,508? | ${g.reconciles ? 'yes — exact' : 'NO'} |`,
  `| sections where measured = extracted (text nodes and characters) | ${g.sectionsExactNodesAndChars}/${g.sectionsExtracted} |`, `| remaining sections: gap = hidden layers exactly (node count) | ${g.sectionsWithGapOnlyFromHiddenLayers} sections, ${g.hiddenTextNodesSkipped} hidden text layers, ${g.hiddenLayerChars.toLocaleString()} chars — ${g.gapFullyExplainedByHiddenLayers ? 'yes, every section' : 'NO'} |`, `| images in guideline sections (visual Do/Don't) — NOT extracted | ${g.imageFillsNotExtracted} |`, '');
C.push('## Topic coverage across component guideline sections', '', '| topic | sections with it |', '|---|---|');
for (const [k, v] of Object.entries(cov.componentGuidelineTopics)) C.push(`| ${k} | ${v} |`);
C.push('', '## Link to code', '', '```json', JSON.stringify(cov.linkToCode, null, 2), '```', '');
C.push('## Contradictions and gaps (from verified/)', '');
for (const l of componentLinks.filter((x) => /CONTRADICTED|UNLINKED/.test(x.status))) C.push(`- **${l.title}** (${l.page}) → ${l.tag ? '`' + l.tag + '`' : 'no tag'} — ${l.status}; Figma: "${l.figmaCodeStatus?.title}"`);
C.push('', '## Values vs code', '', `- Variables compared with CSS tokens: ${cov.variables.comparedWithCss} — agree ${cov.variables.agree}, differ ${cov.variables.differ}`);
for (const v of varChecks.filter((x) => x.status !== 'agree').slice(0, 30)) C.push(`  - \`${v.figma}\` vs \`${v.css}\`: light ${v.light?.figma} / ${v.light?.css}${v.dark ? ` · dark ${v.dark.figma} / ${v.dark.css}` : ''}`);
C.push(`- Text styles (Rubik) with an equal CSS type token: ${cov.styles.textAgreeWithCss}/${textChecks.length}`, `- Effect styles (shadows) with an equal CSS shadow token: ${cov.styles.effectAgreeWithCss}/${cov.styles.effect}`);
for (const e of effectChecks) C.push(`  - ${e.figma}: ${e.status}${e.cssTokensWithSameGeometryAndColor.length ? ' → ' + e.cssTokensWithSameGeometryAndColor.join(', ') : ''}`);
C.push(`- Icon sets with a same-name icon in @igds/icons: ${cov.icons.nameMatchInCode}/${cov.icons.figmaIconSets}`, '');
const fd = cov.foundations.designTokensPage;
C.push('## Foundations pages (no "הנחיות" section name — captured separately)', '', `- Design Tokens page (0:1): ${fd.visibleBlocks} visible text blocks + ${fd.hiddenSkipped} hidden = ${fd.totalTextNodes} text nodes; audit counted ${fd.auditTextNodes} — ${fd.reconciles ? 'exact' : 'MISMATCH'}. ${fd.chars.toLocaleString()} chars.`, `- CSS-variable names written on that page: ${tokLabelCheck.length}, existing in @igds/tokens: ${tokLabelCheck.filter((x) => x.existsInCode).length} (verified/design-tokens-page-labels-vs-css.json).`, (() => { const a = cov.foundations.aiExamplesPage; const sum = a.authoredVisibleBlocks + a.authoredHidden + a.instanceTextNodes; return `- AI Examples page (45304:1336): ${a.authoredVisibleBlocks} authored visible + ${a.authoredHidden} hidden + ${a.instanceTextNodes} inside instances = ${sum}; audit counted ${a.auditTextNodes} — ${sum === a.auditTextNodes ? 'exact' : 'MISMATCH'}. Card titles in Figma are placeholders ("כותרת").`; })(), '');
C.push('## Page matrix — all Figma pages', '', '| status | pages |', '|---|---|');
for (const [k, v] of Object.entries(cov.pages.byStatus)) C.push(`| ${k} | ${v} |`);
C.push('', '| page | role | sets / variants | text nodes | captured from it | status |', '|---|---|---|---|---|---|');
for (const p of cov.pages.matrix) C.push(`| ${p.name} \`${p.id}\` | ${p.role} | ${p.sets} / ${p.variants} | ${p.textNodes} | ${p.captured.join(', ') || '—'} | ${p.status} |`);
C.push('');
C.push('## Not extracted (by design or not yet)', '','- Images inside guideline sections (Do/Don\'t visuals) — counted, not extracted; need screenshots + human/vision review.',
  '- Sample text inside example screens — composition captured, labels skipped (placeholder content).',
  '- "העתקה לשימוש" (copy-paste) sections — assets for designers, no guidance text.',
  '- Prototype interactions / animations.', '- Content of linked libraries (illustrations IGDS 2.0) and of org copies.',
  '- Dark mode test page.', '');
write('COVERAGE.generated.md', C.join('\n'));
console.log(JSON.stringify({ sections: g.sectionsExtracted, reconciles: g.reconciles, topics: cov.componentGuidelineTopics, link: cov.linkToCode.statusCounts, tagsWithGuideline: cov.linkToCode.codeTagsWithAGuideline, vars: cov.variables, styles: cov.styles, icons: cov.icons }, null, 1));

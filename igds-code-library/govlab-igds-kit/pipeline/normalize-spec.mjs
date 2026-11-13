#!/usr/bin/env node
// Normalizer: spec/raw/*.json (byte-exact Figma MCP captures, formats v1/v2/v3) -> spec/sets/<setId>.json
// Deterministic, offline, no LLM. Never edits spec/raw. Re-running with the same inputs gives identical output.
//
// What it does
//  - v3 delta encoding (base + set/del) is expanded back to a full node tree for every variant.
//  - v2 trees are kept as-is (they are already full trees).
//  - v1 "summary" rows (extract-button-summary) are kept as summary records (detail:"summary"), never upgraded to trees.
//  - The same variant captured in several files is merged by variant id; conflicting captures are an error.
//  - Every Figma variable bound anywhere in a variant is resolved to a CSS token via
//    igds-registry/knowledge/verified/variables-vs-css.json, or marked "no-css-token" with its Figma values
//    from igds-registry/knowledge/figma/variables.json. Nothing is guessed.
//  - Coverage per set: how many variants Figma has for each capture filter vs how many were captured.
//
// Usage: node pipeline/normalize-spec.mjs            (writes spec/sets/*.json + spec/NORMALIZE-REPORT.json)
//        node pipeline/normalize-spec.mjs --check    (exit 1 if output would change)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadDefs, isDefault } from './figma-rest/defs.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REG = path.resolve(KIT, '../igds-registry');
const RAW = path.join(KIT, 'spec/raw');
const OUT = path.join(KIT, 'spec/sets');
const FIGMA_FILE = 'FXkIGvCtnuZZDrMjiSm29r';
const NORMALIZER_VERSION = 2; // v2: letter spacing canonicalised to pixels (REST reports px only; plugin may report % of font size)
const CHECK = process.argv.includes('--check');

const errors = [];
const figmaDataIssues = []; // contradictions inside Figma itself -> decision-required (plan v3 §2.2), never resolved here
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// ---------- Figma variable -> CSS token resolution (verified data only) ----------
const varsVsCss = JSON.parse(fs.readFileSync(path.join(REG, 'knowledge/verified/variables-vs-css.json'), 'utf8'));
const cssByFigma = new Map(varsVsCss.rows.map((r) => [r.figma, r]));
const figmaVars = JSON.parse(fs.readFileSync(path.join(REG, 'knowledge/figma/variables.json'), 'utf8'));
const figmaVarByName = new Map();
for (const col of figmaVars.collections) for (const [name, type, values, scopes] of col.v) figmaVarByName.set(`${col.c}/${name}`, { collection: col.c, modes: col.modes, type, values, scopes });

function resolveVar(raw) {
  const remote = raw.startsWith('[remote]');
  const name = remote ? raw.slice('[remote]'.length) : raw;
  const row = cssByFigma.get(name);
  if (row) return { figma: name, css: row.css, status: row.status === 'agree' ? 'css-token' : 'css-token-value-differs', light: row.light, dark: row.dark, ...(remote ? { remote: true } : {}) };
  const fv = figmaVarByName.get(name);
  if (fv) return { figma: name, css: null, status: 'no-css-token', figmaModes: Object.fromEntries(fv.modes.map((m, i) => [m, fv.values[i]])), ...(remote ? { remote: true } : {}) };
  return { figma: name, css: null, status: remote ? 'remote-variable-unknown' : 'unknown-variable', ...(remote ? { remote: true } : {}) };
}

// collect variable names used in a node object (v map + paint .v)
function collectVars(o, out) {
  if (o.v) for (const val of Object.values(o.v)) for (const n of [].concat(val)) if (typeof n === 'string') out.add(n);
  for (const k of ['f', 's', 'ifill']) if (Array.isArray(o[k])) for (const p of o[k]) if (p.v) out.add(p.v);
  if (o.c) for (const ch of o.c) collectVars(ch, out);
  return out;
}

// ---------- v3 delta -> nested tree ----------
// Path grammar (extract-spec.figma.js): root = '', child = parentPath + '/' + index + ':' + childName.
// Names may contain '/', so the parent is found structurally: the longest existing path P such that
// path === P + '/' + i + ':' + node.n.
function unflatten(flat, ctx) {
  const paths = Object.keys(flat);
  if (!('' in flat)) { errors.push(`${ctx}: no root path`); return null; }
  const nodes = new Map(paths.map((p) => [p, { ...flat[p] }]));
  const sorted = paths.slice().sort((a, b) => a.length - b.length);
  const childrenOf = new Map();
  for (const p of sorted) {
    if (p === '') continue;
    const n = nodes.get(p);
    let parent = null, index = null;
    for (const q of sorted) {
      if (q.length >= p.length) break;
      const m = p.startsWith(q + '/') ? /^(\d+):([\s\S]*)$/.exec(p.slice(q.length + 1)) : null;
      if (m && m[2] === n.n && (parent === null || q.length > parent.length)) { parent = q; index = Number(m[1]); }
    }
    if (parent === null) { errors.push(`${ctx}: orphan path ${JSON.stringify(p)}`); continue; }
    if (!childrenOf.has(parent)) childrenOf.set(parent, []);
    childrenOf.get(parent).push([index, n]);
  }
  for (const [p, list] of childrenOf) {
    list.sort((a, b) => a[0] - b[0]);
    list.forEach(([i], k) => { if (i !== k) errors.push(`${ctx}: child index gap under ${JSON.stringify(p)} (expected ${k}, got ${i})`); });
    nodes.get(p).c = list.map(([, n]) => n);
  }
  return nodes.get('');
}

// ---------- read raw captures ----------
const sets = new Map(); // setId -> {set, sources:[], variants: Map(id|name -> rec)}
function setEntry(set) {
  if (!sets.has(set.id)) sets.set(set.id, { set: { ...set }, sources: [], variants: new Map() });
  const e = sets.get(set.id);
  if (set.defs && !e.set.defs) e.set.defs = set.defs;
  if (set.key && !e.set.key) e.set.key = set.key;
  return e;
}
function addVariant(e, key, rec, file) {
  const prev = e.variants.get(key);
  if (prev) {
    // REST_ONLY keys (data the plugin extractor never captured, e.g. ifill = icon colour inside an instance) are left out
    // of the equality check; usedVars is derived from the tree. When equal, the richer record (with REST-only data) is kept.
    const REST_ONLY = new Set(["ifill", "nid", "ref", "hid", "gh", "mcid"]);
    // hid:1 nodes (hidden by default, visibility bound to a BOOLEAN property) exist only in REST captures -> ignored here
    const canon = (x) => JSON.stringify(x, (k, val) => (REST_ONLY.has(k) || k === 'usedVars' ? undefined : k === 'c' && Array.isArray(val) ? val.filter((ch) => !ch.hid) : val && typeof val === "object" && !Array.isArray(val) ? Object.fromEntries(Object.keys(val).sort().map((kk) => [kk, val[kk]])) : val));
    const a = canon({ ...prev, sources: undefined, figmaDataIssue: undefined }), b = canon({ ...rec, sources: undefined, figmaDataIssue: undefined });
    if (a === b) {
      const rich = (r) => JSON.stringify(r.tree || {}).includes('"nid"');
      if (rich(rec) && !rich(prev)) { const keep = prev.sources; Object.assign(prev, rec, { sources: keep }); }
      if (!prev.sources.includes(file)) prev.sources.push(file); return;
    }
    if (rec.id === null) {
      // Summary rows carry no node id. Two different rows under one name = Figma has duplicate variant names.
      // Keep both, flag both; which one is canonical is a human decision.
      let n = 2; while (e.variants.has(`${key}#${n}`)) n++;
      prev.figmaDataIssue = rec.figmaDataIssue = 'duplicate-variant-name';
      e.variants.set(`${key}#${n}`, { ...rec, duplicateIndex: n, sources: [file] });
      figmaDataIssues.push({ set: e.set.name, setId: e.set.id, issue: 'duplicate-variant-name', variant: rec.name, copies: n, differs: diffKeys(prev.summary, rec.summary) });
      return;
    }
    const diffs = [];
    const deep = (x, y, p) => {
      if (diffs.length >= 6) return;
      if (JSON.stringify(x) === JSON.stringify(y)) return;
      if (x && y && typeof x === 'object' && typeof y === 'object' && Array.isArray(x) === Array.isArray(y) && !(Array.isArray(x) && x.length !== y.length)) { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) if (!REST_ONLY.has(k) && k !== 'usedVars' && k !== 'sources') deep(x[k], y[k], p + '.' + k); return; }
      diffs.push(`${p}: ${JSON.stringify(x)?.slice(0, 80)} vs ${JSON.stringify(y)?.slice(0, 80)}`);
    };
    deep(JSON.parse(a), JSON.parse(b), '');
    errors.push(`${e.set.name}: variant ${rec.name} (${rec.id}) captured differently in ${prev.sources.join(', ')} and ${file} :: ${diffs.join(' ; ')}`);
    return;
  }
  e.variants.set(key, { ...rec, sources: [file] });
}
const diffKeys = (a = {}, b = {}) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])).map((k) => ({ field: k, a: a[k], b: b[k] }));
const literalProps =(re) => Object.fromEntries([...String(re).matchAll(/([A-Z][A-Za-z ]*?)=([A-Za-z]+)(?=[,$])/g)].map((m) => [m[1].trim(), m[2]]));

const pending = [];
const rawFiles = fs.readdirSync(RAW).filter((f) => f.endsWith('.json')).sort();
for (const file of rawFiles) {
  const buf = fs.readFileSync(path.join(RAW, file));
  const j = JSON.parse(buf.toString('utf8'));
  const fileSha = sha(buf);
  if (j.v === 1 && j.rows) {
    // summary capture (extract-button-summary.figma.js)
    const e = setEntry({ id: j.setId, name: j.set });
    const fixed = literalProps(j.re);
    e.sources.push({ file, sha256: fileSha, format: 'v1-summary', filter: j.re, captured: j.rows.length, totalMatching: j.rows.length });
    for (const r of j.rows) {
      const [name, w, h, pad, gap, radius, fill, stroke, text, iconCount, effects, padVars] = r;
      const props = { ...fixed, ...Object.fromEntries(name.split(', ').map((kv) => kv.split('='))) };
      const used = new Set([fill?.[2], stroke?.[2], text?.[1], ...(padVars || [])].filter(Boolean));
      addVariant(e, 'name:' + Object.entries(props).sort().map(([k, v]) => `${k}=${v}`).join(','), {
        id: null, name, props, w, h, detail: 'summary',
        summary: { padding: pad, gap, radius, fill: fill && { hex: fill[0], alpha: fill[1], var: fill[2] }, stroke: stroke && { hex: stroke[0], alpha: stroke[1], var: stroke[2], weight: stroke[3], align: stroke[4] }, text: text && { hex: text[0], var: text[1], fontStyle: text[2], fontSize: text[3], lineHeightPct: text[4], textStyle: text[5], characters: text[6] }, iconCount, effects, paddingTopVar: padVars?.[0], paddingLeftVar: padVars?.[1], radiusVar: padVars?.[2] },
        usedVars: [...used],
      }, file);
    }
    continue;
  }
  // v5: dictionary-encoded nodes -> flat {path: props} -> same unflatten as v3/v4
  if (j.v === 5) {
    const e = setEntry(j.set);
    e.sources.push({ file, sha256: fileSha, format: j.src === 'rest' ? 'v5-rest' : 'v5-dict', ...(j.restResponseSha256 ? { restResponseSha256: j.restResponseSha256 } : {}), filter: j.job[1] ?? null, offset: j.offset, captured: j.variants.length, totalMatching: j.total });
    for (const v of j.variants) {
      const flat = {};
      for (const rec of v.n) { const o = {}; for (let i = 1; i < rec.length; i += 2) o[j.keys[rec[i]]] = j.vals[rec[i + 1]]; flat[j.paths[rec[0]]] = o; }
      const tree = unflatten(flat, `${file} ${v.name}`);
      if (tree) pending.push({ e, file, v: { id: v.id, name: v.name, w: tree.w, h: tree.h, rx: v.rx }, tree });
    }
    continue;
  }
  const results = j.results || (j.variants ? [j] : []);
  const jobs = j.jobs || [[j.set.id, null, j.offset, j.variants.length]];
  results.forEach((res, ri) => {
    const e = setEntry(res.set);
    const job = jobs[ri] || [];
    e.sources.push({ file, sha256: fileSha, format: { 2: 'v2-tree', 3: 'v3-delta', 4: 'v4-propdelta' }[j.v] || 'v2-tree', filter: job[1] ?? null, offset: res.offset, captured: res.variants.length, totalMatching: res.total });
    let baseFlat = null;
    for (const v of res.variants) {
      let tree;
      if (v.tree) tree = v.tree;
      else if (v.base) { baseFlat = v.base; tree = unflatten(v.base, `${file} ${v.name}`); }
      else if (v.set || v.add || v.del) {
        if (!baseFlat) { errors.push(`${file} ${v.name}: delta without base`); continue; }
        let flat;
        if (j.v === 4) {
          // property-level delta: set[path] = {key: value|null}, add[path] = full props
          flat = Object.fromEntries(Object.entries(baseFlat).map(([k, o]) => [k, { ...o }]));
          for (const [p, d] of Object.entries(v.set || {})) for (const [k, val] of Object.entries(d)) { if (val === null) delete flat[p][k]; else flat[p][k] = val; }
          for (const [p, o] of Object.entries(v.add || {})) flat[p] = o;
        } else flat = { ...baseFlat, ...v.set };
        for (const d of v.del || []) delete flat[d];
        tree = unflatten(flat, `${file} ${v.name}`);
      } else { errors.push(`${file} ${v.name}: no tree/base/set`); continue; }
      if (!tree) continue;
      pending.push({ e, file, v, tree });
    }
  });
}
// Uniform variant record for every tree format: root carries no name (= variant name), props parsed from the name,
// reaction destinations resolved to variant names (v4/v5 store node ids). Same variant from two formats must be identical.
const idToName = new Map(pending.map((p) => [p.v.id, p.v.name]));
// letter spacing: [v,"PERCENT"] (of font size) -> [px,"PIXELS"]; identical rendered value, one canonical form for all sources
// instance property values equal to the set's definition default are dropped for EVERY source (early v2/v3 captures kept
// them; v5 and REST drop them). Definitions + rule: pipeline/figma-rest/defs.mjs (shared with the REST converter).
const { list: DEFS_LIST } = loadDefs(KIT);
const canonCp = (n) => {
  if (n.cp && n.inst) { for (const [k, v] of Object.entries(n.cp)) if (isDefault(DEFS_LIST, n.inst.setId, k, v)) delete n.cp[k]; if (!Object.keys(n.cp).length) delete n.cp; }
  (n.c || []).forEach(canonCp);
};
const canonLs = (n) => { if (Array.isArray(n.ls) && n.ls[1] === 'PERCENT' && typeof n.fsz === 'number') n.ls = [Math.round(n.ls[0] * n.fsz) / 100, 'PIXELS']; (n.c || []).forEach(canonLs); };
for (const { e, file, v, tree } of pending) {
  delete tree.n; delete tree.id; canonLs(tree); canonCp(tree);
  const stripIds = (n) => { delete n.id; (n.c || []).forEach(stripIds); }; stripIds(tree);
  if (tree.w !== undefined && (Math.abs(tree.w - v.w) > 0.01 || Math.abs(tree.h - v.h) > 0.01)) errors.push(`${file} ${v.name}: root size ${tree.w}x${tree.h} != variant ${v.w}x${v.h}`);
  const props = Object.fromEntries(v.name.split(', ').map((kv) => kv.split('=')));
  const reactions = v.rx ? v.rx.map(([t, a, d]) => [t, a, d && idToName.has(d) ? idToName.get(d) : d]) : undefined;
  addVariant(e, 'id:' + v.id, { id: v.id, name: v.name, props, w: v.w, h: v.h, reactions, detail: 'tree', tree, usedVars: [...collectVars(tree, new Set())].sort() }, file);
}
// A full tree supersedes a summary row describing the same variant (same props); duplicate names among trees are Figma data issues.
for (const e of sets.values()) {
  const treesByName = new Map();
  for (const r of e.variants.values()) if (r.detail === 'tree') { if (!treesByName.has(r.name)) treesByName.set(r.name, []); treesByName.get(r.name).push(r); }
  for (const [k, r] of [...e.variants]) if (r.detail === 'summary') {
    const full = [...treesByName.values()].flat().filter((t) => Object.entries(r.props).every(([pk, pv]) => t.props[pk] === pv) && Object.keys(t.props).length === Object.keys(r.props).length);
    if (full.length) e.variants.delete(k);
  }
  for (const [name, list] of treesByName) if (list.length > 1) {
    list.forEach((r) => { r.figmaDataIssue = 'duplicate-variant-name'; });
    if (!figmaDataIssues.some((i) => i.setId === e.set.id && i.variant === name)) figmaDataIssues.push({ set: e.set.name, setId: e.set.id, issue: 'duplicate-variant-name', variant: name, copies: list.length, ids: list.map((r) => r.id) });
  }
}
// drop stale summary-only duplicate issues that a tree now covers
for (let i = figmaDataIssues.length - 1; i >= 0; i--) { const s = sets.get(figmaDataIssues[i].setId); if (figmaDataIssues[i].differs && s && ![...s.variants.values()].some((r) => r.detail === 'summary')) figmaDataIssues.splice(i, 1); }

// ---------- write normalized specs ----------
const report = { normalizerVersion: NORMALIZER_VERSION, figmaFile: FIGMA_FILE, rawFiles: rawFiles.length, sets: [], figmaDataIssues, errors };
const outputs = new Map();
for (const [id, e] of [...sets].sort((a, b) => a[0].localeCompare(b[0]))) {
  const variants = [...e.variants.values()].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const varNames = [...new Set(variants.flatMap((v) => v.usedVars))].sort();
  const variables = Object.fromEntries(varNames.map((n) => [n, resolveVar(n)]));
  const varStatus = {};
  for (const r of Object.values(variables)) varStatus[r.status] = (varStatus[r.status] || 0) + 1;
  // coverage per capture filter: Figma's own count of matching variants vs captured unique variants
  const filters = {};
  for (const s of e.sources) { const k = String(s.filter); filters[k] ??= { totalMatching: s.totalMatching, captured: 0 }; filters[k].captured += s.captured; }
  const spec = {
    schema: 'igdsx-spec/1', normalizerVersion: NORMALIZER_VERSION, figmaFile: FIGMA_FILE,
    set: e.set, sources: e.sources, coverage: { uniqueVariants: variants.length, byFilter: filters, detail: { tree: variants.filter((v) => v.detail === 'tree').length, summary: variants.filter((v) => v.detail === 'summary').length } },
    variables, variants: variants.map(({ usedVars, ...v }) => ({ ...v, vars: usedVars.sort(), provenance: 'figma' })),
  };
  const fname = id.replace(/:/g, '-') + '.json';
  outputs.set(fname, JSON.stringify(spec, null, 1) + '\n');
  report.sets.push({ id, name: e.set.name, file: 'spec/sets/' + fname, uniqueVariants: variants.length, byFilter: filters, variables: varStatus });
}
outputs.set('../NORMALIZE-REPORT.json', JSON.stringify(report, null, 1) + '\n');

let changed = 0;
fs.mkdirSync(OUT, { recursive: true });
for (const [f, s] of outputs) {
  const p = path.join(OUT, f);
  const old = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (old === s) continue;
  changed++;
  if (!CHECK) fs.writeFileSync(p, s);
}
for (const s of report.sets) console.log(`${s.id.padEnd(12)} ${s.name.padEnd(24)} variants=${String(s.uniqueVariants).padStart(3)}  vars=${JSON.stringify(s.variables)}  filters=${Object.values(s.byFilter).map((f) => f.captured + '/' + f.totalMatching).join(' ')}`);
console.log(`sets=${report.sets.length} figmaDataIssues=${figmaDataIssues.length} errors=${errors.length} ${CHECK ? 'would change' : 'changed'}=${changed}`);
for (const i of figmaDataIssues) console.log('FIGMA-DATA-ISSUE', i.set, i.issue, i.variant, i.differs ? 'differs: ' + i.differs.map((d) => d.field).join(',') : 'ids: ' + (i.ids || []).join(','));
for (const e of errors) console.error('ERROR', e);
process.exit(errors.length || (CHECK && changed) ? 1 : 0);

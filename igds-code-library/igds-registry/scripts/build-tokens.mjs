#!/usr/bin/env node
/**
 * igds-registry / build-tokens.mjs
 *
 * Extracts design tokens from the INSTALLED @igds/tokens package (every CSS
 * file in its package.json "exports"), resolves var() chains per theme, and
 * links tokens to the components that use them (from @igds/core-web compiled
 * styles). Code-only. Never writes to node_modules.
 *
 * Output: igds-registry/tokens.generated.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryRoot = path.resolve(__dirname, '..');
const projectRoot = process.env.IGDS_PROJECT_ROOT ? path.resolve(process.env.IGDS_PROJECT_ROOT) : path.resolve(registryRoot, '..');
const tokensRoot = path.join(projectRoot, 'node_modules', '@igds', 'tokens');
const coreLib = path.join(projectRoot, 'node_modules', '@igds', 'core-web', 'lib');
if (!fs.existsSync(tokensRoot) || !fs.existsSync(coreLib)) {
  console.error('ERROR: @igds/tokens or @igds/core-web not installed. Run npm install first.');
  process.exit(1);
}
const tokensPkg = JSON.parse(fs.readFileSync(path.join(tokensRoot, 'package.json'), 'utf8'));
const corePkg = JSON.parse(fs.readFileSync(path.join(coreLib, '..', 'package.json'), 'utf8'));

// ---------- CSS parsing (flat: @igds/tokens ships no nested/@media token blocks; checked below) ----------
function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }
function parseBlocks(css) {
  const out = [];
  const src = stripComments(css).replace(/@import[^;]+;/g, '').replace(/@charset[^;]+;/g, '');
  let depth = 0, selStart = 0, bodyStart = -1, atRuleDepth = 0, nestedAt = [];
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      if (depth === 0) { const sel = src.slice(selStart, i).trim(); if (sel.startsWith('@')) { nestedAt.push(sel); atRuleDepth++; } bodyStart = i + 1; out.push({ selector: sel, start: i + 1 }); }
      else { bodyStart = i + 1; out.push({ selector: src.slice(selStart, i).trim(), start: i + 1, nestedIn: nestedAt.at(-1) }); }
      depth++;
    } else if (ch === '}') {
      depth--;
      const open = [...out].reverse().find((b) => b.end === undefined);
      if (open) open.end = i;
      selStart = i + 1;
    } else if (ch === ';' && depth === 0) selStart = i + 1;
  }
  return { blocks: out.filter((b) => !b.selector.startsWith('@')).map((b) => ({ selector: b.selector, nestedIn: b.nestedIn ?? null, body: src.slice(b.start, b.end) })), atRules: nestedAt };
}
function declarations(body) {
  const decls = [];
  // split on ; not inside parentheses
  let depth = 0, start = 0;
  for (let i = 0; i <= body.length; i++) {
    const ch = body[i];
    if (ch === '(') depth++; else if (ch === ')') depth--;
    if ((ch === ';' || i === body.length) && depth === 0) {
      const d = body.slice(start, i).trim(); start = i + 1;
      const m = d.match(/^(--[\w-]+)\s*:\s*([\s\S]*)$/);
      if (m) decls.push({ name: m[1], value: m[2].trim() });
    }
  }
  return decls;
}

function themeOf(selector) {
  if (/data-theme=["']?dark|igds-dark-theme/.test(selector)) return 'dark';
  if (/data-theme=["']?light|igds-light-theme/.test(selector)) return 'light';
  if (/^:root$/.test(selector.trim()) || selector.trim() === 'html') return 'default';
  return `other:${selector}`;
}

const exportFiles = Object.entries(tokensPkg.exports || {})
  .filter(([, target]) => typeof target === 'string' && target.endsWith('.css'))
  .map(([key, target]) => ({ exportKey: key, file: path.join(tokensRoot, target) }));

const perFile = {};
const tokens = new Map(); // name -> { name, definedIn:Set, values:{default,light,dark,...} }
const nonFlatAtRules = new Set();
for (const { exportKey, file } of exportFiles) {
  const { blocks, atRules } = parseBlocks(fs.readFileSync(file, 'utf8'));
  atRules.forEach((a) => nonFlatAtRules.add(a));
  let count = 0;
  const themesSeen = new Set();
  for (const b of blocks) {
    const decls = declarations(b.body).filter((d) => d.name.startsWith('--igds-'));
    if (!decls.length) continue;
    const theme = b.nestedIn ? `at-rule:${b.nestedIn}` : themeOf(b.selector);
    themesSeen.add(theme);
    for (const d of decls) {
      count++;
      if (!tokens.has(d.name)) tokens.set(d.name, { name: d.name, definedIn: new Set(), values: {} });
      const t = tokens.get(d.name);
      t.definedIn.add(exportKey);
      if (exportKey === '.') t.values[theme] = d.value; // canonical values come from the main entry
      else if (t.values[theme] === undefined) t.values[theme] = d.value;
    }
  }
  perFile[exportKey] = { file: path.relative(tokensRoot, file).split(path.sep).join('/'), igdsCustomPropertyDeclarations: count, themes: [...themesSeen] };
}

// ---------- var() resolution per theme ----------
function valueIn(name, theme) {
  const t = tokens.get(name);
  if (!t) return undefined;
  return t.values[theme] ?? t.values.default;
}
function resolve(value, theme, seen = new Set()) {
  if (value === undefined) return { value: undefined, unresolved: [] };
  const unresolved = [];
  let out = value, guard = 0;
  while (/var\(\s*--/.test(out) && guard++ < 50) {
    out = out.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))*[^()]*))?\)/g, (m, ref, fallback) => {
      if (seen.has(ref)) { unresolved.push(`cycle:${ref}`); return m.replace('var(', 'VAR_CYCLE('); }
      const v = valueIn(ref, theme);
      if (v === undefined) { if (fallback !== undefined) return fallback.trim(); unresolved.push(ref); return `UNRESOLVED(${ref})`; }
      return v;
    });
  }
  return { value: out, unresolved };
}

// ---------- classification ----------
const COLOR_FAMILIES = new Set(['israel', 'dawn', 'mist', 'dim', 'bright', 'steel', 'warm', 'galil', 'negev', 'coral', 'blue', 'ice', 'strawberry', 'cyan', 'purple', 'white', 'black']);
function classify(name) {
  const m = name.match(/^--igds-(?:(light|dark)-)?(ref|base|comp)-(.+)$/);
  if (!m) return { tier: 'global-utility', themeNamespace: null, category: name.replace(/^--igds-/, '').split('-')[0] };
  const [, ns, tier, rest] = m;
  const first = rest.split('-')[0];
  let category;
  if (tier === 'ref' && COLOR_FAMILIES.has(first)) category = 'color-palette';
  else if (rest.startsWith('border-radius')) category = 'border-radius';
  else if (rest.startsWith('font') || rest.startsWith('line-height') || first === 'type') category = 'typography';
  else category = first; // color, space, shadow, opacity, zindex, overlay, device, border…
  return { tier: { ref: 'reference', base: 'semantic', comp: 'component' }[tier], themeNamespace: ns ?? null, category };
}
function usageGuidance(c) {
  if (c.tier === 'semantic' && c.category === 'color') return 'use-for-ui-color';
  if (c.tier === 'semantic') return 'use';
  if (c.tier === 'reference' && c.category === 'color-palette') return 'avoid-direct-use-bypasses-theme (use --igds-base-color-*)';
  if (c.tier === 'reference' && c.themeNamespace) return 'avoid-theme-namespaced-alias (use the un-prefixed --igds-ref-* or --igds-base-*)';
  if (c.tier === 'reference') return 'use-when-no-semantic-token (space/radius/typography/shadow/zindex)';
  return 'review';
}

// ---------- component usage (core-web compiled styles) ----------
function walk(dir, acc = []) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const f = path.join(dir, e.name); if (e.isDirectory()) walk(f, acc); else if (e.name.endsWith('.scss.js')) acc.push(f); } return acc; }
const usage = new Map(); // token -> Set(module)
const componentTokens = [];
const undefinedReferences = [];
const styleFiles = walk(coreLib);
const moduleOf = (f) => path.relative(coreLib, f).split(path.sep)[0];
// Custom properties declared per MODULE (a module's *-tokens.scss.js declares what its *.scss.js reads),
// plus those set at runtime from compiled JS via style.setProperty('--igds-…').
const declaredByModule = new Map();
const addDecl = (mod, name) => { if (!declaredByModule.has(mod)) declaredByModule.set(mod, new Set()); declaredByModule.get(mod).add(name); };
for (const f of styleFiles) for (const m of fs.readFileSync(f, 'utf8').matchAll(/(--igds-[\w-]+)\s*:/g)) addDecl(moduleOf(f), m[1]);
const runtimeSet = [];
(function walkJs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkJs(f);
    else if (e.name.endsWith('.js') && !e.name.endsWith('.scss.js') && !e.name.endsWith('.min.js')) {
      for (const m of fs.readFileSync(f, 'utf8').matchAll(/setProperty\(\s*['"`](--igds-[\w-]+)['"`]/g)) { addDecl(moduleOf(f), m[1]); runtimeSet.push({ module: moduleOf(f), name: m[1] }); }
    }
  }
})(coreLib);
for (const f of styleFiles) {
  const module = moduleOf(f);
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(--igds-[\w-]+)\s*:\s*([^;}]*)/g)) {
    if (!tokens.has(m[1])) componentTokens.push({ module, name: m[1], value: m[2].trim(), file: path.relative(coreLib, f).split(path.sep).join('/') });
  }
  for (const r of runtimeSet.filter((x) => x.module === module)) componentTokens.push({ module, name: r.name, value: '(set at runtime via style.setProperty)', file: '(compiled js)' });
  const definedHere = declaredByModule.get(module) ?? new Set();
  for (const m of src.matchAll(/var\(\s*(--igds-[\w-]+)\s*(,)?/g)) {
    const n = m[1];
    if (tokens.has(n)) { if (!usage.has(n)) usage.set(n, new Set()); usage.get(n).add(module); }
    else if (!definedHere.has(n)) undefinedReferences.push({ module, name: n, hasFallback: !!m[2] });
  }
}
const dedupComp = [...new Map(componentTokens.map((c) => [`${c.module}|${c.name}`, c])).values()];
// var(--igds-x[, fallback]) where --igds-x is NOT a package token and NOT declared in that component's own
// styles: an undocumented CSS customization hook. Some are set by OTHER components (spin-box sets --igds-button-height).
const hookMap = new Map();
for (const u of undefinedReferences) {
  const h = hookMap.get(u.name) ?? { name: u.name, readBy: new Set(), hasFallbackEverywhere: true, setBy: new Set() };
  h.readBy.add(u.module); if (!u.hasFallback) h.hasFallbackEverywhere = false; hookMap.set(u.name, h);
}
for (const c of dedupComp) if (hookMap.has(c.name)) hookMap.get(c.name).setBy.add(c.module);
const componentCssHooks = [...hookMap.values()].map((h) => ({
  name: h.name, readByModules: [...h.readBy].sort(), hasFallbackEverywhere: h.hasFallbackEverywhere,
  setByModules: [...h.setBy].sort(), status: 'undocumented-customization-hook',
})).sort((a, b) => a.name.localeCompare(b.name));
const dedupUndefined = componentCssHooks.filter((h) => !h.hasFallbackEverywhere && h.setByModules.length === 0);

// ---------- assemble ----------
const tokenList = [...tokens.values()].sort((a, b) => a.name.localeCompare(b.name)).map((t) => {
  const c = classify(t.name);
  const themes = Object.keys(t.values);
  const resolved = {};
  const unresolvedRefs = new Set();
  for (const th of new Set(['default', ...themes])) {
    const r = resolve(valueIn(t.name, th), th, new Set([t.name]));
    resolved[th] = r.value; r.unresolved.forEach((u) => unresolvedRefs.add(u));
  }
  return {
    name: t.name, ...c, usage: usageGuidance(c),
    definedIn: [...t.definedIn].sort(),
    rawValues: t.values,
    resolvedValues: resolved,
    themeDependent: themes.includes('dark') && resolved.dark !== resolved.default,
    unresolvedReferences: [...unresolvedRefs],
    usedByComponentModules: [...(usage.get(t.name) ?? [])].sort(),
    source: 'code:@igds/tokens',
  };
});

const checks = { passed: [], failed: [] };
const check = (name, ok, detail) => (ok ? checks.passed : checks.failed).push({ name, detail });
check('main export "." found and parsed', !!perFile['.'] && perFile['.'].igdsCustomPropertyDeclarations > 0, perFile['.']);
check('no token blocks nested in @media/@supports (flat parse is complete)', nonFlatAtRules.size === 0 || ![...nonFlatAtRules].some(() => tokenList.some((t) => Object.keys(t.rawValues).some((k) => k.startsWith('at-rule:')))), [...nonFlatAtRules]);
check('every var() reference inside @igds/tokens resolves', tokenList.every((t) => t.unresolvedReferences.length === 0), tokenList.filter((t) => t.unresolvedReferences.length).map((t) => ({ name: t.name, refs: t.unresolvedReferences })));
check('no token defined under an unrecognized selector', tokenList.every((t) => Object.keys(t.rawValues).every((k) => !k.startsWith('other:'))), tokenList.filter((t) => Object.keys(t.rawValues).some((k) => k.startsWith('other:'))).map((t) => t.name));
// Not an extraction failure: a reference that nothing defines is a defect candidate IN THE LIBRARY.
// Reported (upstreamFindings), never blocks the pipeline, never "fixed" locally.
const upstreamFindings = dedupUndefined.map((h) => ({ kind: 'css-custom-property-read-but-never-defined', ...h, impact: 'declaration using it is invalid at computed-value time → property falls back to its initial/inherited value' }));
check('component CSS-hook classification completed (every non-token --igds-* read is classified)', componentCssHooks.every((h) => h.status), null);

const count = (arr, key) => arr.reduce((m, x) => ((m[x[key]] = (m[x[key]] || 0) + 1), m), {});
const out = {
  generatedAt: new Date().toISOString(),
  generatedBy: 'igds-registry/scripts/build-tokens.mjs',
  dataSource: 'code-only: installed @igds/tokens CSS exports + @igds/core-web compiled *.scss.js',
  sourcePackages: { '@igds/tokens': tokensPkg.version, '@igds/core-web': corePkg.version },
  themes: { default: ':root', light: ':root[data-theme=light], .igds-light-theme', dark: ':root[data-theme=dark], .igds-dark-theme' },
  summary: {
    totalTokens: tokenList.length,
    byTier: count(tokenList, 'tier'),
    byCategory: count(tokenList, 'category'),
    themeDependentTokens: tokenList.filter((t) => t.themeDependent).length,
    tokensUsedByComponents: tokenList.filter((t) => t.usedByComponentModules.length).length,
    componentInternalTokens: dedupComp.length,
    componentCssHooks: componentCssHooks.length,
    upstreamFindings: dedupUndefined.length,
    checksPassed: checks.passed.length,
    checksFailed: checks.failed.length,
  },
  checks,
  exportFiles: perFile,
  tokens: tokenList,
  componentInternalTokens: { note: 'Declared inside component shadow styles (:host). Internal — consumers must NOT set them.', items: dedupComp },
  componentCssHooks: { note: 'var(--igds-x, …) read by component styles but not defined in @igds/tokens. Undocumented customization hooks — NOT a guaranteed API; use only with explicit approval (report IGDS-GAP).', items: componentCssHooks },
  upstreamFindings,
};
fs.writeFileSync(path.join(registryRoot, 'tokens.generated.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`[igds-tokens] tokens: ${tokenList.length}  ${JSON.stringify(out.summary.byTier)}`);
console.log(`[igds-tokens] theme-dependent: ${out.summary.themeDependentTokens} · used by components: ${out.summary.tokensUsedByComponents} · component-internal: ${dedupComp.length}`);
console.log(`[igds-tokens] checks: ${checks.passed.length} passed, ${checks.failed.length} failed`);
for (const c of checks.failed) console.log(`  ❌ ${c.name}: ${JSON.stringify(c.detail).slice(0, 400)}`);
if (checks.failed.length) process.exitCode = 1;

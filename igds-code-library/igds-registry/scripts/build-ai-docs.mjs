#!/usr/bin/env node
/**
 * igds-registry / build-ai-docs.mjs
 *
 * Renders the machine registry into compact, AI-readable catalogs (tool-neutral Markdown):
 *   igds-registry/ai/IGDS-COMPONENTS.md   — every tag: import, attributes/values/defaults, JS-only props, events, slots, methods, Figma link
 *   igds-registry/ai/IGDS-TOKENS.md       — every usable token, by purpose, with light/dark values
 * Inputs: components.generated.json, tokens.generated.json, [runtime-verification.generated.json], [figma/figma-mapping.generated.json]
 * Pure rendering — adds no facts of its own. Never edit the outputs by hand.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.resolve(__dirname, '..');
const read = (f) => (fs.existsSync(path.join(R, f)) ? JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')) : null);
const reg = read('components.generated.json');
const tok = read('tokens.generated.json');
const rt = read('runtime-verification.generated.json');
const fig = read('figma/figma-mapping.generated.json');
if (!reg || !tok) { console.error('ERROR: run build-registry + build-tokens first'); process.exit(1); }
fs.mkdirSync(path.join(R, 'ai'), { recursive: true });

const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const rtBy = new Map((rt?.components ?? []).map((c) => [c.tag, c]));
const figBy = new Map();
for (const m of fig?.componentSets ?? []) if (m.match?.tag && !m.figma.isPrivateBuildingBlock) { if (!figBy.has(m.match.tag)) figBy.set(m.match.tag, []); figBy.get(m.match.tag).push(m); }
const fmtDefault = (v) => {
  if (v === undefined) return '';
  if (v && typeof v === 'object' && v.undefined) return '';
  if (v && typeof v === 'object' && (v.function || v.element || v.unserializable)) return '';
  const s = JSON.stringify(v); return s.length > 30 ? s.slice(0, 27) + '…' : s;
};
const typeCell = (t) => { const s = String(t).replace(/\s+/g, ' '); return s.length > 110 ? s.slice(0, 107) + '…' : s; };

// ---------------- components ----------------
const L = [];
L.push('# IGDS — Components catalog (generated)', '');
L.push(`> Generated ${reg.generatedAt.slice(0, 10)} from **@igds/core-web ${reg.sourcePackages['@igds/core-web']}** by \`igds-registry/scripts/build-ai-docs.mjs\`. Do not edit by hand — run \`npm run igds:refresh\`.`);
L.push(`> Verification: tags & attributes ${rt ? `**runtime-verified** in ${rt.browser} (${rt.summary.registered}/${rt.summary.components} registered, ${rt.summary.checksFailed} failed checks)` : '**NOT runtime-verified** (run `npm run igds:verify`)'} · events/slots from static code scan · methods: only those classified as consumer API · Figma: automatic match, see confidence.`, '');
L.push('**How to read a component:**');
L.push('- `attribute` column = exact HTML attribute name. `—` = JS-only property (set it in code, not in HTML).');
L.push('- Values in quotes are the ONLY allowed values. Boolean attributes: presence = true (`disabled="false"` still disables).');
L.push('- `default` = value at runtime when not set (runtime-measured).');
L.push('- Events are `CustomEvent`s; read `event.detail.value`. `checkedChange`/`valueChange` are Angular-compat only.', '');
L.push('## Index', '');
const byModule = new Map();
for (const c of reg.components) { if (!byModule.has(c.npmModule)) byModule.set(c.npmModule, []); byModule.get(c.npmModule).push(c); }
L.push([...byModule.entries()].map(([m, cs]) => `**${m}**: ${cs.map((c) => `\`${c.tag}\``).join(' ')}`).join(' · '), '');

for (const [module, cs] of byModule) {
  L.push(`## ${module}`, '', `Import (bundler): \`import '@igds/core-web/${module}';\` — static HTML: the browser bundle registers it (see RULES §2).`, '');
  for (const c of cs) {
    const r = rtBy.get(c.tag);
    L.push(`### \`<${c.tag}>\``, '');
    const meta = [`class \`${c.className}\``];
    if (c.extendsAngularFormElement) meta.push('form element (`checked`, `value`, form-associated)');
    const figs = figBy.get(c.tag) ?? [];
    if (figs.length) meta.push('Figma: ' + figs.slice(0, 4).map((m) => `${m.figma.name} \`${m.figma.id}\` (${m.match.confidence})`).join(', ') + (figs.length > 4 ? ` +${figs.length - 4}` : ''));
    L.push(meta.join(' · '), '');
    const rtWarn = rt?.warnings?.find((w) => w.tag === c.tag && String(w.kind).startsWith('throws'));
    if (rtWarn) L.push(`> ⚠️ Throws when rendered on its own — use only inside its parent component.`, '');
    const attrs = c.props.filter((p) => p.isHtmlAttribute);
    const jsOnly = c.props.filter((p) => !p.isHtmlAttribute);
    if (attrs.length) {
      L.push('| attribute | property | type / allowed values | default |', '|---|---|---|---|');
      const rejected = new Map((r?.attributesRejectedAtRuntime ?? []).map((x) => [x.attribute, x.warning]));
      for (const p of attrs) L.push(`| \`${p.attribute}\`${rejected.has(p.attribute) ? ' ⛔ **do not use**' : ''} | ${p.name} | ${esc(typeCell(p.type))} | ${esc(fmtDefault(r?.defaults?.[p.name]))} |`);
      L.push('');
      for (const [a, w] of rejected) L.push(`> ⛔ \`${a}\` is ignored by the component at runtime (verified in the browser: renders nothing, console says: "${esc(w)}"). \`npm run igds:lint\` reports it as an error.`, '');
      if (c.tag === 'igds-icon' && rejected.has('name')) L.push('> Correct usage (verified in the browser): pass the SVG content of an official icon in the `node` **property** (JS), never by name:', '> bundler: `import { calendar } from \'@igds/icons\'; iconEl.node = calendar;` · static page: `iconEl.node = <icon export from @igds/icons>` (the govlab-igds-kit package exposes them as `window.IGDSIcons`).', '> Meaningful icon: also set `accessible-name`. Decorative icon: `aria-hidden="true"`.', '');
    }
    if (jsOnly.length) L.push(`JS-only properties: ${jsOnly.map((p) => `\`${p.name}\`: ${esc(typeCell(p.type))}`).join(' · ')}`, '');
    if (c.events.length) L.push(`Events: ${c.events.map((e) => `\`${e.name}\`${e.detail?.valueExpressions?.length ? ` (value: ${esc(e.detail.valueExpressions.join(' / ').slice(0, 50))})` : ''}`).join(' · ')}`, '');
    if (c.slots.length) L.push(`Slots: ${c.slots.map((s) => `\`${s.name}\``).join(' · ')}`, '');
    const methods = c.publicApiMethods.filter((m) => m.classification === 'consumer-api-standard-element' || m.classification === 'candidate-consumer-api');
    if (methods.length) L.push(`Methods: ${methods.map((m) => `\`${m.name}()\`${m.classification === 'candidate-consumer-api' ? '*' : ''}`).join(' · ')}${methods.some((m) => m.classification === 'candidate-consumer-api') ? '  (*heuristic — prefer attributes)' : ''}`, '');
  }
}
L.push('## Not in the library (Figma components with no code component)', '');
L.push('Do **not** build these. Report `IGDS-GAP` (format in RULES §8). Full list with node links: `igds-registry/figma/figma-gaps.generated.md`.', '');
const noCode = (fig?.componentSets ?? []).filter((m) => !m.figma.isPrivateBuildingBlock && !m.match.tag);
const byPage = new Map(); for (const m of noCode) { if (!byPage.has(m.figma.page)) byPage.set(m.figma.page, []); byPage.get(m.figma.page).push(m.figma.name); }
L.push([...byPage.entries()].map(([p, ns]) => `**${p}**: ${[...new Set(ns)].join(', ')}`).join(' · '), '');
fs.writeFileSync(path.join(R, 'ai', 'IGDS-COMPONENTS.md'), L.join('\n'), 'utf8');

// ---------------- tokens ----------------
const T = [];
T.push('# IGDS — Design tokens catalog (generated)', '');
T.push(`> Generated ${tok.generatedAt.slice(0, 10)} from **@igds/tokens ${tok.sourcePackages['@igds/tokens']}**. Do not edit by hand — run \`npm run igds:refresh\`.`, '');
T.push('**Rules:** UI colors → `--igds-base-color-*` only (they switch with the theme). Spacing/radius/typography/shadow → the tokens listed below. Never use raw hex/px. Never invent a token name — `npm run igds:lint` rejects unknown `--igds-*` names.', '');
T.push(`Themes: default \`:root\` · dark: \`${tok.themes.dark}\`.`, '');
const usable = tok.tokens.filter((t) => !t.themeNamespace && t.tier !== 'global-utility');
const val = (t, th) => esc(String(t.resolvedValues[th] ?? t.resolvedValues.default ?? '').slice(0, 60));
const section = (title, list, withDark) => {
  if (!list.length) return;
  T.push(`## ${title} (${list.length})`, '');
  T.push(withDark ? '| token | light | dark |' : '| token | value |', withDark ? '|---|---|---|' : '|---|---|');
  for (const t of list) T.push(withDark ? `| \`${t.name}\` | ${val(t, 'default')} | ${t.themeDependent ? val(t, 'dark') : '='} |` : `| \`${t.name}\` | ${val(t, 'default')} |`);
  T.push('');
};
const semColor = usable.filter((t) => t.tier === 'semantic' && t.category === 'color');
const groups = new Map();
for (const t of semColor) { const g = t.name.replace('--igds-base-color-', '').split('-')[0]; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(t); }
for (const [g, list] of groups) section(`Color — ${g}`, list, true);
section('Typography (semantic)', usable.filter((t) => t.tier === 'semantic' && t.category === 'type' || t.name.startsWith('--igds-base-type')), false);
section('Typography (reference)', usable.filter((t) => t.tier === 'reference' && t.category === 'typography'), false);
section('Space', usable.filter((t) => t.category === 'space'), false);
section('Border radius', usable.filter((t) => t.category === 'border-radius'), false);
section('Border', usable.filter((t) => t.category === 'border'), false);
section('Shadow', usable.filter((t) => t.category === 'shadow'), false);
section('Z-index', usable.filter((t) => t.category === 'zindex'), false);
section('Opacity', usable.filter((t) => t.category === 'opacity'), false);
section('Device widths (breakpoints)', usable.filter((t) => t.category === 'device'), false);
const palette = usable.filter((t) => t.category === 'color-palette');
T.push(`## Color palette — reference only, avoid in UI (${palette.length})`, '', 'Exists for the semantic tokens to point at. Using these directly bypasses dark mode. Names: ' + palette.map((t) => `\`${t.name}\``).join(' '), '');
T.push('## Not public API', '');
T.push(`- \`--igds-light-*\` / \`--igds-dark-*\` aliases (${tok.tokens.filter((t) => t.themeNamespace).length}) — use the un-prefixed name.`);
T.push(`- Component-internal tokens \`--igds-light-comp-*\` etc. (${tok.componentInternalTokens.items.length}) — set inside components; never set them.`);
T.push(`- Component CSS hooks (${tok.componentCssHooks.items.length}, e.g. \`--igds-input-height\`) — undocumented; use only with approval (IGDS-GAP).`, '');
fs.writeFileSync(path.join(R, 'ai', 'IGDS-TOKENS.md'), T.join('\n'), 'utf8');

const kb = (f) => (fs.statSync(path.join(R, 'ai', f)).size / 1024).toFixed(0) + ' KB';
console.log(`[igds-ai-docs] IGDS-COMPONENTS.md ${kb('IGDS-COMPONENTS.md')} · IGDS-TOKENS.md ${kb('IGDS-TOKENS.md')}`);

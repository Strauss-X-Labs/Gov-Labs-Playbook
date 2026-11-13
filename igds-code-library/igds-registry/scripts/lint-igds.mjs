#!/usr/bin/env node
/**
 * igds-registry / lint-igds.mjs — quality gate for AI-generated (and human) UI code.
 *
 * Validates usage of IGDS against the GENERATED registry (never a hand-written list):
 *   E-TAG        unknown <igds-*> element
 *   E-ATTR       attribute not supported by that element (hint when a property/kebab guess was used)
 *   E-VALUE      value not in the element's allowed values (static values only)
 *   E-ATTR-REJECTED attribute exists in the code but the component ignores it at runtime (browser-verified)
 *   E-BOOL-FALSE boolean attribute written as ="false" (presence = true → it is ON)
 *   E-SLOT       slot="x" not offered by the parent IGDS element
 *   E-PROP       lit .prop binding to a property the element does not have
 *   E-EVENT      lit @event binding / addEventListener('igds-…') to an event the element does not emit
 *   E-TOKEN      var(--igds-…) / --igds-… that does not exist in @igds/tokens
 *   E-BUNDLE     browser bundle loaded in <head> without defer/async/type=module
 *   W-TOKEN-TIER theme-namespaced alias, component-internal token or raw palette color used directly
 *   W-LEGACY     legacy hand-made prototype classes (.gov-*)
 *   W-RAW-COLOR  hard-coded color (hex/rgb/hsl) in CSS
 *
 * Usage: node lint-igds.mjs [paths…] [--json] [--no-warnings]
 * Exit code: 1 if any error (warnings never fail).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.resolve(__dirname, '..');
const projectRoot = process.env.IGDS_PROJECT_ROOT ? path.resolve(process.env.IGDS_PROJECT_ROOT) : path.resolve(R, '..');
const reg = JSON.parse(fs.readFileSync(path.join(R, 'components.generated.json'), 'utf8'));
const tok = JSON.parse(fs.readFileSync(path.join(R, 'tokens.generated.json'), 'utf8'));

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const noWarn = args.includes('--no-warnings');
const targets = args.filter((a) => !a.startsWith('--'));

// ---------- registry views ----------
const comp = new Map(reg.components.map((c) => [c.tag, c]));
const GLOBAL_ATTRS = new Set(['id', 'class', 'style', 'dir', 'lang', 'hidden', 'slot', 'title', 'tabindex', 'role', 'part', 'is', 'inert', 'autofocus', 'translate', 'draggable', 'accesskey', 'contenteditable', 'enterkeyhint', 'inputmode', 'nonce', 'popover', 'spellcheck', 'exportparts', 'key', 'ref']);
const NATIVE_EVENTS = new Set(['click', 'dblclick', 'focus', 'blur', 'focusin', 'focusout', 'keydown', 'keyup', 'input', 'change', 'submit', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'invalid', 'reset']);
const tokenSet = new Set(tok.tokens.map((t) => t.name));
const tokenInfo = new Map(tok.tokens.map((t) => [t.name, t]));
const internalTokens = new Set(tok.componentInternalTokens.items.map((t) => t.name));
const hookTokens = new Set(tok.componentCssHooks.items.map((t) => t.name));
function attrIndex(c) {
  const m = new Map();
  for (const p of c.props) if (p.isHtmlAttribute) m.set(p.attribute.toLowerCase(), p);
  return m;
}
const attrIdx = new Map(reg.components.map((c) => [c.tag, attrIndex(c)]));
// attributes the component rejects at runtime (browser evidence: runtime-verification.generated.json)
const rtFile = path.join(R, 'runtime-verification.generated.json');
const rejectedAttr = new Map(); if (fs.existsSync(rtFile)) for (const r of JSON.parse(fs.readFileSync(rtFile, 'utf8')).components || []) for (const x of r.attributesRejectedAtRuntime || []) rejectedAttr.set(r.tag + ' ' + x.attribute, x.warning);
const enumValues = (p) => { const v = [...String(p.type).matchAll(/"([^"]*)"/g)].map((m) => m[1]); return v.length && /^("[^"]*"\s*\|\s*)*"[^"]*"(\s*\|\s*undefined)?$/.test(String(p.type).trim()) ? v : null; };
const isBool = (p) => /^boolean$/.test(String(p.type).trim());
const typeCell = (t) => String(t).replace(/\s+/g, ' ').slice(0, 60);

// ---------- files ----------
const SKIP_DIRS = new Set(['node_modules', '.git', 'igds-registry', 'dist', 'build', '.kiro', '.cursor', '.claude']);
const EXT = new Set(['.html', '.htm', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.vue', '.css', '.scss', '.md']);
function collect(p, acc) {
  const st = fs.statSync(p);
  if (st.isDirectory()) { for (const e of fs.readdirSync(p)) if (!SKIP_DIRS.has(e)) collect(path.join(p, e), acc); }
  else if (EXT.has(path.extname(p).toLowerCase())) acc.push(p);
  return acc;
}
const files = (targets.length ? targets : [projectRoot]).flatMap((t) => collect(path.resolve(t), []));

// ---------- helpers ----------
const findings = [];
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
const add = (file, src, idx, level, code, message) => findings.push({ file: path.relative(process.cwd(), file).split(path.sep).join('/'), line: lineOf(src, idx), level, code, message });

// Tag tokenizer tolerant to lit bindings: attribute values may contain ${...} with nested braces/quotes.
function* tags(src) {
  const re = /<\/?([a-zA-Z][\w-]*)/g;
  let m;
  while ((m = re.exec(src))) {
    const start = m.index, closing = src[start + 1] === '/', name = m[1].toLowerCase();
    let i = re.lastIndex, depth = 0, quote = null;
    for (; i < src.length; i++) {
      const ch = src[i];
      if (quote) { if (ch === quote && depth === 0) quote = null; else if (ch === '$' && src[i + 1] === '{') { depth++; i++; } else if (ch === '}' && depth) depth--; continue; }
      if (ch === '$' && src[i + 1] === '{') { depth++; i++; continue; }
      if (depth) { if (ch === '}') depth--; continue; }
      if (ch === '"' || ch === "'") { quote = ch; continue; }
      if (ch === '>') break;
    }
    const raw = src.slice(re.lastIndex, i);
    re.lastIndex = i + 1;
    yield { name, closing, start, raw, selfClosing: /\/\s*$/.test(raw) };
  }
}
function parseAttrs(raw) {
  const out = [];
  const re = /([^\s=/>"']+)(?:\s*=\s*("((?:[^"$]|\$\{(?:[^{}]|\{[^{}]*\})*\}|\$)*)"|'((?:[^'$]|\$\{(?:[^{}]|\{[^{}]*\})*\}|\$)*)'|(\$\{(?:[^{}]|\{[^{}]*\})*\})|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1]; if (name === '/') continue;
    const value = m[3] ?? m[4] ?? m[5] ?? m[6] ?? null;
    out.push({ name, value, hasValue: m[2] !== undefined, dynamic: value != null && value.includes('${') });
  }
  return out;
}
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  let ext = path.extname(file).toLowerCase();
  // Framework templates (JSX/TSX/Vue/Angular-in-TS): camelCase props and directives are framework syntax,
  // validated by the framework wrapper, not by this vanilla web-component gate.
  const FRAMEWORK_LANG = /^(tsx|jsx|ts|typescript|vue)$/;
  let frameworkLine = () => ['.tsx', '.jsx', '.vue', '.ts'].includes(ext);
  if (ext === '.md') {
    // lint only fenced code blocks (html/css/js/ts); other lines are blanked so line numbers stay exact
    let inBlock = false, lang = '';
    const fw = new Set();
    src = src.split('\n').map((l, i) => {
      const fence = l.match(/^\s*```\s*([\w-]*)/);
      if (fence) { if (!inBlock) { inBlock = true; lang = fence[1].toLowerCase(); } else inBlock = false; return ''; }
      if (inBlock && FRAMEWORK_LANG.test(lang)) fw.add(i + 1);
      return inBlock && /^(html|htm|css|scss|js|javascript|ts|typescript|tsx|jsx|vue)$/.test(lang) ? l : '';
    }).join('\n');
    const mdSrc = src;
    frameworkLine = (idx) => fw.has(lineOf(mdSrc, idx));
    ext = '.html';
  }
  const isCss = ext === '.css' || ext === '.scss';

  // ---- markup (HTML files, and HTML inside JS/TS template literals) ----
  if (!isCss && /<[a-zA-Z]/.test(src)) {
    const stack = [];
    let inHead = false;
    for (const t of tags(src)) {
      if (t.name === 'head') inHead = !t.closing;
      if (t.closing) { const k = stack.map((s) => s.name).lastIndexOf(t.name); if (k >= 0) stack.length = k; continue; }
      const attrs = parseAttrs(t.raw);
      // E-BUNDLE
      if (t.name === 'script' && inHead) {
        const srcAttr = attrs.find((a) => a.name.toLowerCase() === 'src')?.value ?? '';
        if (/@igds\/core-web\/lib\/index\.min\.js/.test(srcAttr) && !attrs.some((a) => ['defer', 'async'].includes(a.name.toLowerCase()) || (a.name.toLowerCase() === 'type' && a.value === 'module'))) {
          add(file, src, t.start, 'error', 'E-BUNDLE', 'IGDS browser bundle in <head> without `defer` — runtime-verified: only 4 of 73 components register. Add `defer`.');
        }
      }
      // W-LEGACY
      const cls = attrs.find((a) => a.name === 'class' || a.name === 'className')?.value ?? '';
      if (/(^|\s)gov-[\w-]+/.test(cls)) add(file, src, t.start, 'warning', 'W-LEGACY', `legacy prototype class "${cls.match(/gov-[\w-]+/)[0]}" — use the official igds-* component instead`);
      // slot check against nearest parent element if it is an IGDS element
      const slotAttr = attrs.find((a) => a.name === 'slot');
      const parent = stack[stack.length - 1];
      if (slotAttr && !slotAttr.dynamic && parent && comp.has(parent.name)) {
        const pc = comp.get(parent.name);
        if (pc.slots.length && !pc.slots.some((s) => s.name === slotAttr.value)) add(file, src, t.start, 'error', 'E-SLOT', `<${parent.name}> has no slot "${slotAttr.value}". Available: ${pc.slots.map((s) => s.name).join(', ')}`);
        if (!pc.slots.length) add(file, src, t.start, 'error', 'E-SLOT', `<${parent.name}> renders no slots — slotted content is not displayed`);
      }
      if (t.name.startsWith('igds-')) {
        const c = comp.get(t.name);
        if (!c) {
          const near = [...comp.keys()].filter((k) => k.includes(t.name.replace('igds-', '').split('-')[0])).slice(0, 4);
          add(file, src, t.start, 'error', 'E-TAG', `<${t.name}> does not exist in @igds/core-web ${reg.sourcePackages['@igds/core-web']}${near.length ? ` (did you mean ${near.join(', ')}?)` : ''}. If nothing fits, report IGDS-GAP.`);
        } else {
          const idx = attrIdx.get(t.name);
          for (const a of attrs) {
            const n = a.name;
            if (n.startsWith('@')) { // lit event binding
              const ev = n.slice(1);
              if (!c.events.some((e) => e.name === ev) && !NATIVE_EVENTS.has(ev)) add(file, src, t.start, 'error', 'E-EVENT', `<${t.name}> does not emit "${ev}". Emits: ${c.events.map((e) => e.name).join(', ') || '(none)'}`);
              continue;
            }
            if (n.startsWith('.')) { // lit property binding
              const pn = n.slice(1);
              if (!c.props.some((p) => p.name === pn)) add(file, src, t.start, 'error', 'E-PROP', `<${t.name}> has no property "${pn}"`);
              continue;
            }
            const an = (n.startsWith('?') ? n.slice(1) : n).toLowerCase();
            if (GLOBAL_ATTRS.has(an) && !idx.has(an)) continue;
            if (an.startsWith('aria-') || an.startsWith('data-') || an.startsWith('on') && !idx.has(an) && NATIVE_EVENTS.has(an.slice(2))) continue;
            if (/^(v-|:|x-|\[|\(|#|\*)/.test(n)) continue; // framework syntax (Vue/Angular/Alpine) — out of scope
            if (/[A-Z]/.test(n) && frameworkLine(t.start)) continue; // JSX/TSX camelCase prop — framework wrapper's job
            if (/^(formcontrolname|formcontrol|ngmodel|ngif|ngfor)$/.test(an)) continue; // Angular directives
            const p = idx.get(an);
            if (!p) {
              const viaProp = c.props.find((pp) => pp.name.toLowerCase() === an.replace(/-/g, '') || pp.name.toLowerCase() === an);
              let hint = '';
              if (viaProp?.isHtmlAttribute) hint = ` — the attribute is "${viaProp.attribute}"`;
              else if (viaProp) hint = ` — "${viaProp.name}" is a JS-only property; set it in code`;
              add(file, src, t.start, 'error', 'E-ATTR', `<${t.name}> has no attribute "${an}"${hint}`);
              continue;
            }
            if (rejectedAttr.has(t.name + ' ' + an)) { add(file, src, t.start, 'error', 'E-ATTR-REJECTED', `<${t.name}> ignores "${an}" at runtime (verified in the browser: ${rejectedAttr.get(t.name + ' ' + an).slice(0, 140)})`); continue; }
            if (!a.dynamic && a.hasValue && isBool(p) && /^false$/i.test(a.value ?? '')) add(file, src, t.start, 'error', 'E-BOOL-FALSE', `${t.name}[${an}="false"] — boolean attributes are ON when present. Remove the attribute instead.`);
            const isStructured = /\[\]$|^Array<|^Record<|^\{/.test(String(p.type).trim()) || (p.decoratorKind === 'property' && /type:\s*(Array|Object)/.test(JSON.stringify(p)));
            if (isStructured && a.hasValue && !a.dynamic) { try { JSON.parse(a.value); } catch { add(file, src, t.start, 'error', 'E-JSON', `${t.name}[${an}] expects JSON (${typeCell(p.type)}); "${String(a.value).slice(0, 40)}" is not valid JSON. Prefer setting the property in JS.`); } }
            const ev = enumValues(p);
            if (ev && a.hasValue && !a.dynamic && !ev.includes(a.value)) add(file, src, t.start, 'error', 'E-VALUE', `${t.name}[${an}="${a.value}"] is not allowed. Allowed: ${ev.map((v) => `"${v}"`).join(' | ')}`);
          }
        }
      }
      if (!t.selfClosing && !VOID.has(t.name)) stack.push({ name: t.name });
    }
  }

  // ---- addEventListener('igds-…') on a known element variable is too dynamic; check name exists anywhere ----
  if (!isCss) {
    const allEvents = new Set(reg.components.flatMap((c) => c.events.map((e) => e.name)));
    for (const m of src.matchAll(/addEventListener\(\s*['"`](igds-[\w-]+)['"`]/g)) if (!allEvents.has(m[1])) add(file, src, m.index, 'error', 'E-EVENT', `no IGDS component emits "${m[1]}"`);
  }

  // ---- tokens (all file types) ----
  for (const m of src.matchAll(/--igds-[\w-]+/g)) {
    const n = m[0];
    // skip definitions of the user's own --igds-* custom properties? (forbidden namespace — flag anyway)
    if (!tokenSet.has(n)) {
      if (internalTokens.has(n)) { add(file, src, m.index, 'warning', 'W-TOKEN-TIER', `${n} is component-internal — do not set or read it`); continue; }
      if (hookTokens.has(n)) { add(file, src, m.index, 'warning', 'W-TOKEN-TIER', `${n} is an undocumented component CSS hook — use only with approval (IGDS-GAP)`); continue; }
      add(file, src, m.index, 'error', 'E-TOKEN', `${n} does not exist in @igds/tokens ${tok.sourcePackages['@igds/tokens']}`);
      continue;
    }
    const t = tokenInfo.get(n);
    if (t.themeNamespace) add(file, src, m.index, 'warning', 'W-TOKEN-TIER', `${n} is a theme-namespaced alias — use ${n.replace(/^--igds-(light|dark)-/, '--igds-')}`);
    else if (t.category === 'color-palette') add(file, src, m.index, 'warning', 'W-TOKEN-TIER', `${n} is a raw palette color — use a semantic --igds-base-color-* token (theme-aware)`);
  }
  // ---- raw colors in CSS ----
  if (isCss || ext === '.html') {
    const cssChunks = isCss ? [{ text: src, offset: 0 }] : [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>|style\s*=\s*"([^"]*)"/g)].map((m) => ({ text: m[1] ?? m[2], offset: m.index }));
    for (const ch of cssChunks) for (const m of ch.text.matchAll(/(?<![\w-])(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/g)) {
      const before = ch.text.slice(Math.max(0, m.index - 80), m.index);
      if (/--[\w-]+\s*:\s*$/.test(before)) continue; // defining a custom property — reported by token rules if relevant
      add(file, src, ch.offset + m.index, 'warning', 'W-RAW-COLOR', `hard-coded color ${m[0]} — use a --igds-base-color-* token`);
    }
  }
}

// ---------- report ----------
// collapse W-LEGACY to one finding per file (first line + count + classes) so real issues stay visible
const legacyByFile = new Map();
for (let i = findings.length - 1; i >= 0; i--) {
  const f = findings[i];
  if (f.code !== 'W-LEGACY') continue;
  const g = legacyByFile.get(f.file) ?? { ...f, count: 0, classes: new Set() };
  g.count++; g.line = Math.min(g.line, f.line); g.classes.add(f.message.match(/"([^"]+)"/)?.[1]);
  legacyByFile.set(f.file, g); findings.splice(i, 1);
}
for (const g of legacyByFile.values()) findings.push({ file: g.file, line: g.line, level: 'warning', code: 'W-LEGACY', message: `${g.count} uses of legacy prototype classes (${[...g.classes].slice(0, 6).join(', ')}${g.classes.size > 6 ? ', …' : ''}) — use official igds-* components` });
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
const shown = noWarn ? findings.filter((f) => f.level === 'error') : findings;
const errors = findings.filter((f) => f.level === 'error').length;
const warnings = findings.length - errors;
if (asJson) console.log(JSON.stringify({ files: files.length, errors, warnings, findings: shown }, null, 2));
else {
  for (const f of shown) console.log(`${f.level === 'error' ? '✖' : '⚠'} ${f.file}:${f.line}  ${f.code}  ${f.message}`);
  console.log(`\n[igds-lint] ${files.length} files · ${errors} errors · ${warnings} warnings (registry: @igds/core-web ${reg.sourcePackages['@igds/core-web']})`);
}
process.exitCode = errors ? 1 : 0;

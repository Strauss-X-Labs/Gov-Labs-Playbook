#!/usr/bin/env node
// Generator: Figma "Button" component set (81:1195) -> <igdsx-button> (Lit 3 web component). Deterministic, no LLM.
// Every visual value comes from spec/sets/81-1195.json. Value rule (plan v3 §2.2, Figma fidelity):
//   bound variable whose CSS token equals Figma          -> var(--igds-…)
//   bound variable whose CSS token differs from Figma    -> the Figma value (literal), never the code token
//   bound colour variable with no CSS token              -> var(--igdsx-…) defined from Figma modes (light/dark)
//   unbound / unresolvable variable                      -> the value Figma renders on the node (literal)
// Structure rules (documented, data-checked):
//   R-SHAPE  4 shapes exist: [icon,frame>text,icon] · focus-ring frame>[same] · [icon] · focus-ring frame>[icon].
//            DOM is uniform: .root(button) > .wrap > .i0 , .tf > .t , .i2 . Without a ring frame the Figma root maps
//            to .wrap and .root has no box of its own; with a ring frame the Figma root maps to .root and its child to .wrap.
//   R-PHYS   Figma auto layout is physical left-to-right in every variant, so .wrap uses direction:ltr; slot names follow
//            the Figma properties ("Left Icon", "Right Icon") and the label keeps the host's text direction.
//   R-STATE  Default/Hover/Pressed/Focused/Disabled -> base / :hover / :active (after hover) / :focus-visible / [disabled].
//   R-DUP-SYMMETRY  Figma has 3 RTL "Focused, Link Button, Intent=Default" names twice; the copy painted with
//            Danger colours equals the LTR "Intent=Danger" sibling, and RTL has no Danger one -> treated as Intent=Danger.
// Output: src/ext/igdsx-button/{igdsx-button.js,styles.js,contract.json}, src/tokens/igdsx-tokens.css (button part)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REG = path.resolve(KIT, '../igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const spec = rd(path.join(KIT, 'spec/sets/81-1195.json'));
const varsKnowledge = rd(path.join(REG, 'knowledge/figma/variables.json'));
const varIndex = new Map(); for (const col of varsKnowledge.collections) for (const [n, , vals] of col.v) varIndex.set(`${col.c}/${n}`, { modes: col.modes, vals });
const resolveMode = (name, mode, d = 0) => { const v = varIndex.get(name); if (!v || d > 10) return null; let i = v.modes.indexOf(mode); if (i < 0) i = 0; const x = v.vals[i]; return typeof x === 'string' && x.startsWith('→') ? resolveMode(x.slice(1), mode, d + 1) : x; };
const MODES = { light: 'מותג ממשלתי ראשי', dark: 'Dark IGDS' };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const decisions = [];

// ---------- variants, with R-DUP-SYMMETRY applied ----------
const variants = spec.variants.map((v) => ({ ...v, props: { ...v.props } }));
for (const v of variants) if (v.figmaDataIssue === 'duplicate-variant-name') {
  const usesDanger = JSON.stringify(v.tree).includes('Danger-');
  const ltrDanger = variants.some((x) => x.props.RTL === 'False' && x.props.Type === v.props.Type && x.props.State === v.props.State && x.props.Size === v.props.Size && x.props.Intent === 'Danger');
  const rtlDangerExists = variants.some((x) => x !== v && x.props.RTL === v.props.RTL && x.props.Type === v.props.Type && x.props.State === v.props.State && x.props.Size === v.props.Size && x.props.Intent === 'Danger' && !x.figmaDataIssue);
  if (usesDanger && ltrDanger && !rtlDangerExists) { v.props.Intent = 'Danger'; decisions.push({ rule: 'R-DUP-SYMMETRY', variantId: v.id, figmaName: v.name, treatedAs: 'Intent=Danger', status: 'resolved-from-data, review requested' }); }
}

// ---------- value mapping ----------
const tokenDefs = new Map(); // --igdsx-… -> {light, dark, figma}
function token(varName, literal, unit = 'px') {
  const r = spec.variables[varName];
  const lit = typeof literal === 'number' ? `${literal}${unit}` : literal;
  if (!varName || !r) return { css: lit, src: 'figma-node' };
  if (r.status === 'css-token') return { css: `var(${r.css})`, src: `token ${r.css}` };
  if (r.status === 'no-css-token' && typeof literal === 'string' && literal.startsWith('#')) {
    const name = '--igdsx-' + slug(varName.replace(/^Colors\//, 'color/'));
    const light = resolveMode(varName, MODES.light), dark = resolveMode(varName, MODES.dark);
    tokenDefs.set(name, { light, dark, figma: varName });
    return { css: `var(${name})`, src: `igdsx token ${name} (Figma ${varName})` };
  }
  return { css: lit, src: `figma-node (${varName}: ${r.status})` };
}
const colorOf = (paint) => { if (!paint) return null; const c = paint.c + (paint.a !== undefined ? Math.round(paint.a * 255).toString(16).padStart(2, '0') : ''); return token(paint.v, c); };
function boxDecls(n, opts = {}) {
  const d = {};
  const v = n.v || {};
  if (n.al) {
    const [pt, pr, pb, pl] = n.al.p;
    d.padding = [token(v.paddingTop, pt), token(v.paddingRight, pr), token(v.paddingBottom, pb), token(v.paddingLeft, pl)].map((x) => x.css).join(' ');
    d.gap = token(v.itemSpacing, n.al.g).css;
    d['justify-content'] = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', SPACE_BETWEEN: 'space-between' }[n.al.pa];
    d['align-items'] = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', BASELINE: 'baseline' }[n.al.ca];
    d.width = n.al.sh === 'FIXED' ? `${n.w}px` : n.al.sh === 'FILL' ? '100%' : 'auto';
    d.height = n.al.sv === 'FIXED' ? `${n.h}px` : n.al.sv === 'FILL' ? '100%' : 'auto';
  }
  if (n.r !== undefined) { const rs = Array.isArray(n.r) ? n.r : [n.r, n.r, n.r, n.r]; d['border-radius'] = [token(v.topLeftRadius, rs[0]), token(v.topRightRadius, rs[1]), token(v.bottomRightRadius, rs[2]), token(v.bottomLeftRadius, rs[3])].map((x) => x.css).join(' '); } else d['border-radius'] = '0';
  const fill = n.f && n.f[0]; d.background = fill ? colorOf(fill).css : 'transparent';
  if (n.s && n.s[0]) {
    const w = typeof n.sw === 'number' ? n.sw : n.sw[0];
    const ww = token(v.strokeTopWeight, w).css, col = colorOf(n.s[0]).css;
    d['box-shadow'] = n.sa === 'OUTSIDE' ? `0 0 0 ${ww} ${col}` : n.sa === 'CENTER' ? `inset 0 0 0 calc(${ww} / 2) ${col}, 0 0 0 calc(${ww} / 2) ${col}` : `inset 0 0 0 ${ww} ${col}`;
  } else d['box-shadow'] = 'none';
  d.opacity = n.op !== undefined ? String(n.op) : '1';
  return d;
}
function textDecls(t) {
  const v = t.v || {};
  const lh = Array.isArray(t.lh) ? (t.lh[1] === 'PERCENT' ? String(t.lh[0] / 100) : `${t.lh[0]}px`) : 'normal';
  const wt = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, Light: 300 }[t.font[1]];
  return { color: colorOf(t.f && t.f[0])?.css ?? 'inherit', 'font-family': `'${t.font[0]}'`, 'font-size': token(v.fontSize, t.fsz).css, 'font-weight': token(v.fontWeight, wt, '').css, 'line-height': lh, 'letter-spacing': Array.isArray(t.ls) ? (t.ls[1] === 'PERCENT' ? `${t.ls[0] / 100}em` : `${t.ls[0]}px`) : 'normal', 'text-decoration': t.td === 'UNDERLINE' ? 'underline' : t.td === 'STRIKETHROUGH' ? 'line-through' : 'none' };
}
// R-SHAPE: map Figma tree -> DOM parts
function parts(tree) {
  const ring = tree.c && tree.c.length === 1 && tree.c[0].t === 'FRAME';
  const wrap = ring ? tree.c[0] : tree;
  const kids = wrap.c || [];
  const icons = kids.filter((k) => k.t === 'INSTANCE');
  const tf = kids.find((k) => k.t === 'FRAME');
  return { ring, root: ring ? tree : null, wrap, i0: kids[0]?.t === 'INSTANCE' ? kids[0] : null, tf: tf || null, t: tf?.c?.find((x) => x.t === 'TEXT') || null, i2: kids.length === 3 && kids[2].t === 'INSTANCE' ? kids[2] : null, iconOnly: !tf && icons.length === 1 };
}

// ---------- CSS ----------
const STATE = { Default: '', Hover: ':hover:not(:disabled)', Pressed: ':hover:active:not(:disabled)', Focused: ':focus-visible', Disabled: '' };
const ORDER = ['Default', 'Hover', 'Focused', 'Pressed', 'Disabled'];
const hostSel = (p) => [p.RTL === 'True' ? ':dir(rtl)' : ':dir(ltr)', `[variant="${slug(p.Type)}"]`, `[size="${slug(p.Size)}"]`, p.Intent === 'Danger' ? '[intent="danger"]' : ':not([intent="danger"])', p['Icon Button'] === 'True' ? '[icon-only]' : ':not([icon-only])', p.State === 'Disabled' ? '[disabled]' : ''].join('');
const decl = (o) => Object.entries(o).filter(([, x]) => x !== undefined && x !== null).map(([k, x]) => `${k}:${x}`).join(';');
const rules = [];
const matrix = [];
const multiColourIcons = [];
for (const v of [...variants].sort((a, b) => ORDER.indexOf(a.props.State) - ORDER.indexOf(b.props.State))) {
  const p = v.props, P = parts(v.tree), h = `:host(${hostSel(p)})`, s = STATE[p.State];
  const reset = { padding: '0', gap: '0', 'border-radius': '0', background: 'transparent', 'box-shadow': 'none', opacity: '1', width: 'auto', height: 'auto' };
  rules.push(`${h} .root${s}{${decl(P.ring ? boxDecls(P.root) : { ...reset, width: P.wrap.al?.sh === 'FIXED' ? `${P.wrap.w}px` : 'auto', height: P.wrap.al?.sv === 'FIXED' ? `${P.wrap.h}px` : 'auto' })}}`);
  rules.push(`${h} .root${s} .wrap{${decl(boxDecls(P.wrap))}}`);
  if (P.tf) rules.push(`${h} .root${s} .tf{${decl({ ...boxDecls(P.tf), display: 'inline-flex' })}}`);
  if (P.t) rules.push(`${h} .root${s} .t{${decl(textDecls(P.t))}}`);
  // icon colour = the single solid fill of the vectors inside the Figma icon instance (REST "ifill"); official icons draw
  // with fill:currentColor, so `color` on the slot box colours a slotted igds-icon. Multi-colour icons keep their own.
  for (const k of ['i0', 'i2']) if (P[k]) { const f = P[k].ifill; const one = f && f.length === 1 && f[0].t === 'SOLID' ? colorOf(f[0]).css : null; if (f && !one) multiColourIcons.push(`${v.id}.${k}`); rules.push(`${h} .root${s} .${k}{width:${P[k].w}px;height:${P[k].h}px${one ? `;color:${one}` : ''}}`); }
  matrix.push({ id: v.id, figmaName: v.name, props: p, shape: P.ring ? (P.iconOnly ? 'ring>icon' : 'ring>icon,text,icon') : P.iconOnly ? 'icon' : 'icon,text,icon' });
}
const tokensCss = `/* igdsx tokens generated from Figma variables (no CSS token exists in @igds/tokens). Source: ${[...tokenDefs.values()].map((t) => t.figma).join(', ')} */\n:root{${[...tokenDefs].map(([n, t]) => `${n}:${t.light}`).join(';')}}\n:root[data-theme="dark"],.igds-dark-theme{${[...tokenDefs].map(([n, t]) => `${n}:${t.dark}`).join(';')}}\n`;
const baseCss = `:host{display:inline-flex;vertical-align:middle}:host([hidden]){display:none}
.root{all:unset;box-sizing:border-box;display:inline-flex;align-items:stretch;cursor:pointer;-webkit-tap-highlight-color:transparent;font-family:'Rubik',sans-serif}
.root:focus{outline:none}:host([disabled]) .root{cursor:not-allowed}
.wrap{box-sizing:border-box;display:flex;flex-direction:row;direction:ltr;flex:1 1 auto;min-width:0}
.tf{box-sizing:border-box;align-items:center;justify-content:center}.t{white-space:nowrap}
:host(:dir(rtl)) .t{direction:rtl}:host(:dir(ltr)) .t{direction:ltr}
.i0,.i2{display:inline-flex;align-items:center;justify-content:center;flex:none;color:inherit}
.i0[hidden],.i2[hidden],.tf[hidden]{display:none}
::slotted(*){max-width:100%;max-height:100%}`;
// Group selectors that share an identical declaration block. Order is preserved by the first occurrence of each block
// within the same state tier (rules were emitted tier by tier), so cascade order between tiers is unchanged.
const tierOf = (r) => ORDER.findIndex((st) => STATE[st] && r.includes(`.root${STATE[st]}`)) + 1 || (r.includes('[disabled]') ? 5 : 0);
const grouped = new Map();
for (const r of rules) { const i = r.indexOf('{'); const sel = r.slice(0, i), body = r.slice(i); const key = tierOf(r) + body; if (!grouped.has(key)) grouped.set(key, { tier: tierOf(r), body, sels: [] }); grouped.get(key).sels.push(sel); }
const css = baseCss + '\n' + [...grouped.values()].sort((a, b) => a.tier - b.tier).map((g) => g.sels.join(',') + g.body).join('\n');

// ---------- component ----------
const values = (k) => spec.set.defs[k].o;
const defaults = Object.fromEntries(Object.entries(spec.set.defs).filter(([, d]) => d.t === 'VARIANT').map(([k, d]) => [k, d.d]));
const contract = {
  tag: 'igdsx-button', figma: { file: spec.figmaFile, setId: spec.set.id, setKey: spec.set.key, name: spec.set.name }, generator: 'pipeline/generate/gen-button.mjs',
  attributes: {
    variant: { values: values('Type').map(slug), default: slug(defaults.Type), figmaProp: 'Type' },
    size: { values: values('Size').map(slug), default: slug(defaults.Size), figmaProp: 'Size' },
    intent: { values: values('Intent').map(slug), default: slug(defaults.Intent), figmaProp: 'Intent' },
    'icon-only': { type: 'boolean', figmaProp: 'Icon Button' },
    disabled: { type: 'boolean', figmaProp: 'State=Disabled' },
    type: { values: ['button', 'submit', 'reset'], default: 'button', source: 'HTML button (required-for-working-component)' },
    label: { type: 'string', source: 'accessible name for icon-only (required-for-working-component)' },
  },
  slots: { '(default)': 'label text (Figma "Text")', 'left-icon': 'Figma " Left Icon" / "Left Icon op."', 'right-icon': 'Figma "Right Icon" / "Right Icon op."', icon: 'icon-only content (Figma "Icon Op")' },
  states: { hover: ':hover', pressed: ':active', focused: ':focus-visible', disabled: '[disabled]' },
  events: { click: 'native click (from the internal <button>)' },
  validCombinations: [...new Set(matrix.map((m) => JSON.stringify({ variant: slug(m.props.Type), size: slug(m.props.Size), intent: slug(m.props.Intent), iconOnly: m.props['Icon Button'] === 'True', dir: m.props.RTL === 'True' ? 'rtl' : 'ltr' })))].map((s) => JSON.parse(s)),
  matrix, decisions, igdsxTokens: Object.fromEntries([...tokenDefs].map(([n, t]) => [n, t])),
};
const dir = path.join(KIT, 'src/ext/igdsx-button'); fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'styles.js'), `// GENERATED by pipeline/generate/gen-button.mjs from spec/sets/81-1195.json — do not edit.\nimport { css, unsafeCSS } from 'lit';\nexport const styles = css\`\${unsafeCSS(${JSON.stringify(css)})}\`;\n`);
fs.writeFileSync(path.join(dir, 'contract.json'), JSON.stringify(contract, null, 1) + '\n');
fs.writeFileSync(path.join(dir, 'igdsx-button.js'), `// GENERATED by pipeline/generate/gen-button.mjs — do not edit. Figma: ${spec.set.name} (${spec.set.id}), ${variants.length} variants.
// Behaviour not described in Figma (marked required-for-working-component): native <button> semantics, form submit/reset
// via ElementInternals, disabled = not focusable, icon-only accessible name from "label".
import { LitElement, html } from 'lit';
import { styles } from './styles.js';
const VALID = ${JSON.stringify(contract.validCombinations)};
export class IgdsxButton extends LitElement {
  static formAssociated = true;
  static styles = styles;
  static properties = {
    variant: { reflect: true }, size: { reflect: true }, intent: { reflect: true },
    iconOnly: { type: Boolean, reflect: true, attribute: 'icon-only' }, disabled: { type: Boolean, reflect: true },
    type: { reflect: true }, label: {}, _has: { state: true },
  };
  constructor() { super(); this.variant = ${JSON.stringify(contract.attributes.variant.default)}; this.size = ${JSON.stringify(contract.attributes.size.default)}; this.intent = ${JSON.stringify(contract.attributes.intent.default)}; this.iconOnly = false; this.disabled = false; this.type = 'button'; this._has = {}; try { this._internals = this.attachInternals(); } catch { this._internals = null; } }
  updated(ch) {
    if (ch.has('variant') || ch.has('size') || ch.has('intent') || ch.has('iconOnly')) {
      const dir = getComputedStyle(this).direction === 'rtl' ? 'rtl' : 'ltr';
      if (!VALID.some((c) => c.variant === this.variant && c.size === this.size && c.intent === this.intent && c.iconOnly === this.iconOnly && c.dir === dir)) console.warn('[igdsx-button] combination not in Figma:', { variant: this.variant, size: this.size, intent: this.intent, iconOnly: this.iconOnly, dir });
    }
  }
  _slot(e) { const n = e.target.name || '(default)'; const has = e.target.assignedNodes({ flatten: true }).some((x) => x.nodeType === 1 || (x.nodeType === 3 && x.textContent.trim())); if (this._has[n] !== has) this._has = { ...this._has, [n]: has }; }
  _click(e) { if (this.disabled) { e.preventDefault(); e.stopImmediatePropagation(); return; } const f = this._internals && this._internals.form; if (f && this.type === 'submit') f.requestSubmit(); else if (f && this.type === 'reset') f.reset(); }
  focus(o) { this.renderRoot?.querySelector('.root')?.focus(o); }
  render() {
    const io = this.iconOnly;
    return html\`<button class="root" part="root" type="button" ?disabled=\${this.disabled} aria-label=\${io && this.label ? this.label : undefined} @click=\${this._click}><span class="wrap" part="wrap">\${io
      ? html\`<span class="i0"><slot name="icon" @slotchange=\${this._slot}></slot></span>\`
      : html\`<span class="i0" ?hidden=\${!this._has['left-icon']}><slot name="left-icon" @slotchange=\${this._slot}></slot></span><span class="tf"><span class="t"><slot @slotchange=\${this._slot}></slot></span></span><span class="i2" ?hidden=\${!this._has['right-icon']}><slot name="right-icon" @slotchange=\${this._slot}></slot></span>\`}</span></button>\`;
  }
}
if (!customElements.get('igdsx-button')) customElements.define('igdsx-button', IgdsxButton);
`);
const tdir = path.join(KIT, 'src/tokens'); fs.mkdirSync(tdir, { recursive: true });
fs.writeFileSync(path.join(tdir, 'igdsx-button-tokens.css'), tokensCss);
console.log(`igdsx-button: ${variants.length} variants -> ${rules.length} rules, ${css.length} bytes CSS, ${tokenDefs.size} igdsx tokens, ${contract.validCombinations.length} valid combinations, decisions: ${decisions.length}`);

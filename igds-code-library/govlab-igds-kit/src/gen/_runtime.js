// GENERATED-LIBRARY RUNTIME (govlab-igds-kit) — one class renders every generated IGDS component from Figma data.
// Data per component (pipeline/generate/gen-all.mjs): props model + every Figma variant as a node tree whose styles were
// computed from the Figma spec (layout, sizing, colours via tokens, typography, strokes, effects). Nothing here invents
// design values: it only selects the Figma variant that matches the attributes / interaction state and builds its DOM.
//
// Public contract of a generated element (documented per component in catalog.json):
//  - each Figma VARIANT property  -> attribute (kebab name), value = slug of the Figma option ("Link Button" -> link-button)
//  - RTL property                 -> from the document/host direction (dir="rtl" / dir="ltr"); not an attribute
//  - State-like property          -> real interaction (hover, press, keyboard focus, [disabled]) or forced: state="<slug>"
//  - TEXT property                -> attribute (plain text) or slot of the same name (rich content); Figma text is the fallback
//  - BOOLEAN property             -> attribute with "true" / "false" (default = Figma default)
//  - INSTANCE_SWAP property       -> slot of the same name; the Figma default instance is the fallback
// A combination that does not exist in Figma is reported with console.warn and the nearest Figma variant is shown
// (state first relaxed to its default) — never a made-up mix.
const REG = new Map(); // figma set id -> tag (for nested instances)
export const registerFigmaTag = (setId, tag) => REG.set(setId, tag);
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

export class FigmaElement extends HTMLElement {
  static get observedAttributes() { return [...this.data.props.map((p) => p.attr), 'state', 'disabled', 'dir', 'data-tx']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._ui = { hover: false, pressed: false, focus: false };
    const D = this.constructor.data;
    if (D.interactive) {
      const set = (k, v) => () => { if (this._ui[k] !== v) { this._ui[k] = v; this._render(); } };
      this.addEventListener('pointerenter', set('hover', true)); this.addEventListener('pointerleave', () => { this._ui.hover = false; this._ui.pressed = false; this._render(); });
      this.addEventListener('pointerdown', set('pressed', true)); this.addEventListener('pointerup', set('pressed', false));
      this.addEventListener('focus', () => { this._ui.focus = this.matches(':focus-visible'); this._render(); }); this.addEventListener('blur', set('focus', false));
    }
  }
  connectedCallback() { const D = this.constructor.data; if (D.interactive && D.interactive.focus && !this.hasAttribute('tabindex') && !this.hasAttribute('disabled')) this.tabIndex = 0; this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }
  get figmaVariant() { return this._variant; }

  _wanted() {
    const D = this.constructor.data, want = {};
    for (const p of D.props) if (p.kind === 'variant') {
      const a = this.getAttribute(p.attr); const i = a == null ? -1 : p.slugs.indexOf(a);
      if (a != null && i < 0) console.warn(`<${this.localName}> ${p.attr}="${a}" is not a Figma option (${p.slugs.join(' | ')})`);
      want[p.name] = i >= 0 ? p.options[i] : p.default;
    }
    if (D.rtl) want[D.rtl.prop] = this.matches(':dir(rtl)') ? D.rtl.on : D.rtl.off;
    if (D.state) {
      const S = D.state, a = this.getAttribute('state'), i = a == null ? -1 : S.slugs.indexOf(a);
      let v = S.default;
      if (i >= 0) v = S.options[i];
      else if (this.hasAttribute('disabled') && S.disabled) v = S.disabled;
      else if (this._ui.focus && S.focus) v = S.focus;
      else if (this._ui.pressed && S.pressed) v = S.pressed;
      else if (this._ui.hover && S.hover) v = S.hover;
      want[S.prop] = v;
    }
    return want;
  }
  _pick(want) {
    const D = this.constructor.data, key = (o) => D.order.map((n) => o[n]).join('\u0001');
    const exact = D.index.get(key(want)); if (exact !== undefined) return exact;
    if (D.state) { const w = { ...want, [D.state.prop]: D.state.default }; const k = D.index.get(key(w)); if (k !== undefined) return k; }
    // nearest: most matching properties, ties -> Figma order
    let best = 0, score = -1;
    D.variants.forEach((v, i) => { const s = D.order.reduce((n, p, j) => n + (v.p[j] === want[p] ? 1 : 0), 0); if (s > score) { score = s; best = i; } });
    if (!this._warned) { this._warned = true; console.warn(`<${this.localName}> no Figma variant for ${JSON.stringify(want)}; showing "${D.variants[best].name}"`); }
    return best;
  }
  _render() {
    const D = this.constructor.data;
    const vi = this._pick(this._wanted()); const v = D.variants[vi];
    this._variant = v.name;
    if (this._shown === vi && this._sig === this._attrSig()) return;
    this._shown = vi; this._sig = this._attrSig();
    const root = this.shadowRoot;
    root.textContent = '';
    const st = document.createElement('style'); st.textContent = D.base; root.appendChild(st);
    // text overrides from an enclosing Figma instance: {"<nodeIndex>": text, "<instIndex>/<nested path>": text}
    try { this._tx = JSON.parse(this.getAttribute('data-tx') || '{}'); } catch (e) { this._tx = {}; }
    this._ov = [];
    root.appendChild(this._build(v.t, D));
    if (this._ov.length) { const s2 = document.createElement('style'); s2.textContent = this._ov.join(''); root.appendChild(s2); }
    this._fitText();
    if (!this._fontsHooked && typeof document !== 'undefined' && document.fonts) { this._fontsHooked = true; document.fonts.ready.then(() => this._fitText()); }
  }
  // Figma sizes a hugging ("auto width") text box to a whole pixel, rounding UP. Reproduce it so every dependent
  // geometry (hugging parents, end/centre-aligned siblings) matches Figma exactly.
  _fitText() {
    if (!this.isConnected) return;
    const spans = this.shadowRoot.querySelectorAll('[data-hug]');
    for (const s of spans) s.style.width = '';
    const ws = [...spans].map((s) => s.getBoundingClientRect().width);
    // browser text widths are in 1/64 px units and carry accumulated per-glyph rounding (observed +2/64 against Figma):
    // up to 4/64 px above an integer is measurement noise, not a wider text
    spans.forEach((s, i) => { if (ws[i] > 0) s.style.width = Math.ceil(ws[i] - 0.0625) + 'px'; });
  }
  _attrSig() { return [...this.attributes].map((a) => a.name + '=' + a.value).join('|'); }
  _propVal(name) { const D = this.constructor.data; const p = D.byName[name]; if (!p) return undefined; const a = this.getAttribute(p.attr); return a == null ? undefined : a; }
  _build(n, D) {
    // n = [kind, styleIndex, extras, children]
    const [kind, si, x, kids] = n;
    let el;
    if (kind === 't') {
      el = document.createElement('span');
      const tp = x.tp && D.byName[x.tp];
      const attr = tp ? this.getAttribute(tp.attr) : null;
      const ovr = this._tx && this._tx[String(x.i)];
      const txt = ovr != null ? ovr : x.tx;
      if (tp) { const s = document.createElement('slot'); s.name = tp.attr; s.textContent = attr != null ? attr : txt; s.addEventListener('slotchange', () => this._fitText()); el.appendChild(s); } else el.textContent = txt;
      if (x.hug) el.dataset.hug = '1';
    } else if (kind === 'icon') {
      // Figma icon component exported as SVG (exact DS geometry); colour via currentColor when single-colour
      el = document.createElement('span'); el.setAttribute('aria-hidden', 'true'); if (x.fs !== undefined) el.innerHTML = D.svgs[x.fs];
    } else if (kind === 'svg') {
      el = document.createElement('span'); el.innerHTML = D.svgs[x.svg] || '';
    } else if (kind === 'inst') {
      const tag = REG.get(x.set);
      el = document.createElement(tag && customElements.get(tag) ? tag : (tag || 'span'));
      const fwd = {}; const pre = x.i + '/';
      for (const [k, t] of Object.entries(this._tx || {})) if (k.startsWith(pre)) fwd[k.slice(pre.length)] = t;
      const attrs = { ...(x.attrs || {}) };
      if (Object.keys(fwd).length) attrs['data-tx'] = JSON.stringify({ ...JSON.parse(attrs['data-tx'] || '{}'), ...fwd });
      for (const [a, val] of Object.entries(attrs)) el.setAttribute(a, val);
      if (!tag) el.dataset.figmaMissing = x.set;
      if (x.ov) this._ov.push(`[data-i="${x.i}"]::part(${x.ovp || "n0"}){${x.ov}}`);
      if (x.ov2) this._ov.push(`[data-i="${x.i}"]::part(root){${x.ov2}}`); // instance overrides of the nested root
      // icons the Figma instance shows through INSTANCE_SWAP properties -> slotted Figma SVG (single-colour: currentColor)
      for (const k of x.kids || []) { const s = document.createElement('span'); s.slot = k.slot; s.setAttribute('aria-hidden', 'true'); s.style.cssText = 'display:block;width:100%;height:100%'; s.innerHTML = D.svgs[k.svg]; el.appendChild(s); }
    } else el = document.createElement('div');
    el.setAttribute('part', 'n' + x.i); el.dataset.i = x.i;
    el.style.cssText = D.styles[si];
    // BOOLEAN-bound visibility
    if (x.vp) { const p = D.byName[x.vp]; const a = p ? this.getAttribute(p.attr) : null; const on = a == null ? x.vd : a !== 'false'; if (!on) el.style.display = 'none'; }
    // INSTANCE_SWAP-bound instance -> named slot with the Figma default as fallback
    if (x.sp) { const p = D.byName[x.sp]; if (p) { const s = document.createElement('slot'); s.name = p.attr; s.style.display = 'contents'; s.appendChild(el); for (const k of kids || []) el.appendChild(this._build(k, D)); return s; } }
    for (const k of kids || []) el.appendChild(this._build(k, D));
    return el;
  }
}

// Compact data -> runtime structure (done once per component class)
export function defineFigmaComponent(tag, setId, data) {
  registerFigmaTag(setId, tag);
  if (customElements.get(tag)) return;
  data.byName = Object.fromEntries(data.props.map((p) => [p.name, p]));
  data.order = data.order || [];
  data.index = new Map(data.variants.map((v, i) => [v.p.join('\u0001'), i]));
  const C = class extends FigmaElement {}; C.data = data;
  customElements.define(tag, C);
}
export { camel };

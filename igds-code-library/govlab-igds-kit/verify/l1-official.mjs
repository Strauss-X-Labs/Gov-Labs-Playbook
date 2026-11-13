#!/usr/bin/env node
// Level-1 verification (plan v3 §5) of an OFFICIAL component against its normalized Figma spec.
// Renders the official tag in the installed Edge (playwright-core, channel msedge), one variant × theme at a time,
// forces interaction states through CDP (CSS.forcePseudoState), and compares the RENDERED result with Figma:
// height, corner radius, background, stroke, text colour, font family/size/weight. Width/insets need icon content
// and the full tree; on summary-only specs they are reported as "not-checked", never as pass.
//
// Measurement reads the component's OPEN shadow root (read-only). Nothing in @igds/* is modified.
// Figma -> code contract is derived automatically, by documented rules only:
//   R-DIR      RTL=True/False                      -> dir="rtl"/"ltr"
//   R-STATE    State Default/Hover/Pressed/Focused -> none / :hover / :hover+:active / :focus-visible (forced); Disabled -> mapping says which prop
//   R-NAMEEQ   variant value == code enum value (case/space-insensitive, from figma-mapping comparison)
//   R-DEFNOOP  a Figma prop with no code counterpart, at its Figma default value, adds nothing
//   anything else -> "decision-required" (unmapped value) or "gap" (Figma variant with no code) — never guessed.
// Expected dark values: the bound Figma variable resolved in mode "Dark IGDS" (aliases followed). No variable -> dark not checkable.
//
// Usage: node verify/l1-official.mjs <setId> [--mutate]    (--mutate = sensitivity test: injects known deviations; must FAIL)
// Output: verify/ledger.json (rows for this set replaced), verify/out/<setId>.l1.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { launchBrowser } from './lib/browser.mjs'; // Windows: Edge (default) · Linux/CI: bundled Chromium

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(KIT, '..');
const REG = path.join(PROJ, 'igds-registry');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const setId = process.argv[2];
const MUTATE = process.argv.includes('--mutate');
if (!setId) { console.error('usage: l1-official.mjs <setId> [--mutate]'); process.exit(2); }

const spec = rd(path.join(KIT, 'spec/sets', setId.replace(/:/g, '-') + '.json'));
const mapping = rd(path.join(REG, 'figma/figma-mapping.generated.json')).componentSets.find((c) => c.figma.id === setId);
if (!mapping?.match?.tag) { console.error('no official tag mapped for', setId); process.exit(2); }
const TAG = mapping.match.tag;
const TOL = { px: 0.5 };

// ---------- Figma variable resolution per mode (aliases followed) ----------
const vars = rd(path.join(REG, 'knowledge/figma/variables.json'));
const varIndex = new Map();
for (const col of vars.collections) for (const [name, , values] of col.v) varIndex.set(`${col.c}/${name}`, { modes: col.modes, values });
function resolveVar(name, mode, depth = 0) {
  const v = varIndex.get(name); if (!v || depth > 10) return null;
  let i = v.modes.indexOf(mode); if (i < 0) i = 0; // single-mode collections (Brand, Space…) have one value for all modes
  const val = v.values[i];
  if (typeof val === 'string' && val.startsWith('→')) return resolveVar(val.slice(1), mode, depth + 1);
  return val;
}
const THEMES = [{ id: 'light', mode: 'מותג ממשלתי ראשי', html: '' }, { id: 'dark', mode: 'Dark IGDS', html: 'data-theme="dark"' }];

// ---------- contract (automatic, rule-based) ----------
const cmp = new Map((mapping.comparison?.variantProps || []).map((p) => [p.figmaProp, p]));
const norm = (s) => String(s).toLowerCase().replace(/[\s_-]+/g, '');
const defs = spec.set.defs || {};
function contractFor(props) {
  const attrs = {}; let dir = 'rtl'; let force = []; const rules = []; const unresolved = []; const gaps = [];
  for (const [k, v] of Object.entries(props)) {
    const c = cmp.get(k);
    if (k === 'RTL') { dir = v === 'True' ? 'rtl' : 'ltr'; rules.push('R-DIR'); continue; }
    if (c?.kind === 'state') {
      const st = c.values.find((x) => x.value === v);
      if (st?.status === 'maps-to-prop') { attrs[st.prop] = ''; rules.push('R-STATE'); continue; }
      // a pointer press always happens while hovering, so Pressed = :hover + :active (as in a real browser)
      const f = { Default: [], Hover: ['hover'], Pressed: ['hover', 'active'], Focused: ['focus-visible'] }[v];
      if (f === undefined) { unresolved.push(`${k}=${v}`); continue; }
      force.push(...f); rules.push('R-STATE'); continue;
    }
    if (c?.codeProp) {
      const code = (c.codeValues || []).find((cv) => norm(cv) === norm(v));
      if (code) { attrs[c.codeProp] = code; rules.push('R-NAMEEQ'); } else unresolved.push(`${k}=${v} (code values: ${c.codeValues.join('|')})`);
      continue;
    }
    // no code counterpart
    const d = defs[k]?.d;
    if (d !== undefined && String(d) === String(v)) { rules.push('R-DEFNOOP'); continue; }
    if (['False', 'Default', 'Off', 'No'].includes(v) && (!d || d === v)) { rules.push('R-DEFNOOP'); continue; }
    gaps.push(`${k}=${v}`);
  }
  return { attrs, dir, force, rules: [...new Set(rules)], unresolved, gaps };
}

// ---------- expected values from the spec ----------
const WEIGHT = { Thin: 100, ExtraLight: 200, Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 };
function expected(v, theme) {
  // summary from a full tree: root box + first TEXT node (same fields as the summary extractor)
  const findText = (n) => (n.t === "TEXT" ? n : (n.c || []).map(findText).find(Boolean));
  const tt = v.tree && findText(v.tree);
  const s = v.summary || (v.tree && { radius: v.tree.r ?? 0, fill: v.tree.f?.[0] && { hex: v.tree.f[0].c, alpha: v.tree.f[0].a, var: v.tree.f[0].v }, stroke: v.tree.s?.[0] && { hex: v.tree.s[0].c, alpha: v.tree.s[0].a, var: v.tree.s[0].v, weight: typeof v.tree.sw === "number" ? v.tree.sw : v.tree.sw?.[0], align: v.tree.sa }, text: tt && { hex: tt.f?.[0]?.c, var: tt.f?.[0]?.v, fontStyle: tt.font[1], fontSize: tt.fsz, characters: tt.tx } });
  if (!s) return null; // tree specs: handled by the generic tree comparer (next step)
  const col = (p) => {
    if (!p) return { value: null, how: 'none' };
    if (theme.id === 'light') return { value: p.hex + (p.alpha != null && p.alpha < 1 ? `@${p.alpha}` : ''), how: 'figma-node', var: p.var };
    if (!p.var) return { value: undefined, how: 'no-variable: dark value unknown' };
    const r = resolveVar(p.var, theme.mode);
    return r ? { value: String(r).toLowerCase() + (p.alpha != null && p.alpha < 1 ? `@${p.alpha}` : ''), how: 'variable-mode', var: p.var } : { value: undefined, how: 'variable not resolvable' };
  };
  return {
    height: v.h, radius: Array.isArray(s.radius) ? s.radius : [s.radius, s.radius, s.radius, s.radius],
    background: col(s.fill), stroke: s.stroke ? { ...col(s.stroke), weight: s.stroke.weight, align: s.stroke.align } : null,
    textColor: col(s.text), fontFamily: 'Rubik', fontSize: s.text?.fontSize, fontWeight: WEIGHT[s.text?.fontStyle], text: s.text?.characters,
    notChecked: ['width (icon content not in summary spec)', 'insets (summary spec has no text-frame geometry)'],
  };
}

// ---------- browser ----------
const html = (theme) => `<!doctype html><html dir="rtl" lang="he" ${theme.html}><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/tokens/lib/local.css'))}">
${MUTATE ? '<style>:root,:root[data-theme="dark"]{--igds-ref-border-radius-m:9px;--igds-base-color-button-background-primary:#0068f6;--igds-base-color-button-text-primary:#f5f9fe}</style>' : ''}
<script src="${pathToFileURL(path.join(PROJ, 'node_modules/@igds/core-web/lib/index.min.js'))}" defer></script>
<style>body{margin:0;padding:24px;background:transparent}</style></head><body><div id="stage"></div></body></html>`;

const outDir = path.join(KIT, 'verify/out'); fs.mkdirSync(outDir, { recursive: true });
const browser = await launchBrowser();
const results = [];
for (const theme of THEMES) {
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 800, height: 400 } });
  const hp = path.join(outDir, `_page-${theme.id}.html`); fs.writeFileSync(hp, html(theme));
  await page.goto(pathToFileURL(hp).href);
  await page.waitForFunction((t) => !!customElements.get(t), TAG);
  await page.evaluate(() => document.fonts.ready);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  for (const v of spec.variants) {
    const key = { setId, set: spec.set.name, tag: TAG, variant: v.name + (v.duplicateIndex ? ` #${v.duplicateIndex}` : ''), theme: theme.id };
    const c = contractFor(v.props);
    const exp = expected(v, theme);
    if (v.figmaDataIssue) { results.push({ ...key, status: 'decision-required', reason: `figma-data-issue: ${v.figmaDataIssue}`, contract: c }); continue; }
    if (c.gaps.length) { results.push({ ...key, status: 'gap', reason: `Figma variant has no code counterpart: ${c.gaps.join(', ')}`, contract: c }); continue; }
    if (c.unresolved.length) { results.push({ ...key, status: 'decision-required', reason: `unmapped Figma value: ${c.unresolved.join('; ')}`, contract: c }); continue; }
    if (!exp) { results.push({ ...key, status: 'pending', reason: 'tree spec: needs tree comparer', contract: c }); continue; }
    // R-SUMMARY-SCOPE: a summary row describes the variant ROOT. In Figma, focused variants wrap the control in a focus-ring
    // frame (root height ≠ control height), so the root is not the control. Such rows need the full tree; never judged from summary.
    if (v.props.State === 'Focused' && (v.detail === 'summary' || (v.tree?.c?.length === 1 && v.tree.c[0].t === 'FRAME'))) { results.push({ ...key, status: 'pending', reason: 'summary spec insufficient: Figma focused variant root is a focus-ring wrapper; needs full-tree extraction', contract: c }); continue; }
    const handle = await page.evaluateHandle(({ tag, attrs, dir, text }) => {
      const st = document.getElementById('stage'); st.innerHTML = ''; st.setAttribute('dir', dir);
      const el = document.createElement(tag); for (const [a, val] of Object.entries(attrs)) el.setAttribute(a, val); el.textContent = text || '';
      st.appendChild(el); return el;
    }, { tag: TAG, attrs: c.attrs, dir: c.dir, text: exp.text });
    await page.evaluate((el) => el.updateComplete, handle);
    // forced states on host + its first shadow element (the rendered control)
    const forced = [];
    if (c.force.length) {
      await cdp.send('DOM.getDocument', { depth: -1, pierce: true }); // make shadow nodes known to the CDP DOM agent
      const hostObj = (await cdp.send('Runtime.evaluate', { expression: `document.querySelector('#stage > *')` })).result.objectId;
      const innerObj = (await cdp.send('Runtime.evaluate', { expression: `document.querySelector('#stage > *').shadowRoot.firstElementChild` })).result.objectId;
      for (const o of [hostObj, innerObj]) { const { nodeId } = await cdp.send('DOM.requestNode', { objectId: o }); await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: c.force }); forced.push(nodeId); }
      if (c.force.includes('focus-visible')) await page.evaluate((el) => el.shadowRoot.firstElementChild.focus?.(), handle);
    }
    // settle: finish every running CSS transition/animation (host + shadow), so the end state is measured, not a frame mid-transition
    await page.evaluate(async (el) => { for (let i = 0; i < 3; i++) { const anims = [...document.getAnimations(), ...el.shadowRoot.getAnimations({ subtree: true })]; anims.forEach((a) => { try { a.finish(); } catch {} }); await new Promise((r) => requestAnimationFrame(() => r())); } }, handle);
    const m = await page.evaluate((el) => {
      const t = el.shadowRoot.firstElementChild; const cs = getComputedStyle(t); const bb = t.getBoundingClientRect();
      return { tagName: t.tagName.toLowerCase(), h: bb.height, w: bb.width, radius: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(parseFloat),
        bg: cs.backgroundColor, color: cs.color, fontFamily: cs.fontFamily, fontSize: parseFloat(cs.fontSize), fontWeight: Number(cs.fontWeight),
        border: { w: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(parseFloat), style: cs.borderTopStyle, color: cs.borderTopColor },
        outline: { w: parseFloat(cs.outlineWidth), style: cs.outlineStyle, color: cs.outlineColor, offset: parseFloat(cs.outlineOffset) }, boxShadow: cs.boxShadow };
    }, handle);
    for (const nodeId of forced) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    // compare
    const toHex = (rgb) => { const mm = /rgba?\(([^)]+)\)/.exec(rgb); if (!mm) return rgb; const [r, g, b, a = 1] = mm[1].split(/[ ,/]+/).filter(Boolean).map(Number); const hx = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join(''); return a === 0 ? 'transparent' : a < 1 ? `${hx}@${Math.round(a * 100) / 100}` : hx; };
    const checks = [];
    const chk = (prop, exp_, act, ok, note) => checks.push({ prop, expected: exp_, actual: act, ok, ...(note ? { note } : {}) });
    chk('height', exp.height, m.h, Math.abs(m.h - exp.height) <= TOL.px);
    chk('radius', exp.radius, m.radius, exp.radius.every((r, i) => Math.abs(r - m.radius[i]) <= TOL.px));
    const colorCheck = (prop, e, actualRgb) => {
      if (e.value === undefined) return checks.push({ prop, expected: null, actual: toHex(actualRgb), ok: null, note: e.how });
      const act = toHex(actualRgb); const want = e.value ?? 'transparent';
      chk(prop, want, act, act === want, e.var ? `figma var ${e.var}` : undefined);
    };
    colorCheck('background', exp.background, m.bg);
    colorCheck('text-color', exp.textColor, m.color);
    if (exp.stroke) {
      const reps = [];
      if (m.border.style !== 'none' && m.border.w[0] > 0) reps.push({ via: 'border', w: m.border.w[0], color: toHex(m.border.color) });
      if (m.outline.style !== 'none' && m.outline.w > 0) reps.push({ via: 'outline', w: m.outline.w, color: toHex(m.outline.color), offset: m.outline.offset });
      if (m.boxShadow && m.boxShadow !== 'none') reps.push({ via: 'box-shadow', value: m.boxShadow });
      const want = exp.stroke.value;
      const hit = reps.find((r) => (r.w === undefined || Math.abs(r.w - exp.stroke.weight) <= TOL.px) && (want === undefined || r.color === want || (r.value && r.value.includes(want))));
      checks.push({ prop: 'stroke', expected: { color: want ?? null, weight: exp.stroke.weight, align: exp.stroke.align }, actual: reps, ok: want === undefined && !reps.length ? false : !!hit, ...(want === undefined ? { note: exp.stroke.how } : {}) });
    } else {
      const has = (m.border.style !== 'none' && m.border.w[0] > 0) || (m.outline.style !== 'none' && m.outline.w > 0);
      chk('stroke', 'none', has ? { border: m.border, outline: m.outline } : 'none', !has);
    }
    chk('font-family', 'Rubik', m.fontFamily.split(',')[0].replace(/["']/g, '').trim(), /^["']?Rubik/.test(m.fontFamily));
    chk('font-size', exp.fontSize, m.fontSize, Math.abs(m.fontSize - exp.fontSize) <= TOL.px);
    chk('font-weight', exp.fontWeight, m.fontWeight, m.fontWeight === exp.fontWeight);
    const failed = checks.filter((x) => x.ok === false);
    const unknown = checks.filter((x) => x.ok === null);
    results.push({ ...key, status: failed.length ? 'fail' : unknown.length ? 'partial' : 'pass', level: 'L1', contract: c, checks, notChecked: exp.notChecked, measuredElement: m.tagName });
  }
  await page.close();
}
await browser.close();

// ---------- write ----------
const tally = {}; for (const r of results) tally[r.status] = (tally[r.status] || 0) + 1;
const out = { setId, set: spec.set.name, tag: TAG, mutate: MUTATE, generatedAt: new Date().toISOString(), tolerance: TOL, tally, results };
fs.writeFileSync(path.join(outDir, `${setId.replace(/:/g, '-')}${MUTATE ? '.mutate' : ''}.l1.json`), JSON.stringify(out, null, 1) + '\n');
for (const f of fs.readdirSync(outDir)) if (f.startsWith('_page-')) fs.unlinkSync(path.join(outDir, f));
if (!MUTATE) {
  const lp = path.join(KIT, 'verify/ledger.json');
  const ledger = fs.existsSync(lp) ? rd(lp) : { schema: 'igdsx-ledger/1', rows: [] };
  ledger.rows = ledger.rows.filter((r) => !(r.setId === setId && r.level === 'L1' && r.tag === TAG));
  for (const r of results) ledger.rows.push({ setId, set: r.set, tag: TAG, variant: r.variant, theme: r.theme, level: 'L1', status: r.status, reason: r.reason ?? null, failed: (r.checks || []).filter((x) => x.ok === false).map((x) => x.prop), evidence: `verify/out/${setId.replace(/:/g, '-')}.l1.json` });
  ledger.rows.sort((a, b) => (a.setId + a.variant + a.theme).localeCompare(b.setId + b.variant + b.theme));
  fs.writeFileSync(lp, JSON.stringify(ledger, null, 1) + '\n');
}
console.log(`${spec.set.name} -> ${TAG}${MUTATE ? ' [MUTATION TEST]' : ''}:`, JSON.stringify(tally));
const failsByProp = {}; for (const r of results) for (const x of r.checks || []) if (x.ok === false) failsByProp[x.prop] = (failsByProp[x.prop] || 0) + 1;
console.log('failed checks by property:', JSON.stringify(failsByProp));

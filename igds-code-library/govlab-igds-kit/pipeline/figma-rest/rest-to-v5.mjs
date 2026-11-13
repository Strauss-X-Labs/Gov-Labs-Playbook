// Converts a Figma REST /v1/files/:key/nodes response for ONE component set (or standalone component) into the
// same v5 record format that extract-spec-v5.figma.js produces through MCP, so normalize-spec.mjs treats both alike
// and cross-checks them (same variant id captured twice must be identical).
// Field-by-field mapping mirrors props() in extract-spec-v5.figma.js. Where REST cannot express a plugin field
// losslessly the difference is explicit, never guessed:
//   - letterSpacing: REST gives pixels only -> ls = [px, "PIXELS"] (plugin may say [v, "PERCENT"]; normalizer canonicalises)
//   - componentPropertyDefinitions: REST returns none -> defs come from an MCP capture (spec/raw) when available.
import { isDefault } from './defs.mjs';
export const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const r2 = (x) => Math.round(x * 100) / 100;

// extraNames: {variableId: {name}} from an MCP capture (spec/raw-varnames) for ids the REST variables endpoint does not list
export function makeVarNamer(varsJson, extraNames = {}) {
  const cols = varsJson.meta.variableCollections, vars = varsJson.meta.variables;
  const unknown = new Set();
  const name = (id) => {
    const v = vars[id];
    if (!v) { if (extraNames[id]) return extraNames[id].name; unknown.add(id); return null; }
    const col = cols[v.variableCollectionId];
    return (v.remote ? '[remote]' : '') + (col ? col.name : '?') + '/' + v.name;
  };
  return { name, unknown };
}

const CORNER = { RECTANGLE_TOP_LEFT_CORNER_RADIUS: 'topLeftRadius', RECTANGLE_TOP_RIGHT_CORNER_RADIUS: 'topRightRadius', RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS: 'bottomLeftRadius', RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS: 'bottomRightRadius',
  BORDER_TOP_WEIGHT: 'strokeTopWeight', BORDER_RIGHT_WEIGHT: 'strokeRightWeight', BORDER_BOTTOM_WEIGHT: 'strokeBottomWeight', BORDER_LEFT_WEIGHT: 'strokeLeftWeight' };

export function convertSet(resp, rootId, vn, { defs = null, defsList = {} } = {}) {
  const d = resp.nodes[rootId];
  if (!d || !d.document) throw new Error(`node ${rootId} missing in response`);
  const comps = d.components || {}, csets = d.componentSets || {}, styles = d.styles || {};
  const sname = (id) => (id && styles[id] ? styles[id].name : null);
  const paints = (arr) => {
    if (!Array.isArray(arr)) return undefined;
    const out = [];
    for (const p of arr) {
      if (p.visible === false) continue;
      const o = { t: p.type };
      if (p.type === 'SOLID') { o.c = hex(p.color); if (p.opacity !== undefined && p.opacity < 1) o.a = r2(p.opacity); }
      if (p.type.startsWith('GRADIENT')) { o.stops = p.gradientStops.map((s) => [hex(s.color), r2(s.color.a), r2(s.position)]); if (p.gradientHandlePositions) o.gh = p.gradientHandlePositions.map((q) => [Math.round(q.x * 1e4) / 1e4, Math.round(q.y * 1e4) / 1e4]); } // gh: REST-only
      const bv = p.boundVariables && p.boundVariables.color; if (bv) o.v = vn.name(bv.id);
      out.push(o);
    }
    return out.length ? out : undefined;
  };
  const boundVars = (n) => {
    const o = {};
    for (const [k, v] of Object.entries(n.boundVariables || {})) {
      if (k === 'fills' || k === 'strokes' || k === 'effects' || k === 'componentProperties') continue;
      if (k === 'rectangleCornerRadii' || k === 'individualStrokeWeights') { for (const [ck, a] of Object.entries(v)) if (a && a.id) o[CORNER[ck] || ck] = vn.name(a.id); continue; }
      const arr = Array.isArray(v) ? v : [v]; const names = [];
      for (const a of arr) if (a && a.id) names.push(vn.name(a.id));
      if (names.length) o[k] = names.length === 1 ? names[0] : names;
    }
    return Object.keys(o).length ? o : undefined;
  };
  const visibleTexts = (n, out) => { for (const ch of n.children || []) { if (ch.visible === false) continue; if (ch.type === 'TEXT') out.push(ch.characters); visibleTexts(ch, out); } return out; };
  // Effective per-character style (base style + override row), like the plugin API: one value if every character
  // agrees, 'mixed' otherwise. characterStyleOverrides may be shorter than the text (rest = base style, index 0).
  const effective = (n) => {
    const t = n.styleOverrideTable || {}, ov = n.characterStyleOverrides || [], len = [...(n.characters || '')].length || 1;
    const rows = new Set(); for (let i = 0; i < len; i++) rows.add(ov[i] || 0);
    return [...rows].map((r) => ({ ...(n.style || {}), ...(r ? t[r] || {} : {}) }));
  };
  const one = (styles, fn) => { const vs = new Set(styles.map((s) => JSON.stringify(fn(s)))); return vs.size === 1 ? JSON.parse([...vs][0]) : 'mixed'; };

  const props = (n, root) => {
    const bb = n.absoluteBoundingBox, rb = root.absoluteBoundingBox;
    const o = { n: n.name, t: n.type, x: r2(bb.x - rb.x), y: r2(bb.y - rb.y), w: r2(bb.width), h: r2(bb.height) };
    // REST-only fields: nid = Figma node id (for SVG export of shapes), ref = component property bindings
    // (characters / visible / mainComponent -> property name without "#id" unless names collide in the set)
    o.nid = n.id;
    if (n.componentPropertyReferences) o.ref = Object.fromEntries(Object.entries(n.componentPropertyReferences).map(([k, v]) => [k, v]));
    if (n.opacity !== undefined && n.opacity < 1) o.op = r2(n.opacity);
    if (n.layoutMode && n.layoutMode !== 'NONE') o.al = { m: n.layoutMode, p: [n.paddingTop || 0, n.paddingRight || 0, n.paddingBottom || 0, n.paddingLeft || 0], g: n.itemSpacing || 0, pa: n.primaryAxisAlignItems || 'MIN', ca: n.counterAxisAlignItems || 'MIN', sh: n.layoutSizingHorizontal, sv: n.layoutSizingVertical, wr: n.layoutWrap === 'WRAP' ? 1 : undefined, cg: n.layoutWrap === 'WRAP' ? (n.counterAxisSpacing || 0) : undefined };
    else if (n.layoutSizingHorizontal !== undefined) o.sz = [n.layoutSizingHorizontal, n.layoutSizingVertical];
    if (n.layoutPositioning === 'ABSOLUTE') o.abs = 1;
    if (n.layoutGrow) o.grow = n.layoutGrow;
    if (n.minWidth || n.maxWidth || n.minHeight || n.maxHeight) o.mm = [n.minWidth ?? null, n.maxWidth ?? null, n.minHeight ?? null, n.maxHeight ?? null];
    if (Array.isArray(n.rectangleCornerRadii) && new Set(n.rectangleCornerRadii).size > 1) { const [tl, tr, br, bl] = n.rectangleCornerRadii; o.r = [tl, tr, br, bl]; }
    else if (n.cornerRadius) o.r = n.cornerRadius;
    if ('fills' in n) { const f = paints(n.fills); if (f) o.f = f; const fs = sname(n.styles && n.styles.fill); if (fs) o.fs = fs; }
    if (Array.isArray(n.strokes) && n.strokes.length) { const s = paints(n.strokes); if (s) { o.s = s; const iw = n.individualStrokeWeights; o.sw = iw ? [iw.top, iw.right, iw.bottom, iw.left] : n.strokeWeight; o.sa = n.strokeAlign; if (n.strokeDashes && n.strokeDashes.length) o.dash = n.strokeDashes; } }
    if (Array.isArray(n.effects) && n.effects.length) { const fx = []; for (const e of n.effects) { if (e.visible === false) continue; const x = { t: e.type, rad: e.radius }; if (e.color) { x.c = hex(e.color); x.a = r2(e.color.a); } if (e.offset) x.o = [e.offset.x, e.offset.y]; if (e.spread) x.sp = e.spread; fx.push(x); } if (fx.length) o.fx = fx; const es = sname(n.styles && n.styles.effect); if (es) o.es = es; }
    if (n.clipsContent) o.clip = 1;
    const bv = boundVars(n); if (bv) o.v = bv;
    if (n.type === 'TEXT') {
      const st = n.style || {}, es = effective(n);
      o.tx = n.characters;
      o.font = one(es, (s) => [s.fontFamily, s.fontStyle]);
      o.fsz = one(es, (s) => s.fontSize);
      o.lh = one(es, (s) => (s.lineHeightUnit === 'INTRINSIC_%' ? 'auto' : s.lineHeightUnit === 'FONT_SIZE_%' ? [r2(s.lineHeightPercentFontSize), 'PERCENT'] : [s.lineHeightPx, 'PIXELS']));
      o.ls = one(es, (s) => [r2(s.letterSpacing || 0), 'PIXELS']);
      o.ta = [st.textAlignHorizontal, st.textAlignVertical]; o.tar = st.textAutoResize || 'NONE';
      const td = one(es, (s) => s.textDecoration || 'NONE'); if (td !== 'NONE') o.td = td;
      const tc = one(es, (s) => s.textCase || 'ORIGINAL'); if (tc !== 'ORIGINAL') o.tc = tc;
      const ts = sname(n.styles && n.styles.text); if (ts) o.ts = ts;
    }
    if (n.type === 'INSTANCE') {
      const mc = comps[n.componentId];
      if (mc) { const set = mc.componentSetId && csets[mc.componentSetId]; o.inst = { set: set ? set.name : mc.name, setId: set ? mc.componentSetId : n.componentId, variant: set ? mc.name : null, remote: mc.remote ? 1 : undefined }; }
      o.mcid = n.componentId; // REST-only: main component (variant) id, for SVG export of icon variants
      const setKey = mc && (mc.componentSetId || n.componentId);
      const cp = {}; let known = true;
      const entries = Object.entries(n.componentProperties || {});
      const nameCount = {}; for (const [k] of entries) { const b = k.split('#')[0]; nameCount[b] = (nameCount[b] || 0) + 1; }
      for (const [k, v] of entries) {
        const out = nameCount[k.split('#')[0]] > 1 ? k : k.split('#')[0]; // keep "name#id" only when names collide (lossless)
        if (v.type !== 'VARIANT') { const dflt = isDefault(defsList, setKey, out, v.value); if (dflt === null) known = false; if (dflt) continue; }
        cp[out] = v.value;
      }
      if (Object.keys(cp).length) o.cp = cp;
      const dm = known ? 1 : null;
      const texts = visibleTexts(n, []); if (texts.length) o.itx = texts;
      // ifill (REST-only field): distinct visible fills of the vector shapes inside the instance = the icon colour
      // after overrides (e.g. the 🎨-Icon-Color vector bound to Colors/Button/text-primary). Not walked as nodes.
      const shapeFills = []; const seen = new Set();
      const walkShapes = (x) => { for (const ch of x.children || []) { if (ch.visible === false) continue; if (['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE', 'STAR', 'LINE', 'REGULAR_POLYGON'].includes(ch.type)) { for (const p of paints(ch.fills) || []) { const k = JSON.stringify(p); if (!seen.has(k)) { seen.add(k); shapeFills.push(p); } } if (ch.type === 'BOOLEAN_OPERATION') continue; } walkShapes(ch); } };
      walkShapes(n); if (shapeFills.length) o.ifill = shapeFills;
      o._cpDefsKnown = dm ? 1 : 0;
    }
    if (['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'ELLIPSE', 'LINE', 'REGULAR_POLYGON'].includes(n.type)) o.vec = 1;
    return o;
  };
  const sameVal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const keys = [], keyIx = new Map(), vals = [], valIx = new Map(), paths = [], pathIx = new Map();
  const ix = (arr, map, s) => { let i = map.get(s); if (i === undefined) { i = arr.length; arr.push(s); map.set(s, i); } return i; };
  let cpUnknown = 0;
  const walk = (n, root, p, out) => {
    // hidden nodes are skipped, EXCEPT those whose visibility is bound to a BOOLEAN component property: they belong to
    // the component (shown when the property is on) -> kept with hid:1 (REST-only; ignored when comparing with MCP).
    if (n.visible === false && p !== '' && !(n.componentPropertyReferences && n.componentPropertyReferences.visible)) return;
    const o = props(n, root); if (p === '') { delete o.n; if (n.visible === false) o.hidden = 1; } // a hidden main component is still a component
    if (p !== '' && n.visible === false) o.hid = 1;
    if (o._cpDefsKnown === 0 && o.cp) cpUnknown++;
    delete o._cpDefsKnown;
    const rec = [ix(paths, pathIx, p)];
    for (const [k, v] of Object.entries(o)) { if (v === undefined) continue; rec.push(ix(keys, keyIx, k), ix(vals, valIx, JSON.stringify(v))); }
    out.push(rec);
    if (n.type !== 'INSTANCE' && n.type !== 'TEXT' && n.type !== 'BOOLEAN_OPERATION' && n.children) { let i = 0; for (const ch of n.children) { if (ch.visible === false && !(ch.componentPropertyReferences && ch.componentPropertyReferences.visible)) continue; walk(ch, root, p + '/' + i + ':' + ch.name, out); i++; } }
  };
  const doc = d.document;
  const isSet = doc.type === 'COMPONENT_SET';
  const all = isSet ? doc.children.filter((c) => c.type === 'COMPONENT') : [doc];
  const variants = all.map((v) => {
    const rx = (v.interactions || []).map((r) => { const a = r.actions && r.actions[0]; return [r.trigger && r.trigger.type, a && a.type, a && a.destinationId ? a.destinationId : null]; });
    const nodes = []; walk(v, v, '', nodes);
    return { id: v.id, name: v.name, rx: rx.length ? rx : undefined, n: nodes };
  });
  const meta = isSet ? csets[doc.id] || {} : comps[doc.id] || {};
  return {
    v: 5, src: 'rest', job: [doc.id, null, 0, all.length],
    set: { id: doc.id, name: doc.name, key: meta.key, ...(defs ? { defs } : {}) },
    total: all.length, offset: 0, keys, paths, vals: vals.map((s) => JSON.parse(s)), variants,
    restStats: { cpWithoutDefaults: cpUnknown, unknownVariables: [...vn.unknown] },
  };
}

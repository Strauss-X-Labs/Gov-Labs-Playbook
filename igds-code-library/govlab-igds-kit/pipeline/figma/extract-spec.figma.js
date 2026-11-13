// READ-ONLY Figma Plugin API script — run through Figma MCP `use_figma` (file FXkIGvCtnuZZDrMjiSm29r).
// Extracts a mechanical Component Spec for one component set: property definitions + every selected variant as a
// node tree with exact geometry, auto layout, paints/effects/typography and the Figma VARIABLE bound to each value.
// Parameters (edit before run): SET_ID, VARIANT_RE (regex on variant name or null), OFFSET, COUNT.
// Output (compact keys, documented in pipeline/README.md):
//   { v:2, set:{id,name,key,defs}, total, offset, variants:[{id,name,props,w,h,reactions,tree}] }
// Instances are NOT descended (they are separate specs); they record main component set + variant + visible texts + size.
const JOBS = __JOBS__; // [[setId, variantRegex|null, offset, count], ...]

const varCache = new Map(), colCache = new Map(), defCache = new Map();
const vname = async (id) => {
  if (varCache.has(id)) return varCache.get(id);
  let out = null;
  try {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v) { let col = colCache.get(v.variableCollectionId); if (col === undefined) { const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); col = c ? c.name : '?'; colCache.set(v.variableCollectionId, col); } out = (v.remote ? '[remote]' : '') + col + '/' + v.name; }
  } catch (e) { out = 'ERR'; }
  varCache.set(id, out); return out;
};
const styleCache = new Map();
const sname = async (id) => { if (!id || typeof id !== 'string') return null; if (styleCache.has(id)) return styleCache.get(id); let s = null; try { s = (await figma.getStyleByIdAsync(id))?.name ?? null; } catch (e) { s = 'ERR'; } styleCache.set(id, s); return s; };
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const r2 = (x) => Math.round(x * 100) / 100;
const paints = async (arr, bound) => {
  if (!Array.isArray(arr)) return undefined;
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i]; if (p.visible === false) continue;
    const o = { t: p.type };
    if (p.type === 'SOLID') { o.c = hex(p.color); if (p.opacity !== undefined && p.opacity < 1) o.a = r2(p.opacity); }
    if (p.type.startsWith('GRADIENT')) o.stops = p.gradientStops.map((s) => [hex(s.color), r2(s.color.a), r2(s.position)]);
    const bv = p.boundVariables && p.boundVariables.color; if (bv) o.v = await vname(bv.id);
    out.push(o);
  }
  return out.length ? out : undefined;
};
const boundVars = async (n) => {
  const bv = n.boundVariables || {}; const o = {};
  for (const [k, v] of Object.entries(bv)) { if (k === 'fills' || k === 'strokes' || k === 'effects' || k === 'componentProperties') continue; const arr = Array.isArray(v) ? v : [v]; const names = []; for (const a of arr) if (a && a.id) names.push(await vname(a.id)); if (names.length) o[k] = names.length === 1 ? names[0] : names; }
  return Object.keys(o).length ? o : undefined;
};
const node = async (n, root) => {
  if (n.visible === false) return null;
  const at = n.absoluteTransform, rt = root.absoluteTransform;
  const o = { id: n.id, n: n.name, t: n.type, x: r2(at[0][2] - rt[0][2]), y: r2(at[1][2] - rt[1][2]), w: r2(n.width), h: r2(n.height) };
  if (n.opacity !== undefined && n.opacity < 1) o.op = r2(n.opacity);
  if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') o.al = { m: n.layoutMode, p: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft], g: n.itemSpacing, pa: n.primaryAxisAlignItems, ca: n.counterAxisAlignItems, sh: n.layoutSizingHorizontal, sv: n.layoutSizingVertical, wr: n.layoutWrap === 'WRAP' ? 1 : undefined, cg: n.layoutWrap === 'WRAP' ? n.counterAxisSpacing : undefined };
  else if ('layoutSizingHorizontal' in n) o.sz = [n.layoutSizingHorizontal, n.layoutSizingVertical];
  if ('layoutPositioning' in n && n.layoutPositioning === 'ABSOLUTE') o.abs = 1;
  if ('layoutGrow' in n && n.layoutGrow) o.grow = n.layoutGrow;
  if ('minWidth' in n && (n.minWidth || n.maxWidth || n.minHeight || n.maxHeight)) o.mm = [n.minWidth, n.maxWidth, n.minHeight, n.maxHeight];
  if ('cornerRadius' in n) { if (typeof n.cornerRadius === 'number') { if (n.cornerRadius) o.r = n.cornerRadius; } else o.r = [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius]; }
  if ('fills' in n) { const f = await paints(n.fills, true); if (f) o.f = f; const fs = await sname(n.fillStyleId); if (fs) o.fs = fs; }
  if ('strokes' in n && n.strokes.length) { const s = await paints(n.strokes); if (s) { o.s = s; o.sw = typeof n.strokeWeight === 'number' ? n.strokeWeight : [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight]; o.sa = n.strokeAlign; if (n.dashPattern && n.dashPattern.length) o.dash = n.dashPattern; } }
  if ('effects' in n && n.effects.length) { o.fx = []; for (const e of n.effects) { if (e.visible === false) continue; const x = { t: e.type, rad: e.radius }; if (e.color) { x.c = hex(e.color); x.a = r2(e.color.a); } if (e.offset) x.o = [e.offset.x, e.offset.y]; if (e.spread) x.sp = e.spread; o.fx.push(x); } const es = await sname(n.effectStyleId); if (es) o.es = es; if (!o.fx.length) delete o.fx; }
  if ('clipsContent' in n && n.clipsContent) o.clip = 1;
  const bv = await boundVars(n); if (bv) o.v = bv;
  if (n.type === 'TEXT') {
    o.tx = n.characters;
    const fn = n.fontName; o.font = typeof fn === 'symbol' ? 'mixed' : [fn.family, fn.style];
    o.fsz = typeof n.fontSize === 'number' ? n.fontSize : 'mixed';
    o.lh = typeof n.lineHeight === 'symbol' ? 'mixed' : (n.lineHeight.unit === 'AUTO' ? 'auto' : [n.lineHeight.value, n.lineHeight.unit]);
    o.ls = typeof n.letterSpacing === 'symbol' ? 'mixed' : [n.letterSpacing.value, n.letterSpacing.unit];
    o.ta = [n.textAlignHorizontal, n.textAlignVertical]; o.tar = n.textAutoResize;
    if (n.textDecoration && n.textDecoration !== 'NONE' && typeof n.textDecoration === 'string') o.td = n.textDecoration;
    if (n.textCase && n.textCase !== 'ORIGINAL' && typeof n.textCase === 'string') o.tc = n.textCase;
    const ts = await sname(n.textStyleId); if (ts) o.ts = ts;
    return o;
  }
  if (n.type === 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    if (mc) { const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : null; o.inst = { set: set ? set.name : mc.name, setId: set ? set.id : mc.id, variant: set ? mc.name : null, remote: mc.remote ? 1 : undefined }; }
    // component property values; non-variant values equal to the main set's default are omitted (listed in cpDefaults once per set)
    const setNode = mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc;
    let defsMap = defCache.get(setNode && setNode.id);
    if (setNode && !defsMap) { defsMap = {}; try { for (const [k, d] of Object.entries(setNode.componentPropertyDefinitions || {})) defsMap[k] = d.defaultValue; } catch (e) {} defCache.set(setNode.id, defsMap); }
    const cp = {}; for (const [k, v] of Object.entries(n.componentProperties || {})) { if (v.type !== 'VARIANT' && defsMap && defsMap[k] === v.value) continue; cp[k.split('#')[0]] = v.value; } if (Object.keys(cp).length) o.cp = cp;
    const texts = n.findAll((x) => x.type === 'TEXT' && x.visible !== false).filter((t) => { let p = t; while (p && p.id !== n.id) { if (p.visible === false) return false; p = p.parent; } return true; });
    if (texts.length) o.itx = texts.map((t) => t.characters);
    return o;
  }
  if ('children' in n && n.type !== 'BOOLEAN_OPERATION') { const c = []; for (const ch of n.children) { const x = await node(ch, root); if (x) c.push(x); } if (c.length) o.c = c; }
  if (n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'LINE' || n.type === 'POLYGON') o.vec = 1;
  return o;
};
const results = [];
for (const [SET_ID, VARIANT_RE, OFFSET, COUNT] of JOBS) {
  const set = await figma.getNodeByIdAsync(SET_ID);
  const defs = Object.fromEntries(Object.entries(set.componentPropertyDefinitions).map(([k, d]) => [k.split('#')[0], d.type === 'VARIANT' ? { t: 'VARIANT', o: d.variantOptions, d: d.defaultValue } : { t: d.type, d: d.defaultValue, pv: d.preferredValues ? d.preferredValues.length : undefined }]));
  const all = set.children.filter((v) => !VARIANT_RE || VARIANT_RE.test(v.name));
  const pick = all.slice(OFFSET, OFFSET + COUNT);
  // Delta encoding (v3): each node tree is flattened to {path: props}; path = parentPath + '/' + index + ':' + name.
  // The first picked variant is stored in full ("base"); every other variant stores only changed/added paths ("set") and removed paths ("del").
  const flat = (o, path, out) => { const { c, id, ...props } = o; out[path] = JSON.stringify(props); if (c) c.forEach((ch, i) => flat(ch, path + '/' + i + ':' + ch.n, out)); return out; };
  const variants = []; let base = null;
  for (const v of pick) {
    // v4: reaction destination = node id (normalizer resolves it to the variant name); props omitted (= parsed from name)
    const reactions = (v.reactions || []).map((r) => { const a = r.action || (r.actions && r.actions[0]); return [r.trigger && r.trigger.type, a && a.type, a && a.destinationId ? a.destinationId : null]; });
    const f = flat(await node(v, v), '', {});
    const rec = { id: v.id, name: v.name, w: r2(v.width), h: r2(v.height), rx: reactions.length ? reactions : undefined };
    // v4: property-level delta. The root's "n" (== variant name, already in rec.name) is dropped from every root record.
    // set[path] = {key: value | null(=key removed)} for an existing base path; add[path] = full props for a new path.
    const fp = Object.fromEntries(Object.entries(f).map(([k, s]) => { const o = JSON.parse(s); if (k === '') delete o.n; return [k, o]; }));
    if (!base) { base = fp; rec.base = fp; }
    else {
      const setD = {}, add = {};
      for (const [k, o] of Object.entries(fp)) {
        const b = base[k];
        if (!b) { add[k] = o; continue; }
        const d = {}; for (const key of new Set([...Object.keys(b), ...Object.keys(o)])) { const x = JSON.stringify(o[key]), y = JSON.stringify(b[key]); if (x !== y) d[key] = o[key] === undefined ? null : o[key]; }
        if (Object.keys(d).length) setD[k] = d;
      }
      const del = Object.keys(base).filter((k) => !(k in fp));
      if (Object.keys(setD).length) rec.set = setD; if (Object.keys(add).length) rec.add = add; if (del.length) rec.del = del;
    }
    variants.push(rec);
  }
  results.push({ set: { id: set.id, name: set.name, key: set.key, defs }, total: all.length, offset: OFFSET, variants });
}
const res = { v: 4, jobs: JOBS.map((j) => j.slice(0, 1).concat([j[1] ? String(j[1]) : null, j[2], j[3]])), results };
// Adaptive fit (v3.1): drop whole variants from the END of the last job until the reply fits the MCP limit.
// `next` = offset to continue from in the next call (absent when the job is complete). Never truncates inside a variant.
let size = JSON.stringify(res).length;
const last = results[results.length - 1];
while (size > 46000 && last && last.variants.length > 1) { last.variants.pop(); last.next = last.offset + last.variants.length; size = JSON.stringify(res).length; }
if (last && !last.next && last.offset + last.variants.length < last.total && last.variants.length === JOBS[JOBS.length - 1][3]) last.next = last.offset + last.variants.length;
return size > 46000 ? { tooBig: size, sizes: results.map((r) => [r.set.name, JSON.stringify(r).length, r.variants.length]) } : res;

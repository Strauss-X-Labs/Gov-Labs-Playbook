// READ-ONLY Figma Plugin API script — run through Figma MCP `use_figma` (file FXkIGvCtnuZZDrMjiSm29r).
// v5 = same node data as extract-spec.figma.js (v3/v4), lossless, but dictionary-encoded to fit far more variants per call:
//   keys:  [propertyName...]           vals: [distinct JSON value...]      paths: [tree path...]
//   variant.n = [[pathIdx, keyIdx, valIdx, keyIdx, valIdx, ...], ...]   (one entry per visible node, document order)
// Path grammar as v3: '' = root, child = parent + '/' + index + ':' + name. Root "n" (= variant name) is omitted.
// Reaction destination = node id. Adaptive fit: whole variants are dropped from the end; `next` = offset to resume.
// Parameters: JOBS = [[setId, variantRegex|null, offset, count]] (one job per call recommended).
const JOBS = __JOBS__;
const varCache = new Map(), colCache = new Map(), defCache = new Map();
const vname = async (id) => { if (varCache.has(id)) return varCache.get(id); let out = null; try { const v = await figma.variables.getVariableByIdAsync(id); if (v) { let col = colCache.get(v.variableCollectionId); if (col === undefined) { const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); col = c ? c.name : '?'; colCache.set(v.variableCollectionId, col); } out = (v.remote ? '[remote]' : '') + col + '/' + v.name; } } catch (e) { out = 'ERR'; } varCache.set(id, out); return out; };
const styleCache = new Map();
const sname = async (id) => { if (!id || typeof id !== 'string') return null; if (styleCache.has(id)) return styleCache.get(id); let s = null; try { s = (await figma.getStyleByIdAsync(id))?.name ?? null; } catch (e) { s = 'ERR'; } styleCache.set(id, s); return s; };
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const r2 = (x) => Math.round(x * 100) / 100;
const paints = async (arr) => { if (!Array.isArray(arr)) return undefined; const out = []; for (const p of arr) { if (p.visible === false) continue; const o = { t: p.type }; if (p.type === 'SOLID') { o.c = hex(p.color); if (p.opacity !== undefined && p.opacity < 1) o.a = r2(p.opacity); } if (p.type.startsWith('GRADIENT')) o.stops = p.gradientStops.map((s) => [hex(s.color), r2(s.color.a), r2(s.position)]); const bv = p.boundVariables && p.boundVariables.color; if (bv) o.v = await vname(bv.id); out.push(o); } return out.length ? out : undefined; };
const boundVars = async (n) => { const bv = n.boundVariables || {}; const o = {}; for (const [k, v] of Object.entries(bv)) { if (k === 'fills' || k === 'strokes' || k === 'effects' || k === 'componentProperties') continue; const arr = Array.isArray(v) ? v : [v]; const names = []; for (const a of arr) if (a && a.id) names.push(await vname(a.id)); if (names.length) o[k] = names.length === 1 ? names[0] : names; } return Object.keys(o).length ? o : undefined; };
const props = async (n, root) => {
  const at = n.absoluteTransform, rt = root.absoluteTransform;
  const o = { n: n.name, t: n.type, x: r2(at[0][2] - rt[0][2]), y: r2(at[1][2] - rt[1][2]), w: r2(n.width), h: r2(n.height) };
  if (n.opacity !== undefined && n.opacity < 1) o.op = r2(n.opacity);
  if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') o.al = { m: n.layoutMode, p: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft], g: n.itemSpacing, pa: n.primaryAxisAlignItems, ca: n.counterAxisAlignItems, sh: n.layoutSizingHorizontal, sv: n.layoutSizingVertical, wr: n.layoutWrap === 'WRAP' ? 1 : undefined, cg: n.layoutWrap === 'WRAP' ? n.counterAxisSpacing : undefined };
  else if ('layoutSizingHorizontal' in n) o.sz = [n.layoutSizingHorizontal, n.layoutSizingVertical];
  if ('layoutPositioning' in n && n.layoutPositioning === 'ABSOLUTE') o.abs = 1;
  if ('layoutGrow' in n && n.layoutGrow) o.grow = n.layoutGrow;
  if ('minWidth' in n && (n.minWidth || n.maxWidth || n.minHeight || n.maxHeight)) o.mm = [n.minWidth, n.maxWidth, n.minHeight, n.maxHeight];
  if ('cornerRadius' in n) { if (typeof n.cornerRadius === 'number') { if (n.cornerRadius) o.r = n.cornerRadius; } else o.r = [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius]; }
  if ('fills' in n) { const f = await paints(n.fills); if (f) o.f = f; const fs = await sname(n.fillStyleId); if (fs) o.fs = fs; }
  if ('strokes' in n && n.strokes.length) { const s = await paints(n.strokes); if (s) { o.s = s; o.sw = typeof n.strokeWeight === 'number' ? n.strokeWeight : [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight]; o.sa = n.strokeAlign; if (n.dashPattern && n.dashPattern.length) o.dash = n.dashPattern; } }
  if ('effects' in n && n.effects.length) { const fx = []; for (const e of n.effects) { if (e.visible === false) continue; const x = { t: e.type, rad: e.radius }; if (e.color) { x.c = hex(e.color); x.a = r2(e.color.a); } if (e.offset) x.o = [e.offset.x, e.offset.y]; if (e.spread) x.sp = e.spread; fx.push(x); } if (fx.length) o.fx = fx; const es = await sname(n.effectStyleId); if (es) o.es = es; }
  if ('clipsContent' in n && n.clipsContent) o.clip = 1;
  const bv = await boundVars(n); if (bv) o.v = bv;
  if (n.type === 'TEXT') {
    o.tx = n.characters; const fn = n.fontName; o.font = typeof fn === 'symbol' ? 'mixed' : [fn.family, fn.style];
    o.fsz = typeof n.fontSize === 'number' ? n.fontSize : 'mixed';
    o.lh = typeof n.lineHeight === 'symbol' ? 'mixed' : (n.lineHeight.unit === 'AUTO' ? 'auto' : [n.lineHeight.value, n.lineHeight.unit]);
    o.ls = typeof n.letterSpacing === 'symbol' ? 'mixed' : [n.letterSpacing.value, n.letterSpacing.unit];
    o.ta = [n.textAlignHorizontal, n.textAlignVertical]; o.tar = n.textAutoResize;
    if (n.textDecoration && n.textDecoration !== 'NONE' && typeof n.textDecoration === 'string') o.td = n.textDecoration;
    if (n.textCase && n.textCase !== 'ORIGINAL' && typeof n.textCase === 'string') o.tc = n.textCase;
    const ts = await sname(n.textStyleId); if (ts) o.ts = ts;
  }
  if (n.type === 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    if (mc) { const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : null; o.inst = { set: set ? set.name : mc.name, setId: set ? set.id : mc.id, variant: set ? mc.name : null, remote: mc.remote ? 1 : undefined }; }
    const setNode = mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc;
    let defsMap = defCache.get(setNode && setNode.id);
    if (setNode && !defsMap) { defsMap = {}; try { for (const [k, d] of Object.entries(setNode.componentPropertyDefinitions || {})) defsMap[k] = d.defaultValue; } catch (e) {} defCache.set(setNode.id, defsMap); }
    const cp = {}; for (const [k, v] of Object.entries(n.componentProperties || {})) { if (v.type !== 'VARIANT' && defsMap && defsMap[k] === v.value) continue; cp[k.split('#')[0]] = v.value; } if (Object.keys(cp).length) o.cp = cp;
    const texts = n.findAll((x) => x.type === 'TEXT' && x.visible !== false).filter((t) => { let p = t; while (p && p.id !== n.id) { if (p.visible === false) return false; p = p.parent; } return true; });
    if (texts.length) o.itx = texts.map((t) => t.characters);
  }
  if (n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'LINE' || n.type === 'POLYGON') o.vec = 1;
  return o;
};
const keys = [], keyIx = new Map(), vals = [], valIx = new Map(), paths = [], pathIx = new Map();
const ix = (arr, map, s) => { let i = map.get(s); if (i === undefined) { i = arr.length; arr.push(s); map.set(s, i); } return i; };
const walk = async (n, root, path, out) => {
  if (n.visible === false) return;
  const o = await props(n, root); if (path === '') delete o.n;
  const rec = [ix(paths, pathIx, path)];
  for (const [k, v] of Object.entries(o)) { if (v === undefined) continue; rec.push(ix(keys, keyIx, k), ix(vals, valIx, JSON.stringify(v))); }
  out.push(rec);
  if (n.type !== 'INSTANCE' && n.type !== 'TEXT' && n.type !== 'BOOLEAN_OPERATION' && 'children' in n) { let i = 0; for (const ch of n.children) { if (ch.visible === false) continue; await walk(ch, root, path + '/' + i + ':' + ch.name, out); i++; } }
};
const [SET_ID, VARIANT_RE, OFFSET, COUNT] = JOBS[0];
const set = await figma.getNodeByIdAsync(SET_ID);
const defs = Object.fromEntries(Object.entries(set.componentPropertyDefinitions).map(([k, d]) => [k.split('#')[0], d.type === 'VARIANT' ? { t: 'VARIANT', o: d.variantOptions, d: d.defaultValue } : { t: d.type, d: d.defaultValue, pv: d.preferredValues ? d.preferredValues.length : undefined }]));
const all = set.children.filter((v) => !VARIANT_RE || VARIANT_RE.test(v.name));
const pick = all.slice(OFFSET, OFFSET + COUNT);
const variants = [];
for (const v of pick) {
  const rx = (v.reactions || []).map((r) => { const a = r.action || (r.actions && r.actions[0]); return [r.trigger && r.trigger.type, a && a.type, a && a.destinationId ? a.destinationId : null]; });
  const nodes = []; await walk(v, v, '', nodes);
  variants.push({ id: v.id, name: v.name, rx: rx.length ? rx : undefined, n: nodes });
}
const build = (vs) => { const usedV = new Set(), usedK = new Set(), usedP = new Set(); for (const v of vs) for (const r of v.n) { usedP.add(r[0]); for (let i = 1; i < r.length; i += 2) { usedK.add(r[i]); usedV.add(r[i + 1]); } } return { v: 5, job: [SET_ID, VARIANT_RE ? String(VARIANT_RE) : null, OFFSET, COUNT], set: { id: set.id, name: set.name, key: set.key, defs }, total: all.length, offset: OFFSET, keys, paths, vals: vals.map((s, i) => (usedV.has(i) ? JSON.parse(s) : 0)), variants: vs }; };
let vs = variants, res = build(vs), size = JSON.stringify(res).length;
while (size > 46000 && vs.length > 1) { vs = vs.slice(0, Math.max(1, Math.floor(vs.length * 46000 / size) - 1)); res = build(vs); size = JSON.stringify(res).length; }
if (OFFSET + vs.length < all.length) res.next = OFFSET + vs.length;
return size > 46000 ? { tooBig: size } : res;

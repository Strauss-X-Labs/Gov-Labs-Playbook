// READ-ONLY Figma Plugin API script (Figma MCP use_figma). Compact visual summary of button-like variants:
// one row per variant: [variantName, w, h, pad[t,r,b,l], gap, radius, fill, stroke, text, iconCount, effects, padVars]
//   fill/stroke = [hex, alpha, variableName] ; stroke adds weight ; text = [hex, variableName, fontStyle, fontSize, lineHeight%, textStyle]
// Used where the full tree is redundant because structure is identical across variants (verified by the full extractor on samples).
const SET_ID = '__SET_ID__';
const RE = __RE__;
const vcache = new Map();
const vn = async (b) => { if (!b || !b.id) return null; if (vcache.has(b.id)) return vcache.get(b.id); let n = null; try { const v = await figma.variables.getVariableByIdAsync(b.id); if (v) { const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); n = (c ? c.name : '?') + '/' + v.name; } } catch (e) { n = 'ERR'; } vcache.set(b.id, n); return n; };
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const paint = async (arr) => { const p = (arr || []).find((x) => x.visible !== false && x.type === 'SOLID'); return p ? [hex(p.color), p.opacity === undefined ? 1 : Math.round(p.opacity * 100) / 100, await vn(p.boundVariables && p.boundVariables.color)] : null; };
const set = await figma.getNodeByIdAsync(SET_ID);
const rows = [];
for (const v of set.children.filter((x) => !RE || RE.test(x.name))) {
  const t = v.findOne((n) => n.type === 'TEXT' && n.visible !== false);
  const icons = v.findAll((n) => n.type === 'INSTANCE' && n.visible !== false).length;
  const stroke = v.strokes && v.strokes.length ? [...(await paint(v.strokes) || []), typeof v.strokeWeight === 'number' ? v.strokeWeight : 'mixed', v.strokeAlign] : null;
  const text = t ? [...(await paint(t.fills) || []).filter((x, i) => i !== 1), t.fontName.style, t.fontSize, t.lineHeight.unit === 'PERCENT' ? t.lineHeight.value : t.lineHeight.unit, t.textStyleId ? (await figma.getStyleByIdAsync(t.textStyleId))?.name : null, t.characters] : null;
  const bv = v.boundVariables || {};
  rows.push([v.name, Math.round(v.width * 100) / 100, Math.round(v.height * 100) / 100, [v.paddingTop, v.paddingRight, v.paddingBottom, v.paddingLeft], v.itemSpacing, typeof v.cornerRadius === 'number' ? v.cornerRadius : [v.topLeftRadius, v.topRightRadius, v.bottomRightRadius, v.bottomLeftRadius], await paint(v.fills), stroke, text, icons, (v.effects || []).filter((e) => e.visible !== false).map((e) => e.type), [await vn(bv.paddingTop), await vn(bv.paddingLeft), await vn(bv.topLeftRadius)]]);
}
return { v: 1, set: set.name, setId: set.id, re: String(RE), rows };

// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/variables-values.json.
// Read-only: values of all local variables per mode (colors as hex, numbers, aliases as references). No mutations.
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(vars.map(v => [v.id, v]));
const colName = new Map(cols.map(c => [c.id, c.name]));
const hex = (c) => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, '0') : '');
const fmt = (val) => {
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') { const t = byId.get(val.id); return t ? '→' + colName.get(t.variableCollectionId) + '/' + t.name : '→?' + val.id; }
  if (val && typeof val === 'object' && 'r' in val) return hex(val);
  return val;
};
const out = cols.map(c => ({ c: c.name, id: c.id, modes: c.modes.map(m => m.name), v: c.variableIds.map(id => { const v = byId.get(id); if (!v) return [id, null]; return [v.name, v.resolvedType[0], c.modes.map(m => fmt(v.valuesByMode[m.modeId])), v.scopes.length > 3 ? 'many' : v.scopes.join('|')]; }) }));
const s = JSON.stringify(out);
return s.length > 47000 ? { tooBig: s.length } : out;

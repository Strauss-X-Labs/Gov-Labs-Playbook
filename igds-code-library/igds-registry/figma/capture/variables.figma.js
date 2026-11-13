// Read-only Figma Plugin API script — run via Figma MCP `use_figma`. Output → snapshot/variables.json
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byCol = {};
for (const v of vars) (byCol[v.variableCollectionId] ||= []).push(v.name);
return cols.map(c => ({ id: c.id, name: c.name, modes: c.modes.map(m => m.name), count: c.variableIds.length, names: byCol[c.id] || [] }));

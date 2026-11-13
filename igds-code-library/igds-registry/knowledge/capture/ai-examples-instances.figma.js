// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/ai-examples-instances.json.
// Read-only: texts inside component instances on the AI Examples page (instance.findAll), with visibility and reaction/link targets of the cards. No mutations.
const pg = await figma.getNodeByIdAsync('45304:1336'); await pg.loadAsync();
const out = []; let total = 0;
const tops = pg.children;
for (const top of tops) {
  const insts = top.type === 'INSTANCE' ? [top] : top.findAll((n) => n.type === 'INSTANCE');
  for (const i of insts) {
    let p = i.parent, nested = false; while (p && p.type !== 'PAGE') { if (p.type === 'INSTANCE') nested = true; p = p.parent; }
    if (nested) continue;
    const mc = await i.getMainComponentAsync();
    const setName = mc ? (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name) : null;
    const texts = i.findAll((n) => n.type === 'TEXT');
    const vis = (n) => { let q = n; while (q && q.id !== i.id) { if (q.visible === false) return false; q = q.parent; } return i.visible !== false; };
    total += texts.length;
    const reactions = (i.reactions || []).map((r) => { const a = r.action || (r.actions && r.actions[0]); return a ? [a.type, a.destinationId || a.url || null] : null; }).filter(Boolean);
    out.push([i.id, top.id, i.name, setName, i.visible ? 1 : 0, reactions, texts.map((t) => [t.characters, vis(t) ? 1 : 0])]);
  }
}
return { instanceTextNodes: total, instances: out };

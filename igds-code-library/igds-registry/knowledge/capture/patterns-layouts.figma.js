// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/patterns-layouts.json.
// Read-only: structure of design patterns (Forms, Feedback sections) and responsive layout templates: ordered child frames, sizes, auto-layout and top-level component instances used. No mutations.
const PATTERN_SECTIONS = { forms: ['22254:2762'], feedback: ['24128:7550'] };
const outer = (n, root) => { let p = n.parent, f = null; while (p && p.id !== root.id) { if (p.type === 'INSTANCE') f = p; p = p.parent; } return f; };
const describe = (node, depth) => {
  const d = { n: node.name.slice(0, 40), t: node.type[0], w: Math.round(node.width), h: Math.round(node.height) };
  if ('layoutMode' in node && node.layoutMode && node.layoutMode !== 'NONE') d.al = node.layoutMode[0] + (node.itemSpacing ? ':' + node.itemSpacing : '');
  if (node.type === 'INSTANCE') return d;
  if (depth > 0 && 'children' in node) d.c = node.children.filter(c => c.visible !== false).slice(0, 14).map(c => describe(c, depth - 1));
  return d;
};
const out = { patterns: [], layouts: [] };
for (const [kind, pageIds] of Object.entries(PATTERN_SECTIONS)) for (const pid of pageIds) {
  const page = await figma.getNodeByIdAsync(pid); await page.loadAsync();
  for (const s of page.findAllWithCriteria({ types: ['SECTION'] })) {
    if (/הנחיות/.test(s.name) || !s.name.trim()) continue;
    const refs = {}; for (const i of s.findAll(n => n.type === 'INSTANCE')) if (!outer(i, s)) refs[i.name] = (refs[i.name] || 0) + 1;
    out.patterns.push({ kind, page: page.name.trim(), id: s.id, name: s.name.trim(), frames: s.children.filter(c => c.visible !== false).map(c => describe(c, 2)), componentRefs: refs });
  }
}
const lp = await figma.getNodeByIdAsync('5820:27710'); await lp.loadAsync();
for (const c of lp.findAllWithCriteria({ types: ['COMPONENT'] })) out.layouts.push({ id: c.id, name: c.name.trim(), structure: describe(c, 3) });
const s = JSON.stringify(out);
return s.length > 47000 ? { tooBig: s.length, patterns: out.patterns.length, layouts: out.layouts.length } : out;

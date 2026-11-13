// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/doc-pages.json.
// Read-only: verbatim visible text (reading order) of the documentation pages without guideline sections: Getting Started, Component Overview, Need help. No mutations.
const PAGES = ['3444:1651', '44707:7604', '40350:13969'];
const out = []; let chars = 0;
for (const pid of PAGES) {
  const page = await figma.getNodeByIdAsync(pid); await page.loadAsync();
  const visible = (n) => { let p = n; while (p && p.type !== 'PAGE') { if (p.visible === false) return false; p = p.parent; } return true; };
  const outerInst = (n) => { let p = n.parent, f = null; while (p && p.type !== 'PAGE') { if (p.type === 'INSTANCE') f = p; p = p.parent; } return f; };
  const blocks = [];
  let hidden = 0;
  for (const t of page.findAll(n => n.type === 'TEXT')) {
    if (!visible(t)) { hidden++; continue; }
    const bb = t.absoluteBoundingBox || { x: 0, y: 0 };
    const i = outerInst(t);
    blocks.push({ y: bb.y, x: bb.x, b: [t.characters, typeof t.fontSize === 'number' ? Math.round(t.fontSize) : 0, typeof t.fontWeight === 'number' && t.fontWeight >= 600 ? 1 : 0, i ? i.name : ''] });
    chars += t.characters.length;
  }
  blocks.sort((a, b) => (Math.round(a.y / 6) - Math.round(b.y / 6)) || (b.x - a.x));
  out.push([pid, page.name.trim(), hidden, blocks.map(x => x.b)]);
}
const res = { v: 1, pages: out, chars };
const s = JSON.stringify(res);
return s.length > 47000 ? { tooBig: s.length, chars } : res;

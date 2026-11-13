// Read-only Figma Plugin API script — run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Verbatim visible text of the "🎨 Design Tokens" page (0:1), per top-level node, reading order top→bottom, right→left.
// Set TOP_IDS to one batch (each run must return < 48 KB). Output: { v:1, tops: [[id, name, type, hidden, blocks:[[text, fontSize, bold, viaInstance]]]], chars }
const TOP_IDS = [];
const page = await figma.getNodeByIdAsync('0:1'); await page.loadAsync();
const out = []; let chars = 0;
for (const id of TOP_IDS) {
  const top = await figma.getNodeByIdAsync(id);
  const vis = (n) => { let p = n; while (p && p.id !== top.id) { if (p.visible === false) return false; p = p.parent; } return top.visible !== false; };
  const oi = (n) => { let p = n.parent, f = null; while (p && p.id !== top.id) { if (p.type === 'INSTANCE') f = p; p = p.parent; } return f; };
  const texts = top.type === 'TEXT' ? [top] : top.findAll((n) => n.type === 'TEXT');
  let hidden = 0; const blocks = [];
  for (const t of texts) {
    if (!vis(t)) { hidden++; continue; }
    const bb = t.absoluteBoundingBox || { x: 0, y: 0 }; const i = top.type === 'TEXT' ? null : oi(t);
    blocks.push({ y: bb.y, x: bb.x, b: [t.characters, typeof t.fontSize === 'number' ? Math.round(t.fontSize) : 0, (typeof t.fontWeight === 'number' && t.fontWeight >= 600) ? 1 : 0, i ? i.name : ''] });
    chars += t.characters.length;
  }
  blocks.sort((a, b) => (Math.round(a.y / 6) - Math.round(b.y / 6)) || (b.x - a.x));
  out.push([top.id, top.name, top.type, hidden, blocks.map((x) => x.b)]);
}
const res = { v: 1, tops: out, chars };
const size = JSON.stringify(res).length;
return size > 47000 ? { tooBig: size, chars, TOP_IDS } : res;

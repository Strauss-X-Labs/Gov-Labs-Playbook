// Read-only Figma Plugin API script — run via Figma MCP `use_figma` (figma-use skill loaded).
// Extracts guideline sections VERBATIM. Set SECTION_IDS to one batch (see knowledge/README.md for batches;
// each run must return < 48 KB). Output (compact):
//   { v: 1, sections: [[sectionId, sectionName, pageId, pageName, imageFills, hiddenSkipped,
//        blocks: [[text, fontSize, bold(0|1), viaInstanceName|''], ...]   // reading order: top→bottom, right→left (RTL)
//        refs: { outermostInstanceName: count }, textNodesFound ]], chars }
const SECTION_IDS = [];
// NOTE: do not assign figma.skipInvisibleInstanceChildren — in read-only sessions the setter is rejected as a modification.
// findAll() still traverses instance sublayers; invisible ones are filtered by visibleChain() below.
const out = []; let chars = 0;
for (const sid of SECTION_IDS) {
  const s = await figma.getNodeByIdAsync(sid);
  if (!s) { out.push([sid, null, null, null, 0, 0, [], {}]); continue; }
  let page = s; while (page && page.type !== 'PAGE') page = page.parent;
  const visibleChain = (n) => { let p = n; while (p && p.id !== s.id) { if (p.visible === false) return false; p = p.parent; } return true; };
  const outerInstance = (n) => { let p = n.parent, found = null; while (p && p.id !== s.id) { if (p.type === 'INSTANCE') found = p; p = p.parent; } return found; };
  const texts = s.findAll((n) => n.type === 'TEXT');
  let hidden = 0; const blocks = [];
  for (const t of texts) {
    if (!visibleChain(t)) { hidden++; continue; }
    const bb = t.absoluteBoundingBox || { x: 0, y: 0 };
    const fs = typeof t.fontSize === 'number' ? Math.round(t.fontSize) : 0;
    const fw = typeof t.fontWeight === 'number' ? t.fontWeight : 0;
    const inst = outerInstance(t);
    blocks.push({ y: bb.y, x: bb.x, b: [t.characters, fs, fw >= 600 ? 1 : 0, inst ? inst.name : ''] });
    chars += t.characters.length;
  }
  blocks.sort((a, b) => (Math.round(a.y / 6) - Math.round(b.y / 6)) || (b.x - a.x));
  const refs = {};
  for (const i of s.findAll((n) => n.type === 'INSTANCE')) { if (!outerInstance(i)) refs[i.name] = (refs[i.name] || 0) + 1; }
  const imgs = s.findAll((n) => 'fills' in n && Array.isArray(n.fills) && n.fills.some((f) => f.type === 'IMAGE')).length;
  out.push([sid, s.name, page.id, page.name.trim(), imgs, hidden, blocks.map((x) => x.b), refs, texts.length]);
}
const res = { v: 1, sections: out, chars };
const size = JSON.stringify(res).length;
return size > 47000 ? { tooBig: size, chars, sectionIds: SECTION_IDS } : res;

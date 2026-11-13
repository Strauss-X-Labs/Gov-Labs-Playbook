// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/ai-examples-and-tokens-probe.json.
// Read-only: (1) AI Examples page — sections, top frames, outermost instance names and visible text in reading order; (2) Design Tokens page — text statistics, headings and longest prose texts, to decide whether it holds usage guidance. No mutations.
const visibleChain = (n, root) => { let p = n; while (p && p.id !== root.id) { if (p.visible === false) return false; p = p.parent; } return true; };
const outerInst = (n, root) => { let p = n.parent, f = null; while (p && p.id !== root.id) { if (p.type === 'INSTANCE') f = p; p = p.parent; } return f; };
const ai = await figma.getNodeByIdAsync('45304:1336'); await ai.loadAsync();
const aiOut = [];
for (const top of ai.children) {
  const texts = top.findAll ? top.findAll((n) => n.type === 'TEXT') : [];
  const blocks = [];
  for (const t of texts) { if (!visibleChain(t, top)) continue; const bb = t.absoluteBoundingBox || { x: 0, y: 0 }; const oi = outerInst(t, top); blocks.push({ y: bb.y, x: bb.x, b: [t.characters, typeof t.fontSize === 'number' ? Math.round(t.fontSize) : 0, (typeof t.fontWeight === 'number' && t.fontWeight >= 600) ? 1 : 0, oi ? oi.name : ''] }); }
  blocks.sort((a, b) => (Math.round(a.y / 6) - Math.round(b.y / 6)) || (b.x - a.x));
  const refs = {}; if (top.findAll) for (const i of top.findAll((n) => n.type === 'INSTANCE')) { if (!outerInst(i, top)) { const mc = await i.getMainComponentAsync(); const nm = mc ? (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name) : i.name; refs[nm] = (refs[nm] || 0) + 1; } }
  const frames = top.children ? top.children.map((c) => [c.name, c.type, Math.round(c.width), Math.round(c.height)]) : [];
  aiOut.push({ id: top.id, name: top.name, type: top.type, frames, refs, blocks: blocks.map((x) => x.b) });
}
const tk = await figma.getNodeByIdAsync('0:1'); await tk.loadAsync();
const tt = tk.findAll((n) => n.type === 'TEXT');
let chars = 0; const fsHist = {}; const heads = []; const prose = []; const tops = tk.children.map((c) => [c.id, c.name, c.type]);
for (const t of tt) { const L = t.characters.length; chars += L; const fs = typeof t.fontSize === 'number' ? Math.round(t.fontSize) : 'mixed'; fsHist[fs] = (fsHist[fs] || 0) + 1; const bold = typeof t.fontWeight === 'number' && t.fontWeight >= 600; if (bold && typeof fs === 'number' && fs >= 22) heads.push(t.characters.slice(0, 80)); if (L >= 60) prose.push(t.characters.slice(0, 300)); }
return { ai: aiOut, tokensPage: { topLevel: tops, textNodes: tt.length, chars, fsHist, headings: [...new Set(heads)].slice(0, 80), longTexts: [...new Set(prose)].slice(0, 40), longTextCount: prose.length } };

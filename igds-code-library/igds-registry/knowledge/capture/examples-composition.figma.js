// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/examples-composition.json.
// Read-only: for every example section (דוגמאות לשימוש, incl. Dark), list the top-level component instances used and count of text/frames — composition evidence of official usage examples. No mutations.
const isEx = (n) => /דוגמא|דוגמה|usage/i.test(n) && !/הנחיות|הוראות/.test(n);
const outerInst = (n, root) => { let p = n.parent, f = null; while (p && p.id !== root.id) { if (p.type === 'INSTANCE') f = p; p = p.parent; } return f; };
const out = [];
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const s of page.findAllWithCriteria({ types: ['SECTION'] })) {
    if (!isEx(s.name)) continue;
    const refs = {};
    for (const i of s.findAllWithCriteria({ types: ['INSTANCE'] })) if (!outerInst(i, s)) refs[i.name] = (refs[i.name] || 0) + 1;
    const frames = s.children.filter(c => c.visible !== false).map(c => c.name.trim().slice(0, 34));
    out.push([page.id, s.id, s.name.trim().slice(0, 30), /dark/i.test(s.name) ? 1 : 0, frames.slice(0, 10), refs]);
  }
}
const str = JSON.stringify(out);
return str.length > 47000 ? { tooBig: str.length, n: out.length } : { n: out.length, sections: out };

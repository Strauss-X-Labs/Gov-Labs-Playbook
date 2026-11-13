// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/guideline-sections-measure.json.
// Read-only measurement: for each guideline section, characters in authored text vs text inside component instances (example content), and heading font-size signals. No mutations.
const isGuide = (n) => /הנחיות|הוראות|guide/i.test(n);
const insideInstance = (n) => { let p = n.parent; while (p && p.type !== 'SECTION' && p.type !== 'PAGE') { if (p.type === 'INSTANCE') return true; p = p.parent; } return false; };
const rows = []; const sizeHist = {}; let tot = { own: 0, inst: 0, sections: 0 };
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const s of page.findAllWithCriteria({ types: ['SECTION'] })) {
    if (!isGuide(s.name)) continue;
    let own = 0, inst = 0, nOwn = 0;
    for (const t of s.findAllWithCriteria({ types: ['TEXT'] })) {
      const L = t.characters.length;
      if (insideInstance(t)) { inst += L; continue; }
      own += L; nOwn++;
      const fs = typeof t.fontSize === 'number' ? t.fontSize : 'mixed';
      sizeHist[fs] = (sizeHist[fs] || 0) + 1;
    }
    tot.own += own; tot.inst += inst; tot.sections++;
    rows.push([page.id, s.id, own, nOwn, inst]);
  }
}
return { tot, sizeHist, rows };

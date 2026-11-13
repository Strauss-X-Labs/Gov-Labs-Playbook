// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/guideline-annotations.json.
// Read-only: for every guideline section, read code-status annotation instances (Inline Toast*) via their component properties, and count text inside all top-level instances (example labels) for coverage reconciliation. No mutations.
const isGuide = (n) => /הנחיות|הוראות|guide/i.test(n);
const out = []; let instChars = 0, instTexts = 0;
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const s of page.findAllWithCriteria({ types: ['SECTION'] })) {
    if (!isGuide(s.name)) continue;
    const top = s.findAll(n => { if (n.type !== 'INSTANCE') return false; let p = n.parent; while (p && p.id !== s.id) { if (p.type === 'INSTANCE') return false; p = p.parent; } return true; });
    const ann = [];
    let sc = 0, st = 0;
    for (const i of top) {
      const texts = i.findAll(n => n.type === 'TEXT');
      st += texts.length; for (const t of texts) sc += t.characters.length;
      if (/Inline Toast|Floating Toast/i.test(i.name)) {
        let p = {}; try { p = i.componentProperties; } catch (e) {}
        const g = (k) => { const e = Object.entries(p).find(([kk]) => kk.replace(/#.*$/, '') === k); return e ? String(e[1].value) : null; };
        const link = texts.map(t => t.characters).filter(c => c !== g('Title Text') && c !== g('Body Text')).slice(0, 2);
        ann.push([i.name, g('Status'), g('Title Text'), g('Body Text'), link]);
      }
    }
    instChars += sc; instTexts += st;
    out.push([s.id, page.id, ann, st, sc]);
  }
}
return { sections: out.length, instTexts, instChars, rows: out };

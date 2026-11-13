// Read-only Figma Plugin API script — run via Figma MCP `use_figma` (after loading the figma-use skill).
// Set FROM_PAGE_ID / TO_PAGE_ID to a page range; keep each run's return under the 48 KB tool limit
// (the canonical file needs 2 runs: "Accordion".."Input Field" → part1.json, "Kpi Cards".."Updates" → part2.json).
// Output row: [pageId, pageName, [[setId, setName, variantCount, {variantProp: values[]}, ["prop:T|B|I"]]], [[soloId, name]]]
const FROM_PAGE_ID = '522:471', TO_PAGE_ID = '81:110';
const pages = figma.root.children;
const a = pages.findIndex(p => p.id === FROM_PAGE_ID), b = pages.findIndex(p => p.id === TO_PAGE_ID);
const res = [];
for (const page of pages.slice(a, b + 1)) {
  await page.loadAsync();
  const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).map(s => {
    let defs = {}; try { defs = s.componentPropertyDefinitions; } catch (e) {}
    const v = {}, o = [];
    for (const [k, d] of Object.entries(defs)) { if (d.type === 'VARIANT') v[k] = d.variantOptions || []; else o.push(k.replace(/#[\d:]+$/, '') + ':' + d.type[0]); }
    return [s.id, s.name, s.children.length, v, o];
  });
  const solo = page.findAllWithCriteria({ types: ['COMPONENT'] }).filter(c => c.parent && c.parent.type !== 'COMPONENT_SET').map(c => [c.id, c.name]);
  res.push([page.id, page.name.trim(), sets, solo]);
}
return res;

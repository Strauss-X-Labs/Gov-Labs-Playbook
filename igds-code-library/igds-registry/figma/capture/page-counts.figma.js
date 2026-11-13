// Read-only Figma Plugin API script — run via Figma MCP `use_figma`. Output → snapshot/pageCounts.json
// Use it first: a change in these counts means the Figma file changed and the snapshot should be refreshed.
const t0 = Date.now();
const out = [];
for (const page of figma.root.children) {
  await page.loadAsync();
  const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  const comps = page.findAllWithCriteria({ types: ['COMPONENT'] }).filter(c => c.parent && c.parent.type !== 'COMPONENT_SET');
  out.push([page.id, page.name, sets.length, comps.length]);
}
return { ms: Date.now() - t0, pages: out };

// READ-ONLY Figma Plugin API script (use_figma). Captures componentPropertyDefinitions — the only component data the
// Figma REST API does not return — for every COMPONENT_SET and standalone COMPONENT on the selected pages.
// Same per-set defs form as extract-spec-v5.figma.js. Params: PAGES = [fromIndex, toIndexExclusive] over figma.root.children.
const [FROM, TO] = __PAGES__;
const defs = {}, pages = [];
for (const page of figma.root.children.slice(FROM, TO)) {
  await page.loadAsync(); let cnt = 0;
  for (const s of page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
    if (s.type === 'COMPONENT' && s.parent && s.parent.type === 'COMPONENT_SET') continue;
    let d; try { d = s.componentPropertyDefinitions; } catch (e) { continue; }
    if (!d || !Object.keys(d).length) continue;
    defs[s.id] = Object.fromEntries(Object.entries(d).map(([k, x]) => [k.split('#')[0], x.type === 'VARIANT' ? { t: 'VARIANT', o: x.variantOptions, d: x.defaultValue } : { t: x.type, d: x.defaultValue, pv: x.preferredValues ? x.preferredValues.length : undefined }]));
    cnt++;
  }
  pages.push([page.id, page.name, cnt]);
}
return { v: 'defs1', range: [FROM, TO], pageCount: figma.root.children.length, pages, defs };

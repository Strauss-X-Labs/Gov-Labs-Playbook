// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/icons-atoms-variants.json.
// Read-only: variant property definitions of icon sets (Icons page) and own atoms (.Atoms page, non-icon). No mutations.
const icons = await figma.getNodeByIdAsync('82:38'); await icons.loadAsync();
const atoms = await figma.getNodeByIdAsync('36363:8125'); await atoms.loadAsync();
const iconNames = new Set();
const props = (s) => { let d = {}; try { d = s.componentPropertyDefinitions; } catch (e) {} const v = {}; for (const [k, x] of Object.entries(d)) if (x.type === 'VARIANT') v[k] = x.variantOptions; return v; };
const iconSets = icons.findAllWithCriteria({ types: ['COMPONENT_SET'] }).map(s => { iconNames.add(s.name.trim().toLowerCase()); return [s.id, s.name.trim(), props(s)]; });
const propSig = {}; for (const [, , v] of iconSets) { const k = Object.entries(v).map(([a, b]) => a + '=' + b.join('/')).join(';'); propSig[k] = (propSig[k] || 0) + 1; }
const atomOwn = atoms.findAllWithCriteria({ types: ['COMPONENT_SET'] }).filter(s => !iconNames.has(s.name.trim().toLowerCase())).map(s => [s.id, s.name.trim(), s.children.length, props(s)]);
return { iconSetCount: iconSets.length, iconVariantSignatures: Object.entries(propSig).sort((a, b) => b[1] - a[1]), iconSets: iconSets.map(([id, n, v]) => [id, n, Object.keys(v).length ? Object.entries(v).map(([a, b]) => a + '=' + b.join('/')).join(';') : '']), atomOwn };

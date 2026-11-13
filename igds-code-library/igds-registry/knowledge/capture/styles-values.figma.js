// Read-only Figma Plugin API script, run via Figma MCP use_figma on file FXkIGvCtnuZZDrMjiSm29r.
// Saved verbatim from the run that produced knowledge/figma/raw/styles-values.json.
// Read-only: values of local text, effect, grid and paint styles. No mutations.
const hex = (c) => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const lh = (l) => !l ? null : l.unit === 'AUTO' ? 'auto' : l.unit === 'PERCENT' ? l.value.toFixed(1) + '%' : l.value + 'px';
const text = (await figma.getLocalTextStylesAsync()).map(s => [s.name, s.fontName.family, s.fontName.style, s.fontSize, lh(s.lineHeight), s.letterSpacing ? (s.letterSpacing.unit === 'PERCENT' ? s.letterSpacing.value + '%' : s.letterSpacing.value + 'px') : null, Object.keys(s.boundVariables || {})]);
const effect = (await figma.getLocalEffectStylesAsync()).map(s => [s.name, s.effects.map(e => [e.type, e.offset ? e.offset.x : null, e.offset ? e.offset.y : null, e.radius, e.spread || 0, e.color ? hex(e.color) + Math.round(e.color.a * 255).toString(16).padStart(2, '0') : null])]);
const grid = (await figma.getLocalGridStylesAsync()).map(s => [s.name, s.layoutGrids.map(g => [g.pattern, g.alignment || null, g.count || null, g.gutterSize || null, g.offset || null, g.sectionSize || null])]);
const paint = (await figma.getLocalPaintStylesAsync()).map(s => [s.name, s.paints.map(p => p.type === 'SOLID' ? hex(p.color) + (p.opacity !== undefined && p.opacity < 1 ? '@' + p.opacity.toFixed(2) : '') : p.type + (p.gradientStops ? ':' + p.gradientStops.map(g => hex(g.color) + '@' + g.position.toFixed(2)).join(',') : ''))]);
return { text, effect, grid, paint };

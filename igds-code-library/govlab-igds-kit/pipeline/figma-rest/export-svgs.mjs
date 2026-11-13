#!/usr/bin/env node
// Exports SVG geometry from Figma (REST /v1/images format=svg) for:
//   icons  : every icon component in the DS (Icons page sets' variants + standalone icon components) -> spec/icons/<id>.svg
//   shapes : every VECTOR / BOOLEAN_OPERATION / STAR / POLYGON node walked in the specs (by nid)       -> spec/shapes/<nid>.svg
// Byte-exact downloads (sha256 in spec/icons/INDEX.json, spec/shapes/INDEX.json). Resumable (existing files skipped).
// Usage: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=../corp-ca.pem node pipeline/figma-rest/export-svgs.mjs [icons|shapes|all]
import fs from 'node:fs';
import path from 'node:path';
import { KIT, FILE_KEY, get, cachedGet, sha } from './client.mjs';

const what = process.argv[2] || 'all';
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const master = rd(path.join(KIT, 'master-list.json'));

async function exportSvgs(ids, dir, label) {
  fs.mkdirSync(dir, { recursive: true });
  const idxFile = path.join(dir, 'INDEX.json'); const index = fs.existsSync(idxFile) ? rd(idxFile) : {};
  const todo = ids.filter((id) => !fs.existsSync(path.join(dir, id.replace(/:/g, '-') + '.svg')));
  let done = 0, failed = [];
  const B = Number(process.env.SVG_BATCH || 50);
  for (let i = 0; i < todo.length; i += B) {
    const batch = todo.slice(i, i + B);
    let j;
    try { j = JSON.parse((await get(`/v1/images/${FILE_KEY}?ids=${encodeURIComponent(batch.join(','))}&format=svg&svg_include_id=false&svg_simplify_stroke=true&use_absolute_bounds=true`)).toString('utf8')); }
    catch (e) { failed.push(...batch.map((id) => ({ id, error: e.message.slice(0, 120) }))); continue; }
    for (const id of batch) {
      const url = j.images && j.images[id];
      if (!url) { failed.push({ id, error: 'no render (empty or invisible node)' }); continue; }
      if (!/^https:\/\/[a-z0-9.-]+\.(amazonaws\.com|figma\.com)\//.test(url)) { failed.push({ id, error: 'unexpected host' }); continue; }
      const r = await fetch(url); if (!r.ok) { failed.push({ id, error: 'HTTP ' + r.status }); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(dir, id.replace(/:/g, '-') + '.svg'), buf); index[id] = { sha256: sha(buf), bytes: buf.length }; done++;
    }
    process.stdout.write(`${label}: ${Math.min(i + 50, todo.length)}/${todo.length}\n`);
    fs.writeFileSync(idxFile, JSON.stringify(index, null, 1) + '\n');
  }
  fs.writeFileSync(idxFile, JSON.stringify(index, null, 1) + '\n');
  return { requested: ids.length, alreadyHad: ids.length - todo.length, exported: done, failed };
}

const report = {};
if (what === 'icons' || what === 'all') {
  // icon component ids: standalone icon components + the variant children of every icon set (REST nodes depth=1, cached)
  const sets = master.rows.filter((r) => r.kind === 'icon-set').map((r) => r.id);
  const comps = master.rows.filter((r) => r.kind === 'icon-component').map((r) => r.id);
  const ids = new Set(comps);
  for (let i = 0; i < sets.length; i += 25) {
    const batch = sets.slice(i, i + 25);
    const res = await cachedGet(`iconsets-${i}.json`, `/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(batch.join(','))}&depth=1`);
    for (const id of batch) for (const ch of res.json.nodes[id]?.document?.children || []) if (ch.type === 'COMPONENT') ids.add(ch.id);
  }
  // plus every icon variant actually used by an instance in the specs (may live outside the Icons page, e.g. .Atoms)
  for (const f of fs.readdirSync(path.join(KIT, 'spec/sets'))) { const t = fs.readFileSync(path.join(KIT, 'spec/sets', f), 'utf8'); for (const m of t.matchAll(/"mcid": "([^"]+)"/g)) ids.add(m[1]); }
  // plus every component referenced by an INSTANCE_SWAP property (definition defaults and instance values), e.g. 140:42
  for (const d of ['spec/raw-defs', 'spec/raw-defs-full']) for (const f of fs.existsSync(path.join(KIT, d)) ? fs.readdirSync(path.join(KIT, d)) : []) for (const props of Object.values(rd(path.join(KIT, d, f)).defs)) for (const p of Object.values(props)) if (p.t === 'INSTANCE_SWAP' && typeof p.d === 'string') ids.add(p.d);
  for (const f of fs.readdirSync(path.join(KIT, 'spec/sets'))) { const walk = (n) => { if (n.cp) for (const v of Object.values(n.cp)) if (typeof v === 'string' && /^\d+:\d+$/.test(v)) ids.add(v); (n.c || []).forEach(walk); }; for (const v of rd(path.join(KIT, 'spec/sets', f)).variants) if (v.tree) walk(v.tree); }
  report.icons = await exportSvgs([...ids].sort(), path.join(KIT, 'spec/icons'), 'icons');
}
if (what === 'shapes' || what === 'all') {
  const ids = new Set();
  for (const f of fs.readdirSync(path.join(KIT, 'spec/sets'))) {
    // + instances of components whose definition is not available here (remote library sets REST returns empty, or not
    //   extracted): the instance itself is exported as SVG and shown statically (gap recorded by the generator)
    const usable = (id) => { const p = path.join(KIT, 'spec/sets', id.replace(/:/g, '-') + '.json'); return id === '81:1195' || (fs.existsSync(p) && rd(p).variants.some((v) => v.tree)); };
    const iconIds = new Set(master.rows.filter((r) => r.kind === 'icon-set' || r.kind === 'icon-component').map((r) => r.id));
    const walk = (n) => { if ((['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'REGULAR_POLYGON'].includes(n.t) || (n.t === 'INSTANCE' && n.inst && !iconIds.has(n.inst.setId) && !usable(n.inst.setId))) && n.nid) ids.add(n.nid); (n.c || []).forEach(walk); };
    for (const v of rd(path.join(KIT, 'spec/sets', f)).variants) if (v.tree) walk(v.tree);
  }
  report.shapes = await exportSvgs([...ids].sort(), path.join(KIT, 'spec/shapes'), 'shapes');
}
fs.writeFileSync(path.join(KIT, 'spec/SVG-EXPORT-REPORT.json'), JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, r]) => [k, { requested: r.requested, alreadyHad: r.alreadyHad, exported: r.exported, failed: r.failed.length }]))));

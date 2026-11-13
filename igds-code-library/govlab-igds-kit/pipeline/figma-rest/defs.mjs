// Component property definitions (the only component data REST does not return), captured through MCP:
//   spec/raw-defs/*.json       {defs:{setId:{name:{t,d,o?,pv?}}}}   names without "#id" (extract-defs.figma.js)
//   spec/raw-defs-full/*.json  {defs:{setId:{"name#id":{t,d}}}}     full keys, for sets whose names collide + orphans
// One rule for every source (REST converter and normalizer): an instance property value equal to its definition
// default is dropped (VARIANT values are always kept). With colliding names (e.g. "Icon" BOOLEAN and "Icon"
// INSTANCE_SWAP) the value is matched against every definition of that name; a full "name#id" key matches only its own.
import fs from 'node:fs';
import path from 'node:path';
export function loadDefs(KIT) {
  const byName = {}, list = {};
  const read = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).defs) : []);
  for (const d of read(path.join(KIT, 'spec/raw-defs'))) for (const [id, props] of Object.entries(d)) { byName[id] = props; list[id] = Object.entries(props).map(([n, x]) => ({ name: n, key: n, ...x })); }
  for (const d of read(path.join(KIT, 'spec/raw-defs-full'))) for (const [id, props] of Object.entries(d)) list[id] = Object.entries(props).map(([k, x]) => ({ name: k.split('#')[0], key: k, ...x }));
  return { byName, list };
}
export const isDefault = (defsList, setId, key, value) => {
  const L = defsList[setId]; if (!L) return null; // null = definitions unknown
  const name = key.split('#')[0];
  return L.some((d) => d.t !== 'VARIANT' && (key.includes('#') ? d.key === key : d.name === name) && JSON.stringify(d.d) === JSON.stringify(value));
};

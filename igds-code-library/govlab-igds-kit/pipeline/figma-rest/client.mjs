// Figma REST client (read-only GET only). Token comes ONLY from the FIGMA_TOKEN environment variable;
// it is never logged, written to disk, or placed in a URL. Responses are cached byte-exact under spec/rest-cache/
// (provenance: the converter records the sha256 of the exact response it read).
// Corporate network: run with NODE_USE_ENV_PROXY=1 and NODE_EXTRA_CA_CERTS=<repo>/corp-ca.pem (TLS stays verified).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FILE_KEY = 'FXkIGvCtnuZZDrMjiSm29r';
export const CACHE = path.join(KIT, 'spec/rest-cache');
export const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function token() {
  const t = process.env.FIGMA_TOKEN;
  if (!t) throw new Error('FIGMA_TOKEN is not set in this process environment (see plan v3 §3.4).');
  return t;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// GET with retry on 429/5xx (honours Retry-After). Never follows non-api hosts.
export async function get(apiPath, { retries = 6 } = {}) {
  if (!apiPath.startsWith('/v1/')) throw new Error('only /v1/ paths');
  let wait = 2000;
  for (let i = 0; ; i++) {
    let r;
    try { r = await fetch('https://api.figma.com' + apiPath, { headers: { 'X-Figma-Token': token() } }); }
    catch (e) { if (i >= retries) throw new Error(`network error on ${apiPath}: ${e.cause?.code || e.message}`); await sleep(wait); wait *= 2; continue; }
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if ((r.status === 429 || r.status >= 500) && i < retries) { const ra = Number(r.headers.get('retry-after')); await sleep(ra ? ra * 1000 : wait); wait *= 2; continue; }
    const body = (await r.text()).slice(0, 200);
    throw new Error(`HTTP ${r.status} on ${apiPath}: ${body}`);
  }
}

// cached GET: returns {buf, json, sha256, cached}
export async function cachedGet(name, apiPath, { refresh = false } = {}) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, name);
  let buf, cached = false;
  if (!refresh && fs.existsSync(f)) { buf = fs.readFileSync(f); cached = true; }
  else { buf = await get(apiPath); fs.writeFileSync(f, buf); fs.writeFileSync(f + '.meta.json', JSON.stringify({ apiPath, fetchedAt: new Date().toISOString(), sha256: sha(buf) }, null, 1)); }
  return { buf, json: JSON.parse(buf.toString('utf8')), sha256: sha(buf), cached, file: f };
}

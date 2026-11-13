#!/usr/bin/env node
/**
 * igds-registry / refresh.mjs — the single command after any @igds/* upgrade (npm run igds:refresh).
 *
 *   1. keep the previous generation (for the diff)
 *   2. extract components (code)          build-registry.mjs
 *   3. extract tokens (code)              build-tokens.mjs
 *   4. verify at runtime (real browser)   verify-runtime.mjs      (--skip-runtime to skip; then marked NOT verified)
 *   5. map to Figma (existing snapshot)   build-figma-mapping.mjs
 *   6. render AI catalogs                 build-ai-docs.mjs
 *   7. quality-gate self-tests            tests/run-tests.mjs
 *   8. diff vs previous generation        diff-registry.mjs → registry-changes.md
 * Stops at the first failing step (exit 1). Breaking API changes → exit 3 after everything is written.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.resolve(__dirname, '..');
const skipRuntime = process.argv.includes('--skip-runtime');
const prevDir = path.join(R, '.previous');

fs.mkdirSync(prevDir, { recursive: true });
for (const f of ['components.generated.json', 'tokens.generated.json']) if (fs.existsSync(path.join(R, f))) fs.copyFileSync(path.join(R, f), path.join(prevDir, f));

const steps = [
  ['extract components', 'scripts/build-registry.mjs'],
  ['extract tokens', 'scripts/build-tokens.mjs'],
  ...(skipRuntime ? [] : [['runtime verification', 'scripts/verify-runtime.mjs']]),
  ['figma mapping', 'scripts/build-figma-mapping.mjs'],
  ['AI catalogs', 'scripts/build-ai-docs.mjs'],
  ['quality-gate self-tests', 'tests/run-tests.mjs'],
];
if (skipRuntime && fs.existsSync(path.join(R, 'runtime-verification.generated.json'))) fs.renameSync(path.join(R, 'runtime-verification.generated.json'), path.join(prevDir, 'runtime-verification.generated.json'));
const t0 = Date.now();
for (const [name, script] of steps) {
  process.stdout.write(`\n── ${name} ──\n`);
  const r = spawnSync(process.execPath, [path.join(R, script)], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\n✖ refresh stopped: "${name}" failed (exit ${r.status}). Nothing downstream was regenerated.`); process.exit(1); }
}
process.stdout.write('\n── diff vs previous generation ──\n');
const d = spawnSync(process.execPath, [path.join(R, 'scripts/diff-registry.mjs'), prevDir, R, path.join(R, 'registry-changes.md')], { stdio: 'inherit' });
console.log(`\n✔ refresh complete in ${((Date.now() - t0) / 1000).toFixed(0)}s${skipRuntime ? ' — RUNTIME NOT VERIFIED (--skip-runtime)' : ''}. See igds-registry/registry-changes.md`);
if (d.status === 3) { console.log('⚠ breaking API changes detected — run `npm run igds:lint` on consuming projects.'); process.exitCode = 3; }

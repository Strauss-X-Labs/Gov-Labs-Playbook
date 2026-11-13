#!/usr/bin/env node
// Self-tests for the quality gate: every EXPECT line in bad.html must be reported with that code,
// and good.html must be completely clean. Fails loudly if the linter regresses.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const lint = path.join(here, '..', 'scripts', 'lint-igds.mjs');
const run = (f) => { try { return JSON.parse(execFileSync(process.execPath, [lint, f, '--json'], { encoding: 'utf8' })); } catch (e) { return JSON.parse(e.stdout); } };
let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) failed++; };

const badFile = path.join(here, 'fixtures', 'bad.html');
const bad = run(badFile);
const lines = fs.readFileSync(badFile, 'utf8').split('\n');
lines.forEach((l, i) => {
  const m = l.match(/EXPECT ([A-Z-]+)/);
  if (!m) return;
  const hit = bad.findings.some((f) => f.line === i + 1 && f.code === m[1]);
  ok(hit, `bad.html:${i + 1} reports ${m[1]}`);
});
const expected = lines.filter((l) => /EXPECT [A-Z]/.test(l)).length;
ok(bad.findings.length === expected, `bad.html has no unexpected findings (${bad.findings.length} reported, ${expected} expected)`);

const good = run(path.join(here, 'fixtures', 'good.html'));
ok(good.errors === 0 && good.warnings === 0, `good.html is clean (${good.errors} errors, ${good.warnings} warnings)${good.findings.length ? ': ' + JSON.stringify(good.findings) : ''}`);
console.log(failed ? `\n${failed} test(s) FAILED` : '\nall lint self-tests passed');
process.exitCode = failed ? 1 : 0;

// The central rules file's own examples must pass the gate (documentation must not teach broken code).
const rules = run(path.join(here, '..', 'ai', 'IGDS-RULES.md'));
ok(rules.errors === 0, `IGDS-RULES.md code examples pass the lint (${rules.errors} errors)${rules.errors ? ': ' + JSON.stringify(rules.findings.filter((f) => f.level === 'error')) : ''}`);
process.exitCode = failed ? 1 : 0;

// Reference examples must stay valid against every new library version.
const ex = run(path.join(here, '..', 'examples'));
ok(ex.errors === 0 && ex.warnings === 0, `examples/ pass the lint (${ex.errors} errors, ${ex.warnings} warnings)`);
process.exitCode = failed ? 1 : 0;

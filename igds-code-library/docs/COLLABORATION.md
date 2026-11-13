# Claude Code × Codex — collaboration and mutual review (IGDS)

## Branches
| Branch | Purpose | Who writes |
|---|---|---|
| `feature/igds-code-library` | IGDS base branch (integration). Changes arrive **only** through PRs | nobody pushes directly |
| `claude/igds-<task>` | Claude Code working branch, created from `feature/igds-code-library` | Claude Code |
| `codex/igds-<task>` | Codex working branch, created from `feature/igds-code-library` | Codex |
| `main` | Playbook. **Never** a PR target for IGDS work branches; never pushed | — |

- `<task>`: short kebab-case topic, e.g. `claude/igds-l1-text-wrap`, `codex/igds-behaviour-focus`.
- Start: `git fetch origin && git checkout -b <agent>/igds-<task> origin/feature/igds-code-library`.
- Keep branches short-lived; rebase/merge `origin/feature/igds-code-library` before opening the PR.
- **PR target: `feature/igds-code-library`** (never `main`). No force push. No deleting other branches.
- An agent never changes files outside `igds-code-library/`.
- Ask the human before every commit (playbook rule), showing which files changed and what in each.

## PR description template (copy into every PR)
```markdown
## What changed and why
<one paragraph: the problem (with root-cause node / evidence), the change in the generator/runtime/verifier>

## Files changed
- <path> — <what changed>

## Checks run (commands, from igds-code-library/govlab-igds-kit/)
- [ ] node pipeline/normalize-spec.mjs --check
- [ ] node pipeline/generate/gen-all.mjs   (counts + gaps printed)
- [ ] node verify/l1-gen.mjs   /   node verify/l1-tree.mjs 81:1195 igdsx-button
- [ ] node verify/behavior-gen.mjs   /   node verify/behavior-button.mjs
- [ ] node pipeline/package.mjs  &&  node verify/self-contained.mjs <empty-temp-dir>
- [ ] node pipeline/build-master-list.mjs
- [ ] (root) npm run igds:test  ·  npm run igds:lint -- <changed html/js>
Platform: <Windows+Edge | Linux+Chromium>

## Verification results (before → after)
| Metric | Before | After |
|---|---|---|
| Components / variants | | |
| L1 variant×theme pass | | |
| Fully verified components | | |
| Behaviour (applicable) | | |
| axe clean runs | | |
| Self-contained test | | |

## Known gaps / limitations
<what is still failing or not covered, and why; anything that needs a design decision>
```

## Mutual review
- A PR opened by Claude Code is reviewed by Codex; a PR opened by Codex is reviewed by Claude Code.
- The reviewer re-runs the checks on its own environment, confirms the before/after table, and checks the binding
  rules in [../AGENTS.md](../AGENTS.md): no invented values, no threshold/tolerance changes, no hand-edited
  generated files, Figma data only, RTL preserved, tokens preserved, nothing outside `igds-code-library/` changed.
- Review outcome is written as a PR comment: `APPROVE-TECHNICAL` or `CHANGES-REQUESTED` with the failing evidence.
- **Merge gate:** reviewer agent approval + all checks run + **a human approval**. No regression allowed in:
  fully verified components (currently 142), L1 pass rows (4,994/6,762), applicable behaviour checks, axe clean
  runs, self-contained test. A regression blocks the merge even if other numbers improve.

## Reference results (baseline at branch creation, Windows + Edge)
290 components (289 generic + igdsx-button) · 3,381 Figma variants · L1 4,994/6,762 variant×theme rows ·
142 components fully verified · behaviour 204/218 (9 not applicable) · axe 448/578 clean (generic) and 106/112
(igdsx-button) · self-contained OK · registry runtime 73/73 · lint self-tests pass.
Linux + Chromium runs may differ slightly in text metrics: compare like with like and report the platform.

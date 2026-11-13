# AGENTS.md — IGDS project

Instructions for any AI coding agent (Cursor, Codex, Copilot, Claude Code, Kiro, …).

## Scope inside the Gov-Labs-Playbook repository (read first)
- This folder (`igds-code-library/`) is a **separate code project** living in the playbook repository on branch
  `feature/igds-code-library` by explicit instruction. Decision record and the documented deviations from the
  playbook contribution rules: [PLAYBOOK-INTEGRATION.md](PLAYBOOK-INTEGRATION.md).
- These instructions apply to every file **inside** `igds-code-library/`. The playbook instructions at the repository
  root (`../AGENTS.md`, `../CLAUDE.md` → `.kiro/steering/תורמים.md` → `איך-תורמים.md`) govern the playbook content.
- **Never modify anything outside `igds-code-library/`** while working on IGDS (no playbook file, no root config,
  no `.github/`, no skills). Playbook work never modifies `igds-code-library/`.
- The playbook **submission rules apply here too, unchanged**: never push to `main`; every change goes through a
  branch and a PR; an agent shows what changed (files + what in each) and **asks before every commit**; human review
  before merge. IGDS-specific branch/PR/cross-review protocol: [docs/COLLABORATION.md](docs/COLLABORATION.md).
- Run all commands from `igds-code-library/` (paths below are relative to it).

1. Binding rules: `igds-registry/ai/IGDS-RULES.md` — read it first.
2. Components catalog (generated from code): `igds-registry/ai/IGDS-COMPONENTS.md`.
3. Tokens catalog (generated from `@igds/tokens`): `igds-registry/ai/IGDS-TOKENS.md`.
4. Use only official `igds-*` elements and `--igds-*` tokens listed there. Never invent tags, attributes, variant values, slots, events or token names.
5. No suitable official component → write an `IGDS-GAP` report (format in the rules file) and stop.
6. Validate before finishing: `npm run igds:lint -- <path>`.
7. Library upgraded → `npm run igds:refresh` (never edit generated files by hand).

---

# Developing the code library (`govlab-igds-kit/`) — instructions for Codex and other agents

Goal: a complete, self-contained, Figma-faithful code library of the whole IGDS design system (Figma file
`FXkIGvCtnuZZDrMjiSm29r`), usable without Figma access. Plan: `igds-registry/PLAN-IGDS-CODE-LIBRARY-v3.md`.
Current state and open gaps: `govlab-igds-kit/PILOT-STATUS.md` (newest section first) and
`govlab-igds-kit/MASTER-STATUS.md` (generated; summary line = components / variants / L1 / fully verified).
Read both before changing anything.

## Binding rules (decided by the project owner — not negotiable)
1. **Figma is the design truth.** Every visual value comes from the normalized Figma specs (`spec/sets/*.json`).
   Never invent a value, state, variant, component, attribute, token, icon or behaviour. If Figma has no data,
   record a gap (catalog `gaps`, PILOT-STATUS) — do not approximate silently.
2. **Contradictions / duplicates in Figma** (e.g. duplicate variant names): keep all original data, document it
   (`spec/NORMALIZE-REPORT.json` → `figmaDataIssues`), never pick a design answer yourself.
3. **Never modify** `@igds/*` packages, the vendored copies under `dist/vendor/` (hash-checked by `INTEGRITY.json`),
   the official design-system colours, or anything under `sketches/`, `design.md`, `styles.css`, `index.html`.
4. **Never weaken verification** to get better numbers: no tolerance/threshold changes, no skipped checks, no
   edited results. A failure is reported as a failure. L2 (pixel diff) is diagnostic only — see "Verification".
5. **Never edit generated files by hand** (`src/gen/**`, `src/ext/igdsx-button/**` output, `src/tokens/igdsx-*.css`,
   `dist/**`, `MASTER-STATUS.md`, `master-list.json`, `spec/sets/**`, `igds-registry/*.generated.*`,
   `igds-registry/ai/IGDS-COMPONENTS.md|IGDS-TOKENS.md`). Change the generator/script, then regenerate.
6. **Secrets only from the environment**: `NPM_TOKEN` (private `@igds` registry), `FIGMA_TOKEN` (only for
   re-extraction). Never print, log or commit them. No new external services.
7. Accessibility gaps that come from Figma (e.g. contrast of Danger in dark mode, icon-only buttons without an
   accessible name in Figma) are recorded as design-source gaps — do not change colours or invent labels.

## Architecture (data flow)
```
Figma ──(REST, FIGMA_TOKEN)──> spec/rest-cache/        raw responses (NOT in git, 176 MB, regenerable)
      ──(MCP, read-only)────> spec/raw/, spec/raw-defs*/, spec/raw-varnames/   byte-exact captures (in git)
spec/rest-cache ─ pipeline/figma-rest/extract-all.mjs ─> spec/raw/rest-*.json (v5 records, same format as MCP)
spec/raw* ─ pipeline/normalize-spec.mjs ─> spec/sets/<setId>.json (one normalized spec per Figma set; 0 conflicts)
spec/raw* ─ pipeline/figma-rest/export-svgs.mjs ─> spec/icons/*.svg, spec/shapes/*.svg (Figma SVG geometry)
master-list.json / MASTER-STATUS.md ─ pipeline/build-master-list.mjs (inventory 351 items, coverage, verification)
spec/sets ─ pipeline/generate/gen-all.mjs ─> src/gen/components/<tag>.js + src/gen/catalog.json + src/tokens/igdsx-gen-tokens.css
spec/sets/81-1195 ─ pipeline/generate/gen-button.mjs ─> src/ext/igdsx-button/ (dedicated Button, verified separately)
src/gen/_runtime.js   one runtime class renders every generated component from its Figma data
src/** + node_modules/@igds ─ pipeline/package.mjs ─> dist/ (self-contained: igds-kit.js, igds-kit.css, catalog.json, README, vendor/)
```
Generated-component contract (details in `src/gen/_runtime.js` header and `dist/catalog.json → generatedFromFigma`):
variant property → attribute (slug of the Figma option) · State → real interaction (hover/press/keyboard focus/
`disabled`) or `state="<slug>"` · RTL → `dir` · TEXT property → attribute or slot · BOOLEAN → `"true"`/`"false"` ·
INSTANCE_SWAP → slot. Combinations Figma does not have → console.warn, nearest Figma variant (never a mix).

## Environment setup
- Node 24 (developed with 24.19). From `igds-code-library/`: `npm ci` (needs `NPM_TOKEN` for `@igds/*` from the
  private GitLab registry, see `.npmrc`), then `cd govlab-igds-kit && npm ci`.
  Cloud agents / Linux: run `bash igds-code-library/scripts/codex-setup.sh` (does all of the above + Chromium +
  a determinism smoke test). Secrets: `NPM_TOKEN` as an environment secret only.
- Browser for the verifiers (`verify/lib/browser.mjs`): Windows → installed Edge (default). Linux/CI →
  `npx playwright-core install --with-deps chromium` once (bundled Chromium is used automatically).
  Overrides: `IGDS_BROWSER_CHANNEL=chrome|msedge|chromium`, `IGDS_BROWSER_PATH=<executable>`.
  `igds-registry/scripts/verify-runtime.mjs` uses `IGDS_BROWSER=<executable>` (on Linux, point it at the Chromium
  installed by Playwright or a system chromium).
- No Figma access is needed to generate, package or verify. Re-extraction only: `FIGMA_TOKEN` in the environment.
  (The corporate proxy/CA settings in PILOT-STATUS apply only to the original Windows workstation.)
- Reference results were produced on Windows + Edge. Text metrics can differ slightly on Linux/Chromium: compare
  runs on the same platform, and report platform differences instead of "fixing" them in the generator.

## Commands (run from `govlab-igds-kit/`, in this order)
1. `node pipeline/normalize-spec.mjs --check` — specs consistent with raw captures (exit 0 = unchanged).
2. `node pipeline/generate/gen-all.mjs` — regenerate all generic components (deterministic; prints counts + gaps).
   `node pipeline/generate/gen-button.mjs` — regenerate igdsx-button (only if its generator/spec changed).
3. `node verify/l1-gen.mjs [--only tag,tag]` — L1 for generic components (light + dark; updates `verify/ledger.json`
   only on full runs). `node verify/l1-tree.mjs 81:1195 igdsx-button` — L1 for the Button.
4. `node verify/behavior-gen.mjs` — real-interaction state checks + axe (generic); `node verify/behavior-button.mjs`.
5. `node pipeline/package.mjs` — rebuild `dist/`.
6. `node verify/self-contained.mjs <empty-temp-dir>` — copies dist/ to an empty folder; must print `"ok": true`.
7. `node pipeline/build-master-list.mjs` — refresh `MASTER-STATUS.md` / `master-list.json` from the ledger.
8. Root checks: `npm run igds:lint -- <path>` for any HTML/JS you write; `npm run igds:verify` after registry changes.
Re-extraction from Figma (only when Figma changed; needs `FIGMA_TOKEN`): `node pipeline/figma-rest/extract-all.mjs`,
`node pipeline/figma-rest/export-svgs.mjs all`, then steps 1–7. All extractors are resumable (existing files skipped).

## Verification levels (what "fully verified" means)
- **L1** (`verify/l1-gen.mjs`): every Figma node of every variant × theme vs its DOM element (`data-i`): x/y/w/h
  (±0.5 px), background, text colour/size/weight/line-height. The only documented allowance is R-TEXT-CEIL (Figma
  rounds hugging text up to a whole pixel; measured, bounded per node). Do not add others.
- **Behaviour** (`verify/behavior-gen.mjs`): real hover / press / Tab / `disabled` must select the Figma state;
  "not-applicable" only where Figma has no such variant for the combination.
- **Accessibility**: axe WCAG 2.x A/AA, light + dark, 0 violations.
- **L2** (`verify/l2-pixel.mjs`, `verify/lib/pixel-metric.mjs`): pixel diff vs Figma PNG — DIAGNOSTIC ONLY. Its
  calibration (`verify/out/81-1195.igdsx-button.l2-calibration.json`) shows Figma vs browser glyph rasterisation
  overlaps real defects; it does not decide pass/fail and its thresholds must not be tuned to pass.
- **Fully verified** = L1 100% + all applicable behaviour checks + axe clean. `MASTER-STATUS.md` counts it.

## How to work on a failure
Find the root-cause node (deepest failing node, not the cascading parents), fix the **generator or runtime** so the
code follows the Figma data, regenerate, re-run L1 for the affected tags (`--only`), then the full chain above.
Record every new rule in the generator header and every remaining gap in `PILOT-STATUS.md` (new dated section).

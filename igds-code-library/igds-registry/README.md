# IGDS Registry

An organization-level, tool-neutral source of truth that lets AI coding tools (Claude Code, Kiro, Cursor, …)
use the **official** Israeli Government Design System correctly — without inventing components, attributes,
variants or tokens. Built automatically from the installed packages; no per-component manual work.

## Layers (never mixed)

| layer | files | source | how it is produced |
|---|---|---|---|
| Code facts — components | `components.generated.json`, `extraction-report.md` | `@igds/core-web` (.js + .d.ts) | `scripts/build-registry.mjs` (TypeScript Compiler API) |
| Code facts — tokens | `tokens.generated.json` | `@igds/tokens` CSS + component styles | `scripts/build-tokens.mjs` |
| Runtime facts | `runtime-verification.generated.json` | official browser bundle in headless Chromium | `scripts/verify-runtime.mjs` |
| Figma facts | `figma/snapshot/*.json` | canonical Figma file via Figma MCP | agent procedure — `figma/README.md` |
| Human decisions | `figma/figma-mapping.overrides.json` | reviewers | PR |
| Derived conclusions | `figma/figma-mapping.generated.json`, `figma/figma-gaps.generated.md` | the layers above | `scripts/build-figma-mapping.mjs` |
| AI guidance | `ai/IGDS-RULES.md` (hand-written) · `ai/IGDS-COMPONENTS.md`, `ai/IGDS-TOKENS.md` (generated) | all of the above | `scripts/build-ai-docs.mjs` |
| Change log | `registry-changes.md` | previous vs current generation | `scripts/diff-registry.mjs` |

Each field carries its own verification status (`verified-*`, `derived-*`, `heuristic`, `partial-*`, `not-checked`).

## Commands

| command | does |
|---|---|
| `npm run igds:refresh` | everything below, in order, + diff. Run after every `@igds/*` upgrade. Exit 3 = breaking API change. |
| `npm run igds:lint -- <paths>` | quality gate for UI code (HTML, JS/TS template literals, CSS, Markdown code blocks). Exit 1 on errors. |
| `npm run igds:verify` | runtime verification only |
| `npm run igds:figma` | re-map after a Figma snapshot refresh |
| `npm run igds:test` | self-tests of the quality gate |

## AI tool adapters (thin — they only point at `ai/`)

| tool | file |
|---|---|
| Claude Code | `CLAUDE.md` |
| Kiro | `.kiro/steering/igds.md` (always) · `.kiro/steering/igds-catalogs.md` (UI files) |
| Cursor | `.cursor/rules/igds.mdc` (always) · `.cursor/rules/igds-catalogs.mdc` (UI files) |
| anything else | `AGENTS.md` |

## Using it in another project

The folder is self-contained (Node ≥ 20, `typescript` as a devDependency, no other dependencies).
Copy `igds-registry/` plus the adapter files into the project root, add the `igds:*` scripts from this project's
`package.json`, install `@igds/core-web` + `@igds/tokens`, run `npm run igds:refresh`.
Set `IGDS_PROJECT_ROOT` if `node_modules` is not the parent of `igds-registry/`.
Recommended at org level: one registry repository published as an npm package or Git submodule, regenerated in CI
(`ci/gitlab-ci.example.yml`), consumed by every project.

## Known limits (honest list)

- Events: names are exact; `detail` payloads are raw source expressions, not resolved types. Not runtime-tested (needs interaction).
- Methods: only `focus`/`checkValidity`/`reportValidity` are high-confidence API; other "candidate" methods are heuristic.
- Slots: static scan + those rendered by default at runtime; conditionally rendered slots are static-only.
- Figma: matching is automatic with confidence levels; `needs-review` rows require a human decision in the overrides file.
  The Figma snapshot is refreshed by an agent through the Figma MCP (no REST token in this setup), not by CI.
- Framework wrappers (`@igds/react`, `@igds/angular`) are not installed here and not covered.

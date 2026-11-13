# IGDS project — Claude Code adapter

Scope: this file applies inside `igds-code-library/` of the Gov-Labs-Playbook repository (branch
`feature/igds-code-library`). The repository-root CLAUDE.md governs the playbook content; inside this folder the
IGDS rules below apply, never modify files outside this folder, and the playbook submission rules still apply
(no push to `main`, branch + PR, ask before every commit). Full agent instructions — scope, architecture,
command order, verification rules, collaboration with Codex:

@AGENTS.md

This project builds Israeli-government UIs with the official IGDS library.
The binding rules live in one tool-neutral file shared by every AI tool in the organization:

@igds-registry/ai/IGDS-RULES.md

Before writing or changing any UI, read the generated catalogs (they are regenerated from the installed packages — never edit them by hand):

- Components: `igds-registry/ai/IGDS-COMPONENTS.md`
- Tokens: `igds-registry/ai/IGDS-TOKENS.md`
- Full machine data: `igds-registry/components.generated.json`, `igds-registry/tokens.generated.json`
- Figma ↔ code mapping and gaps: `igds-registry/figma/`

Before finishing any task that touched HTML/JS/CSS, run `npm run igds:lint -- <path>` and fix every error.
After upgrading `@igds/*`, run `npm run igds:refresh`.

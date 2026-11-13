# IGDS code library inside the Gov-Labs-Playbook repository — decision record

> Status: **proposed — awaiting explicit approval of the project owner before the first commit.**
> Prepared 2026-11-13. Nothing outside `igds-code-library/` is changed by this integration.

## Decision
The IGDS code library (Figma-faithful web components of the Israeli Government Design System) is added to the
`Strauss-X-Labs/Gov-Labs-Playbook` repository **on branch `feature/igds-code-library`**, in the folder
`igds-code-library/`, by explicit instruction received by the project owner (work in this repository, separate
branch, no alternative repository). The branch is a regular branch created from the latest `origin/main`
(`c16e1b3`, 2026-11-12) so that a future merge stays possible.

## Deviations from the playbook contribution rules (`איך-תורמים.md`) — documented, not hidden
The playbook rules are **not changed**. The following rules are not met by adding this folder; each is recorded here
so the playbook team can see and decide:

| Playbook rule | What it says (summary) | Why this branch deviates | Mitigation |
|---|---|---|---|
| Rule 13 + "מה לא נכנס לכאן" | Material of a specific venture goes to the venture's repo, not the playbook | Explicit instruction to place IGDS in this repo | Isolated folder, separate branch; playbook work never touches it and IGDS work never touches the playbook; no merge to `main` without team review |
| Rule 4 | No new folders/entities without a team decision | `igds-code-library/` is a new top-level folder | Single folder, nothing else added at the root; merge to `main` = team decision |
| Rule 8 | No names of clients or other programs | The DS belongs to a government body; its name appears in code, specs and docs (it is the subject of the library) | Content is technical source/spec data; reviewers decide before any merge to `main` |
| Rule 11 | No tool names in content | Developer instructions name the agents (Claude Code, Codex) | Applies to playbook content; these are tool-configuration docs ("טבלת תשתית" exception) |

Rules that **do apply unchanged** to IGDS work: `main` is read-only; every change via branch + PR; an agent asks before
every commit (and every additional commit); review before merge by whom the content concerns.

## Agent instruction resolution (no conflicts)
- Codex reads `AGENTS.md` files from the repository root down to the working directory; the nearer file is more
  specific. Inside `igds-code-library/`, [AGENTS.md](AGENTS.md) applies and states its scope and its relation to the
  root playbook instructions.
- Claude Code loads the root `CLAUDE.md` (playbook rules) and, inside this folder, [CLAUDE.md](CLAUDE.md) (which
  imports `AGENTS.md`). Both agree on the submission rules; the IGDS file limits IGDS work to this folder.
- Root configuration (`.claude/`, `.kiro/`, `.agent/`, `.gemini/`, `.mcp.json`, `.gitignore`, `.gitattributes`) is
  untouched. The IGDS folder has its own `.gitignore` (node_modules, Figma REST cache, test artefacts, secrets).
- GitHub reads PR templates only from the repository root, which this branch does not change; the IGDS PR template
  is in [docs/COLLABORATION.md](docs/COLLABORATION.md) and agents copy it into each PR description.

## Organizational material that requires sharing approval
Visible to everyone with access to the repository (and to cloud coding agents connected to it):
- Official IGDS packages vendored in `govlab-igds-kit/dist/vendor/` (`@igds/core-web`, `@igds/icons` declare no
  licence; `@igds/tokens` licence "TBD") and bundled into `dist/igds-kit.js`.
- Data extracted from the IGDS Figma file (`FXkIGvCtnuZZDrMjiSm29r`): normalized specs, SVG geometry, reference PNGs.
- The address of the private `@igds` npm registry (GitLab project, in `.npmrc` / `package-lock.json`); access needs
  `NPM_TOKEN`, which is **never** stored in the repository.
- Names of the government body / DS in docs and data.
No secrets, credentials or personal paths are included (scanned before preparation).

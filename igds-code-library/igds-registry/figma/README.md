# Figma layer

Three layers, never mixed:

| layer | files | written by |
|---|---|---|
| **Figma facts** | `snapshot/*.json` | Figma MCP (`use_figma`, read-only scripts in `capture/`) |
| **Human decisions** | `figma-mapping.overrides.json` | a reviewer (PR) |
| **Derived conclusions** | `figma-mapping.generated.json`, `figma-gaps.generated.md` | `npm run igds:figma` |

Canonical file: `FXkIGvCtnuZZDrMjiSm29r` (Israeli-Government-DS-3.0). Copies of the library are not sources.

## Refreshing the Figma snapshot (agent procedure, ~1 minute)

Figma data comes from the Figma MCP, which is available to AI agents, not to plain Node.
No new MCP server is needed. Ask Claude Code (or any agent with the Figma MCP):

> Refresh the IGDS Figma snapshot following `igds-registry/figma/README.md`.

The agent:
1. `create_session` on `FXkIGvCtnuZZDrMjiSm29r`, loads the `figma-use` skill.
2. Runs `capture/page-counts.figma.js` → if the counts equal `snapshot/pageCounts.json`, stops (nothing changed).
3. Runs `capture/components.figma.js` twice (page ranges noted in the file) → `snapshot/part1.json`, `snapshot/part2.json`;
   `capture/variables.figma.js` → `snapshot/variables.json`. Results are saved **byte-exact**, never retyped.
4. Updates `snapshot/meta.json` (`capturedAt`) and runs `npm run igds:figma`.

If a page is added to the Figma file, extend the page range in `capture/components.figma.js` (the scope is listed in `snapshot/meta.json`).

## Correcting a match

Edit `figma-mapping.overrides.json` only — e.g. confirm that Figma `Icon Button` = code `iconOnly`:

```json
{ "propAliases": { "igds-button": { "Icon Button": "iconOnly" } } }
```

Never add an alias the code does not actually support: that hides a real gap.

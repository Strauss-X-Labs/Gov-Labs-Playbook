#!/usr/bin/env bash
# Environment setup for cloud agents (Codex) / Linux CI — run from the repository root or from igds-code-library/.
# Secrets come ONLY from the environment (Codex: Environment → Secrets): NPM_TOKEN is required for the private
# @igds packages. FIGMA_TOKEN is NOT needed (generation and verification are offline). Nothing is written to disk
# except node_modules and the Playwright browser cache.
set -euo pipefail
cd "$(dirname "$0")/.."                     # -> igds-code-library/

if [ -z "${NPM_TOKEN:-}" ]; then
  echo "ERROR: NPM_TOKEN is not set. Add it as a secret in the agent environment (never in the repository)." >&2
  exit 1
fi

node --version                               # developed with Node 24
npm ci --no-audit --no-fund                  # root: @igds/core-web, @igds/tokens (+ @igds/icons) via .npmrc ${NPM_TOKEN}
(cd govlab-igds-kit && npm ci --no-audit --no-fund)   # esbuild, playwright-core, axe-core, pixelmatch, pngjs

# Browser for the verifiers: Playwright's bundled Chromium (+ OS libraries). verify/lib/browser.mjs picks it on Linux.
(cd govlab-igds-kit && npx --yes playwright-core install --with-deps chromium)

# Registry runtime check (igds-registry/scripts/verify-runtime.mjs) needs an executable path on Linux:
CHROMIUM_PATH="$(cd govlab-igds-kit && node -p "require('playwright-core').chromium.executablePath()")"
echo "Chromium: ${CHROMIUM_PATH}"
echo "For 'npm run igds:verify' use: IGDS_BROWSER=\"${CHROMIUM_PATH}\" npm run igds:verify"

# Smoke test (no network needed): regenerate deterministically and confirm nothing changed in tracked files.
(cd govlab-igds-kit && node pipeline/normalize-spec.mjs --check && node pipeline/generate/gen-all.mjs > /dev/null)
git diff --quiet -- . && echo "setup OK: generators reproduce the committed output" || { echo "WARNING: regeneration changed tracked files (git diff)"; git diff --stat -- . | tail -5; }

# @igds/icons

This package was generated with [Nx](https://nx.dev).

This package contains the complete set of IGDS icon nodes, published as a standalone package.

**Important note**: Starting from version **0.1.29**, icons were moved into a separate package `@igds/icons` from `@igds/core-web`.

## What this package exports

The package exports **icons as strings** (SVG *inner markup*, without the root `<svg>` tag). Each icon is available:

- As a named export from the root entry (`@igds/icons`)
- As a subpath entry (`@igds/icons/<icon-file-name>`)

The build produces ESM modules and TypeScript typings.

## Installation

```bash
pnpm add @igds/icons
```

In this monorepo, it is typically consumed as a workspace dependency.

## Usage

### Import an icon

```ts
import { alertCircleFilled } from '@igds/icons';

<igds-icon node=${alertCircleFilled}>
```

### Import a single icon via subpath

```ts
import { arrowDownFilled } from '@igds/icons/arrow-down-filled';
```

### Use with `@igds/core-web` `igds-icon`

`@igds/core-web` renders icons by injecting the **inner markup** into its own `<svg ...>` wrapper. That’s why this package removes the root `<svg>` tag during optimization.

If you need to render a standalone SVG yourself:

```ts
import { arrowDown } from '@igds/icons';

const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${arrowDown}</svg>`;
```

## Development

### Build

Run in the `packages/icons` directory:

```bash
pnpm build
```

This runs:

- `svg-to-ts-object` (configured by `.svg-to-tsrc`) to generate `generated/icons.ts` with `iconsMap`
- `scripts/split-generated-icons.mjs` to create `lib/`:
  - `lib/<icon-file-name>.js` + `lib/<icon-file-name>.d.ts`
  - `lib/index.js` + `lib/index.d.ts` that re-export all icons

### Publish

```bash
pnpm publish --no-git-checks
```

The registry is configured in `package.json` (`publishConfig`).

## Adding / updating icons

### 1) Prepare an SVG file

- The icon should be a **square** and use `viewBox="0 0 24 24"`.
- All shapes should be **filled**, not stroked.
- Remove unnecessary `fill` attributes (keep the SVG clean and consistent).
- Use **kebab-case** for the filename — it becomes the icon id.
- The icon name must not contain **whitespace** and should not conflict with **JavaScript reserved words**; keep names strictly kebab-case (lowercase letters, digits, and `-`).
  - Reserved words to avoid: `await`, `break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`, `delete`, `do`, `else`, `enum`, `export`, `extends`, `finally`, `for`, `function`, `if`, `implements`, `import`, `in`, `instanceof`, `interface`, `let`, `new`, `package`, `private`, `protected`, `public`, `return`, `static`, `super`, `switch`, `this`, `throw`, `try`, `typeof`, `var`, `void`, `while`, `with`, `yield`, plus `arguments` and `eval`.

### 2) Place the SVG file

Put the SVG into:

`packages/icons/svg/`

### 3) Update the generated icon library

Run:

```bash
pnpm build
```

If an SVG file is deleted from `svg/`, it will be removed from the generated output on the next build.

## Naming conventions (file name → export name)

Icon filenames are kebab-case (e.g. `arrow-down-filled.svg`).

During build, the exported constant name is generated as **camelCase**:

- `arrow-down-filled` → `arrowDownFilled`
- If the resulting name is a JS reserved word, it will be prefixed with `_`

## Project structure

```
packages/icons/
  svg/                     # source SVG files
  generated/               # intermediate output (gitignored)
  lib/                     # published JS + d.ts files (generated)
  scripts/
    split-generated-icons.mjs
  .svg-to-tsrc
  svgo.config.js
```

## SVGO / optimization

The optimization step is configured in `svgo.config.js`. A custom plugin is used to **remove the outer `<svg>` tag** and keep only the inner markup, so consumers can wrap icons into their own `<svg>` element.


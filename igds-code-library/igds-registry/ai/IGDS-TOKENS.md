# IGDS — Design tokens catalog (generated)

> Generated 2026-11-11 from **@igds/tokens 0.1.59**. Do not edit by hand — run `npm run igds:refresh`.

**Rules:** UI colors → `--igds-base-color-*` only (they switch with the theme). Spacing/radius/typography/shadow → the tokens listed below. Never use raw hex/px. Never invent a token name — `npm run igds:lint` rejects unknown `--igds-*` names.

Themes: default `:root` · dark: `:root[data-theme=dark], .igds-dark-theme`.

## Color — ai (3)

| token | light | dark |
|---|---|---|
| `--igds-base-color-ai-back-to-top-button` | rgba(59, 57, 57, 0.6) | rgba(59, 57, 57, 0.7) |
| `--igds-base-color-ai-background` | rgba(59, 57, 57, 0.4) | #56299d |
| `--igds-base-color-ai-background-primary` | #faf7fe | #0c3058 |

## Color — background (47)

| token | light | dark |
|---|---|---|
| `--igds-base-color-background-brand-default` | #0068f5 | #5ca1ff |
| `--igds-base-color-background-brand-hover` | #0057cc | #30639c |
| `--igds-base-color-background-brand-pressed` | #0045a3 | #91bcf8 |
| `--igds-base-color-background-brand-sidebar-pressed` | #b7d6ff | #00347b |
| `--igds-base-color-background-disabled-with-border` | #f0f3f6 | #1b487a |
| `--igds-base-color-background-disabled-with-text` | #e0e8ef | #1a283c |
| `--igds-base-color-background-disabled-without-border` | #ced7e0 | #495a73 |
| `--igds-base-color-background-disabled-without-text` | #ced7e0 | #495a73 |
| `--igds-base-color-background-disabled-without-text-hover` | #8596af | #5c697a |
| `--igds-base-color-background-elevated-pressed` | #f2f6fd | #30639c |
| `--igds-base-color-background-failure-with-border` | #fff5f5 | #851414 |
| `--igds-base-color-background-failure-without-border` | #ffcbcb | #851414 |
| `--igds-base-color-background-failure-without-text` | #eb4a4b | #ff5e5f |
| `--igds-base-color-background-full-screen-default` | #f9fcff | #1a283c |
| `--igds-base-color-background-header-brand-left` | #0c3058 | #070f19 |
| `--igds-base-color-background-header-brand-right` | #0068f5 | #0057cc |
| `--igds-base-color-background-hover-selected` | #91bcf8 | #00347b |
| `--igds-base-color-background-inner-table` | #fafcff | #141e2d |
| `--igds-base-color-background-inverted` | #0c3058 | #ffffff |
| `--igds-base-color-background-inverted-disabled-with-text` | #8596af | = |
| `--igds-base-color-background-inverted-neutral-secondlevel` | #ffffff | #1b487a |
| `--igds-base-color-background-inverted-secondary-button-hover` | #1b487a | #dbecff |
| `--igds-base-color-background-inverted-secondary-button-pressed` | #30639c | #c2dfff |
| `--igds-base-color-background-neutral-badge` | #f2f6fd | #1b487a |
| `--igds-base-color-background-neutral-default` | #ffffff | #141e2d |
| `--igds-base-color-background-neutral-hover` | #f2f6fd | #1a283c |
| `--igds-base-color-background-neutral-secondlevel` | #f2f6fd | #0c3058 |
| `--igds-base-color-background-numeric-badge` | #c93435 | = |
| `--igds-base-color-background-prefiled-input-field` | #ebf3ff | #1b487a |
| `--igds-base-color-background-scroller` | #8091a9 | #6ba3e0 |
| `--igds-base-color-background-scroller-disabled` | #8091a9 | #8596af |
| `--igds-base-color-background-secondary-button-pressed` | #ebf3ff | #30639c |
| `--igds-base-color-background-state-default` | #ffffff | #141e2d |
| `--igds-base-color-background-state-disabled` | #f0f3f6 | #344a69 |
| `--igds-base-color-background-state-focused` | #ffffff | #141e2d |
| `--igds-base-color-background-state-hover` | #f2f6fd | #1b487a |
| `--igds-base-color-background-state-hover-selected` | #c2dfff | #0045a3 |
| `--igds-base-color-background-state-pressed` | #e1eaf4 | #30639c |
| `--igds-base-color-background-state-pressed-selected` | #90c4ff | #0057cc |
| `--igds-base-color-background-state-selected` | #dbecff | #00347b |
| `--igds-base-color-background-success-with-border` | #f5ffef | #347314 |
| `--igds-base-color-background-success-without-border` | #ddffcd | #347314 |
| `--igds-base-color-background-success-without-text` | #7ad94a | #96fb63 |
| `--igds-base-color-background-table-header` | #e1eaf4 | #1b487a |
| `--igds-base-color-background-warning-with-border` | #fff9ec | #a35200 |
| `--igds-base-color-background-warning-without-border` | #ffecc2 | #a35200 |
| `--igds-base-color-background-warning-without-text` | #dda82f | #ffc643 |

## Color — border (13)

| token | light | dark |
|---|---|---|
| `--igds-base-color-border-active` | #0068f5 | #5ca1ff |
| `--igds-base-color-border-brand-default` | #0068f5 | #2e87ff |
| `--igds-base-color-border-brand-hover` | #0045a3 | #30639c |
| `--igds-base-color-border-disabled` | #5c697a | #344a69 |
| `--igds-base-color-border-divider-default` | #b5c7e2 | #6ba3e0 |
| `--igds-base-color-border-divider-inverted` | #ffffff | #0c3058 |
| `--igds-base-color-border-failure` | #a72223 | #ff8283 |
| `--igds-base-color-border-focused` | #0068f5 | #5ca1ff |
| `--igds-base-color-border-spotlighted-element` | #b7d6ff | #0045a3 |
| `--igds-base-color-border-subtle-default` | #5c697a | #6ba3e0 |
| `--igds-base-color-border-subtle-hover` | #323b49 | #6ba3e0 |
| `--igds-base-color-border-success` | #347314 | #7ad94a |
| `--igds-base-color-border-warning` | #a35200 | #e0a162 |

## Color — button (13)

| token | light | dark |
|---|---|---|
| `--igds-base-color-button-background-disabled` | #e0e8ef | #141e2d |
| `--igds-base-color-button-background-primary` | #0068f5 | = |
| `--igds-base-color-button-background-primary-dark` | #0c3058 | = |
| `--igds-base-color-button-background-secondary` | #ffffff | #0068f5 |
| `--igds-base-color-button-border-disabled` | #8091a9 | #b6c0cc |
| `--igds-base-color-button-border-primary` | #0068f5 | #f5f9ff |
| `--igds-base-color-button-border-subtle` | #8091a9 | #6ba3e0 |
| `--igds-base-color-button-link-primary-dark` | #0068f5 | #dbecff |
| `--igds-base-color-button-text-disabled` | #5c697a | #8596af |
| `--igds-base-color-button-text-hover-pressed` | #0045a3 | #f5f9ff |
| `--igds-base-color-button-text-hover-pressed-inverted` | #f5f9ff | #0045a3 |
| `--igds-base-color-button-text-primary` | #f5f9ff | = |
| `--igds-base-color-button-text-secondary` | #0068f5 | #f5f9ff |

## Color — illustration (6)

| token | light | dark |
|---|---|---|
| `--igds-base-color-illustration-fill-accent` | #ff8497 | #f05e81 |
| `--igds-base-color-illustration-fill-backdrop` | #ebf3ff | #00347b |
| `--igds-base-color-illustration-fill-surface` | #ffffff | #0c3058 |
| `--igds-base-color-illustration-stroke-primary` | #002352 | #91bcf8 |
| `--igds-base-color-illustration-stroke-secondary` | #0068f5 | #2e87ff |
| `--igds-base-color-illustration-stroke-tertiary` | #8adaf4 | #38b1f8 |

## Color — overlay (2)

| token | light | dark |
|---|---|---|
| `--igds-base-color-overlay-back-to-top-button` | rgba(59, 57, 57, 0.6) | = |
| `--igds-base-color-overlay-default` | rgba(59, 57, 57, 0.7) | = |

## Color — text (22)

| token | light | dark |
|---|---|---|
| `--igds-base-color-text-dark-success` | #347314 | #c6ffaa |
| `--igds-base-color-text-dark-warning` | #8a6000 | #ffd36d |
| `--igds-base-color-text-disabled` | #5c697a | #8596af |
| `--igds-base-color-text-failure` | #a72223 | #ffa6a7 |
| `--igds-base-color-text-inverted-disabled` | #8596af | = |
| `--igds-base-color-text-inverted-disabled-with-background` | #f0f3f6 | #5c697a |
| `--igds-base-color-text-link-primary-default` | #0068f5 | #5ca1ff |
| `--igds-base-color-text-link-primary-hover` | #0045a3 | #91bcf8 |
| `--igds-base-color-text-link-primary-pressed` | #0045a3 | #91bcf8 |
| `--igds-base-color-text-link-secondary-default` | #0068f5 | #5ca1ff |
| `--igds-base-color-text-link-secondary-hover` | #0045a3 | #91bcf8 |
| `--igds-base-color-text-link-tertiary-default` | #0c3058 | #d7e8ff |
| `--igds-base-color-text-link-tertiary-hover` | #0045a3 | #91bcf8 |
| `--igds-base-color-text-placeholder` | #466186 | = |
| `--igds-base-color-text-subtle-inverted` | #ffffff | #0c3058 |
| `--igds-base-color-text-subtle-primary` | #0c3058 | #f5f9ff |
| `--igds-base-color-text-subtle-primary-inverted` | #f5f9ff | = |
| `--igds-base-color-text-subtle-secondary` | #466186 | #99c2fb |
| `--igds-base-color-text-success` | #347314 | #c6ffaa |
| `--igds-base-color-text-warning` | #a35200 | #ffd36d |
| `--igds-base-color-text-warning-icon` | #cc6600 | #ffc643 |
| `--igds-base-color-text-warning-text` | #a35200 | #ffd36d |

## Typography (semantic) (11)

| token | value |
|---|---|
| `--igds-base-type-badge` | 400 12px "Rubik", sans-serif |
| `--igds-base-type-body-medium` | 500 16px "Rubik", sans-serif |
| `--igds-base-type-body-regular` | 400 16px/1.25 "Rubik", sans-serif |
| `--igds-base-type-display-hero` | 800 64px "Rubik", sans-serif |
| `--igds-base-type-display-page` | 700 48px "Rubik", sans-serif |
| `--igds-base-type-label` | 400 14px "Rubik", sans-serif |
| `--igds-base-type-subtitle-large` | 500 20px "Rubik", sans-serif |
| `--igds-base-type-subtitle-small` | 500 18px "Rubik", sans-serif |
| `--igds-base-type-title-large` | 700 32px "Rubik", sans-serif |
| `--igds-base-type-title-small-bold` | 700 24px "Rubik", sans-serif |
| `--igds-base-type-title-small-medium` | 500 24px "Rubik", sans-serif |

## Typography (reference) (22)

| token | value |
|---|---|
| `--igds-ref-font-family` | "Rubik", sans-serif |
| `--igds-ref-font-size-2xl` | 32px |
| `--igds-ref-font-size-2xs` | 12px |
| `--igds-ref-font-size-3xl` | 40px |
| `--igds-ref-font-size-4xl` | 48px |
| `--igds-ref-font-size-5xl` | 56px |
| `--igds-ref-font-size-6xl` | 64px |
| `--igds-ref-font-size-l` | 20px |
| `--igds-ref-font-size-m` | 18px |
| `--igds-ref-font-size-s` | 16px |
| `--igds-ref-font-size-xl` | 24px |
| `--igds-ref-font-size-xs` | 14px |
| `--igds-ref-font-weight-black` | 900 |
| `--igds-ref-font-weight-bold` | 700 |
| `--igds-ref-font-weight-extra-bold` | 800 |
| `--igds-ref-font-weight-medium` | 500 |
| `--igds-ref-font-weight-regular` | 400 |
| `--igds-ref-font-weight-semi-bold` | 600 |
| `--igds-ref-font-weight-thin` | 300 |
| `--igds-ref-line-height-l` | 1.5 |
| `--igds-ref-line-height-m` | 1.25 |
| `--igds-ref-line-height-s` | 1 |

## Space (28)

| token | value |
|---|---|
| `--igds-ref-space-100` | 2px |
| `--igds-ref-space-1000` | 64px |
| `--igds-ref-space-1050` | 72px |
| `--igds-ref-space-1100` | 80px |
| `--igds-ref-space-1200` | 96px |
| `--igds-ref-space-1250` | 104px |
| `--igds-ref-space-1300` | 120px |
| `--igds-ref-space-1400` | 160px |
| `--igds-ref-space-200` | 4px |
| `--igds-ref-space-250` | 6px |
| `--igds-ref-space-300` | 8px |
| `--igds-ref-space-350` | 10px |
| `--igds-ref-space-400` | 12px |
| `--igds-ref-space-500` | 16px |
| `--igds-ref-space-550` | 20px |
| `--igds-ref-space-600` | 24px |
| `--igds-ref-space-650` | 28px |
| `--igds-ref-space-700` | 32px |
| `--igds-ref-space-750` | 36px |
| `--igds-ref-space-800` | 40px |
| `--igds-ref-space-900` | 48px |
| `--igds-ref-space-minus100` | -2px |
| `--igds-ref-space-minus200` | -4px |
| `--igds-ref-space-minus300` | -8px |
| `--igds-ref-space-minus400` | -12px |
| `--igds-ref-space-minus50` | -1px |
| `--igds-ref-space-minus500` | -16px |
| `--igds-ref-space-minus800` | -40px |

## Border radius (7)

| token | value |
|---|---|
| `--igds-ref-border-radius-2xl` | 64px |
| `--igds-ref-border-radius-full` | calc(infinity * 1px) |
| `--igds-ref-border-radius-l` | 16px |
| `--igds-ref-border-radius-m` | 8px |
| `--igds-ref-border-radius-s` | 4px |
| `--igds-ref-border-radius-xl` | 32px |
| `--igds-ref-border-radius-xs` | 2px |

## Border (6)

| token | value |
|---|---|
| `--igds-base-border-width-default` | 1px |
| `--igds-base-border-width-focused` | 2px |
| `--igds-ref-border-width-l` | 4px |
| `--igds-ref-border-width-m` | 2px |
| `--igds-ref-border-width-s` | 1px |
| `--igds-ref-border-width-xl` | 8px |

## Shadow (15)

| token | value |
|---|---|
| `--igds-base-shadow-level-1` | 0 2px 8px 0 #064DAD1A |
| `--igds-base-shadow-level-2` | 0 4px 12px 0 rgba(6, 77, 173, 0.15) |
| `--igds-base-shadow-level-3` | 0 10px 24px 0 rgba(6, 77, 173, 0.15) |
| `--igds-ref-shadow-1` | 0 1px 2px 0 rgba(0, 0, 0, 30%), 0 1px 3px 1px rgba(0, 0, 0,  |
| `--igds-ref-shadow-10` | 0 2px 8px 0 #064DAD1A |
| `--igds-ref-shadow-11` | 0 10px 24px 0 rgba(6, 77, 173, 0.15) |
| `--igds-ref-shadow-15` | 0 10px 24px 0 rgba(0, 104, 245, 0.15) |
| `--igds-ref-shadow-2` | 0 1px 2px 0 rgba(0, 0, 0, 30%), 0 2px 6px 2px rgba(0, 0, 0,  |
| `--igds-ref-shadow-3` | 0 4px 8px 3px rgba(0, 0, 0, 15%), 0 1px 6px 2px rgba(0, 0, 0 |
| `--igds-ref-shadow-4` | 0 6px 10px 4px rgba(0, 0, 0, 15%), 0 2px 3px 0 rgba(0, 0, 0, |
| `--igds-ref-shadow-5` | 0 8px 12px 6px rgba(0, 0, 0, 15%), 0 4px 4px 0 rgba(0, 0, 0, |
| `--igds-ref-shadow-6` | 0 1px 3px 0 #0000004D, 0 4px 8px 3px #00000026 |
| `--igds-ref-shadow-7` | 0 4px 12px 0 rgba(6, 77, 173, 0.15) |
| `--igds-ref-shadow-8` | 0 1px 3px 1px #00000026, 0 1px 2px 0 #0000004D |
| `--igds-ref-shadow-9` | 0 2px 8px 0 rgba(6, 77, 173, 10%), 0 1px 4px 0 rgba(6, 77, 1 |

## Z-index (8)

| token | value |
|---|---|
| `--igds-ref-zindex-100` | 100 |
| `--igds-ref-zindex-200` | 200 |
| `--igds-ref-zindex-300` | 300 |
| `--igds-ref-zindex-400` | 400 |
| `--igds-ref-zindex-500` | 500 |
| `--igds-ref-zindex-600` | 600 |
| `--igds-ref-zindex-700` | 700 |
| `--igds-ref-zindex-800` | 800 |

## Opacity (7)

| token | value |
|---|---|
| `--igds-ref-opacity-2` | 0.2 |
| `--igds-ref-opacity-3` | 0.3 |
| `--igds-ref-opacity-4` | 0.4 |
| `--igds-ref-opacity-5` | 0.5 |
| `--igds-ref-opacity-6` | 0.6 |
| `--igds-ref-opacity-7` | 0.7 |
| `--igds-ref-opacity-8` | 0.8 |

## Device widths (breakpoints) (6)

| token | value |
|---|---|
| `--igds-ref-device-width-desktop-l` | 1920px |
| `--igds-ref-device-width-desktop-m` | 1440px |
| `--igds-ref-device-width-desktop-s` | 1200px |
| `--igds-ref-device-width-mobile` | 360px |
| `--igds-ref-device-width-mobile-l` | 425px |
| `--igds-ref-device-width-tablet` | 768px |

## Color palette — reference only, avoid in UI (139)

Exists for the semantic tokens to point at. Using these directly bypasses dark mode. Names: `--igds-ref-blue-sky-0` `--igds-ref-blue-sky-100` `--igds-ref-blue-sky-200` `--igds-ref-blue-sky-25` `--igds-ref-blue-sky-300` `--igds-ref-blue-sky-400` `--igds-ref-blue-sky-50` `--igds-ref-blue-sky-500` `--igds-ref-blue-sky-600` `--igds-ref-blue-sky-700` `--igds-ref-blue-sky-800` `--igds-ref-blue-sky-900` `--igds-ref-bright-grey-100` `--igds-ref-bright-grey-200` `--igds-ref-bright-grey-25` `--igds-ref-bright-grey-300` `--igds-ref-bright-grey-400` `--igds-ref-bright-grey-50` `--igds-ref-bright-grey-500` `--igds-ref-bright-grey-600` `--igds-ref-bright-grey-700` `--igds-ref-bright-grey-800` `--igds-ref-bright-grey-900` `--igds-ref-coral-red-100` `--igds-ref-coral-red-200` `--igds-ref-coral-red-300` `--igds-ref-coral-red-400` `--igds-ref-coral-red-50` `--igds-ref-coral-red-500` `--igds-ref-coral-red-600` `--igds-ref-coral-red-700` `--igds-ref-coral-red-800` `--igds-ref-coral-red-900` `--igds-ref-cyan-500` `--igds-ref-cyan-800` `--igds-ref-dawn-blue-100` `--igds-ref-dawn-blue-200` `--igds-ref-dawn-blue-300` `--igds-ref-dawn-blue-400` `--igds-ref-dawn-blue-50` `--igds-ref-dawn-blue-500` `--igds-ref-dawn-blue-600` `--igds-ref-dawn-blue-700` `--igds-ref-dawn-blue-800` `--igds-ref-dawn-blue-900` `--igds-ref-dim-grey-100` `--igds-ref-dim-grey-200` `--igds-ref-dim-grey-300` `--igds-ref-dim-grey-400` `--igds-ref-dim-grey-50` `--igds-ref-dim-grey-500` `--igds-ref-dim-grey-600` `--igds-ref-dim-grey-700` `--igds-ref-dim-grey-800` `--igds-ref-dim-grey-900` `--igds-ref-galil-green-100` `--igds-ref-galil-green-200` `--igds-ref-galil-green-300` `--igds-ref-galil-green-400` `--igds-ref-galil-green-50` `--igds-ref-galil-green-500` `--igds-ref-galil-green-600` `--igds-ref-galil-green-700` `--igds-ref-galil-green-800` `--igds-ref-galil-green-900` `--igds-ref-ice-blue-500` `--igds-ref-israel-blue-100` `--igds-ref-israel-blue-200` `--igds-ref-israel-blue-300` `--igds-ref-israel-blue-400` `--igds-ref-israel-blue-50` `--igds-ref-israel-blue-500` `--igds-ref-israel-blue-600` `--igds-ref-israel-blue-700` `--igds-ref-israel-blue-800` `--igds-ref-israel-blue-900` `--igds-ref-mist-blue-100` `--igds-ref-mist-blue-200` `--igds-ref-mist-blue-300` `--igds-ref-mist-blue-400` `--igds-ref-mist-blue-50` `--igds-ref-mist-blue-500` `--igds-ref-mist-blue-600` `--igds-ref-mist-blue-700` `--igds-ref-mist-blue-800` `--igds-ref-mist-blue-900` `--igds-ref-negev-orange-100` `--igds-ref-negev-orange-200` `--igds-ref-negev-orange-300` `--igds-ref-negev-orange-400` `--igds-ref-negev-orange-50` `--igds-ref-negev-orange-500` `--igds-ref-negev-orange-600` `--igds-ref-negev-orange-700` `--igds-ref-negev-orange-800` `--igds-ref-negev-orange-900` `--igds-ref-negev-yellow-100` `--igds-ref-negev-yellow-200` `--igds-ref-negev-yellow-300` `--igds-ref-negev-yellow-400` `--igds-ref-negev-yellow-50` `--igds-ref-negev-yellow-500` `--igds-ref-negev-yellow-600` `--igds-ref-negev-yellow-700` `--igds-ref-negev-yellow-800` `--igds-ref-negev-yellow-900` `--igds-ref-purple-100` `--igds-ref-purple-200` `--igds-ref-purple-300` `--igds-ref-purple-400` `--igds-ref-purple-50` `--igds-ref-purple-500` `--igds-ref-purple-600` `--igds-ref-purple-700` `--igds-ref-purple-800` `--igds-ref-purple-900` `--igds-ref-steel-grey-100` `--igds-ref-steel-grey-200` `--igds-ref-steel-grey-300` `--igds-ref-steel-grey-400` `--igds-ref-steel-grey-50` `--igds-ref-steel-grey-500` `--igds-ref-steel-grey-600` `--igds-ref-steel-grey-700` `--igds-ref-steel-grey-800` `--igds-ref-steel-grey-900` `--igds-ref-strawberry-pink-700` `--igds-ref-strawberry-pink-900` `--igds-ref-warm-grey-100` `--igds-ref-warm-grey-200` `--igds-ref-warm-grey-300` `--igds-ref-warm-grey-400` `--igds-ref-warm-grey-50` `--igds-ref-warm-grey-500` `--igds-ref-warm-grey-600` `--igds-ref-warm-grey-700` `--igds-ref-warm-grey-800` `--igds-ref-warm-grey-900` `--igds-ref-white`

## Not public API

- `--igds-light-*` / `--igds-dark-*` aliases (265) — use the un-prefixed name.
- Component-internal tokens `--igds-light-comp-*` etc. (261) — set inside components; never set them.
- Component CSS hooks (40, e.g. `--igds-input-height`) — undocumented; use only with approval (IGDS-GAP).

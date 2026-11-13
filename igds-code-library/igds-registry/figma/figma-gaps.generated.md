# IGDS — Figma ↔ Code gaps report (generated)

Generated 2026-11-11T08:36:37.418Z. Figma snapshot: 2026-11-11T08:21:26.631Z. Code: @igds/core-web 0.1.59, @igds/tokens 0.1.59.

> Derived conclusions — not facts. Each row shows how it was derived. Fix a wrong automatic match by adding a reviewed entry to `figma/figma-mapping.overrides.json`, never by editing this file.

## Summary

```json
{
  "figmaComponentSets": 199,
  "publicComponentSets": 126,
  "privateBuildingBlocksSkipped": 73,
  "publicSetsByConfidence": {
    "high": 49,
    "needs-review": 14,
    "medium": 22,
    "none": 41
  },
  "codeTagsWithFigmaCounterpart": 40,
  "codeTagsWithoutFigmaCounterpart": 33,
  "variantPropertyComparisons": {
    "GAP-no-matching-boolean-prop": 18,
    "not-a-component-prop": 74,
    "value-mismatch": 33,
    "GAP-no-matching-prop": 34,
    "aligned": 15,
    "state-ok": 33,
    "state-gaps": 3
  },
  "figmaVariables": 426,
  "figmaVariablesMatchedToCssTokens": 287,
  "figmaVariablesWithoutCssToken": 72,
  "codeTokensWithoutFigmaVariable": 29
}
```

## 1. Figma components with no code component

These must NOT be built as look-alikes. An AI tool must report `IGDS-GAP` for them.

| Figma component | page | node | closest code tag (score) |
|---|---|---|---|
| Stamped | Card | [9592:205](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=9592-205) | `igds-table-row` (0.4), `igds-card` (0.3) |
| Message | Chat Message | [36403:35282](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=36403-35282) | `igds-table-row` (0.4) |
| Prompt | Composer AI | [44489:9473](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=44489-9473) | — |
| Prompt AI | Composer AI | [44489:10047](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=44489-10047) | — |
| Composer AI | Composer AI | [46807:18036](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=46807-18036) | `igds-dynamic-icon` (0.2) |
| attachment | Composer AI | [46807:18576](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=46807-18576) | `igds-dynamic-icon` (0.4), `igds-table-row` (0.4) |
| attachment | Composer AI | [49684:3481](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=49684-3481) | `igds-dynamic-icon` (0.4), `igds-table-row` (0.4) |
| Date Range | Date & Time Picker | [35903:11333](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35903-11333) | `igds-date-picker` (0.4) |
| Time Picker | Date & Time Picker | [35945:25813](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35945-25813) | `igds-date-picker` (0.4), `igds-profile-picker` (0.275) |
| Error message | Error message / 404 | [19910:9507](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=19910-9507) | `igds-default-error-box` (0.275) |
| Text Area | Input Field | [3519:2599](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=3519-2599) | `igds-input` (0.3) |
| Loader 24px | Loaders | [3421:12342](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=3421-12342) | — |
| Loader 24px- Inverted | Loaders | [4463:6947](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=4463-6947) | — |
| Loader 48px | Loaders | [3421:13223](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=3421-13223) | — |
| Phone Number Input Field | Phone Number Input Field | [16979:8852](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=16979-8852) | `igds-input` (0.3) |
| Country Code | Phone Number Input Field | [55959:32597](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=55959-32597) | `igds-dynamic-icon` (0.2) |
| Quick Answers - Chips | Quick Answers - Chips | [31417:1450](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=31417-1450) | — |
| Facebook | Social Links | [14394:13](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14394-13) | `igds-header` (0.4) |
| Whatsapp | Social Links | [14394:561](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14394-561) | `igds-header` (0.4) |
| Instagram | Social Links | [14394:912](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14394-912) | `igds-header` (0.4) |
| Linkdin | Social Links | [14394:935](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14394-935) | `igds-header` (0.4) |
| Twiter | Social Links | [14394:948](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14394-948) | `igds-header` (0.2) |
| TikTok | Social Links | [14433:3](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14433-3) | `igds-header` (0.4) |
| YouTube | Social Links | [14433:48](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14433-48) | `igds-header` (0.4) |
| Pinterest | Social Links | [14445:537](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14445-537) | `igds-header` (0.2) |
| Spotify | Social Links | [14445:550](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14445-550) | `igds-header` (0.4) |
| threads | Social Links | [14532:6](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14532-6) | `igds-header` (0.2) |
| Share via social links | Social Links | [14532:5237](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14532-5237) | `igds-drawer` (0.4), `igds-link-modal` (0.22) |
| Signature | Signature | [18697:12046](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=18697-12046) | — |
| Item Edit Modal | Table | [4912:2597](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=4912-2597) | `igds-popup-menu` (0.4), `igds-tooltip` (0.4) |
| Small Cell Item | Table | [36468:44093](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=36468-44093) | `igds-button` (0.4), `igds-badge` (0.4) |
| Prompt | Thinking Loader AI | [53251:21891](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-21891) | — |
| Prompt AI | Thinking Loader AI | [53251:22465](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-22465) | — |
| Composer AI | Thinking Loader AI | [53251:22807](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-22807) | `igds-dynamic-icon` (0.2) |
| attachment | Thinking Loader AI | [53251:23332](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-23332) | `igds-dynamic-icon` (0.4), `igds-table-row` (0.4) |
| attachment | Thinking Loader AI | [53251:23355](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-23355) | `igds-dynamic-icon` (0.4), `igds-table-row` (0.4) |
| Dots / Option 01 | Thinking Loader AI | [53251:27516](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-27516) | — |
| Spotlight | Tour Guide | [16388:11917](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=16388-11917) | `igds-popup-menu` (0.4), `igds-tooltip` (0.4) |
| Walkthrough - Modal | Tour Guide | [36336:7501](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=36336-7501) | `igds-modal` (0.3), `igds-link-modal` (0.2) |
| Updates/horizontal | Updates | [19332:10398](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=19332-10398) | `igds-horizontal-filter` (0.2) |
| Updates | Updates | [36951:3863](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=36951-3863) | — |

## 2. Matches that need human review

| Figma component | page | node | suggested tag | runner-up | evidence |
|---|---|---|---|---|---|
| Notification Button | Badge | [35262:5506](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35262-5506) | `igds-button` (needs-review) | `igds-badge` | name-tokens:0.50 values:5 |
| Notification Button | Badge | [8372:6620](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=8372-6620) | `igds-button` (needs-review) | `igds-badge` | name-tokens:0.50 values:5 |
| Numeric Badge | Badge | [2078:3425](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=2078-3425) | `igds-badge` (needs-review) | `igds-table-row` | name-tokens:0.50 page:1.00 |
| Split Button | Button | [20260:10392](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=20260-10392) | `igds-button` (medium) | `igds-badge` | name-tokens:0.50 page:1.00 values:5 |
| Floating Button | Button | [1798:2270](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=1798-2270) | `igds-button` (medium) | `igds-radio` | name-tokens:0.50 page:1.00 |
| Input Prompt | Composer AI | [44489:9618](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=44489-9618) | `igds-input` (medium) | — | name-prefix name-tokens:0.50 |
| Checkbox vertical/horizontal | Checkbox | [35216:29991](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35216-29991) | `igds-checkbox` (needs-review) | `igds-checkbox-group` | name-prefix name-tokens:0.33 page:1.00 |
| Single File Upload | File upload | [2366:1172](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=2366-1172) | `igds-file-uploader` (medium) | — | name-tokens:0.67 page:1.00 |
| Multiple Files Upload-Upload Area | File upload | [2366:1286](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=2366-1286) | `igds-file-uploader` (medium) | — | name-tokens:0.50 page:1.00 |
| Multiple Files Upload | File upload | [2366:1331](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=2366-1331) | `igds-file-uploader` (medium) | — | name-tokens:0.67 page:1.00 |
| Multiple Files Upload-Added File | File upload | [2366:1460](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=2366-1460) | `igds-file-uploader` (medium) | — | name-tokens:0.50 page:1.00 |
| Chat Input | Input Field | [29927:20119](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=29927-20119) | `igds-input` (needs-review) | `igds-spinbox` | name-tokens:0.50 page:1.00 |
| Kpi_Cards | Kpi Cards | [44958:29285](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=44958-29285) | `igds-card` (medium) | `igds-button` | name-tokens:0.50 page:0.50 values:2 |
| card Item List | List | [35608:12820](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35608-12820) | `igds-card` (medium) | `igds-list` | name-prefix name-tokens:0.50 |
| Progress Bar | Loaders | [1141:2263](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=1141-2263) | `igds-progress-bar` (medium) | — | name-equal name-tokens:1.00 |
| Progress Bar | Loaders | [46144:13919](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=46144-13919) | `igds-progress-bar` (medium) | — | name-equal name-tokens:1.00 |
| Navigation Menu | Navigation Menu | [1538:4181](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=1538-4181) | `igds-menu` (needs-review) | `igds-menu-item` | name-tokens:0.50 page:0.50 |
| Contextual Menu | Navigation Menu | [1538:5210](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=1538-5210) | `igds-menu` (needs-review) | `igds-popup-menu` | name-tokens:0.50 page:0.50 values:2 |
| Mega Menu Atom | Navigation Menu | [37471:34289](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=37471-34289) | `igds-menu` (needs-review) | `igds-menu-item` | name-tokens:0.50 page:0.50 |
| Mega Menu Atoms | Navigation Menu | [40231:29533](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=40231-29533) | `igds-menu` (needs-review) | `igds-menu-item` | name-tokens:0.50 page:0.50 |
| Numbered Pagination | Pagination | [6241:46646](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=6241-46646) | `igds-pagination` (needs-review) | `igds-pagination-item` | name-tokens:0.50 page:1.00 |
| Avatar Profile | Profile Picker | [55528:31835](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=55528-31835) | `igds-profile-picker` (medium) | — | name-tokens:0.33 page:1.00 |
| Avatar Profile | Profile Picker | [55528:39658](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=55528-39658) | `igds-profile-picker` (medium) | — | name-tokens:0.33 page:1.00 |
| Radio Button | Radio Button | [746:974](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=746-974) | `igds-radio` (needs-review) | `igds-radio-group` | name-prefix name-tokens:1.00 page:1.00 |
| Media Mobile | Radio Button | [12910:1214](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=12910-1214) | `igds-radio` (medium) | — | page:1.00 values:1 |
| Media Desktop | Radio Button | [11233:12150](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=11233-12150) | `igds-radio` (medium) | — | page:1.00 values:1 |
| Face Rating | Rating | [15110:7625](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=15110-7625) | `igds-rating` (medium) | — | name-tokens:0.50 page:1.00 |
| Star Rating | Rating | [35744:129279](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=35744-129279) | `igds-rating` (medium) | — | name-tokens:0.50 page:1.00 |
| Scroll | Scroll | [3412:7859](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=3412-7859) | `igds-button` (needs-review) | `igds-badge` | values:3 |
| Side Bar Icon Item | Side Menu | [14302:10147](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=14302-10147) | `igds-sidebar` (medium) | — | name-prefix |
| Input Prompt | Thinking Loader AI | [53251:22036](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=53251-22036) | `igds-input` (medium) | — | name-prefix name-tokens:0.50 |
| Floating Toast | Toast | [49558:7316](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=49558-7316) | `igds-toast` (medium) | `igds-badge` | name-tokens:0.50 page:1.00 values:1 |
| Inline Toast | Toast | [49509:6905](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=49509-6905) | `igds-toast` (medium) | `igds-badge` | name-tokens:0.50 page:1.00 values:1 |
| Floating Toast1 | Toast | [58849:8450](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=58849-8450) | `igds-toast` (needs-review) | `igds-badge` | page:1.00 values:1 |
| Inline Toast1 | Toast | [58849:8026](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=58849-8026) | `igds-toast` (needs-review) | `igds-badge` | page:1.00 values:1 |
| Inline Toast old | Toast | [43615:17991](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=43615-17991) | `igds-toast` (medium) | `igds-badge` | name-tokens:0.50 page:1.00 values:1 |

## 3. Variant values: Figma vs code

| tag | Figma set | Figma prop → code prop | in Figma, not in code | in code, not in Figma |
|---|---|---|---|---|
| `igds-banner` | Banner | Type → `variant` | Live Text- Right, Live Text- Center | text-center, text-right |
| `igds-button` | Notification Button | Size → `size` | Medum | medium |
| `igds-button` | Notification Button | Size → `size` | Medum | medium |
| `igds-button` | Button | Type → `variant` | Link Button, Alternative Link Button | alternative, link-inline |
| `igds-button` | Floating Button | Size → `size` | Desktop, Mobile | large, medium, small |
| `igds-button` | Floating Button | Type → `variant` | Label Primary, Icon-Only Primary, Icon-Only Secondary | alternative, link, link-inline, primary, secondary |
| `igds-card` | Card | Type → `variant` | Clickable, CTA, Not pressable | basic, full-picture-dark, full-picture-light |
| `igds-card` | Card full picture | Type → `variant` | Clickable, CTA | basic, full-picture-dark, full-picture-light |
| `igds-card` | Card full picture+name | Type → `variant` | Clickable | basic, full-picture-dark, full-picture-light |
| `igds-divider` | Divider | Width → `width` | Full, Inset | igds-full-divider, igds-inset-divider |
| `igds-footer` | Footer | Size → `variant` | .Footer Small | small |
| `igds-footer` | Footer | Type → `variant` | Desktop, Mobile | large, medium, small |
| `igds-header` | Header Mobile | Color → `variant` | Blue | brand |
| `igds-header` | Header Tablet | color → `variant` | Blue | brand |
| `igds-input` | Chat Input | Size → `size` | Small, Big | large, custom |
| `igds-card` | Kpi_Cards | size → `size` | Medium | — |
| `igds-card` | Kpi_Cards | Direction → `direction` | right, middle, big icon | horizontal, vertical |
| `igds-card` | card Item List | Type → `variant` | 2 icon buttons, Chevron, 2 lines text, Slot | basic, full-picture-dark, full-picture-light |
| `igds-list` | List | Type → `variant` | Card data | data |
| `igds-menu` | Mega Menu Atoms | Type → `variant` | Cards, Media | header, indent, mobile-header, title-subtitle |
| `igds-radio` | Media Mobile | Type → `variant` | Illustration | default, with-input, text-card |
| `igds-radio` | Media Desktop | Type → `variant` | Illustration | default, with-input, text-card |
| `igds-segmented-control` | Segmented Control Icon only | Size → `size` | Big | large, medium |
| `igds-segmented-control` | Segmented Control Default | Size → `size` | Big | large, medium |
| `igds-skeleton` | Skeleton | Shape → `variant` | Body Text, Rectangle (defult) | body, rectangular |
| `igds-slider` | Slider | Type → `variant` | 100%, 75%, 50%, 25%, 0% | single |
| `igds-toast` | Floating Toast | Status → `variant` | Faliure, Informative, Pay-Attention, AI, Confirmation | failure, attention, info |
| `igds-toast` | Inline Toast | Status → `variant` | Faliure, Pay-Attention, Informative, AI, Confirmation | failure, attention, info |
| `igds-toast` | Floating Toast1 | Status → `variant` | Faliure, Informative, Pay-Attention, AI | failure, attention, info |
| `igds-toast` | Inline Toast1 | Status → `variant` | Faliure, Pay-Attention, Informative, AI | failure, attention, info |
| `igds-toast` | Inline Toast old | Status → `variant` | Faliure, Pay-Attention, Informative, AI | failure, attention, info |
| `igds-tooltip` | Tooltips | Position → `placement` | Left, Right | bottom-end, bottom-start, inset-inline-end, inset-inline-end-bottom, inset-inline-end-top, inset-inline-start, inset-inline-start-bottom, inset-inline-start-top, top-end, top-start |
| `igds-tooltip` | Tooltips | Arrow → `placement` | Right, Left, Middle | bottom-end, bottom-start, inset-inline-end, inset-inline-end-bottom, inset-inline-end-top, inset-inline-start, inset-inline-start-bottom, inset-inline-start-top, top-end, top-start |

### Figma variant properties with no code prop

| tag | Figma set | Figma prop | values |
|---|---|---|---|
| `igds-accordion` | Accordion | Group |  |
| `igds-accordion` | Accordion | AllowMultiple |  |
| `igds-banner` | Banner | Size | Mobile, Desktop |
| `igds-badge` | Numeric Badge | Info/Notification |  |
| `igds-button` | Button | Icon Button |  |
| `igds-button` | Button | Intent | Default, Danger |
| `igds-button` | Split Button | Open |  |
| `igds-breadcrumbs` | Breadcrumbs bar Desktop new | levels | 2, 3, 4, 5 |
| `igds-breadcrumbs` | Breadcrumbs bar Desktop Overflow | Expanded |  |
| `igds-card` | Card full picture | Color | Light |
| `igds-card` | Card full picture+name | Color | Light, Dark |
| `igds-carousel` | carousel | Property | cards, small cards, Mobile, Cards with Arrow, Small cards with arrow |
| `igds-checkbox` | Checkbox card_new | Selected |  |
| `igds-checkbox` | Checkbox vertical/horizontal | Positioning | Vertical, Horizontal |
| `igds-date-picker` | Date Picker | Type | Date Picker, Date Field |
| `igds-divider` | Divider | Position | Vertical, Horizontal |
| `igds-divider` | Divider | Style | Default, Inverted |
| `igds-dropdown` | Dropdown | Type | Default, Active Filterable, Active Unfilterable, Tags |
| `igds-dropdown` | Dropdown | Expanded |  |
| `igds-dropdown` | Dropdown | After Typing |  |
| `igds-vertical-filter` | Vertical Filter Item | Second Level |  |
| `igds-vertical-filter` | Vertical Filter Item | Expanded |  |
| `igds-file-uploader` | Single File Upload | Type | Not uploaded yet, Loading, Uploaded, Failed |
| `igds-file-uploader` | Multiple Files Upload | Number of Files | 3, 5, 12 |
| `igds-file-uploader` | Multiple Files Upload-Added File | Type | Failed, Loading, Uploaded |
| `igds-header` | Header Desktop | Raw | 1, 2 |
| `igds-header` | Header Desktop | Search | Default, Open Search |
| `igds-header` | Header Desktop | Open Menu's for Dev |  |
| `igds-header` | Header Desktop | menu | right, middle |
| `igds-progress-bar` | Progress Bar | Progress | 0%, 25%, 50%, 75%, Indeterminate, 100% |
| `igds-progress-bar` | Progress Bar | Progress | 0%, 25%, 50%, 75%, Indeterminate, 100% |
| `igds-menu` | Contextual Menu | Alignment | Right, Left |
| `igds-profile-picker` | Avatar Profile | Expended | open, close |
| `igds-progress-bar` | progress bar | Progress | 0%, 100%, 75%, 50%, 25% |
| `igds-progress-bar` | progress bar | Text | Right, Middle, Left |
| `igds-progress-bar` | Progress bar round | Progress | 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%, 100% |
| `igds-radio` | Radio Button | Positioning | Vertical, Horizontal |
| `igds-radio` | Radio Button Cards | Selected |  |
| `igds-rating` | Star Rating | Property 1 | Default |
| `igds-search-field` | Search Field Regular | Close |  |
| `igds-search-field` | Search Field Divided Serach | Right Size |  |
| `igds-search-field` | Search Field Divided Serach | Left Size |  |
| `igds-search-field` | Search Field Filter | Filter Active |  |
| `igds-segmented-control` | Segmented Control Icon only | Segments | 2, 3, 4 |
| `igds-segmented-control` | Segmented Control Default | Segments | 3, 4, 5, 2 |
| `igds-step-indicator` | Step Indicator Horizontal - Mobile - Round | Steps | 3, 4 |
| `igds-step-indicator` | Step Indicator Horizontal - Mobile new | Total steps | 2, 3, 5, 4, 6, 7, 8, 9, 10 |
| `igds-step-indicator` | Step Indicator Horizontal - Mobile new | no. of step | 3, 2, 1, 4, 5, 6, 7, 8, 9, 10 |
| `igds-table` | Table Raw | Type | body row_dark, body row_light, table_header, Long text_light, Long text_dark |
| `igds-tabs` | Tabs | Direction | Horizontal, Vertical |
| `igds-tag` | Tags lines | # of tags | 1, 2, 3, 4, 5, 2 lines |
| `igds-toggle` | Toggle | Text |  |

### Figma states that have no prop in code

| tag | Figma set | state |
|---|---|---|
| `igds-vertical-filter` | Vertical Filter Item | Disabled |
| `igds-file-uploader` | Multiple Files Upload-Upload Area | Error |
| `igds-sidebar` | Side Bar Icon Item | Disabled |

## 4. Code components with no public Figma component set

`igds-accordion-item` · `igds-anchor-menu` · `igds-animate-height` · `igds-icon` · `igds-audio-recorder` · `igds-breadcrumb-item` · `igds-popup-menu` · `igds-popup-menu-item` · `igds-carousel-item` · `igds-default-error-box` · `igds-checkbox-group` · `igds-drawer` · `igds-tree-view` · `igds-dynamic-icon` · `igds-footer-navigation` · `igds-footer-navigation-item` · `igds-list-item` · `igds-menu-item` · `igds-pagination-item` · `igds-radio-group` · `igds-editor-toolbar` · `igds-toolbar-item` · `igds-link-modal` · `igds-segment` · `igds-sidebar-item` · `igds-step-item` · `igds-tab` · `igds-tab-panel` · `igds-tag-group` · `igds-table-cell` · `igds-table-header` · `igds-table-row` · `igds-toast-container`

Usually children/sub-parts (e.g. `*-item`) that Figma draws inside the parent set, or utilities.

## 5. Tokens

| Figma collection | modes | variables | matched to CSS token | Figma-only |
|---|---|---|---|---|
| Colors | מותג ממשלתי ראשי, Dark IGDS, כבאות והצלה, ביטוח לאומי | 118 | 97 | 21 |
| Brand | IGDS | 185 | 135 | 49 |
| Space | Mode 1 | 20 | 20 | 0 |
| Border | Mode 1 | 8 | 7 | 1 |
| Screen Sizes | Mode 1 | 5 | 5 | 0 |
| Typography | Mode 1 | 22 | 21 | 1 |
| Component Specific | Regular, Icon onley | 13 | 0 | 0 |
| Stroke | Mode 1 | 2 | 2 | 0 |
| Layout | Mode 1 | 24 | 0 | 0 |
| Highcharts Core | Light, Dark | 17 | 0 | 0 |
| ai | Mode 1 | 10 | 0 | 0 |
| alias | light, dark | 1 | 0 | 0 |
| Colors | מותג ממשלתי ראשי, כבאות והצלה, ביטוח לאומי | 1 | 1 | 0 |

### Figma variables with no CSS token

- **Colors** (21): `Text & Icon/Inverted/subtle-primary`, `Divider/default`, `Divider/inverted`, `Text & Icon/Inverted/hover`, `Background/Light-background`, `Button/background-inactive`, `Button/background-inactive-hover`, `Background/Toast/Information`, `Background/Toast/Success`, `Background/Toast/Warning`, `Background/Toast/Error`, `Background/Toast/Confirmation`, `Text & Icon/Toast/Information`, `Text & Icon/Toast/Success`, `Text & Icon/Toast/Warning`, `Text & Icon/Toast/Error`, `Text & Icon/Toast/Confirmation`, `Button/Danger-primary`, `Button/Danger-Hover`, `Button/Danger-Pressed`, `Button/Danger-Disabled`
- **Brand** (49): `warm-gray/900`, `science-blue/500`, `ocean-blue/500`, `starry-night/500`, `wizard-blue/500`, `alice-blue/500`, `snow-gray/50`, `eclipse-blue/900`, `pompeian-red/500`, `Incremental-blue/50`, `Incremental-blue/600`, `Incremental-blue/700`, `placebo-gray/100`, `placebo-gray/400`, `placebo-gray/600`, `Incremental-blue/100`, `disco-gray/300`, `placebo-gray/200`, `placebo-gray/300`, `placebo-gray/500`, `eclipse-blue/500`, `eclipse-blue/600`, `eclipse-blue/700`, `eclipse-blue/800`, `disco-gray/500`, `disco-gray/800`, `oceanic-cyan/500`, `snow-gray/900`, `snow-gray/100`, `Incremental-blue/500`, `Incremental-blue/400`, `Incremental-blue/30`, `lime/800`, `lime/600`, `lime/500`, `lime/400`, `lime/900`, `lime/700`, `lime/300`, `lime/100`, `lime/200`, `lime/50`, `warm-gray/100`, `peach/500`, `oceanic-cyan/400`, `oceanic-cyan/300`, `yellow/500`, `lavender/500`, `pink/500`
- **Border** (1): `radius-xxs`
- **Typography** (1): `line-height/xl`

### CSS tokens with no Figma variable (29)

`--igds-base-color-border-divider-default`, `--igds-base-color-border-divider-inverted`, `--igds-base-color-text-dark-success`, `--igds-base-color-text-dark-warning`, `--igds-base-color-text-link-primary-pressed`, `--igds-base-color-text-placeholder`, `--igds-base-color-text-subtle-inverted`, `--igds-base-color-text-subtle-primary-inverted`, `--igds-base-color-text-warning`, `--igds-ref-bright-grey-25`, `--igds-ref-font-family`, `--igds-ref-space-1050`, `--igds-ref-space-1250`, `--igds-ref-space-250`, `--igds-ref-space-350`, `--igds-ref-space-650`, `--igds-ref-space-750`, `--igds-ref-space-minus500`, `--igds-ref-space-minus800`, `--igds-ref-warm-grey-100`, `--igds-ref-warm-grey-200`, `--igds-ref-warm-grey-300`, `--igds-ref-warm-grey-400`, `--igds-ref-warm-grey-50`, `--igds-ref-warm-grey-500`, `--igds-ref-warm-grey-600`, `--igds-ref-warm-grey-700`, `--igds-ref-warm-grey-800`, `--igds-ref-warm-grey-900`

### Theme modes

Figma color modes: מותג ממשלתי ראשי, Dark IGDS, כבאות והצלה, ביטוח לאומי · Code themes: default, light, dark. Figma brand modes other than the main and dark mode have no counterpart in @igds/tokens.

## 6. Upstream library findings (code)

- `--igds-light-toast-icon-size` is read by `file-uploader` but defined nowhere (declaration using it is invalid at computed-value time → property falls back to its initial/inherited value).
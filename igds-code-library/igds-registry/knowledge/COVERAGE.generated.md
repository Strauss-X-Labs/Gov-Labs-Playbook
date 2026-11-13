# IGDS Knowledge layer — coverage (generated)

Generated 2026-11-11T10:33:14.628Z. Every number below is computed from `knowledge/figma/raw` (byte-exact MCP captures) and the code registry.

## Guidelines (canvas text)

| measure | value |
|---|---|
| guideline sections discovered (independent scan) | 96 |
| extracted | 96 (missing: none) |
| authored characters extracted | 223,665 |
| authored characters measured independently | 227,525 |
| characters inside instances (examples/annotations) counted | 64,983 |
| authored + instance = audit total 292,508? | yes — exact |
| sections where measured = extracted (text nodes and characters) | 86/96 |
| remaining sections: gap = hidden layers exactly (node count) | 10 sections, 67 hidden text layers, 3,860 chars — yes, every section |
| images in guideline sections (visual Do/Don't) — NOT extracted | 361 |

## Topic coverage across component guideline sections

| topic | sections with it |
|---|---|
| componentSections | 80 |
| withWhenToUse | 75 |
| withWhenNotToUse | 75 |
| withStates | 55 |
| withAnatomy | 74 |
| withDoDont | 75 |
| withAccessibility | 1 |
| withInclusion | 16 |
| withTypes | 37 |
| withCodeStatusAnnotation | 74 |

## Link to code

```json
{
  "statusCounts": {
    "n/a": 11,
    "verified": 40,
    "agree-with-annotation": 10,
    "verified-figma-only": 18,
    "CONTRADICTED": 6,
    "linked-no-annotation": 4,
    "unlinked-no-annotation": 6,
    "UNLINKED": 1
  },
  "codeTagsWithAGuideline": 41,
  "codeTagsTotal": 73,
  "codeTagsWithoutGuideline": [
    "igds-accordion-item",
    "igds-anchor-menu",
    "igds-animate-height",
    "igds-icon",
    "igds-audio-recorder",
    "igds-breadcrumb-item",
    "igds-popup-menu",
    "igds-popup-menu-item",
    "igds-carousel-item",
    "igds-default-error-box",
    "igds-checkbox-group",
    "igds-tree-view",
    "igds-dynamic-icon",
    "igds-footer-navigation",
    "igds-footer-navigation-item",
    "igds-list-item",
    "igds-menu-item",
    "igds-pagination-item",
    "igds-radio-group",
    "igds-editor-toolbar",
    "igds-toolbar-item",
    "igds-link-modal",
    "igds-segment",
    "igds-sidebar-item",
    "igds-step-item",
    "igds-tab",
    "igds-tab-panel",
    "igds-tag-group",
    "igds-table-cell",
    "igds-table-header",
    "igds-table-row",
    "igds-toast-container"
  ]
}
```

## Contradictions and gaps (from verified/)

- **Split  Button** (Button) → `igds-button` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Floating Button** (Button) → `igds-button` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Chat Input** (Input Field) → `igds-input` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Kpi Cards** (Kpi Cards) → `igds-card` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Mega Menu** (Navigation Menu) → `igds-menu` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Scroll** (Scroll) → `igds-button` — CONTRADICTED — Figma annotation says no code exists; Figma: "קוד לא קיים עדיין"
- **Loaders** (Loader- mobile) → no tag — UNLINKED — Figma says code exists but no tag matched; Figma: "קוד מלא"

## Values vs code

- Variables compared with CSS tokens: 287 — agree 280, differ 7
  - `Colors/Background/neutral-secondlevel` vs `--igds-base-color-background-neutral-secondlevel`: light null / #f2f6fd
  - `Colors/Background/neutral-badge` vs `--igds-base-color-background-neutral-badge`: light #e8f0fc / #f2f6fd · dark #1b487a / #1b487a
  - `Brand/bright-grey/100` vs `--igds-ref-bright-grey-100`: light #e8f0fc / #e6f0ff
  - `Space/space-minus400` vs `--igds-ref-space-minus400`: light -16 / -12px
  - `Border/radius-xs` vs `--igds-ref-border-radius-xs`: light 4 / 2px
  - `Border/radius-s` vs `--igds-ref-border-radius-s`: light 6 / 4px
  - `Stroke/weight-l` vs `--igds-ref-border-width-l`: light 2 / 4px
- Text styles (Rubik) with an equal CSS type token: 15/36
- Effect styles (shadows) with an equal CSS shadow token: 4/12
  - Shadow-light/Level 0.5: NO-CSS-TOKEN
  - Shadow-light/Level1: agree → --igds-base-shadow-level-1, --igds-ref-shadow-10
  - Shadow-light/Level2: agree → --igds-base-shadow-level-2, --igds-ref-shadow-7
  - Shadow-light/Level3: agree → --igds-base-shadow-level-3, --igds-ref-shadow-11
  - Shadow-light/Level4: NO-CSS-TOKEN
  - Shadow-light/Level5: NO-CSS-TOKEN
  - Shadow-dark/Level 0.5: NO-CSS-TOKEN
  - Shadow-dark/Level1: NO-CSS-TOKEN
  - Shadow-dark/Level2: NO-CSS-TOKEN
  - Shadow-dark/Level3: agree → --igds-ref-shadow-15
  - Shadow-dark/Level4: NO-CSS-TOKEN
  - Shadow-dark/Level5: NO-CSS-TOKEN
- Icon sets with a same-name icon in @igds/icons: 137/231

## Foundations pages (no "הנחיות" section name — captured separately)

- Design Tokens page (0:1): 1197 visible text blocks + 418 hidden = 1615 text nodes; audit counted 1615 — exact. 39,319 chars.
- CSS-variable names written on that page: 66, existing in @igds/tokens: 66 (verified/design-tokens-page-labels-vs-css.json).
- AI Examples page (45304:1336): 9 authored visible + 2 hidden + 21 inside instances = 32; audit counted 32 — exact. Card titles in Figma are placeholders ("כותרת").

## Page matrix — all Figma pages

| status | pages |
|---|---|
| captured | 78 |
| n/a — separator page (no content) | 6 |
| n/a — empty page (0 components, 0 text) | 1 |
| excluded — test/scratch page | 1 |

| page | role | sets / variants | text nodes | captured from it | status |
|---|---|---|---|---|---|
| 👋 Getting Started `3444:1651` | documentation | 0 / 0 | 392 | doc-text | captured |
| Guide lines `32071:325` | documentation | 0 / 0 | 1001 | guidelines | captured |
| Component Overview `44707:7604` | documentation | 0 / 0 | 224 | doc-text | captured |
| צריכים עזרה? `40350:13969` | documentation | 0 / 0 | 3 | doc-text | captured |
| .Atoms `36363:8125` | foundation-library | 231 / 1874 | 1730 | guidelines, atom-sets+variant-props | captured |
| Icons `82:38` | foundation-library | 233 / 1594 | 72 | guidelines, icon-sets+variant-props | captured |
| 🎨 Design Tokens `0:1` | documentation | 0 / 0 | 1615 | foundations-text | captured |
| --- `4212:706` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |
| Responsive Layout `5820:27710` | documentation | 0 / 0 | 454 | layouts | captured |
| --- `78:562` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |
| Accordion `522:471` | web-component | 2 / 17 | 355 | guidelines, examples, component-snapshot | captured |
| Anchors `4569:38720` | web-component | 2 / 12 | 297 | guidelines, examples, component-snapshot | captured |
| Banner `2473:4` | web-component | 1 / 12 | 197 | guidelines, examples, component-snapshot | captured |
| Badge `1640:177` | web-component | 4 / 39 | 1966 | guidelines, examples, component-snapshot | captured |
| Button `81:1168` | web-component | 6 / 496 | 2019 | guidelines, examples, component-snapshot | captured |
| Breadcrumbs `81:757` | web-component | 5 / 26 | 418 | guidelines, examples, component-snapshot | captured |
| Card `993:2` | web-component | 10 / 143 | 1262 | guidelines, examples, component-snapshot | captured |
| Carousel `4569:513` | web-component | 1 / 10 | 1111 | guidelines, examples, component-snapshot | captured |
| Chat Message `36403:35138` | web-component | 2 / 14 | 662 | guidelines, examples, component-snapshot | captured |
| Composer AI `44489:9469` | web-component | 6 / 64 | 222 | guidelines, examples, component-snapshot | captured |
| Checkbox `81:500` | web-component | 3 / 68 | 644 | guidelines, examples, component-snapshot | captured |
| Date & Time Picker `873:214` | web-component | 9 / 55 | 2229 | guidelines, examples, component-snapshot | captured |
| Divider `323:453` | web-component | 1 / 8 | 260 | guidelines, examples, component-snapshot | captured |
| Drawer `3192:3264` | web-component | 0 / 0 | 142 | guidelines, examples | captured |
| Dropdown `542:591` | web-component | 4 / 48 | 1283 | guidelines, examples, component-snapshot | captured |
| Error message / 404 `19249:14825` | web-component | 2 / 8 | 110 | guidelines, examples, component-snapshot | captured |
| Filter `2963:23162` | web-component | 2 / 26 | 692 | guidelines, examples, component-snapshot | captured |
| File upload `2366:4` | web-component | 4 / 66 | 700 | guidelines, examples, component-snapshot | captured |
| Footer `15360:424` | web-component | 3 / 13 | 964 | guidelines, examples, component-snapshot | captured |
| Header `3008:169` | web-component | 8 / 81 | 929 | guidelines, examples, component-snapshot | captured |
| Input Field `81:110` | web-component | 4 / 68 | 1276 | guidelines, examples, component-snapshot | captured |
| Kpi Cards `44958:28092` | web-component | 1 / 40 | 620 | guidelines, examples, component-snapshot | captured |
| List `2963:21153` | web-component | 3 / 64 | 877 | guidelines, examples, component-snapshot | captured |
| Loaders `1139:2` | web-component | 8 / 58 | 381 | guidelines, examples, component-snapshot | captured |
| Modal `2468:4` | web-component | 1 / 4 | 511 | guidelines, examples, component-snapshot | captured |
| Navigation Menu `1430:840` | web-component | 4 / 21 | 1940 | guidelines, examples, component-snapshot | captured |
| Pagination `4569:31803` | web-component | 4 / 15 | 579 | guidelines, examples, component-snapshot | captured |
| Phone Number Input Field `16934:909` | web-component | 2 / 18 | 439 | guidelines, examples, component-snapshot | captured |
| Profile Picker `16661:2065` | web-component | 3 / 20 | 282 | guidelines, examples, component-snapshot | captured |
| Progress Bar `45684:6151` | web-component | 2 / 40 | 229 | guidelines, examples, component-snapshot | captured |
| Quick Answers - Chips `31417:495` | web-component | 1 / 11 | 315 | guidelines, examples, component-snapshot | captured |
| Radio Button `370:77` | web-component | 5 / 68 | 684 | guidelines, examples, component-snapshot | captured |
| Rating `15064:220` | web-component | 5 / 45 | 272 | guidelines, examples, component-snapshot | captured |
| Rich Text Editor `15359:731` | web-component | 1 / 12 | 211 | guidelines, examples, component-snapshot | captured |
| Scroll `2478:3725` | web-component | 2 / 6 | 267 | guidelines, examples, component-snapshot | captured |
| Social Links `4941:9664` | web-component | 11 / 75 | 168 | guidelines, examples, component-snapshot | captured |
| Search Field `1087:1937` | web-component | 6 / 56 | 779 | guidelines, examples, component-snapshot | captured |
| Segmented control `9031:5093` | web-component | 4 / 158 | 342 | guidelines, examples, component-snapshot | captured |
| Step Indicator `2382:659` | web-component | 15 / 299 | 828 | guidelines, examples, component-snapshot | captured |
| Sheets `25117:4269` | web-component | 0 / 0 | 275 | guidelines, examples | captured |
| Side Menu `2401:2204` | web-component | 2 / 11 | 315 | guidelines, examples, component-snapshot | captured |
| Signature `18573:6232` | web-component | 3 / 38 | 325 | guidelines, examples, component-snapshot | captured |
| Skeleton `2963:21169` | web-component | 2 / 8 | 101 | guidelines, examples, component-snapshot | captured |
| Slider `4569:26720` | web-component | 2 / 17 | 272 | guidelines, examples, component-snapshot | captured |
| Spinbox `8022:4059` | web-component | 1 / 24 | 396 | guidelines, examples, component-snapshot | captured |
| Table `2843:2484` | web-component | 5 / 195 | 1928 | guidelines, examples, component-snapshot | captured |
| Tabs `1458:2` | web-component | 4 / 31 | 547 | guidelines, examples, component-snapshot | captured |
| Tags `4569:30436` | web-component | 2 / 52 | 306 | guidelines, examples, component-snapshot | captured |
| Thinking Loader AI `53251:21889` | web-component | 7 / 74 | 203 | guidelines, examples, component-snapshot | captured |
| Toast `1675:585` | web-component | 5 / 54 | 1158 | guidelines, examples, component-snapshot | captured |
| Toggle `386:297` | web-component | 1 / 2 | 276 | guidelines, examples, component-snapshot | captured |
| Tour Guide `16204:20380` | web-component | 3 / 40 | 609 | guidelines, examples, component-snapshot | captured |
| Tooltip `892:559` | web-component | 1 / 24 | 272 | guidelines, examples, component-snapshot | captured |
| Updates `18975:559` | web-component | 4 / 22 | 460 | guidelines, examples, component-snapshot | captured |
| --- `3830:157` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |
| NATIVE MOBILE COMPONENTS `29055:13206` | native-mobile | 0 / 0 | 6 | guidelines | captured |
| Bottom navigation - Mobile `24079:443` | native-mobile | 12 / 35 | 563 | guidelines, examples, component-snapshot | captured |
| Card-Mobile `54096:11628` | native-mobile | 1 / 32 | 328 | guidelines, examples, component-snapshot | captured |
| Date picker - Mobile `55587:5765` | native-mobile | 2 / 14 | 1890 | examples, component-snapshot | captured |
| Hamburger - Mobile `55101:60019` | native-mobile | 2 / 6 | 337 | guidelines, examples, component-snapshot | captured |
| List - Mobile `24631:3885` | native-mobile | 2 / 43 | 392 | guidelines, examples, component-snapshot | captured |
| Loader- mobile `56606:4925` | native-mobile | 10 / 79 | 261 | guidelines, examples, component-snapshot | captured |
| Tabs-Mobile `55488:1449` | native-mobile | 4 / 20 | 170 | guidelines, examples, component-snapshot | captured |
| Upload- mobile `55618:2922` | native-mobile | 0 / 0 | 0 | — | n/a — empty page (0 components, 0 text) |
| Top navigation - Mobile `24329:909` | native-mobile | 3 / 27 | 193 | guidelines, examples, component-snapshot | captured |
| --- `26026:5448` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |
| DESIGN PATTERN (New) `27017:18290` | pattern-or-template | 0 / 0 | 13 | guidelines | captured |
| 🚧Forms `22254:2762` | pattern-or-template | 0 / 0 | 351 | guidelines, pattern-structure | captured |
| 🚧Feedback `24128:7550` | pattern-or-template | 0 / 0 | 1143 | guidelines, pattern-structure | captured |
| 🚧Chatbot `28458:9578` | pattern-or-template | 0 / 0 | 530 | guidelines | captured |
| AI Examples `45304:1336` | pattern-or-template | 0 / 0 | 32 | foundations-text | captured |
| 🚧Chat AI `37222:46156` | pattern-or-template | 6 / 16 | 666 | guidelines, component-snapshot | captured |
| 🚧Chat AI Pannel `48304:9778` | pattern-or-template | 2 / 6 | 888 | guidelines, component-snapshot | captured |
| --- `22334:3` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |
| 🚧Dark mode Test's `40238:15307` | test-or-scratch | 0 / 0 | 862 | — | excluded — test/scratch page |
| ------------------ `44707:6349` | separator | 0 / 0 | 0 | — | n/a — separator page (no content) |

## Not extracted (by design or not yet)

- Images inside guideline sections (Do/Don't visuals) — counted, not extracted; need screenshots + human/vision review.
- Sample text inside example screens — composition captured, labels skipped (placeholder content).
- "העתקה לשימוש" (copy-paste) sections — assets for designers, no guidance text.
- Prototype interactions / animations.
- Content of linked libraries (illustrations IGDS 2.0) and of org copies.
- Dark mode test page.

# @govlab/igds-kit (pilot)

Self-contained: copy this folder into a project. No Figma, no separate @igds install, no token, no network.

```html
<html dir="rtl" lang="he">
<head>
  <link rel="stylesheet" href="igds-kit/igds-kit.css">
  <script src="igds-kit/igds-kit.js" defer></script>
</head>
```

Bundler projects: `import "igds-kit/components/<tag>.js"` for generated components; official components come from `igds-kit.js`.

## Generated components (Figma-faithful)

### `<igdsx-button>` — Figma "Button" (81:1195), use instead of `<igds-button>`

| attribute | values | default |
|---|---|---|
| `variant` | `primary` · `secondary` · `link-button` · `alternative-link-button` · `link` | primary |
| `size` | `large` · `medium` · `small` | small |
| `intent` | `default` · `danger` | default |
| `icon-only` | boolean |  |
| `disabled` | boolean |  |
| `type` | `button` · `submit` · `reset` | button |
| `label` | string |  |

Slots: `(default)` (label text (Figma "Text")) · `left-icon` (Figma " Left Icon" / "Left Icon op.") · `right-icon` (Figma "Right Icon" / "Right Icon op.") · `icon` (icon-only content (Figma "Icon Op"))

Only these 56 combinations exist in Figma (others warn at runtime): see `catalog.json` / `components/…` contract.

Verification: L1 560/560 variant×theme · behaviour 9/9 · axe 106/112 clean.

## Components generated from every Figma set

289 components, 3101 Figma variants. Full API per tag (attributes and values, text slots, boolean switches, swap slots, state values, direction, known gaps) is in `catalog.json` → `generatedFromFigma`.

Contract: Figma variant property → attribute (slug of the Figma option) · State → real interaction (hover / press / keyboard focus / `disabled`) or `state="<slug>"` · RTL → `dir` · TEXT property → attribute or slot of the same name · BOOLEAN property → `"true"` / `"false"` · INSTANCE_SWAP property → slot. A combination that Figma does not have is reported with console.warn.

| tag | Figma | variants | L1 variant×theme pass |
|---|---|---|---|
| `igdsx-content` | .Content (1075:171) | 9 | 16/18 |
| `igdsx-search-field-list-item` | .Search Field List Item (1093:2153) | 8 | 16/16 |
| `igdsx-search-field-regular` | Search Field Regular (1093:5843) | 14 | 28/28 |
| `igdsx-search-field-regular-false-false-default` | Search Field/Regular/False/False/Default (1093:5857) | 1 | 2/2 |
| `igdsx-search-field-list` | .Search Field List (1093:8727) | 4 | 4/8 |
| `igdsx-card-media-vertical-large` | .Card Media-Vertical Large (11160:15038) | 6 | 12/12 |
| `igdsx-card-media-vertical-small` | .Card Media-Vertical Small (11160:15049) | 4 | 8/8 |
| `igdsx-card-media-horizontal-small` | .Card Media-Horizontal Small (11197:1141) | 2 | 4/4 |
| `igdsx-card-media-horizontal-large` | .Card Media-Horizontal Large (11197:1212) | 2 | 4/4 |
| `igdsx-media-desktop` | Media Desktop (11233:12150) | 2 | 3/4 |
| `igdsx-card` | Card (1140:935) | 54 | 96/108 |
| `igdsx-progress-bar` | Progress Bar (1141:2263) | 12 | 24/24 |
| `igdsx-search-field-hero` | Search Field Hero (1142:3462) | 10 | 20/20 |
| `igdsx-card-full-picture-name` | Card full picture+name (11657:21926) | 24 | 48/48 |
| `igdsx-card-full-picture-name-true-default-small-clickable-light` | Card full picture+name/True/Default/Small/Clickable/Light (11657:22213) | 1 | 2/2 |
| `igdsx-logo` | .logo (12027:48574) | 9 | 15/18 |
| `igdsx-logo-type` | .Logo Type (12223:10424) | 2 | 4/4 |
| `igdsx-logo-placeholder` | .Logo Placeholder (12223:10678) | 2 | 4/4 |
| `igdsx-media-mobile` | Media Mobile (12910:1214) | 2 | 3/4 |
| `igdsx-search-field-filter` | Search Field Filter (13275:2104) | 4 | 4/8 |
| `igdsx-close` | close (138:1012) | 1 | 2/2 |
| `igdsx-minus` | minus (138:1015) | 1 | 2/2 |
| `igdsx-search` |  search (138:1086) | 1 | 2/2 |
| `igdsx-loader` | Loader (138:818) | 1 | 2/2 |
| `igdsx-block` | block (138:827) | 1 | 2/2 |
| `igdsx-in-progress` | in-progress (138:830) | 1 | 2/2 |
| `igdsx-shekels` | shekels (138:909) | 1 | 2/2 |
| `igdsx-side-bar-icon-item` | Side Bar Icon Item (14302:10147) | 5 | 8/10 |
| `igdsx-facebook` | Facebook (14394:13) | 6 | 12/12 |
| `igdsx-whatsapp` | Whatsapp (14394:561) | 6 | 12/12 |
| `igdsx-instagram` | Instagram (14394:912) | 6 | 12/12 |
| `igdsx-linkdin` | Linkdin (14394:935) | 6 | 12/12 |
| `igdsx-twiter` | Twiter (14394:948) | 3 | 6/6 |
| `igdsx-tiktok` | TikTok (14433:3) | 6 | 12/12 |
| `igdsx-youtube` | YouTube (14433:48) | 6 | 12/12 |
| `igdsx-pinterest` | Pinterest (14445:537) | 3 | 6/6 |
| `igdsx-spotify` | Spotify (14445:550) | 6 | 12/12 |
| `igdsx-share-via-social-links` | Share via social links (14532:5237) | 24 | 36/48 |
| `igdsx-threads` | threads (14532:6) | 3 | 6/6 |
| `igdsx-atom-face-rating` | .Atom Face-rating (15096:234) | 25 | 50/50 |
| `igdsx-face-rating` | Face Rating (15110:7625) | 2 | 4/4 |
| `igdsx-star-rating` | .star-rating (15204:8855) | 6 | 12/12 |
| `igdsx-navigation-menu` | Navigation Menu (1538:4181) | 8 | 16/16 |
| `igdsx-navigation-menu-desktop-false` | Navigation Menu/Desktop/False (1538:4182) | 1 | 2/2 |
| `igdsx-contextual-menu` | Contextual Menu (1538:5210) | 8 | 16/16 |
| `igdsx-tab-item` | .Tab item (1558:7023) | 5 | 10/10 |
| `igdsx-footer` | Footer (15777:13868) | 7 | 6/14 |
| `igdsx-link-list-footer` | .Link list footer (15814:13065) | 4 | 8/8 |
| `igdsx-footer-small-mobile` | Footer/Small/Mobile (15843:2538) | 1 | 2/2 |
| `igdsx-news-letter-sign-up` | .News Letter Sign up (15843:3059) | 2 | 4/4 |
| `igdsx-rich-text-editor` | Rich Text Editor (15909:10686) | 12 | 0/24 |
| `igdsx-spotlight-content` | .Spotlight Content (16388:11439) | 8 | 0/16 |
| `igdsx-spotlight` | Spotlight (16388:11917) | 24 | 0/48 |
| `igdsx-badge` | Badge (1646:12) | 10 | 20/20 |
| `igdsx-phone-number-input-field` | Phone Number Input Field (16979:8852) | 16 | 15/32 |
| `igdsx-avatar` | .Avatar (17390:2536) | 8 | 16/16 |
| `igdsx-time-picker-list-atom` | .Time Picker List Atom (17726:66256) | 5 | 10/10 |
| `igdsx-time-picker-input` | .Time Picker Input (17726:66552) | 6 | 12/12 |
| `igdsx-step-indicator-horizontal-compact` | .Step Indicator Horizontal-Compact (17846:1461) | 8 | 10/16 |
| `igdsx-floating-button` | Floating Button (1798:2270) | 40 | 78/80 |
| `igdsx-split-button` | .Split-Button (18588:16465) | 60 | 120/120 |
| `igdsx-dropdown-button` | .Dropdown Button (18588:16662) | 60 | 120/120 |
| `igdsx-avatar-profile-large-default` | Avatar Profile/Large/Default (18691:19949) | 1 | 2/2 |
| `igdsx-avatar-profile-size3-hover` | Avatar Profile/Size3/Hover (18691:19951) | 1 | 2/2 |
| `igdsx-avatar-profile-large-focused` | Avatar Profile/Large/Focused (18691:19953) | 1 | 2/2 |
| `igdsx-avatar-profile-large-pressed` | Avatar Profile/Large/Pressed (18691:19955) | 1 | 2/2 |
| `igdsx-signature` | Signature (18697:12046) | 2 | 4/4 |
| `igdsx-signature-file-upload` | .Signature File Upload (18711:4102) | 26 | 50/52 |
| `igdsx-hand-signature` | .Hand Signature (18711:4679) | 10 | 20/20 |
| `igdsx-updates-horizontal` | Updates/horizontal (19332:10398) | 14 | 28/28 |
| `igdsx-update-text` | .Update text (19332:11494) | 1 | 2/2 |
| `igdsx-toogle-base-focused-active` | ⛔Toogle-base/Focused/Active (1945:8909) | 1 | 2/2 |
| `igdsx-error-message` | Error message (19910:9507) | 4 | 6/8 |
| `igdsx-split-button-20260-10392` | Split Button (20260:10392) | 24 | 48/48 |
| `igdsx-numeric-badge` | Numeric Badge  (2078:3425) | 2 | 4/4 |
| `igdsx-single-file-upload` | Single File Upload (2366:1172) | 26 | 52/52 |
| `igdsx-single-file-upload-true-loading-default` | Single File Upload/True/Loading/Default (2366:1205) | 1 | 2/2 |
| `igdsx-multiple-files-upload-upload-area` | Multiple Files Upload-Upload Area (2366:1286) | 10 | 9/20 |
| `igdsx-multiple-files-upload` | Multiple Files Upload (2366:1331) | 12 | 24/24 |
| `igdsx-multiple-files-upload-added-file` | Multiple Files Upload-Added File (2366:1460) | 18 | 18/36 |
| `igdsx-cloud-upload` |  cloud-upload (2366:610) | 1 | 2/2 |
| `igdsx-trash` |  trash (2366:613) | 1 | 2/2 |
| `igdsx-loader-2366-616` | Loader (2366:616) | 1 | 2/2 |
| `igdsx-connecting-track` | .Connecting Track (2382:817) | 12 | 24/24 |
| `igdsx-bottom-image` | .Bottom Image (24631:8259) | 3 | 6/6 |
| `igdsx-banner` | Banner (2492:4291) | 12 | 20/24 |
| `igdsx-step-status` | .Step Status (29393:2182) | 5 | 10/10 |
| `igdsx-connecting-track-29393-2223` | .Connecting Track (29393:2223) | 6 | 8/12 |
| `igdsx-column-header-cell-item` | .Column Header Cell Item (2945:20132) | 26 | 0/52 |
| `igdsx-raw-cell-item-text-default-false` | .Raw Cell Item/Text/Default/False (2963:23495) | 1 | 2/2 |
| `igdsx-raw-cell-item` | .Raw Cell Item (2963:23496) | 93 | 0/186 |
| `igdsx-raw-cell-item-empty-default-false-true` | .Raw Cell Item/Empty/Default/False/True (2963:23630) | 1 | 2/2 |
| `igdsx-chat-input` | Chat Input (29927:20119) | 24 | 24/48 |
| `igdsx-sub-step-unclickable` | .Sub-Step Unclickable (30756:3436) | 3 | 4/6 |
| `igdsx-sub-step-uncklickble` | .Sub Step Uncklickble (30762:3283) | 6 | 0/12 |
| `igdsx-sub-steps-interactive-true` | .Sub-Steps/Interactive/True (30787:10276) | 1 | 2/2 |
| `igdsx-sub-steps` | .Sub-Steps (30787:10277) | 2 | 0/4 |
| `igdsx-step-indicator-vertical` | .Step Indicator Vertical (30787:22860) | 11 | 0/22 |
| `igdsx-content-true-large-vertical-false` | .Content/True/Large/Vertical/False (30849:5512) | 1 | 2/2 |
| `igdsx-step-indicator-horizontal` | .Step Indicator Horizontal (30876:2516) | 10 | 8/20 |
| `igdsx-step-indicator-horizontal-mobile` | .Step Indicator Horizontal - Mobile (31084:32184) | 10 | 20/20 |
| `igdsx-list-item` | .List Item (3109:26156) | 8 | 12/16 |
| `igdsx-list` | List (3109:26184) | 6 | 6/12 |
| `igdsx-quick-answers-chips` | Quick Answers - Chips (31417:1450) | 11 | 22/22 |
| `igdsx-vertical-filter-item` | Vertical Filter Item (3168:1715) | 24 | 0/48 |
| `igdsx-header-desktop` | Header Desktop (3239:13099) | 16 | 10/32 |
| `igdsx-header-mobile` | Header Mobile (3239:18954) | 20 | 8/40 |
| `igdsx-step-indicator-horizontal-mobile-round` | Step Indicator Horizontal - Mobile - Round (32526:5885) | 4 | 0/8 |
| `igdsx-header-item-text-nav-menu-false` | .Header Item./Text Nav Menu/False (3376:8728) | 1 | 0/2 |
| `igdsx-scrollbar-height` | .Scrollbar Height (3412:2067) | 3 | 6/6 |
| `igdsx-scroll` | Scroll (3412:7859) | 3 | 6/6 |
| `igdsx-skeleton-animation` | .Skeleton animation (3412:9395) | 3 | 6/6 |
| `igdsx-skeleton` | Skeleton (3412:9440) | 5 | 10/10 |
| `igdsx-loader-24px` | Loader 24px (3421:12342) | 4 | 8/8 |
| `igdsx-loader-48px` | Loader 48px (3421:13223) | 4 | 8/8 |
| `igdsx-progress-bar-track-item` | .Progress Bar/Track Item (3421:32781) | 10 | 20/20 |
| `igdsx-toggle` | Toggle (35020:24197) | 2 | 2/4 |
| `igdsx-list-header` | .List Header (35020:7570) | 6 | 12/12 |
| `igdsx-dropdown` | Dropdown  (35069:17714) | 28 | 48/56 |
| `igdsx-radio-button-cards` | Radio Button Cards (35074:88329) | 36 | 32/72 |
| `igdsx-atom-label-input` | .Atom+Label+Input (35082:8619) | 24 | 30/48 |
| `igdsx-text-area` | Text Area (3519:2599) | 12 | 24/24 |
| `igdsx-checkbox-card-new` | Checkbox card_new (35207:4353) | 40 | 34/80 |
| `igdsx-checkbox-label-input` | .Checkbox+Label+Input (35216:29603) | 24 | 30/48 |
| `igdsx-checkbox-vertical-horizontal` | Checkbox vertical/horizontal (35216:29991) | 4 | 8/8 |
| `igdsx-tabs` | Tabs  (35262:11268) | 4 | 4/8 |
| `igdsx-tab-item-35262-16807` | .Tab item  (35262:16807) | 12 | 19/24 |
| `igdsx-notification-button` | Notification Button (35262:5506) | 18 | 36/36 |
| `igdsx-tag` | .Tag (35297:24549) | 40 | 72/80 |
| `igdsx-breadcrumbs-atom-new` | .Breadcrumbs/atom new (35333:33475) | 10 | 16/20 |
| `igdsx-breadcrumbs-bar-desktop-new` | Breadcrumbs bar Desktop new (35333:41557) | 8 | 16/16 |
| `igdsx-avatar-profile-false-false` | Avatar Profile/False/False (35394:1210) | 1 | 2/2 |
| `igdsx-avatar-profile-true-false` | Avatar Profile/True/False (35394:1328) | 1 | 2/2 |
| `igdsx-sub-steps-interactive-false` | .Sub-Steps/Interactive/False (35404:4700) | 1 | 2/2 |
| `igdsx-step-indicator-vertical-35409-4183` | Step indicator Vertical (35409:4183) | 2 | 0/4 |
| `igdsx-ellipse-carousel` | .Ellipse carousel  (35413:17098) | 2 | 4/4 |
| `igdsx-unnumbered-pagination-carousel` | Unnumbered Pagination - carousel (35413:17121) | 1 | 2/2 |
| `igdsx-card-item-list` |  card Item List  (35608:12820) | 50 | 79/100 |
| `igdsx-menu-list` | .Menu List (35735:12138) | 2 | 4/4 |
| `igdsx-star-rating-35744-129279` | Star Rating (35744:129279) | 2 | 4/4 |
| `igdsx-horizontal-filter` | Horizontal Filter (35782:43322) | 2 | 4/4 |
| `igdsx-modal` | Modal (35785:8979) | 4 | 8/8 |
| `igdsx-segmented-control-icon-only` | Segmented Control Icon only (35855:33030) | 6 | 12/12 |
| `igdsx-segmented-control-default` | Segmented Control Default (35855:34246) | 8 | 16/16 |
| `igdsx-date-picker` | Date Picker (35900:13376) | 4 | 8/8 |
| `igdsx-date-range` | Date Range (35903:11333) | 2 | 4/4 |
| `igdsx-time-picker` | Time Picker (35945:25813) | 6 | 12/12 |
| `igdsx-time-picker-list` | .Time Picker List (35952:27805) | 2 | 0/4 |
| `igdsx-button-false-default-link-small-false` | Button/False/Default/Link/Small/False (36034:65678) | 1 | 2/2 |
| `igdsx-button-false-disabled-link-small-false` | Button/False/Disabled/Link/Small/False (36034:65768) | 1 | 2/2 |
| `igdsx-contact-us-line` | .Contact Us/line (36096:26282) | 1 | 0/2 |
| `igdsx-content-true-large-horizontal-true` | .Content/True/Large/Horizontal/True (36102:50478) | 1 | 2/2 |
| `igdsx-content-false-large-horizontal-true` | .Content/False/Large/Horizontal/True (36123:8064) | 1 | 2/2 |
| `igdsx-header-item-36147-23938` | .Header item (36147:23938) | 1 | 2/2 |
| `igdsx-walkthrough-modal` | Walkthrough - Modal (36336:7501) | 8 | 6/16 |
| `igdsx-accordion` | Accordion (36363:22776) | 3 | 6/6 |
| `igdsx-slot` | .Slot (36363:8451) | 1 | 1/2 |
| `igdsx-list-item-atom` | .List Item Atom (36363:9250) | 48 | 96/96 |
| `igdsx-message` | Message (36403:35282) | 12 | 8/24 |
| `igdsx-avatar-profile` | .Avatar Profile (36403:36657) | 2 | 2/4 |
| `igdsx-progress-timed-button` | .progress timed button (36406:73837) | 32 | 64/64 |
| `igdsx-typing` | .Typing (36410:75032) | 8 | 16/16 |
| `igdsx-carousel` | carousel (36417:70941) | 10 | 14/20 |
| `igdsx-small-cell-item` | Small Cell Item (36468:44093) | 56 | 38/112 |
| `igdsx-table-raw` | Table Raw (36522:29244) | 10 | 0/20 |
| `igdsx-details` | .Details (36640:85663) | 4 | 6/8 |
| `igdsx-face-rating-36681-10084` | .Face rating (36681:10084) | 10 | 20/20 |
| `igdsx-list-menu-item` | .List Menu Item (36756:41615) | 4 | 4/8 |
| `igdsx-list-item-atom-36849-25636` | .List Item Atom (36849:25636) | 6 | 12/12 |
| `igdsx-vertical-update-item` | .Vertical update item (36951:3690) | 2 | 2/4 |
| `igdsx-updates` | Updates (36951:3863) | 2 | 4/4 |
| `igdsx-update-text-36951-4740` | .Update text (36951:4740) | 4 | 8/8 |
| `igdsx-card-media-vertical-small-image-big` | .Card Media-Vertical Small/Image/Big (37101:21861) | 1 | 2/2 |
| `igdsx-mega-menu` | Mega Menu (37443:19061) | 1 | 2/2 |
| `igdsx-mega-menu-atom` | Mega Menu Atom (37471:34289) | 2 | 4/4 |
| `igdsx-step-indicator-horizontal-37884-2662` | Step Indicator Horizontal (37884:2662) | 2 | 2/4 |
| `igdsx-step-indicator-horizontal-compact-37884-2997` | Step Indicator Horizontal - Compact (37884:2997) | 2 | 4/4 |
| `igdsx-list-footer` | .List Footer (38610:21106) | 2 | 4/4 |
| `igdsx-mega-menu-atoms` | Mega Menu Atoms (40231:29533) | 3 | 4/6 |
| `igdsx-tab-vertical-item` | .Tab Vertical item   (41636:7217) | 10 | 4/20 |
| `igdsx-card-full-picture` | Card full picture (43124:36813) | 36 | 48/72 |
| `igdsx-secondary-action-43564-97440` | .Secondary Action (43564:97440) | 4 | 7/8 |
| `igdsx-inline-toast-old` | Inline Toast old (43615:17991) | 10 | 0/20 |
| `igdsx-prompt-ai` | Prompt AI (44489:10047) | 2 | 4/4 |
| `igdsx-prompt` | Prompt (44489:9473) | 16 | 0/32 |
| `igdsx-input-prompt` | Input Prompt (44489:9618) | 14 | 0/28 |
| `igdsx-loader-24px-inverted` | Loader 24px- Inverted (4463:6947) | 4 | 8/8 |
| `igdsx-kpi-cards` | Kpi_Cards (44958:29285) | 40 | 36/80 |
| `igdsx-frame-1261158065` | Frame 1261158065 (45091:29155) | 1 | 0/2 |
| `igdsx-carousel-45108-28145` | carousel (45108:28145) | 1 | 2/2 |
| `igdsx-left-nav-type-old` | .Left Nav type_old (45150:193927) | 8 | 0/16 |
| `igdsx-search-field-filter-45166-206730` | Search Field Filter (45166:206730) | 1 | 2/2 |
| `igdsx-progress-bar-track-item-45684-6867` | .Progress Bar/Track Item (45684:6867) | 10 | 20/20 |
| `igdsx-mic` | mic  (4569:26721) | 1 | 2/2 |
| `igdsx-progress-bar-45744-10328` | progress bar (45744:10328) | 20 | 0/40 |
| `igdsx-notification-button-45937-29522` | Notification Button (45937:29522) | 1 | 2/2 |
| `igdsx-text-buttons-container` | Text Buttons Container (45937:29876) | 1 | 2/2 |
| `igdsx-header-desktop-45937-30134` | Header Desktop (45937:30134) | 1 | 0/2 |
| `igdsx-card-media-vertical-small-46144-13628` | .Card Media-Vertical Small (46144:13628) | 4 | 8/8 |
| `igdsx-progress-bar-46144-13919` | Progress Bar (46144:13919) | 12 | 24/24 |
| `igdsx-composer-ai` | Composer AI (46807:18036) | 24 | 20/48 |
| `igdsx-attachment` | attachment (46807:18576) | 4 | 6/8 |
| `igdsx-attachment-file-false` | attachment/File/False (46807:18577) | 1 | 1/2 |
| `igdsx-attachment-image-false` | attachment/Image/False (46807:18584) | 1 | 2/2 |
| `igdsx-table-raw-47903-206067` | Table Raw (47903:206067) | 1 | 2/2 |
| `igdsx-toogle-base` | .Toogle-base (48397:10258) | 8 | 16/16 |
| `igdsx-shekels-48397-3908` | shekels (48397:3908) | 1 | 2/2 |
| `igdsx-input-field-atom` | Input Field - Atom (48397:4009) | 14 | 0/28 |
| `igdsx-media-place-holder-48397-4052` | Media Place Holder (48397:4052) | 4 | 8/8 |
| `igdsx-list-item-atom-48397-4064` | .List Item Atom (48397:4064) | 48 | 84/96 |
| `igdsx-button-48406-10749` | Button (48406:10749) | 190 | 380/380 |
| `igdsx-divider-48406-13136` | Divider (48406:13136) | 8 | 16/16 |
| `igdsx-c2stars-ai-48523-38166` | 2Stars-AI (48523:38166) | 6 | 8/12 |
| `igdsx-help-48523-38357` | help (48523:38357) | 6 | 8/12 |
| `igdsx-document-48523-39820` | Document (48523:39820) | 24 | 32/48 |
| `igdsx-google-48523-40779` | Google (48523:40779) | 6 | 8/12 |
| `igdsx-success-48523-41085` | Success (48523:41085) | 6 | 8/12 |
| `igdsx-alert-triangle` | Alert-Triangle (48523:41100) | 6 | 8/12 |
| `igdsx-alert-circle-48523-41255` | Alert-Circle (48523:41255) | 12 | 16/24 |
| `igdsx-home` | Home (48523:41447) | 6 | 8/12 |
| `igdsx-slot-for-table` | Slot for table (4912:2585) | 1 | 0/2 |
| `igdsx-item-edit-modal` | Item Edit Modal (4912:2597) | 10 | 20/20 |
| `igdsx-inline-toast` | Inline Toast (49509:6905) | 12 | 0/24 |
| `igdsx-floating-toast` | Floating Toast (49558:7316) | 12 | 22/24 |
| `igdsx-attachment-49684-3481` | attachment (49684:3481) | 4 | 7/8 |
| `igdsx-tripple-floating-toast-new` | Tripple floating toast_new (49723:9561) | 1 | 2/2 |
| `igdsx-step-indicator-horizontal-mobile-new` | Step Indicator Horizontal - Mobile new (50656:10694) | 216 | 390/432 |
| `igdsx-progress-bar-round` | Progress bar round (50693:10471) | 20 | 40/40 |
| `igdsx-accordion-item` | .accordion-item (522:495) | 14 | 28/28 |
| `igdsx-slot-522-643` | .Slot (522:643) | 1 | 1/2 |
| `igdsx-button-dots` | .Button dots (53173:56588) | 2 | 4/4 |
| `igdsx-breadcrumbs-bar-desktop-overflow` | Breadcrumbs bar Desktop Overflow (53173:56947) | 4 | 2/8 |
| `igdsx-prompt-53251-21891` | Prompt (53251:21891) | 16 | 0/32 |
| `igdsx-input-prompt-53251-22036` | Input Prompt (53251:22036) | 14 | 0/28 |
| `igdsx-prompt-ai-53251-22465` | Prompt AI (53251:22465) | 2 | 4/4 |
| `igdsx-composer-ai-53251-22807` | Composer AI (53251:22807) | 24 | 20/48 |
| `igdsx-attachment-53251-23332` | attachment (53251:23332) | 4 | 6/8 |
| `igdsx-attachment-53251-23355` | attachment (53251:23355) | 4 | 7/8 |
| `igdsx-dots-option-01` | Dots / Option 01 (53251:27516) | 10 | 15/20 |
| `igdsx-step-list` | .Step List (53273:25289) | 2 | 0/4 |
| `igdsx-avatar-profile-55528-31835` | Avatar Profile (55528:31835) | 8 | 0/16 |
| `igdsx-avatar-profile-55528-39658` | Avatar Profile (55528:39658) | 4 | 8/8 |
| `igdsx-button-overflow` | .Button overflow (55937:19634) | 3 | 6/6 |
| `igdsx-il` | IL (55959:25164) | 1 | 2/2 |
| `igdsx-country-code` | Country Code (55959:32597) | 2 | 2/4 |
| `igdsx-search-field-divided-serach` | Search Field Divided Serach (5680:4622) | 16 | 20/32 |
| `igdsx-list-583-2458` | .list (583:2458) | 12 | 20/24 |
| `igdsx-list-single-selection-true` | .list/Single Selection/True (583:307) | 1 | 2/2 |
| `igdsx-inline-toast1` | Inline Toast1 (58849:8026) | 10 | 0/20 |
| `igdsx-floating-toast1` | Floating Toast1 (58849:8450) | 10 | 20/20 |
| `igdsx-input-field-horizontal` | Input Field / Horizontal (59066:7577) | 16 | 32/32 |
| `igdsx-tags-lines` | Tags lines (5951:6247) | 12 | 24/24 |
| `igdsx-button-pagination` | .Button Pagination (6016:2945) | 6 | 10/12 |
| `igdsx-button-pagination-6016-2991` | .Button Pagination/... (6016:2991) | 1 | 2/2 |
| `igdsx-header-tablet` | Header Tablet (6030:8496) | 12 | 12/24 |
| `igdsx-button-default-link-small-true` | Button/Default/Link/Small/True (6073:15739) | 1 | 2/2 |
| `igdsx-slider-knob` | Slider Knob (6146:23517) | 5 | 10/10 |
| `igdsx-numbered-pagination` | Numbered Pagination (6241:46646) | 4 | 8/8 |
| `igdsx-slider` | Slider (6371:21439) | 12 | 24/24 |
| `igdsx-anchor` | Anchor (6632:5248) | 4 | 6/8 |
| `igdsx-checkbox-atom-700-1526` | .Checkbox/atom (700:1526) | 14 | 28/28 |
| `igdsx-divider-708-2124` | Divider (708:2124) | 8 | 16/16 |
| `igdsx-radio-button-atom` | Radio Button/atom (723:370) | 10 | 20/20 |
| `igdsx-desktop-anchor-atom` | .Desktop Anchor Atom (7363:2159) | 8 | 6/16 |
| `igdsx-radio-button` | Radio Button (746:974) | 4 | 8/8 |
| `igdsx-toogle-base-focused-not-active` | ⛔Toogle-base/Focused/Not-active (753:1588) | 1 | 2/2 |
| `igdsx-toogle-base-disabled-false` | .Toogle-base/Disabled/False (753:1615) | 1 | 2/2 |
| `igdsx-table-raw-expanded-content` | Table Raw Expanded Content (7843:5264) | 1 | 0/2 |
| `igdsx-spin-box` | Spin Box (8022:10946) | 24 | 48/48 |
| `igdsx-input-field` | Input Field (81:115) | 16 | 32/32 |
| `igdsx-input-field-default` | Input Field/Default (81:116) | 1 | 2/2 |
| `igdsx-button-false-default-medium-without-primary` | Button/False/Default/Medium/Without/Primary (81:1202) | 1 | 2/2 |
| `igdsx-button-default-secondary-medium-true` | Button/Default/Secondary/Medium/True (81:1381) | 1 | 2/2 |
| `igdsx-button-false-link-button-medium-default-without-true` | Button/False/Link Button/Medium/Default/Without/True (81:1846) | 1 | 2/2 |
| `igdsx-button-false-link-button-medium-pressed-without-true` | Button/False/Link Button/Medium/Pressed/Without/True (81:1858) | 1 | 2/2 |
| `igdsx-button-false-link-button-medium-focused-without-true` | Button/False/Link Button/Medium/Focused/Without/True (81:1864) | 1 | 2/2 |
| `igdsx-button-false-link-button-small-default-without-true` | Button/False/Link Button/Small/Default/Without/True (8164:20433) | 1 | 2/2 |
| `igdsx-notification-button-8372-6620` | Notification Button (8372:6620) | 9 | 18/18 |
| `igdsx-building-blocks-day` | .Building Blocks/Day (880:387) | 17 | 34/34 |
| `igdsx-building-blocks-day-selected-focused` | .Building Blocks/Day/Selected/Focused (884:1342) | 1 | 2/2 |
| `igdsx-left-nav-type` | .Left Nav type (8958:16415) | 12 | 4/24 |
| `igdsx-left-nav-type-text-true-true` | .Left Nav type/Text/True/True (8958:19990) | 1 | 2/2 |
| `igdsx-tooltips` | Tooltips (898:98) | 24 | 0/48 |
| `igdsx-button-true-link-button-medium-default-only-true` | Button/True/Link Button/Medium/Default/Only/True (9130:1789) | 1 | 2/2 |
| `igdsx-date-picker-calendar` | .Date Picker Calendar (914:1980) | 6 | 0/12 |
| `igdsx-building-blocks-year` | .Building Blocks/Year (914:2173) | 7 | 14/14 |
| `igdsx-stamped` | Stamped (9592:205) | 2 | 4/4 |
| `igdsx-segmented-control-items` | .Segmented Control Items (9612:347) | 96 | 134/192 |
| `igdsx-segmented-control-icon-items` | .Segmented Control Icon Items (9784:4768) | 48 | 34/96 |

## Official components

73 tags from @igds/core-web 0.1.59, vendored byte-identical (INTEGRITY.json). Their Figma fidelity is not yet verified.

Publication: see LICENSE-STATUS.md.

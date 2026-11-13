# Master list status (generated, do not edit)

Source: `master-list.json` · rebuild: `node pipeline/build-master-list.mjs`

## Components and variants

| Kind | Items | Variants in Figma | Variants extracted (tree) | Variants extracted (summary only) | Items fully extracted | Variant×theme verified (pass) |
|---|---|---|---|---|---|---|
| component-set | 126 | 1938 | 1938 | 0 | 126 | 2814 |
| building-block | 87 | 1328 | 1328 | 0 | 87 | 1993 |
| standalone-component | 19 | 19 | 19 | 0 | 19 | 28 |
| dependency | 122 | 96 | 96 | 0 | 119 | 159 |
| **total** | **354** | **3381** (+ unknown for some discovered dependencies) | **3381** | **0** | **351** | **4994** |

## Components implemented in the kit (code exists in dist/)

**Summary: 290 components in code · 3381 Figma variants implemented · 4994/6762 variant×theme rows pass L1 · 142 components fully verified.**

"Fully verified" = every Figma variant × theme passes L1 (per-node geometry, colour, typography) + every applicable behaviour check (real hover / press / keyboard focus / disabled select the Figma state; not-applicable where Figma has no such variant) + axe with 0 violations. L2 (pixel diff against Figma PNG) is DIAGNOSTIC: calibration (verify/out/81-1195.igdsx-button.l2-calibration.json) shows Figma vs browser glyph rasterisation overlaps real defects, so it does not decide pass/fail.

| Component | Figma set | Variants | L1 variant×theme pass | Behaviour | axe runs clean | L2 (diagnostic) | Fully verified |
|---|---|---|---|---|---|---|---|
| `igdsx-avatar-profile-large-default` | Avatar Profile/Large/Default (18691:19949) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-avatar-profile-size3-hover` | Avatar Profile/Size3/Hover (18691:19951) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-avatar-profile-large-focused` | Avatar Profile/Large/Focused (18691:19953) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-avatar-profile-large-pressed` | Avatar Profile/Large/Pressed (18691:19955) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-raw-cell-item-text-default-false` | .Raw Cell Item/Text/Default/False (2963:23495) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-header-item-text-nav-menu-false` | .Header Item./Text Nav Menu/False (3376:8728) | 1 | 0/2 | 0/0 | 2/2 | — | no |
| `igdsx-unnumbered-pagination-carousel` | Unnumbered Pagination - carousel (35413:17121) | 1 | 2/2 | 0/0 | 0/2 | — | no |
| `igdsx-contact-us-line` | .Contact Us/line (36096:26282) | 1 | 0/2 | 0/0 | 2/2 | — | no |
| `igdsx-header-item-36147-23938` | .Header item (36147:23938) | 1 | 2/2 | 0/0 | 0/2 | — | no |
| `igdsx-mega-menu` | Mega Menu (37443:19061) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-frame-1261158065` | Frame 1261158065 (45091:29155) | 1 | 0/2 | 0/0 | 2/2 | — | no |
| `igdsx-carousel-45108-28145` | carousel (45108:28145) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-search-field-filter-45166-206730` | Search Field Filter (45166:206730) | 1 | 2/2 | 0/0 | 0/2 | — | no |
| `igdsx-notification-button-45937-29522` | Notification Button (45937:29522) | 1 | 2/2 | 0/0 | 0/2 | — | no |
| `igdsx-header-desktop-45937-30134` | Header Desktop (45937:30134) | 1 | 0/2 | 0/0 | 0/2 | — | no |
| `igdsx-table-raw-47903-206067` | Table Raw (47903:206067) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-tripple-floating-toast-new` | Tripple floating toast_new (49723:9561) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-list-single-selection-true` | .list/Single Selection/True (583:307) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-table-raw-expanded-content` | Table Raw Expanded Content (7843:5264) | 1 | 0/2 | 0/0 | 1/2 | — | no |
| `igdsx-content` | .Content (1075:171) | 9 | 16/18 | 0/0 | 0/2 | — | no |
| `igdsx-search-field-list-item` | .Search Field List Item (1093:2153) | 8 | 16/16 | 3/3 | 2/2 | — | yes |
| `igdsx-search-field-regular` | Search Field Regular (1093:5843) | 14 | 28/28 | 3/3 | 0/2 | — | no |
| `igdsx-search-field-regular-false-false-default` | Search Field/Regular/False/False/Default (1093:5857) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-search-field-list` | .Search Field List (1093:8727) | 4 | 4/8 | 0/0 | 2/2 | — | no |
| `igdsx-card-media-vertical-large` | .Card Media-Vertical Large (11160:15038) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-card-media-vertical-small` | .Card Media-Vertical Small (11160:15049) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-card-media-horizontal-small` | .Card Media-Horizontal Small (11197:1141) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-card-media-horizontal-large` | .Card Media-Horizontal Large (11197:1212) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-media-desktop` | Media Desktop (11233:12150) | 2 | 3/4 | 0/0 | 1/2 | — | no |
| `igdsx-card` | Card (1140:935) | 54 | 96/108 | 3/4 | 1/2 | — | no |
| `igdsx-progress-bar` | Progress Bar (1141:2263) | 12 | 24/24 | 0/0 | 2/2 | — | yes |
| `igdsx-search-field-hero` | Search Field Hero (1142:3462) | 10 | 20/20 | 3/3 | 2/2 | — | yes |
| `igdsx-card-full-picture-name` | Card full picture+name (11657:21926) | 24 | 48/48 | 2/2 | 2/2 | — | yes |
| `igdsx-card-full-picture-name-true-default-small-clickable-light` | Card full picture+name/True/Default/Small/Clickable/Light (11657:22213) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-logo` | .logo (12027:48574) | 9 | 15/18 | 0/0 | 2/2 | — | no |
| `igdsx-logo-type` | .Logo Type (12223:10424) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-logo-placeholder` | .Logo Placeholder (12223:10678) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-media-mobile` | Media Mobile (12910:1214) | 2 | 3/4 | 0/0 | 1/2 | — | no |
| `igdsx-search-field-filter` | Search Field Filter (13275:2104) | 4 | 4/8 | 0/0 | 0/2 | — | no |
| `igdsx-close` | close (138:1012) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-minus` | minus (138:1015) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-search` |  search (138:1086) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-loader` | Loader (138:818) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-block` | block (138:827) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-in-progress` | in-progress (138:830) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-shekels` | shekels (138:909) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-side-bar-icon-item` | Side Bar Icon Item (14302:10147) | 5 | 8/10 | 3/3 | 2/2 | — | no |
| `igdsx-facebook` | Facebook (14394:13) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-whatsapp` | Whatsapp (14394:561) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-instagram` | Instagram (14394:912) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-linkdin` | Linkdin (14394:935) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-twiter` | Twiter (14394:948) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-tiktok` | TikTok (14433:3) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-youtube` | YouTube (14433:48) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-pinterest` | Pinterest (14445:537) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-spotify` | Spotify (14445:550) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-share-via-social-links` | Share via social links (14532:5237) | 24 | 36/48 | 0/0 | 2/2 | — | no |
| `igdsx-threads` | threads (14532:6) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-atom-face-rating` | .Atom Face-rating (15096:234) | 25 | 50/50 | 2/2 | 2/2 | — | yes |
| `igdsx-face-rating` | Face Rating (15110:7625) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-star-rating` | .star-rating (15204:8855) | 6 | 12/12 | 2/2 | 2/2 | — | yes |
| `igdsx-navigation-menu` | Navigation Menu (1538:4181) | 8 | 16/16 | 0/1 | 0/2 | — | no |
| `igdsx-navigation-menu-desktop-false` | Navigation Menu/Desktop/False (1538:4182) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-contextual-menu` | Contextual Menu (1538:5210) | 8 | 16/16 | 0/1 | 0/2 | — | no |
| `igdsx-tab-item` | .Tab item (1558:7023) | 5 | 10/10 | 3/3 | 2/2 | — | yes |
| `igdsx-footer` | Footer (15777:13868) | 7 | 6/14 | 0/0 | 0/2 | — | no |
| `igdsx-link-list-footer` | .Link list footer (15814:13065) | 4 | 8/8 | 0/0 | 0/2 | — | no |
| `igdsx-footer-small-mobile` | Footer/Small/Mobile (15843:2538) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-news-letter-sign-up` | .News Letter Sign up (15843:3059) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-rich-text-editor` | Rich Text Editor (15909:10686) | 12 | 0/24 | 3/3 | 2/2 | — | no |
| `igdsx-spotlight-content` | .Spotlight Content (16388:11439) | 8 | 0/16 | 0/0 | 0/2 | — | no |
| `igdsx-spotlight` | Spotlight (16388:11917) | 24 | 0/48 | 0/0 | 0/2 | — | no |
| `igdsx-badge` | Badge (1646:12) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-phone-number-input-field` | Phone Number Input Field (16979:8852) | 16 | 15/32 | 3/3 | 2/2 | — | no |
| `igdsx-avatar` | .Avatar (17390:2536) | 8 | 16/16 | 3/3 | 2/2 | — | yes |
| `igdsx-time-picker-list-atom` | .Time Picker List Atom (17726:66256) | 5 | 10/10 | 3/3 | 2/2 | — | yes |
| `igdsx-time-picker-input` | .Time Picker Input (17726:66552) | 6 | 12/12 | 3/3 | 2/2 | — | yes |
| `igdsx-step-indicator-horizontal-compact` | .Step Indicator Horizontal-Compact (17846:1461) | 8 | 10/16 | 0/0 | 2/2 | — | no |
| `igdsx-floating-button` | Floating Button (1798:2270) | 40 | 78/80 | 4/4 | 2/2 | — | no |
| `igdsx-split-button` | .Split-Button (18588:16465) | 60 | 120/120 | 4/4 | 1/2 | — | no |
| `igdsx-dropdown-button` | .Dropdown Button (18588:16662) | 60 | 120/120 | 3/3 | 0/2 | — | no |
| `igdsx-signature` | Signature (18697:12046) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-signature-file-upload` | .Signature File Upload (18711:4102) | 26 | 50/52 | 3/3 | 2/2 | — | no |
| `igdsx-hand-signature` | .Hand Signature (18711:4679) | 10 | 20/20 | 3/3 | 2/2 | — | yes |
| `igdsx-updates-horizontal` | Updates/horizontal (19332:10398) | 14 | 28/28 | 0/0 | 0/2 | — | no |
| `igdsx-update-text` | .Update text (19332:11494) | 1 | 2/2 | 0/0 | 1/2 | — | no |
| `igdsx-toogle-base-focused-active` | ⛔Toogle-base/Focused/Active (1945:8909) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-error-message` | Error message (19910:9507) | 4 | 6/8 | 0/0 | 0/2 | — | no |
| `igdsx-split-button-20260-10392` | Split Button (20260:10392) | 24 | 48/48 | 0/0 | 0/2 | — | no |
| `igdsx-numeric-badge` | Numeric Badge (2078:3425) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-single-file-upload` | Single File Upload (2366:1172) | 26 | 52/52 | 3/3 | 2/2 | — | yes |
| `igdsx-single-file-upload-true-loading-default` | Single File Upload/True/Loading/Default (2366:1205) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-multiple-files-upload-upload-area` | Multiple Files Upload-Upload Area (2366:1286) | 10 | 9/20 | 3/3 | 2/2 | — | no |
| `igdsx-multiple-files-upload` | Multiple Files Upload (2366:1331) | 12 | 24/24 | 0/1 | 0/2 | — | no |
| `igdsx-multiple-files-upload-added-file` | Multiple Files Upload-Added File (2366:1460) | 18 | 18/36 | 2/2 | 0/2 | — | no |
| `igdsx-cloud-upload` |  cloud-upload (2366:610) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-trash` |  trash (2366:613) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-loader-2366-616` | Loader (2366:616) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-connecting-track` | .Connecting Track (2382:817) | 12 | 24/24 | 0/0 | 2/2 | — | yes |
| `igdsx-bottom-image` | .Bottom Image (24631:8259) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-banner` | Banner (2492:4291) | 12 | 20/24 | 0/0 | 0/2 | — | no |
| `igdsx-step-status` | .Step Status (29393:2182) | 5 | 10/10 | 0/0 | 2/2 | — | yes |
| `igdsx-connecting-track-29393-2223` | .Connecting Track (29393:2223) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-column-header-cell-item` | .Column Header Cell Item (2945:20132) | 26 | 0/52 | 2/2 | 2/2 | — | no |
| `igdsx-raw-cell-item` | .Raw Cell Item (2963:23496) | 93 | 0/186 | 2/2 | 2/2 | — | no |
| `igdsx-raw-cell-item-empty-default-false-true` | .Raw Cell Item/Empty/Default/False/True (2963:23630) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-chat-input` | Chat Input (29927:20119) | 24 | 24/48 | 3/3 | 0/2 | — | no |
| `igdsx-sub-step-unclickable` | .Sub-Step Unclickable (30756:3436) | 3 | 4/6 | 0/0 | 2/2 | — | no |
| `igdsx-sub-step-uncklickble` | .Sub Step Uncklickble (30762:3283) | 6 | 0/12 | 0/0 | 2/2 | — | no |
| `igdsx-sub-steps-interactive-true` | .Sub-Steps/Interactive/True (30787:10276) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-sub-steps` | .Sub-Steps (30787:10277) | 2 | 0/4 | 0/0 | 2/2 | — | no |
| `igdsx-step-indicator-vertical` | .Step Indicator Vertical (30787:22860) | 11 | 0/22 | 0/0 | 2/2 | — | no |
| `igdsx-content-true-large-vertical-false` | .Content/True/Large/Vertical/False (30849:5512) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-step-indicator-horizontal` | .Step Indicator Horizontal (30876:2516) | 10 | 8/20 | 0/0 | 2/2 | — | no |
| `igdsx-step-indicator-horizontal-mobile` | .Step Indicator Horizontal - Mobile (31084:32184) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-list-item` | .List Item (3109:26156) | 8 | 12/16 | 0/0 | 2/2 | — | no |
| `igdsx-list` | List (3109:26184) | 6 | 6/12 | 0/0 | 2/2 | — | no |
| `igdsx-quick-answers-chips` | Quick Answers - Chips (31417:1450) | 11 | 22/22 | 4/4 | 2/2 | — | yes |
| `igdsx-vertical-filter-item` | Vertical Filter Item (3168:1715) | 24 | 0/48 | 3/3 | 2/2 | — | no |
| `igdsx-header-desktop` | Header Desktop (3239:13099) | 16 | 10/32 | 0/0 | 0/2 | — | no |
| `igdsx-header-mobile` | Header Mobile (3239:18954) | 20 | 8/40 | 0/0 | 0/2 | — | no |
| `igdsx-step-indicator-horizontal-mobile-round` | Step Indicator Horizontal - Mobile - Round (32526:5885) | 4 | 0/8 | 0/0 | 2/2 | — | no |
| `igdsx-scrollbar-height` | .Scrollbar Height (3412:2067) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-scroll` | Scroll (3412:7859) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-skeleton-animation` | .Skeleton animation (3412:9395) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-skeleton` | Skeleton (3412:9440) | 5 | 10/10 | 0/0 | 2/2 | — | yes |
| `igdsx-loader-24px` | Loader 24px (3421:12342) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-loader-48px` | Loader 48px (3421:13223) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-progress-bar-track-item` | .Progress Bar/Track Item (3421:32781) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-toggle` | Toggle (35020:24197) | 2 | 2/4 | 0/0 | 1/2 | — | no |
| `igdsx-list-header` | .List Header (35020:7570) | 6 | 12/12 | 0/0 | 0/2 | — | no |
| `igdsx-dropdown` | Dropdown (35069:17714) | 28 | 48/56 | 3/3 | 2/2 | — | no |
| `igdsx-radio-button-cards` | Radio Button Cards (35074:88329) | 36 | 32/72 | 3/3 | 1/2 | — | no |
| `igdsx-atom-label-input` | .Atom+Label+Input (35082:8619) | 24 | 30/48 | 3/3 | 2/2 | — | no |
| `igdsx-text-area` | Text Area (3519:2599) | 12 | 24/24 | 3/3 | 2/2 | — | yes |
| `igdsx-checkbox-card-new` | Checkbox card_new (35207:4353) | 40 | 34/80 | 3/3 | 1/2 | — | no |
| `igdsx-checkbox-label-input` | .Checkbox+Label+Input (35216:29603) | 24 | 30/48 | 3/3 | 2/2 | — | no |
| `igdsx-checkbox-vertical-horizontal` | Checkbox vertical/horizontal (35216:29991) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-tabs` | Tabs (35262:11268) | 4 | 4/8 | 0/0 | 2/2 | — | no |
| `igdsx-tab-item-35262-16807` | .Tab item (35262:16807) | 12 | 19/24 | 3/3 | 2/2 | — | no |
| `igdsx-notification-button` | Notification Button (35262:5506) | 18 | 36/36 | 0/0 | 0/2 | — | no |
| `igdsx-tag` | .Tag (35297:24549) | 40 | 72/80 | 4/4 | 2/2 | — | no |
| `igdsx-breadcrumbs-atom-new` | .Breadcrumbs/atom new (35333:33475) | 10 | 16/20 | 2/2 | 2/2 | — | no |
| `igdsx-breadcrumbs-bar-desktop-new` | Breadcrumbs bar Desktop new (35333:41557) | 8 | 16/16 | 0/0 | 2/2 | — | yes |
| `igdsx-avatar-profile-false-false` | Avatar Profile/False/False (35394:1210) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-avatar-profile-true-false` | Avatar Profile/True/False (35394:1328) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-sub-steps-interactive-false` | .Sub-Steps/Interactive/False (35404:4700) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-step-indicator-vertical-35409-4183` | Step indicator Vertical (35409:4183) | 2 | 0/4 | 0/0 | 2/2 | — | no |
| `igdsx-ellipse-carousel` | .Ellipse carousel (35413:17098) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-card-item-list` | card Item List (35608:12820) | 50 | 79/100 | 3/3 | 0/2 | — | no |
| `igdsx-menu-list` | .Menu List (35735:12138) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-star-rating-35744-129279` | Star Rating (35744:129279) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-horizontal-filter` | Horizontal Filter (35782:43322) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-modal` | Modal (35785:8979) | 4 | 8/8 | 0/0 | 0/2 | — | no |
| `igdsx-segmented-control-icon-only` | Segmented Control Icon only (35855:33030) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-segmented-control-default` | Segmented Control Default (35855:34246) | 8 | 16/16 | 0/0 | 2/2 | — | yes |
| `igdsx-date-picker` | Date Picker (35900:13376) | 4 | 8/8 | 0/0 | 0/2 | — | no |
| `igdsx-date-range` | Date Range (35903:11333) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-time-picker` | Time Picker (35945:25813) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-time-picker-list` | .Time Picker List (35952:27805) | 2 | 0/4 | 0/0 | 2/2 | — | no |
| `igdsx-button-false-default-link-small-false` | Button/False/Default/Link/Small/False (36034:65678) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-false-disabled-link-small-false` | Button/False/Disabled/Link/Small/False (36034:65768) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-content-true-large-horizontal-true` | .Content/True/Large/Horizontal/True (36102:50478) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-content-false-large-horizontal-true` | .Content/False/Large/Horizontal/True (36123:8064) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-walkthrough-modal` | Walkthrough - Modal (36336:7501) | 8 | 6/16 | 0/0 | 0/2 | — | no |
| `igdsx-accordion` | Accordion (36363:22776) | 3 | 6/6 | 0/0 | 2/2 | — | yes |
| `igdsx-slot` | .Slot (36363:8451) | 1 | 1/2 | 0/0 | 1/2 | — | no |
| `igdsx-list-item-atom` | .List Item Atom (36363:9250) | 48 | 96/96 | 4/4 | 2/2 | — | yes |
| `igdsx-message` | Message (36403:35282) | 12 | 8/24 | 0/0 | 0/2 | — | no |
| `igdsx-avatar-profile` | .Avatar Profile (36403:36657) | 2 | 2/4 | 0/0 | 2/2 | — | no |
| `igdsx-progress-timed-button` | .progress timed button (36406:73837) | 32 | 64/64 | 4/4 | 2/2 | — | yes |
| `igdsx-typing` | .Typing (36410:75032) | 8 | 16/16 | 0/0 | 2/2 | — | yes |
| `igdsx-carousel` | carousel (36417:70941) | 10 | 14/20 | 0/0 | 1/2 | — | no |
| `igdsx-small-cell-item` | Small Cell Item (36468:44093) | 56 | 38/112 | 2/2 | 2/2 | — | no |
| `igdsx-table-raw` | Table Raw (36522:29244) | 10 | 0/20 | 0/0 | 2/2 | — | no |
| `igdsx-details` | .Details (36640:85663) | 4 | 6/8 | 0/0 | 0/2 | — | no |
| `igdsx-face-rating-36681-10084` | .Face rating (36681:10084) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-list-menu-item` | .List Menu Item (36756:41615) | 4 | 4/8 | 0/0 | 2/2 | — | no |
| `igdsx-list-item-atom-36849-25636` | .List Item Atom (36849:25636) | 6 | 12/12 | 0/0 | 2/2 | — | yes |
| `igdsx-vertical-update-item` | .Vertical update item (36951:3690) | 2 | 2/4 | 0/0 | 0/2 | — | no |
| `igdsx-updates` | Updates (36951:3863) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-update-text-36951-4740` | .Update text (36951:4740) | 4 | 8/8 | 0/0 | 0/2 | — | no |
| `igdsx-card-media-vertical-small-image-big` | .Card Media-Vertical Small/Image/Big (37101:21861) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-mega-menu-atom` | Mega Menu Atom (37471:34289) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-step-indicator-horizontal-37884-2662` | Step Indicator Horizontal (37884:2662) | 2 | 2/4 | 0/0 | 2/2 | — | no |
| `igdsx-step-indicator-horizontal-compact-37884-2997` | Step Indicator Horizontal - Compact (37884:2997) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-list-footer` | .List Footer (38610:21106) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-mega-menu-atoms` | Mega Menu Atoms (40231:29533) | 3 | 4/6 | 0/0 | 2/2 | — | no |
| `igdsx-tab-vertical-item` | .Tab Vertical item (41636:7217) | 10 | 4/20 | 3/3 | 2/2 | — | no |
| `igdsx-card-full-picture` | Card full picture (43124:36813) | 36 | 48/72 | 3/3 | 1/2 | — | no |
| `igdsx-secondary-action-43564-97440` | .Secondary Action (43564:97440) | 4 | 7/8 | 3/3 | 2/2 | — | no |
| `igdsx-inline-toast-old` | Inline Toast old (43615:17991) | 10 | 0/20 | 0/0 | 2/2 | — | no |
| `igdsx-prompt-ai` | Prompt AI (44489:10047) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-prompt` | Prompt (44489:9473) | 16 | 0/32 | 4/4 | 0/2 | — | no |
| `igdsx-input-prompt` | Input Prompt (44489:9618) | 14 | 0/28 | 3/3 | 0/2 | — | no |
| `igdsx-loader-24px-inverted` | Loader 24px- Inverted (4463:6947) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-kpi-cards` | Kpi_Cards (44958:29285) | 40 | 36/80 | 3/3 | 2/2 | — | no |
| `igdsx-left-nav-type-old` | .Left Nav type_old (45150:193927) | 8 | 0/16 | 0/0 | 0/2 | — | no |
| `igdsx-progress-bar-track-item-45684-6867` | .Progress Bar/Track Item (45684:6867) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-mic` | mic  (4569:26721) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-progress-bar-45744-10328` | progress bar (45744:10328) | 20 | 0/40 | 0/0 | 2/2 | — | no |
| `igdsx-text-buttons-container` | Text Buttons Container (45937:29876) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-card-media-vertical-small-46144-13628` | .Card Media-Vertical Small (46144:13628) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-progress-bar-46144-13919` | Progress Bar (46144:13919) | 12 | 24/24 | 0/0 | 2/2 | — | yes |
| `igdsx-composer-ai` | Composer AI (46807:18036) | 24 | 20/48 | 0/0 | 0/2 | — | no |
| `igdsx-attachment` | attachment (46807:18576) | 4 | 6/8 | 0/0 | 1/2 | — | no |
| `igdsx-attachment-file-false` | attachment/File/False (46807:18577) | 1 | 1/2 | 0/0 | 2/2 | — | no |
| `igdsx-attachment-image-false` | attachment/Image/False (46807:18584) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-toogle-base` | .Toogle-base (48397:10258) | 8 | 16/16 | 3/3 | 2/2 | — | yes |
| `igdsx-shekels-48397-3908` | shekels (48397:3908) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-input-field-atom` | Input Field - Atom (48397:4009) | 14 | 0/28 | 3/3 | 2/2 | — | no |
| `igdsx-media-place-holder-48397-4052` | Media Place Holder (48397:4052) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-list-item-atom-48397-4064` | .List Item Atom (48397:4064) | 48 | 84/96 | 4/4 | 2/2 | — | no |
| `igdsx-button-48406-10749` | Button (48406:10749) | 190 | 380/380 | 4/4 | 2/2 | — | yes |
| `igdsx-divider-48406-13136` | Divider (48406:13136) | 8 | 16/16 | 0/0 | 2/2 | — | yes |
| `igdsx-c2stars-ai-48523-38166` | 2Stars-AI (48523:38166) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-help-48523-38357` | help (48523:38357) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-document-48523-39820` | Document (48523:39820) | 24 | 32/48 | 0/0 | 2/2 | — | no |
| `igdsx-google-48523-40779` | Google (48523:40779) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-success-48523-41085` | Success (48523:41085) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-alert-triangle` | Alert-Triangle (48523:41100) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-alert-circle-48523-41255` | Alert-Circle (48523:41255) | 12 | 16/24 | 0/0 | 2/2 | — | no |
| `igdsx-home` | Home (48523:41447) | 6 | 8/12 | 0/0 | 2/2 | — | no |
| `igdsx-slot-for-table` | Slot for table (4912:2585) | 1 | 0/2 | 0/0 | 2/2 | — | no |
| `igdsx-item-edit-modal` | Item Edit Modal (4912:2597) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-inline-toast` | Inline Toast (49509:6905) | 12 | 0/24 | 0/0 | 2/2 | — | no |
| `igdsx-floating-toast` | Floating Toast (49558:7316) | 12 | 22/24 | 0/0 | 2/2 | — | no |
| `igdsx-attachment-49684-3481` | attachment (49684:3481) | 4 | 7/8 | 0/0 | 1/2 | — | no |
| `igdsx-step-indicator-horizontal-mobile-new` | Step Indicator Horizontal - Mobile new (50656:10694) | 216 | 390/432 | 0/0 | 2/2 | — | no |
| `igdsx-progress-bar-round` | Progress bar round (50693:10471) | 20 | 40/40 | 0/0 | 2/2 | — | yes |
| `igdsx-accordion-item` | .accordion-item (522:495) | 14 | 28/28 | 3/3 | 2/2 | — | yes |
| `igdsx-slot-522-643` | .Slot (522:643) | 1 | 1/2 | 0/0 | 2/2 | — | no |
| `igdsx-button-dots` | .Button dots (53173:56588) | 2 | 4/4 | 1/1 | 2/2 | — | yes |
| `igdsx-breadcrumbs-bar-desktop-overflow` | Breadcrumbs bar Desktop Overflow (53173:56947) | 4 | 2/8 | 0/0 | 2/2 | — | no |
| `igdsx-prompt-53251-21891` | Prompt (53251:21891) | 16 | 0/32 | 4/4 | 0/2 | — | no |
| `igdsx-input-prompt-53251-22036` | Input Prompt (53251:22036) | 14 | 0/28 | 3/3 | 0/2 | — | no |
| `igdsx-prompt-ai-53251-22465` | Prompt AI (53251:22465) | 2 | 4/4 | 0/0 | 0/2 | — | no |
| `igdsx-composer-ai-53251-22807` | Composer AI (53251:22807) | 24 | 20/48 | 0/0 | 0/2 | — | no |
| `igdsx-attachment-53251-23332` | attachment (53251:23332) | 4 | 6/8 | 0/0 | 1/2 | — | no |
| `igdsx-attachment-53251-23355` | attachment (53251:23355) | 4 | 7/8 | 0/0 | 1/2 | — | no |
| `igdsx-dots-option-01` | Dots / Option 01 (53251:27516) | 10 | 15/20 | 0/0 | 2/2 | — | no |
| `igdsx-step-list` | .Step List (53273:25289) | 2 | 0/4 | 0/0 | 2/2 | — | no |
| `igdsx-avatar-profile-55528-31835` | Avatar Profile (55528:31835) | 8 | 0/16 | 3/3 | 2/2 | — | no |
| `igdsx-avatar-profile-55528-39658` | Avatar Profile (55528:39658) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-button-overflow` | .Button overflow (55937:19634) | 3 | 6/6 | 2/2 | 2/2 | — | yes |
| `igdsx-il` | IL (55959:25164) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-country-code` | Country Code (55959:32597) | 2 | 2/4 | 0/0 | 2/2 | — | no |
| `igdsx-search-field-divided-serach` | Search Field Divided Serach (5680:4622) | 16 | 20/32 | 1/1 | 2/2 | — | no |
| `igdsx-list-583-2458` | .list (583:2458) | 12 | 20/24 | 0/0 | 2/2 | — | no |
| `igdsx-inline-toast1` | Inline Toast1 (58849:8026) | 10 | 0/20 | 0/0 | 2/2 | — | no |
| `igdsx-floating-toast1` | Floating Toast1 (58849:8450) | 10 | 20/20 | 0/0 | 2/2 | — | yes |
| `igdsx-input-field-horizontal` | Input Field / Horizontal (59066:7577) | 16 | 32/32 | 3/3 | 2/2 | — | yes |
| `igdsx-tags-lines` | Tags lines (5951:6247) | 12 | 24/24 | 0/0 | 2/2 | — | yes |
| `igdsx-button-pagination` | .Button Pagination (6016:2945) | 6 | 10/12 | 3/3 | 2/2 | — | no |
| `igdsx-button-pagination-6016-2991` | .Button Pagination/... (6016:2991) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-header-tablet` | Header Tablet (6030:8496) | 12 | 12/24 | 0/0 | 0/2 | — | no |
| `igdsx-button-default-link-small-true` | Button/Default/Link/Small/True (6073:15739) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-slider-knob` | Slider Knob (6146:23517) | 5 | 10/10 | 3/4 | 2/2 | — | no |
| `igdsx-numbered-pagination` | Numbered Pagination (6241:46646) | 4 | 8/8 | 0/0 | 0/2 | — | no |
| `igdsx-slider` | Slider (6371:21439) | 12 | 24/24 | 0/0 | 2/2 | — | yes |
| `igdsx-anchor` | Anchor (6632:5248) | 4 | 6/8 | 0/0 | 0/2 | — | no |
| `igdsx-checkbox-atom-700-1526` | .Checkbox/atom (700:1526) | 14 | 28/28 | 3/3 | 2/2 | — | yes |
| `igdsx-divider-708-2124` | Divider (708:2124) | 8 | 16/16 | 0/0 | 2/2 | — | yes |
| `igdsx-radio-button-atom` | Radio Button/atom (723:370) | 10 | 20/20 | 3/3 | 2/2 | — | yes |
| `igdsx-desktop-anchor-atom` | .Desktop Anchor Atom (7363:2159) | 8 | 6/16 | 3/3 | 2/2 | — | no |
| `igdsx-radio-button` | Radio Button (746:974) | 4 | 8/8 | 0/0 | 2/2 | — | yes |
| `igdsx-toogle-base-focused-not-active` | ⛔Toogle-base/Focused/Not-active (753:1588) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-toogle-base-disabled-false` | .Toogle-base/Disabled/False (753:1615) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-spin-box` | Spin Box (8022:10946) | 24 | 48/48 | 3/3 | 0/2 | — | no |
| `igdsx-input-field` | Input Field (81:115) | 16 | 32/32 | 3/3 | 2/2 | — | yes |
| `igdsx-input-field-default` | Input Field/Default (81:116) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button` | Button (81:1195) | 280 | 560/560 | 9/9 | 106/112 | 50/280 | no |
| `igdsx-button-false-default-medium-without-primary` | Button/False/Default/Medium/Without/Primary (81:1202) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-default-secondary-medium-true` | Button/Default/Secondary/Medium/True (81:1381) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-false-link-button-medium-default-without-true` | Button/False/Link Button/Medium/Default/Without/True (81:1846) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-false-link-button-medium-pressed-without-true` | Button/False/Link Button/Medium/Pressed/Without/True (81:1858) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-false-link-button-medium-focused-without-true` | Button/False/Link Button/Medium/Focused/Without/True (81:1864) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-button-false-link-button-small-default-without-true` | Button/False/Link Button/Small/Default/Without/True (8164:20433) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-notification-button-8372-6620` | Notification Button (8372:6620) | 9 | 18/18 | 0/0 | 0/2 | — | no |
| `igdsx-building-blocks-day` | .Building Blocks/Day (880:387) | 17 | 34/34 | 3/3 | 2/2 | — | yes |
| `igdsx-building-blocks-day-selected-focused` | .Building Blocks/Day/Selected/Focused (884:1342) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-left-nav-type` | .Left Nav type (8958:16415) | 12 | 4/24 | 0/0 | 0/2 | — | no |
| `igdsx-left-nav-type-text-true-true` | .Left Nav type/Text/True/True (8958:19990) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-tooltips` | Tooltips (898:98) | 24 | 0/48 | 0/0 | 0/2 | — | no |
| `igdsx-button-true-link-button-medium-default-only-true` | Button/True/Link Button/Medium/Default/Only/True (9130:1789) | 1 | 2/2 | 0/0 | 2/2 | — | yes |
| `igdsx-date-picker-calendar` | .Date Picker Calendar (914:1980) | 6 | 0/12 | 0/0 | 0/2 | — | no |
| `igdsx-building-blocks-year` | .Building Blocks/Year (914:2173) | 7 | 14/14 | 3/3 | 2/2 | — | yes |
| `igdsx-stamped` | Stamped (9592:205) | 2 | 4/4 | 0/0 | 2/2 | — | yes |
| `igdsx-segmented-control-items` | .Segmented Control Items (9612:347) | 96 | 134/192 | 3/3 | 2/2 | — | no |
| `igdsx-segmented-control-icon-items` | .Segmented Control Icon Items (9784:4768) | 48 | 34/96 | 3/3 | 2/2 | — | no |

Official components shipped unchanged (vendored, not yet verified against Figma): 73 tags from @igds/core-web.

## Design settings, icons, templates

| Kind | Items | Generated | Verified |
|---|---|---|---|
| token-collection | 13 | 0 | 0 |
| style-group | 4 | 0 | 0 |
| grid | 4 | 0 | 0 |
| icon-set | 233 | 0 | 0 |
| icon-component | 207 | 0 | 0 |
| pattern | 8 | 0 | 0 |
| layout | 12 | 0 | 0 |

## Excluded pages (recorded, not silently dropped)

| Page | Sets | Standalone | Reason |
|---|---|---|---|
| Bottom navigation - Mobile | 12 | 0 | native-mobile (decision D3) |
| 🚧Feedback | 0 | 1 | work-in-progress page (decision required) |
| Top navigation - Mobile | 3 | 0 | native-mobile (decision D3) |
| List - Mobile | 2 | 0 | native-mobile (decision D3) |
| 🚧Chatbot | 0 | 2 | work-in-progress page (decision required) |
| 🚧Chat AI | 6 | 1 | work-in-progress page (decision required) |
| 🚧Chat AI Pannel | 2 | 1 | work-in-progress page (decision required) |
| Card-Mobile | 1 | 0 | native-mobile (decision D3) |
| Hamburger - Mobile | 2 | 2 | native-mobile (decision D3) |
| Tabs-Mobile | 4 | 0 | native-mobile (decision D3) |
| Date picker - Mobile | 2 | 0 | native-mobile (decision D3) |
| Loader- mobile | 10 | 0 | native-mobile (decision D3) |

## Items with extracted specs

| Item | Kind | Variants in Figma | Extracted | Status | Spec |
|---|---|---|---|---|---|
| Avatar Profile/Large/Default (18691:19949) | standalone-component | 1 | 1 | done | `spec/sets/18691-19949.json` |
| Avatar Profile/Size3/Hover (18691:19951) | standalone-component | 1 | 1 | done | `spec/sets/18691-19951.json` |
| Avatar Profile/Large/Focused (18691:19953) | standalone-component | 1 | 1 | done | `spec/sets/18691-19953.json` |
| Avatar Profile/Large/Pressed (18691:19955) | standalone-component | 1 | 1 | done | `spec/sets/18691-19955.json` |
| .Raw Cell Item/Text/Default/False (2963:23495) | standalone-component | 1 | 1 | done | `spec/sets/2963-23495.json` |
| .Header Item./Text Nav Menu/False (3376:8728) | standalone-component | 1 | 1 | done | `spec/sets/3376-8728.json` |
| Unnumbered Pagination - carousel (35413:17121) | standalone-component | 1 | 1 | done | `spec/sets/35413-17121.json` |
| .Contact Us/line (36096:26282) | standalone-component | 1 | 1 | done | `spec/sets/36096-26282.json` |
| .Header item (36147:23938) | standalone-component | 1 | 1 | done | `spec/sets/36147-23938.json` |
| Mega Menu (37443:19061) | standalone-component | 1 | 1 | done | `spec/sets/37443-19061.json` |
| Frame 1261158065 (45091:29155) | standalone-component | 1 | 1 | done | `spec/sets/45091-29155.json` |
| carousel (45108:28145) | standalone-component | 1 | 1 | done | `spec/sets/45108-28145.json` |
| Search Field Filter (45166:206730) | standalone-component | 1 | 1 | done | `spec/sets/45166-206730.json` |
| Notification Button (45937:29522) | standalone-component | 1 | 1 | done | `spec/sets/45937-29522.json` |
| Header Desktop (45937:30134) | standalone-component | 1 | 1 | done | `spec/sets/45937-30134.json` |
| Table Raw (47903:206067) | standalone-component | 1 | 1 | done | `spec/sets/47903-206067.json` |
| Tripple floating toast_new (49723:9561) | standalone-component | 1 | 1 | done | `spec/sets/49723-9561.json` |
| .list/Single Selection/True (583:307) | standalone-component | 1 | 1 | done | `spec/sets/583-307.json` |
| Table Raw Expanded Content (7843:5264) | standalone-component | 1 | 1 | done | `spec/sets/7843-5264.json` |
| .Content (1075:171) | building-block | 9 | 9 | done | `spec/sets/1075-171.json` |
| .Search Field List Item (1093:2153) | building-block | 8 | 8 | done | `spec/sets/1093-2153.json` |
| Search Field Regular (1093:5843) | component-set | 14 | 14 | done | `spec/sets/1093-5843.json` |
| Search Field/Regular/False/False/Default (1093:5857) | dependency | 1 | 1 | done | `spec/sets/1093-5857.json` |
| .Search Field List (1093:8727) | building-block | 4 | 4 | done | `spec/sets/1093-8727.json` |
| .Card Media-Vertical Large (11160:15038) | building-block | 6 | 6 | done | `spec/sets/11160-15038.json` |
| .Card Media-Vertical Small (11160:15049) | building-block | 4 | 4 | done | `spec/sets/11160-15049.json` |
| .Card Media-Horizontal Small (11197:1141) | building-block | 2 | 2 | done | `spec/sets/11197-1141.json` |
| .Card Media-Horizontal Large (11197:1212) | building-block | 2 | 2 | done | `spec/sets/11197-1212.json` |
| Media Desktop (11233:12150) | component-set | 2 | 2 | done | `spec/sets/11233-12150.json` |
| Card (1140:935) | component-set | 54 | 54 | done | `spec/sets/1140-935.json` |
| Progress Bar (1141:2263) | component-set | 12 | 12 | done | `spec/sets/1141-2263.json` |
| Search Field Hero (1142:3462) | component-set | 10 | 10 | done | `spec/sets/1142-3462.json` |
| Card full picture+name (11657:21926) | component-set | 24 | 24 | done | `spec/sets/11657-21926.json` |
| Card full picture+name/True/Default/Small/Clickable/Light (11657:22213) | dependency | 1 | 1 | done | `spec/sets/11657-22213.json` |
| .logo (12027:48574) | building-block | 9 | 9 | done | `spec/sets/12027-48574.json` |
| .Logo Type (12223:10424) | building-block | 2 | 2 | done | `spec/sets/12223-10424.json` |
| .Logo Placeholder (12223:10678) | building-block | 2 | 2 | done | `spec/sets/12223-10678.json` |
| Media Mobile (12910:1214) | component-set | 2 | 2 | done | `spec/sets/12910-1214.json` |
| Search Field Filter (13275:2104) | component-set | 4 | 4 | done | `spec/sets/13275-2104.json` |
| close (138:1012) | dependency | 1 | 1 | done | `spec/sets/138-1012.json` |
| minus (138:1015) | dependency | 1 | 1 | done | `spec/sets/138-1015.json` |
|  search (138:1086) | dependency | 1 | 1 | done | `spec/sets/138-1086.json` |
| Info (138:1119) | dependency | 0 | 0 | done | `spec/sets/138-1119.json` |
| help (138:1129) | dependency | 0 | 0 | done | `spec/sets/138-1129.json` |
| Loader (138:818) | dependency | 1 | 1 | done | `spec/sets/138-818.json` |
| block (138:827) | dependency | 1 | 1 | done | `spec/sets/138-827.json` |
| in-progress (138:830) | dependency | 1 | 1 | done | `spec/sets/138-830.json` |
| Alert-Circle (138:842) | dependency | 0 | 0 | done | `spec/sets/138-842.json` |
| Success (138:852) | dependency | 0 | 0 | done | `spec/sets/138-852.json` |
| shekels (138:909) | dependency | 1 | 1 | done | `spec/sets/138-909.json` |
| Side Bar Icon Item (14302:10147) | component-set | 5 | 5 | done | `spec/sets/14302-10147.json` |
| Facebook (14394:13) | component-set | 6 | 6 | done | `spec/sets/14394-13.json` |
| Whatsapp (14394:561) | component-set | 6 | 6 | done | `spec/sets/14394-561.json` |
| Instagram (14394:912) | component-set | 6 | 6 | done | `spec/sets/14394-912.json` |
| Linkdin (14394:935) | component-set | 6 | 6 | done | `spec/sets/14394-935.json` |
| Twiter (14394:948) | component-set | 3 | 3 | done | `spec/sets/14394-948.json` |
| TikTok (14433:3) | component-set | 6 | 6 | done | `spec/sets/14433-3.json` |
| YouTube (14433:48) | component-set | 6 | 6 | done | `spec/sets/14433-48.json` |
| Pinterest (14445:537) | component-set | 3 | 3 | done | `spec/sets/14445-537.json` |
| Spotify (14445:550) | component-set | 6 | 6 | done | `spec/sets/14445-550.json` |
| Share via social links (14532:5237) | component-set | 24 | 24 | done | `spec/sets/14532-5237.json` |
| threads (14532:6) | component-set | 3 | 3 | done | `spec/sets/14532-6.json` |
| .Atom Face-rating (15096:234) | building-block | 25 | 25 | done | `spec/sets/15096-234.json` |
| Face Rating (15110:7625) | component-set | 2 | 2 | done | `spec/sets/15110-7625.json` |
| .star-rating (15204:8855) | building-block | 6 | 6 | done | `spec/sets/15204-8855.json` |
| Navigation Menu (1538:4181) | component-set | 8 | 8 | done | `spec/sets/1538-4181.json` |
| Navigation Menu/Desktop/False (1538:4182) | dependency | 1 | 1 | done | `spec/sets/1538-4182.json` |
| Contextual Menu (1538:5210) | component-set | 8 | 8 | done | `spec/sets/1538-5210.json` |
| .Tab item (1558:7023) | building-block | 5 | 5 | done | `spec/sets/1558-7023.json` |
| Footer (15777:13868) | component-set | 7 | 7 | done | `spec/sets/15777-13868.json` |
| .Link list footer (15814:13065) | building-block | 4 | 4 | done | `spec/sets/15814-13065.json` |
| Footer/Small/Mobile (15843:2538) | dependency | 1 | 1 | done | `spec/sets/15843-2538.json` |
| .News Letter Sign up (15843:3059) | building-block | 2 | 2 | done | `spec/sets/15843-3059.json` |
| Rich Text Editor (15909:10686) | component-set | 12 | 12 | done | `spec/sets/15909-10686.json` |
| .Spotlight Content (16388:11439) | building-block | 8 | 8 | done | `spec/sets/16388-11439.json` |
| Spotlight (16388:11917) | component-set | 24 | 24 | done | `spec/sets/16388-11917.json` |
| Badge (1646:12) | component-set | 10 | 10 | done | `spec/sets/1646-12.json` |
| Phone Number Input Field (16979:8852) | component-set | 16 | 16 | done | `spec/sets/16979-8852.json` |
| .Avatar (17390:2536) | building-block | 8 | 8 | done | `spec/sets/17390-2536.json` |
| .Time Picker List Atom (17726:66256) | building-block | 5 | 5 | done | `spec/sets/17726-66256.json` |
| .Time Picker Input (17726:66552) | building-block | 6 | 6 | done | `spec/sets/17726-66552.json` |
| .Step Indicator Horizontal-Compact (17846:1461) | building-block | 8 | 8 | done | `spec/sets/17846-1461.json` |
| Floating Button (1798:2270) | component-set | 40 | 40 | done | `spec/sets/1798-2270.json` |
| .Split-Button (18588:16465) | building-block | 60 | 60 | done | `spec/sets/18588-16465.json` |
| .Dropdown Button (18588:16662) | building-block | 60 | 60 | done | `spec/sets/18588-16662.json` |
| Signature (18697:12046) | component-set | 2 | 2 | done | `spec/sets/18697-12046.json` |
| .Signature File Upload (18711:4102) | building-block | 26 | 26 | done | `spec/sets/18711-4102.json` |
| .Hand Signature (18711:4679) | building-block | 10 | 10 | done | `spec/sets/18711-4679.json` |
| checkmark (1893:6572) | dependency | 0 | 0 | done | `spec/sets/1893-6572.json` |
| Updates/horizontal (19332:10398) | component-set | 14 | 14 | done | `spec/sets/19332-10398.json` |
| .Update text (19332:11494) | dependency | 1 | 1 | done | `spec/sets/19332-11494.json` |
| ⛔Toogle-base/Focused/Active (1945:8909) | dependency | 1 | 1 | done | `spec/sets/1945-8909.json` |
| Error message (19910:9507) | component-set | 4 | 4 | done | `spec/sets/19910-9507.json` |
| Split Button (20260:10392) | component-set | 24 | 24 | done | `spec/sets/20260-10392.json` |
| heart (205:183) | dependency | 0 | 0 | done | `spec/sets/205-183.json` |
| Numeric Badge (2078:3425) | component-set | 2 | 2 | done | `spec/sets/2078-3425.json` |
| Chevron (23064:341) | dependency | 0 | 0 | done | `spec/sets/23064-341.json` |
| Single File Upload (2366:1172) | component-set | 26 | 26 | done | `spec/sets/2366-1172.json` |
| Single File Upload/True/Loading/Default (2366:1205) | dependency | 1 | 1 | done | `spec/sets/2366-1205.json` |
| Multiple Files Upload-Upload Area (2366:1286) | component-set | 10 | 10 | done | `spec/sets/2366-1286.json` |
| Multiple Files Upload (2366:1331) | component-set | 12 | 12 | done | `spec/sets/2366-1331.json` |
| Multiple Files Upload-Added File (2366:1460) | component-set | 18 | 18 | done | `spec/sets/2366-1460.json` |
|  cloud-upload (2366:610) | dependency | 1 | 1 | done | `spec/sets/2366-610.json` |
|  trash (2366:613) | dependency | 1 | 1 | done | `spec/sets/2366-613.json` |
| Loader (2366:616) | dependency | 1 | 1 | done | `spec/sets/2366-616.json` |
| Success (2366:622) | dependency | 0 | 0 | done | `spec/sets/2366-622.json` |
| alert-circle (2366:630) | dependency | 0 | 0 | done | `spec/sets/2366-630.json` |
| .Connecting Track (2382:817) | building-block | 12 | 12 | done | `spec/sets/2382-817.json` |
| .Bottom Image (24631:8259) | dependency | 3 | 3 | done | `spec/sets/24631-8259.json` |
| Banner (2492:4291) | component-set | 12 | 12 | done | `spec/sets/2492-4291.json` |
| .Secondary Action (2495:1706) | dependency | 0 | 0 | done | `spec/sets/2495-1706.json` |
| .Step Status (29393:2182) | building-block | 5 | 5 | done | `spec/sets/29393-2182.json` |
| .Connecting Track (29393:2223) | building-block | 6 | 6 | done | `spec/sets/29393-2223.json` |
| .Column Header Cell Item (2945:20132) | building-block | 26 | 26 | done | `spec/sets/2945-20132.json` |
| .Raw Cell Item (2963:23496) | building-block | 93 | 93 | done | `spec/sets/2963-23496.json` |
| .Raw Cell Item/Empty/Default/False/True (2963:23630) | dependency | 1 | 1 | done | `spec/sets/2963-23630.json` |
| Chat Input (29927:20119) | component-set | 24 | 24 | done | `spec/sets/29927-20119.json` |
| .Sub-Step Unclickable (30756:3436) | building-block | 3 | 3 | done | `spec/sets/30756-3436.json` |
| .Sub Step Uncklickble (30762:3283) | building-block | 6 | 6 | done | `spec/sets/30762-3283.json` |
| .Sub-Steps/Interactive/True (30787:10276) | dependency | 1 | 1 | done | `spec/sets/30787-10276.json` |
| .Sub-Steps (30787:10277) | building-block | 2 | 2 | done | `spec/sets/30787-10277.json` |
| .Step Indicator Vertical (30787:22860) | building-block | 11 | 11 | done | `spec/sets/30787-22860.json` |
| .Content/True/Large/Vertical/False (30849:5512) | dependency | 1 | 1 | done | `spec/sets/30849-5512.json` |
| .Step Indicator Horizontal (30876:2516) | building-block | 10 | 10 | done | `spec/sets/30876-2516.json` |
| .Step Indicator Horizontal - Mobile (31084:32184) | building-block | 10 | 10 | done | `spec/sets/31084-32184.json` |
| .List Item (3109:26156) | building-block | 8 | 8 | done | `spec/sets/3109-26156.json` |
| List (3109:26184) | component-set | 6 | 6 | done | `spec/sets/3109-26184.json` |
| Quick Answers - Chips (31417:1450) | component-set | 11 | 11 | done | `spec/sets/31417-1450.json` |
| Vertical Filter Item (3168:1715) | component-set | 24 | 24 | done | `spec/sets/3168-1715.json` |
| Header Desktop (3239:13099) | component-set | 16 | 16 | done | `spec/sets/3239-13099.json` |
| Header Mobile (3239:18954) | component-set | 20 | 20 | done | `spec/sets/3239-18954.json` |
| Step Indicator Horizontal - Mobile - Round (32526:5885) | component-set | 4 | 4 | done | `spec/sets/32526-5885.json` |
| Image (33675:4264) | dependency | 0 | 0 | done | `spec/sets/33675-4264.json` |
| .Checkbox/atom (33675:4312) | dependency | 0 | 0 | done | `spec/sets/33675-4312.json` |
| .Header Item. (3376:8729) | dependency | 0 | 0 | done | `spec/sets/3376-8729.json` |
| .Scrollbar Height (3412:2067) | building-block | 3 | 3 | done | `spec/sets/3412-2067.json` |
| Scroll (3412:7859) | component-set | 3 | 3 | done | `spec/sets/3412-7859.json` |
| .Skeleton animation (3412:9395) | building-block | 3 | 3 | done | `spec/sets/3412-9395.json` |
| Skeleton (3412:9440) | component-set | 5 | 5 | done | `spec/sets/3412-9440.json` |
| Loader 24px (3421:12342) | component-set | 4 | 4 | done | `spec/sets/3421-12342.json` |
| Loader 48px (3421:13223) | component-set | 4 | 4 | done | `spec/sets/3421-13223.json` |
| .Progress Bar/Track Item (3421:32781) | building-block | 10 | 10 | done | `spec/sets/3421-32781.json` |
| Toggle (35020:24197) | component-set | 2 | 2 | done | `spec/sets/35020-24197.json` |
| .List Header (35020:7570) | building-block | 6 | 6 | done | `spec/sets/35020-7570.json` |
| Dropdown (35069:17714) | component-set | 28 | 28 | done | `spec/sets/35069-17714.json` |
| Radio Button Cards (35074:88329) | component-set | 36 | 36 | done | `spec/sets/35074-88329.json` |
| .Atom+Label+Input (35082:8619) | building-block | 24 | 24 | done | `spec/sets/35082-8619.json` |
| Text Area (3519:2599) | component-set | 12 | 12 | done | `spec/sets/3519-2599.json` |
| Checkbox card_new (35207:4353) | component-set | 40 | 40 | done | `spec/sets/35207-4353.json` |
| .Checkbox+Label+Input (35216:29603) | building-block | 24 | 24 | done | `spec/sets/35216-29603.json` |
| Checkbox vertical/horizontal (35216:29991) | component-set | 4 | 4 | done | `spec/sets/35216-29991.json` |
| Button (35235:1144) | dependency | 0 | 0 | done | `spec/sets/35235-1144.json` |
| heart (35235:2953) | dependency | 0 | 0 | done | `spec/sets/35235-2953.json` |
| Divider (35235:2970) | dependency | 0 | 0 | done | `spec/sets/35235-2970.json` |
| Tabs (35262:11268) | component-set | 4 | 4 | done | `spec/sets/35262-11268.json` |
| .Tab item (35262:16807) | building-block | 12 | 12 | done | `spec/sets/35262-16807.json` |
| Notification Button (35262:5506) | component-set | 18 | 18 | done | `spec/sets/35262-5506.json` |
| .Tag (35297:24549) | building-block | 40 | 40 | done | `spec/sets/35297-24549.json` |
| .Breadcrumbs/atom new (35333:33475) | building-block | 10 | 10 | done | `spec/sets/35333-33475.json` |
| Breadcrumbs bar Desktop new (35333:41557) | component-set | 8 | 8 | done | `spec/sets/35333-41557.json` |
| Avatar Profile/False/False (35394:1210) | dependency | 1 | 1 | done | `spec/sets/35394-1210.json` |
| Avatar Profile/True/False (35394:1328) | dependency | 1 | 1 | done | `spec/sets/35394-1328.json` |
| .Sub-Steps/Interactive/False (35404:4700) | dependency | 1 | 1 | done | `spec/sets/35404-4700.json` |
| Step indicator Vertical (35409:4183) | component-set | 2 | 2 | done | `spec/sets/35409-4183.json` |
| .Ellipse carousel (35413:17098) | building-block | 2 | 2 | done | `spec/sets/35413-17098.json` |
| card Item List (35608:12820) | component-set | 50 | 50 | done | `spec/sets/35608-12820.json` |
| .Menu List (35735:12138) | building-block | 2 | 2 | done | `spec/sets/35735-12138.json` |
| Star Rating (35744:129279) | component-set | 2 | 2 | done | `spec/sets/35744-129279.json` |
| Horizontal Filter (35782:43322) | component-set | 2 | 2 | done | `spec/sets/35782-43322.json` |
| Modal (35785:8979) | component-set | 4 | 4 | done | `spec/sets/35785-8979.json` |
| Segmented Control Icon only (35855:33030) | component-set | 6 | 6 | done | `spec/sets/35855-33030.json` |
| Segmented Control Default (35855:34246) | component-set | 8 | 8 | done | `spec/sets/35855-34246.json` |
| Date Picker (35900:13376) | component-set | 4 | 4 | done | `spec/sets/35900-13376.json` |
| Date Range (35903:11333) | component-set | 2 | 2 | done | `spec/sets/35903-11333.json` |
| Time Picker (35945:25813) | component-set | 6 | 6 | done | `spec/sets/35945-25813.json` |
| .Time Picker List (35952:27805) | building-block | 2 | 2 | done | `spec/sets/35952-27805.json` |
| Button/False/Default/Link/Small/False (36034:65678) | dependency | 1 | 1 | done | `spec/sets/36034-65678.json` |
| Button/False/Disabled/Link/Small/False (36034:65768) | dependency | 1 | 1 | done | `spec/sets/36034-65768.json` |
| .Link list footer (36096:19141) | dependency | 0 | 0 | done | `spec/sets/36096-19141.json` |
| .Content/True/Large/Horizontal/True (36102:50478) | dependency | 1 | 1 | done | `spec/sets/36102-50478.json` |
| .Content/False/Large/Horizontal/True (36123:8064) | dependency | 1 | 1 | done | `spec/sets/36123-8064.json` |
| Walkthrough - Modal (36336:7501) | component-set | 8 | 8 | done | `spec/sets/36336-7501.json` |
| Accordion (36363:22776) | component-set | 3 | 3 | done | `spec/sets/36363-22776.json` |
| .Slot (36363:8451) | dependency | 1 | 1 | done | `spec/sets/36363-8451.json` |
| .List Item Atom (36363:9250) | building-block | 48 | 48 | done | `spec/sets/36363-9250.json` |
| Message (36403:35282) | component-set | 12 | 12 | done | `spec/sets/36403-35282.json` |
| .Avatar Profile (36403:36657) | building-block | 2 | 2 | done | `spec/sets/36403-36657.json` |
| .progress timed button (36406:73837) | building-block | 32 | 32 | done | `spec/sets/36406-73837.json` |
| .Typing (36410:75032) | building-block | 8 | 8 | done | `spec/sets/36410-75032.json` |
| carousel (36417:70941) | component-set | 10 | 10 | done | `spec/sets/36417-70941.json` |
| ⛔Check box Cell Item (36468:41567) | dependency | 0 | 0 | done | `spec/sets/36468-41567.json` |
| .Expand Cell Item (36468:41590) | dependency | 0 | 0 | done | `spec/sets/36468-41590.json` |
| .⛔ More Cell Item (36468:41604) | dependency | 0 | 0 | done | `spec/sets/36468-41604.json` |
| .⛔ Empty Cell Item (36468:41611) | dependency | 0 | 0 | done | `spec/sets/36468-41611.json` |
| Small Cell Item (36468:44093) | component-set | 56 | 56 | done | `spec/sets/36468-44093.json` |
| Table Raw (36522:29244) | component-set | 10 | 10 | done | `spec/sets/36522-29244.json` |
| .Media Place Holder (36524:27170) | dependency | 0 | 0 | done | `spec/sets/36524-27170.json` |
| .Details (36640:85663) | building-block | 4 | 4 | done | `spec/sets/36640-85663.json` |
| .Face rating (36681:10084) | building-block | 10 | 10 | done | `spec/sets/36681-10084.json` |
| .List Menu Item (36756:41615) | building-block | 4 | 4 | done | `spec/sets/36756-41615.json` |
| .List Item Atom (36849:25636) | building-block | 6 | 6 | done | `spec/sets/36849-25636.json` |
| .Vertical update item (36951:3690) | building-block | 2 | 2 | done | `spec/sets/36951-3690.json` |
| Updates (36951:3863) | component-set | 2 | 2 | done | `spec/sets/36951-3863.json` |
| .Update text (36951:4740) | building-block | 4 | 4 | done | `spec/sets/36951-4740.json` |
| .Card Media-Vertical Small/Image/Big (37101:21861) | dependency | 1 | 1 | done | `spec/sets/37101-21861.json` |
| Mega Menu Atom (37471:34289) | component-set | 2 | 2 | done | `spec/sets/37471-34289.json` |
| Step Indicator Horizontal (37884:2662) | component-set | 2 | 2 | done | `spec/sets/37884-2662.json` |
| Step Indicator Horizontal - Compact (37884:2997) | component-set | 2 | 2 | done | `spec/sets/37884-2997.json` |
| .List Footer (38610:21106) | building-block | 2 | 2 | done | `spec/sets/38610-21106.json` |
| stars_ai (39280:20282) | dependency | 0 | 0 | done | `spec/sets/39280-20282.json` |
| Mega Menu Atoms (40231:29533) | component-set | 3 | 3 | done | `spec/sets/40231-29533.json` |
| Chatbot (41623:5493) | dependency | 0 | 0 | done | `spec/sets/41623-5493.json` |
| .Tab Vertical item (41636:7217) | building-block | 10 | 10 | done | `spec/sets/41636-7217.json` |
| Card full picture (43124:36813) | component-set | 36 | 36 | done | `spec/sets/43124-36813.json` |
| .Secondary Action (43564:97440) | building-block | 4 | 4 | done | `spec/sets/43564-97440.json` |
| Alert-Circle (43615:16771) | dependency | 0 | 0 | done | `spec/sets/43615-16771.json` |
| Button (43615:16863) | dependency | 0 | 0 | done | `spec/sets/43615-16863.json` |
| Info (43615:17688) | dependency | 0 | 0 | done | `spec/sets/43615-17688.json` |
| 2stars_ai (43615:17705) | dependency | 0 | 0 | done | `spec/sets/43615-17705.json` |
| Success (43615:17718) | dependency | 0 | 0 | done | `spec/sets/43615-17718.json` |
| Inline Toast old (43615:17991) | component-set | 10 | 10 | done | `spec/sets/43615-17991.json` |
| Prompt AI (44489:10047) | component-set | 2 | 2 | done | `spec/sets/44489-10047.json` |
| Prompt (44489:9473) | component-set | 16 | 16 | done | `spec/sets/44489-9473.json` |
| Input Prompt (44489:9618) | component-set | 14 | 14 | done | `spec/sets/44489-9618.json` |
| Loader 24px- Inverted (4463:6947) | component-set | 4 | 4 | done | `spec/sets/4463-6947.json` |
| Email (44722:14183) | dependency | 0 | 0 | done | `spec/sets/44722-14183.json` |
| Document (44958:28992) | dependency | 0 | 0 | done | `spec/sets/44958-28992.json` |
| Kpi_Cards (44958:29285) | component-set | 40 | 40 | done | `spec/sets/44958-29285.json` |
| .Left Nav type_old (45150:193927) | building-block | 8 | 8 | done | `spec/sets/45150-193927.json` |
| Google (45309:19505) | dependency | 0 | 0 | done | `spec/sets/45309-19505.json` |
| .Progress Bar/Track Item (45684:6867) | building-block | 10 | 10 | done | `spec/sets/45684-6867.json` |
| mic  (4569:26721) | dependency | 1 | 1 | done | `spec/sets/4569-26721.json` |
| progress bar (45744:10328) | component-set | 20 | 20 | done | `spec/sets/45744-10328.json` |
| Text Buttons Container (45937:29876) | dependency | 1 | 1 | done | `spec/sets/45937-29876.json` |
| .Card Media-Vertical Small (46144:13628) | building-block | 4 | 4 | done | `spec/sets/46144-13628.json` |
| Progress Bar (46144:13919) | component-set | 12 | 12 | done | `spec/sets/46144-13919.json` |
| close (46582:9745) | dependency | 0 | 0 | done | `spec/sets/46582-9745.json` |
| Floating Button (46807:17608) | dependency | 0 | 0 | done | `spec/sets/46807-17608.json` |
| Scroll (46807:17701) | dependency | 0 | 0 | done | `spec/sets/46807-17701.json` |
| Composer AI (46807:18036) | component-set | 24 | 24 | done | `spec/sets/46807-18036.json` |
| attachment (46807:18576) | component-set | 4 | 4 | done | `spec/sets/46807-18576.json` |
| attachment/File/False (46807:18577) | dependency | 1 | 1 | done | `spec/sets/46807-18577.json` |
| attachment/Image/False (46807:18584) | dependency | 1 | 1 | done | `spec/sets/46807-18584.json` |
| sort (4729:10049) | dependency | 0 | 0 | done | `spec/sets/4729-10049.json` |
| .Toogle-base (48397:10258) | building-block | 8 | 8 | done | `spec/sets/48397-10258.json` |
| shekels (48397:3908) | dependency | 1 | 1 | done | `spec/sets/48397-3908.json` |
| Chevron (48397:3917) | dependency | 0 | 0 | done | `spec/sets/48397-3917.json` |
| .Checkbox/atom (48397:3931) | dependency | 0 | 0 | done | `spec/sets/48397-3931.json` |
| Input Field - Atom (48397:4009) | building-block | 14 | 14 | done | `spec/sets/48397-4009.json` |
| Media Place Holder (48397:4052) | building-block | 4 | 4 | done | `spec/sets/48397-4052.json` |
| .List Item Atom (48397:4064) | building-block | 48 | 48 | done | `spec/sets/48397-4064.json` |
| Button (48406:10749) | building-block | 190 | 190 | done | `spec/sets/48406-10749.json` |
| Divider (48406:13136) | building-block | 8 | 8 | done | `spec/sets/48406-13136.json` |
| 2Stars-AI (48523:38166) | dependency | 6 | 6 | done | `spec/sets/48523-38166.json` |
| help (48523:38357) | dependency | 6 | 6 | done | `spec/sets/48523-38357.json` |
| Document (48523:39820) | building-block | 24 | 24 | done | `spec/sets/48523-39820.json` |
| Google (48523:40779) | building-block | 6 | 6 | done | `spec/sets/48523-40779.json` |
| Success (48523:41085) | dependency | 6 | 6 | done | `spec/sets/48523-41085.json` |
| Alert-Triangle (48523:41100) | dependency | 6 | 6 | done | `spec/sets/48523-41100.json` |
| Alert-Circle (48523:41255) | dependency | 12 | 12 | done | `spec/sets/48523-41255.json` |
| Home (48523:41447) | dependency | 6 | 6 | done | `spec/sets/48523-41447.json` |
| Slot for table (4912:2585) | dependency | 1 | 1 | done | `spec/sets/4912-2585.json` |
| Item Edit Modal (4912:2597) | component-set | 10 | 10 | done | `spec/sets/4912-2597.json` |
| Inline Toast (49509:6905) | component-set | 12 | 12 | done | `spec/sets/49509-6905.json` |
| Floating Toast (49558:7316) | component-set | 12 | 12 | done | `spec/sets/49558-7316.json` |
| attachment (49684:3481) | component-set | 4 | 4 | done | `spec/sets/49684-3481.json` |
| Floating Toast (49723:8860) | dependency | 0 | 0 | done | `spec/sets/49723-8860.json` |
| Step Indicator Horizontal - Mobile new (50656:10694) | component-set | 216 | 216 | done | `spec/sets/50656-10694.json` |
| Track (50665:12762) | dependency | 0 | 0 | done | `spec/sets/50665-12762.json` |
| Progress bar round (50693:10471) | component-set | 20 | 20 | done | `spec/sets/50693-10471.json` |
| .accordion-item (522:495) | building-block | 14 | 14 | done | `spec/sets/522-495.json` |
| .Slot (522:643) | dependency | 1 | 1 | done | `spec/sets/522-643.json` |
| .Button dots (53173:56588) | building-block | 2 | 2 | done | `spec/sets/53173-56588.json` |
| Breadcrumbs bar Desktop Overflow (53173:56947) | component-set | 4 | 4 | done | `spec/sets/53173-56947.json` |
| Prompt (53251:21891) | component-set | 16 | 16 | done | `spec/sets/53251-21891.json` |
| Input Prompt (53251:22036) | component-set | 14 | 14 | done | `spec/sets/53251-22036.json` |
| Prompt AI (53251:22465) | component-set | 2 | 2 | done | `spec/sets/53251-22465.json` |
| Composer AI (53251:22807) | component-set | 24 | 24 | done | `spec/sets/53251-22807.json` |
| attachment (53251:23332) | component-set | 4 | 4 | done | `spec/sets/53251-23332.json` |
| attachment (53251:23355) | component-set | 4 | 4 | done | `spec/sets/53251-23355.json` |
| Dots / Option 01 (53251:27516) | component-set | 10 | 10 | done | `spec/sets/53251-27516.json` |
| .Step List (53273:25289) | building-block | 2 | 2 | done | `spec/sets/53273-25289.json` |
| Avatar Profile (55528:31835) | component-set | 8 | 8 | done | `spec/sets/55528-31835.json` |
| Avatar Profile (55528:39658) | component-set | 4 | 4 | done | `spec/sets/55528-39658.json` |
| .Button overflow (55937:19634) | building-block | 3 | 3 | done | `spec/sets/55937-19634.json` |
| help (55959:25157) | dependency | 0 | 0 | done | `spec/sets/55959-25157.json` |
| IL (55959:25164) | dependency | 1 | 1 | done | `spec/sets/55959-25164.json` |
| Button (55959:25173) | dependency | 0 | 0 | done | `spec/sets/55959-25173.json` |
| Divider (55959:25993) | dependency | 0 | 0 | done | `spec/sets/55959-25993.json` |
| Info (55959:26010) | dependency | 0 | 0 | done | `spec/sets/55959-26010.json` |
| Alert-Circle (55959:26017) | dependency | 0 | 0 | done | `spec/sets/55959-26017.json` |
| .list (55959:26717) | dependency | 0 | 0 | done | `spec/sets/55959-26717.json` |
| Country Code (55959:32597) | component-set | 2 | 2 | done | `spec/sets/55959-32597.json` |
| Search Field Divided Serach (5680:4622) | component-set | 16 | 16 | done | `spec/sets/5680-4622.json` |
| .List Item  (583:1041) | dependency | 0 | 0 | done | `spec/sets/583-1041.json` |
| .list (583:2458) | building-block | 12 | 12 | done | `spec/sets/583-2458.json` |
| Inline Toast1 (58849:8026) | component-set | 10 | 10 | done | `spec/sets/58849-8026.json` |
| Floating Toast1 (58849:8450) | component-set | 10 | 10 | done | `spec/sets/58849-8450.json` |
| Input Field / Horizontal (59066:7577) | component-set | 16 | 16 | done | `spec/sets/59066-7577.json` |
| Tags lines (5951:6247) | component-set | 12 | 12 | done | `spec/sets/5951-6247.json` |
| .Button Pagination (6016:2945) | building-block | 6 | 6 | done | `spec/sets/6016-2945.json` |
| .Button Pagination/... (6016:2991) | dependency | 1 | 1 | done | `spec/sets/6016-2991.json` |
| Header Tablet (6030:8496) | component-set | 12 | 12 | done | `spec/sets/6030-8496.json` |
| Button/Default/Link/Small/True (6073:15739) | dependency | 1 | 1 | done | `spec/sets/6073-15739.json` |
| Slider Knob (6146:23517) | component-set | 5 | 5 | done | `spec/sets/6146-23517.json` |
| .arrows carousel (6237:38241) | dependency | 0 | 0 | done | `spec/sets/6237-38241.json` |
| Unnumbered Pagination - carousel (6237:38258) | dependency | 0 | 0 | done | `spec/sets/6237-38258.json` |
| Person (6239:322) | dependency | 0 | 0 | done | `spec/sets/6239-322.json` |
| Document (6239:5749) | dependency | 0 | 0 | done | `spec/sets/6239-5749.json` |
| Numbered Pagination (6241:46646) | component-set | 4 | 4 | done | `spec/sets/6241-46646.json` |
| Folder (6245:6869) | dependency | 0 | 0 | done | `spec/sets/6245-6869.json` |
| Close (6250:16038) | dependency | 0 | 0 | done | `spec/sets/6250-16038.json` |
| Image (6299:48) | dependency | 0 | 0 | done | `spec/sets/6299-48.json` |
| Clock (6304:4179) | dependency | 0 | 0 | done | `spec/sets/6304-4179.json` |
| Slider (6371:21439) | component-set | 12 | 12 | done | `spec/sets/6371-21439.json` |
| Funnel (6391:20021) | dependency | 0 | 0 | done | `spec/sets/6391-20021.json` |
| Home (6391:20023) | dependency | 0 | 0 | done | `spec/sets/6391-20023.json` |
| Anchor (6632:5248) | component-set | 4 | 4 | done | `spec/sets/6632-5248.json` |
| .Checkbox/atom (700:1526) | building-block | 14 | 14 | done | `spec/sets/700-1526.json` |
| Divider (708:2124) | component-set | 8 | 8 | done | `spec/sets/708-2124.json` |
| Radio Button/atom (723:370) | building-block | 10 | 10 | done | `spec/sets/723-370.json` |
| carousel (7240:4396) | dependency | 0 | 0 | done | `spec/sets/7240-4396.json` |
| .Desktop Anchor Atom (7363:2159) | building-block | 8 | 8 | done | `spec/sets/7363-2159.json` |
| Radio Button (746:974) | component-set | 4 | 4 | done | `spec/sets/746-974.json` |
| .Toogle-base (753:1095) | dependency | 0 | 0 | done | `spec/sets/753-1095.json` |
| ⛔Toogle-base/Focused/Not-active (753:1588) | dependency | 1 | 1 | done | `spec/sets/753-1588.json` |
| .Toogle-base/Disabled/False (753:1615) | dependency | 1 | 1 | done | `spec/sets/753-1615.json` |
| Spin Box (8022:10946) | component-set | 24 | 24 | done | `spec/sets/8022-10946.json` |
| Input Field (81:115) | component-set | 16 | 16 | done | `spec/sets/81-115.json` |
| Input Field/Default (81:116) | dependency | 1 | 1 | done | `spec/sets/81-116.json` |
| Button (81:1195) | component-set | 280 | 280 | done | `spec/sets/81-1195.json` |
| Button/False/Default/Medium/Without/Primary (81:1202) | dependency | 1 | 1 | done | `spec/sets/81-1202.json` |
| Button/Default/Secondary/Medium/True (81:1381) | dependency | 1 | 1 | done | `spec/sets/81-1381.json` |
| Button/False/Link Button/Medium/Default/Without/True (81:1846) | dependency | 1 | 1 | done | `spec/sets/81-1846.json` |
| Button/False/Link Button/Medium/Pressed/Without/True (81:1858) | dependency | 1 | 1 | done | `spec/sets/81-1858.json` |
| Button/False/Link Button/Medium/Focused/Without/True (81:1864) | dependency | 1 | 1 | done | `spec/sets/81-1864.json` |
| Button/False/Link Button/Small/Default/Without/True (8164:20433) | dependency | 1 | 1 | done | `spec/sets/8164-20433.json` |
| Notification Button (8372:6620) | component-set | 9 | 9 | done | `spec/sets/8372-6620.json` |
| .Building Blocks/Day (880:387) | building-block | 17 | 17 | done | `spec/sets/880-387.json` |
| .Building Blocks/Day/Selected/Focused (884:1342) | dependency | 1 | 1 | done | `spec/sets/884-1342.json` |
| .Left Nav type (8958:16415) | building-block | 12 | 12 | done | `spec/sets/8958-16415.json` |
| .Left Nav type/Text/True/True (8958:19990) | dependency | 1 | 1 | done | `spec/sets/8958-19990.json` |
| Tooltips (898:98) | component-set | 24 | 24 | done | `spec/sets/898-98.json` |
| Button/True/Link Button/Medium/Default/Only/True (9130:1789) | dependency | 1 | 1 | done | `spec/sets/9130-1789.json` |
| .Date Picker Calendar (914:1980) | building-block | 6 | 6 | done | `spec/sets/914-1980.json` |
| .Building Blocks/Year (914:2173) | building-block | 7 | 7 | done | `spec/sets/914-2173.json` |
| Amphitheater (9566:160) | dependency | 0 | 0 | done | `spec/sets/9566-160.json` |
| Stamped (9592:205) | component-set | 2 | 2 | done | `spec/sets/9592-205.json` |
| .Segmented Control Items (9612:347) | building-block | 96 | 96 | done | `spec/sets/9612-347.json` |
| .Segmented Control Icon Items (9784:4768) | building-block | 48 | 48 | done | `spec/sets/9784-4768.json` |
| Segmented Control Icon only (9798:1664) | dependency | 0 | 0 | done | `spec/sets/9798-1664.json` |

## Dependencies discovered inside extracted specs (not yet extracted)

| Set | Used by |
|---|---|
| Scrooler (2478:4594) | Modal |
| Image (30317:2769) | Message |
| Arrow (46807:17513) — remote library | Composer AI |

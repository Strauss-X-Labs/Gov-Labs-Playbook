# IGDS Registry — Extraction Report (TypeScript Compiler API, rev. 3)

Generated: 2026-11-13T16:05:40.429Z
@igds/core-web 0.1.59 · @igds/tokens 0.1.59 · typescript 5.9.3

## Summary
- **totalExportedModules**: 49
- **totalComponentsExtracted**: 73
- **totalAbstractBaseClassesExcluded**: 15
- **totalKnownTagsInLibrary**: 73
- **tagsMatched**: 73
- **totalConsumerConfigurablePropsExtracted**: 556
- **totalInternalReactiveStateFieldsExtracted**: 148
- **totalInternalPlainFieldsExtracted**: 67
- **totalPublicApiMethodsExtracted**: 607
- **extractionSelfCheckIssues**: 0
- **checksPassed**: 9
- **checksFailed**: 0
- **overallPassed**: true

## Automated checks — passed
- ✅ JS AST pass produced zero syntax diagnostics across all compiled .js files
- ✅ d.ts Program produced zero compiler diagnostics across all scanned files
- ✅ no tagged component has a .js file with zero detected __decorate calls
- ✅ no tagged component has zero extracted fields AND zero methods
- ✅ every exported module is classified as ui-component or whitelisted non-component
- ✅ every known IGDS_TAGS member matched to a component
- ✅ no tag matched to more than one component
- ✅ no tag-source CONFLICT between js decorator and .d.ts tag map
- ✅ every component extending AngularFormElement (resolved via TypeChecker base-type symbols, 10 found) exposes inherited consumer-configurable "checked" and "value" declared in AngularFormElement

## Automated checks — failed
(none)

## Extraction self-check issues (machinery-level, not data-quality)
(none)

## Module classification
| module | classification |
|---|---|
| accordion | ui-component-module (2) |
| anchor | ui-component-module (2) |
| animate-height | ui-component-module (1) |
| audio-recorder | ui-component-module (1) |
| badge | ui-component-module (1) |
| banner | ui-component-module (1) |
| breadcrumbs | ui-component-module (2) |
| button | ui-component-module (1) |
| card | ui-component-module (1) |
| carousel | ui-component-module (2) |
| checkbox | ui-component-module (1) |
| checkbox-group | ui-component-module (1) |
| constants | non-component-module (shared enums/tags/events barrel) |
| date-picker | ui-component-module (1) |
| divider | ui-component-module (1) |
| drawer | ui-component-module (1) |
| dropdown | ui-component-module (2) |
| dynamic-icon | ui-component-module (1) |
| error-box | ui-component-module (1) |
| file-uploader | ui-component-module (1) |
| filters | ui-component-module (2) |
| footer | ui-component-module (3) |
| header | ui-component-module (1) |
| icon | ui-component-module (1) |
| input | ui-component-module (1) |
| list | ui-component-module (2) |
| menu | ui-component-module (2) |
| modal | ui-component-module (1) |
| pagination | ui-component-module (2) |
| popup-menu | ui-component-module (2) |
| profile-picker | ui-component-module (1) |
| progress-bar | ui-component-module (1) |
| radio | ui-component-module (1) |
| radio-group | ui-component-module (1) |
| rating | ui-component-module (1) |
| rich-text-editor | ui-component-module (4) |
| search-field | ui-component-module (1) |
| segmented-control | ui-component-module (2) |
| sidebar | ui-component-module (2) |
| skeleton | ui-component-module (1) |
| slider | ui-component-module (1) |
| spin-box | ui-component-module (1) |
| step-indicator | ui-component-module (2) |
| table | ui-component-module (4) |
| tabs | ui-component-module (3) |
| tag | ui-component-module (2) |
| toast | ui-component-module (2) |
| toggle | ui-component-module (1) |
| tooltip | ui-component-module (1) |

## Per-component verification status (api / events / slots / figmaConformance)
| component | tag | api | events | slots | figmaConformance |
|---|---|---|---|---|---|
| accordion/accordion-item::AccordionItem | `igds-accordion-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| accordion/accordion::Accordion | `igds-accordion` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| anchor/anchor-menu::AnchorMenu | `igds-anchor-menu` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| anchor/anchor::Anchor | `igds-anchor` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| animate-height/animate-height::AnimateHeight | `igds-animate-height` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| icon/icon::Icon | `igds-icon` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| button/button::Button | `igds-button` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| audio-recorder/audio-recorder::AudioRecorder | `igds-audio-recorder` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| badge/badge::Badge | `igds-badge` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| banner/banner::Banner | `igds-banner` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| breadcrumbs/breadcrumb-item::BreadcrumbItem | `igds-breadcrumb-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| popup-menu/popup-menu::PopupMenu | `igds-popup-menu` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| popup-menu/popup-menu-item::PopupMenuItem | `igds-popup-menu-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| breadcrumbs/breadcrumbs::Breadcrumbs | `igds-breadcrumbs` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| card/card::Card | `igds-card` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| carousel/carousel::Carousel | `igds-carousel` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| carousel/carousel-item::CarouselItem | `igds-carousel-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| error-box/default-error-box::DefaultErrorBox | `igds-default-error-box` | partial | extracted-static-scan | extracted-static-scan | not-checked |
| checkbox/checkbox::Checkbox | `igds-checkbox` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tooltip/tooltip::Tooltip | `igds-tooltip` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| checkbox-group/checkbox-group::CheckboxGroup | `igds-checkbox-group` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| date-picker/date-picker::DatePicker | `igds-date-picker` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| divider/divider::Divider | `igds-divider` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| drawer/drawer::Drawer | `igds-drawer` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| dropdown/tree-view::TreeView | `igds-tree-view` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| input/input::Input | `igds-input` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| dropdown/dropdown::Dropdown | `igds-dropdown` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| dynamic-icon/dynamic-icon::DynamicIcon | `igds-dynamic-icon` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| progress-bar/progress-bar::ProgressBar | `igds-progress-bar` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| file-uploader/file-uploader::FileUploader | `igds-file-uploader` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| filters/horizontal-filter::HorizontalFilter | `igds-horizontal-filter` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| filters/vertical-filter::VerticalFilter | `igds-vertical-filter` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| footer/footer::Footer | `igds-footer` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| footer/footer-navigation::FooterNavigation | `igds-footer-navigation` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| footer/footer-navigation-item::FooterNavigationItem | `igds-footer-navigation-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| header/header::Header | `igds-header` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| list/list::List | `igds-list` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| list/list-item::ListItem | `igds-list-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| menu/menu::Menu | `igds-menu` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| menu/menu-item::MenuItem | `igds-menu-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| modal/modal::Modal | `igds-modal` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| pagination/pagination::Pagination | `igds-pagination` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| pagination/pagination-item::PaginationItem | `igds-pagination-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| profile-picker/profile-picker::ProfilePicker | `igds-profile-picker` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| radio/radio::RadioButton | `igds-radio` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| radio-group/radio-group::RadioGroup | `igds-radio-group` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| rating/rating::Rating | `igds-rating` | partial | extracted-static-scan | extracted-static-scan | not-checked |
| rich-text-editor/editor-toolbar::EditorToolbar | `igds-editor-toolbar` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| rich-text-editor/toolbar-item::ToolbarItem | `igds-toolbar-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| rich-text-editor/rich-text-editor::RichTextEditor | `igds-rich-text-editor` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| rich-text-editor/link-modal::LinkModal | `igds-link-modal` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| search-field/search-field::SearchField | `igds-search-field` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| segmented-control/segmented-control::SegmentedControl | `igds-segmented-control` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| segmented-control/segment::Segment | `igds-segment` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| sidebar/sidebar-item::SidebarItem | `igds-sidebar-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| sidebar/sidebar::Sidebar | `igds-sidebar` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| skeleton/skeleton::Skeleton | `igds-skeleton` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| slider/slider::Slider | `igds-slider` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| spin-box/spin-box::SpinBox | `igds-spinbox` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| step-indicator/step-indicator::StepIndicator | `igds-step-indicator` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| step-indicator/step-item::StepItem | `igds-step-item` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tabs/tabs::Tabs | `igds-tabs` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tabs/tab::Tab | `igds-tab` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tabs/tab-panel::TabPanel | `igds-tab-panel` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tag/tag::Tag | `igds-tag` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| tag/tag-group::TagGroup | `igds-tag-group` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| table/table::Table | `igds-table` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| table/table-cell::TableCell | `igds-table-cell` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| table/table-header::TableHeader | `igds-table-header` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| table/table-row::TableRow | `igds-table-row` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| toast/toast-container::ToastContainer | `igds-toast-container` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| toast/toast::Toast | `igds-toast` | verified | extracted-static-scan | extracted-static-scan | not-checked |
| toggle/toggle::Toggle | `igds-toggle` | verified | extracted-static-scan | extracted-static-scan | not-checked |

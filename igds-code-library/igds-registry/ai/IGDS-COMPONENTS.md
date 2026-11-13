# IGDS — Components catalog (generated)

> Generated 2026-11-11 from **@igds/core-web 0.1.59** by `igds-registry/scripts/build-ai-docs.mjs`. Do not edit by hand — run `npm run igds:refresh`.
> Verification: tags & attributes **runtime-verified** in msedge.exe (73/73 registered, 0 failed checks) · events/slots from static code scan · methods: only those classified as consumer API · Figma: automatic match, see confidence.

**How to read a component:**
- `attribute` column = exact HTML attribute name. `—` = JS-only property (set it in code, not in HTML).
- Values in quotes are the ONLY allowed values. Boolean attributes: presence = true (`disabled="false"` still disables).
- `default` = value at runtime when not set (runtime-measured).
- Events are `CustomEvent`s; read `event.detail.value`. `checkedChange`/`valueChange` are Angular-compat only.

## Index

**accordion**: `igds-accordion-item` `igds-accordion` · **anchor**: `igds-anchor-menu` `igds-anchor` · **animate-height**: `igds-animate-height` · **icon**: `igds-icon` · **button**: `igds-button` · **audio-recorder**: `igds-audio-recorder` · **badge**: `igds-badge` · **banner**: `igds-banner` · **breadcrumbs**: `igds-breadcrumb-item` `igds-breadcrumbs` · **popup-menu**: `igds-popup-menu` `igds-popup-menu-item` · **card**: `igds-card` · **carousel**: `igds-carousel` `igds-carousel-item` · **error-box**: `igds-default-error-box` · **checkbox**: `igds-checkbox` · **tooltip**: `igds-tooltip` · **checkbox-group**: `igds-checkbox-group` · **date-picker**: `igds-date-picker` · **divider**: `igds-divider` · **drawer**: `igds-drawer` · **dropdown**: `igds-tree-view` `igds-dropdown` · **input**: `igds-input` · **dynamic-icon**: `igds-dynamic-icon` · **progress-bar**: `igds-progress-bar` · **file-uploader**: `igds-file-uploader` · **filters**: `igds-horizontal-filter` `igds-vertical-filter` · **footer**: `igds-footer` `igds-footer-navigation` `igds-footer-navigation-item` · **header**: `igds-header` · **list**: `igds-list` `igds-list-item` · **menu**: `igds-menu` `igds-menu-item` · **modal**: `igds-modal` · **pagination**: `igds-pagination` `igds-pagination-item` · **profile-picker**: `igds-profile-picker` · **radio**: `igds-radio` · **radio-group**: `igds-radio-group` · **rating**: `igds-rating` · **rich-text-editor**: `igds-editor-toolbar` `igds-toolbar-item` `igds-rich-text-editor` `igds-link-modal` · **search-field**: `igds-search-field` · **segmented-control**: `igds-segmented-control` `igds-segment` · **sidebar**: `igds-sidebar-item` `igds-sidebar` · **skeleton**: `igds-skeleton` · **slider**: `igds-slider` · **spin-box**: `igds-spinbox` · **step-indicator**: `igds-step-indicator` `igds-step-item` · **tabs**: `igds-tabs` `igds-tab` `igds-tab-panel` · **tag**: `igds-tag` `igds-tag-group` · **table**: `igds-table` `igds-table-cell` `igds-table-header` `igds-table-row` · **toast**: `igds-toast-container` `igds-toast` · **toggle**: `igds-toggle`

## accordion

Import (bundler): `import '@igds/core-web/accordion';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-accordion-item>`

class `AccordionItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `open` | open | boolean | false |
| `disabled` | disabled | boolean | false |
| `icon` | icon | string |  |
| `header` | header | string |  |

JS-only properties: `onToggle`: (ev: ToggleEvent) => void

Events: `igds-toggle` (value: event.newState)

Slots: `(default)`

### `<igds-accordion>`

class `Accordion` · Figma: Accordion `36363:22776` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `multiexpand` | multiexpand | boolean | false |

Slots: `(default)`

## anchor

Import (bundler): `import '@igds/core-web/anchor';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-anchor-menu>`

class `AnchorMenu`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `header` | header | string | "" |
| `dir` | dir | string | "rtl" |

Events: `igds-blur` (value: (undefined)) · `igds-click` (value: { href: href }) · `igds-focus` (value: (undefined))

### `<igds-anchor>`

class `Anchor` · Figma: Anchor `6632:5248` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | anchorId | string |  |
| `href` | href | string | "" |
| `title` | anchorTitle | string |  |
| `active` | active | boolean | false |

## animate-height

Import (bundler): `import '@igds/core-web/animate-height';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-animate-height>`

class `AnimateHeight`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `duration` | duration | number | 200 |
| `expand` | expand | boolean | false |

Slots: `(default)`

## icon

Import (bundler): `import '@igds/core-web/icon';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-icon>`

class `Icon`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `name` ⛔ **do not use** | name | string |  |
| `node` | node | string |  |
| `color` | color | string | "inherit" |
| `accessible-name` | accessibleName | string | "" |
| `size` | size | string \| number | 24 |

> ⛔ `name` is ignored by the component at runtime (verified in the browser: renders nothing, console says: "Starting from version 0.1.29, the igds-icon component no longer supports the name property. Use the node property instead. The required icon nodes can be found and imported from the @igds/icons library."). `npm run igds:lint` reports it as an error.

> Correct usage (verified in the browser): pass the SVG content of an official icon in the `node` **property** (JS), never by name:
> bundler: `import { calendar } from '@igds/icons'; iconEl.node = calendar;` · static page: `iconEl.node = <icon export from @igds/icons>` (the govlab-igds-kit package exposes them as `window.IGDSIcons`).
> Meaningful icon: also set `accessible-name`. Decorative icon: `aria-hidden="true"`.

## button

Import (bundler): `import '@igds/core-web/button';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-button>`

class `Button` · Figma: Notification Button `35262:5506` (needs-review), Notification Button `8372:6620` (needs-review), Button `81:1195` (high), Split Button `20260:10392` (medium) +2

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "alternative" \| "link" \| "link-inline" \| "primary" \| "secondary" | "primary" |
| `size` | size | "large" \| "medium" \| "small" | "medium" |
| `disabled` | disabled | boolean | false |
| `loading` | loading | boolean | false |
| `label` | label | string |  |
| `type` | type | "button" \| "submit" | "button" |
| `inverted` | inverted | boolean | false |
| `icon-only` | iconOnly | boolean | false |

Events: `igds-blur` (value: 'blurred') · `igds-click` (value: nativeEvent) · `igds-focus` (value: 'focused') · `igds-keydown` (value: nativeEvent) · `igds-keyup` (value: nativeEvent)

Slots: `icon` · `(default)` · `second-icon`

Methods: `focus()`

## audio-recorder

Import (bundler): `import '@igds/core-web/audio-recorder';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-audio-recorder>`

class `AudioRecorder`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `limit` | limit | number | 60000 |
| `disabled` | disabled | boolean | false |

Events: `igds-start` (value: new Date().toISOString()) · `igds-stop` (value: new Date().toISOString()) · `igds-voice` (value: (undefined))

Methods: `start()`* · `stop()`*  (*heuristic — prefer attributes)

## badge

Import (bundler): `import '@igds/core-web/badge';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-badge>`

class `Badge` · Figma: Numeric Badge `2078:3425` (needs-review), Badge `1646:12` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "default" \| "failure" \| "in-progress" \| "informative" \| "success" \| "warning" | "default" |
| `label` | label | string | "" |
| `icon` | icon | string |  |
| `counter` | counter | number |  |
| `notification` | notification | boolean | false |
| `notification-button` | notificationButton | boolean | false |
| `notification-button-size` | notificationButtonSize | "large" \| "medium" \| "small" | "medium" |
| `notification-button-variant` | notificationButtonVariant | "link" \| "primary" \| "secondary" | "primary" |

Events: `igds-change` (value: this.getValue()) · `igds-click` (value: 'button clicked')

## banner

Import (bundler): `import '@igds/core-web/banner';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-banner>`

class `Banner` · Figma: Banner `2492:4291` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "picture-only" \| "text-center" \| "text-right" | "text-right" |
| `img-src` | imgSrc | string | "" |
| `img-alt` | imageAlt | string | "" |
| `title` | title | string | "" |
| `description` | description | string | "" |
| `action-label` | actionLabel | string |  |
| `footer-text` | footerText | string |  |
| `footer-action-label` | footerActionLabel | string |  |
| `footer-action-url` | footerActionUrl | string |  |

Events: `igds-click` (value: 'button clicked') · `igds-footer-click` (value: 'footer button link clicked')

## breadcrumbs

Import (bundler): `import '@igds/core-web/breadcrumbs';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-breadcrumb-item>`

class `BreadcrumbItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `href` | href | string | "#" |
| `target` | target | "_blank" \| "_parent" \| "_self" \| "_top" |  |
| `rel` | rel | string | "noreferrer noopener" |

Events: `igds-navigate` (value: href)

Slots: `(default)`

### `<igds-breadcrumbs>`

class `Breadcrumbs` · Figma: Breadcrumbs bar Desktop new `35333:41557` (high), Breadcrumbs bar Desktop Overflow `53173:56947` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string | "Breadcrumbs" |
| `prevent-default` | preventDefault | boolean | false |

Events: `igds-expand` (value: (undefined))

Slots: `(default)`

## popup-menu

Import (bundler): `import '@igds/core-web/popup-menu';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-popup-menu>`

class `PopupMenu`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `open` | open | boolean | false |
| `trigger` | trigger | string |  |
| `offset` | offset | number | 4 |
| `selected-item-id` | selectedItemId | string |  |
| `min-width` | minWidth | number | 166 |
| `max-width` | maxWidth | number |  |
| `variant` | variant | "menu" \| "popup" | "popup" |
| `placement` | placement | "bottom" \| "bottom-end" \| "bottom-start" \| "inset-inline-end" \| "inset-inline-end-bottom" \| "inset-inline-e… |  |

Events: `igds-close` (value: 'closed') · `igds-open` (value: 'opened')

Slots: `trigger` · `(default)`

Methods: `requestOpen()`* · `requestClose()`*  (*heuristic — prefer attributes)

### `<igds-popup-menu-item>`

class `PopupMenuItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | id | string | "1dd2524a-3da5-43ce-8a4d-21… |
| `icon` | icon | string |  |
| `icon-variant` | iconVariant | "fill" \| "outline" |  |

Events: `igds-select` (value: { id, label })

Slots: `(default)`

## card

Import (bundler): `import '@igds/core-web/card';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-card>`

class `Card` · Figma: Card `1140:935` (high), Card full picture `43124:36813` (high), Card full picture+name `11657:21926` (high), Kpi_Cards `44958:29285` (medium) +1

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "basic" \| "full-picture-dark" \| "full-picture-light" | "basic" |
| `type` | type | "clickable" \| "cta" | "clickable" |
| `size` | size | "large" \| "small" |  |
| `direction` | direction | "horizontal" \| "vertical" | "horizontal" |
| `content-centered` | contentCentered | boolean | false |
| `interactive` | interactive | boolean | false |
| `disabled` | disabled | boolean | false |
| `title` | title | string | "" |
| `subtitle` | subtitle | string |  |
| `description` | description | string |  |
| `image-src` | imageSrc | string | "" |
| `image-fit` | imageFit | "fill" \| "contain" \| "cover" \| "none" \| "scale-down" | "fill" |
| `image-alt` | imageAlt | string |  |
| `label` | label | string |  |
| `favorite-visible` | favoriteVisible | boolean | false |
| `default-favorite-state` | defaultFavoriteState | boolean | false |
| `favorite-icon-state-active` | favoriteIconStateActive | string | "<path d=\"M11.9967 21C11.7… |
| `favorite-icon-state-inactive` | favoriteIconStateInactive | string | "<path d=\"M7.21638 6C6.352… |
| `favorite-label` | favoriteLabel | string | "Favorite" |
| `primary-action-label` | primaryActionLabel | string |  |
| `secondary-action-label` | secondaryActionLabel | string |  |
| `title-icon` | titleIcon | string | "<path d=\"M11.9982 4.41981… |
| `hide-title-icon` | hideTitleIcon | boolean | false |
| `badge-label` | badgeLabel | string | "תיאור" |
| `hide-badge` | hideBadge | boolean | false |

Events: `igds-blur` (value: 'blurred') · `igds-click` (value: 'clicked') · `igds-favorite-toggle` (value: { favorite: this.favoriteState, }) · `igds-focus` (value: 'focused') · `igds-keydown` (value: 'keydown' / 'keyup') · `igds-primary-click` (value: 'primaryClicked') · `igds-secondary-click` (value: 'secondaryClicked')

Slots: `(default)`

## carousel

Import (bundler): `import '@igds/core-web/carousel';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-carousel>`

class `Carousel` · Figma: carousel `36417:70941` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `title` | title | string | "" |
| `subtitle` | subtitle | string | "" |
| `variant` | variant | "inline" \| "edge" | "inline" |
| `slides-per-view` | slidesPerView | number | 1 |
| `loop` | loop | boolean | false |
| `autoplay` | autoplay | boolean | false |
| `interval` | interval | number | 3000 |
| `autopause` | autopause | boolean | false |

Events: `igds-next` (value: 'next slide click') · `igds-prev` (value: 'prev slide click') · `igds-slide-change` (value: 'slide change')

### `<igds-carousel-item>`

class `CarouselItem`

## error-box

Import (bundler): `import '@igds/core-web/error-box';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-default-error-box>`

class `DefaultErrorBox`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `errormessage` | errormessage | string | null |

Slots: `error-message`

## checkbox

Import (bundler): `import '@igds/core-web/checkbox';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-checkbox>`

class `Checkbox` · form element (`checked`, `value`, form-associated) · Figma: Checkbox card_new `35207:4353` (high), Checkbox vertical/horizontal `35216:29991` (needs-review)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | componentId | string | "checkbox" |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `form` | form | string |  |
| `default-value` | defaultValue | string | "on" |
| `help-text` | helpText | string |  |
| `help-icon` | helpIcon | string |  |
| `invalid` | invalid | boolean | false |
| `name` | name | string |  |
| `label` | label | string | null |
| `error` | error | string |  |
| `variant` | variant | "default" \| "card" \| "with-input" | "default" |
| `image-src` | imageSrc | string |  |
| `image-alt` | imageAlt | string |  |
| `description` | description | string |  |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `indeterminate`: boolean · `onChange`: (event: Event, value?: string \| null) => void

Events: `checkedChange` · `igds-blur` (value: value) · `igds-change` (value: input.value) · `igds-focus` (value: value) · `valueChange`

Slots: `checkbox-label` · `checkbox-icon`

Methods: `checkValidity()` · `reportValidity()`

## tooltip

Import (bundler): `import '@igds/core-web/tooltip';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-tooltip>`

class `Tooltip` · Figma: Tooltips `898:98` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `content` | content | string | "" |
| `placement` | placement | "bottom" \| "bottom-end" \| "bottom-start" \| "inset-inline-end" \| "inset-inline-end-bottom" \| "inset-inline-e… | "top" |
| `type` | type | "popup" \| "standard" | "standard" |
| `disabled` | disabled | boolean | false |
| `inverted` | inverted | boolean | false |
| `shown` | shown | boolean | false |

Events: `igds-hide` (value: 'hidden') · `igds-show` (value: 'shown')

Slots: `(default)` · `content`

## checkbox-group

Import (bundler): `import '@igds/core-web/checkbox-group';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-checkbox-group>`

class `CheckboxGroup`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string |  |
| `form` | form | string |  |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `help-icon` | helpIcon | string |  |
| `help-text` | helpText | string |  |
| `tooltip` | tooltip | string |  |
| `tooltip-question` | tooltipQuestion | string |  |
| `tooltip-icon` | tooltipIcon | boolean |  |
| `orientation` | orientation | "horizontal" \| "vertical" | "vertical" |

JS-only properties: `onGroupChange`: (event: string[]) => void

Slots: `(default)`

## date-picker

Import (bundler): `import '@igds/core-web/date-picker';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-date-picker>`

class `DatePicker` · form element (`checked`, `value`, form-associated) · Figma: Date Picker `35900:13376` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `dir` | dir | string | "rtl" |
| `label` | label | string |  |
| `label-icon` | labelIcon | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string |  |
| `date-format` | dateFormat | string | "YYYY/MM/DD" |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `readonly` | readonly | boolean | false |
| `min` | min | string | null |
| `max` | max | string | null |
| `min-error` | minError | string |  |
| `max-error` | maxError | string |  |
| `placeholder` | placeholder | string |  |
| `without-calendar` | withoutCalendar | boolean | false |
| `start-week-on` | startWeekOn | "sunday" \| "monday" | "sunday" |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `with-icon` | withIcon | boolean | true |
| `auto-focus` | autoFocus | boolean | false |
| `autocomplete` | autocomplete | "on" \| "off" | "off" |
| `openonfocus` | openOnFocus | boolean | false |
| `autocorrect` | autocorrect | boolean | false |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-blur` (value: this.value ?? '') · `igds-calendar-close` (value: (undefined)) · `igds-calendar-open` (value: (undefined)) · `igds-change` (value: value / '' / this.value) · `igds-day-click` (value: day.toString()) · `igds-focus` (value: this.value ?? '') · `igds-input` (value: this.value) · `igds-month-change` (value: this.selectedMonth.toString()) · `igds-period-change` (value: (undefined)) · `igds-year-change` (value: this.selectedYear.toString()) · `valueChange`

Methods: `setValues()`*  (*heuristic — prefer attributes)

## divider

Import (bundler): `import '@igds/core-web/divider';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-divider>`

class `Divider` · Figma: Divider `708:2124` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `width` | width | "igds-full-divider" \| "igds-inset-divider" | "igds-full-divider" |
| `orientation` | orientation | "igds-horizontal-divider" \| "igds-vertical-divider" | "igds-horizontal-divider" |
| `inverted` | inverted | boolean |  |
| `label` | label | string |  |

## drawer

Import (bundler): `import '@igds/core-web/drawer';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-drawer>`

class `Drawer`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `open` | open | boolean | false |
| `position` | position | "left" \| "right" | "right" |
| `label` | label | string |  |
| `hide-close-button` | hideCloseButton | boolean | false |
| `hide-overlay` | hideOverlay | boolean | false |
| `disable-focus-lock` | disableFocusLock | boolean | false |

Events: `igds-close` (value: (undefined)) · `igds-open` (value: (undefined))

Slots: `(default)`

Methods: `show()`* · `hide()`*  (*heuristic — prefer attributes)

## dropdown

Import (bundler): `import '@igds/core-web/dropdown';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-tree-view>`

class `TreeView`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `nodes` | nodes | TreeNode[] | [] |
| `selected-node-id` | selectedNodeId | string | null |
| `focused-index` | focusedIndex | number |  |
| `expanded-id` | expandedId | string |  |
| `collapsed-id` | collapsedId | string |  |

Events: `igds-click` (value: { id: node.id, label: node.label }) · `igds-collapsed-item-changed` (value: (undefined)) · `igds-focused-item-changed` (value: { index, maxItems: flatMap.length, direction, id: )

### `<igds-dropdown>`

class `Dropdown` · form element (`checked`, `value`, form-associated) · Figma: Dropdown `35069:17714` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string |  |
| `label-icon` | labelIcon | string |  |
| `name` | name | string |  |
| `multiple` | multiple | boolean | false |
| `treeview` | treeView | boolean | false |
| `form` | form | string |  |
| `selected` | selected | string[] | [] |
| `defaultvalue` | defaultValue | string |  |
| `placeholder` | placeholder | string |  |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `options` | options | Option[] | [] |
| `filterable` | filterable | boolean | false |
| `show-tags` | showTags | boolean | false |
| `help-text` | helpText | string |  |
| `help-icon` | helpIcon | string |  |
| `tooltip` | tooltip | string |  |
| `tooltip-question` | tooltipQuestion | string |  |
| `tooltip-icon` | tooltipIcon | boolean |  |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `dir` | dir | string | "rtl" |
| `treenodes` | treeNodes | TreeNode[] | [] |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-blur` (value: value) · `igds-change` (value: this.selected / this.isMultiSelectMode() ? this.se) · `igds-clear` (value: '') · `igds-focus` (value: value) · `igds-keydown` (value: this.value / this.value ?? '') · `valueChange`

Methods: `setSelectedOptions()`* · `setMultiSelectedOptions()`* · `setSingleSelectedOption()`* · `setTreeViewSelectedNode()`*  (*heuristic — prefer attributes)

## input

Import (bundler): `import '@igds/core-web/input';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-input>`

class `Input` · form element (`checked`, `value`, form-associated) · Figma: Input Prompt `44489:9618` (medium), Input Field `81:115` (high), Chat Input `29927:20119` (needs-review), Input Field / Horizontal `59066:7577` (high) +1

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `dir` | dir | string | "rtl" |
| `type` | type | "number" \| "email" \| "password" \| "text" \| "textarea" | "text" |
| `label` | label | string |  |
| `label-icon` | labelIcon | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string |  |
| `placeholder` | placeholder | string |  |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `readonly` | readonly | boolean | false |
| `rows` | rows | number |  |
| `cols` | cols | number |  |
| `min` | min | number |  |
| `max` | max | number |  |
| `pattern` | pattern | string |  |
| `maxlength` | maxlength | number |  |
| `icon` | icon | string |  |
| `icon-position` | iconPosition | string | "left" |
| `help-text` | helpText | string |  |
| `help-icon` | helpIcon | string |  |
| `tooltip` | tooltip | string |  |
| `tooltip-question` | tooltipQuestion | string |  |
| `tooltip-icon` | tooltipIcon | boolean |  |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `auto-focus` | autoFocus | boolean | false |
| `autocomplete` | autoComplete | "on" \| "off" | "off" |
| `autocapitalize` | autoCapitalize | "none" \| "on" \| "off" \| "characters" \| "sentences" | "off" |
| `autocorrect` | autocorrect | boolean | false |
| `autoheight` | autoHeight | boolean |  |
| `step` | step | number |  |
| `size` | size | "large" \| "custom" | "custom" |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `componentId`: string · `onChange`: (event: Event) => void

Events: `calendar-icon-click` · `checkedChange` · `igds-blur` (value: value) · `igds-change` (value: value) · `igds-focus` (value: value) · `igds-input` (value: value) · `igds-input-icon-click` (value: 'clicked') · `valueChange`

Methods: `checkValidity()` · `reportValidity()`

## dynamic-icon

Import (bundler): `import '@igds/core-web/dynamic-icon';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-dynamic-icon>`

class `DynamicIcon`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `name` | name | "link" \| "menu" \| "email" \| "text" \| "accessibility" \| "activity" \| "alertCircleFailureFilled" \| "alertCirc… |  |
| `color` | color | string | "inherit" |
| `size` | size | string \| number |  |
| `accessible-name` | accessibleName | string | "" |

## progress-bar

Import (bundler): `import '@igds/core-web/progress-bar';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-progress-bar>`

class `ProgressBar` · Figma: Progress Bar `1141:2263` (medium), Progress Bar `46144:13919` (medium), progress bar `45744:10328` (high), Progress bar round `50693:10471` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `type` | type | "spinner" \| "line" | "line" |
| `color` | color | string | "--igds-base-color-backgrou… |
| `inverted` | inverted | boolean | false |
| `value` | value | number | 0 |
| `size` | size | "large" \| "small" | "small" |
| `label` | label | string | "" |
| `help-text` | helpText | string | "" |
| `status-icon` | statusIcon | string |  |
| `indeterminate` | indeterminate | boolean | false |

Events: `igds-complete` (value: 'completed')

## file-uploader

Import (bundler): `import '@igds/core-web/file-uploader';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-file-uploader>`

class `FileUploader` · form element (`checked`, `value`, form-associated) · Figma: Single File Upload `2366:1172` (medium), Multiple Files Upload-Upload Area `2366:1286` (medium), Multiple Files Upload `2366:1331` (medium), Multiple Files Upload-Added File `2366:1460` (medium)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `heading` | heading | string | "" |
| `help-text` | helpText | string | "" |
| `description` | description | string | "" |
| `accepted-formats` | acceptedFormats | string | "*" |
| `max-file-size` | maxFileSize | number | 5 |
| `multiple` | multiple | boolean | false |
| `file-states` | fileStates | MultipleFileStates |  |
| `name` | name | string |  |
| `status` | status | "default" \| "success" \| "fail" \| "pending" | "default" |
| `disabled` | disabled | boolean | false |
| `max-files` | maxFiles | number | null |
| `file-upload-label` | fileUploadLabel | string |  |
| `pending-status-label` | pendingStatusLabel | string |  |
| `success-status-label` | successStatusLabel | string |  |
| `fail-status-label` | failStatusLabel | string |  |
| `too-large-file-error` | tooLargeFileError | string |  |
| `too-many-files-error` | tooManyFilesError | string |  |
| `wrong-file-format-error` | wrongFileFormatError | string |  |
| `delete-button-label` | deleteButtonLabel | string | "מחק קובץ" |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

Events: `checkedChange` · `igds-change` (value: 'files changed') · `igds-file-added` (value: 'file added') · `igds-file-removed` (value: 'file removed') · `valueChange`

## filters

Import (bundler): `import '@igds/core-web/filters';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-horizontal-filter>`

class `HorizontalFilter` · Figma: Horizontal Filter `35782:43322` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `filters` | filters | Filter[] | [] |
| `clear-label` | clearLabel | string | "ניקוי סינון" |
| `apply-label` | applyLabel | string |  |
| `dir` | dir | string | "rtl" |
| `disable-submit` | disableSubmit | boolean |  |

Events: `igds-apply` (value: this.formValues) · `igds-clear` (value: this.formValues) · `igds-filter-changed` (value: this.formValues)

Methods: `setCheckboxValues()`*  (*heuristic — prefer attributes)

### `<igds-vertical-filter>`

class `VerticalFilter` · Figma: Vertical Filter Item `3168:1715` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `filters` | filters | Filter[] | [] |
| `clear-label` | clearLabel | string | "ניקוי סינון" |
| `apply-label` | applyLabel | string |  |
| `disable-submit` | disableSubmit | boolean |  |

Events: `igds-apply` (value: this.formValues) · `igds-clear` (value: this.formValues) · `igds-filter-changed` (value: this.formValues)

Methods: `setCheckboxValues()`* · `setCheckboxValue()`*  (*heuristic — prefer attributes)

## footer

Import (bundler): `import '@igds/core-web/footer';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-footer>`

class `Footer` · Figma: Footer `15777:13868` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "large" \| "medium" \| "small" | "large" |
| `frontpageurl` | frontPageUrl | string | "/" |
| `copyright` | copyright | string | "© הזכויות כל שמורות למערך … |
| `logourl` | logoUrl | string |  |
| `darklogourl` | darkLogoUrl | string |  |
| `logoalt` | logoAlt | string | "" |
| `abouturl` | aboutUrl | string |  |
| `termsurl` | termsUrl | string |  |
| `accessibilityurl` | accessibilityUrl | string |  |
| `phone` | phone | string | "" |
| `email` | email | string | "" |
| `socialurls` | socialUrls | FooterSocialUrl[] | [] |

JS-only properties: `contactUs`: FooterSocialUrl

Events: `igds-logo-click` (value: 'footer logo clicked') · `igds-submit` (value: { fullName: fullName, email: email, })

Slots: `nav` · `(default)`

Methods: `redirectTo()`*  (*heuristic — prefer attributes)

### `<igds-footer-navigation>`

class `FooterNavigation`

### `<igds-footer-navigation-item>`

class `FooterNavigationItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | navLinkId | string | "" |
| `header` | header | string | "" |
| `links` | links | FooterNavLink[] | [] |

## header

Import (bundler): `import '@igds/core-web/header';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-header>`

class `Header` · Figma: Header Desktop `3239:13099` (high), Header Mobile `3239:18954` (high), Header Tablet `6030:8496` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `logourl` | logoUrl | string |  |
| `darklogourl` | darkLogoUrl | string |  |
| `logoalt` | logoAlt | string | "" |
| `frontpageurl` | frontPageUrl | string | "/" |
| `variant` | variant | "brand" \| "white" | "white" |
| `searchlabel` | searchLabel | string | "לְחַפֵּשׂ" |

Events: `igds-logo-click` (value: event)

Slots: `hamburger` · `(default)` · `extra-nav` · `search` · `auth` · `bottom`

## list

Import (bundler): `import '@igds/core-web/list';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-list>`

class `List` · Figma: List `3109:26184` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "data" \| "ordered" \| "unordered" | "unordered" |
| `droppable` | droppable | boolean |  |

Events: `igds-drag-end` (value: 'drag-ended') · `igds-drag-start` (value: 'drag-started')

Methods: `openItem()`* · `closeItem()`*  (*heuristic — prefer attributes)

### `<igds-list-item>`

class `ListItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `header` | header | string |  |
| `subheader` | subheader | string |  |
| `more-text` | moreText | string |  |
| `id` | itemId | string |  |
| `more-info` | moreInfo | string |  |
| `icon` | icon | string |  |
| `draggable` | draggableItem | boolean | true |
| `image-src` | imageSrc | string |  |
| `image-alt` | imageAlt | string |  |

Slots: `(default)`

## menu

Import (bundler): `import '@igds/core-web/menu';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-menu>`

class `Menu` · Figma: Navigation Menu `1538:4181` (needs-review), Contextual Menu `1538:5210` (needs-review), Mega Menu Atom `37471:34289` (needs-review), Mega Menu Atoms `40231:29533` (needs-review)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "default" \| "header" \| "indent" \| "mobile-header" \| "title-subtitle" | "default" |
| `trigger-button` | triggerButton | string \| HTMLElement | null |
| `label` | label | string |  |
| `open` | open | boolean | false |
| `position` | position | "bottom" \| "bottom-end" \| "bottom-start" \| "inset-inline-end" \| "inset-inline-end-bottom" \| "inset-inline-e… | "bottom" |
| `offset` | offset | number | null |

Events: `igds-click` (value: highlightedItemLabel) · `igds-close` (value: (undefined)) · `igds-open` (value: (undefined))

Slots: `trigger` · `menu-item`

Methods: `showSubmenuAndAddSubMenuItems()`* · `hideSubmenu()`* · `setCurrentItem()`*  (*heuristic — prefer attributes)

### `<igds-menu-item>`

class `MenuItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | componentId | string |  |
| `label` | label | string |  |
| `header` | header | string |  |
| `icon` | icon | string |  |
| `disabled` | disabled | boolean | false |
| `submenu` | subMenu | boolean | false |
| `withdivider` | withDivider | boolean | false |

Events: `igds-click` (value: this.label) · `igds-hover` (value: this.label)

Slots: `submenu-item`

## modal

Import (bundler): `import '@igds/core-web/modal';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-modal>`

class `Modal` · Figma: Modal `35785:8979` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `open` | open | boolean |  |
| `label` | label | string |  |
| `type` | type | "default" \| "coach-mark" \| "simple" | "default" |
| `top` | top | number | 0 |
| `start` | start | number | 0 |
| `image-auto-size` | imageAutoSize | boolean |  |
| `image-src` | imageSrc | string |  |
| `image-alt` | imageAlt | string |  |
| `mobile-image-src` | mobileImageSrc | string |  |
| `mobile-image-alt` | mobileImageAlt | string |  |
| `primary-action-label` | primaryActionLabel | string |  |
| `secondary-action-label` | secondaryActionLabel | string |  |
| `animated` | animated | string |  |
| `disable-focus-lock` | disabledFocusLock | boolean | false |

Events: `igds-close` (value: 'closed') · `igds-open` (value: 'opened') · `igds-primary-click` (value: 'primaryClicked') · `igds-secondary-click` (value: 'secondaryClicked')

Slots: `(default)` · `footer`

Methods: `requestClose()`*  (*heuristic — prefer attributes)

## pagination

Import (bundler): `import '@igds/core-web/pagination';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-pagination>`

class `Pagination` · Figma: Numbered Pagination `6241:46646` (needs-review)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "numbered" \| "unnumbered" | "numbered" |
| `current` | current | number | 1 |

Events: `igds-change` (value: `${pageNum}`) · `igds-click` (value: (undefined))

Slots: `(default)`

### `<igds-pagination-item>`

class `PaginationItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `href` | href | string | "" |

## profile-picker

Import (bundler): `import '@igds/core-web/profile-picker';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-profile-picker>`

class `ProfilePicker` · Figma: Avatar Profile `55528:31835` (medium), Avatar Profile `55528:39658` (medium)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `avatar-size` | avatarSize | "large" \| "small" | "small" |
| `username` | username | string | "שם המשתמש" |
| `user-id` | userId | string | "" |
| `avatar-url` | avatarUrl | string | "" |
| `open` | open | boolean | false |

## radio

Import (bundler): `import '@igds/core-web/radio';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-radio>`

class `RadioButton` · Figma: Radio Button `746:974` (needs-review), Media Mobile `12910:1214` (medium), Media Desktop `11233:12150` (medium), Radio Button Cards `35074:88329` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `value` | value | string |  |
| `checked` | checked | boolean | false |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `form` | form | string |  |
| `help-text` | helpText | string |  |
| `help-icon` | helpIcon | string |  |
| `invalid` | invalid | boolean | false |
| `name` | name | string |  |
| `label` | label | string |  |
| `variant` | variant | "default" \| "with-input" \| "image" \| "text-card" | "default" |
| `description` | description | string |  |
| `image-src` | imageSrc | string |  |
| `image-alt` | imageAlt | string |  |
| `error` | error | string |  |
| `tooltip` | tooltip | string |  |
| `tooltip-icon` | tooltipIcon | string |  |
| `tooltip-placement` | tooltipPlacement | "bottom" \| "bottom-end" \| "bottom-start" \| "inset-inline-end" \| "inset-inline-end-bottom" \| "inset-inline-e… |  |

JS-only properties: `componentId`: string · `onChange`: (event: Event, value: string \| null) => void

Events: `igds-blur` (value: value) · `igds-change` (value: inputElement.value) · `igds-focus` (value: value) · `radio-changed`

Methods: `checkValidity()` · `reportValidity()`

## radio-group

Import (bundler): `import '@igds/core-web/radio-group';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-radio-group>`

class `RadioGroup`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string | "" |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `error` | error | string |  |
| `help-icon` | helpIcon | string |  |
| `help-text` | helpText | string |  |
| `tooltip` | tooltip | string |  |
| `tooltip-question` | tooltipQuestion | string |  |
| `tooltip-icon` | tooltipIcon | boolean |  |
| `orientation` | orientation | "horizontal" \| "vertical" | "vertical" |

JS-only properties: `value`: string

Slots: `(default)`

## rating

Import (bundler): `import '@igds/core-web/rating';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-rating>`

class `Rating` · form element (`checked`, `value`, form-associated) · Figma: Face Rating `15110:7625` (medium), Star Rating `35744:129279` (medium)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `dir` | dir | string | "rtl" |
| `variant` | variant | "face" \| "star" | "star" |
| `readonly` | readonly | boolean | false |
| `label` | label | string | "" |
| `ratinggrade` | ratingGrade | string[] | [] |
| `name` | name | string |  |
| `form` | form | string |  |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `componentId`: string · `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-change` (value: this.value ?? '') · `igds-hover` (value: (undefined)) · `valueChange`

Methods: `resetHighlightedSelection()`* · `commitSelection()`*  (*heuristic — prefer attributes)

## rich-text-editor

Import (bundler): `import '@igds/core-web/rich-text-editor';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-editor-toolbar>`

class `EditorToolbar`

Slots: `(default)`

### `<igds-toolbar-item>`

class `ToolbarItem`

> ⚠️ Throws when rendered on its own — use only inside its parent component.

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `icon` | icon | string |  |
| `command` | command | "link" \| "bold" \| "italic" \| "list" \| "ltr" \| "rtl" \| "underline" \| "indent-" \| "indent+" \| "strike" \| "ulist" |  |
| `label` | label | string |  |

Events: `igds-click` (value: { command: this.command })

### `<igds-rich-text-editor>`

class `RichTextEditor` · form element (`checked`, `value`, form-associated) · Figma: Rich Text Editor `15909:10686` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string |  |
| `placeholder` | placeholder | string |  |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `readonly` | readonly | boolean | false |
| `help-text` | helpText | string |  |
| `help-icon` | helpIcon | string |  |
| `tooltip-icon` | tooltipIcon | string |  |
| `tooltip-question` | tooltipQuestion | string |  |
| `tooltip-answer` | tooltipAnswer | string |  |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `auto-focus` | autoFocus | boolean | false |
| `max-height` | maxHeight | string |  |
| `link-modal-label` | linkModalLabel | string | "הזן כתובת קישור" |
| `link-modal-url-label` | linkModalUrlLabel | string | "כתובת URL" |
| `link-modal-text-label` | linkModalTextLabel | string | "טקסט" |
| `link-modal-url-placeholder` | linkModalUrlPlaceholder | string | "הזן כתובת URL" |
| `link-modal-primary-action-label` | linkModalPrimaryActionLabel | string | "אישור" |
| `link-modal-secondary-action-label` | linkModalSecondaryActionLabel | string | "ביטול" |
| `link-popup-edit-label` | linkPopupEditLabel | string | "עריכה" |
| `link-popup-remove-label` | linkPopupRemoveLabel | string | "הסרת קישור" |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-blur` (value: value) · `igds-change` (value: value) · `igds-focus` (value: value) · `igds-input` (value: value) · `valueChange`

Slots: `toolbar`

Methods: `checkValidity()` · `reportValidity()` · `transformText()`* · `makeList()`* · `makeIndent()`* · `toggleLink()`* · `changeTextDirection()`*  (*heuristic — prefer attributes)

### `<igds-link-modal>`

class `LinkModal`

Events: `igds-text-editor-link-confirm` (value: { url, text })

Methods: `open()`*  (*heuristic — prefer attributes)

## search-field

Import (bundler): `import '@igds/core-web/search-field';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-search-field>`

class `SearchField` · Figma: Search Field Regular `1093:5843` (high), Search Field Hero `1142:3462` (high), Search Field Divided Serach `5680:4622` (high), Search Field Filter `13275:2104` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `value` | value | string | "" |
| `suggestions` | suggestions | Suggestion[] | [] |
| `filter-suggestions` | filterSuggestions | Suggestion[] | [] |
| `placeholder` | placeholder | string |  |
| `filter-placeholder` | filterPlaceholder | string | "כל הגופים" |
| `variant` | variant | "default" \| "divided-search" \| "hero" \| "search-filter" | "default" |
| `disabled` | disabled | boolean | false |
| `show-clear` | showClear | boolean |  |
| `clearable` | clearable | boolean | true |
| `voice-search` | voiceSearch | boolean | false |
| `dir` | dir | string | "rtl" |
| `filters` | filters | Filter[] | [] |
| `show-empty-results-message` | showEmptyResultsMessage | boolean | true |

Events: `igds-clear` (value: this.firstInputValue / this.lastInputValue / this.) · `igds-input` (value: this.value / this.firstInputValue / this.lastInput) · `igds-search` (value: this.value / this.lastInputValue) · `igds-select` (value: { label: suggestion.label, id: suggestion.id, valu)

Methods: `playAudio()`* · `setValue()`* · `setDividedSearchInputValue()`*  (*heuristic — prefer attributes)

## segmented-control

Import (bundler): `import '@igds/core-web/segmented-control';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-segmented-control>`

class `SegmentedControl` · Figma: Segmented Control Icon only `35855:33030` (high), Segmented Control Default `35855:34246` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `disabled` | disabled | boolean |  |
| `size` | size | "large" \| "medium" \| "small" |  |
| `name` | name | string |  |

Events: `igds-change` (value: { id: selectedId })

Slots: `(default)`

### `<igds-segment>`

class `Segment`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `selected` | selected | boolean |  |
| `disabled` | disabled | boolean |  |
| `id` | id | string | "7609bfba-c582-41e3-8d39-8b… |

Slots: `icon` · `(default)`

## sidebar

Import (bundler): `import '@igds/core-web/sidebar';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-sidebar-item>`

class `SidebarItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | componentId | string |  |
| `label` | label | string |  |
| `disabled` | disabled | boolean | false |
| `submenu` | subMenu | boolean | false |
| `icon` | icon | string |  |
| `submenu-item` | isSubMenuItem | boolean | false |

Events: `igds-click` (value: this.componentId) · `igds-hover` (value: this.componentId)

Slots: `sidebar-submenu-item`

### `<igds-sidebar>`

class `Sidebar` · Figma: Side Bar Icon Item `14302:10147` (medium)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "default" \| "icon-text" | "default" |
| `label` | label | string |  |
| `open` | open | boolean | false |
| `dir` | dir | string | "rtl" |

Events: `igds-close` (value: (undefined)) · `igds-open` (value: (undefined))

Slots: `(default)` · `sidebar-item`

Methods: `openSubmenuAndAddSubMenuItem()`* · `closeSubMenuAndRemoveSubMenuItem()`* · `closeAllSubMenus()`*  (*heuristic — prefer attributes)

## skeleton

Import (bundler): `import '@igds/core-web/skeleton';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-skeleton>`

class `Skeleton` · Figma: Skeleton `3412:9440` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `variant` | variant | "body" \| "circle" \| "rectangular" \| "subtitle" \| "title" | "rectangular" |
| `radius` | radius | number | 16 |
| `width` | width | string | "100%" |
| `height` | height | string |  |

## slider

Import (bundler): `import '@igds/core-web/slider';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-slider>`

class `Slider` · form element (`checked`, `value`, form-associated) · Figma: Slider Knob `6146:23517` (high), Slider `6371:21439` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `dir` | dir | string | "rtl" |
| `label` | label | string |  |
| `variant` | variant | "range" \| "single" | "single" |
| `min` | min | number | 0 |
| `max` | max | number | 100 |
| `step` | step | number | 1 |
| `disabled` | disabled | boolean | false |
| `icon` | icon | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string |  |
| `required` | required | boolean | false |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `minvaluename` | minValueName | string |  |
| `maxvaluename` | maxValueName | string |  |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `componentId`: string · `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-change` (value: this.value / `${this.minValue}-${this.maxValue}`) · `valueChange`

## spin-box

Import (bundler): `import '@igds/core-web/spin-box';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-spinbox>`

class `SpinBox` · form element (`checked`, `value`, form-associated) · Figma: Spin Box `8022:10946` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `size` | size | "small" \| "big" | "big" |
| `label` | label | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `defaultvalue` | defaultValue | string |  |
| `disabled` | disabled | boolean | false |
| `required` | required | boolean | false |
| `min` | min | number | 0 |
| `max` | max | number | null |
| `helptext` | helpText | string |  |
| `helpicon` | helpIcon | string |  |
| `tooltip` | tooltip | string |  |
| `tooltipquestion` | tooltipQuestion | string |  |
| `tooltipicon` | tooltipIcon | boolean | false |
| `invalid` | invalid | boolean | false |
| `error` | error | string |  |
| `autofocus` | autoFocus | boolean | false |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `componentId`: string · `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-blur` (value: input.value) · `igds-change` (value: this.value) · `igds-focus` (value: input.value) · `igds-input` (value: input.value) · `valueChange`

## step-indicator

Import (bundler): `import '@igds/core-web/step-indicator';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-step-indicator>`

class `StepIndicator` · Figma: Step Indicator Horizontal - Mobile - Round `32526:5885` (high), Step indicator Vertical `35409:4183` (high), Step Indicator Horizontal - Mobile new `50656:10694` (high), Step Indicator Horizontal `37884:2662` (high) +1

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `orientation` | orientation | "horizontal" \| "vertical" | "horizontal" |
| `current` | current | number | 1 |
| `flat` | flat | boolean | false |
| `compact` | compact | boolean | false |
| `flat-label` | flatLabel | string | "שלב {current} מתוך {total}" |
| `flat-failed-label` | flatFailedLabel | string | "שלב {current} נכשל" |

Events: `igds-change` (value: 'step-changed') · `igds-click` (value: detail)

### `<igds-step-item>`

class `StepItem`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label` | label | string |  |
| `secondary-label` | secondaryLabel | string |  |
| `status` | status | "failed" |  |

Slots: `(default)`

## tabs

Import (bundler): `import '@igds/core-web/tabs';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-tabs>`

class `Tabs` · Figma: Tabs `35262:11268` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `currenttabid` | currentTabId | string | "" |
| `centered` | centered | boolean | false |

Events: `igds-change` (value: (undefined))

Slots: `(default)`

### `<igds-tab>`

class `Tab`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | id | string | "" |
| `label` | label | string | "" |
| `disabled` | disabled | boolean | false |
| `icon` | icon | string |  |
| `badge` | badge | number |  |

### `<igds-tab-panel>`

class `TabPanel`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `tab` | tab | string | "" |

Slots: `(default)`

## tag

Import (bundler): `import '@igds/core-web/tag';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-tag>`

class `Tag` · Figma: Tags lines `5951:6247` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `id` | id | string |  |
| `size` | size | "medium" \| "small" | "medium" |
| `icon` | icon | string | "" |
| `disabled` | disabled | boolean | false |
| `removable` | removable | boolean | false |

Events: `igds-remove` (value: 'tag removed') · `igds-select` (value: 'tag selected')

Slots: `(default)`

### `<igds-tag-group>`

class `TagGroup`

Slots: `(default)`

## table

Import (bundler): `import '@igds/core-web/table';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-table>`

class `Table` · Figma: Table Raw `36522:29244` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `selectable` | selectable | boolean |  |
| `editable` | editable | boolean |  |
| `focusable` | focusable | boolean |  |
| `truncated` | truncated | boolean |  |
| `actions` | actions | string[] |  |
| `droppable` | droppable | boolean |  |

Events: `igds-call-action` (value: { rowId, rowIndex, action }) · `igds-cell-change` (value: { rowIndex, cellIndex, newValue: this._newCellValu) · `igds-cell-click` (value: { rowIndex, cellIndex }) · `igds-cell-enter-pressed` (value: { rowIndex: this._focusedCell.row, cellIndex: this) · `igds-cell-link-click` (value: option.id ?? 'link id is not specified') · `igds-drag-end` (value: 'drag-ended') · `igds-drag-start` (value: 'drag-started') · `igds-row-select` (value: this.selectedRows) · `igds-sorting-order-change` (value: { [columnIndex]: sortingDirection > 0 ? 'asc' : 'd)

Slots: `(default)`

Methods: `resetSortingOrder()`* · `editCell()`* · `cancelEditCell()`*  (*heuristic — prefer attributes)

### `<igds-table-cell>`

class `TableCell`

Slots: `(default)`

### `<igds-table-header>`

class `TableHeader`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `columns` | columns | string \| TableHeaderDetails[] |  |

### `<igds-table-row>`

class `TableRow`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `cells` | cells | string \| TableCellDetails[] |  |
| `id` | rowId | string |  |
| `selected` | selected | boolean |  |
| `expandable` | expandable | "true" \| "false" |  |
| `expanded` | expanded | boolean |  |

Slots: `(default)`

## toast

Import (bundler): `import '@igds/core-web/toast';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-toast-container>`

class `ToastContainer`

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `position` | position | "bottom-end" \| "bottom-start" \| "top-end" \| "top-start" \| "bottom-center" \| "top-center" | "top-end" |

Slots: `(default)`

### `<igds-toast>`

class `Toast` · Figma: Floating Toast `49558:7316` (medium), Inline Toast `49509:6905` (medium), Floating Toast1 `58849:8450` (needs-review), Inline Toast1 `58849:8026` (needs-review) +1

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `type` | type | "inline" \| "floating" | "inline" |
| `variant` | variant | "failure" \| "success" \| "attention" \| "info" | "info" |
| `duration` | duration | number | 1000 |
| `inline` | inline | boolean | false |
| `auto-close` | autoClose | boolean | false |
| `closable` | closable | boolean | false |
| `link-action-label` | linkActionLabel | string |  |
| `link-action-url` | linkActionUrl | string |  |
| `close-action-label` | closeActionLabel | string |  |
| `shown` | shown | boolean | false |
| `container` | container | string |  |

Events: `igds-close` (value: 'close toast')

Slots: `title` · `(default)`

Methods: `show()`* · `close()`*  (*heuristic — prefer attributes)

## toggle

Import (bundler): `import '@igds/core-web/toggle';` — static HTML: the browser bundle registers it (see RULES §2).

### `<igds-toggle>`

class `Toggle` · form element (`checked`, `value`, form-associated) · Figma: Toggle `35020:24197` (high)

| attribute | property | type / allowed values | default |
|---|---|---|---|
| `label-title` | labelTitle | string |  |
| `label-text` | labelText | string |  |
| `name` | name | string |  |
| `form` | form | string |  |
| `default-value` | defaultValue | string | "on" |
| `disabled` | disabled | boolean | false |
| `checked` | checked | boolean | false |
| `value` | value | string | "" |

JS-only properties: `componentId`: string · `onChange`: (event: Event) => void

Events: `checkedChange` · `igds-blur` (value: input.value) · `igds-change` (value: input.value) · `igds-focus` (value: input.value) · `valueChange`

## Not in the library (Figma components with no code component)

Do **not** build these. Report `IGDS-GAP` (format in RULES §8). Full list with node links: `igds-registry/figma/figma-gaps.generated.md`.

**Card**: Stamped · **Chat Message**: Message · **Composer AI**: Prompt, Prompt AI, Composer AI, attachment · **Date & Time Picker**: Date Range, Time Picker · **Error message / 404**: Error message · **Input Field**: Text Area · **Loaders**: Loader 24px, Loader 24px- Inverted, Loader 48px · **Phone Number Input Field**: Phone Number Input Field, Country Code · **Quick Answers - Chips**: Quick Answers - Chips · **Social Links**: Facebook, Whatsapp, Instagram, Linkdin, Twiter, TikTok, YouTube, Pinterest, Spotify, threads, Share via social links · **Signature**: Signature · **Table**: Item Edit Modal, Small Cell Item · **Thinking Loader AI**: Prompt, Prompt AI, Composer AI, attachment, Dots / Option 01 · **Tour Guide**: Spotlight, Walkthrough - Modal · **Updates**: Updates/horizontal, Updates

# IGDS — Israeli Government Design System

## README.md

מערכת עיצוב ממשלתית לבניית שירותים דיגיטליים עקביים, נגישים וידידותיים למשתמש עבור ממשלת ישראל.

---

## 01 Foundations

### Design Philosophy

מערכת העיצוב הממשלתית נבנתה על עקרונות של פשטות, בהירות ונגישות. המטרה היא לספק חוויה אחידה לאזרח בכל שירות ממשלתי דיגיטלי, תוך שמירה על סטנדרטים גבוהים של נגישות ושימושיות.

### Principles

- **נגישות קודמת** — כל רכיב נבנה לפי WCAG 2.1 AA לכל הפחות
- **Mobile First** — עיצוב רספונסיבי שמתחיל ממסך קטן
- **RTL Native** — תמיכה מלאה בעברית וערבית מימין לשמאל
- **עקביות** — שפה עיצובית אחידה בכל השירותים הממשלתיים
- **פשטות** — מינימום עומס קוגניטיבי, מקסימום בהירות

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1a56c4` | פעולות ראשיות, קישורים |
| `--color-primary-hover` | `#143f94` | Hover state |
| `--color-primary-light` | `#e8f0fe` | רקע מודגש |
| `--color-text` | `#1a1a1a` | טקסט ראשי |
| `--color-text-secondary` | `#4a4a4a` | טקסט משני, hints |
| `--color-error` | `#d4351c` | שגיאות, ולידציה |
| `--color-success` | `#00703c` | אישורים, הצלחה |
| `--color-border` | `#b1b4b6` | גבולות שדות |
| `--color-border-focus` | `#ffdd00` | Focus ring |
| `--color-background` | `#ffffff` | רקע ראשי |
| `--color-background-page` | `#f3f4f6` | רקע עמוד |

### Typography

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 0.75rem (12px) | תגיות, metadata |
| `--font-size-sm` | 0.875rem (14px) | hints, שגיאות |
| `--font-size-base` | 1rem (16px) | טקסט גוף |
| `--font-size-md` | 1.125rem (18px) | תיאור עמוד |
| `--font-size-lg` | 1.25rem (20px) | כותרות fieldset |
| `--font-size-xl` | 1.5rem (24px) | כותרות משנה |
| `--font-size-2xl` | 2rem (32px) | כותרת עמוד |

**Font Family:** Rubik (ראשי), Assistant (חלופי), Segoe UI, Arial

**Weight:** 300 Light | 400 Regular | 500 Medium | 700 Bold

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | מרווח מינימלי |
| `--space-sm` | 8px | בין אלמנטים קרובים |
| `--space-md` | 16px | padding פנימי |
| `--space-lg` | 24px | בין סקשנים |
| `--space-xl` | 32px | padding דפים |
| `--space-2xl` | 48px | בין בלוקים ראשיים |

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--border-radius` | 4px | רכיבים כלליים (legacy) |
| `--igds-ref-border-radius-m` | 8px | שדות קלט, select, textarea (Figma) |
| `--igds-ref-border-radius-full` | 100px | ידית scrollbar מעוגלת (Figma) |
| `--igds-ref-border-radius-xs` | 4px | רדיוס קטן (אקורדיון, Figma) |
| `--igds-ref-border-radius-xxs` | 2px | רדיוס זעיר (focus של Breadcrumbs, Figma) |
| `--igds-ref-border-width-s` | 1px | עובי גבול כפתור Secondary (Notification Button, Button) |
| `--igds-ref-border-width-l` | 2px | עובי גבול עבה (Figma) |

### IGDS Figma Tokens (מסונכרן מקובץ הפיגמה)

טוקנים אלו נמשכו ישירות מ-Figma (Israeli Government DS 3.0, node `81:115` — Input Field) דרך Figma MCP וממומשים ב-`:root` שבקובץ `styles.css`.

**צבעים — טקסט**

| Token | Value | Usage |
|-------|-------|-------|
| `--igds-base-color-text-subtle-primary` | `#0c3058` | טקסט label וקלט |
| `--igds-base-color-text-subtle-secondary` | `#466186` | placeholder, טקסט קלט משני |
| `--igds-base-color-text-failure` | `#a72223` | טקסט שגיאה, סימון חובה |
| `--igds-base-color-text-disabled` | `#5c697a` | טקסט מושבת |
| `--igds-base-color-text-link-primary-default` | `#0068f5` | קישורי tooltip ("למה זה נחוץ?"), anchor pressed/focused |
| `--igds-base-color-text-link-primary-hover` | `#0045a3` | טקסט קישור/anchor ב-hover |
| `--igds-base-color-text-success` | `#347314` | טקסט תגית Success (Badge) |
| `--igds-base-color-text-warning` | `#a35200` | טקסט תגית Warning (Badge) |
| `--igds-base-color-text-subtle-primary-inverted` | `#f5f9ff` | טקסט על רקע כהה — תגית מספרית התראה (Numeric Badge) |
| `--igds-base-color-button-text-primary` | `#f5f9ff` | אייקון כפתור Primary (Notification Button) |
| `--igds-base-color-button-text-secondary` | `#0068f5` | אייקון כפתור Secondary / Link (Notification Button) |
| `--igds-base-color-button-text-hover-pressed-inverted` | `#f5f9ff` | טקסט כפתור Primary ב-Hover/Pressed (Button) |
| `--igds-base-color-button-text-hover-pressed` | `#0045a3` | חץ ניווט קרוסלה ב-Hover (Carousel) |
| `--igds-base-color-text-link-tertiary-default` | `#0c3058` | טקסט Alternative Link Button — Default (Button) |
| `--igds-base-color-text-link-tertiary-hover` | `#0045a3` | טקסט Alternative Link Button — Hover (Button) |

**צבעים — גבולות**

| Token | Value | Usage |
|-------|-------|-------|
| `--igds-base-color-border-subtle-default` | `#5c697a` | גבול שדה ברירת מחדל |
| `--igds-base-color-border-subtle-hover` | `#323b49` | גבול שדה pre-filled |
| `--igds-base-color-border-brand-hover` | `#0045a3` | גבול שדה ב-hover |
| `--igds-base-color-border-brand-default` | `#0068f5` | גבול brand |
| `--igds-base-color-border-active` / `-focused` | `#0068f5` | גבול שדה פעיל/ממוקד (2px) |
| `--igds-base-color-border-failure` | `#a72223` | גבול שדה שגיאה |
| `--igds-base-color-border-disabled` | `#5c697a` | גבול שדה מושבת |
| `--igds-base-color-border-divider-default` | `#b5c7e2` | קווים מפרידים (Divider — Default) |
| `--igds-base-color-border-divider-inverted` | `#ffffff` | קו מפריד על רקע כהה (Divider — Inverted) |

**צבעים — רקעים**

| Token | Value | Usage |
|-------|-------|-------|
| `--igds-base-color-background-neutral-default` | `#ffffff` | רקע שדה |
| `--igds-base-color-background-disabled-with-text` | `#e0e8ef` | רקע שדה מושבת |
| `--igds-base-color-background-prefiled-input-field` | `#ebf3ff` | רקע שדה pre-filled |
| `--igds-base-color-background-scroller` | `#8091a9` | ידית ה-scrollbar (רכיב Scroll, node `3412:7859`) |
| `--igds-base-color-background-neutral-hover` | `#f2f6fd` | רקע hover לכותרת אקורדיון (node `522:495`) |
| `--igds-base-color-background-neutral-secondlevel` | `#f2f6fd` | רקע תוכן אקורדיון פתוח (node `522:495`) |
| `--igds-base-color-background-neutral-badge` | `#e8f0fc` | רקע תגית In-Progress / Informative (Badge, node `1646:12`) |
| `--igds-base-color-background-failure-without-border` | `#ffcbcb` | רקע תגית Failure (Badge) |
| `--igds-base-color-background-warning-without-border` | `#ffecc2` | רקע תגית Warning (Badge) |
| `--igds-base-color-background-success-without-border` | `#ddffcd` | רקע תגית Success (Badge) |
| `--igds-base-color-background-numeric-badge` | `#c93435` | רקע תגית מספרית התראה (Numeric Badge, node `2078:3425`) |
| `--igds-base-color-background-brand-sidebar-pressed` | `#b7d6ff` | רקע תגית מספרית מונה — Notification=False (Numeric Badge) |
| `--igds-base-color-button-background-primary` | `#0068f5` | רקע כפתור Primary (Notification Button, Button) |
| `--igds-base-color-button-border-primary` | `#0068f5` | גבול כפתור Secondary (Notification Button, Button) |
| `--igds-base-color-background-brand-default` | `#0068f5` | רקע Timed Button (Default) |
| `--igds-base-color-background-brand-hover` | `#0057cc` | רקע כפתור Primary ב-Hover (Button, Timed Button) |
| `--igds-base-color-background-brand-pressed` | `#0045a3` | רקע כפתור Primary ב-Pressed, סרגל התקדמות Timed Button |
| `--igds-base-color-background-secondary-button-pressed` | `#ebf3ff` | רקע Pressed — Secondary / Link / Alternative Link (Button), Toggle פתוח (Split Button) |
| `--igds-base-color-background-state-default` | `#ffffff` | רקע פריט בתפריט (Split Button) |
| `--igds-base-color-button-border-disabled` | `#8091a9` | גבול כפתור Secondary מושבת (Button) |

**מרווחים · רדיוס · טיפוגרפיה**

| Token | Value | Usage |
|-------|-------|-------|
| `--igds-ref-space-100` | 2px | offset של focus outline |
| `--igds-ref-space-200` | 4px | מרווח help text |
| `--igds-ref-space-300` | 8px | מרווח label-field |
| `--igds-ref-space-400` | 12px | padding אנכי של שדה |
| `--igds-ref-space-500` | 16px | padding אופקי של שדה, padding כפתור Large |
| `--igds-ref-space-550` | 20px | padding אופקי כפתור Medium (Button) |
| `--igds-ref-space-600` | 24px | padding כפתור פעולה (Split Button) |
| `--igds-ref-font-size-2xs` | 12px | טקסט תגית מספרית (Numeric Badge) |
| `--igds-ref-font-size-xs` | 14px | hint / help / שגיאה |
| `--igds-ref-font-size-s` | 16px | label וטקסט קלט, טקסט כפתור Small/Medium, FAB Label Mobile |
| `--igds-ref-font-size-l` | 20px | טקסט כפתור Large (Button) |
| `--igds-ref-font-size-xl` | 24px | טקסט FAB Label Desktop (Floating Button) |
| `--igds-ref-font-size-2xl` | 32px | כותרת קרוסלה (Carousel) |
| `--igds-ref-font-weight-regular` | 400 | טקסט קלט |
| `--igds-ref-font-weight-medium` | 500 | label |
| `--igds-ref-font-weight-bold` | 700 | כותרת קרוסלה (Carousel) |
| `--igds-input-height` | 48px | גובה שדה קלט |

### Elevation

| Level | Value | Usage |
|-------|-------|-------|
| Level 0 | none | אלמנטים שטוחים |
| Level 1 | `0 1px 3px rgba(0,0,0,0.08)` | כרטיסים, form containers |
| Level 2 | `0 4px 12px rgba(0,0,0,0.12)` | Modals, dropdowns |

**IGDS Figma Shadows (מסונכרן מקומפוננטת Floating Button, node `1798:2270`)**

| Token | Value | Usage |
|-------|-------|-------|
| `--igds-shadow-light-level1` | `0 2px 8px rgba(6,77,173,0.1)` | כרטיס Default / Disabled (Card) |
| `--igds-shadow-light-level2` | `0 4px 12px rgba(6,77,173,0.15)` | FAB Disabled, overflow dropdown, כרטיס Hover / כפתור מועדפים (Card) |
| `--igds-shadow-dark-level3` | `0 10px 24px rgba(0,104,245,0.15)` | FAB Default / Pressed |
| `--igds-shadow-dark-level4` | `0 16px 36px rgba(0,104,245,0.2)` | FAB Hover |

### Motion

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Border color | 200ms | ease | Focus/hover transitions |
| Background | 150ms | ease | Button hover |

### Icons

- סגנון: Outlined
- גודל בסיסי: 24px
- צבע: יורש מהטקסט (`currentColor`)

---

## 02 Components

### Button

- Class: `.gov-button` + מודיפיקטור סוג + מודיפיקטור גודל (אופציונלי)
- מסונכרן מקומפוננטת **Button** בפיגמה (node `81:1195`) עם טוקני `--igds-*`
- טקסט 16px (Small/Medium) או 20px (Large), radius `8px`, גובה 32/48/56px לפי גודל
- Primary במשקל Medium (500), שאר הסוגים Regular (400)

**Types:**

| Type | Class | Default | Hover | Pressed | Disabled |
|------|-------|---------|-------|---------|----------|
| Primary | `.gov-button--primary` | רקע `button-background-primary`, טקסט `button-text-primary` | רקע `background-brand-hover` | רקע `background-brand-pressed` | רקע `background-disabled-with-text`, טקסט `text-disabled` |
| Secondary | `.gov-button--secondary` | טקסט+גבול `button-text/border-primary` | טקסט+גבול `border-brand-hover` | רקע `background-secondary-button-pressed` | טקסט `text-disabled`, גבול `button-border-disabled` |
| Link Button | `.gov-button--link` | טקסט `button-text-secondary` | טקסט `text-link-primary-hover` | רקע `background-secondary-button-pressed` | טקסט `text-disabled` |
| Alternative Link | `.gov-button--alt-link` | טקסט `text-link-tertiary-default` | טקסט `text-link-tertiary-hover` | רקע `background-secondary-button-pressed` | טקסט `text-disabled` |

**Sizes:**

| Size | Class | גובה | padding | font |
|------|-------|------|---------|------|
| Small | `.gov-button--small` | 32px | `space-200` / `space-300` | 16px |
| Medium | (ברירת מחדל) | 48px | `space-400` / `space-550` | 16px |
| Large | `.gov-button--large` | 56px | `space-400` / `space-500` | 20px |

- **States:** Default, Hover (`:hover`), Pressed (`:active`), Focused (`:focus-visible`, outline צהוב), Disabled (`:disabled` / `[disabled]` / `[aria-disabled="true"]`)
- **אייקון:** `.gov-button__icon` (24px, SVG 16px, `currentColor`) — לפני או אחרי הטקסט. אייקון נמשך מהפיגמה, מסומן `aria-hidden="true"`
- **כפתור אייקון בלבד:** `.gov-button--icon` (ריבועי) — חובה `aria-label` לתיאור הפעולה

### Breadcrumbs (סרגל ניווט היררכי)

- Class: `.breadcrumbs` (`<nav>` עם `aria-label`) + `ol`/`li` + `.breadcrumbs__chevron` (מפריד) + `.breadcrumbs__overflow` (כפתור קיפול)
- מסונכרן מהפיגמה: Breadcrumbs bar (node `53173:56947`), atom (node `35333:33475`)
- פריט = קישור + chevron מפריד (אייקון `outline/arrow-left` מהפיגמה, `currentColor`). טקסט 14px (`--igds-ref-font-size-xs`), line-height 1.6
- הפריט האחרון = העמוד הנוכחי (`aria-current="page"`), ללא chevron וללא קישור
- **מצבי קישור (Atom):**

| State | Selector | מראה |
|-------|----------|------|
| Default | `.breadcrumbs a` | טקסט `text-subtle-secondary` (#466186) |
| Hover | `:hover` | טקסט `text-link-primary-hover` (#0045a3) + קו תחתון |
| Focused | `:focus-visible` | מסגרת `border-focused` (2px) + radius `border-radius-xxs` |
| Current page | `[aria-current="page"]` | טקסט `text-subtle-primary` (#0c3058), לא קישור |

- **Overflow (Expanded True/False):** נתיב ארוך מתקפל — פריטי ביניים מוחבאים תחת כפתור `.breadcrumbs__overflow` ("...", צבע `text-disabled`). לחיצה פותחת את הנתיב המלא. חובה `aria-label` לכפתור הקיפול
- **נגישות:** `<nav aria-label>`, chevron `aria-hidden="true"`, `aria-current="page"` לעמוד הנוכחי

### Floating Button (FAB — כפתור פעולה צף)

- Class: `.gov-fab` + מודיפיקטור סוג + גרסה + גודל
- מסונכרן מהפיגמה: Floating Button (node `1798:2270`). תיעוד מלא: `floating-button.md`
- כפתור פעולה צף (sticky) להדגשת הפעולה החשובה ביותר. אייקון 24px, טקסט Medium
- **Types:** `.gov-fab--primary` (רקע כחול) · `.gov-fab--secondary` (לבן + גבול כחול)
- **גרסאות:** `.gov-fab--icon-only` (עיגול) · `.gov-fab--label` (pill מורחב, אייקון+טקסט או טקסט בלבד)
- **גדלים:** `.gov-fab--desktop` (60px) · `.gov-fab--mobile` (48px)
- **States (צל משתנה לפי מצב):**

| State | Primary | Secondary | צל |
|-------|---------|-----------|-----|
| Default | רקע `button-background-primary` | לבן + גבול `button-border-primary` | `shadow-dark-level3` |
| Hover | רקע `background-brand-hover` | טקסט+גבול `border-brand-hover` | `shadow-dark-level4` |
| Pressed | רקע `background-brand-pressed` | רקע `background-secondary-button-pressed` | `shadow-dark-level3` |
| Focused | outline צהוב | outline צהוב | `shadow-dark-level3` |
| Disabled | רקע `background-disabled-with-text`, טקסט `text-disabled` | גבול `button-border-disabled`, טקסט `text-disabled` | `shadow-light-level2` |

- **נגישות:** אייקון-בלבד חייב `aria-label`; מומלץ טקסט לצד אייקון לאוכלוסיות קצה; אין להוסיף Badge ל-FAB (ראו `floating-button.md`)

### Timed Button (כפתור מתוזמן עם סרגל התקדמות)

- Class: `.gov-timed-button` + `.gov-timed-button__icon` (אייקון) + `.gov-timed-button__content` (מונה + טקסט) + `.gov-timed-button__timer`
- מסונכרן מהפיגמה: .progress timed button (node `36406:73837`)
- כפתור Primary עם מונה זמן `(00:00)` וסרגל התקדמות למנגנון לחיצה ארוכה (press-and-hold). גובה 56px, radius `8px`, טקסט 20px Medium
- **מנגנון ההתקדמות:** שכבת `::before` נמתחת מההתחלה (ימין ב-RTL) עד רוחב `var(--timed-progress)` בצבע `background-brand-pressed`. ברירת מחדל `0%`. המשתנה `--timed-progress` נשלט ב-inline style או ב-JS בזמן הלחיצה
- **States:**

| State | Selector | מראה |
|-------|----------|------|
| Default | `.gov-timed-button` | רקע `background-brand-default` (#0068f5), ללא מילוי |
| Hover | `:hover` | רקע `background-brand-hover` (#0057cc) |
| Pressed | `--timed-progress: 0%→100%` | סרגל `background-brand-pressed` (#0045a3) מתמלא |
| Focused | `:focus-visible` | outline צהוב |
| Disabled | `:disabled` / `[disabled]` / `[aria-disabled="true"]` | רקע `background-disabled-with-text`, טקסט `text-disabled`, ללא מילוי |

- **נגישות:** האייקונים `aria-hidden="true"`; הטקסט כולל את תיאור הפעולה; תמיכה במקלדת (רווח/Enter) ללחיצה ארוכה; Focus גלוי

### Split Button (כפתור מפוצל עם תפריט)

- Class: `.gov-split-button` + `.gov-split-button__bar` (`__action` + `__toggle`) + `.gov-split-button__menu` (`__item`)
- מסונכרן מהפיגמה: Split Button (node `20260:10392`)
- כפתור פעולה ראשי מחובר לכפתור toggle (chevron) שפותח תפריט אפשרויות. מרווח `2px` בין שני הכפתורים; פינות מעוגלות בקצוות החיצוניים בלבד
- ה-chevron מצביע למטה בסגור ומסתובב למעלה בפתוח. התפריט נפתח ב-`[aria-expanded="true"]` על ה-toggle או `.gov-split-button--open` על השורש
- **Types:** `.gov-split-button--primary` (מלא כחול) · `.gov-split-button--secondary` (לבן + גבול כחול)
- **Sizes:** `.gov-split-button--small` (32px) · (ברירת מחדל Medium 48px) · `.gov-split-button--large` (56px)
- **States:** Default, Hover (`background-brand-hover` / `border-brand-hover`), Pressed+Open (`background-brand-pressed` / `background-secondary-button-pressed`), Focused (outline צהוב), Disabled
- **תפריט:** `.gov-split-button__menu` (רקע `background-state-default`, צל `shadow-light-level2`, radius 8px). פריט `.gov-split-button__item`: טקסט `text-subtle-primary`, אייקון 24px, hover `background-neutral-hover`
- **נגישות:** `aria-expanded` + `aria-haspopup` על ה-toggle, `aria-label` לתיאור, סגירה ב-Escape / קליק מחוץ, האייקונים `aria-hidden="true"`

### Input

- Class: `.gov-input`
- מסונכרן מקומפוננטת **Input Field** בפיגמה (node `81:115`) עם טוקני `--igds-*`
- מידות: גובה 48px (`--igds-input-height`), padding `12px 16px`, radius `8px` (`--igds-ref-border-radius-m`)
- טקסט: 16px (`--igds-ref-font-size-s`), צבע `--igds-base-color-text-subtle-primary`
- תמיכה ב-RTL ו-LTR (שדות מייל/טלפון)
- Width variants: `.gov-input--width-10`
- **States (מהפיגמה):**

| State | Class / Selector | Border |
|-------|------------------|--------|
| Default | `.gov-input` | 1px `--igds-base-color-border-subtle-default` |
| Hover | `:hover` | `--igds-base-color-border-brand-hover` |
| Focused / Active | `:focus` | 2px `--igds-base-color-border-focused` |
| Error | `.gov-input--error` | `--igds-base-color-border-failure` |
| ErrorFocused | `.gov-input--error:focus` | failure border + focus outline |
| Disabled | `:disabled` | bg `--igds-base-color-background-disabled-with-text` |
| Pre-filled | `.gov-input--prefilled` | bg `--igds-base-color-background-prefiled-input-field` |

### Dropdown (Select)

- Class: `.gov-select`
- מותאם לאותן מידות וטוקנים של Input Field (גובה 48px, radius 8px, אותם מצבי border)
- מצב שגיאה: `.gov-select--error`
- חץ מותאם RTL (מצד שמאל)
- Appearance מותאם אישית

### Dropdown (תפריט בחירה מותאם / combobox)

- Class: `.gov-dropdown` (מיכל) + `.gov-dropdown__label` (תווית+חובה+אייקונים) + `.gov-dropdown__field` (עטיפה) > `.gov-dropdown__header` (השדה הלחיץ) + `.gov-dropdown__list` (רשימה צפה) + `.gov-dropdown__help` (טקסט עזר/שגיאה)
- מסונכרן מהפיגמה: Dropdown (node `35069:17714`). סקיצה: `sketches/dropdown.html`
- רכיב בחירה מתקדם (combobox) **הנבדל מ-`.gov-select` הנייטיב**: תומך בסינון תוך כדי הקלדה, בחירה מרובה עם תגיות ורשימת אפשרויות צפה. גובה שדה 48px, radius `8px`, padding `12px 16px`, אותה שפה של Input Field
- האייקונים (chevron, image, info, question-mark, alert-circle, close, real-estate) נמשכו כ-glyphs מקוריים מהפיגמה, `currentColor`, מסומנים `aria-hidden="true"`
- **4 סוגים:**

| Type | תיאור |
|------|-------|
| Default | בחירה בודדת — chevron + טקסט + אייקון ימני אופציונלי |
| Active Filterable | מורחב, סינון תוצאות תוך כדי הקלדה (`.gov-dropdown--expanded`) |
| Active Unfilterable | מורחב ללא סינון |
| Tags | בחירה מרובה — צ'קבוקסים בפריטים + "בחירת הכל / הסרת הכל" + תגיות (`.gov-dropdown__tag`) |

- **6 מצבים (על ה-header):**

| State | Selector | Border |
|-------|----------|--------|
| Default | `.gov-dropdown__header` | 1px `--igds-base-color-border-subtle-default` |
| Hover | `:hover` / `.gov-dropdown--hover` | `--igds-base-color-border-brand-hover` |
| Focused | `:focus-visible` / `.gov-dropdown--focused` | 2px `--igds-base-color-border-focused` |
| Expanded | `.gov-dropdown--expanded` | 1px `--igds-base-color-border-brand-default` + chevron מסתובב |
| Error | `.gov-dropdown--error` | `--igds-base-color-border-failure` + טקסט עזר אדום (`role="alert"`) |
| ErrorFocused | `.gov-dropdown--error-focused` | טבעת כפולה: עטיפה כחולה 2px (radius 10px) + גבול failure פנימי |
| Disabled | `.gov-dropdown--disabled` / `[disabled]` | רקע `background-disabled-with-text`, גבול `border-disabled`, טקסט `text-disabled` |

- **רשימה צפה:** `.gov-dropdown__list` — צל `--igds-shadow-light-level2`, radius `8px`. פריט `.gov-dropdown__option`: hover `background-neutral-hover`. ב-Tags: שורת `.gov-dropdown__actions`, מפריד דרך `.gov-divider` הקיים, ו-`.gov-dropdown__option-check` (תיבת סימון ויזואלית)
- **תגית (pill):** `.gov-dropdown__tag` — רקע `background-neutral-secondlevel`, radius `--igds-ref-border-radius-full`, טקסט `text-subtle-secondary`, כפתור הסרה `.gov-dropdown__tag-remove` (אייקון close)
- **placeholder** (`"בחירה"`) בצבע `text-subtle-secondary`; ערך נבחר בצבע `text-subtle-primary` (`.gov-dropdown__value` / `--placeholder`)
- **לא נדרשו טוקנים חדשים** — כל הערכים מופו לטוקנים קיימים
- **נגישות:** ה-header `role=button`/`aria-expanded`, הרשימה `role="listbox"` (+`aria-multiselectable` ב-Tags), פריט `role="option"` + `aria-selected`, שגיאה `aria-invalid` + `role="alert"`, אייקונים `aria-hidden="true"`, כפתורי הסרת תגית עם `aria-label`, Focus גלוי
- **הערה:** הסקיצה סטטית (ללא JS). בפרויקט אמיתי — לבדוק אם קיים רכיב מקביל ב-`@igds/core-web` ולצרוך אותו (R-IGDS-01) לפני צריכת הסקיצה

### Horizontal Filter (רכיב פילטור אופקי)

- Class: `.gov-filter` (מיכל) + `.gov-filter__row` (שורת שדות) + `.gov-filter__checkboxes` (קבוצת צ'קבוקסים) + `.gov-filter__actions` (שורת כפתורים)
- מסונכרן מהפיגמה: Horizontal Filter (node `35782:43322`, גרסת RTL node `3164:824`). סקיצה: `sketches/filter.html`
- **רכיב קומפוזיציה בלבד** — מרכיב רכיבי IGDS קיימים בפריסה אחת, **ללא מראה חדש**: שדות בחירה דרך `.gov-dropdown`, צ'קבוקסים דרך `.gov-checkbox` / `.gov-checkbox-group--horizontal`, וכפתורים דרך `.gov-button--primary` / `.gov-button--secondary`
- **מבנה (מהפיגמה):** שתי שורות של 5 `Dropdown` (Filter Row + Additional Filter Row) בגריד שווה-רוחב, מתחתן קבוצת צ'קבוקסים אופקית מיושרת לסוף (ימין ב-RTL), ולבסוף שורת כפתורים — פעולה ראשית ("החל סינון") + משנית ("ניקוי סינון")
- **פריים (מיכל):** רקע לבן `background-neutral-default`, radius `8px` (`--igds-ref-border-radius-m`), padding פנימי `24px` (`--igds-ref-space-600`), צל `--igds-shadow-light-level1` (Shadow-light/Level1) — הכול מהפיגמה
- **מרווחי פריסה:** כל ה-gaps (בין שדות בשורה, בין שורות, בין שורת שדות לכפתורים, בין הכפתורים) = 16px → `--igds-ref-space-500`. אין ערכי מראה חדשים — לא נדרשו טוקנים חדשים
- **רספונסיביות:** במסך צר (≤768px) השדות נערמים (`grid-template-columns: 1fr`) והצ'קבוקסים מתיישרים להתחלה
- **נגישות:** המיכל `role="group"` + `aria-label` ("מסנני חיפוש"), קבוצת הצ'קבוקסים `role="group"` + `aria-label`; כל מראה/ARIA של שדה/כפתור/צ'קבוק מגיע מהרכיב הקיים — לא משוכפל; Focus גלוי מהרכיבים
- **הערה:** הסקיצה סטטית (ללא JS). בפרויקט אמיתי מרכיבים את הפילטר מרכיבי `@igds/core-web` הקיימים (`igds-select`/dropdown, `igds-checkbox-group`, `igds-button`) ולא בונים מראה מחדש (R-COMP-04)

### Date Picker

- **נצרך מהספרייה הרשמית** `@igds/core-web` כ-`<igds-date-picker>` — לא נבנה מחדש (R-COMP-04). ראו `sketches/date-picker.html` ו-`ספריית-רכיבים-IGDS.md` §2.2
- לוח השנה הפתוח (node `914:1980`) הוא ה-popup המובנה; תצוגות Day/Month/Year הן מצב פנימי (`mode`) שמתחלף בלחיצה על כותרת החודש/השנה

### Date Range (בורר טווח תאריכים — gap-fill מקומי)

- Class: `.gov-date-range` + `__header` (`__nav` + `__arrow` + `__title`) + `__weekdays`/`__weekday` + `__grid`/`__day` + `__footer`
- **פער ספרייה:** רכיב זה **אינו קיים ב-`@igds/core-web 0.1.59`** (הגרסה האחרונה שפורסמה, ללא רכיב date-range וללא תמיכת range ב-`igds-date-picker`). נבנה מקומית כ-gap-fill עד שתפורסם גרסה רשמית, ואז ייצרך במקומו (R-COMP-04)
- מסונכרן מהפיגמה: Date Range (node `35903:11333`), אבני בניין `.Building Blocks/Day` (node `880:387`). כל הערכים דרך טוקני `--igds-*`
- לוח חי (JS): ניווט חודשים, בחירת תאריך התחלה ואז סיום, חישוב ימי הביניים
- **מצבי תא יום (מהפיגמה, `.gov-date-range__day--*`):**

| State | Modifier | מראה |
|-------|----------|------|
| Default | `.gov-date-range__day` | טקסט `text-subtle-primary` |
| Hover | `:hover` | רקע `background-full-screen-default` (#f9fcff) |
| Focused | `:focus-visible` | גבול `border-focused` (2px) |
| Today | `--today` | גבול + טקסט `background-brand-default` (#0068f5) |
| Selected (בודד) | `--selected` | ריבוע מלא `background-brand-default`, טקסט `text-subtle-primary-inverted` |
| Start Range | `--start` | רקע brand, פינות מעוגלות בצד ההתחלה |
| End Range | `--end` | רקע brand, פינות מעוגלות בצד הסיום |
| Range (ביניים) | `--in-range` | פס מלא `background-brand-sidebar-pressed` (#b7d6ff), טקסט `text-subtle-primary` |
| Disabled | `:disabled` / `--disabled` | טקסט `text-disabled` |
| ימי חודש סמוך | `--adjacent` | טקסט `text-subtle-secondary` |
| תא ריק | `--null` | מוסתר |

- **טוקן שנוסף (באישור):** `--igds-base-color-background-full-screen-default` (#f9fcff — רקע Hover של תא יום)
- **נגישות:** הלוח `role="group"` + `aria-label`; כל יום `<button>` עם `aria-label` (תאריך ISO); קצות הטווח `aria-current="date"`; חצי ניווט עם `aria-label`; Focus גלוי

### Text Area

- Class: `.gov-textarea`
- מסונכרן מקומפוננטת **Text Area** בפיגמה (node `3519:2599`) עם טוקני `--igds-*`
- אזור טקסט רב-שורתי עם radius `8px`, padding `12px 16px`, אותם מצבי border של Input Field
- **Scrollbar מותאם** — מסונכרן מרכיב **Scroll** בפיגמה (node `3412:7859`): ידית בצבע `--igds-base-color-background-scroller`, radius `--igds-ref-border-radius-full`
- **שורת תחתית** (`.gov-textarea-footer`): מונה תווים (`.gov-textarea-count`) + help text / הודעת שגיאה
- **States (מהפיגמה):**

| State | Class / Selector | Border |
|-------|------------------|--------|
| Default | `.gov-textarea` | 1px `--igds-base-color-border-subtle-default` |
| Hover | `:hover` | `--igds-base-color-border-brand-hover` |
| Active | — (זהה ל-focus) | `--igds-base-color-border-active` |
| Focused | `:focus` | 2px `--igds-base-color-border-focused` |
| Error | `.gov-textarea--error` | `--igds-base-color-border-failure` |
| Disabled | `:disabled` | bg `--igds-base-color-background-disabled-with-text` |

### Checkbox

- Class: `.gov-checkbox` (עטיפת `<label>`) + `.gov-checkbox__input` (`<input type="checkbox">`, מוסתר ויזואלית אך נגיש) + `.gov-checkbox__box` (התיבה המותאמת) + `.gov-checkbox__label` (התווית)
- מסונכרן מהפיגמה: `.Checkbox+Label+Input` (node `35216:29603`), אטום `.Checkbox/atom` (node `700:1526`)
- תיבה מותאמת 24px, radius `4px` (`--igds-ref-border-radius-xs`), גבול `1px`. gap תיבה-תווית `8px` (`--igds-ref-space-300`), padding `2px` (`--igds-ref-space-100`). טקסט תווית 16px (`--igds-ref-font-size-s`), משקל Regular, צבע `text-subtle-primary`
- סימן ה-checkmark הוא ה-glyph המקורי מהפיגמה (`outline/checkmark`, node `1970:9226`) מוטמע כ-`mask` ב-`::after`, כך שהצבע נשאר דרך הטוקן `text-subtle-primary-inverted` (#f5f9ff) — ללא תלות ב-asset חיצוני שפג תוקף
- **Selected (`:checked`) / Indeterminate (`:indeterminate`, Selected=Neutral):** מילוי `button-background-primary` (#0068f5) + הווי. ביניים = קו אמצעי בלבד
- **States (מהפיגמה, פריט × Selected × RTL):**

| State | Selector | מראה |
|-------|----------|------|
| Default | `.gov-checkbox__box` | רקע `background-neutral-default`, גבול `border-subtle-default` (#5c697a) |
| Hover | `.gov-checkbox:hover ... :not(:disabled)` | גבול `border-brand-hover` (#0045a3) |
| Focused | `:focus-visible` | outline `border-focused` (#0068f5, 2px) + offset 2px |
| Checked | `:checked` | רקע+גבול `button-background-primary`, הווי `text-subtle-primary-inverted` |
| Indeterminate | `:indeterminate` | רקע+גבול `button-background-primary`, קו אמצעי |
| Error | `.gov-checkbox--error` | גבול `border-failure` (#a72223) |
| ErrorFocused | `.gov-checkbox--error :focus-visible` | גבול failure + outline כחול ממוקד |
| Disabled | `:disabled` | רקע `button-background-disabled` (#e0e8ef), גבול/טקסט `border-disabled`/`text-disabled` |
| Disabled+Checked | `:disabled:checked` | רקע `background-disabled-without-text` (#ced7e0), הווי `text-disabled` |

- **וריאנט Input Text:** `.gov-checkbox--with-input` — צ'קבוק המשויך לשדה קלט (דפוס "אחר"). השדה הוא רכיב `.gov-input` הקיים (אותם טוקנים, ללא שכפול); תומך באותם מצבים (Default/Focused/Disabled/Error)
- **וריאנט Checkbox Card:** `.gov-checkbox-card` (מהפיגמה node `35207:4353`) — כרטיס לחיץ המכיל צ'קבוק (פינה עליונה, `.gov-checkbox-card__media` + `__title` + `__description`). עוטף את `.gov-checkbox` הקיים ללא שכפול. גדלים: Desktop (224px, ברירת מחדל) / `.gov-checkbox-card--mobile` (176px). מצב שגיאה: `.gov-checkbox-card--error`
  - **States (כרטיס, דרך `:has()` על הצ'קבוק הפנימי):** Default (גבול `border-subtle-default`), Hover (גבול `border-brand-hover` + רקע `background-neutral-hover`), Selected (גבול `border-active` + כותרת `button-text-secondary` + צל Level1), Focused (outline כחול), Disabled (רקע `button-background-disabled`, טקסט `button-text-disabled`), Disabled+Selected (רקע `background-disabled-without-text-hover` #8596af), Error (`border-failure`), ErrorFocused (radius `border-radius-l` 16px + outline)
  - **טוקנים שנוספו (באישור):** `--igds-ref-border-radius-l` (16px), `--igds-base-color-background-disabled-without-text-hover` (#8596af), `--igds-base-color-button-text-disabled` (#5c697a, alias ל-`text-disabled`)
- **קבוצה:** `.gov-checkbox-group` (אנכי, gap `--igds-ref-space-500`) · `.gov-checkbox-group--horizontal` (אופקי). כותרת `.gov-checkbox-group__title` (16px Medium) עם `.gov-checkbox-group__required` (`*` בצבע `text-failure`); הודעת שגיאה `.gov-checkbox-group__error` (14px, `text-failure`, `role="alert"`)
- **נגישות:** `<input>` אמיתי (Tab, רווח, מצב מועבר ל-AT); `<label>` עוטף לקישור מפורש; שדה חובה `aria-required`; שגיאה `aria-invalid` + `aria-describedby`; ביניים `aria-checked="mixed"` + הגדרת `.indeterminate` ב-JS; Focus גלוי
- **מצב שגיאה בטופס:** נתמך גם דרך `aria-invalid="true"` (שאותו ולידציית הטופס ב-`script.js` מוסיפה אוטומטית), לא רק דרך המודיפיקטור `.gov-checkbox--error`
- **טוקנים שנוספו (באישור, מהפיגמה):** `--igds-base-color-button-background-disabled` (#e0e8ef, זהה ל-`background-disabled-with-text`) ו-`--igds-base-color-background-disabled-without-text` (#ced7e0, מילוי תיבה מסומנת מושבתת)

- **שימוש בטופס:** הטופס ב-`index.html` (צרכים מיוחדים, עדיפות אח/אחות, אישור תקנון) נצרך ישירות מרכיב `.gov-checkbox` החדש.

> הערה: המחלקות הישנות `.gov-checkboxes__item` / `.gov-checkboxes__input` / `.gov-checkboxes__label` (accent-color) נשמרות ב-`styles.css` לתאימות לאחור בלבד — הן אינן בשימוש יותר ב-HTML. רכיב הצ'קבוקס הייעודי הוא `.gov-checkbox`.

### Radio

- Class: `.gov-radios__input` + `.gov-radios__label`
- Layout: inline או vertical

### Accordion

- Class: `.gov-accordion` + `.gov-accordion__item`
- כותרת: `.gov-accordion__header` (button עם `aria-expanded`)
- Chevron: `.gov-accordion__chevron` (מסתובב 180° במצב פתוח)
- אייקון: `.gov-accordion__icon` (24px, outline)
- קו מפריד: `.gov-accordion__divider`
- תוכן: `.gov-accordion__content` (`role="region"`, נפתח/נסגר, רקע second-level)
- מסונכרן משני nodes בפיגמה:
  - **פריט בודד** (node `522:495`) — מקור ה-states
  - **קבוצה** (node `36363:22776`) — מאפייני `Group` ו-`AllowMultiple`
- **States (מהפיגמה, פריט × Expanded True/False):**

| State | Selector | רקע כותרת |
|-------|----------|-----------|
| Default | `.gov-accordion__header` | שקוף |
| Hover | `:hover` | `--igds-base-color-background-neutral-hover` |
| Focused | `:focus-visible` | focus outline צהוב |
| Disabled | `:disabled` / `[aria-disabled="true"]` | `--igds-base-color-background-disabled-with-text` |

- **Group / AllowMultiple:** `AllowMultiple=True` — ניתן לפתוח כמה פריטים יחד; `AllowMultiple=False` — פתיחת פריט סוגרת את האחרים (accordion קלאסי).

### Anchor (ניווט עוגן)

- Class: `.gov-anchor` (מיכל) + `.gov-anchor__link` (פריט/Anchor Atom)
- מסונכרן מהפיגמה: Anchor (node `26540:5240`), Atom (node `7363:2159`)
- רשימת קישורים לסקשנים בעמוד. גרסאות Desktop / Mobile × RTL
- **States (מהפיגמה, Atom × RTL):**

| State | Selector | מראה |
|-------|----------|------|
| Default | `.gov-anchor__link` | טקסט `--igds-base-color-text-subtle-secondary` |
| Hover | `:hover` | טקסט `--igds-base-color-text-link-primary-hover` |
| Pressed | `:active` / `--pressed` | טקסט `--igds-base-color-text-link-primary-default` + קו צדדי `--igds-base-color-border-brand-default` (2px, בצד ההתחלה — מימין ב-RTL) |
| Focused | `:focus-visible` / `--focused` | טקסט כחול + מסגרת מלאה `--igds-base-color-border-focused` (2px, radius 8px) |

- **Current:** `aria-current="true"` על העוגן של הסקשן הפעיל (טקסט כחול + משקל medium)

### Badge (תגית סטטוס)

- Class: `.gov-badge` (מיכל) + `.gov-badge__text` (טקסט) + `.gov-badge__icon` (אייקון אופציונלי)
- מסונכרן מהפיגמה: Badge (node `1646:12`), RTL=True
- תגית סטטוס בצורת גלולה (`--igds-ref-border-radius-full`, 100px), גובה מינימלי 32px, padding אופקי `8px`
- טקסט: 16px (`--igds-ref-font-size-s`), משקל Regular, צבע לפי הסוג
- אייקון אופציונלי: תיבת 24px, SVG 20px, צבע יורש מצבע הטקסט (`currentColor`) — אייקונים אמיתיים נמשכו מהפיגמה
- **Variants (סוג × צבע טקסט + רקע מהפיגמה):**

| Variant | Class | טקסט | רקע | אייקון |
|---------|-------|------|-----|--------|
| Failure | `.gov-badge--failure` | `--igds-base-color-text-failure` | `--igds-base-color-background-failure-without-border` | slash |
| Warning | `.gov-badge--warning` | `--igds-base-color-text-warning` | `--igds-base-color-background-warning-without-border` | alert-circle |
| Success | `.gov-badge--success` | `--igds-base-color-text-success` | `--igds-base-color-background-success-without-border` | success |
| In-Progress | `.gov-badge--in-progress` | `--igds-base-color-text-subtle-primary` | `--igds-base-color-background-neutral-badge` | in-progress |
| Informative | `.gov-badge--informative` | `--igds-base-color-text-subtle-primary` | `--igds-base-color-background-neutral-badge` | info-outline |

- **אייקון אופציונלי:** ניתן להשמיט את `.gov-badge__icon`. האייקון מסומן `aria-hidden="true"` — המשמעות עוברת דרך טקסט התגית.

### Numeric Badge (תגית מספרית / מונה התראות)

- Class: `.gov-numeric-badge` + variant (`--notification` / `--count`)
- מסונכרן מהפיגמה: Numeric Badge (node `2078:3425`)
- תגית מספרית קטנה בצורת גלולה (מונה התראות). טקסט בלבד, ללא אייקון
- מידות: גובה 16px, רוחב מינימלי 16px (ספרה בודדת מתעגלת), רוחב מקסימלי 42px, padding אופקי `4px` (`--igds-ref-space-200`)
- טקסט: 12px (`--igds-ref-font-size-2xs`), משקל Regular, line-height 1.6
- **Variants (מהפיגמה — מאפיין `Info/Notification`):**

| Variant | Class | טקסט | רקע |
|---------|-------|------|-----|
| Notification=True | `.gov-numeric-badge--notification` | `--igds-base-color-text-subtle-primary-inverted` | `--igds-base-color-background-numeric-badge` |
| Notification=False | `.gov-numeric-badge--count` | `--igds-base-color-text-subtle-secondary` | `--igds-base-color-background-brand-sidebar-pressed` |

### Divider (קו מפריד)

- Class: `.gov-divider` (מיכל) + `.gov-divider__line` (הקו עצמו)
- מסונכרן מהפיגמה: Divider (node `708:2124`). סקיצה: `sketches/divider.html`
- קו מפריד בעובי `1px` (`--igds-ref-border-width-s`). הקו יורש את צבעו מהמיכל דרך `currentColor` — אין שכפול ערכי צבע
- **8 וריאנטים** = Position (`--horizontal` / `--vertical`) × Style (Default / `--inverted`) × Width (Full / `--inset`):

| מאפיין | Modifier | מראה |
|--------|----------|------|
| Horizontal | `.gov-divider--horizontal` | קו אופקי לרוחב מלא (ברירת מחדל) |
| Vertical | `.gov-divider--vertical` | קו אנכי לגובה מלא |
| Default | (ברירת מחדל) | צבע `--igds-base-color-border-divider-default` (#b5c7e2) |
| Inverted | `.gov-divider--inverted` | צבע `--igds-base-color-border-divider-inverted` (#ffffff) — לרקע כהה |
| Full | (ברירת מחדל) | הקו נמשך לכל אורך/גובה המיכל |
| Inset | `.gov-divider--inset` | ריווח `--igds-ref-space-500` (16px) בשני הקצוות — אופקי לקו אופקי, אנכי לקו אנכי |

- **טוקן שנוסף (מהפיגמה):** `--igds-base-color-border-divider-inverted` (#ffffff) — צבע הקו בווריאנט Inverted
- **נגישות:** `role="separator"` + `aria-orientation` (`"horizontal"` / `"vertical"`) כאשר הקו נושא משמעות מבנית; קו דקורטיבי בלבד יכול להישאר ללא role

### Notification Button (כפתור אייקון עם תגית התראה)

- Class: `.gov-notification-button` (מיכל) + `.gov-notification-button__btn` (הכפתור/אייקון) + `.gov-notification-button__badge` (התגית הצפה)
- מסונכרן מהפיגמה: Notification Button (node `8372:6620`)
- כפתור אייקון (פעמון, SVG 24px) עם Numeric Badge צף בפינה העליונה המובילה (שמאל ב-RTL דרך `inset-inline-start`)
- **שימוש חוזר:** התגית הצפה היא רכיב `.gov-numeric-badge--notification` הקיים — ללא שכפול קוד
- האייקון יורש את צבע הטקסט של הסוג (`currentColor`); אייקון הפעמון נמשך מהפיגמה
- **הכפתור הפנימי הוא `<button>`** (`.gov-notification-button__btn`) — מאפשר מצבים אינטראקטיביים ו-Tab
- **Types × States (מיושר לרכיב Button, אותם טוקנים):**

| Type | Class | Default | Hover | Pressed | Disabled |
|------|-------|---------|-------|---------|----------|
| Primary | `.gov-notification-button--primary` | רקע `button-background-primary`, אייקון `button-text-primary` | רקע `background-brand-hover` | רקע `background-brand-pressed` | רקע `background-disabled-with-text`, אייקון `text-disabled` |
| Secondary | `.gov-notification-button--secondary` | אייקון+גבול `button-text/border-primary` | אייקון+גבול `border-brand-hover` | רקע `background-secondary-button-pressed` | אייקון `text-disabled`, גבול `button-border-disabled` |
| Link | `.gov-notification-button--link` | אייקון `button-text-secondary` | אייקון `text-link-primary-hover` | רקע `background-secondary-button-pressed` | אייקון `text-disabled` |

- **States:** Default, Hover (`:hover`), Pressed (`:active`), Focused (`:focus-visible`, outline צהוב), Disabled (`:disabled` / `[disabled]` / `[aria-disabled="true"]`) — זהים לרכיב Button

- **Sizes (גודל × מידות כפתור ו-padding):**

| Size | Class | גודל כפתור | padding |
|------|-------|-----------|---------|
| Large | `.gov-notification-button--large` | 56px | `--igds-ref-space-500` (16px) |
| Medium | `.gov-notification-button--medium` | 48px | `--igds-ref-space-400` (12px) |
| Small | `.gov-notification-button--small` | 32px | `--igds-ref-space-200` (4px) |

- כל הגדלים: radius `--igds-ref-border-radius-m` (8px), אייקון 24px
- **נגישות:** `aria-label` על הכפתור (תיאור הפעולה + מספר ההתראות), האייקון מסומן `aria-hidden="true"`, Focus גלוי (`--focus-outline`)

### Toggle

- (בפיתוח)

### Modal

- (בפיתוח)

### Card (כרטיס תוכן)

- Class: `.gov-card` + מודיפיקטור סוג/גודל/כיוון
- מסונכרן מהפיגמה: Card (node `1140:935`)
- מבנה: `.gov-card__media` (תמונה/איור, עם `.gov-card__favorite` אופציונלי) + `.gov-card__content` (`__title` עם `__title-icon`, `.gov-badge`, `__description`, `__label`, ו-`__cta` לכפתור)
- רקע לבן, radius 8px, צל Level1. מ-media ברוחב מלא (יחס 16:9) בכיוון אנכי, או בצד בכיוון אופקי
- **שימוש חוזר:** הכרטיס עוטף את `.gov-badge` ו-`.gov-button` הקיימים — ללא שכפול
- **Types:** `.gov-card--clickable` (לחיץ, עטיפת `<a>`/`<button>`) · CTA (עם `.gov-card__cta` + כפתור) · `.gov-card--static` (Not pressable, סטטי)
- **Sizes:** `.gov-card--small` (200px אנכי) · (ברירת מחדל Large 416px)
- **Direction:** (ברירת מחדל Vertical) · `.gov-card--horizontal` (media בצד)
- **States (Clickable):**

| State | Selector | מראה |
|-------|----------|------|
| Default | `.gov-card--clickable` | צל `shadow-light-level1` |
| Hover | `:hover` | צל `shadow-light-level2` |
| Pressed | `:active` | צל `shadow-dark-level3` |
| Focused | `:focus-visible` | מסגרת `border-focused` + צל |
| Disabled | `.gov-card--disabled` / `[aria-disabled="true"]` | רקע `background-disabled-with-text`, טקסט `text-disabled` |

- **טקסט:** כותרת 20px Medium (`text-subtle-primary`), תיאור 16px (`text-subtle-primary`), תווית 14px (`text-subtle-secondary`)
- **מועדפים:** `.gov-card__favorite` (לב, 48px עגול, צל Level2), `aria-pressed` לסימון מועדף (צבע `text-failure`)
- **Card full picture** (`.gov-card--full-picture`): תמונת רקע מלאה עם scrim (gradient), התוכן על גבי התמונה. `.gov-card--light` (scrim לבן) · `.gov-card--dark` (scrim כהה + טקסט לבן `text-subtle-primary-inverted`)
- **Card full picture + name** (`.gov-card--picture-name`): רק כותרת ממורכזת 24px (`font-size-xl`) על תמונת רקע מלאה עם scrim, Light/Dark. `.gov-card--small` = 222px × 155px
- **נגישות:** כרטיס לחיץ הוא `<a>`/`<button>` עם Focus גלוי; `.form-page` נותר כמיכל טופס נפרד (לא Card)

> הערה: `.form-page` הוא מיכל כללי לעמוד/טופס — רכיב ה-Card הייעודי הוא `.gov-card`.

### Carousel (קרוסלה)

- Class: `.gov-carousel` + `.gov-carousel__header` (`__title` + `__subtitle`) + `.gov-carousel__viewport` > `.gov-carousel__track` + `.gov-carousel__nav` (`__dots` עם `__dot`, ו-`__arrow` אופציונלי)
- מסונכרן מהפיגמה: carousel (node `36417:70941`)
- **שימוש חוזר:** הכרטיסים ברצועה הם רכיב `.gov-card` הקיים (Large או Small) — ללא שכפול
- **מבנה:** כותרת (32px Bold `text-subtle-primary` + כותרת משנה 20px Medium `text-subtle-secondary`) → רצועת כרטיסים נגללת אופקית (gap 16px, scroll-snap, הצצה לכרטיס הבא) → ניווט (נקודות + חצים)
- **נקודות עימוד (`__dot`):** 10px, לא-פעיל `border-divider-default`, פעיל `aria-current="true"` → `text-link-primary-default`
- **חצים (`__arrow`):** כפתורי chevron 32px, צבע `text-link-primary-default`, hover `button-text-hover-pressed`. ה-chevron מותאם RTL (prev לימין, next לשמאל)
- **Variants:** cards / small cards (`.gov-card--small`) · with/without arrows · Mobile (רוחב מצומצם)
- **נגישות:** `aria-roledescription="קרוסלה"` + `aria-label`, הרצועה `role="group"` + `tabindex="0"` לגלילת מקלדת, נקודות וחצים עם `aria-label`

### List

- Breadcrumbs: `.breadcrumbs ol`
- Error summary list: `.gov-error-summary__list`

### Table

- (בפיתוח)

---

## 03 Patterns

### Forms

- Layout: fieldsets עם legends
- שדות חובה מסומנים ב-`*` (עם `aria-required`)
- Hints מתחת ל-label
- Error messages צמודים לשדה

### Validation

- ולידציה ב-submit (לא real-time)
- Error summary בראש הטופס עם קישורים לשדות
- Error message ליד כל שדה שגוי
- Border שמאלי אדום על form-group עם שגיאה
- `aria-invalid` ו-`aria-describedby` על שדות שגויים

### Search

- (בפיתוח)

### Navigation

- Header ממשלתי עם לוגו
- Breadcrumbs עם `aria-label` ו-`aria-current`
- Footer עם קישורי נגישות/פרטיות

---

## 04 Accessibility

- תאימות: WCAG 2.1 Level AA
- Focus visible: צהוב (`#ffdd00`) — 3px outline
- `role="alert"` על הודעות שגיאה
- `aria-required` על שדות חובה
- `aria-describedby` לחיבור hints ושגיאות לשדות
- `aria-current="page"` ב-breadcrumbs
- סדר Tab לוגי
- Labels מפורשים לכל שדה
- כיוון `dir="rtl"` ו-`lang="he"` על ה-HTML

---

## 05 Development

### מבנה קבצים

```
igds-kiro/
├── index.html      # HTML structure
├── styles.css      # Design tokens + component styles
├── script.js       # Form validation logic
└── design.md       # תיעוד זה
```

### שימוש ב-Tokens

כל ערכי העיצוב מוגדרים כ-CSS Custom Properties ב-`:root` — מאפשר התאמה קלה ו-theming.

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### התקנה

אין צורך ב-build — פתחו את `index.html` ישירות בדפדפן.

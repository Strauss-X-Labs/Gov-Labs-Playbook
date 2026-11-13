# IGDS — כללי עבודה מחייבים לכלי AI

> מסמך מרכזי ובלתי תלוי בכלי. Claude Code, Kiro, Cursor וכל כלי אחר מפנים לקובץ הזה.
> הוא נכתב ידנית ומשתנה רק בהחלטה ארגונית. **הנתונים** (רכיבים, attributes, ערכים, טוקנים)
> אינם כתובים כאן — הם נוצרים אוטומטית מהחבילות המותקנות, בקבצים שלהלן.

## 0. מקורות אמת — לפי סדר עדיפות

| # | מקור | מה הוא קובע | קובץ |
|---|------|--------------|------|
| 1 | קוד החבילה המותקנת `@igds/core-web` | אילו תגים, props, attributes, ערכים, events, slots קיימים | `igds-registry/ai/IGDS-COMPONENTS.md` (נוצר אוטומטית) · מלא: `igds-registry/components.generated.json` |
| 2 | חבילת `@igds/tokens` | אילו טוקנים קיימים ומה ערכם | `igds-registry/ai/IGDS-TOKENS.md` (נוצר אוטומטית) · מלא: `igds-registry/tokens.generated.json` |
| 3 | קובץ Figma הקנוני `FXkIGvCtnuZZDrMjiSm29r` | איך הרכיב נראה ואיזה וריאנט מתאים לאיזה צורך | `igds-registry/figma/figma-mapping.generated.json` |
| 4 | `MD/MD/frontend-constitution.md` | כללי ארכיטקטורה (R-IGDS-*, R-BUILD-*) | |

**אינם מקור אמת:** `design.md`, `styles.css`, מחלקות `.gov-*`, תיקיית `sketches/`, `script.js`.
אלה פרוטוטייפ ידני מוקדם. אין להעתיק מהם רכיבים, ערכים או שמות טוקנים.

כשקוד ו־Figma סותרים — **הקוד קובע מה אפשר לכתוב**; הסתירה נרשמת בדוח הפערים
(`igds-registry/figma/figma-gaps.generated.md`), ולא "מתוקנת" בקוד שלך.

## 1. היררכיית פתרון — חובה, בסדר הזה

1. רכיב רשמי `igds-*` קיים? → השתמש בו.
2. השתמש רק ב־API המופיע ב־`IGDS-COMPONENTS.md`: attributes, properties, ערכים, events, slots.
3. אין רכיב אחד שעונה על הצורך? → **הרכב** (composition) כמה רכיבים רשמיים, או השתמש ב־slots.
4. עיצוב סביבת הרכיבים (layout, מרווחים בין רכיבים) → רק דרך טוקנים `--igds-*`.
5. אין פתרון רשמי? → **עצור.** כתוב דיווח פער (סעיף 8) ובקש אישור לפני כל רכיב מותאם.

**אסור:** להמציא תג, attribute, ערך variant, event, slot או שם טוקן. אסור לבנות look‑alike
ב־HTML/CSS לרכיב שקיים בספרייה. אסור לעטוף רכיב IGDS ב־CSS שמשנה את המראה הפנימי שלו.

## 2. טעינת הספרייה (מאומת בדפדפן)

**פרויקט סטטי ללא bundler:**
```html
<html dir="rtl" lang="he">
<head>
  <!-- 1. טוקנים — תמיד ה־stylesheet הראשון -->
  <link rel="stylesheet" href="node_modules/@igds/tokens/lib/index.min.css">
  <!-- 2. bundle הדפדפן — חובה defer (או בסוף body) -->
  <script src="node_modules/@igds/core-web/lib/index.min.js" defer></script>
</head>
```
⚠️ **אומת בפועל:** טעינת `index.min.js` ב־`<head>` **בלי `defer`** זורקת שגיאה בזמן הטעינה,
ורק 4 מתוך 73 רכיבים נרשמים — השאר מוצגים כאלמנטים ריקים, בלי הודעה ברורה.

**פרויקט עם bundler:** import לפי רכיב, לפי עמודת `import` בקטלוג:
```js
import '@igds/tokens';                 // ראשון, בגיליון הגלובלי
import '@igds/core-web/date-picker';   // רושם את igds-date-picker
```
בפרויקט עם bundler אסור לייבא את `lib/index.min.js`.

## 3. Attributes ו־Properties

- שם ה־attribute הוא **בדיוק** מה שמופיע בעמודת `attribute` בקטלוג. ברירת המחדל של Lit היא
  שם ה־property **באותיות קטנות, בלי מקפים** — `logoUrl` → `logourl`, לא `logo-url`.
  רק attributes שהוגדרו במפורש כוללים מקף (למשל `help-text`). אל תנחש — בדוק בקטלוג.
- property שמופיע ב־"JS-only properties" בקטלוג (אין לו attribute) מוגדר **בקוד בלבד**, לא ב־HTML:
  ```js
  document.querySelector('igds-checkbox').indeterminate = true;
  ```
- **Boolean:** הנוכחות קובעת. `disabled="false"` **משבית** את הרכיב. כדי לכבות — אל תכתוב את ה־attribute.
- **Object / Array** (למשל `options` של `igds-dropdown`) → ב־attribute רק JSON תקין; עדיף להגדיר כ־property בקוד:
  ```js
  document.querySelector('igds-dropdown').options = [{ label: 'ירושלים', value: 'jlm' }];
  ```
- ערך enum → רק אחד מהערכים ברשימה (`"primary" | "secondary" | …`). ערך אחר = שגיאה.
- attributes גלובליים של HTML (`id`, `class`, `dir`, `lang`, `hidden`, `slot`, `aria-*`, `data-*`, `role`, `tabindex`, `title`, `style`) מותרים.

## 4. Events

- מאזינים רק לאירועים שמופיעים בעמודת `events` של הרכיב.
- אירועי IGDS נשלחים כ־`CustomEvent` עם `bubbles: true, composed: true`,
  ו־`detail` במבנה `{ value, ...options }` (מאומת ב־`IGDSElement.emit`).
  ```js
  el.addEventListener('igds-change', (e) => console.log(e.detail.value));
  ```
- `checkedChange` / `valueChange` — אירועי תאימות ל־Angular בלבד (מ־`AngularFormElement`). בקוד vanilla העדף `igds-change`.
- אל תצמיד `onclick` ישיר כתחליף לאירוע IGDS קיים (`igds-click`).

## 5. Methods

הספרייה חושפת ב־TypeScript מאות מתודות public שהן פרטי מימוש (`renderX`, `handleX`, `getX`...).
בקטלוג מופיעות רק מתודות שסווגו כ־**`consumer-api-standard-element`** (למשל `focus`, `checkValidity`)
או **`candidate-consumer-api`** (למשל `show`/`hide`). מתודה שאינה בקטלוג — אל תקרא לה.
לשליטה בצורה הצהרתית, העדף attribute/property (למשל `open`) על פני קריאה למתודה.

## 6. Slots

השתמש רק בשמות slot שמופיעים בקטלוג (`slot="icon"`). `(default)` = תוכן ישיר בתוך התג.

## 7. טוקנים (R-IGDS-03)

- **צבע** → טוקנים סמנטיים `--igds-base-color-*` בלבד. הם מתחלפים אוטומטית ב־dark theme.
- **מרווח, radius, צל, טיפוגרפיה** → `--igds-ref-space-*`, `--igds-ref-border-radius-*`, `--igds-base-shadow-*` / `--igds-ref-shadow-*`, `--igds-base-type-*` / `--igds-ref-font-*`.
- אסור להשתמש ב־`--igds-ref-<color>-*` (פלטת הצבעים הגולמית) ישירות לצבע ממשק — זה עוקף את ה־theme.
- אסור ערכי hex / rgb / px קשיחים לצבע, מרווח או radius.
- **אסור להמציא שם טוקן.** כל `var(--igds-…)` חייב להופיע ב־`IGDS-TOKENS.md`. הבדיקה האוטומטית תיכשל אחרת.
- ערכה כהה: `data-theme="dark"` על `<html>`, או מחלקה `igds-dark-theme` על אלמנט עוטף.

## 8. דיווח פער — במקום להמציא

כשאין רכיב, attribute, וריאנט או טוקן מתאים, כתוב בתשובה (ובקוד כהערה), ועצור:

```
IGDS-GAP
need:        <מה נדרש, במילים>
closest:     <הרכיב/וריאנט הרשמי הקרוב ביותר, מהקטלוג>
missing:     <מה בדיוק חסר — tag / attribute / value / slot / token>
figma:       <node id אם ידוע, אחרת "unknown">
proposal:    <composition מרכיבים קיימים / בקשת אישור לרכיב מותאם>
```

## 9. נגישות ו־RTL

- `<html dir="rtl" lang="he">`. רכיבי IGDS מגיעים עם RTL, focus, ARIA ומקלדת — **לא לבטל** אותם.
- כל שדה טופס: `label` של הרכיב עצמו (לא `<label>` חיצוני מקביל). שדה חובה: `required`. שגיאה: `invalid` + `error`.
- אייקון: `igds-icon` מקבל את תוכן ה־SVG של אייקון רשמי ב־**property** `node` (בקוד JS), מתוך `@igds/icons` —
  `import { calendar } from '@igds/icons'; el.node = calendar;`. **אסור `name="..."`** — הרכיב מתעלם ממנו בזמן ריצה
  ומציג אייקון ריק (אומת בדפדפן; `npm run igds:lint` מדווח `E-ATTR-REJECTED`).
- אייקון בעל משמעות: גם `accessible-name`. אייקון דקורטיבי: `aria-hidden="true"`.
- עמידה ב־WCAG 2.2 AA.

## 10. בדיקה לפני סיום — חובה

לפני שאתה מסיים משימה שיצרה או שינתה HTML / JS / CSS, הרץ:

```bash
npm run igds:lint -- <file-or-folder>
```

הבדיקה נכשלת על: תג `igds-*` לא קיים, attribute לא קיים, ערך enum לא חוקי, שם slot לא קיים,
טוקן `--igds-*` לא קיים, וטעינת bundle ללא `defer`. **אל תסיים משימה כשהבדיקה נכשלת**,
ואל "תתקן" אותה על ידי מחיקת הרכיב הרשמי — תקן את השימוש, או דווח פער.

## 11. כשהספרייה מתעדכנת

אל תעדכן את קובצי הקטלוג ידנית. הרץ `npm run igds:refresh` — הוא מחלץ מחדש, מאמת,
ומייצר `igds-registry/registry-changes.md` עם מה שנוסף/הוסר/השתנה בין הגרסאות.

# ספריית רכיבים למעצבים — IGDS

מסמך זה מרכז **אך ורק את הנחיות השימוש (צריכה) בספריית הרכיבים הרשמית של IGDS** —
הספרייה שפותחה לפי הפיגמה של הדיזיין סיסטם. ההנחיות נלקחו מתוך
`frontend-constitution.md` (סעיפי `R-IGDS-*` ו-`R-BUILD-03`), וצומצמו למה שרלוונטי
**לצרוך** את הרכיבים — לא לכתוב אותם.

> **עיקרון על (R-IGDS-01 / §FP1): IGDS הוא מקור האמת היחיד.**
> כל רכיב UI נצרך מהספרייה הרשמית. **לא בונים מחדש** רכיב שכבר קיים בספרייה,
> ולא מוסיפים ספריות UI זרות (MUI, Bootstrap, Ant, Chakra, Tailwind UI וכו').

---

## 1. חבילות הספרייה

| חבילה | תפקיד | מתי לצרוך |
|-------|-------|-----------|
| `@igds/core-web` | רכיבי Web Components (`igds-button`, `igds-date-picker` וכו') | תמיד — זהו ליבת הספרייה |
| `@igds/tokens` | טוקני העיצוב (צבע, מרווח, טיפוגרפיה, radius, צל, motion) | תמיד — נטען **ראשון** |
| `@igds/icons` | ~410 אייקונים כ-named imports (tree-shakeable) | כשצריך אייקון |
| `@igds/react` / `@igds/angular` | עטיפות דקות ל-React / Angular | רק בפרויקט מבוסס Framework |

מקור ה-registry: GitLab IGDS registry (סקופ `@igds`). ה-`NPM_TOKEN` **לעולם לא נשמר ב-repo** —
הוא מגיע מ-CI secrets / סביבה בלבד, ובקובץ `.npmrc` מופיע כ-`${NPM_TOKEN}` בלבד (R-IGDS-02).

---

## 2. שתי דרכי צריכה — בחרו לפי הפרויקט (R-BUILD-03)

### א. פרויקט ללא Bundler — HTML סטטי / פרוטוטייפ ← **הדרך הפשוטה ביותר**

זו הדרך עם **מינימום התקנות**. טוענים את ה-CSS של הטוקנים ואת ה-bundle של הדפדפן
(`lib/index.min.js`, פורמט IIFE, חושף `window.IGDSCoreWeb` ורושם אוטומטית את כל הרכיבים),
ואז פשוט משתמשים ב-tag:

```html
<!-- טוקנים ראשון תמיד (R-IGDS-07) -->
<link rel="stylesheet" href="./node_modules/@igds/tokens/lib/index.min.css" />
<!-- bundle הדפדפן — רושם את כל רכיבי IGDS -->
<script src="./node_modules/@igds/core-web/lib/index.min.js"></script>

<igds-date-picker></igds-date-picker>
```

> ה-bundle הזה מותר **רק** בפרויקט ללא bundler (HTML סטטי, פרוטוטייפ, סביבה legacy).

### ב. פרויקט עם Bundler — Vite / Webpack / Angular / Next וכו'

מייבאים לפי רכיב (per-component entry points) כדי לשמר tree-shaking ותקצוב גודל per-route:

```ts
import '@igds/core-web/date-picker';            // vanilla / web component
// או דרך עטיפת ה-framework:
import { DatePicker } from '@igds/react/date-picker';
```

❌ אסור בפרויקט עם bundler לייבא את `lib/index.min.js` או להיתלות ב-`window.IGDSCoreWeb` —
זה מביא את כל הספרייה לכל עמוד ושובר את תקציב ה-JS.

---

## 2.1 Checkbox — `igds-checkbox` / `igds-checkbox-group`

תיבת סימון רשמית מהספרייה. **נצרכת, לא נבנית מחדש** (R-IGDS-01). ה-API להלן מאומת מול
החבילה המותקנת `@igds/core-web/lib/checkbox` ו-`.../checkbox-group`.

### צ'קבוקס בודד — `igds-checkbox`

```html
<!-- פרויקט סטטי: טוקנים ראשון, ואז bundle הדפדפן (ראו §2א) -->
<igds-checkbox
  name="specialNeeds"
  value="yes"
  label="לילד/ה יש צרכים מיוחדים הדורשים התאמה">
</igds-checkbox>
```

```ts
// פרויקט עם bundler (per-component entry — ראו §2ב)
import '@igds/core-web/checkbox';
// או עטיפת framework:
import { Checkbox } from '@igds/react/checkbox';
```

**מאפיינים עיקריים** (מתוך `checkbox.d.ts`):

| מאפיין | טיפוס | שימוש |
|--------|-------|-------|
| `label` | `string` | טקסט התווית |
| `name` / `value` | `string` | שם וערך לטופס (`formAssociated`) |
| `defaultValue` | `string` | ערך ברירת מחדל |
| `required` | `boolean` | שדה חובה |
| `disabled` | `boolean` | מצב מושבת |
| `indeterminate` | `boolean` | מצב ביניים (Selected=Neutral) |
| `invalid` / `error` | `boolean` / `string` | מצב שגיאה + הודעת שגיאה |
| `helpText` / `helpIcon` | `string` | טקסט/אייקון עזר |
| `variant` | `'default' \| 'card' \| 'with-input'` | סוג הצ'קבוקס (`IGDS_CHECKBOX_VARIANTS`) |
| `description`, `imageSrc`, `imageAlt` | `string` | שדות לווריאנט `card` |

### קבוצת צ'קבוקסים — `igds-checkbox-group`

```html
<igds-checkbox-group label="כותרת" orientation="vertical" required>
  <igds-checkbox name="g" value="1" label="תווית"></igds-checkbox>
  <igds-checkbox name="g" value="2" label="תווית"></igds-checkbox>
  <igds-checkbox name="g" value="3" label="תווית"></igds-checkbox>
</igds-checkbox-group>
```

**מאפייני קבוצה** (מתוך `checkbox-group.d.ts`): `label`, `orientation` (`'horizontal' | 'vertical'`),
`required`, `disabled`, `invalid`, `error`, `helpText`/`helpIcon`, `tooltip`/`tooltipQuestion`/`tooltipIcon`.
הקבוצה מנהלת אוטומטית disabled/invalid לילדים ומחשבת "הכול מסומן".

### אירועים (R-IGDS-04 / §5)

- `igds-checkbox` חושף callback `onChange(event, value)` ומפיץ אירוע `change` נייטיב (`formAssociated`).
- `igds-checkbox-group` חושף `onGroupChange(values: string[])`.
- ב-React: `onIgdsChange`; ב-vanilla מאזינים ל-`change` / ל-callback. **לא** `onclick` ישיר על הרכיב.

### נגישות

RTL, ניהול focus, ARIA (`aria-checked="mixed"` לביניים) וניווט מקלדת מגיעים מובְנים ברכיב —
**לא לבטל**. שדה חובה → `required`; שגיאה → `invalid` + `error` (מקושר אוטומטית ל-AT).

> הדמיה סטטית (סקיצת HTML/CSS של כל המצבים, לצורכי עיצוב בלבד) נמצאת ב-`sketches/checkbox.html`
> ומבוססת על טוקני `--igds-*`. בפרויקט אמיתי צורכים את `igds-checkbox` מהספרייה, לא את הסקיצה.

---

## 2.2 Date Picker — `igds-date-picker`

בורר תאריך רשמי מהספרייה, כולל לוח שנה מובנה. **נצרך, לא נבנה מחדש** (R-IGDS-01 / R-COMP-04).
ה-API להלן מאומת מול החבילה המותקנת `@igds/core-web/lib/date-picker` (`date-picker.d.ts` + `constants.d.ts`).

```html
<!-- פרויקט סטטי: טוקנים ראשון, ואז bundle הדפדפן (ראו §2א) -->
<igds-date-picker label="תאריך" dir="rtl"></igds-date-picker>
```

```ts
// פרויקט עם bundler (per-component entry — ראו §2ב)
import '@igds/core-web/date-picker';
// או עטיפת framework:
import { DatePicker } from '@igds/react/date-picker';
```

**מאפיינים עיקריים** (מתוך `date-picker.d.ts`):

| מאפיין | טיפוס / ערכים | שימוש |
|--------|----------------|-------|
| `label` / `name` | `string` | תווית ושם לטופס (`formAssociated`) |
| `default-value` | `string` | ערך ברירת מחדל |
| `min` / `max` | `string` | טווח תאריכים מותר (+ `min-error` / `max-error`) |
| `required` / `disabled` / `readonly` | `boolean` | חובה / מושבת / קריאה בלבד |
| `invalid` / `error` | `boolean` / `string` | מצב שגיאה + הודעה |
| `placeholder` / `date-format` | `string` | טקסט מציין מקום / פורמט תצוגה |
| `with-icon` | `boolean` | הצגת אייקון לוח שנה |
| `open-on-focus` | `boolean` | פתיחת הלוח ב-focus |
| `without-calendar` | `boolean` | הזנה ידנית בלבד, ללא לוח |
| `start-week-on` | `'sunday' \| 'monday'` | יום תחילת השבוע (`IGDS_START_WEEK_ON`) |

> `mode` (`'date' \| 'month' \| 'year'`, `IGDS_DATE_MODE`) הוא **מצב פנימי**, לא מאפיין שמוגדרים מראש:
> הלוח נפתח תמיד בתצוגת יום, והמעבר לחודש/שנה נעשה בלחיצה על כותרת החודש/השנה בתוך הלוח.

### לוח השנה הפתוח (Figma node `914:1980`)

לוח השנה (תצוגות Day / Month / Year × RTL/LTR בפיגמה) הוא ה-**popup המובנה** של הרכיב —
לא רכיב נפרד ולא משוכפל ב-HTML. נפתח בלחיצה על השדה / ב-`open-on-focus` / דרך `toggle-popup()`,
ונשלט ע"י `is-popup-open`. שלוש התצוגות הן מצבי־פנים של אותו לוח: הלוח נפתח בתצוגת יום, ולחיצה על
כותרת החודש/השנה עוברת לתצוגת חודש/שנה (`openMonthPicker` / `openYearPicker`). ניווט בין חודשים/שנים,
בחירת יום, ו-RTL/LTR מנוהלים פנימית ברכיב.

### אירועים ונגישות

- `onChange(event)` / אירוע `change` נייטיב (`formAssociated`). ב-React: `onIgdsChange`.
- RTL, ARIA, ניהול focus וניווט מקלדת (חצים, Enter/רווח לפתיחה ובחירה) מגיעים מובְנים — **לא לבטל**.

### Date Range — פער ספרייה (R-COMP-04)

בחירת טווח תאריכים (**Date Range**) קיימת בפיגמה (node `35903:11333`, כולל מצבי `Start Range` /
`End range` / `Range` ב-`.Building Blocks/Day`), אך **אינה קיימת בספרייה**: הגרסה המותקנת
`@igds/core-web 0.1.59` היא האחרונה שפורסמה (מתוך 51 גרסאות), ואין בה רכיב `date-range` ולא
תמיכת range ב-`igds-date-picker` (אין מאפייני start/end/range ב-API). לפי **R-COMP-04** —
מדווחים את הפער ל-maintainers של `@igds/core-web` ו**לא בונים look-alike ב-HTML/CSS**. כשתפורסם
גרסה עם תמיכת טווח — נצרוך אותה (upgrade + צריכה).

בינתיים קיים **gap-fill מקומי** (`.gov-date-range`, סקיצה `sketches/date-range.html`) שנבנה מאבני הבניין
בפיגמה (node `880:387`) עם טוקני `--igds-*`, עד שתפורסם גרסה רשמית — ואז הוא יוחלף בצריכת הרכיב מהספרייה.

> סקיצת צריכה (כל המצבים + תצוגות הלוח, והערת הפער על Date Range) נמצאת ב-`sketches/date-picker.html`, נצרכת מ-`@igds/core-web`.

---

## 3. טוקנים — ראשון תמיד (R-IGDS-03 / R-IGDS-07 / §FP6)

- כל ערך ויזואלי (צבע, מרווח, פונט, radius, גבול, צל, שקיפות, משך אנימציה) מגיע מ-`@igds/tokens`
  דרך CSS Custom Properties (`var(--igds-...)`). **אסור** ערכי hex/px/ms קשיחים בקוד.
- גיליון הטוקנים (`@igds/tokens`) הוא ה-import/`<link>` **הראשון** — לפני כל CSS אחר —
  אחרת רכיבים נטענים לפני שהמשתנים מוגדרים (FOUC, shadow DOM שבור, CLS).

---

## 4. אייקונים (R-IGDS-05)

- אייקונים דרך הרכיב `igds-icon` (או `<Icon>` ב-React) עם **named import מפורש** מ-`@igds/icons`:

```tsx
import { Icon } from '@igds/react/icon';
import { calendar } from '@igds/icons';

<Icon node={calendar} accessibleName="בחירת תאריך" />
```

- כל אייקון בעל משמעות חייב `accessible-name` / `accessibleName`.
  אייקון דקורטיבי בלבד (לצד טקסט) — `aria-hidden="true"`.
- אסור `igds-dynamic-icon` בקוד חדש (מבטל tree-shaking).

---

## 5. מוסכמות שמות של הספרייה (R-IGDS-04)

| היבט | פורמט | דוגמה |
|------|-------|--------|
| Custom element | `igds-` + kebab-case | `igds-date-picker` |
| Event | `igds-` + kebab-case | `igds-change` |
| Prop ב-React | `onIgds*` PascalCase | `onIgdsChange` |
| Output ב-Angular | `igds*` camelCase | `igdsChange` |

> בחיבור event של רכיב IGDS: ב-vanilla מאזינים ל-`igds-change`,
> ב-React משתמשים ב-`onIgdsChange`. **לא** `onclick`/`(click)` רגיל על רכיב IGDS.

---

## 6. רכיב מותאם מרכיב IGDS — הרכבה, לא בנייה מחדש (R-COMP-04)

כשצריך רכיב "מותאם" — **עוטפים** רכיב IGDS קיים דרך props/slots, לא בונים look-alike ב-HTML/CSS.
רכיב חדש מותר רק לדפוס שבאמת אין לו מקבילה ב-IGDS; פער כזה מדווחים ל-maintainers של `@igds/core-web`.

---

## 7. נגישות ו-RTL (R-A11Y-* / R-RTL-*)

- רכיבי IGDS מגיעים עם RTL כברירת מחדל, ניהול focus, ARIA וניווט מקלדת מובנים — **לא לבטל אותם**.
- שורש העמוד: `<html dir="rtl" lang="he">`. Focus גלוי תמיד; אסור `outline: none` ללא תחליף `:focus-visible`.
- עמידה ב-WCAG 2.2 AA היא רצפה מחייבת (חוקית), לא שאיפה.

---

## צ'ק-ליסט לצריכת רכיב מהספרייה

1. ✅ הרכיב קיים בספרייה? → צרכו אותו, אל תבנו מחדש.
2. ✅ `@igds/tokens` נטען ראשון?
3. ✅ בפרויקט סטטי — `lib/index.min.js`; בפרויקט עם bundler — import per-component?
4. ✅ אירועים דרך `igds-*` / `onIgds*`?
5. ✅ אייקונים דרך `igds-icon` + named import, עם `accessible-name`?
6. ✅ אין ערכים ויזואליים קשיחים — הכול דרך טוקנים?
7. ✅ `dir="rtl"`, focus גלוי, ARIA תקין?

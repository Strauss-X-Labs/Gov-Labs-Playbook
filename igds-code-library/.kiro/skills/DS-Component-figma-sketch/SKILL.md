---
name: DS-Component-figma-sketch
description: למעצבים — יצירת עמוד תצוגה (sketch) של רכיב IGDS עם כל המצבים והווריאנטים שלו, באמצעות הרכיב הרשמי `igds-*` מהספרייה, והשוואה מול Figma דרך Figma MCP. השתמש כשמבקשים "סקיצה / mockup / רכיב מהפיגמה עם כל המצבים".
---

# DS-Component-figma-sketch

עמוד תצוגה של רכיב **רשמי** במצביו השונים — לא שחזור ידני שלו ב־HTML/CSS.
הכללים המחייבים: `igds-registry/ai/IGDS-RULES.md`. בכל סתירה — הם גוברים.

## מקורות

- API של הרכיב (תגים, attributes, ערכים, slots, events): `igds-registry/ai/IGDS-COMPONENTS.md`
- טוקנים: `igds-registry/ai/IGDS-TOKENS.md`
- מיפוי Figma ↔ קוד ופערים: `igds-registry/figma/figma-mapping.generated.json`, `igds-registry/figma/figma-gaps.generated.md`

## תהליך

1. **זהה את הרכיב בקוד.** מצא את התג בקטלוג. אם הצורך מגיע משם ב־Figma — חפש אותו במיפוי
   (שם ב־Figma ≠ שם התג; חלק מרכיבי Figma הם וריאנט של רכיב קוד אחר).
   לא נמצא? → `IGDS-GAP` ועצור.
2. **Figma (אופציונלי, להשוואה ויזואלית).** קובץ קנוני: `FXkIGvCtnuZZDrMjiSm29r`.
   `create_session` → `get_metadata` / `get_screenshot` לנוד הרכיב. אל תעתיק ערכים גולמיים מ־Figma לקוד.
3. **בנה את עמוד התצוגה** בקובץ חדש `sketches/igds-<component>.html` (לא לגעת בסקיצות הקיימות):
   - `<html dir="rtl" lang="he">`, טוקנים ראשונים, bundle עם `defer` (ראה RULES §2).
   - כל מצב = מופע של התג הרשמי עם ערכי attribute שונים, **רק** מתוך הערכים בקטלוג
     (למשל כל ערך של `variant` × `size`, `disabled`, `invalid` + `error`).
   - כותרת לכל מצב; עטיפת תצוגה (grid, תוויות) רק בעזרת טוקני `--igds-*`.
   - מצב שקיים ב־Figma ואין לו attribute בקוד → אל תזייף אותו; רשום אותו בטבלת הפערים.
4. **טבלת התאמה** בתחתית העמוד: `וריאנט Figma → ערך attribute בקוד → סטטוס (קיים / פער)`.
5. **בדיקה:** `npm run igds:lint -- sketches/igds-<component>.html` חייב לעבור.

## כללי עצירה

- אין רכיב רשמי → `IGDS-GAP`, בקש אישור.
- וריאנט Figma בלי ערך מתאים בקוד → פער בטבלה, לא CSS מותאם.
- אין להשתמש במחלקות `.gov-*` או ב־`styles.css`.

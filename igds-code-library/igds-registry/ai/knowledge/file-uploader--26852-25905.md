# File Uploader

> **מקור:** Figma — File upload / הנחיות לשימוש ([node 26852:25905](https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=26852-25905)). טקסט מילולי מהקנבס, ללא עריכה. כותרות הסעיפים הן מ-Figma; הסיווג (בסוגריים) נגזר לפי כלל R-KIND.

| | |
|---|---|
| קטגוריה (Component Overview) | Data Entry |
| תג קוד | `<igds-file-uploader>` — verified (mapping + Figma annotation agree) |
| סטטוס קוד לפי Figma | קוד חלקי (Pay-Attention) |
| קומפוננטות נוספות לאיסוף קלט | Search Field · Date Picker · Dropdown · Input Field |

**רכיב קלט שמאפשר למשתמש להעלות קובץ אחד או יותר מהמכשיר שלו**

## סוגים (סוגים / וריאנטים)

Single File Upload

נשתמש כאשר יש צורך להעלות קובץ בודד או מספר קבצים שונים (שאין ביניהם קשר)

Multiple Files Upload

נשתמש כאשר יש צורך להעלות מספר קבצים מאותו סוג (לדוגמה 12 תלושי שכר)

## אנטומיה (אנטומיה)

Heading

Help Text

Description

Status Icon

Upload Area

Delete File

Heading

טקסט לתיאור הקובץ הנדרש להעלאה

Help Text

(אופציונלי) מציין את מספר הקבצים שהועלו

Description

טקסט שמציין איזה גודל ופורמט של קובץ ניתן להעלות (במידה ויש הגבלות)

Upload Area

אזור אליו גוררים קבצים או לוחצים עליו ונפתחת תיבת בחירת הקבצים של המחשב

Delete File

אייקון להסרת קובץ שהועלה

Status Icon

אייקון שמציין את סטטוס הקובץ (Not uploaded yet, Loading, Uploaded, Failed)

## מצבים (מצבים)

Single File Upload

Default

Hover

Focused

Disabled

Not uploaded yet

Loading

Uploaded

Failed

Multiple Files Upload

Default

Hover*

Focused

Disabled

Error **

Not uploaded yet

Loading

Uploaded

Failed**

* כאשר לוחצים על קובץ מתוך רשימת הקבצים שהועלו, נפתח חלון תצוגה מקדימה (Preview) של הקובץ.
** שימוש ב־Error ב־Upload Area:
כאשר אף קובץ לא הועלה בהצלחה, יוצג מצב Error באזור ההעלאה (Upload Area).
שימוש ב־Failed ב־Added File:
כאשר חלק מהקבצים הועלו וחלקם נכשלו, יוצג מצב Failed על הקבצים הבעייתיים. בנוסף, אם קובץ הועלה חלקית ונמצאה בו תקלה, יוצג גם כן מצב Failed על אותו קובץ.

## מתי להשתמש (מתי להשתמש)

- להגשת מסמכים כחלק מטופס
- לייבוא נתונים בממשקים שבהם יש צורך להעלות נתונים בכמות גדולה

## מתי להימנע (מתי להימנע)

- ככלל עדיף לבקש מהמשתמש להזין מידע במקום להעלות קובץ, שהיא פעולה שמצריכה יותר מאמץ. ככל שזה אפשרי עדיף להתחשב בכך באיפיון.

## עשה ואל תעשה (עשה ואל תעשה)

יש להשתמש ב- Multiple Files Upload עבור העלאת קבצים מאותו הסוג (כמו בדוגמא של תלושי שכר)

אין להשתמש ב- Single File Upload עבור קבצים שהם מאותו הסוג (כמו בדוגמא של  תלושי שכר)

> לא מתועד ב-Figma עבור רכיב זה: נגישות. אין להשלים מהמצאה.

> ⚠️ הסעיף כולל 1 תמונות (בעיקר דוגמאות עשה/אל תעשה) — תוכנן החזותי לא חולץ. לצפייה: https://www.figma.com/design/FXkIGvCtnuZZDrMjiSm29r/?node-id=26852-25905

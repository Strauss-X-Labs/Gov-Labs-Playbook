# IGDS Registry — סטטוס (2026-11-11, שלב ג׳)

גרסאות: `@igds/core-web 0.1.59` · `@igds/tokens 0.1.59` · `typescript 5.9.3` · Figma `FXkIGvCtnuZZDrMjiSm29r`.
פקודה אחת לכל רענון: `npm run igds:refresh` (~30–90 שניות). אין MCP Server חדש; ספריית IGDS לא שונתה.

## מה בוצע ונבדק, לפי שלב

| שלב | בוצע | בדיקות שעברו | לא אומת |
|---|---|---|---|
| 1. Steering | גיבוי ל־`_backups/2026-11-11-pre-stage-c/`. `design-system.md` + `design-workflow.md` הוחלפו ב־`.kiro/steering/igds.md` (תמיד) + `igds-catalogs.md` (קובצי UI). ה־skill עודכן לרכיבים רשמיים. sketches לא שונו. | — | התנהגות Kiro בפועל עם ה־steering החדש (לא הורץ Kiro) |
| 2. טוקנים | `build-tokens.mjs`: 633 טוקנים, ערכים פתורים ל־light/dark, קישור לרכיבים שמשתמשים בהם | 5/5 בדיקות | — |
| 2. API | אירועים כולל ירושה ו־payload; סיווג 607 מתודות; הרחבת aliases לערכים; אימות runtime בדפדפן אמיתי | 9/9 חילוץ · 5/5 runtime (73/73 רשומים, attributes זהים בדיוק ל־observedAttributes) | אירועים לא נבדקו באינטראקציה; מתודות "candidate" — היוריסטיקה |
| 3. Figma | snapshot דרך MCP (נשמר byte-exact), מיפוי אוטומטי עם רמת ביטחון, דוח פערים אחד | 126 סטים ציבוריים: 49 high · 22 medium · 14 needs-review · 41 ללא מקבילה בקוד | 36 התאמות medium/needs-review דורשות החלטה אנושית |
| 4. הנחיות | `ai/IGDS-RULES.md` (ידני, ניטרלי) + קטלוגים מחוללים; מתאמים: `CLAUDE.md`, `AGENTS.md`, `.kiro/steering/`, `.cursor/rules/` | הדוגמאות ב־RULES עוברות lint | Cursor בפועל לא נבדק |
| 5. איכות | `lint-igds.mjs` (13 כללים, כולל Markdown) + `tests/` + `diff-registry.mjs` + `examples/government-form.html` | 18/18 self-tests · דוגמת טופס: 0 שגיאות + רינדור מלא בדפדפן · diff זיהה 4/4 שינויים שוברים בסימולציה | CI אמיתי לא הורץ (יש דוגמה בלבד) |
| 6. שכבת ידע (Figma) | `knowledge/`: הנחיות מילוליות (96 סעיפים), עמוד Design Tokens, AI Examples, משתנים, סגנונות, תבניות, פריסות, דוגמאות, אייקונים; 98 כרטיסים ב־`ai/knowledge/` + `ai/IGDS-GUIDELINES-INDEX.md`; שכבות figma / verified / ai-derived (ריקה) | 96/96 סעיפים · תווים = 292,508 (זהה לביקורת) · 86/86 עמודים מסווגים, 0 לא־מוסברים · 287 משתנים מול CSS (280 תואמים) · lint על `ai/` 0 שגיאות | 361 תמונות עשה/אל־תעשה לא חולצו; שכבת הידע **לא** מחוברת למתאמים (ממתין לאישור הפצה). דוח: `knowledge/KNOWLEDGE-COVERAGE-2026-11-11.md` |

## ממצאים שדורשים החלטה / העברה

1. **ספריית IGDS (upstream)** — `--igds-light-toast-icon-size` נקרא ב־file-uploader ולא מוגדר בשום מקום; `igds-toolbar-item` קורס כשהוא לבד; אין לוגו רשמי באף חבילה; דוגמת ה־README הרשמי משתמשת בטוקן שלא קיים (`--igds-base-color-text-primary`).
2. **Figma ↔ קוד** (`figma/figma-gaps.generated.md`): כפתור `Intent=Danger`, Toast `AI`/`Confirmation`, Date Range, Time Picker, Phone input, Chat/Composer AI, Signature, Tour Guide ועוד — קיימים ב־Figma ולא בקוד. 21 צבעים סמנטיים ב־Figma בלי טוקן CSS. שגיאת כתיב ב־Figma: `Faliure`.
3. **מסמכים בפרויקט שמלמדים קוד שבור** (לא שונו — דורש אישור):
   - `ספריית-רכיבים-IGDS.md`: `open-on-focus` → בפועל `openonfocus` (וגם `sketches/date-picker.html`).
   - `MD/MD/frontend-constitution.md`: 8 טוקנים מומצאים (`--igds-light-ref-space-4` וכו').
   - sketches: טוקנים מומצאים (`--igds-shadow-light-level2` וכו'); `index.html` + sketches בנויים מ־`.gov-*` (1,131 שימושים).
4. **סתירות Figma ↔ קוד משכבת הידע** — 6 סעיפים ש־Figma אומר שאין להם קוד אך התאמה אוטומטית שייכה לתג כללי (Split/Floating Button, Chat Input, Kpi Cards, Mega Menu, Scroll); Loaders מובייל "קוד מלא" בלי תג; 7 ערכי משתנים שונים (radius-xs/s, stroke-l, space-minus400, bright-grey/100, neutral-badge, neutral-secondlevel); 8 רמות צל בלי טוקן CSS.
5. **התאמות Figma לאישור** — 14 needs-review + 22 medium. מאשרים ב־`figma/figma-mapping.overrides.json`.

## תחזוקה

- שדרוג `@igds/*` → `npm run igds:refresh` → לקרוא `registry-changes.md` (exit 3 = שינוי שובר) → `npm run igds:lint` בפרויקטים.
- שינוי בקובץ Figma → לבקש מסוכן: "Refresh the IGDS Figma snapshot following igds-registry/figma/README.md".
- הפרויקט אינו מאגר git — מומלץ להעביר את `igds-registry/` למאגר ארגוני ולהריץ ב־CI (`ci/gitlab-ci.example.yml`).

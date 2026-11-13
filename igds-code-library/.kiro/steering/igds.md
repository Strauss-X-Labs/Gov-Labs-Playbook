---
inclusion: always
---

# IGDS — כללים מחייבים (מתאם Kiro)

קובץ זה הוא מתאם דק. הכללים עצמם נמצאים במקום אחד, משותף לכל כלי ה־AI בארגון:

#[[file:../../igds-registry/ai/IGDS-RULES.md]]

הקטלוגים (נוצרים אוטומטית מהקוד) נטענים אוטומטית כשעובדים על קובצי UI — ראה `igds-catalogs.md`.
אם הם לא נטענו, קרא אותם ידנית לפני כתיבת UI:
`igds-registry/ai/IGDS-COMPONENTS.md`, `igds-registry/ai/IGDS-TOKENS.md`.

תקציר — בכל סתירה הקובץ המרכזי גובר:
1. רק רכיבי `igds-*` רשמיים וטוקני `--igds-*` שמופיעים בקטלוגים.
2. לא `.gov-*`, לא `styles.css`, לא `design.md` — פרוטוטייפ ידני ישן.
3. אין פתרון רשמי → `IGDS-GAP` ועצור.
4. לפני סיום: `npm run igds:lint -- <file>` חייב לעבור.

גיבוי ה־steering הקודם: `igds-registry/_backups/2026-11-11-pre-stage-c/.kiro/steering/`.

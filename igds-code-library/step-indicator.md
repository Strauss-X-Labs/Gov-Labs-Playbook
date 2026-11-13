# Step Indicator

## תיאור כללי

הרכיב מציג את מיקום המשתמש בתהליך מרובה שלבים תוך ציון המצב של כל שלב.
השלבים אינם לחיצים — הרכיב משמש לצורך אוריינטציה בלבד.

**קומפוננטות נוספות למצבים ומדדים:** Progress Bar, Badge

> להנחיות שימוש נוספות במסגרת איפיון ודוגמאות: [WWW.IGDS.GOV.IL](http://www.igds.gov.il)

---

## סוגים (Variants)

### 1. Horizontal

פריסה אופקית לדסקטופ — מציגה את כל השלבים בשורה אחת עם מספור ושם שלב.

| Property | Value |
|----------|-------|
| RTL | True / False |
| מתאים ל- | תהליכים בדסקטופ עם מספר שלבים מוגבל |
| תתי-שלבים | תומך ברמה אחת וברמה נוספת |

---

### 2. Horizontal – Compact

פריסה אופקית מצומצמת לדסקטופ — מציגה את שמות השלבים בלבד, ללא מספור עיגולי.

| Property | Value |
|----------|-------|
| RTL | True / False |
| מתאים ל- | חזות נקייה יותר בתהליכים פשוטים |

---

### 3. Vertical

פריסה אנכית — השלבים מוצגים אחד מתחת לשני עם Connecting Track אנכי.

| Property | Value |
|----------|-------|
| RTL | True / False |
| States | Not Started, Current, Completed, Failed, Failed-Hover, Current+substeps |
| מתאים ל- | הצגת רמה נוספת של שלבים (תתי-שלבים) בתהליך |

---

### 4. Mobile (Progress Bar)

פריסה ייעודית למובייל — מציגה Progress Bar עם טקסט "שלב X מתוך Y".

| Property | Value |
|----------|-------|
| Total steps | 2–10 |
| Current step | 1–10 |
| RTL | True / False |
| State | Success / Failed |
| מתאים ל- | תהליכים הכוללים בין 3 ל-10 שלבים במובייל |

---

### 5. Mobile – Round

פריסה עגולה למובייל — מציגה עיגולים ממוספרים עם שם השלב הנוכחי.

| Property | Value |
|----------|-------|
| Steps | 3 / 4 |
| RTL | True / False |
| מתאים ל- | תהליכים עם 3–4 שלבים עם צורך בתאימות ויזואלית בין מובייל לדסקטופ |

---

## אנטומיה (Anatomy)

| # | Element | תיאור |
|---|---------|--------|
| ① | **Status Indicator** | מציין את סטטוס השלב (Completed, Current, Not Started) |
| ② | **Connecting Track** | קו המחבר בין ה-Status Indicators |
| ③ | **Step Label** | טקסט תיאורי קצר המתאר את השלב |

---

## מצבים (States)

### Completed ✅

כאשר המשתמש מילא את המידע הנדרש בתוך השלב והתקדם לשלב הבא.

- ה-Status Indicator מוצג עם אייקון ✓ (צ׳ק)
- ה-Connecting Track מלא (כחול / מודגש)

### Current 🔵

כאשר המשתמש מקיים אינטראקציה עם המידע שבשלב זה.

- ה-Status Indicator מוצג כעיגול מלא כחול עם מספר לבן
- ה-Step Label מודגש

### Not Started ⚪

כאשר המשתמש עדיין לא קיים אינטראקציה עם אותו שלב.

- ה-Status Indicator מוצג כעיגול ריק (outline) עם מספר אפור
- ה-Connecting Track ריק (אפור)

### Failed ❌

כאשר השלב נכשל.

- ה-Status Indicator מוצג באדום
- ה-Connecting Track באדום
- קיים גם מצב **Failed-Hover** עבור אינטראקציית ריחוף

---

## תתי-שלבים (Sub-Steps)

הרכיב תומך ברמה נוספת של שלבים (תתי-שלבים) בתוך כל שלב ראשי.

### תנאים להוספת תתי-שלבים:

1. השלב חייב להיות במצב **Current**
2. יש להגדיר את ה-Container של רשימת השלבים ל-**Hug Contents**

> הגדרה זו מבטיחה שהתתי-שלבים יוצגו בצורה תקינה וישמרו על המבנה ההיררכי של הרכיב.

### רכיבי משנה:

| רכיב | תיאור |
|-------|--------|
| `.Sub-Steps` | מכיל את רשימת תתי-השלבים (RTL: True/False) |
| `.Sub-Step Unclickable` | פריט תת-שלב בודד (לא לחיץ) |

---

## מתי להשתמש ✅

- כאשר המשתמש עובד בתהליך ליניארי שניתן לארגן ב**שלושה שלבים או יותר**
- כאשר המשתמש יכול להפיק תועלת מהבנת ההתקדמות שלו בטפסים ארוכים
- כאשר יש צורך לאמת את קלט המשתמש לפני המעבר לשלב הבא

---

## מתי להימנע ❌

- כאשר לתהליך או לטופס יש **פחות משלושה שלבים**
- כאשר לתהליך אין רצף ברור או ליניארי של שלבים
- כאשר אין חשיבות לסדר הפעולות בתהליך והוא יכול להסתיים בכל סדר
- כאשר מספר השלבים עשוי להשתנות בהתבסס על לוגיקה מותנית

---

## דגשים לשימוש

| נושא | הנחיה |
|------|--------|
| מספר שלבים (פונה אזרח) | יש לצמצם ל-3–5 שלבים. כאשר יש יותר, ניתן להשתמש בתתי-שלבים |
| מספר שלבים (מערכות פנימיות) | אפשר להשתמש בעד 9 שלבים |
| Connector בשלב אחרון | יש להסתיר את ה-Connector בשלב האחרון על ידי כיבוי ה-toggle בפאנל העיצוב |
| תתי-שלבים | כדי להוסיף תתי-שלבים, השלב צריך להיות במצב Current |
| Container | יש להגדיר את ה-Container של רשימת השלבים ל-Hug Contents להצגה תקינה של תתי-שלבים |

---

## עשה ואל תעשה (Do's & Don'ts)

### ✅ עשה

- השתמש ב-**3 מילים לכל היותר** לשם השלב
- דייק את המילים — שיהיו כמה שיותר מובנות וברורות
- השתמש בוריאנט **Vertical** כאשר רוצים להציג תתי-שלבים

### ❌ אל תעשה

- אין להשתמש ביותר מ-3 מילים לשלב
- אין להשתמש ב-Step Indicator עבור תהליכים עם פחות מ-3 שלבים
- בתהליכים עם שני שלבים, מומלץ לא להשתמש ב-Step Indicator כדי להימנע מעומס חזותי מיותר

---

## הנחיות מובייל

- במובייל, יש להשתמש בפריסה אופקית (Horizontal) עבור תהליכים הכוללים בין 3 ל-10 שלבים
- בתהליכים עם שני שלבים, מומלץ לא להשתמש ב-Step Indicator כדי להימנע מעומס חזותי מיותר
- כאשר לתהליך יש 3–4 שלבים ויש צורך בתאימות ויזואלית בין מובייל לדסקטופ, ניתן להשתמש ב-Step Indicator עגול (Mobile Round) גם בתצוגת מובייל

---

## רכיבי משנה (Sub-Components)

| רכיב | תיאור | מצבים / Variants |
|-------|--------|------------------|
| `.Step Status` | אינדיקטור סטטוס בודד | Current, Completed, Not Started, Failed, Failed-Hover |
| `.Connecting Track` | קו מחבר בין שלבים | Completed, Uncompleted (+ וריאציות למובייל ולמספר שלבים) |
| `.Connecting Track (Vertical)` | קו מחבר אנכי | Unactive / Complete × First / Second / Vertical |
| `.Sub-Steps` | מיכל לתתי-שלבים | RTL: True / False |
| `.Sub-Step Unclickable` | פריט תת-שלב בודד | 3 וריאנטים |
| `.Step Indicator Horizontal` (פנימי) | שלב בודד בפריסה אופקית | Status × RTL |
| `.Step Indicator Vertical` (פנימי) | שלב בודד בפריסה אנכית | State × RTL |
| `.Step Indicator Horizontal - Mobile` (פנימי) | שלב בודד במובייל | Status × RTL |
| `.Step Indicator Horizontal-Compact` (פנימי) | שלב בודד בפריסה קומפקטית | 4 מצבים (LTR + RTL) |

---

## Dark Mode

הרכיב תומך ב-Dark Mode עם דוגמאות שימוש ייעודיות.

---

## מבנה הרכיבים (Component Hierarchy)

```
Step Indicator
├── Step Indicator Horizontal              (RTL: True/False)
├── Step Indicator Horizontal - Compact    (RTL: True/False)
├── Step Indicator Vertical                (RTL: True/False)
├── Step Indicator Horizontal - Mobile     (Total steps × Current step × RTL × State)
└── Step Indicator Mobile - Round          (Steps × RTL)

Sub-Components (Internal)
├── .Step Status                           (5 states)
├── .Connecting Track                      (12 variants)
├── .Connecting Track (Vertical)           (6 variants)
├── .Step Indicator Horizontal             (Status × RTL)
├── .Step Indicator Vertical               (State × RTL)
├── .Step Indicator Horizontal - Mobile    (Status × RTL)
├── .Step Indicator Horizontal-Compact     (4 variants)
├── .Sub-Steps                             (RTL: True/False)
└── .Sub-Step Unclickable                  (3 variants)
```

---
name: update-project-test
description: בודק ענף של הפלייבוק על המיזם הזה, לפני PR ל-main של הפלייבוק — שואל איזה ענף למשוך, פותח ענף playbook-test/ במיזם ומעדכן עליו בלבד, בלי לגעת ב-main ובלי push אלא אם המנטור מבקש. הפעל כשמבקשים "בדוק ענף של הפלייבוק", "update project test", "משוך פלייבוק מענף".
---

ההוראות המלאות בעותק של הפלייבוק בתוך ה-repo הזה: קרא את [.playbook/skills/onboard-project/SKILL.md](../../../.playbook/skills/onboard-project/SKILL.md) ופעל לפיו בדיוק — **מצב בדיקה**, על ה-repo הזה (תיקיית העבודה הנוכחית). את שם ה-repo, החשבון וכתובת הפלייבוק קח מ-`git remote get-url origin` ומ-`.playbook/SOURCE`, ואשר מול המשתמש. את הענף של הפלייבוק — מהפרמטר, ואם אין, שאל.

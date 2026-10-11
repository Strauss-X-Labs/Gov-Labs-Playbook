#!/usr/bin/env bash
# פונקציות משותפות ל-scaffold.sh ול-upgrade.sh. נטען ב-source, לא מריצים ישירות.
# PLAYBOOK = שורש הפלייבוק שממנו רצים — ה-clone הטרי, ראה SKILL.md שלב 2.

# מה לא נכנס ל-.playbook: חומרי מקור (40MB, לא נחוץ לסוכן), השלד של המיזם (כבר בשורש המיזם),
# הגדרות הכלים של הפלייבוק עצמו (שלא ייטענו כ-skills בתוך המיזם), וכלי תחזוקה של הפלייבוק
PLAYBOOK_EXCLUDE=(חומרי-מקור תבנית-מיזם .claude .kiro .agent .gemini .gitignore .gitattributes skills/scan-sources)

# copy_playbook <repo של המיזם> — מחליף את <repo>/.playbook בעותק של הפלייבוק (קבצים במעקב git בלבד)
# ורושם מאיפה ובאיזה commit ב-.playbook/SOURCE. את .playbook לא עורכים ביד — הוא מוחלף כולו בכל עדכון.
copy_playbook() {
  local out="$1/.playbook" x
  rm -rf "$out"
  mkdir -p "$out"
  git -C "$PLAYBOOK" archive HEAD | tar -x -C "$out"
  for x in "${PLAYBOOK_EXCLUDE[@]}"; do rm -rf "${out:?}/$x"; done
  printf 'url=%s\ncommit=%s\ndate=%s\n' \
    "$(git -C "$PLAYBOOK" remote get-url origin)" \
    "$(git -C "$PLAYBOOK" rev-parse --short HEAD)" \
    "$(git -C "$PLAYBOOK" log -1 --format=%cs)" > "$out/SOURCE"
}

# make_days <שם המיזם> <repo של המיזם> — 01-ימים/NN-<יום>/README.md לכל יום ב-01-ימים/ של הפלייבוק
# (NN-שם; מדלגים על _תבנית-יום ו-README). README קיים — לא נדרס.
# מדפיס את שמות הימים שנוצרו (שורה לכל יום).
make_days() {
  local name="$1" out="$2" d day readme title
  for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
    day="$(basename "$d")"
    readme="$out/01-ימים/$day/README.md"
    [ -e "$readme" ] && continue
    mkdir -p "$out/01-ימים/$day"
    title="$(head -1 "$d/סקירה.md" | sed 's/^# *//')"
    cat > "$readme" <<EOF
# $title

החומר של **$name** ביום הזה — שמים כאן את הקבצים כמו שהם: מצגות, מסמכי Word, סיכומי מפגש ודיונים, ראיונות, תמונות, שיעורי בית, החלטות.

- מה קורה ביום, ואיך: [סקירה](../../.playbook/01-ימים/$day/סקירה.md) · [תהליכים](../../.playbook/01-ימים/$day/תהליכים) בפלייבוק
- תוצרים לא כאן — ב-[תוצרים/](../../תוצרים/), באותו שם כמו ב-[02-תוצרים-וטמפלטים](../../.playbook/02-תוצרים-וטמפלטים)
EOF
    echo "$day"
  done
}

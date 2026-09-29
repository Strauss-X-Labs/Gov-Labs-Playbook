#!/usr/bin/env bash
# בונה את מבנה ה-repo של מיזם חדש בתוך תיקייה קיימת (בדרך כלל clone של ה-repo היעד).
#   bash skills/onboard-project/scaffold.sh "<שם המיזם>" <תיקיית-יעד> ["<מיקום החומר הגולמי>"]
#
# 1. מעתיק את תבנית-מיזם/ (כולל .kiro/) — לא דורס קבצים קיימים
# 2. מחליף [שם המיזם] ו-[מיקום החומר הגולמי] ב-README.md וב-.kiro/steering/*.md
#    (ברירת מחדל למיקום: `ידע/` ב-repo הזה)
# 3. יוצר ימים/NN-<יום>/README.md לכל יום שקיים ב-01-ימים/ בפלייבוק
set -euo pipefail

NAME="${1:?חסר שם מיזם}"
OUT="${2:?חסרה תיקיית יעד}"
WHERE="${3:-\`ידע/\` ב-repo הזה}"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"
PLAYBOOK_URL="https://github.com/Strauss-X-Labs/Gov-Labs-Playbook/blob/main"

[ -d "$OUT" ] || { echo "אין תיקייה: $OUT" >&2; exit 1; }

# 1. תבנית — cp -n: קובץ שכבר קיים ביעד נשאר כמו שהוא
skipped=()
while IFS= read -r -d '' f; do
  rel="${f#"$PLAYBOOK/תבנית-מיזם/"}"
  mkdir -p "$OUT/$(dirname "$rel")"
  if [ -e "$OUT/$rel" ]; then skipped+=("$rel"); else cp "$f" "$OUT/$rel"; fi
done < <(find "$PLAYBOOK/תבנית-מיזם" -type f -print0)

# 2. שם המיזם ומיקום החומר הגולמי — escape לתווים מיוחדים של sed (& / \ — גם בלינקים)
esc=$(printf '%s' "$NAME" | sed 's/[&/\]/\\&/g')
wesc=$(printf '%s' "$WHERE" | sed 's/[&/\]/\\&/g')
for f in "$OUT/README.md" "$OUT"/.kiro/steering/*.md; do
  [ -f "$f" ] || continue
  # בלי sed -i — ב-Mac הוא מתנהג אחרת
  sed "s/\[שם המיזם\]/$esc/g; s/\[מיקום החומר הגולמי\]/$wesc/g" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done

# 3. תיקייה לכל יום, לפי 01-ימים/ (NN-שם; מדלגים על _תבנית-יום ו-README)
days=()
for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
  day="$(basename "$d")"
  mkdir -p "$OUT/ימים/$day"
  days+=("$day")
  readme="$OUT/ימים/$day/README.md"
  if [ -e "$readme" ]; then skipped+=("ימים/$day/README.md"); continue; fi
  title="$(head -1 "$d/סקירה.md" | sed 's/^# *//')"
  cat > "$readme" <<EOF
# $title

העבודה של **$NAME** ביום הזה: סיכומי מפגש, שיעורי בית, החלטות.

- מה קורה ביום, ואיך: [סקירה]($PLAYBOOK_URL/01-ימים/$day/סקירה.md) · [תהליכים]($PLAYBOOK_URL/01-ימים/$day/תהליכים) בפלייבוק
- תוצרים לא כאן — ב-[תוצרים/](../../תוצרים/), באותו שם כמו ב-[02-תוצרים-וטמפלטים]($PLAYBOOK_URL/02-תוצרים-וטמפלטים)
EOF
done

echo "ימים: ${days[*]}"
if [ ${#skipped[@]} -gt 0 ]; then
  echo "לא נדרסו (כבר קיימים ביעד):"
  printf '  %s\n' "${skipped[@]}"
fi

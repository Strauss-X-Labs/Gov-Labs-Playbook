#!/usr/bin/env bash
# בונה את מבנה ה-repo של מיזם חדש בתוך תיקייה קיימת (בדרך כלל clone של ה-repo היעד).
#   bash <clone טרי של הפלייבוק>/skills/onboard-project/scaffold.sh "<שם המיזם>" <תיקיית-יעד>
#
# 1. מעתיק את תבנית-מיזם/ (כולל .claude/ .kiro/ ...) — לא דורס קבצים קיימים
# 2. מחליף [שם המיזם] ב-README.md וב-.kiro/steering/*.md
# 3. יוצר 01-ימים/NN-<יום>/README.md לכל יום שקיים ב-01-ימים/ בפלייבוק, ובכל יום תוצרים/ ו-רפרנס-מנחה/
# 4. מעתיק את הפלייבוק ל-.playbook/ (מחליף אם קיים)
set -euo pipefail

NAME="${1:?חסר שם מיזם}"
OUT="${2:?חסרה תיקיית יעד}"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"
. "$(dirname "$0")/lib.sh"

[ -d "$OUT" ] || { echo "אין תיקייה: $OUT" >&2; exit 1; }

# 1. תבנית — קובץ שכבר קיים ביעד נשאר כמו שהוא
skipped=()
while IFS= read -r -d '' f; do
  rel="${f#"$PLAYBOOK/תבנית-מיזם/"}"
  mkdir -p "$OUT/$(dirname "$rel")"
  if [ -e "$OUT/$rel" ]; then skipped+=("$rel"); else cp "$f" "$OUT/$rel"; fi
done < <(find "$PLAYBOOK/תבנית-מיזם" -type f -print0)

# 2. שם המיזם — escape לתווים מיוחדים של sed (& / \)
esc=$(printf '%s' "$NAME" | sed 's/[&/\]/\\&/g')
for f in "$OUT/README.md" "$OUT"/.kiro/steering/*.md; do
  [ -f "$f" ] || continue
  # בלי sed -i — ב-Mac הוא מתנהג אחרת
  sed "s/\[שם המיזם\]/$esc/g" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done

# 3. תיקייה לכל יום
days=$(make_days "$NAME" "$OUT" | tr '\n' ' ')
make_day_dirs "$OUT"

# 4. הפלייבוק
copy_playbook "$OUT"

echo "ימים: $days"
echo ".playbook: $(tr '\n' ' ' < "$OUT/.playbook/SOURCE")"
if [ ${#skipped[@]} -gt 0 ]; then
  echo "לא נדרסו (כבר קיימים ביעד):"
  printf '  %s\n' "${skipped[@]}"
fi

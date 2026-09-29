#!/usr/bin/env bash
# מחבר repo של מיזם לפלייבוק (ול-Drive) במחשב הזה. פעם אחת לכל מחשב, לכל מיזם.
#   bash <PLAYBOOK>/skills/run-agent/connect.sh <repo של המיזם> ["<תיקיית המיזם ב-Drive for desktop>"]
#
# כותב שני קבצים מקומיים (ב-.gitignore — לא עולים ל-git, כי הנתיבים שונים בכל מחשב):
#   .gov-labs.local              — PLAYBOOK= / DRIVE= : איפה run-agent מוצא את הפלייבוק ואת החומרים
#   .claude/settings.local.json  — הרשאת קריאה ל-Claude Code בשתי התיקיות, בלי שאלה בכל קובץ
set -euo pipefail
P="${1:?חסר נתיב ל-repo של המיזם}"
DRIVE="${2:-}"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"
[ -d "$P" ] || { echo "אין תיקייה: $P" >&2; exit 1; }
P="$(cd "$P" && pwd)"
[ -f "$P/README.md" ] && [ -d "$P/תוצרים" ] || { echo "$P לא נראה כמו repo של מיזם (אין README.md / תוצרים/)" >&2; exit 1; }

win() { command -v cygpath >/dev/null && cygpath -m "$1" || printf '%s' "$1"; }
if [ -n "$DRIVE" ]; then
  command -v cygpath >/dev/null && DRIVE="$(cygpath -u "$DRIVE")"
  [ -d "$DRIVE" ] || { echo "אין תיקייה ב-Drive: $2" >&2; exit 1; }
  DRIVE="$(win "$DRIVE")"
fi

printf 'PLAYBOOK=%s\nDRIVE=%s\n' "$(win "$PLAYBOOK")" "$DRIVE" > "$P/.gov-labs.local"

mkdir -p "$P/.claude"
S="$P/.claude/settings.local.json"
if [ -f "$S" ]; then
  echo "קיים $S — לא נדרס. ודא שיש בו additionalDirectories ל: $(win "$PLAYBOOK") ${DRIVE}"
else
  dirs="\"$(win "$PLAYBOOK")\""
  [ -n "$DRIVE" ] && dirs="$dirs, \"$DRIVE\""
  printf '{\n  "permissions": {\n    "additionalDirectories": [%s]\n  }\n}\n' "$dirs" > "$S"
fi

# .gitignore — הקבצים המקומיים לא עולים ל-git
for l in .gov-labs.local .claude/settings.local.json; do
  grep -qxF "$l" "$P/.gitignore" 2>/dev/null || echo "$l" >> "$P/.gitignore"
done

echo "מחובר: $(win "$P")"
echo "  פלייבוק: $(win "$PLAYBOOK")"
echo "  Drive:   ${DRIVE:-— (החומר ב-ידע/)}"

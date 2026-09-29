#!/usr/bin/env bash
# מעדכן repo של מיזם קיים לתבנית העדכנית של תבנית-מיזם/.
#   bash skills/onboard-project/upgrade.sh [--dry-run] <repo של המיזם> "<שם המיזם>" ["<מיקום החומר הגולמי>"]
#
# לכל קובץ בתבנית:
#   חסר במיזם                      → נוסף
#   זהה לגרסה העדכנית              → מעודכן, לא נוגעים
#   זהה לגרסה ישנה כלשהי של התבנית → לא נערך ידנית → מוחלף בגרסה העדכנית
#   שונה מכל גרסה                  → נערך ידנית → לא נוגעים, מדפיסים diff
# קובץ שהיה בתבנית ויצא ממנה, ולא נערך → מוסר. ימים חדשים ב-01-ימים/ → נוספים.
# היסטוריית התבנית = git log של הפלייבוק. --dry-run מדפיס את התוכנית בלי לשנות כלום.
set -euo pipefail

DRY=0
[ "${1:-}" = "--dry-run" ] && { DRY=1; shift; }
P="${1:?חסר נתיב ל-repo של המיזם}"
NAME="${2:?חסר שם מיזם}"
WHERE="${3:-}"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"
T="תבנית-מיזם"
G() { git -c core.quotepath=false -C "$PLAYBOOK" "$@"; }

[ -f "$P/README.md" ] && [ -d "$P/תוצרים" ] || { echo "$P לא נראה כמו repo של מיזם" >&2; exit 1; }

# מיקום החומר: מהפרמטר, או מה-README הקיים של המיזם
if [ -z "$WHERE" ]; then
  WHERE=$(sed -n 's/^| \*\*חומר גולמי\*\*[^|]*| \(.*\) |$/\1/p' "$P/README.md" | head -1)
fi
[ -n "$WHERE" ] || { echo "חסר מיקום החומר הגולמי (אין ב-README של המיזם) — העבר כפרמטר שלישי" >&2; exit 1; }

render() {  # stdin: קובץ תבנית → stdout: עם הערכים של המיזם, בלי CR
  local e w
  e=$(printf '%s' "$NAME" | sed 's/[&/\]/\\&/g')
  w=$(printf '%s' "$WHERE" | sed 's/[&/\]/\\&/g')
  tr -d '\r' | sed "s/\[שם המיזם\]/$e/g; s/\[מיקום החומר הגולמי\]/$w/g"
}
same() { cmp -s <(tr -d '\r' < "$1") <(tr -d '\r' < "$2"); }
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

# האם הקובץ במיזם זהה לגרסה כלשהי של הקובץ בהיסטוריית התבנית
matches_history() {  # $1 נתיב יחסי, $2 קובץ במיזם
  local sha
  for sha in $(G log --format=%h -- "$T/$1"); do
    G show "$sha:$T/$1" 2>/dev/null | render > "$TMP/old" || continue
    same "$TMP/old" "$2" && return 0
    # גם גרסת האב (לפני הקומיט) — הקומיט עצמו עשוי להיות המחיקה
    G show "$sha^:$T/$1" 2>/dev/null | render > "$TMP/old" || continue
    same "$TMP/old" "$2" && return 0
  done
  return 1
}

added=(); updated=(); current=(); edited=(); removed=()
do_write() { [ $DRY = 1 ] && return; mkdir -p "$(dirname "$P/$1")"; cp "$TMP/new" "$P/$1"; }

# 1. קבצי התבנית העדכנית
while IFS= read -r -d '' f; do
  rel="${f#"$PLAYBOOK/$T/"}"
  render < "$f" > "$TMP/new"
  if [ ! -e "$P/$rel" ]; then added+=("$rel"); do_write "$rel"
  elif same "$TMP/new" "$P/$rel"; then current+=("$rel")
  elif matches_history "$rel" "$P/$rel"; then updated+=("$rel"); do_write "$rel"
  else edited+=("$rel"); diff -u --label "במיזם: $rel" --label "בתבנית: $rel" <(tr -d '\r' < "$P/$rel") "$TMP/new" > "$TMP/diff-${#edited[@]}" || true
  fi
done < <(find "$PLAYBOOK/$T" -type f -print0)

# 2. קבצים שיצאו מהתבנית
while IFS= read -r rel; do
  [ -n "$rel" ] && [ ! -e "$PLAYBOOK/$T/$rel" ] && [ -f "$P/$rel" ] || continue
  if matches_history "$rel" "$P/$rel"; then removed+=("$rel"); [ $DRY = 1 ] || rm "$P/$rel"; fi
done < <(G log --name-only --format= -- "$T" | sed -n "s#^$T/##p" | sort -u)

# 3. ימים חדשים
newdays=()
for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
  day="$(basename "$d")"; [ -e "$P/ימים/$day/README.md" ] || newdays+=("$day")
done
if [ ${#newdays[@]} -gt 0 ] && [ $DRY = 0 ]; then
  bash "$PLAYBOOK/skills/onboard-project/scaffold.sh" "$NAME" "$P" "$WHERE" > /dev/null
fi

show() { [ $# -gt 1 ] || return 0; echo "$1"; shift; printf '  %s\n' "$@"; }
[ $DRY = 1 ] && echo "=== תוכנית (dry-run — לא שונה כלום) ===" || echo "=== בוצע ==="
echo "מיקום החומר הגולמי: $WHERE"
# ${a[@]+"${a[@]}"} — רשימה ריקה עם set -u נכשלת ב-bash 3.2 (Mac)
show "נוספו (חסרו במיזם):" ${added[@]+"${added[@]}"}
show "עודכנו (לא נערכו ידנית):" ${updated[@]+"${updated[@]}"}
show "הוסרו (יצאו מהתבנית, לא נערכו):" ${removed[@]+"${removed[@]}"}
show "ימים חדשים:" ${newdays[@]+"${newdays[@]}"}
show "נערכו ידנית — לא נגעתי, ההבדלים למטה:" ${edited[@]+"${edited[@]}"}
show "כבר מעודכנים:" ${current[@]+"${current[@]}"}
i=1
while [ $i -le ${#edited[@]} ]; do echo; cat "$TMP/diff-$i"; i=$((i + 1)); done

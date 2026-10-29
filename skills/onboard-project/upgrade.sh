#!/usr/bin/env bash
# מעדכן repo של מיזם קיים לפלייבוק ולתבנית העדכניים.
#   bash <clone טרי של הפלייבוק>/skills/onboard-project/upgrade.sh [--dry-run] <repo של המיזם> ["<שם המיזם>"]
#
# שם המיזם — ברירת מחדל מהכותרת `# ...` ב-README של המיזם.
# .playbook/ → מוחלף כולו בעותק העדכני (לא עורכים אותו ביד).
# לכל קובץ בתבנית:
#   חסר במיזם                      → נוסף
#   זהה לגרסה העדכנית              → מעודכן, לא נוגעים
#   זהה לגרסה ישנה כלשהי של התבנית → לא נערך ידנית → מוחלף בגרסה העדכנית
#   שונה מכל גרסה                  → נערך ידנית → לא נוגעים, מדפיסים diff
# קובץ שהיה בתבנית ויצא ממנה, ולא נערך → מוסר. ימים חדשים ב-01-ימים/ → נוספים.
# בכל יום: תוצרים/ ו-רפרנס-מנחה/ (נוספות אם חסרות).
# מבנה ישן: ימים/ → 01-ימים/ (הלינקים לפלייבוק ב-README של כל יום → .playbook/). קבצים ב-ידע/ וב-תוצרים/ שבשורש — מדווחים, לא מוזזים.
# היסטוריית התבנית = git log של הפלייבוק — לכן רצים מ-clone מלא, לא shallow.
# --dry-run מדפיס את התוכנית בלי לשנות כלום.
set -euo pipefail

DRY=0
[ "${1:-}" = "--dry-run" ] && { DRY=1; shift; }
P="${1:?חסר נתיב ל-repo של המיזם}"
NAME="${2:-}"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"
. "$(dirname "$0")/lib.sh"
T="תבנית-מיזם"
G() { git -c core.quotepath=false -C "$PLAYBOOK" "$@"; }

[ -f "$P/README.md" ] && { [ -d "$P/01-ימים" ] || [ -d "$P/ימים" ]; } || { echo "$P לא נראה כמו repo של מיזם" >&2; exit 1; }
[ -n "$NAME" ] || NAME=$(head -1 "$P/README.md" | tr -d '\r' | sed 's/^# *//')
[ -n "$NAME" ] || { echo "חסר שם מיזם (אין כותרת ב-README) — העבר כפרמטר שני" >&2; exit 1; }

# מיקום החומר הגולמי — רק בתבניות ישנות (לפני .playbook). נקרא מה-README כדי לזהות README ישן שלא נערך
WHERE=$(sed -n 's/^| \*\*חומר גולמי\*\*[^|]*| \(.*\) |$/\1/p' "$P/README.md" | tr -d '\r' | head -1)

render() {  # stdin: קובץ תבנית → stdout: עם הערכים של המיזם, בלי CR
  local e w
  e=$(printf '%s' "$NAME" | sed 's/[&/\]/\\&/g')
  w=$(printf '%s' "$WHERE" | sed 's/[&/\]/\\&/g')
  if [ -n "$WHERE" ]; then
    tr -d '\r' | sed "s/\[שם המיזם\]/$e/g; s/\[מיקום החומר הגולמי\]/$w/g"
  else
    tr -d '\r' | sed "s/\[שם המיזם\]/$e/g"
  fi
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

added=(); updated=(); current=(); edited=(); removed=(); moved=(); conflicts=(); leftover=(); oldout=()
do_write() { [ $DRY = 1 ] && return; mkdir -p "$(dirname "$P/$1")"; cp "$TMP/new" "$P/$1"; }

# 0. מבנה ישן: ימים/<יום> → 01-ימים/<יום>
if [ -d "$P/ימים" ]; then
  for d in "$P"/ימים/*/; do
    [ -d "$d" ] || continue
    day="$(basename "$d")"
    if [ -e "$P/01-ימים/$day" ]; then conflicts+=("ימים/$day"); continue; fi
    moved+=("ימים/$day → 01-ימים/$day")
    [ $DRY = 1 ] && continue
    mkdir -p "$P/01-ימים"
    mv "$d" "$P/01-ימים/$day"
    r="$P/01-ימים/$day/README.md"
    if [ -f "$r" ]; then
      sed 's#https://github\.com/Strauss-X-Labs/Gov-Labs-Playbook/blob/main/#../../.playbook/#g' "$r" > "$r.tmp" && mv "$r.tmp" "$r"
    fi
  done
  [ $DRY = 1 ] || rmdir "$P/ימים" 2>/dev/null || true
fi

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
  if matches_history "$rel" "$P/$rel"; then
    removed+=("$rel")
    [ $DRY = 1 ] || { rm "$P/$rel"; rmdir "$(dirname "$P/$rel")" 2>/dev/null || true; }
  fi
done < <(G log --name-only --format= -- "$T" | sed -n "s#^$T/##p" | sort -u)

# ידע/ — חומר שהצוות שם שם. לא מוזזים: רק הצוות יודע לאיזה יום הוא שייך
if [ -d "$P/ידע" ]; then
  while IFS= read -r f; do leftover+=("$f"); done < <(cd "$P" && find ידע -type f ! -name .gitkeep)
fi
# תוצרים/ בשורש — המבנה הישן. לא מוזזים: כל תוצר שייך ליום שבו נוצר (02-תוצרים-וטמפלטים/README.md); הסוכן מציע, הצוות מאשר
if [ -d "$P/תוצרים" ]; then
  while IFS= read -r f; do oldout+=("$f"); done < <(cd "$P" && find תוצרים -type f ! -name .gitkeep)
  [ $DRY = 1 ] || [ ${#oldout[@]} -gt 0 ] || { rm -f "$P/תוצרים/.gitkeep"; rmdir "$P/תוצרים" 2>/dev/null || true; }
fi
# קובץ מקומי מהגרסה הקודמת (connect.sh) — לא בשימוש יותר
[ $DRY = 1 ] || rm -f "$P/.gov-labs.local"

# 3. ימים חדשים
newdays=()
for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
  day="$(basename "$d")"
  [ -e "$P/01-ימים/$day/README.md" ] || [ -e "$P/ימים/$day/README.md" ] || newdays+=("$day")
done
[ $DRY = 1 ] || make_days "$NAME" "$P" > /dev/null
[ $DRY = 1 ] || make_day_dirs "$P"

# 4. הפלייבוק
old_src="—"; [ -f "$P/.playbook/SOURCE" ] && old_src=$(sed -n 's/^commit=//p' "$P/.playbook/SOURCE")
new_src=$(G rev-parse --short HEAD)
[ $DRY = 1 ] || copy_playbook "$P"

show() { [ $# -gt 1 ] || return 0; echo "$1"; shift; printf '  %s\n' "$@"; }
[ $DRY = 1 ] && echo "=== תוכנית (dry-run — לא שונה כלום) ===" || echo "=== בוצע ==="
echo "מיזם: $NAME"
echo ".playbook: $old_src → $new_src ($(G remote get-url origin))"
# ${a[@]+"${a[@]}"} — רשימה ריקה עם set -u נכשלת ב-bash 3.2 (Mac)
show "הועברו למבנה החדש:" ${moved[@]+"${moved[@]}"}
show "לא הועברו — כבר קיים ב-01-ימים/ (למזג ידנית):" ${conflicts[@]+"${conflicts[@]}"}
show "נוספו (חסרו במיזם):" ${added[@]+"${added[@]}"}
show "עודכנו (לא נערכו ידנית):" ${updated[@]+"${updated[@]}"}
show "הוסרו (יצאו מהתבנית, לא נערכו):" ${removed[@]+"${removed[@]}"}
show "ימים חדשים:" ${newdays[@]+"${newdays[@]}"}
show "קבצים ב-ידע/ — התיקייה יצאה מהתבנית; להעביר ל-01-ימים/<יום>/ (רק הצוות יודע לאיזה יום):" ${leftover[@]+"${leftover[@]}"}
show "קבצים ב-תוצרים/ שבשורש — המבנה הישן; להעביר ל-01-ימים/<יום>/תוצרים/ של היום שבו נוצרו (לפי 02-תוצרים-וטמפלטים/README.md), באישור:" ${oldout[@]+"${oldout[@]}"}
show "נערכו ידנית — לא נגעתי, ההבדלים למטה:" ${edited[@]+"${edited[@]}"}
show "כבר מעודכנים:" ${current[@]+"${current[@]}"}
i=1
while [ $i -le ${#edited[@]} ]; do echo; cat "$TMP/diff-$i"; i=$((i + 1)); done

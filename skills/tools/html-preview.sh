#!/usr/bin/env bash
# צילום של קובץ HTML בדפדפן ללא ממשק, כדי לבדוק אותו לפני שמוסרים: נכנס לרוחב? קריא? אין גלילה אופקית?
# שימוש: bash html-preview.sh <קובץ.html> <פלט.png> [רוחב, ברירת מחדל 1920] [גובה, ברירת מחדל 1080]
# הצילום הוא לבדיקה בלבד — לא שומרים אותו ב-repo. דורש Chrome, Edge או Chromium. נתיב אחר: CHROME=<נתיב> bash ...
set -euo pipefail

in="${1:?חסר קובץ HTML}"; out="${2:?חסר נתיב פלט}"; width="${3:-1920}"; height="${4:-1080}"
[ -f "$in" ] || { echo "לא נמצא: $in" >&2; exit 1; }

find_browser() {
  local c
  for c in "${CHROME:-}" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
    "/c/Program Files/Microsoft/Edge/Application/msedge.exe"; do
    [ -n "$c" ] && [ -x "$c" ] && { echo "$c"; return 0; }
  done
  for c in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge msedge; do
    command -v "$c" >/dev/null 2>&1 && { command -v "$c"; return 0; }
  done
  return 1
}
native() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else echo "$1"; fi; }

browser="$(find_browser)" || { echo "לא נמצא Chrome / Edge / Chromium. פתחו את הקובץ בדפדפן ובדקו בעין." >&2; exit 2; }
abs="$(cd "$(dirname "$in")" && pwd)/$(basename "$in")"
mkdir -p "$(dirname "$out")"
"$browser" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
  --window-size="$width,$height" --screenshot="$(native "$out")" \
  "file:///$(native "$abs" | sed 's#^/##')" >/dev/null 2>&1 || true
[ -s "$out" ] || { echo "הדפדפן לא יצר צילום. פתחו את הקובץ בדפדפן ובדקו בעין." >&2; exit 3; }
echo "$out"

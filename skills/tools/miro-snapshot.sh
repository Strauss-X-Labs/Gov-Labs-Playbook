#!/usr/bin/env bash
# תמונה של פריים מ-Miro: ממיר את ה-SVG ש-canvas_read_as_svg החזיר ל-PNG, ול-JPG כשה-PNG מעל 500KB.
# שימוש: bash miro-snapshot.sh <קובץ.svg> <נתיב-בלי-סיומת> [רוחב בפיקסלים, ברירת מחדל 3000]
# דוגמה: bash .playbook/skills/tools/miro-snapshot.sh /tmp/canvas.svg 01-ימים/04-Lean-Canvas/miro/canvas-presentation
# מדפיס בסוף את נתיב התמונה. דורש Chrome, Edge או Chromium. נתיב אחר לדפדפן: CHROME=<נתיב> bash ...
set -euo pipefail

in="${1:?חסר קובץ SVG}"; out="${2:?חסר נתיב פלט}"; width="${3:-3000}"
max_bytes=512000
[ -f "$in" ] || { echo "לא נמצא: $in" >&2; exit 1; }
mkdir -p "$(dirname "$out")"

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

# Windows (Git Bash): Chrome צריך נתיבי Windows
native() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else echo "$1"; fi; }

browser="$(find_browser)" || { echo "לא נמצא Chrome / Edge / Chromium. ייצאו את התמונה ידנית מ-Miro (ראה miro.md)." >&2; exit 2; }

# יחס הגובה-רוחב מה-viewBox של ה-SVG, או מ-width/height
root="$(tr '\n' ' ' < "$in" | grep -o '<svg[^>]*>' | head -1)"
vb="$(echo "$root" | sed -n 's/.*viewBox="\([^"]*\)".*/\1/p' | tr ',' ' ')"
if [ -n "$vb" ]; then
  read -r _ _ vw vh <<< "$vb"
else
  vw="$(echo "$root" | sed -n 's/.* width="\([0-9.]*\).*/\1/p')"
  vh="$(echo "$root" | sed -n 's/.* height="\([0-9.]*\).*/\1/p')"
fi
[ -n "${vw:-}" ] && [ -n "${vh:-}" ] || { echo "אין viewBox או width/height ב-SVG — לא ניתן לחשב את הגודל." >&2; exit 3; }
height="$(awk -v w="$width" -v a="$vw" -v b="$vh" 'BEGIN { printf "%d", w * b / a + 0.5 }')"

tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
# בלי dir="rtl" על הדף: הוא היה הופך את העיגון של טקסט ה-SVG. העברית נשארת בסדר הנכון בתוך כל שורה.
{
  printf '<!doctype html><html lang="he"><head><meta charset="utf-8"><style>'
  printf 'html,body{margin:0;background:#fff}svg{display:block;width:%spx;height:%spx}' "$width" "$height"
  printf 'body{font-family:"Open Sans","Assistant","Heebo","Arial Hebrew",Arial,sans-serif}</style></head><body>'
  sed -e 's/<?xml[^>]*?>//' -e 's/<!DOCTYPE[^>]*>//' "$in"
  printf '</body></html>'
} > "$tmp/page.html"

"$browser" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --default-background-color=ffffffff --virtual-time-budget=8000 \
  --window-size="$width,$height" --screenshot="$(native "$tmp/shot.png")" \
  "file:///$(native "$tmp/page.html" | sed 's#^/##')" >/dev/null 2>&1 || true
[ -s "$tmp/shot.png" ] || { echo "הדפדפן לא יצר צילום. ייצאו את התמונה ידנית מ-Miro (ראה miro.md)." >&2; exit 4; }

size() { wc -c < "$1" | tr -d ' '; }
if [ "$(size "$tmp/shot.png")" -le "$max_bytes" ]; then
  cp "$tmp/shot.png" "$out.png"; echo "$out.png"; exit 0
fi

# מעל 500KB: JPG באיכות 80, ואם עדיין גדול — רוחב 2200
to_jpg() { # <קלט> <פלט> [רוחב]
  if command -v sips >/dev/null 2>&1; then
    sips -s format jpeg -s formatOptions 80 ${3:+-Z "$3"} "$1" --out "$2" >/dev/null
  elif command -v magick >/dev/null 2>&1; then
    magick "$1" ${3:+-resize "${3}x"} -quality 80 "$2"
  elif command -v python3 >/dev/null 2>&1 && python3 -c "import PIL" 2>/dev/null; then
    python3 -I -c "import sys; from PIL import Image; im=Image.open(sys.argv[1]).convert('RGB'); w=int(sys.argv[3]) if len(sys.argv)>3 else 0; im=im.resize((w,round(im.height*w/im.width))) if w else im; im.save(sys.argv[2],quality=80)" "$@"
  else
    return 1
  fi
}
if to_jpg "$tmp/shot.png" "$out.jpg" && { [ "$(size "$out.jpg")" -le "$max_bytes" ] || to_jpg "$tmp/shot.png" "$out.jpg" 2200; }; then
  echo "$out.jpg"
  [ "$(size "$out.jpg")" -le "$max_bytes" ] || echo "אזהרה: $out.jpg מעל 500KB ($(size "$out.jpg") בתים)." >&2
else
  cp "$tmp/shot.png" "$out.png"; echo "$out.png"
  echo "אזהרה: $out.png מעל 500KB, ואין כלי להמרה ל-JPG (sips / magick / Pillow)." >&2
fi

#!/usr/bin/env bash
# תמונה של הלוח מ-Canva: מוריד את הייצוא של export-design (או לוקח קובץ שכבר יוצא), שומר PNG, וממיר ל-JPG כשה-PNG מעל 500KB.
# שימוש: bash canva-snapshot.sh <קישור הורדה או קובץ> <נתיב-בלי-סיומת>
# דוגמה: bash .playbook/skills/tools/canva-snapshot.sh "https://export-download.canva.com/..." 01-ימים/04-Lean-Canvas/רפרנס-מנחה/canva/canvas-presentation
# מדפיס בסוף את נתיב התמונה. להורדה — curl. להמרה ל-JPG — sips (Mac), magick או Pillow.
set -euo pipefail

src="${1:?חסר קישור הורדה או קובץ}"; out="${2:?חסר נתיב פלט}"
max_bytes=512000
mkdir -p "$(dirname "$out")"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

case "$src" in
  http://*|https://*)
    curl -fsSL "$src" -o "$tmp/shot" || { echo "ההורדה נכשלה. ייצאו את התמונה ידנית מ-Canva (ראה canva.md)." >&2; exit 2; } ;;
  *)
    [ -f "$src" ] || { echo "לא נמצא: $src" >&2; exit 1; }
    cp "$src" "$tmp/shot" ;;
esac
[ -s "$tmp/shot" ] || { echo "הקובץ ריק. ייצאו את התמונה ידנית מ-Canva (ראה canva.md)." >&2; exit 3; }

size() { wc -c < "$1" | tr -d ' '; }
# הסוג לפי החתימה בתחילת הקובץ: PNG או JPG
magic="$(head -c 4 "$tmp/shot" | od -An -tx1 | tr -d ' \n')"
case "$magic" in
  89504e47) ext=png ;;
  ffd8ff*) ext=jpg ;;
  *) echo "הקובץ אינו PNG או JPG. ייצאו מ-Canva כ-PNG (ראה canva.md)." >&2; exit 4 ;;
esac

if [ "$(size "$tmp/shot")" -le "$max_bytes" ]; then
  cp "$tmp/shot" "$out.$ext"; echo "$out.$ext"; exit 0
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
cp "$tmp/shot" "$tmp/shot.$ext"
if to_jpg "$tmp/shot.$ext" "$out.jpg" && { [ "$(size "$out.jpg")" -le "$max_bytes" ] || to_jpg "$tmp/shot.$ext" "$out.jpg" 2200; }; then
  echo "$out.jpg"
  [ "$(size "$out.jpg")" -le "$max_bytes" ] || echo "אזהרה: $out.jpg מעל 500KB ($(size "$out.jpg") בתים)." >&2
else
  cp "$tmp/shot" "$out.$ext"; echo "$out.$ext"
  echo "אזהרה: $out.$ext מעל 500KB, ואין כלי להמרה ל-JPG (sips / magick / Pillow)." >&2
fi

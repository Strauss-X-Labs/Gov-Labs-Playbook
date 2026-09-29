#!/usr/bin/env bash
# טקסט מתוך pptx / docx / xlsx — בלי Python, רק unzip ו-sed.
#   bash skills/run-agent/extract.sh "<קובץ>"
# pptx → "## שקף N" + הטקסט של כל שקף (לפי הסדר). docx → פסקאות. xlsx → כל המחרוזות בגיליונות.
set -euo pipefail
F="${1:?חסר קובץ}"
[ -f "$F" ] || { echo "אין קובץ: $F" >&2; exit 1; }

# XML → טקסט: סוף פסקה = שורה חדשה, בלי תגיות, ישויות בסיסיות
xml2txt() {
  # awk ולא sed: ב-Mac, sed לא הופך \n לשורה חדשה
  awk '{
    gsub(/<\/a:p>|<\/w:p>|<\/si>|<a:br\/>/, "\n"); gsub(/<w:tab\/>/, " "); gsub(/<[^>]*>/, "")
    gsub(/&lt;/, "<"); gsub(/&gt;/, ">"); gsub(/&quot;/, "\""); gsub(/&apos;/, "'"'"'"); gsub(/&amp;/, "\\&")
    print
  }' | sed -e 's/[[:space:]]*$//' | grep -v '^$' || true
}

ext=$(printf '%s' "${F##*.}" | tr '[:upper:]' '[:lower:]')   # לא ${F,,} — לא קיים ב-bash 3.2 (Mac)
case "$ext" in
  pptx)
    n=0
    # מיון לפי מספר השקף (לא sort -V — לא קיים ב-Mac)
    for s in $(unzip -Z1 "$F" | grep -E '^ppt/slides/slide[0-9]+\.xml$' | sed 's/.*slide\([0-9]*\)\.xml$/\1 &/' | sort -n | cut -d' ' -f2); do
      n=$((n + 1))
      echo "## שקף $n"
      unzip -p "$F" "$s" | xml2txt
      notes="ppt/notesSlides/notesSlide${s##*slide}"
      if unzip -Z1 "$F" | grep -qx "$notes"; then
        t=$(unzip -p "$F" "$notes" | xml2txt)
        t=$(printf '%s' "$t" | grep -vxE '[0-9]+' || true)
        [ -n "$t" ] && printf '> הערות: %s\n' "$(printf '%s' "$t" | tr '\n' ' ')"
      fi
      echo
    done ;;
  docx)
    unzip -p "$F" word/document.xml | xml2txt ;;
  xlsx)
    unzip -p "$F" xl/sharedStrings.xml 2>/dev/null | xml2txt ;;
  *) echo "לא נתמך: $F (pptx / docx / xlsx בלבד — PDF ותמונות קוראים ישירות)" >&2; exit 1 ;;
esac

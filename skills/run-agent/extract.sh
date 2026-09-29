#!/usr/bin/env bash
# טקסט מתוך pptx / docx / xlsx — בלי Python, רק unzip ו-sed.
#   bash skills/run-agent/extract.sh "<קובץ>"
# pptx → "## שקף N" + הטקסט של כל שקף (לפי הסדר). docx → פסקאות. xlsx → כל המחרוזות בגיליונות.
set -euo pipefail
F="${1:?חסר קובץ}"
[ -f "$F" ] || { echo "אין קובץ: $F" >&2; exit 1; }

# XML → טקסט: סוף פסקה = שורה חדשה, בלי תגיות, ישויות בסיסיות
xml2txt() {
  sed -e 's#</a:p>#\n#g; s#</w:p>#\n#g; s#</si>#\n#g; s#<w:tab/># #g; s#<a:br/>#\n#g' \
      -e 's/<[^>]*>//g' \
      -e 's/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g; s/&apos;/'"'"'/g; s/&amp;/\&/g' |
  sed -e 's/[[:space:]]*$//' | grep -v '^$' || true
}

case "${F,,}" in
  *.pptx)
    n=0
    for s in $(unzip -Z1 "$F" | grep -E '^ppt/slides/slide[0-9]+\.xml$' | sort -V); do
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
  *.docx)
    unzip -p "$F" word/document.xml | xml2txt ;;
  *.xlsx)
    unzip -p "$F" xl/sharedStrings.xml 2>/dev/null | xml2txt ;;
  *) echo "לא נתמך: $F (pptx / docx / xlsx בלבד — PDF ותמונות קוראים ישירות)" >&2; exit 1 ;;
esac

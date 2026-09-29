#!/usr/bin/env bash
# יוצר ב-Google Drive, בתוך תיקייה שנותנים לינק אליה: <שם המיזם>/ ובתוכה תיקייה לכל יום לפי 01-ימים/.
#
#   bash skills/onboard-project/drive.sh auth-url                 # פעם אחת: לינק להתחברות לגוגל
#   bash skills/onboard-project/drive.sh auth-code "<URL>"        # פעם אחת: ה-URL שהדפדפן הגיע אליו אחרי האישור
#   bash skills/onboard-project/drive.sh create "<לינק לתיקייה>" "<שם המיזם>"
#   bash skills/onboard-project/drive.sh create "G:\...\<תיקייה>" "<שם המיזם>"   # נתיב מקומי של Drive for desktop — בלי התחברות
#
# דרישה חד-פעמית (לארגון): OAuth client מסוג Desktop app ב-Google Cloud, עם Drive API מופעל.
# את ה-JSON שלו שומרים ב-~/.gov-labs/google-oauth-client.json. ראה SKILL.md, "Google Drive".
# לבדיקה בלי client: GOOGLE_ACCESS_TOKEN=<token> bash drive.sh create ...
# לא דורס ולא משכפל: תיקייה שכבר קיימת באותו שם — משתמשים בה.
set -euo pipefail

CONF="$HOME/.gov-labs"
CLIENT="$CONF/google-oauth-client.json"
TOKEN="$CONF/google-token.json"
SCOPE="https://www.googleapis.com/auth/drive"
REDIRECT="http://localhost"
API="https://www.googleapis.com/drive/v3/files"
PLAYBOOK="$(cd "$(dirname "$0")/../.." && pwd)"

# ערך מחרוזת ראשון של מפתח ב-JSON (בלי jq)
json_get() { tr -d '\n' | sed -n "s/.*\"$1\": *\"\([^\"]*\)\".*/\1/p" | head -1; }
json_str() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
die() { echo "$*" >&2; exit 1; }

client_field() {
  [ -f "$CLIENT" ] || die "אין $CLIENT — צריך OAuth client (ראה SKILL.md, Google Drive)"
  json_get "$1" < "$CLIENT"
}

access_token() {
  if [ -n "${GOOGLE_ACCESS_TOKEN:-}" ]; then echo "$GOOGLE_ACCESS_TOKEN"; return; fi
  [ -f "$TOKEN" ] || die "לא מחובר לגוגל — הרץ קודם: drive.sh auth-url"
  local refresh; refresh=$(json_get refresh_token < "$TOKEN")
  local tok; tok=$(curl -s https://oauth2.googleapis.com/token \
    --data-urlencode "client_id=$(client_field client_id)" \
    --data-urlencode "client_secret=$(client_field client_secret)" \
    --data-urlencode "refresh_token=$refresh" \
    -d grant_type=refresh_token | json_get access_token)
  [ -n "$tok" ] || die "רענון ההתחברות נכשל — הרץ שוב: drive.sh auth-url"
  echo "$tok"
}

folder_id_from_link() {
  local id
  id=$(printf '%s' "$1" | sed -n 's#.*/folders/\([A-Za-z0-9_-]\{10,\}\).*#\1#p')
  [ -n "$id" ] || id=$(printf '%s' "$1" | sed -n 's#.*[?&]id=\([A-Za-z0-9_-]\{10,\}\).*#\1#p')
  [ -n "$id" ] || { printf '%s' "$1" | grep -qE '^[A-Za-z0-9_-]{10,}$' && id="$1"; }
  [ -n "$id" ] || die "לא מזהה תיקייה בלינק: $1"
  echo "$id"
}

# מחזיר id של תיקייה בשם $2 בתוך $1 — קיימת, או חדשה
ensure_folder() {
  local parent="$1" name="$2" q id
  q="name = '$(printf '%s' "$name" | sed "s/\\\\/\\\\\\\\/g; s/'/\\\\'/g")' and '$parent' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
  id=$(curl -s -G "$API" -H "Authorization: Bearer $AT" \
    --data-urlencode "q=$q" -d fields='files(id)' \
    -d supportsAllDrives=true -d includeItemsFromAllDrives=true | json_get id)
  if [ -n "$id" ]; then echo "  קיים: $name" >&2; echo "$id"; return; fi
  local res
  res=$(curl -s -X POST "$API?supportsAllDrives=true&fields=id" -H "Authorization: Bearer $AT" \
    -H "Content-Type: application/json; charset=UTF-8" \
    -d "{\"name\":\"$(json_str "$name")\",\"mimeType\":\"application/vnd.google-apps.folder\",\"parents\":[\"$parent\"]}")
  id=$(printf '%s' "$res" | json_get id)
  [ -n "$id" ] || die "יצירת '$name' נכשלה: $(printf '%s' "$res" | json_get message)"
  echo "  נוצר: $name" >&2
  echo "$id"
}

case "${1:-}" in
  auth-url)
    client_field client_id > /dev/null
    echo "https://accounts.google.com/o/oauth2/v2/auth?client_id=$(client_field client_id)&redirect_uri=$REDIRECT&response_type=code&scope=$SCOPE&access_type=offline&prompt=consent"
    ;;
  auth-code)
    client_field client_id > /dev/null
    url="${2:?חסר ה-URL מהדפדפן}"
    code=$(printf '%s' "$url" | sed -n 's/.*[?&]code=\([^&]*\).*/\1/p')
    [ -n "$code" ] || code="$url"
    code=$(printf '%s' "$code" | sed 's/%2F/\//g')
    res=$(curl -s https://oauth2.googleapis.com/token \
      --data-urlencode "code=$code" \
      --data-urlencode "client_id=$(client_field client_id)" \
      --data-urlencode "client_secret=$(client_field client_secret)" \
      --data-urlencode "redirect_uri=$REDIRECT" -d grant_type=authorization_code)
    printf '%s' "$res" | json_get refresh_token | grep -q . || die "ההתחברות נכשלה: $(printf '%s' "$res" | json_get error_description)"
    mkdir -p "$CONF" && printf '%s' "$res" > "$TOKEN" && chmod 600 "$TOKEN"
    echo "מחובר לגוגל. נשמר ב-$TOKEN"
    ;;
  create)
    TARGET="${2:?חסר לינק או נתיב לתיקייה ב-Drive}"
    NAME="${3:?חסר שם מיזם}"
    # נתיב מקומי (Drive for desktop, למשל G:\...) — יוצרים תיקיות, Drive מסנכרן. בלי API ובלי התחברות.
    if printf '%s' "$TARGET" | grep -qE '^([A-Za-z]:[\\/]|/)'; then
      command -v cygpath >/dev/null && TARGET=$(cygpath -u "$TARGET")
      [ -d "$TARGET" ] || die "אין תיקייה: $2 (Drive for desktop פועל? התיקייה ב-My Drive או כקיצור דרך?)"
      proj="$TARGET/$NAME"
      [ -d "$proj" ] && echo "  קיים: $NAME" >&2 || { mkdir "$proj"; echo "  נוצר: $NAME" >&2; }
      for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
        day="$(basename "$d")"
        [ -d "$proj/$day" ] && echo "  קיים: $day" >&2 || { mkdir "$proj/$day"; echo "  נוצר: $day" >&2; }
      done
      command -v cygpath >/dev/null && proj=$(cygpath -w "$proj")
      echo "תיקיית המיזם (Drive for desktop — מסתנכרן תוך דקה-שתיים): $proj"
      exit 0
    fi
    parent=$(folder_id_from_link "$TARGET")
    AT=$(access_token)
    proj=$(ensure_folder "$parent" "$NAME")
    for d in "$PLAYBOOK"/01-ימים/[0-9][0-9]-*/; do
      ensure_folder "$proj" "$(basename "$d")" > /dev/null
    done
    echo "תיקיית המיזם ב-Drive: https://drive.google.com/drive/folders/$proj"
    ;;
  *) die "שימוש: drive.sh auth-url | auth-code <URL> | create <לינק|נתיב> <שם המיזם>" ;;
esac

#!/usr/bin/env bash
# Submit all sitemap URLs to IndexNow (Bing/Yandex)
# Uses key file at /blog/<key>.txt

set -euo pipefail

HOST="${INDEXNOW_HOST:-ekegukeku64-blip.github.io}"
BASE_PATH="${INDEXNOW_BASE_PATH:-/blog}"
KEY="31d49cf6fd0c3b7df2bf0376e03a1ebf"
KEY_URL="https://${HOST}${BASE_PATH}/${KEY}.txt"
SITEMAP_URL="https://${HOST}${BASE_PATH}/sitemap-0.xml"

echo "[IndexNow] Fetching sitemap from ${SITEMAP_URL}"

# Extract all <loc> URLs from sitemap (split on <url> tags first since XML may be single-line)
URLS=$(curl -s "$SITEMAP_URL" | sed 's/<url>/\n<url>/g' | sed -n 's/.*<loc>\(.*\)<\/loc>.*/\1/p')

if [ -z "$URLS" ]; then
  echo "[IndexNow] ERROR: No URLs found in sitemap"
  exit 1
fi

# Build JSON urlList array
URL_LIST=$(echo "$URLS" | awk '{printf "\"%s\",", $0}' | sed 's/,$//')

JSON_PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_URL}",
  "urlList": [${URL_LIST}]
}
EOF
)

URL_COUNT=$(echo "$URLS" | wc -l)
echo "[IndexNow] Submitting ${URL_COUNT} URLs to IndexNow API"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$JSON_PAYLOAD")

if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "202" ]; then
  echo "[IndexNow] Success! HTTP ${RESPONSE} — ${URL_COUNT} URLs submitted"
else
  echo "[IndexNow] WARNING: HTTP ${RESPONSE} — submission may have failed"
  # Show response body for debugging
  curl -s -X POST "https://api.indexnow.org/IndexNow" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "$JSON_PAYLOAD"
  echo ""
  exit 1
fi

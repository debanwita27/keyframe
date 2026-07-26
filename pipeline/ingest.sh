#!/bin/bash
# Download + analyze a curated set of references for one account.
#
#   ./pipeline/ingest.sh <handle> <curated-file>
#
# curated-file lines:  <tier>|<status-id>|<slug>
# tier is a single letter used as a filename prefix so the corpus stays sorted by
# who made it and how relevant it is (A = directly a launch video, B = craft study).
#
# Downloads to refs/raw/<handle>_<tier>_<slug>.mp4 then runs the analyzer, so each
# reference gets a profile.md + contact sheets to write its spec from.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
H="${1:?handle}"
F="${2:?curated file}"
OUT=refs/raw
mkdir -p "$OUT"

dl() {
  IFS='|' read -r tier id slug <<< "$1"
  [ -z "${slug:-}" ] && return 0
  dest="$OUT/${2}_${tier}_${slug}.mp4"
  if [ -f "$dest" ]; then echo "  have  $slug"; return 0; fi
  if timeout 240 yt-dlp --no-warnings -q \
      -f "bv*[height<=1080][ext=mp4]+ba/b[height<=1080][ext=mp4]/bv*[height<=1080]+ba/b" \
      -o "$dest" "https://x.com/$2/status/$id" >/dev/null 2>&1; then
    echo "  ok    $slug"
  else
    echo "  FAIL  $slug ($id)"
  fi
}

echo "ingesting $(grep -c . "$F") references for @$H"
while IFS= read -r line; do
  [ -z "$line" ] && continue
  dl "$line" "$H"
done < "$F"

echo
echo "analyzing…"
python3 pipeline/analyze.py "$OUT/${H}_"*.mp4 --out refs/analysis 2>&1 | tail -30

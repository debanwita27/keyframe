#!/bin/bash
# Rebuild the reference corpus locally.
#
# The videos themselves are NOT in this repo — they are someone else's work
# (@byshubh_ on X) and redistributing them is not ours to do. What IS in the
# repo is refs/specs/, which is our own written analysis of them.
#
# This fetches the 25 curated references, then runs the analyzer over them so
# you get the same profile.md / contact sheets the specs were written from.
#
#   ./pipeline/fetch_refs.sh [--analyze]
#
# Requires: yt-dlp, ffmpeg, python3 with numpy + pillow.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
MANIFEST="refs/curated.txt"
OUT="refs/raw"

command -v yt-dlp >/dev/null || { echo "need yt-dlp: pip3 install yt-dlp" >&2; exit 1; }
[ -f "$MANIFEST" ] || { echo "missing $MANIFEST" >&2; exit 1; }
mkdir -p "$OUT"

echo "fetching $(grep -c . "$MANIFEST") references → $OUT/"
ok=0; fail=0
while IFS='|' read -r tier id slug; do
  [ -z "${id:-}" ] && continue
  dest="$OUT/${tier}_${slug}.mp4"
  if [ -f "$dest" ]; then echo "  have  $slug"; ok=$((ok+1)); continue; fi
  if timeout 180 yt-dlp --no-warnings -q \
      -f "bv*[height<=1080][ext=mp4]+ba/b[height<=1080][ext=mp4]/bv*[height<=1080]+ba/b" \
      -o "$dest" "https://x.com/byshubh_/status/$id" >/dev/null 2>&1; then
    echo "  ok    $slug"; ok=$((ok+1))
  else
    echo "  FAIL  $slug ($id) — post may have been deleted"; fail=$((fail+1))
  fi
done < "$MANIFEST"

echo
echo "$ok fetched, $fail failed"

# three ids resolve to the same upload; drop the duplicates so the analyzer and
# the spec filenames line up
[ -f "$OUT/A_nicogarcia-piece.mp4" ] && rm -f "$OUT/A_nicogarcia-piece.mp4"
[ -f "$OUT/A_brand-animation-promo.mp4" ] && mv -f "$OUT/A_brand-animation-promo.mp4" "$OUT/A_2d-loop-piece.mp4"
[ -f "$OUT/B_feedback-piece.mp4" ] && rm -f "$OUT/B_feedback-piece.mp4"

if [ "${1:-}" = "--analyze" ]; then
  echo
  echo "analyzing…"
  python3 pipeline/analyze.py "$OUT"/*.mp4 --out refs/analysis
fi

echo
echo "next: python3 pipeline/analyze.py refs/raw/*.mp4 --out refs/analysis"
echo "then compare refs/analysis/<slug>/profile.md against refs/specs/<slug>.yaml"

#!/bin/bash
# Build one cut end to end: point the film at a track, render, master.
#
#   ./pipeline/build.sh <track.mp3> <out-name> [--at <seconds>] [--credit "..."]
#
# Exists because set_music.py mutates beatgrid.ts globally, so rendering straight
# after a set_music run for a DIFFERENT track silently produces a file whose name
# says one track and whose audio is another. This ties the two together and
# verifies the frame count, which is the only reliable proof: two tracks at
# different tempos cannot produce the same length.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TRACK="${1:?usage: build.sh <track.mp3> <out-name> [--at S] [--credit ...]}"
NAME="${2:?output name required, e.g. launch-internal}"
shift 2

ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --at) ARGS+=(--at "$2"); shift 2 ;;
    --credit) ARGS+=(--credit "$2"); shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

[ -f "$TRACK" ] || { echo "no such track: $TRACK" >&2; exit 1; }

echo "* locking the edit to $(basename "$TRACK")"
python3 pipeline/set_music.py "$TRACK" "${ARGS[@]}"

GRID=video/src/compositions/product-os/beatgrid.ts
EXPECTED=$(grep -oE 'FILM_FRAMES = [0-9]+' "$GRID" | grep -oE '[0-9]+')
USED=$(grep -oE 'file: "[^"]+"' "$GRID" | head -1 | sed 's/file: "//;s/"//')
echo "* rendering ${EXPECTED}f with ${USED}"

cd video
npx remotion render src/index.ts ProductOSLaunch "out/${NAME}-raw.mp4" --log=error 2>&1 \
  | grep -viE "network requests|Made [0-9]+ network" || true
cd ..

./pipeline/post.sh "video/out/${NAME}-raw.mp4" "video/out/${NAME}.mp4" clean >/dev/null

ACTUAL=$(ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of csv=p=0 "video/out/${NAME}.mp4" 2>/dev/null \
  | tr -cd '0-9' || echo "?")
[ -z "$ACTUAL" ] && ACTUAL="?"
echo
echo "* ${NAME}.mp4 — expected ${EXPECTED}f, got ${ACTUAL}f, audio ${USED}"
if [ "$ACTUAL" != "$EXPECTED" ] && [ "$ACTUAL" != "?" ]; then
  echo "  !! frame-count mismatch: this render may not match the named track" >&2
  exit 1
fi

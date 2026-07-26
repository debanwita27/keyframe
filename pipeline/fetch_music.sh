#!/bin/bash
# Fetch the candidate music tracks and analyse them for beat reliability.
#
# All tracks are by Kevin MacLeod (incompetech.com), licensed CC BY 4.0 —
# commercial use is permitted, attribution is REQUIRED. If you ship a video
# using one of these, credit it.
#
#   ./pipeline/fetch_music.sh [--analyze]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="audio/raw"
mkdir -p "$OUT"

# The set that was actually compared. Tempo/character deliberately spread so the
# beat-confidence ranking has something to discriminate between.
TRACKS=(
  "Hackbeat"
  "Volatile Reaction"
  "Neon Laser Horizon"
  "Digital Lemonade"
  "Blip Stream"
  "Dirt Rhodes"
  "Machinations"
  "Deuces"
  "Electrodoodle"
)

BASE="https://incompetech.com/music/royalty-free/mp3-royaltyfree"

for name in "${TRACKS[@]}"; do
  slug=$(echo "$name" | tr ' A-Z' '-a-z')
  dest="$OUT/$slug.mp3"
  if [ -f "$dest" ]; then echo "  have  $name"; continue; fi
  enc=$(python3 -c 'import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))' "$name")
  code=$(curl -sL --max-time 90 -o "$dest" -w "%{http_code}" "$BASE/$enc.mp3" || echo 000)
  if [ "$code" = "200" ] && [ -s "$dest" ]; then
    echo "  ok    $name"
  else
    rm -f "$dest"; echo "  FAIL  $name ($code)"
  fi
done

if [ "${1:-}" = "--analyze" ]; then
  echo
  python3 pipeline/analyze_audio.py "$OUT"/*.mp3 --out audio/analysis --fps 30
fi

cat <<'EOF'

The film uses "Digital Lemonade" (120.2 BPM, beat confidence 0.81).
To regenerate the trimmed window it actually plays:

  python3 - <<'PY'
  import subprocess
  # window chosen from audio/analysis/digital-lemonade/profile.md:
  # 3 quiet bars -> the track's strongest passage -> outro
  subprocess.run(["ffmpeg","-y","-ss","127.3034","-i","audio/raw/digital-lemonade.mp3",
                  "-t","27.5","-c:a","libmp3lame","-b:a","192k",
                  "video/public/digital-lemonade.mp3"], check=True)
  PY

Credit required: "Digital Lemonade" by Kevin MacLeod (incompetech.com), CC BY 4.0.
EOF

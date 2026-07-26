#!/bin/bash
# Post pass: grade, grain, subtle bloom, vignette, encode.
# The last 15% of "premium" that is cheaper in ffmpeg than in CSS.
#
#   ./post.sh in.mp4 out.mp4 [preset]
#
# presets: clean (default) | filmic | punchy
set -euo pipefail

IN="${1:?usage: post.sh in.mp4 out.mp4 [clean|filmic|punchy]}"
OUT="${2:?output path required}"
PRESET="${3:-clean}"

case "$PRESET" in
  clean)
    # barely-there grain, gentle contrast. Safe default for product work.
    GRADE="eq=contrast=1.04:saturation=1.03"
    GRAIN="noise=alls=4:allf=t+u"
    ;;
  filmic)
    # lifted blacks, warm highlights, visible grain, soft bloom
    GRADE="curves=r='0/0.02 0.5/0.52 1/0.98':g='0/0.02 0.5/0.5 1/0.98':b='0/0.04 0.5/0.49 1/0.96',eq=contrast=1.08:saturation=0.97"
    GRAIN="noise=alls=9:allf=t+u"
    ;;
  punchy)
    GRADE="eq=contrast=1.12:saturation=1.10:gamma=0.98,unsharp=5:5:0.6"
    GRAIN="noise=alls=5:allf=t+u"
    ;;
  *) echo "unknown preset: $PRESET" >&2; exit 1 ;;
esac

# vignette + a light bloom via a blurred, screened copy of the bright areas
FILTER="[0:v]${GRADE},split=2[base][bl];\
[bl]gblur=sigma=22,curves=all='0/0 0.72/0.30 1/0.85'[bloom];\
[base][bloom]blend=all_mode=screen:all_opacity=0.16[lit];\
[lit]vignette=angle=PI/6:mode=backward,${GRAIN}[out]"

# Master the audio if there is any. -14 LUFS is what Instagram / YouTube /
# LinkedIn normalise to, so hitting it here avoids surprise gain-riding on upload.
#
# TWO-PASS, linear=true. Single-pass loudnorm applies *dynamic* gain, which
# flattens a deliberate mix: it pulled this film's ducked open up by 14 dB and
# collapsed the loudness range to 3.8 LU, destroying the drop. Measuring first
# and then applying one constant gain preserves the envelope exactly.
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$IN" | grep -q .; then
  echo "measuring loudness…"
  MEAS=$(ffmpeg -hide_banner -i "$IN" -af "loudnorm=I=-14:TP=-1.0:print_format=json" \
           -f null - 2>&1 | python3 -c '
import json,re,sys
t=sys.stdin.read()
m=re.search(r"\{[^{}]*input_i[^{}]*\}", t, re.S)
if not m: sys.exit(1)
d=json.loads(m.group(0))
if d["input_i"] in ("-inf","inf"): sys.exit(1)
print(f'"'"'{d["input_i"]} {d["input_tp"]} {d["input_lra"]} {d["input_thresh"]}'"'"')
') || MEAS=""
  if [ -n "$MEAS" ]; then
    read -r MI MTP MLRA MTH <<< "$MEAS"
    echo "  measured: I=${MI} LUFS · TP=${MTP} dBTP · LRA=${MLRA} LU"
    NORM="loudnorm=I=-14:TP=-1.0:linear=true:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH"
  else
    echo "  measurement failed — falling back to a fixed gain, dynamics preserved"
    NORM="volume=0dB"
  fi
  AUDIO_ARGS=(-map 0:a -af "${NORM},alimiter=limit=0.95:level=false" \
              -c:a aac -b:a 192k -ar 48000)
else
  AUDIO_ARGS=()
fi

ffmpeg -hide_banner -loglevel warning -y -i "$IN" \
  -filter_complex "$FILTER" -map "[out]" \
  "${AUDIO_ARGS[@]}" \
  -c:v libx264 -profile:v high -preset slow -crf 17 \
  -pix_fmt yuv420p -movflags +faststart \
  "$OUT"

echo "wrote $OUT ($PRESET)"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate \
  -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT"

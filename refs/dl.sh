#!/bin/bash
IFS='|' read -r tier id slug <<< "$1"
out="/Users/debanwitamahato/work/motion-os/refs/raw/${tier}_${slug}.mp4"
[ -f "$out" ] && { echo "skip $slug"; exit 0; }
timeout 180 yt-dlp --no-warnings -q -f "bv*[height<=1080][ext=mp4]+ba/b[height<=1080][ext=mp4]/bv*[height<=1080]+ba/b" -o "$out" "https://x.com/byshubh_/status/$id" >/dev/null 2>&1 \
  && echo "ok $slug" || echo "FAIL $slug"

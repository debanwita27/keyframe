#!/bin/bash
id="$1"
out=$(timeout 45 yt-dlp --no-warnings --skip-download --print "%(duration)s|%(width)sx%(height)s|%(title).140s" "https://x.com/byshubh_/status/$id" 2>/dev/null | head -1)
[ -n "$out" ] && echo "$id|$out"

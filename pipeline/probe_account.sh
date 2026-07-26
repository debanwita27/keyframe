#!/bin/bash
# Probe a list of X status ids for downloadable video + metadata.
#   ./pipeline/probe_account.sh <handle> <ids-file> > out.txt
# Output: id|duration|WxH|title
set -uo pipefail
H="${1:?handle}"; F="${2:?ids file}"
probe1() {
  out=$(timeout 45 yt-dlp --no-warnings --skip-download \
        --print "%(duration)s|%(width)sx%(height)s|%(title).150s" \
        "https://x.com/$1/status/$2" 2>/dev/null | head -1)
  [ -n "$out" ] && echo "$2|$out"
}
export -f probe1
tr ' ' '\n' < "$F" | grep -E '^[0-9]+$' | while read -r id; do
  probe1 "$H" "$id"
done

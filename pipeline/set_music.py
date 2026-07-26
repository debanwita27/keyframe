#!/usr/bin/env python3
"""
Point the film at a different track and re-lock the edit to its beats.

Bring your own music — Envato Elements, Artlist, Musicbed, anything. Drop the
file anywhere, run this, re-render. The shot list is expressed in BEATS, not
frames, so changing tempo retimes the whole edit instead of breaking it.

  python3 pipeline/set_music.py audio/raw/my-track.mp3
  python3 pipeline/set_music.py my-track.mp3 --at 64.0      # force window start
  python3 pipeline/set_music.py my-track.mp3 --prefer-quiet-start

What it does:
  1. analyses the track (tempo, beat grid, sections)
  2. picks a window: a downbeat that starts on the quietest section which still
     has enough beats left, so the damped intro sits where the music is already
     quiet
  3. writes video/src/compositions/product-os/beatgrid.ts from the ACTUAL
     detected beat times, so the edit cannot drift against the track
  4. trims the window to video/public/<name>.mp3

Envato / Artlist / Musicbed files must NOT be committed — their licences forbid
redistributing the source audio. `.gitignore` already excludes audio/raw/ and
video/public/*.mp3 is yours to manage. You still need to register a licence for
the project on their side.
"""
import argparse, json, subprocess, sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from analyze_audio import (  # noqa: E402
    beat_grid, downbeats, env_fps, estimate_tempo, load_mono, onset_envelope, sections,
)

# The edit's rhythmic intent, in beats per shot. Tempo-independent — this is the
# thing worth preserving when you swap tracks.
SHOT_BEATS = [3, 5, 2, 4, 5, 6, 4, 3, 4, 3, 4, 3, 6]
FPS = 30
ROOT = Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("track")
    ap.add_argument("--at", type=float, default=None,
                    help="window start in seconds (snapped to the nearest downbeat)")
    ap.add_argument("--prefer-quiet-start", action="store_true",
                    help="start on the quietest eligible section (default: auto)")
    ap.add_argument("--fps", type=int, default=FPS)
    ap.add_argument("--credit", default="", help="attribution string for beatgrid.ts")
    args = ap.parse_args()

    src = Path(args.track)
    if not src.exists():
        sys.exit(f"no such file: {src}")

    print(f"analysing {src.name} …")
    x = load_mono(src)
    env, rms = onset_envelope(x)
    bpm, conf = estimate_tempo(env)[:2]
    times, strengths, _ = beat_grid(env, bpm)
    dbs, _ = downbeats(times, strengths)
    secs = sections(rms, len(times), bpm, 60.0 / bpm * 4 * args.fps)
    need = sum(SHOT_BEATS)

    beat_f = 60.0 / bpm * args.fps
    print(f"  {bpm:.1f} BPM · beat confidence {conf:.2f} · "
          f"1 beat = {beat_f:.2f}f · {len(times)} beats")
    if conf < 0.55:
        print("  ! low beat confidence — this track's pulse is not reliable enough\n"
              "    to cut to. Prefer something with a steady kick.")
    if len(times) < need + 2:
        sys.exit(f"track too short: needs {need} beats, found {len(times)}")

    db_idx = [i for i, d in enumerate(dbs) if d and i + need + 1 < len(times)]
    if not db_idx:
        sys.exit("no downbeat leaves room for the full edit")

    if args.at is not None:
        start = min(db_idx, key=lambda i: abs(times[i] - args.at))
        why = f"--at {args.at}s"
    elif secs and args.prefer_quiet_start:
        quiet = min(secs, key=lambda s: s["energy"])
        start = min(db_idx, key=lambda i: abs(times[i] - quiet["t_start"]))
        why = f"quietest section ({quiet['section']}, energy {quiet['energy']})"
    elif secs:
        # Default: the latest quiet-ish section that still leaves room. A launch
        # video wants to open under-stated and land in the track's strong passage.
        span = need * (60.0 / bpm)
        ok = [s for s in secs if s["t_start"] + span <= times[db_idx[-1]] + span]
        cands = [s for s in ok if s["energy"] < 0.72] or ok or secs
        pick = cands[-1] if len(cands) > 1 else cands[0]
        start = min(db_idx, key=lambda i: abs(times[i] - pick["t_start"]))
        why = f"section '{pick['section']}' (energy {pick['energy']})"
    else:
        start = db_idx[0]
        why = "first downbeat (no sections detected)"

    seg = times[start:start + need + 1]
    t0 = float(seg[0])
    cut_f = [round((t - t0) * args.fps) for t in seg]
    durs, acc = [], 0
    for n in SHOT_BEATS:
        durs.append(cut_f[acc + n] - cut_f[acc])
        acc += n
    total = sum(durs)
    print(f"  window: {t0:.3f}s → {t0 + total/args.fps:.3f}s  ({why})")
    print(f"  {need} beats = {total} frames = {total/args.fps:.2f}s")
    print(f"  shot durations: {durs}")

    dest_name = src.stem + ".mp3"
    credit = args.credit or (
        f"{src.stem} — verify and record the licence for this track yourself; "
        "subscription libraries (Envato, Artlist, Musicbed) require a per-project "
        "licence registration and forbid redistributing the source file."
    )
    ts = f'''// GENERATED by pipeline/set_music.py — do not hand-edit.
// Source: {src.name} ({bpm:.1f} BPM, beat confidence {conf:.2f})
// Shot lengths are measured from this track's ACTUAL detected beat times, not
// from a nominal grid, so the edit cannot drift against the music.

export const MUSIC = {{
  file: {json.dumps(dest_name)},
  credit: {json.dumps(credit)},
  bpm: {bpm:.2f},
  beatConfidence: {conf:.2f},
  /** where in the ORIGINAL track this window starts, in seconds */
  sourceStartSec: {t0:.4f},
  sourceSection: {json.dumps(why)},
}} as const;

/** Beats per shot — the edit's rhythmic intent, independent of tempo. */
export const SHOT_BEATS = {SHOT_BEATS};

/** Cut positions in frames, relative to film start (length {len(cut_f)}). */
export const CUT_FRAMES = {cut_f};

/** Shot durations in frames, derived from CUT_FRAMES. */
export const BEAT_DURATIONS = {durs};

export const FILM_FRAMES = {total};
'''
    out_ts = ROOT / "video/src/compositions/product-os/beatgrid.ts"
    out_ts.write_text(ts)
    print(f"  wrote {out_ts.relative_to(ROOT)}")

    pub = ROOT / "video/public"
    pub.mkdir(parents=True, exist_ok=True)
    dest = pub / dest_name
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.4f}", "-i", str(src),
                    "-t", f"{total/args.fps + 1.5:.3f}", "-c:a", "libmp3lame",
                    "-b:a", "192k", str(dest)], check=True)
    print(f"  wrote {dest.relative_to(ROOT)}")
    print("\nnow: cd video && npx remotion render src/index.ts ProductOSLaunch out/raw.mp4")


if __name__ == "__main__":
    main()

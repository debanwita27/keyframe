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
#
# Weighted by READING LOAD, not by importance. A frame carrying five word-chips
# or a two-line headline plus a labelled object needs longer than a frame showing
# one shape move, and an even cut rhythm across both is what makes a text-heavy
# product video feel rushed. Visual beats stay at 3-4; text-heavy ones get 5.
SHOT_BEATS = [
    # The blank-prompt beat was cut: shot 1 now owns the card entrance AND the
    # typing, which tightens the open and makes the wordmark underline the first
    # whoosh in the film.
    5,   # 1  card enters, the real question types in
    2,   # 3  submit
    4,   # 4  title
    5,   # 5  reframe — struck-through line + three role chips
    6,   # 6  lifecycle rail — five stage labels
    4,   # 7a validate ideas
    3,   # 7b benchmark UX      — visual, one card lifts
    5,   # 7c structure problem — five word-chips to read
    4,   # 7d objectives/PRD    — card headline + one metric
    6,   # 7e knowledge base    — six labelled docs, ~9 words: the heaviest frame
    4,   # 7f prototype         — mostly visual
    6,   # 8  end card
]
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

    # PHASE REFINEMENT.
    # The beat grid is fitted globally with one tempo and one phase. Over a long
    # track a small BPM error accumulates, so a window 70s in can sit a third of
    # a beat off even though the grid is right on average. Measured on the first
    # track this was 5 frames late — clearly audible as cuts landing behind the
    # music. Search +/- half a beat and take the offset that puts our cuts on the
    # loudest onsets, then move the window start to match.
    efps = env_fps()
    half = 0.5 * 60.0 / bpm
    cand = np.linspace(-half, half, 41)

    def phase_score(shift):
        tot, n = 0.0, 0
        for t in seg:
            c = int((t + shift) * efps)
            if 0 <= c < len(env):
                tot += env[c]
                n += 1
        return tot / max(1, n)

    scores = np.array([phase_score(c) for c in cand])
    best_shift = float(cand[int(np.argmax(scores))])
    base = phase_score(0.0)
    if scores.max() > base * 1.04:      # only move if it's a real improvement
        t0 += best_shift
        seg = seg + best_shift
        print(f"  phase refined by {best_shift*args.fps:+.1f}f "
              f"({base:.3f} -> {scores.max():.3f} onset alignment)")
    else:
        print(f"  phase already aligned ({base:.3f})")

    cut_f = [round((t - t0) * args.fps) for t in seg]
    durs, acc = [], 0
    for n in SHOT_BEATS:
        durs.append(cut_f[acc + n] - cut_f[acc])
        acc += n
    total = sum(durs)
    print(f"  window: {t0:.3f}s → {t0 + total/args.fps:.3f}s  ({why})")
    print(f"  {need} beats = {total} frames = {total/args.fps:.2f}s")
    print(f"  shot durations: {durs}")

    # DUCK ENVELOPE, derived from the material.
    # Hand-tuning gains per track does not survive a track swap: a duck sized for
    # a flat track flattens a dynamic one (measured: LRA collapsed from 14.9 to
    # 3.4 LU when the same envelope was reused). So size the duck by how much
    # contrast the music ALREADY provides, and only supply the remainder.
    open_beats = sum(SHOT_BEATS[:3])          # shots 1-3, before the title flash
    body_beats = sum(SHOT_BEATS[:12])
    def rms_between(b0, b1):
        a_ = int((t0 + b0 * 60.0 / bpm) * efps)
        b_ = int((t0 + b1 * 60.0 / bpm) * efps)
        a_, b_ = max(0, a_), min(len(rms), max(a_ + 1, b_))
        return float(np.sqrt((rms[a_:b_] ** 2).mean()) + 1e-9)

    r_open, r_body = rms_between(0, open_beats), rms_between(open_beats, body_beats)
    natural_db = 20 * np.log10(r_body / r_open)
    # The section table is bar-quantised, so a window that starts near the end of
    # a quiet section overstates how quiet its opening really is. Measured on one
    # track this claimed 16 dB of natural contrast where the render delivered 4.
    # Cap what we credit to the music so the envelope still does real work.
    natural_db = float(min(natural_db, 8.0))
    TARGET_DB = 15.0                          # how far under the body the open should sit
    remainder_db = max(0.0, TARGET_DB - natural_db)
    open_gain = float(np.clip(10 ** (-remainder_db / 20), 0.16, 1.0))
    print(f"  duck: music already gives {natural_db:.1f} dB of open→body contrast; "
          f"envelope supplies {remainder_db:.1f} dB (open gain {open_gain:.2f})")
    duck = {
        "open": round(open_gain, 3),
        "preRise": round(min(1.0, open_gain * 1.7), 3),
        "dip": round(open_gain * 0.45, 3),
        "body": 1.0,
        "outro": 0.34,
    }

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

/**
 * One beat in frames. Shot-internal animation keyframes must be multiples of
 * this (or clean halves of it), otherwise reveals land a few frames behind the
 * music even though the cuts themselves are on the beat — which reads as the
 * whole film being slightly out of sync.
 */
export const BEAT_F = {beat_f:.2f};
/** Snap a beat count to whole frames: b(1) = one beat, b(0.5) = half a beat. */
export const b = (beats: number) => Math.round(beats * BEAT_F);

/** Beats per shot — the edit's rhythmic intent, independent of tempo. */
export const SHOT_BEATS = {SHOT_BEATS};

/** Cut positions in frames, relative to film start (length {len(cut_f)}). */
export const CUT_FRAMES = {cut_f};

/** Shot durations in frames, derived from CUT_FRAMES. */
export const BEAT_DURATIONS = {durs};

export const FILM_FRAMES = {total};

/**
 * Ducking gains, derived from THIS track's own dynamics rather than hand-tuned.
 * The music already supplies {natural_db:.1f} dB of open→body contrast, so the
 * envelope only makes up the difference to {TARGET_DB:.0f} dB.
 */
export const DUCK = {json.dumps(duck)} as const;
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

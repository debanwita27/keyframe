#!/usr/bin/env python3
"""
Turn a music track into an LLM-readable rhythm + structure profile.

The video analyzer's counterpart. Same principle: a model cannot hear a track,
but it can act on a beat grid, a confidence number, and a section table.

For each input, writes to <outroot>/<slug>/:
  meta.json      - duration, sample rate
  beats.csv      - beat index, time, frame @ target fps, downbeat flag, strength
  sections.csv   - structural sections with energy + bar counts
  profile.md     - tempo, BEAT CONFIDENCE, section table, energy sparkline,
                   and a recommended shot-length plan in frames

Method (all numpy, no librosa):
  ffmpeg → mono 22050Hz → STFT → log-magnitude → spectral flux onset envelope
  → autocorrelation over 60..190 BPM for tempo → comb-filter phase search for
  the grid → per-bar energy → novelty-based section boundaries.

Usage: analyze_audio.py <audio> [<audio> ...] --out <dir> [--fps 30]
"""
import json, math, subprocess, sys
from pathlib import Path

import numpy as np

SR = 22050
HOP = 256
NFFT = 1024
BPM_MIN, BPM_MAX = 60.0, 190.0
SPARK = "▁▂▃▄▅▆▇█"


def load_mono(path):
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR),
         "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(p.stdout, dtype=np.float32)


def onset_envelope(x):
    """Spectral flux: how much the spectrum grows frame to frame."""
    win = np.hanning(NFFT).astype(np.float32)
    n = 1 + (len(x) - NFFT) // HOP
    if n < 8:
        return np.zeros(1), np.zeros(1)
    idx = np.arange(NFFT)[None, :] + HOP * np.arange(n)[:, None]
    frames = x[idx] * win
    mag = np.abs(np.fft.rfft(frames, axis=1))
    logmag = np.log1p(mag * 8.0)
    flux = np.diff(logmag, axis=0)
    flux[flux < 0] = 0.0                      # onsets only, not decays
    env = flux.sum(axis=1)
    # emphasise low band separately — the kick is what a viewer locks onto
    lo = int(NFFT * 200 / SR) + 1
    low = np.diff(logmag[:, :max(4, lo)], axis=0)
    low[low < 0] = 0.0
    env = env / (env.max() or 1) + 1.4 * (low.sum(axis=1) / (low.sum(axis=1).max() or 1))
    rms = np.sqrt((frames ** 2).mean(axis=1))
    return env, rms


def env_fps():
    return SR / HOP


def estimate_tempo(env):
    """Autocorrelate the onset envelope; the sharpest peak is the tempo."""
    e = env - env.mean()
    ac = np.correlate(e, e, mode="full")[len(e) - 1:]
    ac /= (ac[0] or 1)
    fps = env_fps()
    lag_min = int(fps * 60.0 / BPM_MAX)
    lag_max = min(len(ac) - 1, int(fps * 60.0 / BPM_MIN))
    if lag_max <= lag_min + 2:
        return 120.0, 0.0, ac
    band = ac[lag_min:lag_max]
    best = int(np.argmax(band)) + lag_min
    bpm = 60.0 * fps / best

    # Confidence: how much the winning lag beats the typical lag, combined with
    # how consistently its harmonics also peak. A drum machine scores high; a
    # rubato piano piece scores low. This is the number we pick a track on.
    peak = float(ac[best])
    baseline = float(np.median(band))
    spread = float(band.std()) or 1e-6
    prominence = (peak - baseline) / spread
    harm = []
    for k in (2, 3, 4):
        L = best * k
        if L < len(ac) - 2:
            harm.append(float(ac[L - 1:L + 2].max()))
    harmonic_support = float(np.mean(harm)) / (peak or 1) if harm else 0.0
    conf = max(0.0, min(1.0, 0.55 * min(1.0, prominence / 6.0)
                        + 0.45 * min(1.0, max(0.0, harmonic_support) * 1.6)))
    # fold absurd octaves into a sane range
    while bpm > 175:
        bpm /= 2
    while bpm < 70:
        bpm *= 2
    return bpm, conf, ac


def beat_grid(env, bpm):
    """Find the phase that best lines a constant-tempo grid up with the onsets."""
    fps = env_fps()
    period = 60.0 / bpm * fps
    best_phase, best_score = 0.0, -1e18
    for ph in np.linspace(0, period, 48, endpoint=False):
        pos = np.arange(ph, len(env) - 1, period).astype(int)
        if len(pos) < 4:
            continue
        s = float(env[pos].sum()) / len(pos)
        if s > best_score:
            best_score, best_phase = s, ph
    pos = np.arange(best_phase, len(env) - 1, period)
    times = pos / fps
    strengths = env[pos.astype(int)]
    return times, strengths, period


def downbeats(times, strengths, bar=4):
    """Which of the 4 positions in the bar is consistently loudest = the 'one'."""
    if len(strengths) < bar * 2:
        return np.zeros(len(times), dtype=bool), 0
    sums = [strengths[o::bar].mean() for o in range(bar)]
    off = int(np.argmax(sums))
    flags = np.zeros(len(times), dtype=bool)
    flags[off::bar] = True
    return flags, off


def sections(rms, times_len, bpm, bar_f):
    """Segment by energy novelty on a bar grid — intro / build / main / outro."""
    fps = env_fps()
    per_bar = int(round(60.0 / bpm * 4 * fps))
    if per_bar < 4:
        return []
    nb = len(rms) // per_bar
    if nb < 3:
        return []
    bar_energy = np.array([rms[i * per_bar:(i + 1) * per_bar].mean() for i in range(nb)])
    norm = bar_energy / (bar_energy.max() or 1)
    novelty = np.abs(np.diff(norm, prepend=norm[0]))
    thresh = max(0.06, float(np.percentile(novelty, 88)))
    bounds = [0] + [i for i in range(2, nb - 1) if novelty[i] > thresh] + [nb]
    merged = [bounds[0]]
    for b in bounds[1:]:
        if b - merged[-1] >= 3:                  # sections are >= 3 bars
            merged.append(b)
    if merged[-1] != nb:
        merged[-1] = nb

    out = []
    for i in range(len(merged) - 1):
        a, b = merged[i], merged[i + 1]
        e = float(norm[a:b].mean())
        label = ("outro" if i == len(merged) - 2 and e < 0.72 else
                 "intro" if i == 0 and e < 0.72 else
                 "peak" if e > 0.9 else "main" if e > 0.7 else "breakdown")
        out.append({"section": label, "bar_start": a, "bars": b - a,
                    "t_start": a * per_bar / fps, "t_end": b * per_bar / fps,
                    "energy": round(e, 3)})
    return out


def spark(vals, width=70):
    if len(vals) == 0:
        return ""
    step = max(1, math.ceil(len(vals) / width))
    b = [float(np.mean(vals[i:i + step])) for i in range(0, len(vals), step)]
    hi, lo = max(b), min(b)
    rng = (hi - lo) or 1
    return "".join(SPARK[min(7, int((v - lo) / rng * 7 + 0.5))] for v in b)


def process(path, outroot, fps_target):
    slug = Path(path).stem
    out = Path(outroot) / slug
    out.mkdir(parents=True, exist_ok=True)
    x = load_mono(path)
    if len(x) < SR:
        print(f"  !! {slug}: too short/unreadable")
        return None
    env, rms = onset_envelope(x)
    bpm, conf, _ = estimate_tempo(env)
    times, strengths, period = beat_grid(env, bpm)
    dbs, _ = downbeats(times, strengths)
    dur = len(x) / SR
    bar_f = 60.0 / bpm * 4 * fps_target
    secs = sections(rms, len(times), bpm, bar_f)

    with open(out / "beats.csv", "w") as f:
        f.write("beat,time,frame,downbeat,strength\n")
        for i, (t_, s_) in enumerate(zip(times, strengths)):
            f.write(f"{i},{t_:.4f},{round(t_ * fps_target)},{int(dbs[i])},{s_:.4f}\n")
    with open(out / "sections.csv", "w") as f:
        f.write("section,bar_start,bars,t_start,t_end,energy\n")
        for s in secs:
            f.write(f"{s['section']},{s['bar_start']},{s['bars']},"
                    f"{s['t_start']:.3f},{s['t_end']:.3f},{s['energy']}\n")
    meta = {"file": Path(path).name, "duration": round(dur, 3), "sr": SR,
            "bpm": round(bpm, 2), "beat_confidence": round(conf, 3),
            "beat_f": round(60.0 / bpm * fps_target, 3),
            "bar_f": round(bar_f, 2), "beats": len(times)}
    (out / "meta.json").write_text(json.dumps(meta, indent=2))

    beat_f = 60.0 / bpm * fps_target
    L = [f"# {slug}", "",
         f"`{Path(path).name}` · {dur:.1f}s · {bpm:.1f} BPM · "
         f"**beat confidence {conf:.2f}**", "",
         f"At {fps_target}fps: **1 beat = {beat_f:.2f}f**, 1 bar (4/4) = {bar_f:.2f}f. "
         f"{len(times)} beats detected.", "",
         "Cut on beats; land act changes on downbeats (every 4th beat).", "",
         "## Energy over time", "", "```", spark(rms), "```", ""]
    if secs:
        L += ["## Sections", "",
              "| # | section | bars | start | end | energy | frames |",
              "|---|---------|------|-------|-----|--------|--------|"]
        for i, s in enumerate(secs):
            L.append(f"| {i+1} | {s['section']} | {s['bars']} | {s['t_start']:.2f}s | "
                     f"{s['t_end']:.2f}s | {s['energy']} | "
                     f"{round(s['t_start']*fps_target)}–{round(s['t_end']*fps_target)} |")
        L.append("")
        quiet = [s for s in secs if s["energy"] < 0.72]
        if quiet:
            L += ["Duck the mix over these — they are already quiet, so an "
                  "intro/outro fade here fights nothing:", ""]
            L += [f"- {s['section']}: frames {round(s['t_start']*fps_target)}–"
                  f"{round(s['t_end']*fps_target)}" for s in quiet]
            L.append("")
    L += ["## Beat grid (first 48 beats, frames @ "
          f"{fps_target}fps; **bold** = downbeat)", "",
          "```",
          " ".join(("[%d]" % round(t_ * fps_target)) if dbs[i] else str(round(t_ * fps_target))
                   for i, t_ in enumerate(times[:48])),
          "```", "",
          "## Suggested shot lengths", "",
          f"- 1 bar = {bar_f:.0f}f — a capability beat",
          f"- 2 bars = {bar_f*2:.0f}f — an establishing shot or end card",
          f"- 1/2 bar = {bar_f/2:.0f}f — a fast montage cut",
          f"- minimum usable = {max(11, round(beat_f)):.0f}f (1 beat)", ""]
    (out / "profile.md").write_text("\n".join(L))
    print(f"  {slug}: {bpm:.1f} BPM · conf {conf:.2f} · {dur:.0f}s · "
          f"{len(secs)} sections · bar={bar_f:.1f}f")
    return {"slug": slug, **meta, "sections": len(secs)}


if __name__ == "__main__":
    args = sys.argv[1:]
    outroot, fps_target = "audio/analysis", 30
    if "--out" in args:
        i = args.index("--out"); outroot = args[i + 1]; args = args[:i] + args[i + 2:]
    if "--fps" in args:
        i = args.index("--fps"); fps_target = int(args[i + 1]); args = args[:i] + args[i + 2:]
    idx = []
    for a in args:
        print(f"analyzing {a}")
        r = process(a, outroot, fps_target)
        if r:
            idx.append(r)
    Path(outroot, "index.json").write_text(json.dumps(idx, indent=2))
    if idx:
        best = max(idx, key=lambda r: r["beat_confidence"])
        print(f"\nmost reliable beat: {best['slug']} "
              f"({best['bpm']:.1f} BPM, conf {best['beat_confidence']})")

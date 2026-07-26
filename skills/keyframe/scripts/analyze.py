#!/usr/bin/env python3
"""
Turn a reference video into LLM-readable artifacts.

For each input video, writes to <outroot>/<slug>/:
  meta.json          - dimensions, fps, duration, frame count
  motion.csv         - per-frame: time, motion (mean abs luma delta), luma, motion centroid
  profile.md         - THE text artifact: cut list, per-shot velocity classification,
                       ASCII motion sparkline, static-frame warnings, palette
  sheet_NN.jpg       - dense contact sheets, frame number + timecode burned in
  keys.jpg           - one representative frame per detected shot, large
  keys/NN_*.png      - those key frames as individual files

Usage: analyze.py <video> [<video> ...] --out <dir>
"""
import json, math, os, re, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image

FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
GRID_W, GRID_H = 128, 72        # luma analysis resolution — coarser misses typed text and thin rules
CUT_THRESHOLD = 26.0             # mean abs luma delta (0-255) that reads as a hard cut
STATIC_THRESHOLD = 0.45          # per-frame: below this, nothing moved THIS frame
WINDOW_F = 8                     # slow ambient drift only registers over a window
WINDOW_THRESHOLD = 1.2           # over WINDOW_F frames, below this = genuinely frozen
BLOCK = 8                        # frame is divided into BLOCK x BLOCK tiles
LOCAL_THRESHOLD = 2.0            # max single-tile delta below this = nothing anywhere
SPARK = "▁▂▃▄▅▆▇█"


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, **kw)


def probe(path):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
               "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames,duration",
               "-show_entries", "format=duration", "-of", "json", str(path)]).stdout
    d = json.loads(out)
    st = d["streams"][0]
    num, den = st["r_frame_rate"].split("/")
    fps = float(num) / float(den)
    dur = float(st.get("duration") or d["format"]["duration"])
    return {"file": Path(path).name, "width": st["width"], "height": st["height"],
            "fps": round(fps, 3), "duration": round(dur, 3),
            "frames": int(round(dur * fps)),
            "aspect": f'{st["width"]}x{st["height"]}',
            "orientation": "vertical" if st["height"] > st["width"] else
                           ("square" if st["height"] == st["width"] else "horizontal")}


def luma_frames(path):
    """All frames as small grayscale arrays."""
    p = run(["ffmpeg", "-v", "error", "-i", str(path),
             "-vf", f"scale={GRID_W}:{GRID_H},format=gray",
             "-f", "rawvideo", "-pix_fmt", "gray", "-"])
    buf = np.frombuffer(p.stdout, dtype=np.uint8)
    n = len(buf) // (GRID_W * GRID_H)
    return buf[: n * GRID_W * GRID_H].reshape(n, GRID_H, GRID_W).astype(np.float32)


def analyze_motion(frames, fps):
    """Per-frame motion magnitude + where on screen the motion is."""
    d = np.abs(np.diff(frames, axis=0))
    motion = d.mean(axis=(1, 2))
    luma = frames.mean(axis=(1, 2))
    # centroid of change, normalised 0-1 (x, y); 0.5,0.5 = centre
    cx, cy = [], []
    ys, xs = np.mgrid[0:GRID_H, 0:GRID_W]
    for fr in d:
        tot = fr.sum()
        if tot < 1e-6:
            cx.append(0.5); cy.append(0.5)
        else:
            cx.append(float((fr * xs).sum() / tot / (GRID_W - 1)))
            cy.append(float((fr * ys).sum() / tot / (GRID_H - 1)))
    # A slow camera drift changes a frame by <1px per frame — correct design, but
    # invisible to a per-frame delta. Measure over a window too, and only call a
    # stretch "dead" when BOTH are flat. Without this the analyzer tells you to
    # crank ambient motion until it becomes conscious, which is the wrong note.
    idx = np.arange(len(frames))
    prev = np.maximum(0, idx - WINDOW_F)
    wd = np.abs(frames - frames[prev])
    window = wd.mean(axis=(1, 2))[1:]

    # A whole-frame mean also hides LOCAL motion: text typing into a small card
    # changes ~1% of the pixels, so the frame average stays near zero while
    # something is plainly happening. Take the loudest tile instead.
    bh, bw = GRID_H // BLOCK, GRID_W // BLOCK
    tiles = wd[:, : bh * BLOCK, : bw * BLOCK].reshape(len(frames), BLOCK, bh, BLOCK, bw)
    local = tiles.mean(axis=(2, 4)).max(axis=(1, 2))[1:]
    return motion, luma, np.array(cx), np.array(cy), window, local


def find_cuts(motion, fps):
    cuts = [0]
    for i, m in enumerate(motion):
        if m > CUT_THRESHOLD and (i + 1) - cuts[-1] > max(2, int(fps * 0.12)):
            cuts.append(i + 1)
    return cuts


def classify_shot(seg, fps, wseg=None, lseg=None):
    """Describe the velocity profile of one shot in words."""
    if len(seg) < 2:
        return "flash", "single-frame"
    peak_i = int(np.argmax(seg))
    pos = peak_i / max(1, len(seg) - 1)
    mean, peak = float(seg.mean()), float(seg.max())
    if peak < STATIC_THRESHOLD:
        if lseg is not None and float(np.asarray(lseg).max()) >= LOCAL_THRESHOLD:
            return "local", "small-region motion only (text/counter) — no macro event"
        if wseg is not None and float(np.asarray(wseg).mean()) >= WINDOW_THRESHOLD:
            return "ambient", "drift only — alive, but nothing happens"
        return "frozen", "no movement on any scale — dead frame"
    if pos < 0.28:
        shape = "ease-out (fast in, settles)"
    elif pos > 0.72:
        shape = "ease-in (builds, exits fast)"
    elif seg.std() / (mean + 1e-6) < 0.45:
        shape = "linear/constant velocity"
    else:
        shape = "ease-in-out (peak mid-shot)"
    # overshoot: does motion dip then bump again near the end?
    tail = seg[int(len(seg) * 0.55):]
    overshoot = len(tail) > 4 and tail.max() > tail.mean() * 2.1 and float(np.argmax(tail)) > len(tail) * 0.3
    energy = "hot" if mean > 9 else "medium" if mean > 3.5 else "subtle"
    return energy, shape + (" + overshoot/settle bounce" if overshoot else "")


def frozen_mask(motion, window, local):
    """Frozen only when nothing moved per-frame, over a window, AND anywhere local."""
    return (motion < STATIC_THRESHOLD) & (window < WINDOW_THRESHOLD) & (local < LOCAL_THRESHOLD)


def spark(vals, width=72):
    if len(vals) == 0:
        return ""
    step = max(1, math.ceil(len(vals) / width))
    buckets = [float(np.max(vals[i:i + step])) for i in range(0, len(vals), step)]
    hi = max(buckets) or 1.0
    return "".join(SPARK[min(len(SPARK) - 1, int(v / hi * (len(SPARK) - 1) + 0.5))] for v in buckets)


def palette(path, meta, out_dir, samples=9):
    """Dominant colours across evenly spaced frames."""
    counts = {}
    for k in range(samples):
        t = meta["duration"] * (k + 0.5) / samples
        png = out_dir / f".pal_{k}.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(path),
             "-frames:v", "1", "-vf", "scale=160:-1", str(png)])
        if not png.exists():
            continue
        im = Image.open(png).convert("RGB").quantize(colors=6, method=Image.MEDIANCUT)
        pal = im.getpalette()
        for cnt, idx in im.getcolors():
            rgb = tuple(pal[idx * 3: idx * 3 + 3])
            key = tuple(v // 24 * 24 for v in rgb)          # bucket similar shades
            counts[key] = counts.get(key, 0) + cnt
        png.unlink()
    total = sum(counts.values()) or 1
    top = sorted(counts.items(), key=lambda kv: -kv[1])[:7]
    return [(f"#{r:02X}{g:02X}{b:02X}", round(c / total * 100, 1)) for (r, g, b), c in top]


def sheets(path, meta, out_dir, cell=340, cols=6, rows=6, sample_fps=6):
    drawtext = (f"drawtext=fontfile={FONT}:text='%{{eif\\:n\\:d}}  %{{pts\\:hms}}':"
                f"x=6:y=6:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.65:boxborderw=5")
    vf = f"{drawtext},fps={sample_fps},scale={cell}:-1,tile={cols}x{rows}:padding=4:color=0x111111"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-vf", vf,
         "-q:v", "3", str(out_dir / "sheet_%02d.jpg")])
    return sorted(out_dir.glob("sheet_*.jpg"))


def key_frames(path, meta, cuts, out_dir):
    kdir = out_dir / "keys"
    kdir.mkdir(exist_ok=True)
    fps, n = meta["fps"], meta["frames"]
    picks = []
    for i, c in enumerate(cuts):
        end = cuts[i + 1] if i + 1 < len(cuts) else n
        picks.append(min(n - 1, c + max(1, int((end - c) * 0.45))))
    for i, fr in enumerate(picks):
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{fr / fps:.3f}", "-i", str(path),
             "-frames:v", "1", "-vf", "scale=720:-1", str(kdir / f"{i:02d}_f{fr}.png")])
    files = sorted(kdir.glob("*.png"))
    if files:
        cols = min(3, len(files))
        rows = math.ceil(len(files) / cols)
        lst = out_dir / ".keys.txt"
        lst.write_text("".join(f"file '{f}'\nduration 1\n" for f in files))
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
             "-vf", f"scale=560:-1,tile={cols}x{rows}:padding=6:color=0x111111",
             "-frames:v", "1", "-q:v", "3", str(out_dir / "keys.jpg")])
        lst.unlink()
    return files


def profile_md(meta, motion, luma, cx, cy, cuts, pal, slug, window, local):
    fps = meta["fps"]
    L = [f"# {slug}", "",
         f"`{meta['file']}` · {meta['aspect']} ({meta['orientation']}) · "
         f"{meta['duration']}s · {meta['fps']}fps · {meta['frames']} frames", ""]
    L += ["## Palette (screen share %)", "",
          "  ".join(f"{hexv} {pct}%" for hexv, pct in pal), ""]
    L += ["## Motion magnitude over time",
          "(mean abs luma delta per frame, 0=frozen; each char = "
          f"{max(1, math.ceil(len(motion)/72))} frames)", "",
          "```", spark(motion), "```", "",
          f"peak {motion.max():.1f} · mean {motion.mean():.1f}", "",
          f"## Motion over an {WINDOW_F}-frame window",
          "(catches slow ambient drift that a per-frame delta misses)", "",
          "```", spark(window), "```",
          f"mean {window.mean():.1f}", "",
          f"## Loudest {BLOCK}x{BLOCK} tile per frame",
          "(catches motion confined to a small region, e.g. text typing)", "",
          "```", spark(local), "```",
          f"mean {local.mean():.1f} · frames frozen on ALL THREE scales: "
          f"{int(frozen_mask(motion, window, local).sum())}/{len(motion)}", ""]

    L += [f"## Shots ({len(cuts)} cuts detected @ delta > {CUT_THRESHOLD})", "",
          "| # | frames | t | dur | energy | velocity profile | motion centre |",
          "|---|--------|---|-----|--------|------------------|---------------|"]
    n = meta["frames"]
    for i, c in enumerate(cuts):
        end = cuts[i + 1] if i + 1 < len(cuts) else n
        seg = motion[c:max(c + 1, end - 1)]
        energy, shape = classify_shot(seg, fps, window[c:max(c + 1, end - 1)],
                                      local[c:max(c + 1, end - 1)])
        if len(seg):
            mx, my = float(cx[c:end - 1].mean()), float(cy[c:end - 1].mean())
            where = ("left" if mx < .4 else "right" if mx > .6 else "centre") + "-" + \
                    ("top" if my < .4 else "bottom" if my > .6 else "mid")
        else:
            where = "-"
        L.append(f"| {i+1} | {c}–{end-1} | {c/fps:.2f}s | {(end-c)/fps:.2f}s "
                 f"({end-c}f) | {energy} | {shape} | {where} |")
    L.append("")

    # dead air
    dead = []
    run_start = None
    frozen = frozen_mask(motion, window, local)
    for i, m in enumerate(frozen):
        if m:
            run_start = i if run_start is None else run_start
        else:
            if run_start is not None and i - run_start >= int(fps * 0.33):
                dead.append((run_start, i))
            run_start = None
    if run_start is not None and len(motion) - run_start >= int(fps * 0.33):
        dead.append((run_start, len(motion)))
    if dead:
        L += ["## Frozen stretches (>0.33s with no movement on either scale) — BUGS", ""]
        L += [f"- frames {a}–{b}  ({a/fps:.2f}s–{b/fps:.2f}s, {(b-a)/fps:.2f}s)" for a, b in dead]
        L.append("")
    L += ["## Brightness", "", "```", spark(luma), "```",
          f"min {luma.min():.0f} max {luma.max():.0f} — "
          f"{'dark-dominant' if luma.mean() < 100 else 'light-dominant' if luma.mean() > 155 else 'mid'}",
          ""]
    return "\n".join(L)


def process(video, outroot):
    slug = Path(video).stem
    out = Path(outroot) / slug
    out.mkdir(parents=True, exist_ok=True)
    meta = probe(video)
    frames = luma_frames(video)
    if len(frames) < 3:
        print(f"  !! {slug}: unreadable"); return None
    meta["frames"] = len(frames)
    motion, luma, cx, cy, window, local = analyze_motion(frames, meta["fps"])
    cuts = find_cuts(motion, meta["fps"])
    pal = palette(video, meta, out)
    sh = sheets(video, meta, out)
    kf = key_frames(video, meta, cuts, out)
    (out / "meta.json").write_text(json.dumps(meta, indent=2))
    with open(out / "motion.csv", "w") as f:
        f.write("frame,time,motion,motion_w8,motion_localmax,luma,centroid_x,centroid_y\n")
        for i, m in enumerate(motion):
            f.write(f"{i},{i/meta['fps']:.4f},{m:.4f},{window[i]:.4f},{local[i]:.4f},"
                    f"{luma[i]:.2f},{cx[i]:.3f},{cy[i]:.3f}\n")
    (out / "profile.md").write_text(profile_md(meta, motion, luma, cx, cy, cuts, pal, slug, window, local))
    print(f"  {slug}: {meta['duration']}s {meta['aspect']} · {len(cuts)} shots · "
          f"{len(sh)} sheets · {len(kf)} keys")
    return {"slug": slug, "meta": meta, "cuts": len(cuts), "sheets": [s.name for s in sh]}


if __name__ == "__main__":
    args = sys.argv[1:]
    outroot = "analysis"
    if "--out" in args:
        i = args.index("--out"); outroot = args[i + 1]; args = args[:i] + args[i + 2:]
    idx = []
    for v in args:
        print(f"analyzing {v}")
        r = process(v, outroot)
        if r: idx.append(r)
    Path(outroot, "index.json").write_text(json.dumps(idx, indent=2))
    print(f"\n{len(idx)} analyzed -> {outroot}/")

#!/usr/bin/env python3
"""
Synthesise the SFX layer instead of sourcing it.

Reasons this beats a stock pack: zero licensing risk, deterministic (a seed
gives the identical file forever), and each sound is parameterised so it can be
tuned to the cut it sits under rather than the other way round.

Writes 48kHz stereo 16-bit WAVs to <out>/.

Usage: make_sfx.py [--out video/public/sfx]
"""
import struct, sys, wave
from pathlib import Path

import numpy as np

SR = 48000


def _env(n, attack, decay, curve=2.5):
    """Percussive envelope: near-instant attack, exponential decay."""
    a = max(1, int(attack * SR))
    d = max(1, n - a)
    return np.concatenate([
        np.linspace(0, 1, a) ** 0.6,
        (np.linspace(1, 0, d) ** curve),
    ])[:n]


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float64)


def _onepole_lp(x, cutoff_hz):
    """Cheap one-pole low-pass; cutoff may be an array for a sweep."""
    a = np.exp(-2 * np.pi * np.asarray(cutoff_hz, dtype=np.float64) / SR)
    a = np.broadcast_to(a, x.shape).copy()
    y = np.empty_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def _onepole_hp(x, cutoff_hz):
    return x - _onepole_lp(x, cutoff_hz)


def whoosh(dur=0.34, seed=1, f_start=380, f_end=5200, tilt=1.0):
    """Filtered noise with a rising bandpass — a transition, not an accent."""
    n = int(dur * SR)
    x = _noise(n, seed)
    sweep = np.geomspace(f_start, f_end, n) * tilt
    y = _onepole_hp(_onepole_lp(x, sweep * 2.2), sweep * 0.55)
    y *= np.sin(np.linspace(0, np.pi, n)) ** 1.4          # soft in AND out
    return y


def impact(dur=0.7, seed=2, thump_hz=54, click=0.5):
    """Sub thump + transient click. The sound of a cut landing."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    # pitch drops as it decays — what makes a thump feel heavy
    f = thump_hz * np.exp(-t * 5.0) + 26
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.002, 0, 4.0)
    tick = _onepole_hp(_noise(n, seed), 2200) * _env(n, 0.0005, 0, 22.0) * click
    mid = _onepole_lp(_noise(n, seed + 9), 900) * _env(n, 0.001, 0, 9.0) * 0.35
    return body * 1.0 + tick + mid


def riser(dur=1.0, seed=3, f_start=200, f_end=7000):
    """Builds tension into a downbeat. Sits under the last bar before a drop."""
    n = int(dur * SR)
    x = _noise(n, seed)
    sweep = np.geomspace(f_start, f_end, n)
    y = _onepole_hp(_onepole_lp(x, sweep * 1.8), sweep * 0.8)
    ramp = np.linspace(0, 1, n) ** 2.2
    # faint pitched component so it reads as musical, not just noise
    tone = np.sin(2 * np.pi * np.cumsum(np.geomspace(300, 1800, n)) / SR) * 0.16
    return (y + tone) * ramp


def tick(dur=0.09, seed=4, hz=2600):
    """UI confirmation — a tick appearing, a chip landing."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * hz * t) * _env(n, 0.0004, 0, 26.0)
    y += _onepole_hp(_noise(n, seed), 4000) * _env(n, 0.0003, 0, 34.0) * 0.5
    return y


def keystroke(dur=0.05, seed=5):
    """One key press. Layered under TypeOn at the real character rate."""
    n = int(dur * SR)
    y = _onepole_lp(_noise(n, seed), 5200) * _env(n, 0.0004, 0, 30.0)
    y += _onepole_hp(_noise(n, seed + 3), 3000) * _env(n, 0.0002, 0, 45.0) * 0.4
    return y


def sub_drop(dur=1.2, seed=6):
    """Long descending sub under the outro."""
    n = int(dur * SR)
    f = np.geomspace(120, 32, n)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return y * np.concatenate([np.linspace(0, 1, int(0.05 * SR)),
                               np.linspace(1, 0, n - int(0.05 * SR)) ** 1.6])


def stereo(y, width=0.0, seed=11):
    """Mono → stereo. `width` adds a few samples of decorrelation."""
    y = y / (np.abs(y).max() or 1)
    if width <= 0:
        return np.stack([y, y], axis=1)
    d = int(width * 0.004 * SR)
    r = np.roll(y, d) * (1 - width * 0.12)
    return np.stack([y, r], axis=1)


def write_wav(path, data, peak=0.89):
    d = data / (np.abs(data).max() or 1) * peak
    pcm = (np.clip(d, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return path


SOUNDS = {
    "whoosh-soft":  lambda: stereo(whoosh(0.30, 1, 300, 3800), 0.5),
    "whoosh-hard":  lambda: stereo(whoosh(0.42, 7, 500, 7200, 1.15), 0.7),
    "impact-deep":  lambda: stereo(impact(0.85, 2, 50, 0.55), 0.2),
    "impact-soft":  lambda: stereo(impact(0.45, 12, 68, 0.3), 0.2),
    "riser":        lambda: stereo(riser(1.05, 3), 0.4),
    "tick":         lambda: stereo(tick(0.09, 4), 0.15),
    "keystroke":    lambda: stereo(keystroke(0.05, 5), 0.1),
    "sub-drop":     lambda: stereo(sub_drop(1.3, 6), 0.0),
}

if __name__ == "__main__":
    args = sys.argv[1:]
    out = Path("video/public/sfx")
    if "--out" in args:
        out = Path(args[args.index("--out") + 1])
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in SOUNDS.items():
        p = write_wav(out / f"{name}.wav", fn())
        dur = wave.open(str(p)).getnframes() / SR
        print(f"  {name:14s} {dur:.2f}s  {p.stat().st_size/1024:.0f}KB")
    print(f"\n{len(SOUNDS)} sounds → {out}/")

# mthblt_A_love-everything-about-this-website

`mthblt_A_love-everything-about-this-website.mp4` · 1294x720 (horizontal) · 16.95s · 60.0fps · 1017 frames

## Palette (screen share %)

#F0F0C0 14.3%  #001800 6.0%  #6090C0 5.2%  #184818 4.3%  #3078C0 4.0%  #78A860 3.8%  #78A8A8 3.1%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 15 frames)

```
▁▁▁▁▁▁▃▁▁▂▁▁▁▁▁▁▁▁▁▁▂▁▁▁▁▁▃▁▁▁▁▄▁▁▁▁▁▁▁▁▄▁▁▁▁▁▁▁▁▁▁▂▂▂█▁▁▁▃▁▁▁▁▁▁▁▁▁
```

peak 167.0 · mean 3.0

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▁▁▁▁▃▂▂▂▂▁▂▂▂▂▂▂▂▁▂▂▂▁▂▁▃▃▂▂▂▄▂▂▁▁▂▂▁▁▄▄▁▁▁▂▂▂▁▁▁▂▂▂██▁▁▃▃▂▂▂▂▂▂▂▂
```
mean 12.9

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▁▁▁▁▁▄▃▃▃▃▂▃▃▄▃▃▃▃▂▄▃▃▂▄▄▄▄▃▃▂▅▄▄▂▂▅▄▃▂▅▅▂▂▂▅▄▃▂▂▂▅▆▅██▁▁▅▅▄▃▃▂▃▃▃▃
```
mean 45.6 · frames frozen on ALL THREE scales: 6/1016

## Shots (8 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–93 | 0.00s | 1.57s (94f) | local | small-region motion only (text/counter) — no macro event | centre-bottom |
| 2 | 94–306 | 1.57s | 3.55s (213f) | medium | ease-out (fast in, settles) | centre-bottom |
| 3 | 307–404 | 5.12s | 1.63s (98f) | subtle | ease-in-out (peak mid-shot) | centre-mid |
| 4 | 405–466 | 6.75s | 1.03s (62f) | medium | ease-in-out (peak mid-shot) + overshoot/settle bounce | left-mid |
| 5 | 467–614 | 7.78s | 2.47s (148f) | subtle | ease-out (fast in, settles) | left-mid |
| 6 | 615–820 | 10.25s | 3.43s (206f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 7 | 821–880 | 13.68s | 1.00s (60f) | local | small-region motion only (text/counter) — no macro event | centre-mid |
| 8 | 881–1016 | 14.68s | 2.27s (136f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-bottom |

## Brightness

```
▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▆▆▆▆▆▆▆███▇▇██▇▇█▆▆▆▆▇█████████▃▃▃▃▂▂▂▂▂▂▃▃▃
```
min 41 max 229 — mid

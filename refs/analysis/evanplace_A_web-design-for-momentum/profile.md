# evanplace_A_web-design-for-momentum

`evanplace_A_web-design-for-momentum.mp4` · 1280x720 (horizontal) · 12.267s · 60.0fps · 736 frames

## Palette (screen share %)

#D8D8D8 47.9%  #F0F0F0 30.6%  #D8F0F0 7.4%  #303048 3.4%  #181830 2.8%  #A8A8C0 2.8%  #C0D8D8 1.7%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 11 frames)

```
▁▁▁▃▁▁▁▁▁▁▁▁▁▁▁▁▃▁▁▁▁▁▁▁▁▁▁▁▁▂▃▁▁▁▁▁▁▁▁▁▁▁▄▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▁▁▁▁
```

peak 88.9 · mean 1.0

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▂▃▃▂▂▁▁▁▁▁▁▁▁▂▃▃▁▁▁▁▁▁▁▁▁▁▁▂▃▁▁▁▁▁▁▁▁▁▁▁▄▅▂▂▁▁▁▁▁▁▁▁▁▂▇█▁▁▁▁▁▁▁▁▁
```
mean 4.8

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▂▃▄▃▃▃▂▁▁▁▁▁▁▁▂▄▄▂▂▂▁▁▁▁▁▁▁▂▃▃▂▂▂▁▁▁▁▁▁▁▂██▃▂▂▁▁▁▁▁▁▁▂▃██▂▁▁▁▁▁▁▁▁
```
mean 20.1 · frames frozen on ALL THREE scales: 239/735

## Shots (5 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–39 | 0.00s | 0.67s (40f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 2 | 40–183 | 0.67s | 2.40s (144f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 3 | 184–468 | 3.07s | 4.75s (285f) | subtle | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |
| 4 | 469–622 | 7.82s | 2.57s (154f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 5 | 623–735 | 10.38s | 1.88s (113f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 101–144  (1.68s–2.40s, 0.72s)
- frames 238–291  (3.97s–4.85s, 0.88s)
- frames 383–432  (6.38s–7.20s, 0.82s)
- frames 520–580  (8.67s–9.67s, 1.00s)

## Brightness

```
███████████████████████████████████████████▇▇▆▆▆▆▆▆▆▆▆▆▆███████████
```
min 157 max 241 — light-dominant

# evanplace_B_the-latest-chapter-ive-joined-weareoffmenu

`evanplace_B_the-latest-chapter-ive-joined-weareoffmenu.mp4` · 1280x720 (horizontal) · 13.0s · 30.0fps · 390 frames

## Palette (screen share %)

#000000 44.1%  #181818 28.3%  #303030 9.7%  #A8A8A8 8.2%  #909090 5.1%  #787878 3.8%  #484848 0.8%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 6 frames)

```
▁▁▁▂▁▃▁▅▅▅▄▂▁▁▁▂▅█▃▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▄
```

peak 62.5 · mean 3.4

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▂▃▃▄▄▅█▇▄▃▂▂▁▂▃▅▅▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂
```
mean 8.9

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▁▇▇▆▇▇▇▇▇▆▆▅▄▂▄▆▇▇▄█▇▅▅▃▃▂▂▂▂▂▂▂▂▂▂▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█
```
mean 36.4 · frames frozen on ALL THREE scales: 140/389

## Shots (7 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–46 | 0.00s | 1.57s (47f) | subtle | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |
| 2 | 47–50 | 1.57s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-mid |
| 3 | 51–54 | 1.70s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 4 | 55–58 | 1.83s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-mid |
| 5 | 59–100 | 1.97s | 1.40s (42f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 6 | 101–104 | 3.37s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 7 | 105–389 | 3.50s | 9.50s (285f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 0–10  (0.00s–0.33s, 0.33s)
- frames 258–388  (8.60s–12.93s, 4.33s)

## Brightness

```
███▇▆███▅▄▃▃▃▃▃▃▃▄▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃
```
min 28 max 158 — dark-dominant

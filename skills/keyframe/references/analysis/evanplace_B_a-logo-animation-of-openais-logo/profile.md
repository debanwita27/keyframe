# evanplace_B_a-logo-animation-of-openais-logo

`evanplace_B_a-logo-animation-of-openais-logo.mp4` · 1280x720 (horizontal) · 7.917s · 60.0fps · 475 frames

## Palette (screen share %)

#000000 98.3%  #D8D8D8 0.4%  #A8A8A8 0.3%  #303030 0.2%  #484848 0.2%  #909090 0.2%  #181818 0.2%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 7 frames)

```
▁▁▁█▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▃▁▁▁▁▁▂▂▁▁▁▁▁▁▁▁▁▂▆▅▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```

peak 4.7 · mean 0.3

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▁▇▇▁▁▁▁▁▁▂▄▅▇█████▇▇▇▇▆▆▆▆▃▂▁▁▂▃▃▃▃▂▂▂▂▁▂▃▄▅▆▆▇▆▅▄▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```
mean 1.6

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▁▁▆▆▁▁▁▁▁▂▃▅▅▆▇▇▆▇▇▇▆▆▆▆▆▆▆▅▂▁▁▂▃▃▃▃▃▂▂▂▁▂▃▅▇█▇█▇▅▄▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```
mean 21.9 · frames frozen on ALL THREE scales: 178/474

## Shots (1 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–474 | 0.00s | 7.92s (475f) | subtle | ease-out (fast in, settles) | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 0–24  (0.00s–0.40s, 0.40s)
- frames 32–71  (0.53s–1.18s, 0.65s)
- frames 207–227  (3.45s–3.78s, 0.33s)
- frames 379–474  (6.32s–7.90s, 1.58s)

## Brightness

```
████▅▅▅▅▅▅▅▆▆▆▇▇▇▇▇▇▇▇▇▇▇▇▇▆▆▅▅▅▆▆▆▆▆▆▆▆▆▆▆▆▇▇▇█████████████████████
```
min 7 max 12 — dark-dominant

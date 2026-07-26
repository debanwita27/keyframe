# evanplace_A_making-an-effort-to-share-more-work-some-s

`evanplace_A_making-an-effort-to-share-more-work-some-s.mp4` · 720x900 (vertical) · 8.867s · 30.0fps · 266 frames

## Palette (screen share %)

#000000 19.1%  #303018 8.5%  #181818 6.3%  #D8D8D8 5.9%  #606048 4.6%  #C0C0C0 4.2%  #A8A8A8 3.5%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 4 frames)

```
▁▁▁▁▁▁▁▁▃▄▇█▅▂▂▃▁▁▁▁▁▁▃▃▄▅▆▄▃▂▁▁▁▁▁▂▂▂▂▃▆▇▅▄▂▁▁▁▁▁▁▁▁▃▄▅▅▇▇▆▆▄▃▂▁▁▁
```

peak 45.7 · mean 9.6

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▁▁▁▁▁▁▃▅▆▆▇▇▅▃▂▁▁▁▁▁▂▄▄▅▆▆▅▄▃▂▂▂▂▂▂▂▃▄▆██▆▅▄▂▁▁▁▁▁▁▃▄▅▆▇█▇▇█▆▅▄▂▁
```
mean 29.7

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▁▁▁▁▁▁▁▃▅▆▆▇▇▅▃▃▁▁▁▁▁▃▄▆▆▆▆▆▆▄▂▂▂▂▂▂▃▃▅▆▇▇▇▄▃▃▃▃▃▃▃▃▃▄▅▆███▇▇▆▅▅▃▁
```
mean 84.7 · frames frozen on ALL THREE scales: 25/265

## Shots (12 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–41 | 0.00s | 1.40s (42f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | right-bottom |
| 2 | 42–45 | 1.40s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 3 | 46–101 | 1.53s | 1.87s (56f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 4 | 102–105 | 3.40s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 5 | 106–162 | 3.53s | 1.90s (57f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-top |
| 6 | 163–166 | 5.43s | 0.13s (4f) | hot | linear/constant velocity | centre-mid |
| 7 | 167–226 | 5.57s | 2.00s (60f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | right-mid |
| 8 | 227–230 | 7.57s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 9 | 231–234 | 7.70s | 0.13s (4f) | hot | linear/constant velocity | centre-mid |
| 10 | 235–238 | 7.83s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-mid |
| 11 | 239–242 | 7.97s | 0.13s (4f) | hot | linear/constant velocity | centre-bottom |
| 12 | 243–265 | 8.10s | 0.77s (23f) | medium | ease-out (fast in, settles) | right-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 68–88  (2.27s–2.93s, 0.67s)

## Brightness

```
▅▅▅▅▅▅▅▅▅▅▅▆▆▆▇▇▇▇▇▇▇▇█████▇▇▇▇▇▇▇▇▇▇▇▇▇▆▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▄▄▅▅▅▅▅▅▅
```
min 56 max 152 — mid

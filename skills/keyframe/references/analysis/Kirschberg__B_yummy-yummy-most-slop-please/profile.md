# Kirschberg__B_yummy-yummy-most-slop-please

`Kirschberg__B_yummy-yummy-most-slop-please.mp4` · 1920x1080 (horizontal) · 53.067s · 30.0fps · 1592 frames

## Palette (screen share %)

#F0F0F0 51.2%  #F0D8D8 18.0%  #D8D8D8 11.3%  #F0F0D8 4.7%  #000000 2.9%  #C0A8A8 2.5%  #604848 2.5%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 23 frames)

```
▁▁▁▁▁▁▁▁▂▂▁▁▁▂▂▂▂▂▂▁▁▁▁▁▁▁▂▂▂▄▃▂▂▂▅▄▄█▁▁▁▄▄▁▁▁▁▁▁▁▁▁▁▁▂▁▂▁▂▂▃▁▁▁▁▁▃▁▁▁
```

peak 56.4 · mean 2.5

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▃▃▂▇▃▂▂▁▇▄▄██▁▁▅▇▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▂▃▁▁▁▁▁▅▁▁▁
```
mean 11.0

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▂▂▁▂▂▁▁▁▁▂▂▃▂▂▂▂▃▂▃▃▂▁▁▂▂▁██▂▆▃▂▃▃█▇▇██▂▂▄▆▂▁▂▁▁▁▄▂▂▁▁▂▂▄▄▄▄▆▃▃▁▁▁▅▂▂▁
```
mean 37.5 · frames frozen on ALL THREE scales: 255/1591

## Shots (3 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–790 | 0.00s | 26.37s (791f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 2 | 791–869 | 26.37s | 2.63s (79f) | hot | ease-out (fast in, settles) | centre-mid |
| 3 | 870–1591 | 29.00s | 24.07s (722f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 39–51  (1.30s–1.70s, 0.40s)
- frames 64–73  (2.13s–2.43s, 0.30s)
- frames 507–523  (16.90s–17.43s, 0.53s)
- frames 539–549  (17.97s–18.30s, 0.33s)
- frames 1100–1126  (36.67s–37.53s, 0.87s)
- frames 1224–1233  (40.80s–41.10s, 0.30s)
- frames 1494–1518  (49.80s–50.60s, 0.80s)
- frames 1551–1566  (51.70s–52.20s, 0.50s)
- frames 1574–1591  (52.47s–53.03s, 0.57s)

## Brightness

```
███████████████████████████▇▇▆▃▂▂▂▆▆▆▆▁▁▁▃█▇▇▇▇▇▇████████████▇▇▇▇▇▇▁▁▁
```
min 0 max 251 — light-dominant

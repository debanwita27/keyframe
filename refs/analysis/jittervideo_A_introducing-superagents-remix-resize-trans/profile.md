# jittervideo_A_introducing-superagents-remix-resize-trans

`jittervideo_A_introducing-superagents-remix-resize-trans.mp4` · 1152x720 (horizontal) · 37.933s · 60.0fps · 2276 frames

## Palette (screen share %)

#000000 24.2%  #D8D8F0 23.2%  #F0F0F0 16.5%  #18A8F0 4.2%  #F0F000 3.2%  #3090D8 3.2%  #C0D8D8 3.2%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 32 frames)

```
▃▂▁▁▁▃▁▂▃▁▁▁▂▅▁▁▁▃▁▁▁▁▁▁▁█▁▁▃▁▁▁▃▁▁▁▃▁▁▁▂▁▁▄▁▁▂▁▂▂▃█▁▁▁▁▁▁▂▂▁▁▁▃▂▁▂▂▁▂▁▁
```

peak 204.5 · mean 3.4

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▃▂▁▁▁▄▃▂▄▂▂▁▂▅▁▁▁▃▁▁▁▂▁▁▁█▁▁▃▃▁▁▃▁▁▁▃▁▁▁▂▂▁▄▂▂▂▁▃▃▃█▁▁▂▂▁▂▃▃▁▂▂▃▂▁▂▂▁▂▁▁
```
mean 14.9

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▇▅▃▄▂▇▆▅▆▅▄▂▅█▃▂▁▇▃▃▃▄▄▅▄█▂▂▇▆▃▄▅▃▂▂▅▃▃▃▇▇▂▇▄▃▅▂█▇▇█▂▂▅▆▂▃▅▆▂▄▃▆▆▃▄▅▃▅▁▁
```
mean 65.2 · frames frozen on ALL THREE scales: 76/2275

## Shots (18 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–17 | 0.00s | 0.30s (18f) | hot | ease-out (fast in, settles) | centre-mid |
| 2 | 18–179 | 0.30s | 2.70s (162f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 3 | 180–266 | 3.00s | 1.45s (87f) | hot | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 4 | 267–417 | 4.45s | 2.52s (151f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 5 | 418–552 | 6.97s | 2.25s (135f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 6 | 553–801 | 9.22s | 4.15s (249f) | subtle | ease-in-out (peak mid-shot) + overshoot/settle bounce | right-bottom |
| 7 | 802–927 | 13.37s | 2.10s (126f) | subtle | ease-out (fast in, settles) | centre-bottom |
| 8 | 928–1047 | 15.47s | 2.00s (120f) | subtle | ease-in (builds, exits fast) | centre-top |
| 9 | 1048–1160 | 17.47s | 1.88s (113f) | subtle | linear/constant velocity | right-mid |
| 10 | 1161–1292 | 19.35s | 2.20s (132f) | subtle | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |
| 11 | 1293–1376 | 21.55s | 1.40s (84f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | right-mid |
| 12 | 1377–1599 | 22.95s | 3.72s (223f) | medium | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |
| 13 | 1600–1607 | 26.67s | 0.13s (8f) | hot | linear/constant velocity | centre-mid |
| 14 | 1608–1646 | 26.80s | 0.65s (39f) | hot | ease-out (fast in, settles) | centre-mid |
| 15 | 1647–1861 | 27.45s | 3.58s (215f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 16 | 1862–1895 | 31.03s | 0.57s (34f) | hot | ease-out (fast in, settles) | centre-mid |
| 17 | 1896–2039 | 31.60s | 2.40s (144f) | subtle | ease-out (fast in, settles) | centre-mid |
| 18 | 2040–2275 | 34.00s | 3.93s (236f) | subtle | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 2233–2275  (37.22s–37.92s, 0.70s)

## Brightness

```
▇█████▆▆▇▆▆▆▆▆▂▂▂▂▂▂▂▂▂▂▂█▇▇▇▇▇▇▇▆▇▇█████▆▆█▇▇███▇▇▇▁▁▂▂▂▂▃▃▃▃▃▃▂▂▂▂▂▂▁▁
```
min 0 max 240 — mid

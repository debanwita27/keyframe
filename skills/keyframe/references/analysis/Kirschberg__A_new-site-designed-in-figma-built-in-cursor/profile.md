# Kirschberg__A_new-site-designed-in-figma-built-in-cursor

`Kirschberg__A_new-site-designed-in-figma-built-in-cursor.mp4` · 1818x1080 (horizontal) · 29.0s · 60.0fps · 1740 frames

## Palette (screen share %)

#F0F0F0 30.4%  #D8D8D8 6.8%  #C0C0C0 6.3%  #787878 4.8%  #604860 4.5%  #484848 4.5%  #C0D8D8 3.8%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 25 frames)

```
▁▁▁▄▃▄▄▃▃▁▁▁▄▂▂▃▃▄▄▁▄▁▁▃▂▁▁▆▅▁▁▃▃▃▃▂▁▁▂▁▂▃▂▂▂▁▁▃▁▁▆█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```

peak 68.3 · mean 3.9

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▂▂▁▃▃▃▃▃▃▂▁▁▆▁▃▄▅▆▅▂▅▂▁▂▅▁▁█▅▂▁▄▄▄▄▃▂▂▂▁▂▄▄▃▃▃▂▅▁▁▄▆▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```
mean 15.5

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▅▆▁▆▆▇▆▇▇▄▃▂█▃████▇▃▇▁▂▄▆▁▁▇▆▂▁▅▆▅▆▄▂▂▂▂▃▅▄▃▃▃▂▅▁▁▄▇▁▁▂▂▂▁▁▂▂▁▁▁▁▁▁▁▁▁
```
mean 58.2 · frames frozen on ALL THREE scales: 444/1739

## Shots (10 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–97 | 0.00s | 1.63s (98f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 2 | 98–135 | 1.63s | 0.63s (38f) | hot | ease-out (fast in, settles) | centre-bottom |
| 3 | 136–160 | 2.27s | 0.42s (25f) | hot | ease-out (fast in, settles) | centre-bottom |
| 4 | 161–440 | 2.68s | 4.67s (280f) | medium | ease-in-out (peak mid-shot) + overshoot/settle bounce | centre-mid |
| 5 | 441–450 | 7.35s | 0.17s (10f) | hot | linear/constant velocity | centre-mid |
| 6 | 451–687 | 7.52s | 3.95s (237f) | subtle | ease-out (fast in, settles) | centre-mid |
| 7 | 688–711 | 11.47s | 0.40s (24f) | medium | ease-out (fast in, settles) | centre-top |
| 8 | 712–1273 | 11.87s | 9.37s (562f) | medium | ease-out (fast in, settles) | centre-mid |
| 9 | 1274–1281 | 21.23s | 0.13s (8f) | medium | ease-out (fast in, settles) | centre-mid |
| 10 | 1282–1739 | 21.37s | 7.63s (458f) | subtle | ease-out (fast in, settles) | centre-bottom |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 481–503  (8.02s–8.38s, 0.37s)
- frames 630–666  (10.50s–11.10s, 0.60s)
- frames 734–772  (12.23s–12.87s, 0.63s)
- frames 1214–1236  (20.23s–20.60s, 0.37s)
- frames 1308–1360  (21.80s–22.67s, 0.87s)
- frames 1555–1739  (25.92s–28.98s, 3.07s)

## Brightness

```
█▇▇▇▇▇▇▇▇▇▇▇▇▅▅▅▅▆▆▄▇▇▇▇▆▄▄██▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▄▄▅███████████████████
```
min 80 max 233 — light-dominant

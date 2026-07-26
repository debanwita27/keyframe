# evanplace_B_figured-out-how-to-do-it-in-figma-thanks-f

`evanplace_B_figured-out-how-to-do-it-in-figma-thanks-f.mp4` · 720x720 (square) · 6.0s · 30.0fps · 180 frames

## Palette (screen share %)

#787878 52.0%  #609018 11.6%  #304800 11.4%  #609030 4.9%  #304818 4.1%  #789060 3.4%  #306000 2.2%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 3 frames)

```
▁▂▂▂▃▃▃▄▄▆▆▆▆▆▆▆▆▆▆▇▆▆▆▆▆▆▆▆▅█▅▅▅▅▅▄▄▅▅▅▅▄▅▅▅▅▅▆▆▇▆▆▆▆▆▅▅▅▄▄
```

peak 1.3 · mean 0.7

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▂▂▃▃▄▄▅▆▇▇████▇▇▇▇███▇▆▇▆▆▆▆▆▆▆▆▅▅▅▄▄▄▅▅▅▅▅▅▅▆▆▆▇▇▇▇▇▆▆▅▅▅▅
```
mean 2.1

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▁▃▄▅▅▅▇▇████▇▇▇▇▇▇▆▅▆▇▇▆▆▅▆▆▅▅▅▄▄▃▃▄▃▃▃▃▃▃▃▃▄▅▆▆▆▆▅▅▅▅▄▄▃▃▃▃
```
mean 15.2 · frames frozen on ALL THREE scales: 3/179

## Shots (1 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–179 | 0.00s | 6.00s (180f) | subtle | linear/constant velocity | right-top |

## Brightness

```
████████████████████████████████████████████████████████████
```
min 122 max 127 — mid

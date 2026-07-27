# lens-launch

`lens-launch.mp4` · 1920x1080 (horizontal) · 43.4s · 30.0fps · 1302 frames

## Palette (screen share %)

#F0D8D8 36.3%  #F0F0F0 22.8%  #D8D8D8 21.6%  #F0F0D8 10.7%  #C0C0C0 6.9%  #D8F0D8 1.0%  #D8C0C0 0.5%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 19 frames)

```
▁▂▂▁▁▂▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▆▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```

peak 206.9 · mean 1.1

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▂▂▁▁▂▂▁▂▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▇▁▁▁▁▁▆▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```
mean 5.5

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▅▄▄▂▃▅▃▂▃▃▃▃▄▂▁▄▁▁▁▁▁▁▄▂▂▁▁▃▃▂▁▃▁▁▂▁▁▂▃▂▃▂██▁▂▂▁▁█▁▁▄▄▂▂▁▁▂▃▃▃▁▃▁▃▁▂▂
```
mean 24.0 · frames frozen on ALL THREE scales: 12/1301

## Shots (3 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–811 | 0.00s | 27.07s (812f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 2 | 812–940 | 27.07s | 4.30s (129f) | subtle | ease-out (fast in, settles) | centre-mid |
| 3 | 941–1301 | 31.37s | 12.03s (361f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |

## Brightness

```
███▇▇▇▇▇█▇▇██▇▇▇▇▇▇▇▇▇█████████████████▇▇▇▇▃▃▃▃▃▃▇▇▇█████████▇▇██▇▇▇▇
```
min 27 max 254 — light-dominant

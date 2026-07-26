# jittervideo_B_small-but-mighty-letter-spacing-animations

`jittervideo_B_small-but-mighty-letter-spacing-animations.mp4` · 720x900 (vertical) · 4.0s · 60.0fps · 240 frames

## Palette (screen share %)

#0000F0 87.5%  #0000A8 5.4%  #6060C0 4.7%  #6048C0 2.4%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 4 frames)

```
▅▆▅▇▇▆▅▄▄▄▄▄▅▇█▇▇▅▄▄▄▄▄▄▄▄▄▄▄▄▆▇▆█▇▅▅▄▄▄▄▅▅▆█▇▆▅▄▄▄▄▃▃▃▃▃▃▃▃
```

peak 8.3 · mean 4.1

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▅▇▇███████▇▇▇█████▇▇▇▇▇▇▇▇▇▇▇▇▇██████▇▇▇▇▇▇▇███▇▇▇▇▇▇▇▇▇▆▆▆▇
```
mean 15.0

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▆▇▇▇▇▇▇▇███████▇▇▇▇▇▇▇▇▇▇▇▇█▇▇▇▇
```
mean 57.3 · frames frozen on ALL THREE scales: 0/239

## Shots (1 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–239 | 0.00s | 4.00s (240f) | medium | ease-out (fast in, settles) | centre-mid |

## Brightness

```
████████████████████████████████████████████████████████████
```
min 40 max 42 — dark-dominant

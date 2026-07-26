# jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge

`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge.mp4` · 1152x720 (horizontal) · 10.5s · 60.0fps · 630 frames

## Palette (screen share %)

#D8D8F0 46.3%  #000000 30.1%  #F0F0F0 7.9%  #A8A8A8 3.2%  #D8D8D8 2.9%  #A89090 2.1%  #181818 1.9%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 9 frames)

```
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁
```

peak 221.8 · mean 1.0

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██▁▁▁▁▁▁▁▁▂▂▁▁▁▁▁▁▁▁▁▁
```
mean 6.2

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▂▄▄▃▃▂▂▁▄▄▄▃▂▂▃▃▃▂▂▂▁▁▁▂▂▂▂▂▂▃▃▃▃▂▁▂▂▂▂▁▁▁▁▁▁▁▂▂██▂▂▂▁▂▂▂▁▆▆▂▁▁▁▁▁▁▁▁▁
```
mean 30.6 · frames frozen on ALL THREE scales: 81/629

## Shots (2 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–438 | 0.00s | 7.32s (439f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 2 | 439–629 | 7.32s | 3.18s (191f) | subtle | ease-in-out (peak mid-shot) | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 187–206  (3.12s–3.43s, 0.32s)
- frames 570–629  (9.50s–10.48s, 0.98s)

## Brightness

```
█████▇▇▇▇▇▇▇▇████████████████████████▇▇▇▇▇▇▇▇▇▇▇█▁▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▂▂▂
```
min 3 max 245 — light-dominant

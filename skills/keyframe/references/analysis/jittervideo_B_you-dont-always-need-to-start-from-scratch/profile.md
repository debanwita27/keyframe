# jittervideo_B_you-dont-always-need-to-start-from-scratch

`jittervideo_B_you-dont-always-need-to-start-from-scratch.mp4` · 480x852 (vertical) · 67.699s · 30.0fps · 2030 frames

## Palette (screen share %)

#F0F0F0 34.0%  #D8D8F0 19.1%  #F0F0D8 3.7%  #D8D8D8 3.2%  #000018 3.2%  #F0D8F0 3.0%  #A890C0 3.0%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 29 frames)

```
▁▁▁▁▁▄▁▁▁█▂▂▂▂▄▁▁▃▁▁▃▁▂▁▂▁▁▁▁▂▄▂▁▁▁▃▂▂▁▂▃▂▃▃▁▄▂▂▁▂▁▂▂▁▁▂▁▁▁▂▂▂▃▁▁▁▃▁▁▁
```

peak 170.0 · mean 4.0

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▂▁▁▁▁▄▂▁▁██▂▂▃▄▂▁▃▂▁▃▂▃▁▃▂▁▁▂▂▅▅▁▁▂▅▂▂▂▂▄▅▄▄▃▄▃▃▁▃▂▄▃▂▂▃▂▂▁▃▃▄▅▂▁▁▆▂▁▁
```
mean 17.1

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▃▂▂▂▂▄▄▃▂██▅▄██▄▄▆▅▄█▆▇▃▆▅▂▃▃▇██▃▂▄█▄▅▅▆▇▇▇█▆▇▇▇▅▇▄██▅▄█▅▆▁▆▆▇█▆▃▁█▅▃▂
```
mean 74.2 · frames frozen on ALL THREE scales: 21/2029

## Shots (22 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–163 | 0.00s | 5.47s (164f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 2 | 164–283 | 5.47s | 4.00s (120f) | subtle | ease-out (fast in, settles) | centre-mid |
| 3 | 284–369 | 9.47s | 2.87s (86f) | subtle | ease-in-out (peak mid-shot) | centre-mid |
| 4 | 370–394 | 12.33s | 0.83s (25f) | medium | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 5 | 395–418 | 13.17s | 0.80s (24f) | hot | ease-out (fast in, settles) | centre-mid |
| 6 | 419–423 | 13.97s | 0.17s (5f) | hot | linear/constant velocity | centre-bottom |
| 7 | 424–508 | 14.13s | 2.83s (85f) | medium | ease-in (builds, exits fast) + overshoot/settle bounce | centre-bottom |
| 8 | 509–594 | 16.97s | 2.87s (86f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-bottom |
| 9 | 595–897 | 19.83s | 10.10s (303f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 10 | 898–901 | 29.93s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-top |
| 11 | 902–1020 | 30.07s | 3.97s (119f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 12 | 1021–1186 | 34.03s | 5.53s (166f) | subtle | ease-out (fast in, settles) | centre-mid |
| 13 | 1187–1224 | 39.57s | 1.27s (38f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 14 | 1225–1258 | 40.83s | 1.13s (34f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 15 | 1259–1263 | 41.97s | 0.17s (5f) | hot | linear/constant velocity | centre-mid |
| 16 | 1264–1309 | 42.13s | 1.53s (46f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 17 | 1310–1359 | 43.67s | 1.67s (50f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 18 | 1360–1797 | 45.33s | 14.60s (438f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 19 | 1798–1801 | 59.93s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-top |
| 20 | 1802–1923 | 60.07s | 4.07s (122f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 21 | 1924–1927 | 64.13s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 22 | 1928–2029 | 64.27s | 3.40s (102f) | subtle | ease-out (fast in, settles) | centre-mid |

## Brightness

```
▃▃▃▃▃▃▂▂▂▇▇█▇▇▇▇▇▇▇▇█▇█▇█████▇▇▆▆▆▆▇▇▇▇▇█▆▆▆▆▇██▇█▇▇▇▇▇▇▆▆▆▆▆▅▇▇▇▇▇▅▅▅
```
min 27 max 247 — light-dominant

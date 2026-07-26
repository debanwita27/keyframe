# jittervideo_B_recreating-this-fifa-logo-animation-took-j

`jittervideo_B_recreating-this-fifa-logo-animation-took-j.mp4` · 480x852 (vertical) · 52.699s · 30.0fps · 1580 frames

## Palette (screen share %)

#F0F0F0 16.2%  #D8D8F0 14.2%  #000000 11.1%  #181830 9.1%  #181818 6.1%  #7890D8 3.3%  #7848D8 2.9%

## Motion magnitude over time
(mean abs luma delta per frame, 0=frozen; each char = 22 frames)

```
▁▅▃▁▃█▂▁▁▁▁▂▂▁▃▂▂▂▁▁▃▁▂▃▂▂▂▁▂▁▄▂▁▁▁▁▁▁▁▁▁▁▂▇▂▃▂▂▂▃▁▄▅▄▃▁▁▁▁▁▁▁▁▁▄▃▃▂▂▃▃▁
```

peak 139.4 · mean 5.7

## Motion over an 8-frame window
(catches slow ambient drift that a per-frame delta misses)

```
▂▅▄▂▃█▄▂▁▁▁▄▅▂▆▄▃▄▂▂▄▄▂█▇▃▅▁▂▂▇▆▁▁▁▁▁▁▁▁▁▁▃▇▄▄▄▂▃▅▄▄▆▅▅▁▁▁▁▁▁▁▁▁▆▅▃▄▄▄▅▃
```
mean 20.7

## Loudest 8x8 tile per frame
(catches motion confined to a small region, e.g. text typing)

```
▃▆▆▃▄█▇▃▁▁▁██▃▆█▅▆▂▃▆▇▄██▅█▂▅▅██▂▂▂▂▂▂▂▂▂▂▆█▇▆▆▅▆▆▅▅▇▆▆▂▂▂▁▂▁▂▂▂▇▇▆▆▅▅▇▄
```
mean 68.8 · frames frozen on ALL THREE scales: 133/1579

## Shots (44 cuts detected @ delta > 26.0)

| # | frames | t | dur | energy | velocity profile | motion centre |
|---|--------|---|-----|--------|------------------|---------------|
| 1 | 0–34 | 0.00s | 1.17s (35f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-bottom |
| 2 | 35–40 | 1.17s | 0.20s (6f) | medium | ease-out (fast in, settles) | centre-bottom |
| 3 | 41–45 | 1.37s | 0.17s (5f) | hot | linear/constant velocity | centre-top |
| 4 | 46–49 | 1.53s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-top |
| 5 | 50–106 | 1.67s | 1.90s (57f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-top |
| 6 | 107–112 | 3.57s | 0.20s (6f) | hot | linear/constant velocity | centre-top |
| 7 | 113–124 | 3.77s | 0.40s (12f) | hot | ease-out (fast in, settles) | centre-top |
| 8 | 125–315 | 4.17s | 6.37s (191f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-top |
| 9 | 316–453 | 10.53s | 4.60s (138f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 10 | 454–519 | 15.13s | 2.20s (66f) | medium | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 11 | 520–523 | 17.33s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 12 | 524–571 | 17.47s | 1.60s (48f) | subtle | ease-out (fast in, settles) + overshoot/settle bounce | centre-top |
| 13 | 572–634 | 19.07s | 2.10s (63f) | subtle | ease-out (fast in, settles) | left-mid |
| 14 | 635–666 | 21.17s | 1.07s (32f) | medium | ease-in (builds, exits fast) + overshoot/settle bounce | left-mid |
| 15 | 667–670 | 22.23s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 16 | 671–674 | 22.37s | 0.13s (4f) | hot | linear/constant velocity | centre-mid |
| 17 | 675–678 | 22.50s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-mid |
| 18 | 679–690 | 22.63s | 0.40s (12f) | hot | ease-out (fast in, settles) | centre-mid |
| 19 | 691–951 | 23.03s | 8.70s (261f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 20 | 952–1006 | 31.73s | 1.83s (55f) | hot | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 21 | 1007–1011 | 33.57s | 0.17s (5f) | hot | linear/constant velocity | right-top |
| 22 | 1012–1086 | 33.73s | 2.50s (75f) | medium | ease-in (builds, exits fast) + overshoot/settle bounce | centre-mid |
| 23 | 1087–1090 | 36.23s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 24 | 1091–1140 | 36.37s | 1.67s (50f) | subtle | ease-out (fast in, settles) | centre-mid |
| 25 | 1141–1146 | 38.03s | 0.20s (6f) | local | small-region motion only (text/counter) — no macro event | left-bottom |
| 26 | 1147–1150 | 38.23s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-top |
| 27 | 1151–1154 | 38.37s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-mid |
| 28 | 1155–1174 | 38.50s | 0.67s (20f) | hot | ease-out (fast in, settles) + overshoot/settle bounce | centre-mid |
| 29 | 1175–1178 | 39.17s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-mid |
| 30 | 1179–1182 | 39.30s | 0.13s (4f) | hot | linear/constant velocity | centre-mid |
| 31 | 1183–1186 | 39.43s | 0.13s (4f) | hot | ease-out (fast in, settles) | left-mid |
| 32 | 1187–1200 | 39.57s | 0.47s (14f) | hot | ease-out (fast in, settles) | left-mid |
| 33 | 1201–1420 | 40.03s | 7.33s (220f) | subtle | ease-in (builds, exits fast) + overshoot/settle bounce | centre-bottom |
| 34 | 1421–1424 | 47.37s | 0.13s (4f) | hot | ease-in (builds, exits fast) | left-mid |
| 35 | 1425–1428 | 47.50s | 0.13s (4f) | hot | linear/constant velocity | centre-top |
| 36 | 1429–1432 | 47.63s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-top |
| 37 | 1433–1437 | 47.77s | 0.17s (5f) | hot | linear/constant velocity | left-top |
| 38 | 1438–1456 | 47.93s | 0.63s (19f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | left-mid |
| 39 | 1457–1518 | 48.57s | 2.07s (62f) | medium | ease-out (fast in, settles) | centre-mid |
| 40 | 1519–1522 | 50.63s | 0.13s (4f) | hot | ease-in (builds, exits fast) | centre-top |
| 41 | 1523–1526 | 50.77s | 0.13s (4f) | hot | ease-out (fast in, settles) | centre-top |
| 42 | 1527–1545 | 50.90s | 0.63s (19f) | medium | ease-out (fast in, settles) + overshoot/settle bounce | left-mid |
| 43 | 1546–1550 | 51.53s | 0.17s (5f) | hot | linear/constant velocity | centre-top |
| 44 | 1551–1579 | 51.70s | 0.97s (29f) | medium | ease-out (fast in, settles) | centre-mid |

## Frozen stretches (>0.33s with no movement on either scale) — BUGS

- frames 184–194  (6.13s–6.47s, 0.33s)
- frames 644–658  (21.47s–21.93s, 0.47s)
- frames 882–893  (29.40s–29.77s, 0.37s)
- frames 1277–1288  (42.57s–42.93s, 0.37s)

## Brightness

```
▄▄▄▄▄▇▇▅▅▅▅▆▇██▅▅▄▄▄▅▅▅▇▇▇▇▇▇▆▆▅▄▄▄▄▄▄▄▄▄▄▄▆▇▇███▇▆▆▇▆▅▅▅▅▅▅▅▅▅▅▆▆▇▆▆▇▇▆
```
min 57 max 223 — mid

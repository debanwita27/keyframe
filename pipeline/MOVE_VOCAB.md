# Move vocabulary (seed)

A **move** is one named, parameterised transformation applied to one target over a
frame range. Motion specs are written as compositions of moves — never as prose like
"it slides in nicely". All frame counts assume **30fps**. `f` = frames.

Reuse these names wherever they fit. If a reference does something not covered,
invent a new `camelCase` name and describe it under `new_moves:` in the spec.

## Easing names used throughout

| name | cubic-bezier / spring | feel |
|---|---|---|
| `expoOut` | `cubic-bezier(0.16, 1, 0.3, 1)` | default entrance. fast then glide |
| `expoIn` | `cubic-bezier(0.7, 0, 0.84, 0)` | default exit |
| `expoInOut` | `cubic-bezier(0.87, 0, 0.13, 1)` | transitions, camera pushes |
| `backOut` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | pops, badges, overshoot landings |
| `springSoft` | `spring({damping:200, mass:0.6, stiffness:100})` | UI cards, panels |
| `springSnap` | `spring({damping:14, mass:0.5, stiffness:180})` | icons, small elements, bounce |
| `linear` | — | **only** for continuous loops (rotation, marquee, drift) |

## Entrance moves

| move | params | description |
|---|---|---|
| `maskWipeUp` | `dur_f=16, ease=expoOut, per_line_stagger_f=3` | text revealed by an `overflow:hidden` box; inner content translates from `y=110%` to `0`. Per line, not per letter. The premium text reveal. |
| `maskWipeSide` | `dur_f=18, dir=l→r, ease=expoInOut` | clip-path inset sweep, content static underneath. Reads as "printing". |
| `staggerRise` | `y=28→0, opacity=0→1, blur=8→0, stagger_f=3, ease=springSoft` | list items / cards / chips. Blur only over first 60% of the move. |
| `scaleIn` | `scale=0.86→1, opacity=0→1, dur_f=14, ease=backOut` | cards, modals, thumbnails. |
| `popIn` | `scale=0→1.08→1, dur_f=11, ease=springSnap` | icons, cursors, badges, emoji. |
| `drawOn` | `strokeDashoffset=1→0, dur_f=24, ease=expoInOut` | SVG paths, underlines, connector lines, circles. |
| `counterUp` | `0→N, dur_f=30, ease=expoOut, monospace_digits=true` | metrics, prices, percentages. Never linear. |
| `typeOn` | `chars_per_f=1.4, caret=true, caret_blink_f=15` | terminal / prompt / chat input. Vary rate ±20% for human feel. |
| `letterCascade` | `per_char_stagger_f=1, y=18→0, rotate=6→0, ease=backOut` | one deliberate kinetic-type moment per video, max. |
| `unblurIn` | `blur=18→0, scale=1.04→1, dur_f=20, ease=expoOut` | logos, hero product shots, photos. |
| `slideStackIn` | `y=40→0 per layer, stagger_f=2, z_offset=8px` | stacked cards / paper / layered UI. |

## Exit moves
Exits run at **~60%** of the matching entrance duration.

| move | params |
|---|---|
| `maskWipeOut` | `dur_f=10, dir=up, ease=expoIn` |
| `scaleOut` | `scale=1→0.94, opacity=1→0, dur_f=9, ease=expoIn` |
| `flyOut` | `y=0→-60, opacity=1→0, stagger_f=2, ease=expoIn` |
| `dissolveBlur` | `blur=0→14, opacity=1→0, dur_f=12` |

## Continuous / ambient moves
At least one of these should be running in **every** shot so no frame is truly dead.

| move | params | description |
|---|---|---|
| `driftCamera` | `amp=1.5%, period_f=180, axes=xy` | slow sinusoidal pan/zoom of the whole comp. |
| `breathe` | `scale=1→1.015→1, period_f=120` | hero element idles. |
| `orbitRing` | `rotate=0→360, period_f=600, children_counter_rotate=true` | icons on a circle staying upright. |
| `marquee` | `x=0→-100%, period_f=300, ease=linear` | scrolling text band / logo strip. |
| `grainShift` | `noise_seed=frame, opacity=0.05` | animated film grain. Kills the "flat vector" look. |
| `gradientDrift` | `hue_rotate=±6deg, period_f=400` | background gradient slowly moves. |
| `parallaxLayers` | `depth=[0.2,0.5,1.0], amp=12px` | tie layer offset to camera drift. |

## Camera moves (applied to the whole composition)

| move | params |
|---|---|
| `pushIn` | `scale=1→1.06, dur_f=whole shot, ease=expoInOut` |
| `pullOut` | `scale=1.08→1` |
| `whipPan` | `x sweep, dur_f=6, motion_blur=heavy` — transition, not a reveal |
| `orbit3D` | `rotateY=-12→0, perspective=1200px, dur_f=40` |
| `dollyToUI` | `scale=1→2.4 + translate to focus point, ease=expoInOut, dur_f=36` — zoom into one UI detail |
| `rackFocus` | `blur front layer 0→10 while back layer 10→0, dur_f=18` |

## Transitions between shots

| move | params | when |
|---|---|---|
| `hardCut` | `0f` | default. Land on the beat grid. |
| `flashCut` | `white/accent frame for 2f` | energy spike, matches a peak in the motion curve |
| `maskTransition` | `expanding shape wipe, dur_f=14, ease=expoInOut` | scene change, same subject |
| `morphShape` | `SVG path interpolation, dur_f=20` | logo→icon, icon→UI |
| `matchCut` | `align a shape across the cut` | strongest transition. Circle→circle, rect→card. |
| `slidePush` | `outgoing x=0→-100%, incoming x=100%→0, dur_f=16, ease=expoInOut` | sequential steps |
| `zoomBlurCut` | `scale 1→1.3 + radial blur over 5f, then cut` | fast montage |

## Treatment layers (the "expensive" 15%)

| move | params |
|---|---|
| `bloomGlow` | `threshold=0.7, radius=18px, intensity=0.5` — on accent elements only |
| `chromaticEdge` | `±1.5px r/b split, strongest at frame edges` |
| `filmGrain` | `opacity=0.04-0.07, animated` |
| `vignette` | `0.12 falloff` |
| `motionTrail` | `3 echoes at 0.3/0.2/0.1 opacity, 2f apart` — fast-moving elements |
| `dropShadowSoft` | `0 18px 48px rgba(0,0,0,0.18)` — floating UI |
| `specularSweep` | `diagonal white gradient band crossing a surface, dur_f=24` — glass/metal |

## Timing law (non-negotiable)

- micro (icon pop, chip): **8–12f**
- element (card, line of text): **14–20f**
- scene (full layout settle): **24–36f**
- hero (logo lockup): **40–60f**
- min shot length **11f** (0.37s) — anything shorter is a flash, not a shot
- default shot length **24–45f**
- stagger **2–4f**. Above 6f reads as sluggish.
- overshoot **3–6%** on anything that lands
- hold **6–10f** after a settle before cutting, so the eye can read it

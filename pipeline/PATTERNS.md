# Pattern library (cross-corpus synthesis)

**Scope: all 47 references in `refs/specs/*.yaml`, five designers, 196 extracted
technique entries** — 183 that fall inside the 12 original families and 13 that
were flagged as unhoused (§1.13-1.15 and §6 resolve those 13).

Designer split: **byshubh 24, evanplace 10, jittervideo 5, mthblt 5, Kirschberg 3.**
Durations: median 9.9s, range 2.75s (`A_micro-elements-animations`) → 67.7s
(`jittervideo_B_you-dont-always-need-to-start-from-scratch`); 24 refs under 10s,
14 at 10-20s, 3 at 20-35s, 6 at 35s+.

Companion files, do not duplicate their jobs here:
- **`refs/specs/INDEX.md`** — per-reference visual quality (S=9, A=15, B=20, C=3)
  and "what to look at" guidance. §2's evidence weighting comes from it.
- **`pipeline/MOVE_VOCAB.md`** — canonical move names and `status` (34 family moves
  built, 73 spec-only). §2's built/spec-only column comes from it. Never invent a
  move name that already exists there.
- **`pipeline/PRINCIPLES.md`** — craft rules. Three proposed "families" were
  rejected into it (§6).

Every claim cites the spec `id` verbatim. This document supersedes the byshubh-only
version; **§4 and §5 explicitly flag the three places where the wider corpus
contradicts the old conclusions.**

---

## 1. Pattern families

15 families: the original 12 (revised counts, all now cross-designer) plus three
promoted in §6. **Cross-designer** = ≥3 designers use it independently, i.e. a safe
bet. **Thin** = ≤2 designers, i.e. possibly one house's habit.

| # | Family | Tech | Refs | Designers | Verdict |
|---|---|---|---|---|---|
| 1.1 | Shape/material continuity morph | 20 | 16 | all 5 | cross-designer, strongest |
| 1.2 | Assembly & shatter from parts | 15 | 15 | 4 (no jittervideo) | cross-designer |
| 1.3 | Progressive & substitutive text reveal | 15 | 14 | all 5 | cross-designer |
| 1.4 | Typeface/material-as-subject | 21 | 16 | 4 (no Kirschberg) | cross-designer |
| 1.5 | Shape-driven masking & non-rect reveals | 23 | 15 | all 5 | cross-designer |
| 1.6 | Camera-through-space / never-cutting take | 7 | 6 | 4 (no Kirschberg) | cross-designer, low count |
| 1.7 | Ambient motion under static holds | 25 | 20 | all 5 | cross-designer, largest |
| 1.8 | Synthetic UI interaction proof | 17 | 14 | 4 (no Kirschberg) | cross-designer |
| 1.9 | Radial/polar concrete-object placement | 8 | 8 | 4 (no evanplace) | cross-designer |
| 1.10 | Identical-container montage | 14 | 10 | all 5 | cross-designer |
| 1.11 | Loop bookending | 7 | 6 | 2 (byshubh 5, evanplace 2) | **thin** |
| 1.12 | Glitch/strobe/flash as transition disguise | 11 | 9 | 3 (byshubh 9 of 11) | byshubh-dominant |
| 1.13 | Scroll-as-camera (website reveal) | 5 | 4 | 2 (mthblt 4, evanplace 1) | **thin, new** |
| 1.14 | Live software feature demo | 3 | 2 | 1 (jittervideo) | **single-designer, new** |
| 1.15 | Real-plate device compositing | 3 | 3 | 2 (mthblt 2, byshubh 1) | **thin, new** |

### 1.1 Shape/material continuity morph (no-cut state change)
The same on-screen object changes state, material, or role by interpolating in
place — never by cutting to a new asset. **20 techniques / 16 refs / all 5
designers.** Slugs: `A_connect-to-figma-ui-anim`, `A_explainer-zhylar-crm-cpq`,
`A_how-to-dream-2d`, `A_not-your-average-ui-animation`, `B_chromatic-logo-2d3d`,
`B_logo-aim`, `B_logo-sage-library`, `B_logo-wip`,
`Kirschberg__A_absolutely-massive-effort-to-launch-this-c`,
`evanplace_A_making-an-effort-to-share-more-work-some-s`,
`evanplace_B_a-logo-animation-of-openais-logo`,
`evanplace_B_had-a-lot-of-fun-working-on-the-speaker-an`,
`evanplace_B_had-the-privilege-of-creating-the-speaker`,
`evanplace_B_sound-on-logo-animation-we-did-for-chatprd`,
`jittervideo_B_recreating-this-fifa-logo-animation-took-j`,
`mthblt_A_extremely-happy-to-see-this-website-coming`.

Strongest:
- **`logo-to-icon-morph`** (`A_connect-to-figma-ui-anim`, S) — one absolutely-positioned
  logo's `translate(x,y) scale(s)` interpolated from hero position to the exact pixel
  slot of the in-UI icon; `interpolate(frame,[93,119],…, bezier(0.87,0,0.13,1))`. No
  new asset mounts.
- **`collapse-to-a-point-rebuild-cycle` + `accent-shape-scale-match-cut`**
  (`evanplace_B_had-a-lot-of-fun…`, B) — icon group scales/fades to 0 while **one dot
  persists as the next beat's seed**; a persistent shape then scales ~14x into the
  next full-bleed layout. This is the corpus's cheapest repeatable no-cut chain and
  it is what makes a 20s piece survive on 0 real cuts.
- **`match-cut-lifestyle-to-studio-product`** (`mthblt_A_extremely-happy…`, A) — zoom
  both layers to a shared anchor point, swap layer opacity at peak zoom-blur. Works
  on real photography, not just vectors.
- **`bar-to-wordmark-morph`** (`Kirschberg__A_absolutely-massive…`, S) — flubber path
  interpolation from a progress bar into the compound path of the word "BIG".

**Recipe:** pick one element that must survive the transition; drive every visual
property off a single `progress = interpolate(frame,[a,b],[0,1],{easing})`; cross-fade
any new adjacent layer in only after that element's own transform is visually
indistinguishable from the destination. If nothing can survive, leave **one dot**
alive and reseed from it. **Difficulty:** trivial-moderate (15 of 20 are moderate);
hard only for point-matched path morphs (`markToWordmarkMorph`, `bar-to-wordmark-morph`).
**3D:** only for chrome/extrusion (`logo-2d-to-3d-kaleido-transform`,
`orb-to-parachute-crate-transform`).

### 1.2 Assembly & shatter from constituent parts
A mark or scene is built from — or destroyed into — discrete pieces that individually
carry meaning. **15 techniques / 15 refs / 4 designers** (byshubh 5, evanplace 6,
Kirschberg 3, mthblt 1). Slugs incl. `B_logo-sage-library`, `B_logo-streetwear`,
`Kirschberg__A_absolutely-massive-effort-to-launch-this-c`,
`Kirschberg__A_new-site-designed-in-figma-built-in-cursor`,
`Kirschberg__B_yummy-yummy-most-slop-please`,
`evanplace_A_eventbrite-update-from-one-of-my-favorite`,
`evanplace_B_had-the-privilege-of-creating-the-speaker`,
`mthblt_B_the-team-put-in-so-much-work-and-effort-to`,
`A_micro-elements-animations`, `A_not-your-average-ui-animation`.

Strongest:
- **`fragment-shatter-reform`** (`B_logo-sage-library`, S) — a book shatters into ~10
  product-shaped fragments; secondaries fade, survivors converge on
  `spring({damping:14,mass:0.5,stiffness:180})` and flatten to 2D.
- **`shatter-burst`** (`Kirschberg__A_absolutely-massive…`, S) — 24 fragments fly on
  radial vectors and a **2-3f white flash masks the positional jump**. The flash is
  what makes an unrealistic shatter read as physical.
- **`grid-mosaic-billboard-reveal`** (`evanplace_A_eventbrite…`, A) — seeded off-grid
  tile origins spring into CSS grid slots, then the whole grid pulls back to reveal
  it was a billboard. Best "many assets become one artifact" beat in the corpus.
- **`primitive-by-primitive-icon-assembly`** (`evanplace_B_had-a-lot-of-fun…`, B) —
  ordered primitive array, `popIn` staggered 4-5f, grouped per icon: the trivial-cost
  version of the whole family.

**Recipe:** define N fragments as data (`{id,shape,targetX,targetY,rotate,entryFrame}`),
never hand-placed. Disperse with `springSoft` (damping 200/mass 0.6/stiffness 100),
converge with `springSnap` (damping 14/mass 0.5/stiffness 180). Put a 2-3f flash on
the frame of maximum positional discontinuity. **Difficulty:** trivial-moderate;
hard for particle-to-path convergence (`sparkle-particle-mark-convergence`,
`grid-mosaic-billboard-reveal`, `chip-exploded-layer-reveal`). **No 3D** — every
instance is DOM/SVG or CSS-3D.

### 1.3 Progressive & substitutive text reveal
A sentence arrives by construction (word-group build, suffix growth) or elimination
(slot-machine substitution), never as one block fading in. **15 techniques / 14 refs /
all 5 designers.** Slugs incl. `A_explainer-zhylar-crm-cpq`, `A_best-launch-reel-2026`,
`A_2d-animation-growth-hack`, `A_launch-video-wip-vertical`, `B_logo-holo`,
`B_trippy-abstract-type`, `Kirschberg__B_yummy-yummy-most-slop-please`,
`evanplace_A_eventbrite-update-from-one-of-my-favorite`,
`jittervideo_A_introducing-superagents-remix-resize-trans`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`.

Strongest:
- **`word-cycle-slot-settle`** (`A_explainer-zhylar-crm-cpq`, A) — 3 columns cycle
  candidate strings every `swap_every_f=5` and lock left-to-right at
  `settle_stagger_f=5`. Independently re-derived by `A_best-launch-reel-2026`
  (single-slot) and `jittervideo_A_introducing-superagents…` (S).
- **`agent-status-line-swap`** (`Kirschberg__B_yummy…`, S) — fixed text slot, frame
  index into a 3-string array, crossfade+rise. The **launch-video-native** variant:
  the swapping text is the product's own status output, so substitution is diegetic.
- **`highlighter-chip-headline-build`** (`evanplace_A_eventbrite…`, A) — a
  measured-width block `scaleX 0→1` backOut behind each line; the emphasis, not the
  text, animates.
- **`sentence-build-word-append`** (`jittervideo_A_introducing-superagents…`, S) —
  `currentGroup=floor((frame-start)/durF)` over an array of word-groups.

**Recipe:** never animate a whole sentence's opacity. (a) `maskWipeUp` word-groups at
12-16f with 3-4f per-line stagger; (b) grow a substring on `dur_per_step_f≈5` steps;
(c) cycle N column arrays and stagger their settle frames. All pure array/frame-index
logic. **Difficulty:** trivial (12 of 15). **No 3D.**

### 1.4 Typeface / material-as-subject (re-skinning one fixed asset)
One locked asset is the subject; the animated variable is its material or face, not
its position. **21 techniques / 16 refs / 4 designers** (byshubh 12, jittervideo 4,
evanplace 3, mthblt 2). Slugs incl. `B_dynamic-typography-d3`, `B_galactic-motion-art`,
`B_trippy-abstract-type`, `B_editors-loop-3d-camera`, `B_logo-holo`,
`evanplace_A_eventbrite-update-from-one-of-my-favorite`,
`evanplace_A_making-an-effort-to-share-more-work-some-s`,
`jittervideo_A_introducing-superagents-remix-resize-trans`,
`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge`,
`jittervideo_B_small-but-mighty-letter-spacing-animations`,
`mthblt_A_love-everything-about-this-website`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`.

Strongest:
- **`font-array-cycler` + `swap-blur-shear` + `edge-bleed-crop`**
  (`B_dynamic-typography-d3`, A) — one word, ~35-40 swaps through a 10-12-face array
  on a 4-10f interval, disguised by horizontal-only blur + `skewX` peaking at the 50%
  crossfade; expanded faces clip both frame edges deliberately.
- **`self-demonstrating-preset-names`** (`mthblt_B_jitter-2024…`, A) — one component;
  an `effect` prop swaps the transform/filter applied **to its own name**
  ("Swoosh"/"Pop"/"Blur"). Converts a feature list into visual proof at zero asset cost.
- **`processing-desaturation-pulse`** (`jittervideo_A_new-this-week…`, A) — a single
  3-keyframe `filter: saturate()+brightness()` dip **replaces a spinner asset
  entirely** for the "system is working" beat.
- **`mask-is-the-logo-content-fill`** (`evanplace_A_eventbrite…`, A) — a constant
  `mask-image` of the mark with any swappable photo/gradient underneath.

**Recipe:** build the asset once; index a variant array with
`Math.floor(frame/interval) % variants.length` (`treatmentStutterSwap`, hard, no
easing — absence of easing IS the effect) or crossfade two stacked variants
(`treatmentCrossfadeSwap`). Use an **irregular seeded** interval (`glitchMaterialMorph`,
4-7f) when it should read as instability rather than rhythm. **Difficulty:** trivial
for the swap, moderate to produce variant layers. **3D only** for
`displacement-style-picker-grid` (feDisplacementMap/WebGL).

### 1.5 Shape-driven masking & non-rectangular reveals
A reveal driven by a mask whose *shape* is animated. Now the second-largest family
and the biggest growth area of the wider corpus. **23 techniques / 15 refs / all 5
designers** (mthblt 8, jittervideo 5, byshubh 4, Kirschberg 3, evanplace 3). Slugs
incl. `B_editors-loop-3d-camera`, `B_galactic-motion-art`,
`Kirschberg__A_absolutely-massive-effort-to-launch-this-c`,
`Kirschberg__A_new-site-designed-in-figma-built-in-cursor`,
`evanplace_B_figured-out-how-to-do-it-in-figma-thanks-f`,
`evanplace_B_the-latest-chapter-ive-joined-weareoffmenu`,
`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge`,
`jittervideo_B_you-dont-always-need-to-start-from-scratch`,
`mthblt_A_extremely-happy-to-see-this-website-coming`,
`mthblt_B_after-an-amazing-4-years-at-apple-im-happy`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`.

Strongest:
- **`icon-shape-mask-scale-transition`** (`mthblt_B_after-an-amazing-4-years…`, B) /
  **`logo-glyph-portal-mask`** (`Kirschberg__A_absolutely-massive…`, S) — an SVG icon
  or glyph scales `1→40-60x` around its own centre and its fill becomes the next
  scene's background; the whole wipe hides inside the mask. **Two designers arrive at
  this independently** — the single best chapter-change device in the corpus.
- **`iris-mask-transition-with-preview-rings`** (`mthblt_A_extremely-happy…`, A) — a
  circular `clip-path` radius grows, but SVG preview rings locked to the same `R`
  telegraph it 20f early, so the transition reads as intentional, not sudden.
- **`noise-masked-pixel-dissolve-reveal`** + **`dithering-duotone-halftone-reveal`**
  (`jittervideo_B_you-dont-always…`, B) — per-block noise-field or 8x8 Bayer-matrix
  threshold test where `pixelSize` and `threshold` both animate. INDEX flags these as
  the one genuinely stealable thing in a C-adjacent talking-head runtime.
- **`irregular-polygon-shape-wipe` / `venetian-blind-strip-reveal` / `bubble-pop-reveal`**
  (`mthblt_B_jitter-2024…`, A) — a family of cheap `clip-path` variants; in that ref
  **every one of 43 transitions is a genuine shape mask**, no crossfades at all.
- **`shape-morph-collapse-chain`** (`B_editors-loop-3d-camera`, S) — nested squares →
  rings → eye iris → ribbon plane, point-matched paths via `flubber`, colour stops
  crossfading on the same progress value.

**Recipe:** author stages as SVG paths with equal point counts (or generate with
`flubber`); drive interpolated `d` as `<clipPath>`/`<mask>` via `clip-path: url(#id)`.
For a chapter change, prefer scaling **one glyph from the brand** past frame bounds
over any generic wipe. **Difficulty:** trivial (circle/inset/blob) → hard
(`cornerPeelWipe`, `logo-glyph-portal-mask`, multi-stage morph normalisation).
**No 3D** except tunnel-recession variants (family 1.6).

### 1.6 Camera-through-space / continuous never-cutting take
The piece is one unbroken camera take; apparent scene changes are flashes, morphs or
re-skins on continuous motion. **7 techniques / 6 refs / 4 designers**:
`B_editors-loop-3d-camera` (S), `A_sparkle-vertical` (C),
`evanplace_A_making-an-effort-to-share-more-work-some-s` (B),
`evanplace_B_had-the-privilege-of-creating-the-speaker` (B),
`jittervideo_B_small-but-mighty-letter-spacing-animations` (B),
`mthblt_A_love-everything-about-this-website` (S).

Note the split: the *structural property* "≤1 hard cut" holds for 18 of 47 refs
(§4), but the *technique* of an actual moving camera through built geometry appears
in only 6. Most continuous-take refs achieve it with a **locked** camera and family
1.1/1.4 state changes instead — that is the cheap route.

Strongest:
- **`single-continuous-factory-build`** (`evanplace_B_had-the-privilege…`, B) — one
  locked camera, `buildStage` indexed off an array of stage-start frames, **a new
  mechanical event every 24-40f for 276f**. Cheapest known way to hold 20s uncut.
- **`grid-cell-to-fullbleed-dolly`** (`evanplace_A_making-an-effort…`, B) — one
  wrapper `scale+translate` pinned to a cell centre, `expoIn` to ~2.2x, **hiding 4
  real hard cuts inside the zoom**.
- **`ring-aperture-flythrough`** (`mthblt_A_love-everything…`, S) — literal 3D torus,
  camera `translateZ` through its hole.
- **`floor-flyover-camera`** (`B_editors-loop-3d-camera`, S) — CSS-3D `preserve-3d`
  grid, group `rotateX 0→78deg` + `translateZ` dolly. No WebGL.

**Recipe:** one Sequence, one progress driver; manufacture "cuts" as
flash/glitch/morph/palette-swap (families 1.1, 1.4, 1.12, 1.5). Vary *what the camera
is looking at* every 20-90f rather than varying cut rate. If you cannot afford a
camera, lock it and run a staged-event array instead. **Difficulty:** moderate;
**needs 3D** for `dollyThrough`/`portalDive`/`ringApertureFlythrough`; CSS-3D suffices
for `floorFlyover`, `perspective-type-wall-tunnel`, `nested-square-kaleido-tunnel`.

### 1.7 Ambient perpetual motion under static holds
Frame-derived, never-settling motion that runs *during* a hold so it never reads as a
freeze. **Largest family: 25 techniques / 20 refs / all 5 designers.** 20 of 25 are
`trivial`. Slugs incl. `A_micro-elements-animations`, `A_not-your-average-ui-animation`,
`B_galactic-motion-art`, `B_logo-sage-library`, `B_logo-streetwear`,
`Kirschberg__A_absolutely-massive-effort-to-launch-this-c`,
`Kirschberg__B_yummy-yummy-most-slop-please`,
`evanplace_A_8-the-trailers-a-one-stop-site-for-all-you`,
`evanplace_B_had-a-lot-of-fun-working-on-the-speaker-an`,
`evanplace_B_the-latest-chapter-ive-joined-weareoffmenu`,
`jittervideo_B_you-dont-always-need-to-start-from-scratch`,
`mthblt_A_extremely-happy-to-see-this-website-coming`,
`mthblt_B_the-team-put-in-so-much-work-and-effort-to`.

Strongest:
- **`frosted-glass-hero-locked-chrome`** (`evanplace_A_8-the-trailers…`, B) — a
  blurred autoplaying `OffthreadVideo` behind sharp static UI chrome supplies **all**
  ambient motion for free, with no shared transform. Highest payoff-per-line in the
  family.
- **`irregular-counter-with-camera-zoom-climax`** (`Kirschberg__A_absolutely-massive…`,
  S) — counter value AND camera dolly scale both driven off one shared progress `p`,
  so the number climbing *is* the climax rather than decoration.
- **`live-ticking-template-grid`** (`jittervideo_B_you-dont-always…`, B) — every grid
  tile counts on its **own** `durF` so the clocks visibly desync; the desync is what
  makes a grid of mocks read as live software.
- **`content-driven-idle-instead-of-camera-drift`** (`mthblt_A_extremely-happy…`, A) —
  one diegetic LED sine loop instead of whole-frame drift. Cross-designer with
  `growing-radial-halo` (`A_not-your-average-ui-animation`, A), whose glow scale is
  driven by `cardsRevealed/total`, not a timer.
- **`decelerating-multiplier-counter`** (`Kirschberg__B_yummy…`, S) — snap an integer
  to a keyframed value array indexed through an `expoOut` curve. Never a smooth tween.

**Recipe:** for any hold ≥30f attach at least one pure `f(frame)` with no landing
point. Prefer **content-tied** drivers (`revealed/total`, a diegetic LED, an
autoplaying video) over whole-frame drift. Give each item in a swarm its own period
and phase seed. **Deliberate exception:** `dead-hold-as-confidence`
(`B_logo-streetwear`), `static-end-hold` (`B_logo-sage-library`),
`long-dwell-title-card-close` (`evanplace_B_had-a-lot-of-fun…`, ~200f frozen) run
zero ambient motion — reserved for a true end-card only. **Documented failure:**
`content-driven-vignette-pulse-through-a-long-hold`
(`evanplace_B_the-latest-chapter…`) stops its pulse at f258 and leaves 131f frozen
mid-video; its own spec calls this a bug. **Difficulty:** trivial. **No 3D.**

### 1.8 Synthetic UI interaction proof
A fake cursor, marquee, drag or causally-timed state change that reads as "a real
interaction happened." **17 techniques / 14 refs / 4 designers** (byshubh 7,
jittervideo 5, mthblt 4, evanplace 1). Slugs incl. `A_connect-to-figma-ui-anim`,
`B_editors-loop-3d-camera`, `A_recent-motion-4k-vertical`,
`jittervideo_A_introducing-superagents-remix-resize-trans`,
`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge`,
`jittervideo_B_you-dont-always-need-to-start-from-scratch`,
`mthblt_A_love-everything-about-this-website`,
`mthblt_B_after-an-amazing-4-years-at-apple-im-happy`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`,
`mthblt_B_the-team-put-in-so-much-work-and-effort-to`.

Strongest:
- **`cursor-choreo-click`** (`A_connect-to-figma-ui-anim`, S) — one `click_at_f`
  constant drives both the cursor scale-pulse and the button's label/colour flip.
- **`multiplayer-cursor-name-tags`** (`jittervideo_A_introducing-superagents…`, S) —
  cursor + offset pill label + `springSnap` pulse on click. The name tag is what sells
  "a real person," at trivial cost.
- **`cursor-driven-parameter-scrub`** (`jittervideo_B_you-dont-always…`, B) and
  **`keyframe-marker-percent-sync`** (`mthblt_B_jitter-2024…`, A) — cursor position
  and the bound numeric value share one interpolation driver, so a drag can never
  disagree with its readout. This is the generalisation of the `click_at_f` rule to
  continuous gestures.
- **`drag-drop-file-tumble`** (`jittervideo_A_new-this-week…`, A) — one spring drives
  translate **and** rotate together, dissolving on arrival.
- **`raked-3d-linked-action-timeline`** (`jittervideo_B_you-dont-always…`, B) —
  perspective `rotateX` tilt-flatten while linked rows share one opacity ramp.

**Recipe:** derive the interaction's animation and its consequence from one shared
frame constant (discrete) or one shared interpolation driver (continuous). One
interaction per shot. Add a name pill if you want "a person," not "a demo."
**Difficulty:** trivial (9 of 17) to moderate. **3D only** for `device-within-device-orbit`.

### 1.9 Radial/polar concrete-object placement
N related objects at fixed polar coordinates around a shared centre; the arrangement
carries the meaning. **8 techniques / 8 refs / 4 designers** (byshubh 4, Kirschberg 2,
jittervideo 1, mthblt 1). Slugs: `A_shipping-8-launch-videos`,
`A_motion-explainer-snippet`, `A_launch-video-wip-vertical`, `B_galactic-motion-art`,
`Kirschberg__A_new-site-designed-in-figma-built-in-cursor`,
`Kirschberg__B_yummy-yummy-most-slop-please`,
`jittervideo_A_introducing-superagents-remix-resize-trans`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`.

Strongest:
- **`orbit-burst-to-chat-bullet`** (`Kirschberg__B_yummy…`, S) — 24 nodes at polar
  coords with progress-driven radius that **retract to a single dot as a match-cut**
  into the next beat. The launch-video-grade version: the burst has an exit.
- **`heart-shape-cluster-formation`** (`Kirschberg__A_new-site…`, B) — FLIP transform,
  tiles travel to points sampled along a parametric curve. Generalises polar
  placement to **any** parametric path, not just circles.
- **`radial-question-bubbles`** (`A_shipping-8-launch-videos`, A) — 3 bubbles at
  `angles_deg=[200,260,320]` reading as "pressure surrounding this person."
- **`diagonal-cascade-array`** (`jittervideo_A_introducing-superagents…`, S) — the
  counter-example: index-driven x/y offset + scale falloff with a 2f stagger and **no
  polar coords at all**; cheaper and reads as depth rather than orbit.

**Recipe:** `x=cx+r·cos(θ), y=cy+r·sin(θ)` computed once per element from a fixed or
lightly-jittered angle array; never runtime physics. Stagger by angle order. Always
plan the **retraction** as well as the burst. **Difficulty:** trivial-moderate.
**3D only** for `wireframe-globe-orbit`.

### 1.10 Identical-container montage (match-cut by construction)
Every item in a multi-item showcase renders inside one identical container, so cuts
between unrelated content are match cuts for free. **14 techniques / 10 refs / all 5
designers.** Slugs: `A_showreel-snippet`, `A_best-launch-reel-2026`,
`A_shipping-8-launch-videos`, `A_2d-animation-growth-hack`,
`Kirschberg__A_new-site-designed-in-figma-built-in-cursor`,
`evanplace_A_eventbrite-update-from-one-of-my-favorite`,
`evanplace_A_making-an-effort-to-share-more-work-some-s`,
`jittervideo_A_introducing-superagents-remix-resize-trans`,
`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge`,
`mthblt_B_jitter-2024-powered-by-jittervideo-magic`.

Strongest:
- **`conveyor-matchcut-montage` + `settle-burst-settle-pacing`** (`A_showreel-snippet`,
  A) — 12 unrelated emails on one `<PhoneCard>`; the offset function alternates
  spring-to-rest "settle" and hard 3f-step "burst" segments from one
  `{type,dur_f}` array. 21 raw cuts read as one conveyor.
- **`grid-multiply-localization-reveal`** (`jittervideo_A_new-this-week…`, A) — the
  hero shrinks into a grid cell while other columns blur-to-sharp on a stagger and the
  row triplicates. The corpus's only real "one input → N outputs" proof beat.
- **`fixed-grid-tile-content-cycling`** (`Kirschberg__A_new-site…`, B) — fixed 4x4
  grid, hard image swap per cell on a staggered ~20f interval; sustains a **562-frame
  single shot** with zero cuts (see §4).
- **`swatch-conveyor-colour-catalogue`** (`evanplace_A_eventbrite…`, A) — flex row,
  `translateX = -frame*speed` in an `overflow:hidden` viewport. `conveyorSlide`
  `mode=continuous`.

**Recipe:** one fixed-shape container component; drive an array of N content objects
through it via `translateX = index*cardWidth - offset(frame)` or
`stepFunction(shotIndex)`. Adding an item is a one-line data change.
**Difficulty:** trivial-moderate (7/7 split). **No 3D.**

### 1.11 Loop bookending — **THIN (2 designers)**
Opening and closing states engineered to match so looped playback has no seam.
**7 techniques / 6 refs / byshubh 5 + evanplace 2**: `A_recent-motion-4k-vertical`,
`A_not-your-average-ui-animation`, `B_editors-loop-3d-camera`, `A_sparkle-vertical`,
`evanplace_B_a-logo-animation-of-openais-logo`,
`evanplace_B_had-the-privilege-of-creating-the-speaker`. Neither Kirschberg,
jittervideo nor mthblt bookend anything — **all three of those designers make pieces
that end, not loop.** Treat this family as a brand-loop specialism, not a launch-video
requirement.

Strongest:
- **`seamless-rackfocus-loop-bookend`** (`A_recent-motion-4k-vertical`, B) —
  `blur[18,0]`/`scale[1.04,1]` plays forward over 27f at open, mirrored over 16f at
  close. **`rackLoop` ships with a known bug: progress must be `t = frame % cycleLength_f`**
  (MOVE_VOCAB).
- **`cold-open-tease-then-rebuild`** (`evanplace_B_a-logo-animation-of-openais-logo`,
  B) — the identical component with identical props renders the finished lockup at
  both the open and close frames; the middle rebuilds it. Cheapest possible bookend.
- **`match-cut-object-to-background-star`** (`evanplace_B_had-the-privilege…`, B) — a
  dot's scale/saturate interpolate to match one specific star in a shared dataset.

**Recipe:** compute the opening state's exact terminal values; replay the identical
curve reversed at the end, or literally re-render the same component with the same
props. **Difficulty:** trivial. **No 3D.**

### 1.12 Glitch / strobe / flash as transition disguise — **byshubh-dominant (9 of 11)**
A hard visual event substitutes for a scene-change cut. **11 techniques / 9 refs / 3
designers**: `B_chromatic-logo-2d3d`, `B_logo-streetwear`, `B_logo-wip`,
`B_galactic-motion-art`, `B_trippy-abstract-type`, `A_motion-explainer-snippet`,
`B_logo-holo`, `evanplace_A_8-the-trailers-a-one-stop-site-for-all-you`,
`mthblt_B_the-team-put-in-so-much-work-and-effort-to`.

Strongest:
- **`bloom-invert-morph-transition`** (`B_chromatic-logo-2d3d`, S) — bloom → 2f
  whiteout → `filter: invert(1)` for 3f → path-morph, all on the *same* object.
- **`dip-to-black-text-before-image-reform`** (`evanplace_A_8-the-trailers…`, B) — a
  **51f black hold** with text `maskWipeUp` fast and background `unblurIn` slow on
  separate clocks. The only *slow* member of the family; proves the mechanism works
  as a breath, not just a punch.
- **`rapid-detail-flash-montage`** (`mthblt_B_the-team…`, B) — 3 static cards hard-cut
  at 7-8f each with no per-card entrance. Note g4: these sub-11f flash clusters recur
  across mthblt refs **always in groups of exactly 3** — a deliberate density device,
  not a detector artefact.
- **`strobe-restyle-transition`** (`B_logo-streetwear`, A) — `frame % 2` square-wave
  background for 6f while two logo layers crossfade underneath.

**Recipe:** never plain-crossfade a big state change; wrap it in a 1-6f
flash/invert/strobe/glitch timed to the highest-energy frame. Flash clusters come in
3s. **Difficulty:** trivial (flash/strobe) to moderate (seeded-noise datamosh).
**No 3D.**

### 1.13 Scroll-as-camera (website reveal) — **NEW, thin (2 designers)**
A website's scroll is presented in video by treating scroll progress as a camera
parameter — opacity/blur/scale/`clip-path` on pinned sections — rather than by
translating a long page. **5 techniques / 4 refs**:
`mthblt_A_extremely-happy-to-see-this-website-coming` (A),
`mthblt_A_love-everything-about-this-website` (S),
`mthblt_B_after-an-amazing-4-years-at-apple-im-happy` (B, 2 techniques),
`evanplace_A_web-design-for-momentum` (B). Promoted because the original 12 families
were derived from a corpus with **zero** website reveals, and MOVE_VOCAB explicitly
rejects `scrollLinkedCrossfade`/`scrollPinnedSwap`/`scrollCardRise`/`hudCardSlideIn`/
`bgVideoZoom` as "out of scope for families 1.4-1.6" — they currently have nowhere to
live. Thin: 4 of 5 techniques are mthblt.

Strongest:
- **`pinned-scroll-not-translate`** (`mthblt_A_extremely-happy…`, A) — real Apple
  AirPods page scroll is "almost entirely pinned crossfade/zoom, **not translateY**."
  The single most important finding in this family: do not animate page position.
- **`continuous-3d-world-as-scroll-analog`** (`mthblt_A_love-everything…`, S) — a
  camera state machine tours a WebGL world with a hard progress-cut + flash at each
  section boundary; scroll is replaced entirely.
- **`scroll-linked-imagery-crossfade` + `pinned-scroll-hero-swap`**
  (`mthblt_B_after-an-amazing-4-years…`, B) — stacked images opacity-crossfade at
  fixed checkpoints while chrome stays static; two layers translate off one shared
  progress value. Both `trivial`.
- **`section-cut-slideshow`** (`evanplace_A_web-design-for-momentum`, B) — the
  **degenerate variant**: 6 fully pre-built Sequences, zero scroll transform, hard
  cuts. INDEX rates its craft "none — literally a slideshow," but it is the honest
  zero-cost floor for this job and worth knowing as the fallback.

**Recipe:** build each section as its own Sequence at final layout. Do **not**
translate a tall page. Drive `opacity`/`blur`/`scale`/`clip-path` from one
`scrollProgress = interpolate(frame,[a,b],[0,1])` per section, keeping persistent
chrome (nav, header) on a separate untransformed layer. Put an
`icon-shape-mask-scale-transition` (1.5) at each chapter boundary. **Difficulty:**
trivial-moderate; **hard/3D only** for the WebGL-world variant. Fallback: hard-cut
slideshow.

### 1.14 Live software feature demo — **NEW, SINGLE-DESIGNER (jittervideo)**
The product is shown literally obeying a typed natural-language instruction: an
intermediate reasoning trace ("Thinking…", a step list, "Done — …") plays, then the
canvas's state change is bound to the exact frame the trace completes.
**3 techniques / 2 refs**: `jittervideo_A_introducing-superagents-remix-resize-trans`
(S, 2 techniques), `jittervideo_B_recreating-this-fifa-logo-animation-took-j` (C).
Two further jittervideo refs (`jittervideo_A_new-this-week…`,
`jittervideo_B_you-dont-always…`) demo real software but through family 1.8 moves
rather than a command-and-commit loop.

Promoted despite being one designer's, because: (a) no byshubh-era spec shows a tool
being *commanded* — only finished UI states, so this is a genuine structural gap in
the original 12; (b) INDEX ranks `jittervideo_A_introducing-superagents…` S-tier and
**#1 reference for both "text-heavy tool launch" and "visual product / UI feature
launch"** — the two most likely jobs for this library. Weight accordingly: high
relevance, low independent corroboration.

Strongest:
- **`ai-chat-canvas-morph`** (S) — dots interpolate between precomputed
  scatter/ring/bounce position arrays, keyed to the command's completion frame.
- **`magic-resize-live-reflow`** (S) — **one content model, N aspect-ratio artboards,
  all driven off a single shared frame counter.** A genuine multi-output state change,
  not an implied cut. Also the corpus's only partial answer to the multi-aspect gap
  (§5).
- **`ai-chat-build-as-narrative-device`** (C, `jittervideo_B_recreating-this-fifa…`) —
  staggered step-trace array + a commit pill keyed to the canvas-update frame.
  `trivial`. Do not view the frames (C-tier), take the mechanism.

**Recipe:** three phases on one clock — (1) `typeOn` the instruction; (2) a step-trace
list whose rows `staggerRise` in on a fixed interval; (3) at `commit_f`, the *same
frame* the last row lands, run the canvas's state change (a family 1.1 morph, a 1.4
material swap, or an N-artboard reflow). Never let the trace and the result drift
apart. Pair with `multiplayer-cursor-name-tags` (1.8) for authorship.
**Difficulty:** trivial-moderate. **3D only** for the shader-based style picker.

### 1.15 Real-plate device compositing — **NEW, thin (2 designers)**
Synthetic or captured screen content is registered into real photographed/filmed
hardware, with the screen layer and the plate on **separate, independent transforms**.
Cannot fold into 1.8, whose definition explicitly excludes "any actual recorded
screen capture." **3 techniques / 3 refs**: `A_launch-video-wip-vertical` (B),
`mthblt_B_after-an-amazing-4-years-at-apple-im-happy` (B),
`mthblt_B_the-team-put-in-so-much-work-and-effort-to` (B). The old file listed this as
a gap; with 3 instances across 2 designers it is a thin family instead.

Strongest:
- **`handheld-device-frame-spec-tabs`** (`mthblt_B_the-team…`, B) — screen content
  reframes on **its own** transform, independent of a slower handheld sway rig. The
  key rule: two clocks, never one.
- **`device-within-device-orbit`** (`mthblt_B_after-an-amazing-4-years…`, B) — a
  composited hand+iPad plate with an inner 3D render orbited on a frame-seeded jitter
  curve. `hard`.
- **`screen-record-of-screen-record`** (`A_launch-video-wip-vertical`, B) — CSS-3D
  transform + `clip-path` composites a render onto a photographed monitor plate.

**Recipe:** two layers, two clocks. Plate gets slow low-amplitude sway
(`driftCamera`-scale, amp ≤2%); screen content runs its own faster timeline; a
`clip-path` polygon matched to the screen's corners plus a CSS-3D `matrix3d` does the
registration. Add `filmGrain` over **both** to unify. **Difficulty:** moderate; hard
for orbiting inner renders. **No 3D** for the flat-plate case. **Caveat:** all three
sources are B-tier and INDEX warns `A_launch-video-wip-vertical` and
`A_recent-motion-4k-vertical` lose 60% of frame to bezel — the *technique* is sound,
the corpus's *executions* are the weakest-looking references in it.

---

## 2. Ranked table — top 30 techniques across all 47 refs

**Formula, explicit:** `score = (reusability × payoff × evidence_weight) ÷ build_cost`.
`reusability` = how many kinds of video it fits (1-5). `payoff` = the extract's
`payoff:` grade. `build_cost` = trivial 1 / moderate 2 / hard 3 / needs-3d 4.
`evidence_weight` from `refs/specs/INDEX.md` tier: **S 1.0, A 0.85, B 0.7, C 0.5**,
with a ×1.25 bonus if ≥2 designers arrive at it independently (§3). Cheap + universal
+ well-evidenced beats expensive + niche + single-source, even when the niche one
looks more impressive.

| # | Technique | Fam | Source spec | Tier | Diff | Status | Why it ranks here |
|---|---|---|---|---|---|---|---|
| 1 | `wordCycleSettle` | 1.3 | `A_explainer-zhylar-crm-cpq` | A | trivial | **built: WordCycle** | 3 arrays + a frame index, zero keyframes; **4 designers converge** (byshubh, jittervideo, evanplace, Kirschberg's `agent-status-line-swap`). Most-corroborated technique in the corpus. |
| 2 | `cursorTravelClick` + `stateSwap` | 1.8 | `A_connect-to-figma-ui-anim` + `jittervideo_A_introducing-superagents…` | S+S | trivial | **built: Cursor** (`stateSwap` spec-only) | One shared constant drives cause and effect; two S-tier sources, two designers. Cheapest possible "this is real software." Add the name pill from jittervideo for free authorship. |
| 3 | `iconMaskScale` (glyph mask scaled 40-60x) | 1.5 | `Kirschberg__A_absolutely-massive…` / `mthblt_B_after-an-amazing-4-years…` | S/B | moderate | spec-only | Two designers independently; replaces every chapter-change cut with a brand-owned transition. Highest new entrant. |
| 4 | `liveCounterTick` | 1.7 | `A_micro-elements-animations` | B | trivial | **built: LiveCounter** | Pure `f(frame)`, no landing point; the one-line fix for "static hold reads dead," usable under every hold in every video. Largest family. |
| 5 | `logoToIconMorph` | 1.1 | `A_connect-to-figma-ui-anim` | S | moderate | spec-only | Removes the single most common structural seam in launch videos (brand→product) for one `interpolate()` chain. S-tier, best-in-corpus per INDEX. |
| 6 | `agent-status-line-swap` (diegetic text slot) | 1.3 | `Kirschberg__B_yummy-yummy-most-slop-please` | S | trivial | spec-only (variant of `wordSwap`) | Same mechanism as #1 but the swapping text is the product's own output, so substitution is diegetic instead of decorative. S-tier, and INDEX calls this ref structurally closest to the target deliverable. |
| 7 | `frosted-glass-hero-locked-chrome` | 1.7 | `evanplace_A_8-the-trailers…` | B | trivial | spec-only (`bgVideoZoom` adj.) | A blurred autoplaying video behind static chrome supplies all ambient motion for free. Highest payoff-per-line in the corpus. |
| 8 | `processing-desaturation-pulse` | 1.4 | `jittervideo_A_new-this-week…` | A | trivial | spec-only | One 3-keyframe CSS filter dip replaces a spinner asset entirely for the universal "system is working" beat. |
| 9 | `conveyorSlide` (+ settle/burst segments) | 1.10 | `A_showreel-snippet` | A | moderate | **built: ConveyorSlide** | Turns any N-item showcase into a match-cut montage for one data array + one offset function; `mode=continuous` also covers `evanplace_A_eventbrite…`'s swatch conveyor. |
| 10 | `shatterDisperse` + `fragmentsConverge` (+3f flash) | 1.2 | `B_logo-sage-library` + `Kirschberg__A_absolutely-massive…` | S+S | moderate | **built: Fragments** | Two S-tier sources, two designers. Kirschberg adds the missing piece: a 2-3f white flash on the frame of maximum positional jump. |
| 11 | `toastConfirmationPop` | 1.8 | `A_explainer-zhylar-crm-cpq` | A | trivial | **built: ToastPop** | Universal "it worked" beat; one rationed off-palette hue buys trust legibly. Independently re-derived by `jittervideo_A_new-this-week…`. |
| 12 | `magic-resize-live-reflow` | 1.14 | `jittervideo_A_introducing-superagents…` | S | moderate | spec-only | One content model → N aspect-ratio artboards off one frame counter. S-tier, and the corpus's only real answer to a multi-output/multi-aspect claim. |
| 13 | `single-continuous-factory-build` (staged-event array) | 1.6 | `evanplace_B_had-the-privilege…` | B | moderate | spec-only | Holds a 276f shot with a locked camera and a new event every 24-40f. The cheapest known long-form mechanism (§4). |
| 14 | `fillToStroke` | 1.1/1.4 | `B_logo-wip` | C | trivial | **built: FillToStroke** | Two opacity tracks on identical geometry; reads as dematerialising. C-tier source, but INDEX explicitly cites it as proof tier ≠ technique quality. |
| 15 | `tileCycleGrid` (fixed grid, per-cell staggered swap) | 1.10 | `Kirschberg__A_new-site…` | B | trivial | spec-only | Sustains a 562-frame single shot with zero cuts by giving each cell its own ~20f clock. Pair with #21. |
| 16 | `self-demonstrating-preset-names` | 1.4 | `mthblt_B_jitter-2024…` | A | moderate | spec-only | The on-screen word performs its own effect — converts a feature list into visual proof with no new assets. Sustained across 43 cuts in the source. |
| 17 | `particleFieldConnector` | 1.10 | `A_best-launch-reel-2026` | A | trivial | **built: ParticleField** | Makes a compilation of unrelated clips read as one authored reel: same bg/type/motion regardless of foreground. |
| 18 | `treatmentStutterSwap` | 1.4 | `B_galactic-motion-art` | A | trivial | **built: HardSwap** | `floor(frame/step_f)*step_f` into pre-built states, zero easing. **3 designers** (also `evanplace_A_eventbrite…` `paletteCycle`, `mthblt_A_love-everything…` `poseCycleSwap`). |
| 19 | `grid-multiply-localization-reveal` | 1.10 | `jittervideo_A_new-this-week…` | A | moderate | spec-only (`gridMultiplyReveal`) | The corpus's only genuine "one input → N outputs" proof beat, which is the most common launch-video claim. |
| 20 | `pinned-scroll-not-translate` | 1.13 | `mthblt_A_extremely-happy…` | A | moderate | spec-only (`scrollPinnedSwap`) | Apple-grade website reveal, and it forbids the obvious wrong approach (animating page translateY). Only route to a site-launch video. |
| 21 | `live-ticking-template-grid` (desynced clocks) | 1.7 | `jittervideo_B_you-dont-always…` | B | trivial | spec-only | Per-tile `durF` so clocks visibly desync — the difference between "grid of mocks" and "live software," for one extra param. |
| 22 | `irregular-counter-with-camera-zoom-climax` | 1.7 | `Kirschberg__A_absolutely-massive…` | S | moderate | spec-only (`counterUp`+`pushIn`) | Counter and camera dolly share one progress `p`, so the number climbing *is* the climax. S-tier long-form piece. |
| 23 | `fontSwapBlur` | 1.4 | `B_dynamic-typography-d3` | A | trivial | **built: FontSwapBlur** | Locks position, cycles only typeface; reads more premium than any spatial kinetic-type move, at lower cost. Category leader per INDEX. |
| 24 | `stepRelayAdvance` | 1.10 | `A_shipping-8-launch-videos` | A | moderate | **built: StepRelay** | Free progress indicator for any pipeline/steps narrative; zero new geometry per step. |
| 25 | `irisMaskReveal` + preview rings | 1.5 | `B_galactic-motion-art` + `mthblt_A_extremely-happy…` | A+A | trivial | **built: IrisMaskReveal** | Two designers. mthblt's addition — SVG rings locked to the same `R`, telegraphing 20f early — is what makes it read intentional rather than abrupt. |
| 26 | `venetianBlindWipe` / `irregular-polygon-shape-wipe` / `bubblePopReveal` | 1.5 | `mthblt_B_jitter-2024…` | A | trivial-moderate | spec-only | A whole kit of cheap `clip-path` transitions; in the source **all 43 transitions are real shape masks, zero crossfades.** Buy the kit, not one wipe. |
| 27 | `noise-masked-pixel-dissolve-reveal` | 1.5 | `jittervideo_B_you-dont-always…` | B | moderate | spec-only (`pixelNoiseReveal`) | Per-block noise threshold with `pixelSize` **and** `threshold` animating — INDEX flags it as the one genuinely stealable thing in that ref. |
| 28 | `flattenToIsometric` | 1.1 | `A_not-your-average-ui-animation` | A | moderate | spec-only | One shared wrapper transform turns flat stat-card mocks into a "real dashboard"; panels share the plane for free. **3 designers converge** (§3.6). |
| 29 | `rackLoop` | 1.11 | `A_recent-motion-4k-vertical` | B | trivial | **built: RackLoop** (has a shipped bug) | Invisible loop seam from one mirrored curve. Only ranks this low now: 3 of 5 designers never loop anything (§1.11), so it is brand-loop-specific. |
| 30 | `shapeMorphCollapse` chain | 1.5 | `B_editors-loop-3d-camera` | S | hard | spec-only | Highest payoff-per-frame in the corpus — morphs one shape through many concept states with no cut — but needs point-matched SVG paths (`flubber`), so cost drags it to #30. |

**Dropped from the old top-25, and why:** `dual-speech-chip-pairing` (single source,
superseded by #6's diegetic text slot); `wordBuildReveal` (redundant with #1 at higher
cost); `objectTumbleIn`+`bookOpen`, `paperFoldIn`, `radialChatCluster`,
`instant-bg-recolor-match-cut`, `dollyToUI`-as-staging, `bubbleDrift`,
`quadrant-proof-grid`, `glitchMaterialMorph`, `word-build-suffix-reveal` — all still
valid (see §1), all outranked by 12 wider-corpus entrants with equal or better
evidence at equal or lower cost.

---

## 3. Convergent patterns — the highest-value section

With five designers this can finally separate craft from habit. **17 of the 23
non-byshubh specs independently name a byshubh technique they arrived at separately**
(`convergence:` lines in the extracts). Ranked by strength.

**3.1 One text slot, frame-indexed into a string array — 4 designers.**
`A_explainer-zhylar-crm-cpq` (`word-cycle-slot-settle`, 3 columns) ·
`A_best-launch-reel-2026` (`word-cycle-slot-object-swap`, single slot) ·
`jittervideo_A_introducing-superagents…` (explicitly cites `wordCycleSettle` +
`wordBuildReveal`) · `Kirschberg__B_yummy…` (`agent-status-line-swap`) ·
`evanplace_A_eventbrite…` (cites the same). Four designers, three tiers, same
`Math.floor(frame/interval)` mechanism. **The single best-evidenced technique in the
library.**

**3.2 One asset, N material variants, indexed — 4 designers.**
`B_dynamic-typography-d3` (10-12 fonts, one word) · `B_galactic-motion-art` (4
treatments, one illustration) · `B_editors-loop-3d-camera` (`portalDive`, 3 palettes,
one tunnel) · `B_trippy-abstract-type` (6 materials, one mesh) ·
`evanplace_A_eventbrite…` (`paletteCycle`) ·
`evanplace_A_making-an-effort…` (`materialSwapCycle`) ·
`mthblt_A_love-everything…` (`poseCycleSwap`, `floor(frame/10)%N`, hard switch) ·
`jittervideo_A_introducing-superagents…` (style-picker texture swap). Same build-cost
argument every time: author the geometry once, index a variant array.

**3.3 One shared driver for cause and effect — 4 designers.**
`A_connect-to-figma-ui-anim` (one `click_at_f` drives cursor pulse and button flip) ·
`A_recent-motion-4k-vertical` (`shield-block-reveal` fires on the exact causal frame) ·
`jittervideo_B_you-dont-always…` (`cursor-driven-parameter-scrub`: cursor and bound
value share one interpolation driver) · `mthblt_B_jitter-2024…`
(`keyframe-marker-percent-sync`: marker x and percent counter from one `p`) ·
`Kirschberg__A_absolutely-massive…` (counter and camera dolly from one `p`). Four
designers state the same rule: **never let two visuals that must agree derive from two
drivers.**

**3.4 Spring constants land in the same two bands, independently — 4 designers.**
`springSnap` (damping 12-14 / mass 0.5-0.6 / stiffness 140-200) in
`A_connect-to-figma-ui-anim`, `A_recent-motion-4k-vertical`, `B_logo-aim`
(`spring(damping14)`), `B_logo-sage-library`, `B_trippy-abstract-type`
(damping 12/stiffness 180/mass 0.6), `B_editors-loop-3d-camera`,
`mthblt_B_jitter-2024…` (explicitly cites "springSoft/springSnap discipline"),
`jittervideo_A_introducing-superagents…`. `springSoft` (damping 200 / mass 0.6 /
stiffness 100) in `B_logo-sage-library` (`shatterDisperse`), `B_logo-streetwear`
(`orbitAssemble`), `A_micro-elements-animations` (`spring(damping200)` on
`strokeDashoffset`). **Use MOVE_VOCAB's constants verbatim; do not invent new ones.**

**3.5 Content-tied ambient motion beats whole-frame drift — 3 designers.**
`A_not-your-average-ui-animation` (`growing-radial-halo` scaled by
`cardsRevealed/total`, not a timer) · `mthblt_A_extremely-happy…`
(`content-driven-idle-instead-of-camera-drift`: one diegetic LED sine loop, explicitly
cites byshubh's `radialRevealGlow`) · `jittervideo_B_you-dont-always…`
(per-tile clocks desynced) · `evanplace_A_8-the-trailers…` (a blurred autoplaying
trailer supplies the motion). Three designers reject `driftCamera` in favour of motion
that means something. **Documented counter-example:**
`evanplace_B_the-latest-chapter…` ties a vignette pulse to content, then lets it stop
at f258 and freeze for 131f — its own spec calls this a bug.

**3.6 Flat panels tilt/flatten on one shared perspective wrapper — 4 designers.**
`A_not-your-average-ui-animation` (`flat-to-isometric-dashboard-reveal`) ·
`A_explainer-zhylar-crm-cpq` (`raked-3d-ui-card-flatten`) ·
`jittervideo_B_recreating-this-fifa…` (cites "raked-3D card-flatten") ·
`jittervideo_B_you-dont-always…` (`raked-3d-linked-action-timeline`, cites "raked-3D
panel entrance") · `mthblt_B_the-team…` (cites the isometric-dashboard parallel for
its handheld-tablet framing). Four designers use one CSS `perspective` parent with a
single `rotateX` on the group, never per-panel 3D.

**3.7 Identical container makes unrelated content match-cut — 4 designers.**
`A_showreel-snippet` (`<PhoneCard>`, 12 brands) · `A_best-launch-reel-2026` (fixed
inset card, 6+ products) · `A_shipping-8-launch-videos` (fixed-row persona list) ·
`Kirschberg__A_new-site…` (fixed 4x4 grid, per-cell swaps) ·
`jittervideo_A_introducing-superagents…` (`bulk-variant-tile-wall`) ·
`evanplace_A_eventbrite…` (`swatch-conveyor`). Same conclusion: put every different
thing inside the same shape and position.

**3.8 `dropShadowSoft` on floating UI — 4 designers, verbatim.**
Explicitly cited as convergent by `jittervideo_A_introducing-superagents…`,
`jittervideo_B_recreating-this-fifa…`, `jittervideo_B_you-dont-always…`,
`mthblt_A_love-everything…`, `mthblt_B_after-an-amazing-4-years…`,
`mthblt_B_jitter-2024…`, `mthblt_B_the-team…`. The most-cited single primitive in the
whole corpus. Use `0 18px 48px rgba(0,0,0,0.18)` and stop thinking about it.

**3.9 `staggerRise`/`scaleIn`/`slideStackIn` as the default entrance — 3 designers.**
Cited convergent by `mthblt_A_love-everything…`, `mthblt_B_after-an-amazing-4-years…`,
`mthblt_B_jitter-2024…`, `jittervideo_B_recreating-this-fifa…`. No designer invents a
new entrance for lists, cards or chips.

**3.10 Path-morph a mark rather than cutting to it — 3 designers.**
`B_chromatic-logo-2d3d` (flubber morph inside a flash) ·
`evanplace_B_a-logo-animation-of-openais-logo` (`spinner-to-mark-shape-convergence`,
cites `B_chromatic-logo-2d3d`) · `evanplace_B_sound-on-logo…` (cites `morphShape`,
`drawOn`) · `evanplace_B_had-a-lot-of-fun…` (cites the same) ·
`Kirschberg__A_absolutely-massive…` (`bar-to-wordmark-morph`).

**3.11 Exactly one kinetic-type flourish per video — 3 designers.**
`A_launch-video-wip-vertical` reserves `typeOnJitter` for the single word
"introducing" · `B_trippy-abstract-type` reveals 5 lines as rigid per-line blocks,
never per-letter, because per-letter cascade "becomes noise above ~3-4 words/sec" ·
`A_shipping-8-launch-videos` rations emphasis to one styled keyword per sentence ·
`mthblt_B_jitter-2024…`'s `scramble-to-order-title` is used once. Confirms
PRINCIPLES.md's existing rule with a failure condition.

**3.12 Colour rationing: one off-palette success hue, or one hard invert — 4 refs.**
`A_explainer-zhylar-crm-cpq` and `A_connect-to-figma-ui-anim` reserve green for
success only; `B_logo-streetwear` and `B_logo-holo` invert the entire palette exactly
once, at the frame the brand lands, discarding all hue content afterwards.

**Count: 12 convergent patterns**, of which 8 span ≥3 designers and 4 span exactly 3
by tier-mixed evidence. Anything in §3 is a safe default. Anything in §1 marked
**thin** or **single-designer** is not.

---

## 4. Structural findings across all 47

**The old file's headline claim is now contradicted.** It said "11 of 25 references run
≤1 real hard cut … the single clearest convergent finding in the whole corpus."
Recomputed across 47: **18 of 47 (38%) run ≤1 real hard cut; 19 of 47 at ≤2.** Still
substantial — but it is **not** corpus-wide craft, it is a byshubh/evanplace habit:

| Designer | Refs | ≤1 hard cut | Share |
|---|---|---|---|
| byshubh | 24 | 13 | 54% |
| evanplace | 10 | 4 (5 at ≤2) | 40% |
| jittervideo | 5 | 1 | 20% |
| Kirschberg | 3 | 0 | 0% |
| mthblt | 5 | **0** | 0% |

The continuous-take refs: `A_connect-to-figma-ui-anim` (0/221f),
`A_launch-video-wip-vertical` (0/389f), `A_micro-elements-animations` (0/66f),
`A_not-your-average-ui-animation` (0/141f), `A_recent-motion-4k-vertical` (0/283f),
`B_dynamic-typography-d3` (0/273f), `B_editors-loop-3d-camera` (0/323f),
`B_logo-sage-library` (0/179f), `jittervideo_B_small-but-mighty…` (0/120f),
`A_how-to-dream-2d` (1/189f), `A_motion-explainer-snippet` (1/195f),
`B_chromatic-logo-2d3d` (1/257f), `B_logo-aim` (1/91f), `B_logo-streetwear` (1/167f),
`evanplace_B_a-logo-animation-of-openais-logo` (1, 0 real),
`evanplace_B_figured-out-how-to-do-it-in-figma-thanks-f` (1, 0 real),
`evanplace_B_had-a-lot-of-fun…` (1, 0 real), `evanplace_B_sound-on-logo…` (1/178f);
plus `evanplace_B_had-the-privilege…` (2/276f).

**Every designer who works with real captured footage cuts constantly.**
`mthblt_B_jitter-2024…` runs 43 cuts / 1000f (median 20f);
`evanplace_A_eventbrite…` 18 cuts / 53s; `mthblt_B_after-an-amazing-4-years…` 13/464f;
`jittervideo_B_you-dont-always…` 13/67.7s. Detector over-counting is real for
synthetic pieces (`B_editors-loop-3d-camera`: 40 raw → 0 real;
`B_chromatic-logo-2d3d`: 23 raw → 1 real) but **not** for these — mthblt's sub-11f
beats "always in groups of exactly 3" are deliberate density devices, not artefacts.

**Implication for building a launch video:** continuity is a property of *synthetic*
scenes. If you generate everything in Remotion, default to one take and manufacture
cuts (families 1.1/1.4/1.5/1.12). The moment real screen recordings or product
photography enter the timeline, switch to a cut-driven edit at a 20-33f median and
carry continuity with families 1.10 (identical container) and 1.5 (shape-mask
transitions) instead.

**Four recurring rhythm grids** (use one, do not mix):

| Grid | Value | Sources |
|---|---|---|
| Hard beat grid | 8f @24fps (cuts at f8/16/24…) | `A_shipping-8-launch-videos` |
| Burst step | 3f fixed steps inside a conveyor segment | `A_showreel-snippet` (f85-87/88-90/100-102) |
| Quantised stutter | 4f, zero easing (`floor(frame/4)*4`) | `B_galactic-motion-art`, `B_dynamic-typography-d3` (on twos, 2f) |
| Strobe square-wave | 2f `frame % 2`, identity-flip only | `B_logo-streetwear` (f100/102/104), `B_logo-wip` |

**Cut-driven medians cluster tightly at 20-36f** (`A_2d-animation-growth-hack` 30f,
`A_best-launch-reel-2026` 33f, `A_explainer-ai-chatbot-wip` 36f,
`A_explainer-zhylar-crm-cpq` 33f, `mthblt_B_after-an-amazing-4-years…` 33f,
`mthblt_B_jitter-2024…` 20f, `mthblt_B_the-team…` 21f,
`evanplace_A_eventbrite…` fastest 21f). **Use 30f (1s @30fps) as the default shot
length for a cut-driven launch video, 20f for a feature reel.**

**Long-form is solved by event density inside held shots, not by cut rate.** The old
file said nothing in the corpus sustains past 20s; **that is now wrong — 6 refs run
33-68s.** Three concrete mechanisms, in ascending cost:

1. **Staged-event array under a locked camera** — `evanplace_B_had-the-privilege…`:
   276f, one camera, a new mechanical event every **24-40f**. Cheapest.
2. **Per-cell independent clocks in a fixed grid** — `Kirschberg__A_new-site…`: a
   **562-frame** single shot survives because every cell swaps on its own ~20f
   stagger. Also `jittervideo_B_you-dont-always…`'s ticking template grid.
3. **Register changes every 15-20s inside one take** — `Kirschberg__B_yummy…` packs a
   title, an orbit visualisation, a live typing beat, an agent-status swap and a
   mockup-fan build into one **790f** take before its first cut. This is the model for
   a 60-90s film: change *register* (abstract→UI→conversation→proof) on a 15-20s
   clock, not shot on a 1s clock.
4. **Or: pure cut density** — `mthblt_B_jitter-2024…` sustains 33.4s on 43 cuts by
   never letting a capability sit still >1.3s. Valid, and the only long-form pattern
   in the corpus that needs no continuity engineering at all.

**Energy curve:** `evanplace_B_sound-on-logo…`'s `instant-then-settle-energy-curve`
puts **all** moves in the first 28% of runtime and exactly one ambient move after.
`evanplace_B_the-latest-chapter…` holds a wordmark card for 60%+ of runtime. Both are
logo pieces — do **not** copy that distribution into a launch video, but do note the
corpus has no rising-arc counter-example (§5).

---

## 5. Gaps — what a product launch video needs that 47 refs still do not show

Merged from all four extract groups. **Two gaps the old file listed are now closed or
downgraded, and are marked as such.**

**Total, unanimous across all four groups:**

1. **No commercial CTA / pricing / plan / URL / app-store end-card. Zero of 47.**
   Every closer is a brand lockup, a wordmark, a loop point, a product screen, a
   badge pill, or a mid-gesture drag. All four groups report this independently. This
   is the corpus's single largest hole and you will have to invent the beat.
2. **No audio- or speech-driven cut list.** `audio_cue` is always inferred *post hoc*
   from the motion curve. Nothing authors a cut list against a real beat grid or a
   voiceover script; PRINCIPLES.md's "120bpm = cut every 15f" is never demonstrated
   against real audio. All rhythm in the corpus is beat-grid or camera-driven.
3. **No multi-speaker / testimonial editing.** `A_explainer-ai-chatbot-wip` fakes a
   two-voice exchange with two static chips; `jittervideo_B_you-dont-always…` is a
   single-presenter tutorial. Nothing cuts between two real talking heads, and nothing
   shows lower-thirds or caption pacing.
4. **No data-viz beyond single-series counters and simple bar/line.** Counters are
   everywhere (`liveCounterTick`, `decelerating-multiplier-counter`,
   `irregular-counter-with-camera-zoom-climax`); a multi-series chart re-sorting, a
   table filtering live, or an ROI/growth chart appears **nowhere**.
5. **No before/after or competitor split-screen.** No comparison framing of any kind.
6. **No customer-logo wall / social proof.** Partial exception:
   `Kirschberg__A_absolutely-massive…`'s tumbling partner-logo card stack is a
   1.10 montage of real brands — the closest thing, and it is a rewards campaign, not
   social proof.
7. **No multi-device responsive framing** (phone + desktop in one composition).
   `mthblt_B_after-an-amazing-4-years…`'s `device-within-device-orbit` shows one
   device at a time.
8. **No simultaneous multi-user cursors.** `multiplayer-cursor-name-tags`
   (`jittervideo_A_introducing-superagents…`) is one cursor with a name pill —
   collaboration is implied, never shown.
9. **No true fluid / cloth / soft-body / hair simulation.** The corpus's 3D tops out
   at wireframe spheres, extruded marks, CSS-3D tilts, seeded polygon shards and one
   splash-particle burst. `evanplace_B_figured-out-how-to…`'s fur is a *shaded static
   render* with one growing mask, not simulation.
10. **No genuine localisation or accessibility pass.** `grid-multiply-localization-reveal`
    and `bulk-variant-tile-wall` both **fake** per-item uniqueness with recycled
    placeholders, so neither answers real copy reflow. Nothing addresses caption
    burn-in, RTL, dynamic-length text, or contrast validation.
11. **No rising act structure across 60-90s.** 6 refs exceed 33s, but the longest
    (`jittervideo_B_you-dont-always…`, 67.7s) is one repeating tutorial unit, and
    `Kirschberg__B_yummy…` (53.1s) changes register rather than escalating. §4's
    mechanisms sustain attention; none of them *build* it.

**Downgraded — the old file was too pessimistic:**

12. ~~"No real screen-recording compositing beyond one instance."~~ **Now false.** At
    least 11 of 47 involve real capture or real footage: all 5 mthblt refs (Apple.com,
    AirPods, Vision Pro), `Kirschberg__A_new-site…`,
    `jittervideo_A_introducing-superagents…`, `jittervideo_B_you-dont-always…`,
    `jittervideo_B_recreating-this-fifa…`, `evanplace_A_making-an-effort…`,
    `A_launch-video-wip-vertical`. Families 1.13 and 1.15 exist because of them. What
    is **still** missing is *grading/stabilisation guidance* — no spec says how to
    match a capture's colour, denoise it, or stabilise a handheld plate.
13. ~~"No sustained long-form pacing."~~ **Partly closed** — see §4's four mechanisms.
    What remains missing is specifically the *rising arc* (gap 11), not duration.
14. ~~"No responsive multi-aspect workflow."~~ **Partly closed** —
    `magic-resize-live-reflow` (`jittervideo_A_introducing-superagents…`) genuinely
    reflows one content model across 5 aspect-ratio artboards off one frame counter.
    It is a *demo of* the capability rather than a *build pipeline for* it, but it is
    a working mechanism, not an assertion in a `vertical_notes:` block.

---

## 6. Disposition of the 13 unhoused techniques

Frequency decided these: one instance is noise, several across designers is a family.

| Proposal | Instances | Decision | Reason |
|---|---|---|---|
| `NEW:scroll-as-camera` | 5 (4 tagged + `site-scroll-slideshow`) | **PROMOTED → 1.13** | Original 12 were derived with zero website reveals in the corpus; MOVE_VOCAB already rejects 5 scroll moves as out of scope for 1.4-1.6, so they have nowhere else to live. Marked thin (mthblt-dominant). |
| `NEW:live-software-feature-demo` | 5 (3 tagged + 2 adjacent) | **PROMOTED → 1.14** | No byshubh-era spec shows a tool being *commanded*, only finished states — a genuine structural gap. Its S-tier source is INDEX's #1 reference for the two most likely jobs. Marked single-designer. |
| `NEW:screen-capture-composite` | 1 (+2 related in 1.8) | **PROMOTED → 1.15** | Cannot fold into 1.8, whose definition explicitly excludes real screen capture. With `device-within-device-orbit` and `handheld-device-frame-spec-tabs` it is 3 techniques / 2 designers. Marked thin, all B-tier. |
| `NEW:site-scroll-slideshow` | 1 | **FOLDED → 1.13** | Same job (present a website's scroll), degenerate zero-transform variant. Worth keeping as the documented cheap fallback, not a family. |
| `NEW:chromatic-echo-multiply` | 1 | **FOLDED → 1.4** | Already canonical in MOVE_VOCAB as `holoEchoOutline`, with an explicit conflict note vs `motionTrail` (scale/hue offset, not time offset). Re-skinning one path = family 1.4. |
| `NEW:mark-strip-signoff` | 1 | **REJECTED → PRINCIPLES.md** | A composition of existing moves (`flyOut` on the text/icon group + root `pullOut` 1.1→1.0) and a closing *convention*, not a mechanism. Single C-tier source (`B_logo-wip`). |
| `NEW:emphasis-budget` | 1 | **REJECTED → PRINCIPLES.md** | A craft principle: ration emphasis to one styled keyword per sentence and let the entrance carry the motion, not the style. Already convergent (§3.11) with the one-kinetic-flourish rule. Not a pattern family. |
| `NEW:animate-on-twos` | 1 | **REJECTED → PRINCIPLES.md** | A global timing discipline (`heldFrame=floor(frame/2)*2` feeding *every* `interpolate()`), applicable to all 15 families at once — the definition of a principle, not a family. Mechanically identical to `treatmentStutterSwap` at `step_f=2`. |

**Net: 12 revised families + 3 promoted = 15. 3 proposals go to PRINCIPLES.md,
2 fold into existing families.**

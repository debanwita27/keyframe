# Pattern library (cross-corpus synthesis)

Source: all 25 files in `refs/specs/*.yaml` (24 unique — `A_2d-loop-piece.yaml` is a
recorded duplicate of `A_how-to-dream-2d.yaml`), ~93 individual `techniques:` entries.
This document groups those techniques into reusable families, ranks the most
transferable individual techniques, calls out where independent references converge
on the same numeric craft rule (the strongest signal in the corpus), and lists what
a launch video needs that this corpus does not demonstrate.

Every claim below cites the spec `id` it came from. Spec ids are used verbatim
(e.g. `A_connect-to-figma-ui-anim`, `B_logo-sage-library`) — see
`refs/specs/<id>.yaml` for the full entry.

---

## 1. Pattern families

### 1.1 Shape/material continuity morph (no-cut state change)
**Definition:** the same on-screen object changes state, material, or role by
interpolating in place — never by cutting to a new asset.

**Count:** 10 techniques across 7 references — `A_connect-to-figma-ui-anim`,
`A_how-to-dream-2d`, `B_logo-aim`, `B_chromatic-logo-2d3d`, `B_editors-loop-3d-camera`,
`B_logo-wip`, `B_logo-sage-library`.

**Strongest instances:**
- **`logo-to-icon-morph`** (`A_connect-to-figma-ui-anim`) — one absolutely-positioned
  logo element's `translate(x,y) scale(s)` is interpolated from its hero position
  directly to the exact pixel slot the in-UI icon occupies (`interpolate(frame,
  [93,119], [heroX,heroY,1], [iconX,iconY,0.22], {easing: bezier(0.87,0,0.13,1)})`).
  No new asset ever mounts.
- **`click-becomes-loader-morph` + `expandToBackdrop`** (`A_how-to-dream-2d`) — the
  clicked send-button icon itself interpolates rounded-square→circle→alarm-orb→
  full-bleed background (`scale: [1,9]`) before a card cross-fades on top of it.
- **`mark-to-wordmark-morph`** (`B_logo-aim`) — a logo's rings/crosshair fracture
  into matched-point-count SVG fragments that reform into the wordmark's actual
  letter strokes (flubber/GSAP MorphSVGPlugin path interpolation, 22f).

**Generalised recipe:** pick one element that must survive a transition; drive every
visual property (position, scale, border-radius, path `d`, background) off a single
`progress = interpolate(frame, [a,b], [0,1], {easing})` value, and cross-fade any new
adjacent layer in only once that element's own transform has visually become
indistinguishable from the destination state. Never introduce a second element that
duplicates what the first one is becoming.

**Difficulty / 3D:** trivial–moderate for pure CSS/SVG-path morphs (2-4 chained
`interpolate()` calls, or `flubber.interpolate()` for point-matched path morphs).
**Needs 3D** only for true chrome/extrusion moments (`B_chromatic-logo-2d3d`'s
`logo-2d-to-3d-kaleido-transform`, `THREE.ExtrudeGeometry` + `MeshPhysicalMaterial`).

---

### 1.2 Assembly & shatter from constituent parts
**Definition:** a mark or dashboard is built from — or destructed into — several
discrete pieces that individually carry meaning (product-domain objects, icons,
control points), rather than appearing as one whole.

**Count:** 7 techniques across 6 references — `B_logo-sage-library`,
`B_logo-streetwear`, `B_logo-aim`, `A_micro-elements-animations`,
`A_explainer-zhylar-crm-cpq`, `B_editors-loop-3d-camera`.

**Strongest instances:**
- **`fragment-shatter-reform`** (`B_logo-sage-library`) — an open book shatters into
  ~10 fragments that read as generic product parts (UI card, wireframe window, list
  bars, glossy spheres); secondary fragments fade, survivors converge with
  `spring({damping:14, mass:0.5, stiffness:180})` and flatten to 2D into the mark.
- **`dot-converge-ring-badge`** (`B_logo-streetwear`) — 4 filled circles drift via
  `springSoft` (damping 200, mass 0.6, stiffness 100) into a cluster, crossfade
  fill→stroke, then expand/overlap into an interlocking ring-chain badge.
- **`staggered-svg-power-on`** (`A_micro-elements-animations`) — 7 unrelated HUD
  widgets each independently `drawOn`, but all start within a 4-frame window so the
  eye reads one "power-on" event, not seven animations.

**Generalised recipe:** define N fragments as data (`{id, shape, targetX, targetY,
rotate, entryFrame}`), never hand-place them. Disperse with a soft spring
(`damping≈200, mass≈0.6, stiffness≈100`) for outward drift, converge with a snappy
spring (`damping≈14, mass≈0.5, stiffness≈180`) for the inward "click" — reuse
MOVE_VOCAB's `springSoft`/`springSnap` constants exactly, don't invent new ones.

**Difficulty / 3D:** moderate. No WebGL required — `B_logo-sage-library` explicitly
notes the layout/motion is DOM/SVG-native; only pixel-perfect specular shading on
glossy fragments would need a renderer.

---

### 1.3 Progressive & substitutive text reveal
**Definition:** a sentence or headline arrives by construction (word-group build,
suffix growth) or by elimination (slot-machine substitution), never as one block of
text appearing or fading in at once.

**Count:** 6 techniques across 5 references — `A_explainer-zhylar-crm-cpq`,
`A_best-launch-reel-2026`, `A_2d-animation-growth-hack`, `A_explainer-ai-chatbot-wip`,
`A_launch-video-wip-vertical`.

**Strongest instances:**
- **`word-cycle-slot-settle`** (`A_explainer-zhylar-crm-cpq`, reused in
  `A_best-launch-reel-2026` as `word-cycle-slot-object-swap`) — 3 independent text
  columns cycle candidate strings every `swap_every_f=5` frames and lock left-to-
  right at a `settle_stagger_f=5` offset, reading as "the system deciding."
- **`word-build-suffix-reveal`** (`A_explainer-zhylar-crm-cpq`) — a headline grows by
  appending substrings in 4 discrete steps ("Simplify Pro"→"...Processes"), with an
  underline that redraws its measured width on every step.
- **`full-bleed-text-interstitial-over-grid`** (`A_2d-animation-growth-hack`) — a
  sentence builds word-group by word-group over a covering full-bleed layer while
  the background grid keeps running underneath, unpaused.

**Generalised recipe:** never animate a whole sentence's opacity. Either (a) reveal
word-groups via `maskWipeUp` at 12-16f per group with a 3-4f per-line stagger, (b)
grow a fixed target string by array-indexed substring length on discrete
`dur_per_step_f≈5` steps, or (c) cycle N independent column arrays on a fixed
interval and stagger their settle frames left-to-right. All three are pure
array/frame-index logic — zero hand-keyframing.

**Difficulty / 3D:** trivial–moderate (measuring text width for underline redraw is
the only fiddly part). No 3D.

---

### 1.4 Typeface / material-as-subject (re-skinning one fixed asset)
**Definition:** a single locked-position asset (a word, a hero mesh, an
illustration) is the subject, and the animated variable is its **material or
face**, not its position — treatments hard-swap or crossfade on a fixed asset
instead of new assets being built per beat.

**Count:** 11 techniques across 5 references — `B_dynamic-typography-d3`,
`B_galactic-motion-art`, `B_trippy-abstract-type`, `B_logo-wip`,
`B_editors-loop-3d-camera`.

**Strongest instances:**
- **`font-array-cycler` + `swap-blur-shear` + `edge-bleed-crop`**
  (`B_dynamic-typography-d3`) — one word ("BATMAN"), position/scale locked, cycles
  ~35-40 times through a 10-12-face font array on a 4-10f interval; the swap is
  disguised by a horizontal-only blur + skewX shear peaking at the 50% crossfade
  point; expanded faces are allowed to clip both frame edges because font-metric
  width differences do the "poster scale" work for free.
- **`stepped-treatment-stutter-montage`** (`B_galactic-motion-art`) — the same hero
  illustration cycles through 4 pre-filtered treatments (halftone, blackout,
  line-art, full color) on a hard `Math.floor(frame/4)*4` quantized grid, zero
  easing.
- **`portal-triptych-dive`** (`B_editors-loop-3d-camera`) — one reused nested-square
  tunnel geometry gets a hard CSS-custom-property palette swap every 22 frames
  (`paletteIndex = Math.floor(frame/22)`, a step function, never interpolated), so
  3 visually distinct tunnels come from one asset.

**Generalised recipe:** build the asset once. Maintain an array of N material/face/
treatment variants. Index into it with `Math.floor(frame / interval) % variants.length`
(hard swap, `treatmentStutterSwap`) or crossfade opacity between two stacked variants
over `dur_f` (eased swap, `treatmentCrossfadeSwap`). Never re-author the base asset
per beat.

**Difficulty / 3D:** trivial for the swap logic itself; moderate for producing the
variant layers (pre-filtered images/SVGs). No WebGL required — every instance in the
corpus uses CSS `filter`, SVG opacity tracks, or pre-baked layers.

---

### 1.5 Shape-driven masking & non-rectangular reveals
**Definition:** a reveal or transition driven by a mask whose *shape* is itself
animated — expanding circles, traveling non-rectangular silhouettes, or a mask that
morphs between named shapes — as opposed to MOVE_VOCAB's existing straight-edge
`maskWipeUp`/`maskWipeSide`.

**Count:** 8 techniques across 6 references — `B_galactic-motion-art`,
`A_motion-explainer-snippet`, `A_how-to-dream-2d`, `A_sparkle-vertical`,
`B_editors-loop-3d-camera`, `B_trippy-abstract-type`.

**Strongest instances:**
- **`iris-circle-teaser-reveal`** (`B_galactic-motion-art`) — a circular `clip-path`
  grows `r: 0→64px` over 13f at the very end of a shot to peek alternate-color
  content underneath, pure CSS, no SVG mask needed.
- **`shape-morph-collapse-chain`** (`B_editors-loop-3d-camera`) — nested squares →
  concentric rings → eye iris → folded ribbon plane, all point-matched SVG paths
  interpolated with `flubber`, colour stops crossfading in lockstep with the same
  progress value.
- **`vanishThroughGap`** (`A_motion-explainer-snippet`) — an object continues its
  trajectory while a *static* foreground shape progressively occludes it via
  z-order clipping (not opacity) — the reveal-family move run in reverse.

**Generalised recipe:** author shape stages as SVG paths with equal point counts (or
generate matched paths with `flubber`); drive the interpolated `d` as a `<clipPath>`
or `<mask>` referenced by `clip-path: url(#id)`/`mask: url(#id)`. For a "shape
travels across content" variant, stack two matching `clip-path: polygon(...)` layers
and translate one across the frame.

**Difficulty / 3D:** trivial (simple circle) to hard (multi-stage path morph
normalization). Needs 3D only for the tunnel-recession variants
(`nested-square-kaleido-tunnel`, `iridescent-ribbon-tunnel` — see family 1.6).

---

### 1.6 Camera-through-space / continuous never-cutting take
**Definition:** the entire piece (or the overwhelming majority of it) is one
unbroken camera/composition take; what looks like a scene change is a flash, morph,
glitch, or re-skin layered on top of continuous motion, never a hard cut.

**Count:** the single largest convergent structural pattern in the corpus — **11
references have ≤1 genuine hard cut across their full runtime**: `A_connect-to-figma-ui-anim`
(0 cuts, 221f), `A_launch-video-wip-vertical` (0 cuts, 389f), `A_not-your-average-ui-animation`
(0 cuts, 141f), `A_recent-motion-4k-vertical` (0 cuts, 283f loop), `B_dynamic-typography-d3`
(0 cuts, 273f), `B_editors-loop-3d-camera` (0 cuts, 323f — 40 raw detector cuts
collapse to 0 real ones), `B_logo-sage-library` (0 cuts, 179f), `A_how-to-dream-2d`
(1 cut, 189f), `A_motion-explainer-snippet` (1 cut, 195f), `B_chromatic-logo-2d3d`
(1 cut in 257f — 23 raw detector cuts collapse to 1), `B_logo-aim` (1 cut, 91f).

**Strongest instances:**
- **`B_editors-loop-3d-camera`** — one dolly pushes through a UI genesis, a
  data-bar floor flyover, a 3-pass re-skinned portal tunnel, an eye-iris collapse,
  and a folded landscape, ending on a dot that visually rhymes with frame 0.
- **`B_chromatic-logo-2d3d`** — a mark moves through blueprint→flat-icon→3D-chrome
  material states using only flashes/morphs/glitches as connective tissue; the
  detector's 23 "cuts" are all luma-delta spikes from bloom/invert/glitch on the
  same continuing object.
- **`A_connect-to-figma-ui-anim`** — logo pop-in, wordmark lockup, icon-morph, and a
  full UI dialog interaction all happen inside one 221-frame take with zero cuts.

**Generalised recipe:** default to building a scene as one Sequence with a single
progress driver, and manufacture "cuts" as flash/glitch/morph/palette-hard-swap
events layered on top (see families 1.1, 1.4, 1.12) rather than as new
compositions. Vary *what* the camera is moving through every 20-90f rather than
varying cut rate.

**Difficulty / 3D:** moderate (requires planning transform continuity end-to-end);
**needs 3D** for true camera-dolly-through-geometry shots (`B_editors-loop-3d-camera`'s
`floorFlyover`/`portalDive`), CSS-3D-buildable for shallower depth (nested squares,
tilt-settle cards).

---

### 1.7 Ambient perpetual motion under static holds
**Definition:** a purely frame-derived, never-settling motion (counter, drift,
progress bar) that runs specifically *during* a long hold so it never reads as a
freeze-frame — the concrete mechanism behind PRINCIPLES.md rule 4.

**Count:** 6 techniques across 5 references — `A_micro-elements-animations`,
`A_not-your-average-ui-animation`, `B_galactic-motion-art`,
`A_recent-motion-4k-vertical`, `A_shipping-8-launch-videos`.

**Strongest instances:**
- **`perpetual-telemetry-counter`** (`A_micro-elements-animations`) — `value =
  Math.round((frame-20) * 54.5)` in a `tabular-nums` span; zero keyframes, runs the
  entire back half of a 66f shot.
- **`progress-bar-fill-ambient`** (`B_galactic-motion-art`) — a bar's `scaleX`
  interpolates linearly `[0.12, 0.85]` across an entire 148-frame hold — the *only*
  thing moving through 100+ frames of near-zero measured motion.
- **`continuous-live-counter` + `growing-radial-halo`** (`A_not-your-average-ui-animation`)
  — dollar values jump between a short array of keyed values (not one smooth
  `counterUp`) and a background glow's scale/opacity is driven by
  `cardsRevealed/total`, not a timer, so it survives arbitrarily long holds.

**Generalised recipe:** for any hold ≥30f, attach at least one value that is a pure
function of `frame` with no easing and no landing point (a counter, a linear
progress fill, or a sine-seeded per-item idle drift with per-item phase offset so a
swarm never moves in lockstep). Counter-example worth noting: `B_logo-streetwear`'s
`dead-hold-as-confidence` and `B_logo-sage-library`'s `static-end-hold` deliberately
run **zero** ambient motion for 37-band closing cards — reserved exclusively for a
true end-card, not a mid-video hold.

**Difficulty / 3D:** trivial. No 3D.

---

### 1.8 Synthetic UI interaction proof
**Definition:** a fake cursor, selection marquee, or causally-timed state change
that reads as "a real interaction just happened" without any actual recorded
screen capture or physics simulation.

**Count:** 6 techniques across 5 references — `A_connect-to-figma-ui-anim`,
`B_editors-loop-3d-camera`, `A_recent-motion-4k-vertical`,
`A_explainer-zhylar-crm-cpq`, `A_explainer-ai-chatbot-wip`.

**Strongest instances:**
- **`cursor-choreo-click` (`cursorTravelClick`+`stateSwap`)** (`A_connect-to-figma-ui-anim`)
  — one `click_at_f` constant drives both the cursor's scale-pulse and the button's
  label/color flip, so cause and effect can never drift apart on edit.
- **`ui-kit-genesis-build`** (`B_editors-loop-3d-camera`) — a dashed selection
  marquee with 8 resize handles appears around whichever component is "currently
  building," then hands off to the next — the marquee, not the fade-in, is what
  sells "a tool just placed this."
- **`shield-block-reveal`** (`A_recent-motion-4k-vertical`) — a shield springs in at
  the exact frame incoming threat-bubbles finish arriving, selling "blocked" through
  pure sequencing, zero collision physics.

**Generalised recipe:** derive both the interaction's animation and its consequence
from one shared frame constant. Limit to exactly one click/interaction per shot —
sparse and precise beats a wandering cursor.

**Difficulty / 3D:** trivial–moderate. No 3D.

---

### 1.9 Radial/polar concrete-object placement
**Definition:** N related objects (icons, questions, chat bubbles, text copies) are
placed at fixed polar coordinates around a shared center rather than in a list —
the spatial arrangement itself carries the meaning ("surrounding," "orbiting,"
"radiating from").

**Count:** 6 techniques across 6 references — `A_shipping-8-launch-videos`,
`A_explainer-zhylar-crm-cpq`, `B_galactic-motion-art`, `A_launch-video-wip-vertical`,
`B_logo-streetwear`, `B_chromatic-logo-2d3d`.

**Strongest instances:**
- **`radial-question-bubbles`** (`A_shipping-8-launch-videos`) — 3 chat bubbles at
  fixed `angles_deg=[200,260,320]` around a central avatar read as "pressure
  surrounding this person," a spatial metaphor a vertical list wouldn't convey.
- **`radial-halftone-text-burst`** (`B_galactic-motion-art`) — a tagline tiled 12-16
  times at polar coordinates in concentric rings, opacity-pulsed for 4 frames — a
  full-bleed graphic hit built entirely from typography.
- **`network-bloom`** (`A_launch-video-wip-vertical`) — N nodes scatter from a
  center icon at seeded polar coordinates (`radius = rMin + rand()*(rMax-rMin),
  angle = i*(360/N) + jitter`), timed to land exactly when the matching word lands.

**Generalised recipe:** `x = cx + r*cos(θ), y = cy + r*sin(θ)`, computed once per
element from a fixed or lightly-jittered angle array — never runtime physics.
Stagger entrance by angle order.

**Difficulty / 3D:** trivial. No 3D.

---

### 1.10 Identical-container montage (match-cut by construction)
**Definition:** every item in a multi-item showcase (client work, pipeline steps,
value props) is rendered inside one identical container shape/position, so cuts
between totally unrelated content are match cuts for free.

**Count:** 7 techniques across 4 references — `A_showreel-snippet`,
`A_best-launch-reel-2026`, `A_shipping-8-launch-videos`, `A_2d-animation-growth-hack`.

**Strongest instances:**
- **`conveyor-matchcut-montage` + `settle-burst-settle-pacing`** (`A_showreel-snippet`)
  — 12 unrelated client emails ride one `<PhoneCard>` component; the offset
  function alternates "settle" (spring to rest, readable) and "burst" (fixed
  3f-step hard cuts) segments, modeled as one array of `{type, dur_f}` objects.
- **`step-relay-list`** (`A_shipping-8-launch-videos`) — a vertical persona list
  never restructures; each cut advances `activeIndex` by one row (full color/ring
  vs. grayscale/50%-opacity neighbours) — a free progress indicator, zero new
  geometry per step.
- **`quadrant-proof-grid`** (`A_2d-animation-growth-hack`) — 4 independently-timed
  Sequences run permanently in a CSS grid; a full-bleed interstitial covers (never
  restarts) the grid, so narration and "always-on product" alternate cleanly.

**Generalised recipe:** define one fixed-shape container component; drive an array
of N content objects through it via `translateX = index*cardWidth - offset(frame)`
or a `stepFunction(shotIndex)`. Adding/removing an item becomes a one-line data
change, never a new composition.

**Difficulty / 3D:** moderate. No 3D.

---

### 1.11 Loop bookending
**Definition:** a clip's opening and closing states are engineered to match
(blur/scale, a recurring small motif, or a literal pixel-identical frame) so
looped playback has no visible seam.

**Count:** 5 techniques across 5 references — `A_recent-motion-4k-vertical`,
`A_not-your-average-ui-animation`, `B_editors-loop-3d-camera`, `A_sparkle-vertical`,
`B_galactic-motion-art`.

**Strongest instances:**
- **`seamless-rackfocus-loop-bookend`** (`A_recent-motion-4k-vertical`) — identical
  `blur[18,0]`/`scale[1.04,1]` curve plays forward at open (27f) and mirrored at
  close (16f), so frame 282 and frame 0 match pixel-for-pixel.
- **`specular-flash-outro-loop`** (`A_not-your-average-ui-animation`) — a
  diagonal-gradient sweep plus a fade to the exact blank `#F0F0F0` canvas the shot
  opened on.
- **`shatter-to-seed-loop`** (`B_editors-loop-3d-camera`) — a sphere bursts into
  shards and re-contracts to a dot sized/colored to match the opening frame's
  ignition spark, disguising the loop seam as a payoff beat.

**Generalised recipe:** compute the opening state's exact terminal values (blur,
scale, color, position); replay the identical curve in reverse at the end. If a
small motif exists, reintroduce it full-size at both ends rather than only the
start.

**Difficulty / 3D:** trivial. No 3D.

---

### 1.12 Glitch / strobe / flash as transition disguise
**Definition:** a hard visual event (flash, tone-invert, datamosh, palette strobe)
substitutes for what would otherwise be a scene-change cut — the transition itself
becomes a designed beat rather than an edit seam.

**Count:** 8 techniques across 7 references — `B_chromatic-logo-2d3d`,
`B_logo-streetwear`, `B_logo-wip`, `B_galactic-motion-art`, `B_trippy-abstract-type`,
`A_motion-explainer-snippet`, `B_logo-holo`.

**Strongest instances:**
- **`bloom-invert-morph-transition`** (`B_chromatic-logo-2d3d`) — bloom → 2f
  whiteout → `filter: invert(1)` for 3f → SVG path-morph into the next state, all on
  the *same* object, so nothing reads as a scene break despite huge luma swings.
- **`strobe-restyle-transition`** (`B_logo-streetwear`) — background alternates
  white/black on a `frame % 2` square wave for 6 frames while two logo layers
  cross-fade underneath — an instant identity-flip for near-zero animation cost.
- **`datamosh-ghost-text-overlay`** (`B_trippy-abstract-type`) — 2-8 seeded-random
  noise rects + a flickering nonsense OCR string re-roll every 4-5f, faking codec
  corruption deterministically.

**Generalised recipe:** never use a plain crossfade for a big state change; wrap it
in a 1-6-frame flash/invert/strobe/glitch layer timed to the highest-energy frame,
underneath which the actual content swap is invisible.

**Difficulty / 3D:** trivial (flash, strobe) to moderate (glitch/datamosh with
seeded noise). No 3D.

---

## 2. Ranked table — most transferable ~25 techniques

Ranked by (reusability across many kinds of video) × (visual payoff) ÷ (build
cost) — cheap + universal + high-impact ranks above expensive + niche, even if the
niche technique looks more impressive in isolation.

| # | Technique | Family | Source spec | Difficulty | Why it ranks here |
|---|---|---|---|---|---|
| 1 | `wordCycleSettle` (slot-machine word cycle) | 1.3 | `A_explainer-zhylar-crm-cpq` | trivial | 3 arrays + a frame-index — zero keyframing — sells "personalized/decided" on any single-line value-prop headline in any category of video. |
| 2 | `logo-to-icon-morph` | 1.1 | `A_connect-to-figma-ui-anim` | moderate | Removes the single most common structural seam in launch videos (brand vs. product cut) for one interpolate() chain. |
| 3 | `liveCounterTick` (perpetual telemetry counter) | 1.7 | `A_micro-elements-animations` | trivial | Pure function of `frame`, no keyframes; the cheapest possible fix for "static hold reads dead," usable under every long hold in every video. |
| 4 | `cursorTravelClick` + `stateSwap` | 1.8 | `A_connect-to-figma-ui-anim` | trivial | One shared constant drives cause and effect; the cheapest "this is a real interaction" signal for any UI showcase. |
| 5 | `shatterDisperse` + `fragmentsConverge` | 1.2 | `B_logo-sage-library` | moderate | Logo reveal that argues the brand's value from the product's own visual vocabulary before the wordmark appears — highest payoff-per-line assembly move in the corpus. |
| 6 | `fillToStroke` (ring-cluster fill→stroke crossfade) | 1.1 / 1.4 | `B_logo-wip` | trivial | Two opacity tracks on identical geometry; reads as "dematerializing"; reusable on any mark or icon cluster. |
| 7 | `conveyorSlide` (identical-container montage) | 1.10 | `A_showreel-snippet` | moderate | Turns any N-item showcase (client work, features, testimonials) into a match-cut montage for the cost of one data array + one offset function. |
| 8 | `particleFieldConnector` | 1.10 | `A_best-launch-reel-2026` | trivial | Makes a compilation of totally unrelated clips read as one authored reel — same bg/type/motion regardless of what's on top. |
| 9 | `stepRelayAdvance` | 1.10 | `A_shipping-8-launch-videos` | moderate | Free progress indicator for any team/pipeline/steps narrative — zero new geometry per step. |
| 10 | `rackLoop` (seamless rack-focus loop bookend) | 1.11 | `A_recent-motion-4k-vertical` | trivial | Makes any hero loop autoplay with an invisible seam — one mirrored interpolate curve. |
| 11 | `dual-speech-chip-pairing` | 1.3 | `A_explainer-ai-chatbot-wip` | trivial | Fakes a two-speaker dialogue (problem/answer) without building a real chat UI. |
| 12 | `toast-confirmation-pop` | 1.8 | `A_explainer-zhylar-crm-cpq` | trivial | Universal "it worked" beat; a palette-breaking green rations trust cheaply and legibly. |
| 13 | `flattenToIsometric` | 1.1 | `A_not-your-average-ui-animation` | moderate | Turns a flat stat-card mock into a "real dashboard" 3D reveal via one shared wrapper transform — panels share the plane for free. |
| 14 | `glitchMaterialMorph` (static-camera material re-skin) | 1.4 / 1.6 | `B_trippy-abstract-type` | moderate | "Alive without a camera move" — the cheapest way to make a static hero object feel unstable/technical. |
| 15 | `wordBuildReveal` (suffix growth) | 1.3 | `A_explainer-zhylar-crm-cpq` | moderate | A short tagline "completing live," cheaper than any bespoke per-character typing animation. |
| 16 | `radialChatCluster` | 1.9 | `A_shipping-8-launch-videos` | trivial | Turns any "N concerns surrounding one subject" claim into an instant spatial metaphor. |
| 17 | `bubbleDrift` / `chipFloat` | 1.7 | `A_recent-motion-4k-vertical`, `A_shipping-8-launch-videos` | trivial | The one-line fix for the "everything moves in lockstep" flat-vector tell. |
| 18 | `instant-bg-recolor-match-cut` | 1.1 / 1.12 | `B_logo-aim` | trivial | Zero-render-cost "reveal, not scene change" cut — swap only the background `<Sequence>`, hold the foreground pixel-identical. |
| 19 | `dollyToUI` as wordless problem staging | 1.8 | `A_explainer-ai-chatbot-wip` | moderate | Converts an abstract SaaS claim into a concrete wordless mini-scene the copy can then confirm. |
| 20 | `objectTumbleIn` + `bookOpen` | 1.2 | `B_logo-sage-library` | moderate | General "open the container" beat before any reveal or shatter — reusable well beyond books. |
| 21 | `fontSwapBlur` (font-array cycler transition) | 1.4 | `B_dynamic-typography-d3` | trivial | Locks position, cycles only typeface — cheaper and reads more premium than any spatial kinetic-type move. |
| 22 | `irisReveal` (circular clip-path teaser) | 1.5 / 1.11 | `B_galactic-motion-art` | trivial | Cheap last-second "there's more" loop tease — pure CSS `clip-path: circle()`. |
| 23 | `shapeMorphCollapse` chain | 1.5 | `B_editors-loop-3d-camera` | hard | Path-morphs one shape through many concept states with no cut at all — highest payoff-per-frame in the corpus, but needs point-matched SVG paths (`flubber`). |
| 24 | `quadrant-proof-grid` + covering interstitial | 1.10 | `A_2d-animation-growth-hack` | moderate | Lets 3-4 simultaneous value props run on independent Sequences and be periodically covered by narration without a re-sync cut. |
| 25 | `paperFoldIn` (once-only flourish) | 1.2 | `A_not-your-average-ui-animation` | moderate | Tactile first-element flourish that buys credibility for a later isometric-tilt payoff — cheap, but must be used exactly once per video. |

---

## 3. Convergent patterns

These are the strongest signal in the corpus: things **multiple independent
references do the same numeric way**, indicating house-independent craft rather
than one designer's habit.

1. **Near-zero hard cuts, replaced by flash/morph/glitch/re-skin.** 11 of 24
   references run their entire piece as ≤1 real hard cut:
   `A_connect-to-figma-ui-anim`, `A_launch-video-wip-vertical`,
   `A_not-your-average-ui-animation`, `A_recent-motion-4k-vertical`,
   `B_dynamic-typography-d3`, `B_editors-loop-3d-camera`, `B_logo-sage-library`,
   `A_how-to-dream-2d`, `A_motion-explainer-snippet`, `B_chromatic-logo-2d3d`,
   `B_logo-aim`. In every case the automated cut detector over-counts by 2-40x
   because it can't distinguish a scene change from a bloom/invert/palette-swap on
   a continuously-moving take (see family 1.6 and 1.12). This is the single
   clearest convergent finding in the whole corpus.

2. **Spring constants converge on MOVE_VOCAB's own `springSnap`/`springSoft`
   values, independently.** `springSnap` (`damping:14, mass:0.5, stiffness:180`)
   appears verbatim or near-verbatim in `A_connect-to-figma-ui-anim` (tiltSettle3D:
   damping 12/mass 0.6/stiffness 140), `A_recent-motion-4k-vertical` (bubble
   entrance), `B_logo-aim` (target-mark pop), `B_logo-sage-library`
   (fragmentsConverge), `B_trippy-abstract-type` (per-line type stack: damping
   12/stiffness 180/mass 0.6), and `B_editors-loop-3d-camera` (shatter shards) — 6
   independent references landing on the same damping-12-to-14 / stiffness-140-
   to-200 band for anything that "snaps into place." `springSoft`
   (`damping:200, mass:0.6, stiffness:100`) shows the same convergence in
   `B_logo-sage-library`'s `shatterDisperse` and `B_logo-streetwear`'s
   `orbitAssemble`.

3. **Exactly one kinetic-type flourish per video, everywhere else locked-block
   text.** `A_launch-video-wip-vertical` reserves `typeOnJitter` for the single
   word "introducing," `B_trippy-abstract-type` reveals 5 lines as rigid per-line
   blocks (never per-letter) specifically because per-letter cascade "becomes
   noise above ~3-4 words/sec," and `A_shipping-8-launch-videos` rations emphasis
   to one styled keyword per sentence rather than animating the whole headline
   differently. Three independent references converge on PRINCIPLES.md's existing
   "exactly one per-letter moment per video" rule with concrete failure conditions
   for violating it.

4. **Identical-container / match-cut-by-construction for multi-item content.**
   `A_showreel-snippet` (`<PhoneCard>` for 12 unrelated brands),
   `A_best-launch-reel-2026` (fixed inset-card frame for 6+ unrelated products),
   and `A_shipping-8-launch-videos` (fixed-row persona list) all independently
   arrive at "put every different thing inside the same shape/position so cuts
   between them are match cuts for free."

5. **Color rationing with a hard invert or a single off-palette success hue.**
   `A_explainer-zhylar-crm-cpq` and `A_connect-to-figma-ui-anim` both reserve
   green exclusively for a "success" state (toast / button-flip) inside an
   otherwise purple/black palette; `B_logo-streetwear` and `B_logo-holo` both
   invert their entire palette exactly once, at the exact moment the brand
   "lands," discarding all rainbow/hue content from that frame forward. Four
   independent references converge on PRINCIPLES.md rule 7's "invert once" /
   "accent 2-3 times" guidance with concrete before/after hex values.

6. **Re-skin one asset instead of building N assets.** `B_editors-loop-3d-camera`
   (`portalDive`, 3 palette passes on one tunnel geometry), `B_galactic-motion-art`
   (4 treatments on one illustration), `B_dynamic-typography-d3` (10-12 fonts on
   one word), and `B_trippy-abstract-type` (`glitchMaterialMorph`, 6 material
   variants on one mesh) all converge on the same build-cost argument: author the
   geometry/asset once, drive an index into a variant array.

---

## 4. Gaps

What a launch video typically needs that this corpus does **not** demonstrate:

- **No real audio/music sync guidance.** Every spec infers `audio_cue` after the
  fact from the motion curve; none show how to author a cut list *against* a beat
  grid derived from an actual track (only PRINCIPLES.md's abstract "120bpm = cut
  every 15f" rule, never demonstrated against real audio in the corpus).
- **No sustained long-form pacing.** Every reference is 2.75-20s; the longest
  (`A_explainer-zhylar-crm-cpq`, 20s) is still short-form. Nothing in the corpus
  shows how to sustain a rising energy curve, act structure, or ambient-motion
  budget across a 60-90s launch video without repeating beats.
- **No real screen-recording compositing beyond one instance.** Only
  `A_launch-video-wip-vertical` composites a real capture (a filmed monitor); every
  other "UI" in the corpus is synthetic DOM/SVG. There's no guidance for grading,
  stabilizing, or cropping an actual product screen-recording into a stylized shot.
- **No commercial CTA/pricing/URL end-card.** Every reference ends on a brand
  lockup, a loop point, or a product screen — none end on a pricing card, a URL,
  a download-button beat, or an app-store frame, which most real launch videos need.
- **No multi-speaker/testimonial editing.** `A_explainer-ai-chatbot-wip`'s
  `dual-speech-chip-pairing` fakes a two-voice exchange with two chips; nothing in
  the corpus shows cutting between two or more real talking-head clips, lower-third
  captioning, or testimonial pacing.
- **No true fluid/cloth/hair simulation.** The corpus's 3D is limited to wireframe
  spheres, extruded flat marks, and CSS-3D card tilts (`wireframe-globe-orbit`,
  `logo-2d-to-3d-kaleido-transform`). Nothing demonstrates soft-body, fluid, or
  particle-system depth beyond seeded-random dot/chip scatter.
- **No accessibility/localization pass.** No spec addresses caption burn-in,
  RTL text, dynamic-length copy reflow, or color-contrast validation.
- **No responsive multi-aspect workflow.** Several specs include a `vertical_notes:`
  block asserting whether a composition *would* recompose to another aspect ratio,
  but none actually build or demonstrate a single source re-targeted live to two
  aspect ratios.
- **No data-heavy chart transitions beyond simple bar/donut/line.** Counters and
  single-series bar/line reveals are common (`revenue-counter-as-proof-card`,
  `barGrowIn`); nothing shows a multi-series chart re-sorting, a table filtering
  live, or a genuinely complex dashboard state transition.

## 1.1 Shape/material continuity morph (no-cut state change)
The same on-screen object changes state, material, or dimensionality by interpolating in place — never by cutting to a new asset.

| move | status | params | description + recipe | source |
|---|---|---|---|---|
| `morphShape` | spec-only | `dur_f=20, ease=expoInOut, point_count=matched` | Family's base engine (existing MOVE_VOCAB transition name, reused — precedence). Two SVG paths with equal point counts are treated as one continuously-existing object's start/end states. Recipe: normalize/author matched point-count paths; `d = flubber.interpolate(pathA,pathB)(progress)`, `progress=interpolate(frame,[a,b],[0,1],{easing:expoInOut})`. | MOVE_VOCAB.md (transitions); `B_logo-aim` |
| `logoToIconMorph` | spec-only | `dur_f=13, scale=[1,0.22], translate_y_px=[0,46], ease=expoInOut, dest=exact icon slot px` | Hero logo/mark shrinks+translates in place to occupy the exact pixel slot an in-UI icon will use, zero cut. Recipe: one absolutely-positioned element; `transform:translate(x,y) scale(s)` interpolated hero→icon; destination px must be measured from the real UI slot at build time. | `A_connect-to-figma-ui-anim` |
| `shapeStateMorph` | spec-only | `dur_f≈14 across 3-4 breakpoints, ease=expoInOut, properties=[border-radius,background,scale]` | One element's border-radius/background/scale chain through 3-4 `interpolate()` breakpoints so it visibly deforms (icon→circle→orb→card) with no new asset mounting. Recipe: single div/svg; chained interpolate() on border-radius%, background (chroma.js), scale; crossfade the next scene's layer in only once scale crosses the "become backdrop" threshold. | `A_how-to-dream-2d` |
| `expandToBackdrop` | spec-only | `scale=[1,8-10], dur_f=16, ease=expoInOut` | A foreground icon/shape scales up until its material becomes indistinguishable from the next scene's background; the next layer crossfades on top at that point — zero-cut environment change. | `A_how-to-dream-2d` |
| `fillToStroke` | **built: FillToStroke** | `dur_f=24, ease=expoInOut` | Identical geometry crossfades solid-fill→outline-stroke via two stacked SVG groups (`fill-opacity 1→0` / `stroke-opacity 0→1`, same path). Reads as "dematerialising." | `B_logo-wip`; MOVE_VOCAB.md Part 2 `fillToStrokeCrossfade` |
| `markToWordmarkMorph` | spec-only, **hard** | `dur_f=22, stagger_f=2-3/fragment, ease=expoInOut` | A mark's own geometry fractures into matched-point-count fragments that individually path-morph into a wordmark's letter strokes — one continuous material, not independent parts. Recipe: author two point-matched SVG path sets; `flubber.interpolate()`/GSAP MorphSVGPlugin tweens each fragment's `d`; stagger start 2-3f/fragment. | `B_logo-aim` |
| `bgRecolorCut` | spec-only | `dur_f=0 (hard swap at cut frame), foreground=pixel-identical across cut` | At a shot boundary the background flips color/asset in a single frame while the foreground element is motionless and pixel-identical — reads as a "reveal," not a scene change. Recipe: two `<Sequence>`s sharing the identical foreground component/coords; only the `AbsoluteFill` background differs; zero crossfade. | `B_logo-aim` |
| `flatTo3DMaterialMorph` | spec-only, **needs-3d, hard** | `dur_f=20, ease=expoInOut, depth_pct=15-20%, material=MeshPhysicalMaterial(metalness=1,roughness=0.15,clearcoat=1)` | A flat 2D SVG mark extrudes into true 3D geometry and its material flips from flat vector to glossy chrome, in place. Recipe: `THREE.ExtrudeGeometry` from the flat path; `MeshPhysicalMaterial` + iridescent env-map/matcap; sync a camera dolly-out (`scale 1→0.35` over 6f) to the shrink. CSS 3D cannot fake the specular chrome — genuinely needs a renderer. | `B_chromatic-logo-2d3d` |
| `logoKaleidoBurst` | spec-only, **needs-3d, hard** | `n=7, dur_f=14, ease=expoOut` | N duplicated instances of the (now-3D) mark scatter outward with heavy motion blur then partially converge to one instance — dramatizes `flatTo3DMaterialMorph`'s climax. Recipe: instance N mesh copies with randomized rotation/position offsets; spring outward then partially inward; layer `motionTrail`-style blur (3 echoes, 2f apart). | `B_chromatic-logo-2d3d` |

## 1.2 Assembly & shatter from constituent parts
A mark or dashboard is built from — or destructed into — several discrete pieces that individually carry meaning, rather than appearing as one whole.

| move | status | params | description + recipe | source |
|---|---|---|---|---|
| `shatterDisperse` | **built: Fragments** | `dur_f=24, fragment_count=10, spread_radius_pct=42, ease=expoOut, spring=springSoft` | An object breaks into N discrete pieces flying outward from its former centre on independent seeded trajectories; each piece reads as a generic product-domain shape (card, window, list-bar, sphere) so the shatter argues "this tool's contents." Recipe: N absolutely-positioned elements, each with a seeded-random target `{x,y,rotate}`; `spring({damping:200,mass:0.6,stiffness:100})` drives outward position; secondary fragments exit via `opacity 1→0 + blur 0→14` over 19f. | `B_logo-sage-library`; MOVE_VOCAB.md Part 2 |
| `fragmentsConverge` | **built: Fragments** | `dur_f=27, ease=springSnap, flatten_to_2d=true, overshoot_pct=3-6` | Paired with `shatterDisperse` — surviving fragments travel inward and fuse into a target shape (logomark) with a spring overshoot/settle, optionally flattening 3D-rotated pieces to camera-facing 2D. | `B_logo-sage-library`; MOVE_VOCAB.md Part 2 |
| `bookOpen` | spec-only | `hinge_rotate_deg=[0,158], dur_f=16, ease=expoInOut` | A hinged 3D object (book/laptop/box lid) rotates one panel open around a fixed edge to reveal an interior face — general "open the container" beat preceding a reveal or shatter. Recipe: two panel divs inside `perspective:900-1000px` parent (`transform-style:preserve-3d`); `transform:rotateY()` from 0, hinged at `transform-origin:left/right center`. | `B_logo-sage-library` |
| `objectTumbleIn` | spec-only | `scale=[0.7,1], rotate_settle="small random xyz→0", dur_f=8, ease=expoOut` | A 3D hero object already on-screen at frame 0 settles from a slightly tumbled orientation/reduced scale into its stable resting pose — a 3D-native entrance distinct from `scaleIn`'s 2D pop. Recipe: initial random `rotateX/Y/Z(-8→0deg)` + `scale(0.72→1)` interpolated/springed to rest. | `B_logo-sage-library` |
| `orbitAssemble` | spec-only | `n=4, dur_f=40, stagger_f=4, ease=springSoft` | N identical shapes (small filled circles) pop in individually staggered at scattered start positions, then drift along eased curved paths into a shared target cluster — particle-style logo-mark construction. Recipe: each shape's own `interpolate()`/spring driving x/y from a random off-cluster start to a fixed relative target, staggered `offset=index*stagger_f`. | `B_logo-streetwear` |
| `ringBadgeForm` | spec-only | `fill_to_stroke_dur_f=8, expand_overlap_dur_f=12, ring_count=5, ease=expoInOut` | Takes a converged cluster of filled circles and (1) fades fill→stroke (see `fillToStroke`) turning solid dots into hollow rings, then (2) grows/translates each ring apart until they overlap edge-to-edge into an interlocking ring-chain badge. Payoff stage for `orbitAssemble`. | `B_logo-streetwear` |
| `uiKitAssemble` | spec-only | `elements=8-10, per_element_stagger_f=4-6, element_dur_f=12 (spring damping:12,stiffness:180), marquee_handles=true` | A UI mockup assembles from N named sub-elements, each scaling in on its own stagger offset; a fake dashed selection-marquee with corner/edge handles appears around whichever element is "currently building," then hands off to the next. Recipe: `components` array `{x,y,w,h,inFrame}`; mount via `<Sequence from={inFrame}>`, `scale: spring(0.8→1)`; sibling marquee div opacity 1 while `frame-inFrame<20` then fades. | `B_editors-loop-3d-camera` |
| `staggeredSvgPowerOn` | spec-only | `burst_window_f=4, widget_count=7, ease=springSoft, lead_element_lead_f=12` | N unrelated widgets (HUD readouts, meters, drawn lines) each independently draw/reveal via `strokeDashoffset`/`clip-path`, but all begin within a tight ~4f window after one lone early element establishes "nothing is happening yet" — the near-simultaneous burst reads as one "system boot" event. Recipe: one `buildStart` frame constant; each widget takes a `delayFrames` prop (0-4f); `progress=spring({frame:frame-(buildStart+delayFrames), damping:200,mass:0.6,stiffness:100})`; `strokeDashoffset=interpolate(progress,[0,1],[1,0])`. | `A_micro-elements-animations` |

## 1.3 Progressive & substitutive text reveal
A sentence or headline arrives by construction (word-group build, suffix growth) or by elimination (slot-machine substitution), never as one block appearing/fading at once.

| move | status | params | description + recipe | source |
|---|---|---|---|---|
| `wordCycleSettle` | **built: WordCycle** | `cycle_words_per_col=3, swap_every_f=5, settle_stagger_f=5, ease=expoOut, crossfade_f=2-3` | N independent text columns each cycle their own candidate-string array at a fixed swap rate, staggering each column's final settle frame so they lock left-to-right like a slot machine converging on a decided sentence. Recipe: visible index `=Math.floor(frame/swapEveryF)` clamped to `array.length-1` per column; column start offset by `settle_stagger_f`; crossfade each swap over 2-3f opacity, never a hard cut. | `A_explainer-zhylar-crm-cpq` |
| `wordSwap` | **built: WordSwap** | `swap_every_f=12, crossfade_f=2-3` | Single-slot variant of `wordCycleSettle` — a fixed sentence stem holds still while only one suffix/object word cycles through options, landing on the last as the shot ends; no layout shift since the static prefix never changes width. Recipe: static prefix span + swapped suffix span, `index=Math.floor(frame/swapEveryF)%words.length`. | `A_best-launch-reel-2026` |
| `wordBuildReveal` | **built: WordBuild** | `steps=4, dur_per_step_f=5, ease=expoOut, underline_draw=true` | A target string is revealed by progressively increasing the visible substring length across N discrete steps (never per-character, never all at once); an underline redraws its measured width to match on each step. A word-group-granularity variant (revealing whole words via `maskWipeUp` per group, staged over a covering full-bleed interstitial atop a live background) is the same mechanism at coarser grain. Recipe: `currentStep=Math.floor((frame-start)/durPerStepF)`; render `fullString.slice(0,steps[currentStep])`; measure text width per step, animate underline width to match with spring/expoOut. | `A_explainer-zhylar-crm-cpq`; `A_2d-animation-growth-hack` (word-group variant) |
| `dualSpeechChips` | **built: DualSpeechChips** | `dur_f=10/chip, stagger_f=12, ease=expoOut, emphasis_scale=[1,1.12] backOut` | A sentence splits across two contrasting pill/chip shapes (solid-fill vs. outline) laid edge-to-edge like two speech bubbles from different speakers — fakes a two-voice dialogue without a real chat UI. Recipe: two `border-radius:999px` divs (one filled, one outline), `translateX` from ±110%→0 over 10f expoOut, second chip starting 12f after first; emphasis beat scales the answer chip 1→1.12 backOut while the question chip scales/fades out. | `A_explainer-ai-chatbot-wip` |
| `typeOnJitter` | spec-only | `dur_f=12, per_char_stagger_f=1, baseline_jitter_px=±6, scale=[0.85,1.1], ease=backOut` | A per-cluster (1-3 char) reveal of one climactic word where each cluster lands at a randomized baseline offset/scale before all clusters converge onto one shared baseline as the word completes — distinct from `letterCascade`'s uniform y/rotate curve. Reserve for exactly one moment per video. Recipe: split string into 2-3 char clusters with seeded per-cluster `{baselineOffsetPx, scale}`; reveal left-to-right at `per_char_stagger_f≈1`, `translateY` jittered-offset→0 + opacity 0→1, backOut; settle all clusters to baseline 0. | `A_launch-video-wip-vertical` |

### Aliases (families 1.1-1.3)
| proposed name | canonical |
|---|---|
| `morphToIcon` | `logoToIconMorph` |
| `click-becomes-loader-morph` | `shapeStateMorph` |
| `fillToStrokeCrossfade` | `fillToStroke` |
| `ring-cluster-fill-to-stroke` | `fillToStroke` |
| `instant-bg-recolor-match-cut` | `bgRecolorCut` |
| `logo-2d-to-3d-kaleido-transform` | `flatTo3DMaterialMorph` |
| `mark-to-wordmark-morph` | `markToWordmarkMorph` |
| `fragment-shatter-reform` | `shatterDisperse` + `fragmentsConverge` (paired) |
| `dot-converge-ring-badge` | `orbitAssemble` + `ringBadgeForm` (paired) |
| `staggered-svg-power-on` | `staggeredSvgPowerOn` |
| `ui-kit-genesis-build` | `uiKitAssemble` |
| `book-open-3d` | `bookOpen` |
| `word-cycle-slot-settle` | `wordCycleSettle` |
| `word-cycle-slot-object-swap` | `wordSwap` |
| `word-build-suffix-reveal` | `wordBuildReveal` |
| `full-bleed-text-interstitial-over-grid` | `wordBuildReveal` (word-group variant) |
| `dual-speech-chip-pairing` | `dualSpeechChips` |
| `intro-baseline-jitter-type` | `typeOnJitter` |

### Conflicts kept apart (families 1.1-1.3)
| move A | move B | how to tell them apart |
|---|---|---|
| `morphShape` | `shapeStateMorph` | `morphShape` interpolates an SVG path's `d` between point-matched shapes (needs authored/generated matched paths); `shapeStateMorph` interpolates plain CSS properties (border-radius %, background, scale) on one box/svg — no path authoring, cheaper, less expressive. |
| `shatterDisperse`+`fragmentsConverge` | `markToWordmarkMorph` | Shatter/converge uses independent, physically-simulated (spring) fragments that read as separate meaningful parts (a card, a window, a sphere); `markToWordmarkMorph` is a single object's own outline path-morphing into a new outline via matched-point interpolation — no independent parts, no physics, one continuous material. |
| `wordCycleSettle` | `wordSwap` | Same frame-index cycling mechanism, but `wordCycleSettle` drives N independent columns that each settle at a different staggered frame (slot-machine, multi-word sentence); `wordSwap` is one slot inside an otherwise-static sentence stem, single settle event, no stagger. |
| `letterCascade` (MOVE_VOCAB) | `typeOnJitter` | `letterCascade` is a uniform per-character curve (`y=18→0, rotate=6→0`, same for every char); `typeOnJitter` gives each 1-3 char cluster its own randomized baseline offset/scale that then converges onto a shared baseline — reads as "settling into alignment," not a uniform sweep. |
| `bgRecolorCut` | `expandToBackdrop` | Both disguise a scene change as continuity, but `bgRecolorCut` is a literal 0-frame hard cut on the background only (foreground pixel-frozen across it); `expandToBackdrop` is a continuous scale interpolation with no cut at all — the foreground itself becomes the new background. |

### Dropped (families 1.1-1.3)
| proposal | why |
|---|---|
| `dicePipLoader` / `pipLoader` | A scripted, content-specific loading motif (dice-pip layout swaps) — not a generalizable shape/material morph, assembly, or text-reveal mechanism; too narrow to parameterize as a reusable move. |
| `caretGlowTrail` | A decorative glow accessory to `typeOn`, not a standalone move in these three families. |
| `tiltSettle3D` | Generic damped-spring UI-panel entrance (rotateY wobble to flat) — no material/state change occurs, so it doesn't fit family 1.1's definition; overlaps with existing entrance vocab (`scaleIn`/`staggerRise`). |
| `anchorRingOrbit` | Ambient decorative point-ring rotating around an otherwise-static mark — no morph, no assembly, no text; it's ambient dressing, not one of these three families. |

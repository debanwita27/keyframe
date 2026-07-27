# INDEX — start here

50 references, ranked by visual craft and usefulness for building a **product launch video**. Read this file first. Do not open all 50 specs.

## How to use this index

1. Find your job in **"Start here, by job"** below (5 categories). It names 3-4 slugs in priority order with a one-line reason.
2. Look at the contact sheets for the top 2-3 named slugs before reading anything else. **Contact sheets and key frames are NOT committed to this repo** — they are other designers' video frames, licensed for local analysis only. Run `./pipeline/fetch_refs.sh --analyze` to regenerate `refs/analysis/<slug>/{keys/,sheet_*.jpg,profile.md}` locally.
3. `refs/analysis/<slug>/profile.md` **is** committed and carries all the measurements (duration, shot list, palette, motion-magnitude graph, held-frame ranges) without needing the images — read that if you can't regenerate frames.
4. Only after the frames (or profile.md) confirm the technique is what you need, open `refs/specs/<slug>.yaml` for the full timing/technique breakdown.
5. Read `pipeline/PATTERNS.md` for the cross-corpus technique families (§1), the ranked top-25 techniques (§2), and convergent house rules (§3) — this index defers to that document's technique analysis and only adds visual-quality judgment on top.

Tier counts: **S = 9, A = 15, B = 20, C = 3** (of 47).

Three originally-C references were **deleted** outright — they sourced no
technique anywhere in the library, so they were pure context cost:
`evanplace_B_know-i-posted…` (unedited talking-head, zero authored motion),
`evanplace_A_not-only-did-we-build…` (raw gameplay capture), and
`A_2d-loop-piece` (byte-identical duplicate of `A_how-to-dream-2d`).
The remaining three C-tier entries are kept deliberately — see below.

### The three surviving C-tier entries are technique-only

They are kept ONLY because each is the provenance for a move that is built
and in use. Do not spend context viewing their frames.

### The tier ranks the REFERENCE, not the technique

A C-tier ranking means "do not spend context looking at these frames" — raw screen
capture, IDE chrome, talking-head, illegible compression. It does **not** mean the
technique inside is bad, and three already-implemented moves prove it:

| built move | source | that source's tier |
|---|---|---|
| `FillToStroke` (ranked #6 in PATTERNS §2) | `B_logo-wip` | C — uncropped OBS capture |
| `ConcentricRings` | `A_sparkle-vertical` | C — raw After Effects viewport |
| `ConcentricShapeBurst` | `jittervideo_B_recreating-this-fifa…` | C — talking-head tutorial |

So: use the tiers to decide **what to look at**, and `PATTERNS.md` §2 to decide
**what to build**. A screen recording of someone building something can teach the
mechanism perfectly while being a poor thing to study visually.

---

## Range exemplars — our own prior outputs

Not third-party references. These are outputs from earlier runs, kept because they
show how differently two good launch videos can look. **If your output always
resembles one of these, the library is constraining you rather than guiding you.**

| output | duration | palette | cuts | what it does differently |
|---|---|---|---|---|
| `product-os-launch` | 26s | near-black + `#8000FF` purple | 12 hard cuts on a 120bpm grid | synthetic UI, beat-locked edit, staged capability list |
| `OUR_lens-launch` | 43s | cream `#F0D8D8` + red accent | **3** hard cuts in 43s | opens on a human problem in plain words — *"Four hours per drawing. Then the revision lands."* — uses real CAD drawings as the hero, and proves the claim with a live counter reaching **74 detections in 41s**. Long continuous takes, small confident type, mean motion 1.1 (a tenth of ours). |

The lesson from the pair: `lens-launch` is calmer, longer-take and quieter, and it
lands because the STORY and the PROOF are strong, not because the motion is busy.
Measured motion magnitude is not a quality score — do not read `analyze.py`'s mean
as "more is better". Its job is finding frozen frames and broken easings.

`refs/analysis/OUR_lens-launch/profile.md` has the full measurements.

## Tier list

Columns: slug · designer · duration · orientation · what it is · strongest technique.

### S-tier — exceptional. Study these first, full attention.

| Slug | Designer | Duration | Orient. | What it is | Strongest technique |
|---|---|---|---|---|---|
| `A_connect-to-figma-ui-anim` | byshubh | 3.7s | horizontal | Figma wordmark demotes in scale to literally become the app icon inside a tilted "Connect to Figma" dialog, zero cuts | `logo-to-icon-morph` — cleanest, most legible brand→product transition in the corpus |
| `A_motion-explainer-snippet` | byshubh | 8.2s | horizontal | Wordless: a falling spark streaks into a comet, resolves into a radiant sphere on a wireframe globe | one continuous object carries the whole metaphor, zero text, immaculate color grading |
| `B_chromatic-logo-2d3d` | byshubh (logo: Vishesh) | 10.7s | square | An asterisk/star mark cycles blueprint→flat-vector→glossy 3D-chrome kaleidoscope tunnel | `logo-2d-to-3d-kaleido-transform` material re-skin — most visually striking asset in the corpus |
| `B_editors-loop-3d-camera` | byshubh | 13.5s | horizontal | One dolly push: UI genesis → data-bar floor flyover → 3-palette portal tunnel → iris collapse → folded landscape | `shapeMorphCollapse` chain — highest technique density per frame in the corpus, zero real cuts |
| `B_logo-sage-library` | byshubh | 6.0s | horizontal | An open book shatters mid-air into ~10 product-shaped fragments (UI card, wireframe window, spheres) that converge into the mark | `fragment-shatter-reform` — every stage crisp and legible, argues the brand's value from its own visual vocabulary |
| `Kirschberg__A_absolutely-massive-effort-to-launch-this-c` | Kirschberg | 44.7s | horizontal | Discord Nitro rewards campaign spot: charging-orb intro, tumbling partner-logo card stack, chromatic-aberration transitions | commercial-grade identical-container montage of partner brands + glitch transitions — best-produced long-form piece in the corpus |
| `Kirschberg__B_yummy-yummy-most-slop-please` | Kirschberg | 53.1s | horizontal | SaaS launch film for "Fastlane": opens on an AI-agent chat prompt, radial burst of phone mockups on "Introducing Fastlane," then clean feature screens | `radialChatCluster` phone-mockup burst + agent-conversation-as-narrative-spine — structurally the closest thing in the corpus to the actual target deliverable |
| `jittervideo_A_introducing-superagents-remix-resize-trans` | jittervideo | 37.9s | horizontal | Real product capture: Jitter's own AI feature shown live — chat command types, canvas regrows a poster across 5 aspect ratios, a style picker warps the art | `cursorTravelClick`-style synthetic UI interaction proof at full software fidelity — the corpus's best real feature-launch demo |
| `mthblt_A_love-everything-about-this-website` | mthblt | 17.0s | horizontal | Real capture of a full WebGL 3D "world" product site: chunky rounded bubble-letter section titles over lush painterly biomes | bold kinetic wordmark title cards locked over full-bleed 3D environment — makes a section-title beat feel like an event, unlike anything else in the corpus |

### A-tier — solid. Second stop once S-tier is read.

| Slug | Designer | Duration | Orient. | What it is | Strongest technique |
|---|---|---|---|---|---|
| `A_best-launch-reel-2026` | byshubh | 13.0s | horizontal | Compilation of 6+ unrelated product launches unified by one persistent particle background | `particleFieldConnector` — makes disparate footage read as one authored reel; individual clips are uneven (a meme-ad segment drags it) |
| `A_explainer-ai-chatbot-wip` | byshubh | 6.1s | horizontal | Wordless problem cold-open (cursor drifts to a chatbot's close button) before a word-cycle headline lands | `dual-speech-chip-pairing` + wordless problem staging — text reads as payoff, not exposition |
| `A_explainer-zhylar-crm-cpq` | byshubh | 20.0s | horizontal | Stock-illustration SaaS explainer built on 3 cheap code-native tricks | `wordCycleSettle` 3-column slot machine — the single clearest, most legible instance of the corpus's #1-ranked technique; craft is dragged down by generic clip-art illustration |
| `A_how-to-dream-2d` | byshubh | 7.9s | horizontal | A glowing search-bar prompt's send button morphs icon→orb→background→result card | `click-becomes-loader-morph` — premium warm-gradient aesthetic, fully legible at 720p |
| `A_not-your-average-ui-animation` | byshubh | 5.9s | horizontal | Glassy stat-cards accrete one at a time on a radiating gradient bloom, then the cluster tilts into 3D isometric | `flattenToIsometric` — crisp, well-lit, the clearest "flat mock becomes live dashboard" reference |
| `A_shipping-8-launch-videos` | byshubh | 3.7s | horizontal | Flat-vector persona/step-relay pipeline (Strategist→Writer→Designer→Editor→Manager) | `stepRelayAdvance` + `radialChatCluster` — instantly legible multi-step workflow narrative |
| `A_showreel-snippet` | byshubh | 8.0s | horizontal | 12+ unrelated marketing-email screenshots ride one fixed phone-card container | `conveyorSlide` match-cut-by-construction — high production polish, mechanism generalizes to any multi-item showcase |
| `B_dynamic-typography-d3` | byshubh | 10.9s | horizontal | One word ("BATMAN"), locked position, cycles ~35-40 typefaces via blur+shear swap | `fontSwapBlur` — category leader for kinetic typography, extremely clean high-contrast reference |
| `B_galactic-motion-art` | byshubh | 7.9s | vertical | "GALACTIC" event-poster teaser: glitch title intro, stepped material-swap montage on an illustrated figure | `stepped-treatment-stutter-montage` — legible despite heavy grain; pure brand-poster mood, no product/UI content |
| `B_logo-streetwear` | byshubh | 7.0s | horizontal | 4 dots converge into a ring-chain badge, then a 6-frame strobe flips to a distressed glowing wordmark | `dot-converge-ring-badge` + `strobe-restyle-transition` — graded final export, crisp |
| `B_trippy-abstract-type` | byshubh | 7.7s | vertical | Static-camera 3D chrome "A0" mark re-skins every 4-11f; locked-block kinetic type; datamosh passage | `glitchMaterialMorph` — high craft, edgy personal-brand feel, weak fit for a clean software launch |
| `evanplace_A_eventbrite-update-from-one-of-my-favorite` | evanplace | 53.0s | horizontal | Brand-relaunch reel: colour-swatch catalogue, photo-collage-becomes-jumbotron reveal, bold flat-color cards | fast hard-cut-on-beat pacing (64 cuts) — strongest long-form counter-example to the corpus's usual continuous-take convergence |
| `jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge` | jittervideo | 10.5s | horizontal | A CSV file drops onto a poster, which pulses and multiplies into a grid of localized variants | file-drop metaphor + identical-container multiply — dense, directly reusable for any "one input → N outputs" claim |
| `mthblt_A_extremely-happy-to-see-this-website-coming` | mthblt | 18.1s | horizontal | Real Apple AirPods product-page capture: pinned-header scroll, crossfade/zoom section transitions | scroll-pinned crossfade-as-camera-move — Apple-grade reference for staging a hardware feature beat |
| `mthblt_B_jitter-2024-powered-by-jittervideo-magic` | mthblt | 33.4s | horizontal | Fast (43-cut) flat-UI feature reel for Jitter's 2024 recap | "the on-screen word performs its own effect" micro-demos — good structural model for a feature-by-feature launch reel |

### B-tier — ordinary/competent, or a valid study with narrow scope. Read only if S/A doesn't cover your need.

| Slug | Designer | Duration | Orient. | What it is | Strongest technique |
|---|---|---|---|---|---|
| `A_2d-animation-growth-hack` | byshubh | 12.3s | horizontal | Persistent 2×2 quadrant grid (chatbot / brand-mark / dashboard / proof cards) | `quadrant-proof-grid` — legible but generic stock-style dashboard mocks |
| `A_launch-video-wip-vertical` | byshubh | 6.5s | vertical | Raw phone recording of a tilted laptop screen, keyboard visible in frame | sentence-builder text anim, only semi-legible through the filmed screen |
| `A_micro-elements-animations` | byshubh | 2.75s | square | 7 sci-fi HUD widgets (counter, coordinate readout, star-lattice) draw on in a 4f stagger | `perpetual-telemetry-counter` — clean but narrow, ambient dressing not a product narrative |
| `A_recent-motion-4k-vertical` | byshubh | 9.4s | vertical | Phone-camera recording of a monitor: red threat bubbles arrive, a shield blocks them | `seamless-rackfocus-loop-bookend` — good idea, compromised by camera bezel eating ~60% of frame |
| `B_logo-aim` | byshubh | 6.1s | horizontal | An arrow flies in and snaps a target/crosshair mark into place, then fractures into a wordmark | clean geometric snap-to-place, modest scope, short (91f) |
| `B_logo-holo` | byshubh | 4.2s | horizontal | Wordmark loop ("holo.") with pulsing conic-gradient + hue-shifted echo stroke | simple glow trick, one move, holds dead for ~2.5s |
| `evanplace_A_8-the-trailers-a-one-stop-site-for-all-you` | evanplace | 9.9s | horizontal | Streaming-app UI (search, hero card, trending rail) pinned over a blurred autoplaying trailer | foreground-chrome-over-blurred-ambient-video trick, otherwise generic mock |
| `evanplace_A_making-an-effort-to-share-more-work-some-s` | evanplace | 8.9s | vertical | Live-action merch photography (t-shirt, cutting mat) shot as one continuous "zoom into moodboard" move | camera-move-hides-4-cuts disguise; physical merch, not UI/feature content |
| `evanplace_A_web-design-for-momentum` | evanplace | 12.3s | horizontal | Sequence of static full-bleed website screenshots (hero/integrations/testimonials), hard cuts | none — literally a slideshow, zero scroll/parallax simulated; useful only as a content-structure reference |
| `evanplace_B_a-logo-animation-of-openais-logo` | evanplace | 7.9s | horizontal | Cold-opens on finished OpenAI lockup, cuts to black, dot-spinner rebuilds into the mark | `loading-spinner-to-mark` morph, clean but logo-only |
| `evanplace_B_figured-out-how-to-do-it-in-figma-thanks-f` | evanplace | 6.0s | square | Photoreal flocked 3D fruit mascot, static camera, one fuzzy "spike" grows for 6s | rich fur-shading render, but one move for the whole clip |
| `evanplace_B_had-a-lot-of-fun-working-on-the-speaker-an` | evanplace | 20.0s | horizontal | Flat icon-builds from shared primitives (bars/semicircles/petals), hold, dissolve to a point, repeat | `point-to-icon-build-and-collapse` chain — cheap, clean continuity, could inform a feature-bullet montage |
| `evanplace_B_had-the-privilege-of-creating-the-speaker` | evanplace | 20.0s | horizontal | Locked-off shot: a robot arm assembles a 3-part cartoon character via color-coded blob→capsule morphs | `conveyor-part-morph-build` — novel assembly metaphor, character/mascot piece not product-relevant |
| `evanplace_B_sound-on-logo-animation-we-did-for-chatprd` | evanplace | 5.9s | horizontal | Blur-spin flourish resolves into two circles that interlock into ChatPRD's mark by frame 50 | `blur-spin-resolve-to-mark` — fast and clean, but thin: one build move then a long static-ish hold |
| `evanplace_B_the-latest-chapter-ive-joined-weareoffmenu` | evanplace | 13.0s | horizontal | Grayscale sphere-onto-cube icon snap-morphs via iris-sweep into a static title card | `iris-sweep morph-to-title` front half is clean; back half is a long dead hold |
| `jittervideo_B_small-but-mighty-letter-spacing-animations` | jittervideo | 4.0s | vertical | Self-demo: repeating perspective type-wall receding above/below one legible instance | perspective type-wall re-skin, single-trick, "Made with Jitter AI" watermark baked in |
| `jittervideo_B_you-dont-always-need-to-start-from-scratch` | jittervideo | 67.7s | vertical | Talking-head tutorial + raw app screen-recording building one poster live | `noise-masked-pixelate` text reveal is genuinely stealable but buried in talking-head/UI-chrome runtime |
| `Kirschberg__A_new-site-designed-in-figma-built-in-cursor` | Kirschberg | 29.0s | horizontal | Real screen-recording of a portfolio site: card-grid reflows into a heart formation, click-to-expand case study | match-cut card-to-fullbleed expand — a website-interaction reference more than a motion-video reference |
| `mthblt_B_after-an-amazing-4-years-at-apple-im-happy` | mthblt | 15.5s | horizontal | Real Apple.com highlight reel (Vision Pro hero shots, silhouette-dancer transition) on a fast beat grid | scroll-checkpoint crossfade rhythm; mostly static hero-shot holds despite the fast cut count |
| `mthblt_B_the-team-put-in-so-much-work-and-effort-to` | mthblt | 6.0s | horizontal | Real Apple.com/Vision Pro capture: hero page, silhouette dancer, spec layout | same silhouette-transition/spec-flash beats as `mthblt_B_after-an-amazing-4-years-at-apple-im-happy` — near-duplicate source, lower priority |

### C-tier — skip. See Skip list below for reasons.

DELETED from the corpus (sourced no technique, pure context cost): `A_2d-loop-piece`, `evanplace_A_not-only-did-we-build-this-brand-in-2-week`, `evanplace_B_know-i-posted-a-thank-you-earlier-today-bu`.

KEPT but do not view — technique provenance only: `A_sparkle-vertical` (ConcentricRings), `B_logo-wip` (FillToStroke), `jittervideo_B_recreating-this-fifa-logo-animation-took-j` (ConcentricShapeBurst).

---

## Start here, by job

### Text-heavy tool launch (product is a capability, words carry it)
1. **`A_explainer-zhylar-crm-cpq`** — the corpus's clearest, most legible `wordCycleSettle` 3-column slot machine; steal the technique, ignore the clip-art illustration.
2. **`jittervideo_A_introducing-superagents-remix-resize-trans`** — proves the capability by showing real software obey a real command, instead of asserting it in a headline.
3. **`mthblt_B_jitter-2024-powered-by-jittervideo-magic`** — "the word performs its own effect" gimmick turns a feature list into visual proof, sustained across 43 cuts.
4. **`A_shipping-8-launch-videos`** — best reference for a multi-step workflow/pipeline narrative (step-relay + radial chat cluster).

### Visual product / UI feature launch
1. **`jittervideo_A_introducing-superagents-remix-resize-trans`** — real software, real cursor interaction, live canvas mutation; the best overall reference for this job.
2. **`A_connect-to-figma-ui-anim`** — the cleanest logo-to-product-UI transition in the corpus, zero cuts, fully legible dialog text.
3. **`A_not-your-average-ui-animation`** — stat-card accretion + isometric tilt is the sharpest "flat mock becomes live dashboard" move available.
4. **`jittervideo_A_new-this-week-bulk-create-drop-in-a-csv-ge`** — file-drop metaphor for "one input → many outputs" claims.

### Logo & brand lockup
1. **`B_logo-sage-library`** — best-in-corpus; the shatter/reform mechanic argues the brand's value from its own visual vocabulary before the wordmark even appears.
2. **`B_chromatic-logo-2d3d`** — highest production value in the corpus; genuine 3D-chrome material work, not a mockup.
3. **`B_logo-streetwear`** — dot-converge + hard strobe identity-flip, a clean graded final export (compare against `B_logo-wip`, its own raw screen-recording — skip that one).
4. **`B_logo-aim`** — cheapest, cleanest option if budget is near zero: one arrow-snap, one fracture-reform.

### Kinetic typography
1. **`B_dynamic-typography-d3`** — category leader; one locked word, ~35-40 typeface swaps, extremely clean high-contrast reference.
2. **`B_trippy-abstract-type`** — pairs a static-camera material re-skin with locked-block (never per-letter) type stacking.
3. **`mthblt_A_love-everything-about-this-website`** — bold rounded kinetic wordmark title cards over a full 3D environment; best "chapter title as event" reference.
4. **`jittervideo_B_small-but-mighty-letter-spacing-animations`** — narrow but clean single-trick perspective type-wall study.

### Long-form (over 35s)
1. **`Kirschberg__A_absolutely-massive-effort-to-launch-this-c`** (44.7s) — the corpus's most commercially polished long-form piece; partner-logo montage + glitch transitions sustain energy for the full runtime.
2. **`Kirschberg__B_yummy-yummy-most-slop-please`** (53.1s) — structurally the closest match to an actual SaaS launch video: agent-conversation spine, radial phone-mockup burst, feature screens.
3. **`jittervideo_A_introducing-superagents-remix-resize-trans`** (37.9s) — sustains a single real feature demo without repeating beats.
4. **`mthblt_B_jitter-2024-powered-by-jittervideo-magic`** (33.4s) — feature-reel pacing model, 43 cuts, never lets a capability sit still more than ~1.3s.

---

## Best-in-corpus by pattern family (PATTERNS.md §1)

| # | Family | Best reference |
|---|---|---|
| 1.1 | Shape/material continuity morph | `A_connect-to-figma-ui-anim` — `logo-to-icon-morph` |
| 1.2 | Assembly & shatter from constituent parts | `B_logo-sage-library` — `fragment-shatter-reform` |
| 1.3 | Progressive & substitutive text reveal | `A_explainer-zhylar-crm-cpq` — `wordCycleSettle` |
| 1.4 | Typeface/material-as-subject | `B_dynamic-typography-d3` — `fontSwapBlur` |
| 1.5 | Shape-driven masking & non-rectangular reveals | `B_editors-loop-3d-camera` — `shapeMorphCollapse` chain |
| 1.6 | Camera-through-space / never-cutting take | `B_editors-loop-3d-camera` — full continuous dolly |
| 1.7 | Ambient perpetual motion under static holds | `A_micro-elements-animations` — `perpetual-telemetry-counter` |
| 1.8 | Synthetic UI interaction proof | `A_connect-to-figma-ui-anim` — `cursorTravelClick` + `stateSwap` |
| 1.9 | Radial/polar concrete-object placement | `A_shipping-8-launch-videos` — `radial-question-bubbles` (also see `Kirschberg__B_yummy-yummy-most-slop-please`'s phone-mockup burst for a launch-video-specific variant) |
| 1.10 | Identical-container montage | `A_showreel-snippet` — `conveyorSlide` |
| 1.11 | Loop bookending | `A_recent-motion-4k-vertical` — `seamless-rackfocus-loop-bookend` (technique is clean; note the source clip itself is a phone-camera capture with bezel in frame) |
| 1.12 | Glitch/strobe/flash as transition disguise | `B_chromatic-logo-2d3d` — `bloom-invert-morph-transition` |

---

## Skip list

Do not spend context on these. Reasons grounded in what the frames actually show:

- **`evanplace_B_know-i-posted-a-thank-you-earlier-today-bu`** — confirmed: all 1748 frames (58.3s) are one unbroken raw selfie talking-head recording. No cuts, no graphics, no text overlay, no authored motion of any kind. This is the corpus's literal unedited talking-head take.
- **`evanplace_A_not-only-did-we-build-this-brand-in-2-week`** — confirmed: 100% unedited raw gameplay capture of a browser game (score ticking, sprite dodging obstacles). Zero authored motion beyond a static mock-browser-chrome frame and logo lockup at the very top.
- **`A_sparkle-vertical`** — a raw After Effects screen capture; roughly 50%+ of every frame is IDE chrome (viewport, timeline, parameter graphs), not content. The one usable render-preview panel is a small fraction of frame area.
- **`B_logo-wip`** — the same "DILATION" brand build as `B_logo-streetwear`, but as an uncropped OBS/After Effects screen recording with a floating control window eating ~40% of every frame. `B_logo-streetwear` shows the identical moves already graded and clean — read that instead.
- **`jittervideo_B_recreating-this-fifa-logo-animation-took-j`** — a talking-head tutorial; the large majority of sampled frames are static chat-bubble screenshots with word-by-word caption overlay, not motion. The one finished result shown is a derivative of an existing trademarked FIFA animation, not original craft worth studying.
- **`A_2d-loop-piece`** — a pixel-identical duplicate of `A_how-to-dream-2d` (confirmed frame-for-frame at matching timecodes). Read `A_how-to-dream-2d`; this one adds nothing.

Also de-prioritize (not worthless, just redundant or thin): `mthblt_B_the-team-put-in-so-much-work-and-effort-to` overlaps heavily with `mthblt_B_after-an-amazing-4-years-at-apple-im-happy` (same source site, same beats) — read one, not both. `evanplace_B_sound-on-logo-animation-we-did-for-chatprd` and `B_logo-holo` are each a single clean move followed by a long static hold — fine for a 5-second study, not worth more time than that.

# Motion principles

Rules, not suggestions. Each one exists because breaking it is the difference
between "made by a designer" and "made by a developer who added animation".

An LLM cannot see motion. It can, however, follow numeric law. That is what this
document is: the taste, written down as numbers.

---

## 1. Timing

| what | duration |
|---|---|
| micro — icon pop, chip, checkbox | 8–12f |
| element — card, one line of text | 14–20f |
| scene — a full layout settling | 24–36f |
| hero — logo lockup | 40–60f |
| exit | ~60% of the matching entrance |

- **Minimum shot: 11f (0.37s).** Shorter is a flash, not a shot.
- **Default shot: 24–45f.** Under 24f nothing can be read; over 60f without a
  new event, attention drops.
- **Stagger: 2–4f.** 6f+ is sluggish. 1f reads as simultaneous.
- **Hold 6–10f after a settle** before cutting. The eye needs to land before
  it's moved. This is the most commonly skipped rule and the most damaging.
- Never give two consecutive shots the same length — the edit goes metronomic.

## 2. Easing

- **Nothing is linear.** The only exceptions: continuous rotation, marquee,
  gradient drift.
- Entrances `expoOut` or a spring. Exits `expoIn`, and faster.
- **Overshoot 3–6% on anything that lands.** Zero overshoot reads as mechanical;
  15% reads as a toy.
- Springs for physical objects (cards, panels, icons). Beziers for reveals and
  camera. Don't mix within one element.

## 3. What may animate

- **Opacity never animates alone.** Always paired with transform, blur, or a
  mask. A bare cross-fade is the clearest tell of unconsidered motion.
- **Text reveals per line, through a mask** — not per letter, not by fading.
  Exactly one per-letter moment per video, on the single word that matters.
- Prefer masking over moving. A `clip-path` reveal where content stays put
  reads more expensive than the same content sliding.
- Blur resolves over the first ~60% of an entrance, not the whole thing.

## 4. Nothing is ever still

- **Every shot runs at least one ambient move** — camera drift, breathe,
  gradient drift, grain. The analyzer's "held / static stretches" section is a
  bug list, not an observation.
- Ambient amplitude is small: camera drift ≤1.5%, breathe ≤1.5% scale,
  drift period 120–400f. If you can consciously see it, it's too much.
- One camera move per shot. Two competing camera moves read as a mistake.

## 5. Depth

- Depth comes from **blur + scale + shadow**, not from z-index alone.
- Soft shadow on floating UI: `0 18px 48px rgba(0,0,0,0.18)`. One shadow, not
  three.
- CSS 3D tilt on panels: keep ≤14°. More looks like a template.
- Parallax: tie layer offset to the shared camera drift so depth is consistent
  across the whole frame.

## 6. Rhythm and the edit

- Pick a bpm and stick to it. **120bpm at 30fps = a cut every 15f.** All cuts
  land on multiples. This is true even with no audio — the eye feels the grid.
- Contrast consecutive shots on at least one axis: light↔dark, wide↔tight,
  static↔fast, text↔visual. Two similar shots in a row waste both.
- **Match cuts are the strongest transition.** Align a shape across the cut —
  circle→circle, card→card, ring→dial. Cheap to build, reads as expensive.
- Energy curve should rise. Slowest shot first, fastest cluster at ~70%, then a
  long held end card.
- Transitions are punctuation, not content. If a transition is more interesting
  than the shots either side of it, cut them and keep the transition.

## 7. Colour

- **Three colours max**: background, ink, accent. Plus at most one support tint.
- The accent appears **2–3 times in the whole video**. An accent used everywhere
  is not an accent.
- Invert once — a single dark shot inside a light film (or vice versa) is worth
  more than any transition effect.
- Never pure `#000` on pure `#FFF`. Off-black and off-white read as considered.

## 8. Typography

- One family. Two weights maximum.
- Headline occupies **35–50% of frame width**. Smaller reads as a slide; bigger
  and it stops being typography and becomes a shape (which is fine, but be
  deliberate about it).
- Tracking tight on display sizes (−2 to −3%). Default tracking at display size
  is the most common amateur tell.
- Max 2 lines per card, 6 words per line. If the copy doesn't fit, the copy is
  wrong — cut it, don't shrink it.
- Set type on a baseline grid shared with the layout margins.

## 9. Treatment (the last 15%)

Applied in this order: content → bloom → chromatic → grain → vignette.

| treatment | amount |
|---|---|
| film grain | 0.04–0.07 opacity, animated (reseeded per frame) |
| vignette | 0.12 |
| chromatic aberration | ±1.5px, masked to frame edges only |
| bloom | accent-coloured elements only, radius 18px, intensity 0.5 |

Grain is the highest value-per-line item in the whole system. Pure CSS gradients
look plasticky; grain fixes that in one component.

## 10. Category-specific

### Text-heavy tools (skills, CLIs, agents, docs) — the hard case
The product is a capability, so words carry the load. That does not license
boring.

- **Never put a full sentence on screen at once.** Stage it: subject appears,
  then the verb lands with the visual, then the object. The sentence assembles.
- **Every abstract claim gets one concrete visual object.** "Validates ideas" →
  a card with a tick drawing on. "Generates PRDs" → a document filling with
  masked lines. Abstract + abstract is where these videos die.
- **`WordSwap` is the workhorse.** One slot, N words rolling through it, holds
  the layout still while the meaning changes. Use it for capability lists
  instead of a bulleted reveal.
- **Typewriter is legitimate but must be earned** — only where a human would
  actually be typing (prompt, terminal, chat input). A headline that types
  itself is a cliché. Jitter the rate; pause on punctuation.
- Show the *tool being used*, not the tool's feature list. A prompt going in and
  an artefact coming out beats any amount of describing.
- Give text a spatial home: a card, a rail, a terminal, a document. Text
  floating on a gradient is a slide.

### Visual products (app / web feature) — the easy case
- The interface is the hero; get to it inside 2 seconds.
- Never show the whole UI at real scale for long. Establish once, then
  `DollyToUI` into the specific control that matters.
- **Choreograph a synthetic cursor.** A real screen recording cannot land on a
  beat grid; a fake pointer can. Ripple on click.
- Fake depth on the panel: tilt ≤6°, soft shadow, subtle idle wobble. A flat
  screenshot pasted on a gradient reads as a mockup, not a product.
- Animate the UI's own state changes (a number counting, a row inserting, a
  toggle flipping) rather than animating the screenshot as one image.

---

## 11. Rendering discipline

- 30fps. All durations are integer frames. Never compute a duration from a
  float second value at the leaf level.
- Deterministic only. No `Math.random()` and no `Date.now()` in a composition —
  seed from `frame` or from the element index instead, or renders won't
  reproduce and frames will flicker.
- Every value derives from `useCurrentFrame()`. No CSS transitions, no
  `requestAnimationFrame`, no animation libraries with their own clock.
- Wrap moved elements in `willChange` for transform/opacity/filter.
- Final grade, grain-on-encode, and film-look go through the ffmpeg post pass,
  not through more CSS.

## 12. Self-review loop

After every render, before showing anyone:

1. `analyze.py` the output. Read the generated `profile.md`.
2. **Any "held / static stretch" is a bug.** Fix it with an ambient move.
3. Check the shot table: any shot under 11f that wasn't meant as a flash, any
   two consecutive shots of identical length, any `linear/constant velocity`
   classification that wasn't a deliberate loop — all bugs.
4. Read the contact sheet as a grid. Composition problems that are invisible in
   motion are obvious in a still grid: crowded frames, inconsistent margins,
   type too small, two shots that look identical.
5. Check the motion sparkline shape against the intended energy curve. If you
   wanted rising energy and the sparkline is flat, the edit is not doing what
   you think it is.
---

## 12b. The analyzer is a bug-finder, not a score

`analyze.py`'s motion mean is **not** a quality metric and higher is not better. A
strong 43s reference measures mean motion **1.1** with three hard cuts; a busier
26s piece measures 2.7 with twelve. The calmer one is not worse — it is calmer.

Use the analyzer for what it can actually settle:
- frozen stretches (a real defect)
- shots below the minimum length that were not meant as flashes
- two consecutive shots of identical length
- a `linear/constant velocity` classification that was not a deliberate loop
- whether the energy curve matches what you intended

Do not tune a video to raise a number.

## 13. Traps that only rendering catches

Every one of these compiled cleanly, typechecked, and read correctly in the code.
All were found by rendering and looking. None would have been found by review.

**A component can lay out perfectly and draw nothing.**
`FlattenToIsometric` rendered an empty cell. Outlining it proved the wrapper was
the right size in the right place and its *children* had collapsed: a percentage
width on an empty div inside a content-sized grid/flex track resolves against an
indefinite basis and computes to **zero**. Give the track a definite size, or use
px. I blamed contrast first and was wrong — instrument before theorising.

**Same-fill copies occlude each other.**
`ConcentricShapeBurst` duplicates a silhouette 18× at different scales. With an
opaque fill the largest copy covers every smaller one and the whole effect is
invisible. Pass a stroked or semi-transparent shape.

**A loop move must take the frame modulo its cycle.**
`RackLoop` shipped with a triangle wave over `frame / totalF`. Past `totalF` it went
negative, clamped, and sat at maximum blur forever — a seamless-loop move that did
not loop. Any perpetual move needs `frame % cycle`.

**Most moves are one-shot; a shot built only from those will freeze.**
Of 15 moves in `narrative.tsx`/`layout.tsx` only five are perpetual (`LiveCounter`,
`AsyncDrift`, `ParticleField`, `RadialCluster` idle, `RackLoop`). Rule 4 above
("nothing is ever still") is not satisfied by picking any five moves — check that
at least one of them keeps running.

**Ambient motion is sequence-local by default.**
`useCurrentFrame()` inside a `<Sequence>` restarts at 0, so per-shot gradient and
camera drift resets at every cut and the background visibly jumps. Pass the shot's
absolute start frame in as a phase offset.

**A correctly-timed sound can still be inaudible.**
The cursor click sat on the exact right frame and measured **1.2× above the music
bed** — inaudible, so the ear paired the cursor with the nearest loud transient
instead and the click read as badly mistimed. Retiming could never have fixed it.
Measure SFX against the bed in the sound's own frequency band, not just its frame.

**Loudness normalisation will flatten a deliberate mix.**
Single-pass `loudnorm` applies *dynamic* gain: it pulled a ducked open up by 14 dB
and collapsed loudness range from 14.9 to 3.4 LU, destroying the drop. Use two-pass
with `linear=true`.

**Drift can push content out of frame.**
A camera drift of ±1.8% with only 1.03 base zoom revealed empty edges and clipped a
word off the right side. The base zoom has to exceed the drift amplitude.

The pattern: **every defect above was invisible in the source and obvious in a
render.** Budget for the render-and-look step; it is not a formality.
---

## 14. Three disciplines that are not pattern families

Rejected as PATTERNS.md families because each is a rule that applies across all
families rather than a recurring composition. They live here instead. Sources are
in `pipeline/patterns-parts/`.

**Emphasis budget.** Inside a block of body copy, exactly ONE phrase gets a
different treatment — a colour and an underline, nothing more. The style is
**static**; the entrance move supplies the motion. Styling three phrases in a
paragraph spends the emphasis budget and none of them reads as emphasised. This is
the same rationing rule as "one per-letter moment per video" and "the accent
appears 2–3 times" — the general form is that emphasis is a fixed budget per
frame, not a property you can apply repeatedly.
Source: `B_logo-streetwear` (`single-keyword-link-styling`).

**Stepping on twos.** Quantise the driving frame before it reaches any
`interpolate()` call:

```ts
const held = Math.floor(frame / 2) * 2;   // then use `held` everywhere
```

Halves the effective frame rate for that element, which reads as deliberate,
hand-drawn cadence rather than as a dropped frame. Traditional animation calls
this "on twos". Use it for a whole shot or not at all — mixing stepped and smooth
elements in one frame reads as a performance problem, not a choice. Do not combine
it with spring physics, which needs every frame to settle correctly.
Source: `B_trippy-abstract-type` (`stepped-hold-on-twos`).

**Mark-alone sign-off.** The closing convention: fly the wordmark and any
supporting text out, keep the mark alone, and let the root composition ease from
`scale 1.1 → 1.0` while drifting slightly off-centre. Composition of existing
moves (`flyOut` + `pullOut`), not a new mechanism — but it is the corpus's default
ending and worth knowing as a convention rather than re-deriving it.
Source: `B_logo-aim` (`mark-alone-sign-off`).
---

## 15. Two mistakes found only by a person watching

Both of these passed the analyzer, rendered without error, and looked defensible
in a still frame. A human watching the output caught them in seconds. Recorded
because both generalise well beyond the moves they were found in.

### Never ease an index

Easing a continuous value is correct. Easing an **integer index** is not: the
easing curve quantises into wildly uneven steps, and you cannot see that in the
code.

`WordCycle` eased a word index with `expoOut` over 34 frames. The resulting holds,
in frames, were:

```
[1, 1, 0, 1, 1, 2, 2, 3, 23, 1]
```

One candidate never rendered at all. Most flashed for 33ms — below the threshold
at which a word can be read. And the word the move exists to **land on** got a
single frame at the end, because `floor(p * n)` only reaches `n` on the final
frame. The move was not "too quick", it was broken.

**Fix:** compute the schedule explicitly. Growing weights, a floor on the minimum
hold, and the final state keeping the remainder:

```
holds  6f  10f  13f  →  lands at f29 and holds 19f
```

**Rule:** any move that steps through discrete states needs a minimum hold of
**5 frames (~170ms)** per state, and the landing state must be given the remainder
of the window explicitly, never inferred from the curve.

### Blur is relative to feature size, and only masks one direction

`FontSwapBlur` used a 7px-default-turned-26px blur on 30px text. 26px exceeds the
glyph height, so the word became unreadable mush rather than a masked transition.
It also keyed blur off distance to the *nearest* swap, so it blurred on the way in
as well as out and the word pulsed continuously instead of flicking once per change.

**Rules:**
- Peak blur should stay under **~25% of the feature's size** — for 30px type that
  is 7px, not 26px. A masking blur is meant to hide one frame of change, not to be
  seen.
- Decay **after** the event only. The new state exists from the event frame onward,
  so that is the only side needing a mask. Symmetric decay reads as a pulse.
- For a change in horizontal metrics, `scaleX` squash reads as the letterforms
  changing width, which is what is actually happening. `skewX` reads as the whole
  word tipping over.

The general point: **the analyzer cannot see either of these.** Both produce
healthy motion curves and no frozen frames. Showing a rendered video to a person
remains the only way to catch them, which is why `MovesSmoke` renders as video
rather than as a still grid.

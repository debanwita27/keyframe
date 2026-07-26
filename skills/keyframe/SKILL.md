---
name: keyframe
description: Generate launch videos, product promos and motion-design pieces in code with Remotion — no After Effects. Use when asked to make a launch video, product/feature announcement video, explainer, logo animation, kinetic-type piece, or motion graphics; when scoring a video to music or syncing cuts to a beat; or when reviewing/critiquing a rendered video's motion, timing or mix.
---

# Keyframe

Launch videos built in code. The premise: you cannot *see* motion, but you can
follow numeric law and read a still grid. So every step here converts motion into
**numbers** (frame counts, named easings, measured velocity) and **contact sheets**
(frames as a timecoded grid) — both of which you can act on.

## Do this in order. Do not skip step 5.

### 1. Establish the category

Two kinds of launch video, and they need opposite treatment:

- **text-heavy tool** (skill, CLI, agent, docs) — the product is a *capability*, so
  words carry the load. Never put a whole sentence on screen at once; stage it.
  Every abstract claim gets one concrete object. Typewriter only where a human
  would really be typing.
- **visual product** (app, web, feature) — the interface is the hero, on screen
  inside 2 seconds. Establish once, then push into the one control that matters.
  Choreograph a synthetic cursor; a real screen recording cannot land on a beat.

### 2. Read the law before writing any code

- `references/PRINCIPLES.md` — the taste, written as numbers. Timing table,
  easing rules, what may animate, treatment amounts. Non-negotiable.
- `references/PATTERNS.md` — 12 pattern families aggregated across 50 reference
  videos by five working designers, with a ranked table of the most transferable
  techniques and which ones **multiple independent designers converge on**.
  Convergent patterns are the strongest signal available; prefer them.
- `references/MOVE_VOCAB.md` + `references/MOVE_VOCAB_ADDITIONS.md` — ~45 + ~25
  named moves with exact parameters. **Compose from these.** Hand-rolled
  `interpolate()` calls in a composition are how motion ends up looking like 2015
  PowerPoint; the vocabulary has defaults that already carry taste.

### 3. Write the spec before the code

Use `references/SPEC_TEMPLATE.yaml`. The same schema describes a reference and
authors new work, so you can read 50 examples of the thing you are about to write.
Shot list, beats per shot, moves per shot with frame counts.

Express shot lengths in **beats, not frames**. That is what lets the music change
without breaking the edit.

### 4. Build and render

```bash
python3 scripts/make_sfx.py                      # synthesised SFX, no licensing risk
./scripts/set_music.py <track.mp3> --at <sec>    # locks the edit to real beat times
./scripts/build.sh <track.mp3> <name> --at <sec> # set track + render + master + verify
```

`build.sh` verifies the frame count matches the track, because `set_music.py`
rewrites the beat grid globally and rendering after setting a *different* track
silently produces a mislabelled file.

### 5. Critique your own output — this is the whole method

```bash
python3 scripts/analyze.py <rendered.mp4> --out out-analysis
```

Then **read `profile.md` AND look at the contact sheets with the Read tool.**

On the first cut of the reference film this caught: 672 dead frames, a 3-second
section with literally zero movement, type too small for the frame, dark cards
invisible on a dark background, a synthetic cursor that never reached the button it
was supposed to click, and ambient drift pushing a word off the right edge. **None
of it was visible from reading the code.**

Treat as bugs:
- any **frozen stretch** (flat on all three motion scales)
- any shot under 11f that wasn't meant as a flash
- two consecutive shots of identical length — the edit goes metronomic
- a `linear/constant velocity` classification that wasn't a deliberate loop
- a flat motion sparkline when you intended rising energy

Composition problems invisible in motion are obvious in a still grid. Always look.

## Non-negotiables

- **30fps, integer frames.** Every value derives from `useCurrentFrame()`.
- **Deterministic.** No `Math.random()`, no `Date.now()` in a composition — seed
  from the frame or the element index, or frames flicker and renders don't
  reproduce.
- **Opacity never animates alone.** Always paired with transform, blur or a mask.
- **Nothing is linear** except continuous loops (rotation, marquee, drift).
- **Every shot runs at least one ambient move.** A still frame reads as a broken
  render, not as calm.
- **Ambient motion uses a shot-phase offset.** `useCurrentFrame()` inside a
  `<Sequence>` is sequence-local, so per-shot ambient restarts at phase 0 and the
  background visibly jumps at every cut.
- **Text reveals per line, through a mask.** One per-letter moment per video, max.
- **Three colours**: background, ink, accent. The accent appears 2–3 times total.

## Audio

- `scripts/analyze_audio.py` ranks tracks by **beat confidence** (0..1). Below
  ~0.55 a track has no pulse you can cut to — pick another.
- Derive shot lengths from **detected beat times**, not a nominal grid. A global
  tempo fit drifts; a window 70s into a track can sit a third of a beat off.
- Snap **shot-internal keyframes** to the beat too. Cuts on the beat with reveals
  starting +2..+8 frames later reads as the whole film being out of sync.
- **Verify SFX audibility, not just its frame.** A correctly-timed sound measuring
  1.2× above the music bed is inaudible, and the ear will pair the visual with the
  nearest loud thing instead. Measure in the sound's own frequency band.
- **Use the music rather than fighting it.** If a music hit collides with an
  on-screen action, move the action onto the hit — don't mute the beat. A hole in
  the music reads as a broken render.
- Master with **two-pass `loudnorm`, `linear=true`**. Single-pass applies dynamic
  gain and flattens a deliberate mix (measured: loudness range 14.9 → 3.4 LU).

## Licensing

- Music: check the tier. Free tiers almost never cover a company's launch video,
  and "internal only" is not "non-commercial" — subscription libraries list
  internal comms as a *paid business* use.
- Never commit source audio from a subscription library, and never redistribute
  reference videos. `fetch_refs.sh` and `fetch_music.sh` rebuild them locally.

## What this does not do yet

- **No vertical cut.** Shot layouts use pixel widths tuned to a 1920 frame; 9:16
  needs a per-shot layout pass.
- **3D renders but is unused.** `three` + `@react-three/fiber` + `@remotion/three`
  work headlessly. Chrome needs an **environment map** — without one,
  `metalness: 0.95` just reads dark.
- **Reference corpus skews to short-form social.** For pieces over ~35s, see the
  long-form structure notes in the `Kirschberg_` specs.

import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BEAT_DURATIONS, DUCK, MUSIC } from "./beatgrid";

/* ────────────────────────────────────────────────────────────────────────────
   THE MIX

   Layering happens here rather than in ffmpeg, because every sound needs to sit
   on a specific FRAME. Remotion gives frame-accurate placement and the mix stays
   versioned next to the edit. ffmpeg still does the master (loudnorm) in post.sh.

   Levels are deliberately conservative. SFX on a launch video should be felt,
   not noticed — if you can name the whoosh, it's too loud.
   ──────────────────────────────────────────────────────────────────────────── */

const CUTS = BEAT_DURATIONS.reduce<number[]>(
  (acc, d) => [...acc, acc[acc.length - 1] + d],
  [0],
);
const at = (shotIndex: number) => CUTS[shotIndex];

/** Frame the title flash lands on. */
export const DROP_F = at(2);
export const END_CARD_F = at(11);
export const TOTAL_F = CUTS[CUTS.length - 1];

type Hit = { file: string; f: number; vol: number; label: string };

/**
 * One entry per audible event. Kept as data so the mix can be read, audited and
 * retimed without touching JSX — and so a frame can be checked against the
 * shot list by eye.
 */
export const HITS: Hit[] = [
  // Shot indices after the blank-prompt beat was cut:
  //   0 typing · 1 submit · 2 title · 3 reframe · 4 rail
  //   5..10 capability beats · 11 end card

  // ── open: one sound, on the cursor's exact arrival frame — which is also a
  //    beat, so the click reinforces the track rather than fighting it.
  //    Measured: the old `tick` sat at 1.2x the music bed, i.e. inaudible, so the
  //    ear paired the cursor with the music hit that lands as it starts moving
  //    and the click read as badly mistimed. Loud + broadband fixes that.
  { file: "click", f: at(1) + 16, vol: 0.95, label: "cursor clicks send" },
  { file: "impact-soft", f: at(1) + 16, vol: 0.2, label: "click body" },

  // ── the drop. A riser fills the bar before the title; the impact lands on the
  //    flash frame. NO whoosh on this cut — it sat 21 frames before the underline
  //    whoosh and the two read as one doubled sound.
  { file: "riser", f: DROP_F - 31, vol: 0.5, label: "riser into title" },
  { file: "impact-deep", f: DROP_F, vol: 0.62, label: "title flash" },
  // the first whoosh in the film, on the accent underline one beat later
  { file: "whoosh-soft", f: DROP_F + 16, vol: 0.36, label: "Product OS underline draws" },

  // ── reframe: three role pills landing
  { file: "whoosh-soft", f: at(3), vol: 0.2, label: "cut to reframe" },
  { file: "tick", f: at(3) + 31, vol: 0.13, label: "pill 1" },
  { file: "tick", f: at(3) + 34, vol: 0.13, label: "pill 2" },
  { file: "tick", f: at(3) + 37, vol: 0.13, label: "pill 3" },

  // ── lifecycle rail: one soft tick per stage as the accent line passes it
  { file: "whoosh-soft", f: at(4), vol: 0.2, label: "cut to rail" },
  ...[0, 1, 2, 3, 4].map((i) => ({
    file: "tick",
    f: at(4) + 16 + Math.round((i * 70) / 5),
    vol: 0.12,
    label: `rail node ${i + 1}`,
  })),

  // ── capability beats. Only two cuts get a whoosh: the cuts are beat-locked, so
  //    the track's own transient marks the rest. Six identical whooshes in a row
  //    is what makes motion-design audio sound generic.
  { file: "whoosh-soft", f: at(5), vol: 0.24, label: "into the capability sequence" },
  { file: "whoosh-hard", f: at(8), vol: 0.2, label: "mid-sequence flip to dark" },
  // accents on things that would plausibly make a sound
  { file: "tick", f: at(5) + 31, vol: 0.2, label: "idea ticked" },
  { file: "impact-soft", f: at(6) + 24, vol: 0.22, label: "competitor card lifts" },
  { file: "impact-soft", f: at(7) + 16, vol: 0.26, label: "chips snap into order" },
  { file: "tick", f: at(8) + 24, vol: 0.16, label: "metric lands" },
  { file: "impact-soft", f: at(10) + 20, vol: 0.2, label: "wireframe solidifies" },

  // ── end card
  { file: "impact-deep", f: END_CARD_F, vol: 0.42, label: "end card" },
  { file: "sub-drop", f: END_CARD_F + 47, vol: 0.3, label: "outro sub" },
];

const Hit: React.FC<Hit> = ({ file, f, vol }) => (
  <Sequence from={Math.max(0, f)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
  </Sequence>
);

/**
 * Music bed. Ducks under the spoken-word-less open, dips almost to nothing for
 * the 30 frames before the flash, then punches to full on the downbeat — the
 * dip is what makes the punch register. Fades under the end card.
 */
const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, DROP_F - 34, DROP_F - 4, DROP_F, END_CARD_F, TOTAL_F],
    // Gains come from beatgrid.ts, sized to this track's own dynamics by
    // set_music.py. Reusing a hand-tuned envelope across tracks does not work:
    // a duck sized for a flat track flattens a dynamic one.
    [DUCK.open, DUCK.preRise, DUCK.dip, DUCK.body, DUCK.body, DUCK.outro],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <Audio src={staticFile(MUSIC.file)} volume={volume} />;
};

export const Mix: React.FC = () => (
  <>
    <MusicBed />
    {HITS.map((h, i) => (
      <Hit key={`${h.file}-${h.f}-${i}`} {...h} />
    ))}
  </>
);

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
export const DROP_F = at(3);
export const END_CARD_F = at(12);
export const TOTAL_F = CUTS[CUTS.length - 1];

type Hit = { file: string; f: number; vol: number; label: string };

/**
 * One entry per audible event. Kept as data so the mix can be read, audited and
 * retimed without touching JSX — and so a frame can be checked against the
 * shot list by eye.
 */
export const HITS: Hit[] = [
  // ── open: sparse. The narrative is someone typing, so almost nothing.
  { file: "tick", f: at(1) - 2, vol: 0.14, label: "cursor focus" },

  // ── the drop. A riser fills the last bar of the quiet section, the impact
  //    lands exactly on the flash frame, and a whoosh covers the cut itself.
  { file: "riser", f: DROP_F - 31, vol: 0.5, label: "riser into title" },
  { file: "impact-deep", f: DROP_F, vol: 0.62, label: "title flash" },
  { file: "whoosh-hard", f: DROP_F - 5, vol: 0.3, label: "cut into title" },

  // the accent underline sweeping in under the wordmark — one beat after the cut
  { file: "whoosh-soft", f: DROP_F + 16, vol: 0.34, label: "Product OS underline draws" },

  // ── reframe: three role chips landing
  { file: "whoosh-soft", f: at(4), vol: 0.2, label: "cut to reframe" },
  { file: "tick", f: at(4) + 31, vol: 0.13, label: "chip 1" },
  { file: "tick", f: at(4) + 34, vol: 0.13, label: "chip 2" },
  { file: "tick", f: at(4) + 37, vol: 0.13, label: "chip 3" },

  // ── lifecycle rail: one soft tick per stage node as the accent line passes
  { file: "whoosh-soft", f: at(5), vol: 0.2, label: "cut to rail" },
  ...[0, 1, 2, 3, 4].map((i) => ({
    file: "tick",
    f: at(5) + 20 + Math.round((i * 64) / 5),
    vol: 0.12,
    label: `rail node ${i + 1}`,
  })),

  // ── capability beats: a whoosh on every cut, alternating soft/hard so six
  //    cuts in a row don't sound identical
  // Only the first capability cut and the mid-sequence light/dark flip get a
  // whoosh. The other four cuts land on the beat, so the track's own transient
  // already marks them — six identical whooshes in a row is what makes motion
  // design audio sound generic.
  { file: "whoosh-soft", f: at(6), vol: 0.24, label: "into the capability sequence" },
  { file: "whoosh-hard", f: at(9), vol: 0.2, label: "mid-sequence flip to dark" },
  // the accents inside individual beats
  { file: "tick", f: at(6) + 34, vol: 0.2, label: "idea ticked" },
  { file: "impact-soft", f: at(7) + 22, vol: 0.22, label: "competitor card lifts" },
  { file: "impact-soft", f: at(8) + 14, vol: 0.26, label: "chips snap into order" },
  { file: "tick", f: at(9) + 26, vol: 0.16, label: "metric lands" },
  { file: "impact-soft", f: at(11) + 20, vol: 0.2, label: "wireframe solidifies" },

  // ── end card
  { file: "impact-deep", f: END_CARD_F, vol: 0.42, label: "end card" },
  { file: "sub-drop", f: END_CARD_F + 44, vol: 0.3, label: "outro sub" },
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

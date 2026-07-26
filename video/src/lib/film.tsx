import React from "react";
import { Sequence, useVideoConfig } from "remotion";

/* ────────────────────────────────────────────────────────────────────────────
   FILM / SHOT — sequencing without hand-computed frame offsets.

   Write shots as a list with durations. Offsets are derived. Add or remove a
   shot and nothing downstream breaks — which is the difference between a video
   you can iterate on and one you can't.
   ──────────────────────────────────────────────────────────────────────────── */

/** 120bpm at 30fps → a beat every 15 frames. Land cuts on this grid. */
export const BEAT_F = 15;
export const beats = (n: number) => Math.round(n * BEAT_F);

/** Snap a frame count to the nearest beat, never below the minimum shot length. */
export const snapToBeat = (f: number) => Math.max(MIN_SHOT_F, Math.round(f / BEAT_F) * BEAT_F);

/** Below this a "shot" is a flash, not a shot. */
export const MIN_SHOT_F = 11;

export type Shot = {
  /** short label — shows up in the Remotion studio timeline and in render logs */
  name: string;
  durF: number;
  render: React.FC;
  /** frames this shot overlaps the previous one, for cross-transitions */
  overlapF?: number;
};

export const Film: React.FC<{ shots: Shot[] }> = ({ shots }) => {
  let cursor = 0;
  return (
    <>
      {shots.map((s, i) => {
        const overlap = i === 0 ? 0 : (s.overlapF ?? 0);
        const from = cursor - overlap;
        cursor = from + s.durF;
        const Comp = s.render;
        return (
          <Sequence key={s.name + i} name={s.name} from={from} durationInFrames={s.durF}>
            <Comp />
          </Sequence>
        );
      })}
    </>
  );
};

/** Total duration of a shot list — feed straight into <Composition durationInFrames>. */
export const filmDuration = (shots: Shot[]) =>
  shots.reduce((acc, s, i) => acc + s.durF - (i === 0 ? 0 : (s.overlapF ?? 0)), 0);

/**
 * Development guard: warns in the studio when a shot violates the timing law.
 * Silent in renders.
 */
/**
 * `beatF` may be fractional — a real track is 120.2 BPM, not exactly 120 — so a
 * shot measured from detected beat times legitimately lands a frame off a
 * nominal grid. Tolerate 1 frame; more than that is a genuine timing mistake.
 */
export const auditShots = (shots: Shot[], beatF: number = BEAT_F) => {
  const problems: string[] = [];
  const offGrid = (d: number) => {
    const r = d / beatF;
    return Math.abs(r - Math.round(r)) * beatF > 1.0;
  };
  shots.forEach((s, i) => {
    if (s.durF < MIN_SHOT_F) problems.push(`${s.name}: ${s.durF}f is a flash, not a shot (min ${MIN_SHOT_F}f)`);
    if (offGrid(s.durF) && s.durF > MIN_SHOT_F)
      problems.push(`${s.name}: ${s.durF}f is off the ${beatF.toFixed(2)}f beat grid (nearest ${Math.round(s.durF / beatF) * beatF}f)`);
    if (i > 0 && shots[i - 1].durF === s.durF && s.durF > 30)
      problems.push(`${s.name}: same length as previous shot — the edit will feel metronomic`);
  });
  return problems;
};

/** Frame-space helper: turn seconds into frames at the comp's fps. */
export const useSec = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

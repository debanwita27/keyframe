import React from "react";
import { AbsoluteFill } from "remotion";
import { Film, Shot, auditShots, filmDuration } from "../../lib/film";
import { BEAT_DURATIONS, MUSIC } from "./beatgrid";
import { Mix } from "./mix";
import {
  S2_Typing,
  S3_Submit,
  S4_Title,
  S5_Reframe,
  S6_Rail,
  S7a_Ideas,
  S7b_Benchmark,
  S7c_Structure,
  S7d_Prd,
  S7e_Knowledge,
  S7f_Prototype,
  S8_End,
} from "./shots";

/**
 * Shot list. Durations come from `beatgrid.ts`, which measures the chosen music
 * window's ACTUAL detected beat times — so the edit is locked to the track and
 * cannot drift, rather than assuming a nominal 15f grid.
 *
 * Energy curve: quiet open → hard flash on the downbeat where the track's
 * strongest passage begins → capability beats alternating 2 bars / 1.5 bars →
 * long held end card over the outro.
 */
const RENDER: React.FC[] = [
  // S1_Blank is intentionally not in the film — the card entrance moved into
  // S2_Typing so the open is tighter. The component stays for reuse.
  S2_Typing,
  S3_Submit,
  S4_Title,
  S5_Reframe,
  S6_Rail,
  S7a_Ideas,
  S7b_Benchmark,
  S7c_Structure,
  S7d_Prd,
  S7e_Knowledge,
  S7f_Prototype,
  S8_End,
];

const NAMES = [
  "1 · the real question",
  "3 · submit",
  "4 · title",
  "5 · reframe",
  "6 · lifecycle rail",
  "7a · validate ideas",
  "7b · benchmark UX",
  "7c · structure problem",
  "7d · PRD + metrics",
  "7e · knowledge base",
  "7f · prototype",
  "8 · end card",
];

export const PRODUCT_OS_SHOTS: Shot[] = RENDER.map((render, i) => ({
  name: NAMES[i],
  durF: BEAT_DURATIONS[i],
  render,
}));

export const PRODUCT_OS_DURATION = filmDuration(PRODUCT_OS_SHOTS);

if (typeof window !== "undefined") {
  const problems = auditShots(PRODUCT_OS_SHOTS, (60 / MUSIC.bpm) * 30);
  if (problems.length) console.warn("[shot audit]\n" + problems.join("\n"));
}

export const ProductOSLaunch: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0A0F" }}>
    <Film shots={PRODUCT_OS_SHOTS} />
    <Mix />
  </AbsoluteFill>
);

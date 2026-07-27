import { Easing, spring, interpolate } from "remotion";

/**
 * Named easings. Every move in this library takes one of these by name.
 * Nothing in a motion-os video is ever `linear` except continuous loops.
 */
export const EASE = {
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  expoInOut: Easing.bezier(0.87, 0, 0.13, 1),
  backOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  backIn: Easing.bezier(0.36, 0, 0.66, -0.56),
  circOut: Easing.bezier(0, 0.55, 0.45, 1),
  quintOut: Easing.bezier(0.22, 1, 0.36, 1),
  linear: (t: number) => t,
} as const;

export type EaseName = keyof typeof EASE;

export const SPRING = {
  /** panels, cards, layout — settles clean, no visible wobble */
  soft: { damping: 200, mass: 0.6, stiffness: 100 },
  /** icons, chips, cursors — visible bounce */
  snap: { damping: 14, mass: 0.5, stiffness: 180 },
  /** hero lockups — slow, weighty */
  heavy: { damping: 30, mass: 1.6, stiffness: 90 },
  /** micro nudges */
  tight: { damping: 22, mass: 0.35, stiffness: 260 },
} as const;

export type SpringName = keyof typeof SPRING;

/**
 * The single primitive every move is built from.
 *
 * `t` maps a local frame to 0..1 across [startF, startF+durF] with the named
 * easing already applied, clamped at both ends. Returns 0 before the move
 * starts and 1 after it finishes — so moves compose without gaps.
 */
export const t = (
  frame: number,
  startF: number,
  durF: number,
  ease: EaseName = "expoOut",
): number =>
  interpolate(frame, [startF, startF + Math.max(1, durF)], [0, 1], {
    easing: EASE[ease],
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Spring-driven 0..1 progress. Use when the move should overshoot organically. */
export const ts = (
  frame: number,
  fps: number,
  startF: number,
  preset: SpringName = "soft",
  durationInFrames?: number,
): number =>
  spring({
    frame: frame - startF,
    fps,
    config: SPRING[preset],
    durationInFrames,
  });

/** Map 0..1 progress onto a numeric range. */
export const at = (p: number, from: number, to: number) => from + (to - from) * p;

/**
 * Map 0..1 progress onto a SCALE range, interpolated in area space.
 *
 * Linear scale interpolation reads as decelerating, because perceived size follows
 * area and area grows as the square of scale. Remotion's `perceptual-scale` output
 * mode corrects for that.
 *
 * Only worth it on large ranges — measured divergence from linear, as a percentage
 * of the total range:
 *   1 → 1.06   0.7%   (imperceptible; use plain `at`)
 *   1 → 1.09   1.1%   (imperceptible)
 *   1 → 2.4   10.3%   (use this)
 *   0 → 9.45  24.7%   (definitely use this)
 *
 * Rule of thumb: reach for it when to/from exceeds ~1.5x.
 */
export const atScale = (p: number, from: number, to: number) =>
  interpolate(p, [0, 1], [from, to], {
    output: "perceptual-scale",
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Per-index delay for staggered groups. Keep staggerF in 2..4. */
export const stagger = (i: number, staggerF: number) => i * staggerF;

/**
 * Exits run at ~60% of the matching entrance. Use this rather than picking a
 * number, so entrance/exit stay locked in proportion.
 */
export const exitDur = (entranceDurF: number) => Math.round(entranceDurF * 0.6);

/** Continuous 0..1 ramp that loops every periodF. For ambient moves only. */
export const loop = (frame: number, periodF: number) =>
  (frame % periodF) / periodF;

/** Continuous -1..1 sine. The workhorse for drift/breathe. */
export const osc = (frame: number, periodF: number, phase = 0) =>
  Math.sin(((frame / periodF) * Math.PI * 2) + phase);

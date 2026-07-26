import React from "react";
import { useCurrentFrame } from "remotion";
import { EaseName, at, loop, osc, t } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   SHAPE-DRIVEN MASKS

   The original vocabulary had exactly two mask moves and both were rectangles
   (`maskWipeUp`, `maskWipeSide`). Reading the corpus back showed a whole family
   missing: masks whose SHAPE is the animated thing, and masks that are the
   subject rather than a reveal device.

   See pipeline/MOVE_VOCAB.md Part 2 (family 1.5) — every move here cites the
   reference spec it was derived from.

   Law that carries over: the mask does the work. Do NOT crossfade opacity
   underneath a shape reveal — it halves the effect and reads as a dissolve.
   ──────────────────────────────────────────────────────────────────────────── */

type Common = {
  startF?: number;
  durF?: number;
  ease?: EaseName;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * irisMaskReveal — content revealed through a circle expanding from a point.
 * Origin off-centre reads far better than dead centre.
 * From B_galactic-motion-art (irisReveal), B_editors-loop-3d-camera.
 */
export const IrisMaskReveal: React.FC<
  Common & { origin?: { x: number; y: number }; rPct?: [number, number]; invert?: boolean }
> = ({
  children,
  startF = 0,
  durF = 16,
  ease = "expoOut",
  origin = { x: 50, y: 50 },
  rPct = [0, 140],
  invert = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  const r = invert ? at(p, rPct[1], rPct[0]) : at(p, rPct[0], rPct[1]);
  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        clipPath: `circle(${r.toFixed(2)}% at ${origin.x}% ${origin.y}%)`,
        willChange: "clip-path",
      }}
    >
      {children}
    </div>
  );
};

/**
 * travelingShapeWipe — a non-rectangular shape sweeps across the frame and the
 * content is revealed behind its trailing edge. Reads as a physical thing
 * passing, not as a wipe.
 * Generalised from A_motion-explainer-snippet (vanishThroughGap, run forwards).
 */
const SHAPES: Record<string, (x: number) => string> = {
  // x is the leading edge in %, shapes are drawn trailing to the left of it
  chevron: (x) =>
    `polygon(${x - 26}% 0%, ${x}% 0%, ${x - 12}% 50%, ${x}% 100%, ${x - 26}% 100%)`,
  triangle: (x) => `polygon(${x - 24}% 0%, ${x}% 50%, ${x - 24}% 100%)`,
  slab: (x) => `polygon(${x - 30}% 0%, ${x}% 0%, ${x - 6}% 100%, ${x - 36}% 100%)`,
};

export const TravelingShapeWipe: React.FC<
  Common & { shape?: keyof typeof SHAPES; dir?: "ltr" | "rtl" }
> = ({ children, startF = 0, durF = 20, ease = "expoInOut", shape = "chevron", dir = "ltr", style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  // the leading edge travels past the far side so the reveal completes
  const x = dir === "ltr" ? at(p, 0, 160) : at(p, 160, 0);
  return (
    <div style={{ ...style, position: "relative", width: "100%", height: "100%" }}>
      {/* content, revealed by an inset that follows the shape's trailing edge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath:
            dir === "ltr"
              ? `inset(0 ${Math.max(0, 100 - (x - 20)).toFixed(2)}% 0 0)`
              : `inset(0 0 0 ${Math.max(0, x - 20).toFixed(2)}%)`,
        }}
      >
        {children}
      </div>
      {/* the shape itself, visible only while it is on screen */}
      {p > 0 && p < 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: SHAPES[shape](x),
            background: "currentColor",
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

/**
 * concentricRingMask — reveal (or idle) through expanding/rotating rings.
 * Reads as portal / iris / eclipse.
 * From A_sparkle-vertical (portalRingPulse), B_galactic-motion-art.
 */
export const ConcentricRings: React.FC<{
  startF?: number;
  durF?: number;
  rings?: number;
  color: string;
  strokeWidth?: number;
  /** when set, rings rotate forever instead of expanding once */
  ambientPeriodF?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({
  startF = 0,
  durF = 21,
  rings = 5,
  color,
  strokeWidth = 2,
  ambientPeriodF,
  size = 600,
  style,
}) => {
  const frame = useCurrentFrame();
  const spin = ambientPeriodF ? loop(frame, ambientPeriodF) * 360 : 0;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={style}>
      <g transform={`rotate(${spin} 100 100)`}>
        {Array.from({ length: rings }, (_, i) => {
          const p = t(frame, startF + i * 3, durF, "expoOut");
          const rMax = 20 + i * 18;
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={ambientPeriodF ? rMax : at(p, 0, rMax)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={ambientPeriodF ? 0.5 - i * 0.06 : Math.min(1, p * 1.5) * (0.9 - i * 0.12)}
              strokeDasharray={ambientPeriodF ? "6 10" : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   MASK AS SUBJECT — the shape's own transformation is what you watch
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * fillToStrokeCrossfade — identical geometry crossfades from solid fill to
 * outline. No morph: two stacked copies, opposite opacities, same window.
 * Reads as the shape dematerialising into a lighter version of itself.
 * From B_logo-wip (fillToStroke), B_chromatic-logo-2d3d.
 */
export const FillToStroke: React.FC<{
  /** one <g>/<path>/<circle> set; rendered twice, filled then stroked */
  geometry: React.ReactNode;
  viewBox: string;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  startF?: number;
  durF?: number;
  reverse?: boolean;
  style?: React.CSSProperties;
}> = ({
  geometry,
  viewBox,
  fill,
  stroke,
  strokeWidth = 2,
  startF = 0,
  durF = 24,
  reverse = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  const fo = reverse ? p : 1 - p;
  const so = reverse ? 1 - p : p;
  return (
    <svg viewBox={viewBox} style={style}>
      <g fill={fill} stroke="none" opacity={fo}>
        {geometry}
      </g>
      <g fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={so}>
        {geometry}
      </g>
    </svg>
  );
};

/**
 * holoEchoOutline — the same path drawn N extra times, scaled up around its own
 * centroid and hue-shifted, all on ONE progress value. Fakes holographic-foil
 * fringing for the cost of duplicating a path.
 *
 * Distinct from `MotionTrail`, which offsets echoes in TIME. These are perfectly
 * time-synced and offset in scale + hue instead.
 * From B_logo-holo.
 */
export const HoloEchoOutline: React.FC<{
  d: string;
  viewBox: string;
  length?: number;
  startF?: number;
  durF?: number;
  hues?: number[];
  scales?: number[];
  opacities?: number[];
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({
  d,
  viewBox,
  length = 2000,
  startF = 0,
  durF = 28,
  hues = [275, 300, 330],
  scales = [1.15, 1.35, 1.55],
  opacities = [0.35, 0.25, 0.15],
  strokeWidth = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  const offset = at(p, length, 0);
  return (
    <svg viewBox={viewBox} style={style} fill="none">
      {/* echoes painted first — paint order, not z-index */}
      {scales.map((s, i) => (
        <g key={i} transform={`scale(${s})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path
            d={d}
            stroke={`hsl(${hues[i % hues.length]}, 90%, 68%)`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={opacities[i % opacities.length]}
            strokeDasharray={length}
            strokeDashoffset={offset}
          />
        </g>
      ))}
      <path
        d={d}
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

/**
 * hardSwap — step through N layers on a frame grid with NO easing.
 *
 * The corpus uses hard swaps and eased crossfades for different jobs and they are
 * not interchangeable: a hard swap on an irregular interval reads as energy or
 * glitch, an eased crossfade reads as a material transformation. Interval is
 * deliberately non-periodic (seeded from the index) because a perfectly regular
 * swap reads as a broken loop rather than as intent.
 * From B_trippy-abstract-type (glitchMaterialMorph), B_editors-loop-3d-camera.
 */
export const HardSwap: React.FC<{
  layers: React.ReactNode[];
  startF?: number;
  /** average frames per layer; actual interval wobbles around it */
  intervalF?: number;
  jitter?: number;
  style?: React.CSSProperties;
}> = ({ layers, startF = 0, intervalF = 5, jitter = 0.35, style }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startF);
  // deterministic irregular schedule — no Math.random, so renders reproduce
  const idx = React.useMemo(() => {
    const steps: number[] = [];
    let acc = 0;
    for (let i = 0; i < 400; i++) {
      steps.push(acc);
      acc += Math.max(2, Math.round(intervalF * (1 + Math.sin(i * 7.13) * jitter)));
    }
    return steps;
  }, [intervalF, jitter]);
  let k = 0;
  while (k < idx.length - 1 && local >= idx[k + 1]) k++;
  return <div style={style}>{layers[k % layers.length]}</div>;
};

/**
 * concentricShapeBurst — one silhouette duplicated N times, each scaled to a
 * different target with a 1-frame stagger, smallest in front. The spread of the
 * shape IS the subject; no masking involved.
 * From jittervideo_B_recreating-this-fifa-logo-animation.
 *
 * IMPORTANT: pass a STROKED or semi-transparent shape. With an opaque fill the
 * largest copy simply covers every smaller one and the nesting is invisible —
 * found by rendering it, not by reading it. Outline, or vary fill per copy.
 */
export const ConcentricShapeBurst: React.FC<{
  shape: React.ReactNode;
  copies?: number;
  startF?: number;
  durF?: number;
  scaleTo?: [number, number];
  staggerF?: number;
  opacityFalloff?: number;
  style?: React.CSSProperties;
}> = ({
  shape,
  copies = 18,
  startF = 0,
  durF = 24,
  scaleTo = [1.33, 9.45],
  staggerF = 1,
  opacityFalloff = 0.045,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...style, position: "relative", width: "100%", height: "100%" }}>
      {Array.from({ length: copies }, (_, i) => copies - 1 - i).map((i) => {
        const p = t(frame, startF + i * staggerF, durF, "expoOut");
        const target = at(i / Math.max(1, copies - 1), scaleTo[0], scaleTo[1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              transform: `scale(${at(p, 0, target).toFixed(3)})`,
              opacity: Math.max(0, 1 - i * opacityFalloff) * Math.min(1, p * 3),
            }}
          >
            {shape}
          </div>
        );
      })}
    </div>
  );
};

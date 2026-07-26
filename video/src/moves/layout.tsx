import React from "react";
import { useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { at, loop, osc, t } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   LAYOUT & CONTINUITY MOVES

   Top-ranked techniques from pipeline/PATTERNS.md §2 that arrange things in
   space or hold a piece together across cuts. Cited to source specs.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * conveyorSlide — PATTERNS §2 #7. Every item sits in an IDENTICAL container, so
 * cuts between unrelated content become match cuts by construction. One data
 * array plus one offset function replaces N hand-placed edits.
 * From A_showreel-snippet (12 unrelated brands in one card slot).
 */
export const ConveyorSlide: React.FC<{
  items: React.ReactNode[];
  /** frames each item holds before the next slides in */
  holdF?: number;
  slideDurF?: number;
  startF?: number;
  dir?: "up" | "left";
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}> = ({ items, holdF = 34, slideDurF = 12, startF = 0, dir = "up", containerStyle, style }) => {
  const frame = useCurrentFrame();
  const cycle = holdF + slideDurF;
  const local = Math.max(0, frame - startF);
  const idx = Math.min(items.length - 1, Math.floor(local / cycle));
  const inCycle = local - idx * cycle;
  const p = inCycle > holdF ? t(inCycle, holdF, slideDurF, "expoInOut") : 0;
  const next = items[Math.min(items.length - 1, idx + 1)];
  const off = at(p, 0, -100);
  const axis = dir === "up" ? "translateY" : "translateX";
  return (
    <div style={{ ...style, overflow: "hidden", position: "relative" }}>
      <div style={{ ...containerStyle, transform: `${axis}(${off}%)` }}>{items[idx]}</div>
      <div
        style={{
          ...containerStyle,
          position: "absolute",
          inset: 0,
          transform: `${axis}(${off + 100}%)`,
        }}
      >
        {next}
      </div>
    </div>
  );
};

/**
 * particleFieldConnector — PATTERNS §2 #8. A persistent background layer that
 * runs UNDER every cut, identical regardless of what is on top. Makes a
 * compilation of unrelated content read as one authored reel.
 * From A_best-launch-reel-2026.
 *
 * Rendered from @remotion/noise so it is organic but fully deterministic.
 */
export const ParticleField: React.FC<{
  count?: number;
  color: string;
  /** absolute start frame of the shot, so the field is continuous across cuts */
  phaseF?: number;
  speed?: number;
  size?: [number, number];
  opacity?: number;
}> = ({ count = 46, color, phaseF = 0, speed = 0.0022, size = [2, 6], opacity = 0.5 }) => {
  const frame = useCurrentFrame() + phaseF;
  const pts = React.useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count],
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity }}>
      {pts.map((i) => {
        // noise-driven so the drift is organic, index-seeded so it reproduces
        const x = (noise2D("pf-x", i * 0.31, frame * speed) + 1) / 2;
        const y = (noise2D("pf-y", i * 0.47, frame * speed * 0.8) + 1) / 2;
        const s = at((noise2D("pf-s", i * 0.19, 0) + 1) / 2, size[0], size[1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(x * 100).toFixed(2)}%`,
              top: `${(y * 100).toFixed(2)}%`,
              width: s,
              height: s,
              borderRadius: 999,
              background: color,
              opacity: 0.3 + ((i % 5) / 5) * 0.7,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * radialCluster — PATTERNS §2 #16. N concerns arranged around one subject.
 * Turns "many things relate to this" into an instant spatial metaphor.
 *
 * Distinct from `OrbitRing`: that one ROTATES continuously and is ambient. This
 * places items statically and staggers their arrival — the arrangement is the
 * statement, not the motion.
 * From A_shipping-8-launch-videos (radialChatCluster).
 */
export const RadialCluster: React.FC<{
  children: React.ReactNode[];
  radius: number;
  startF?: number;
  staggerF?: number;
  startAngle?: number;
  /** spread less than 360 to fan items across an arc instead of a full ring */
  spreadDeg?: number;
  /** subtle per-item idle so the cluster never freezes */
  idle?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  radius,
  startF = 0,
  staggerF = 3,
  startAngle = -90,
  spreadDeg = 360,
  idle = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = children.length;
  return (
    <div style={{ ...style, position: "absolute", left: "50%", top: "50%" }}>
      {children.map((c, i) => {
        const frac = spreadDeg >= 360 ? i / n : n === 1 ? 0.5 : i / (n - 1);
        const ang = ((startAngle + frac * spreadDeg) * Math.PI) / 180;
        const p = t(frame, startF + i * staggerF, 16, "backOut");
        // each item drifts on its own period — the fix for the lockstep tell
        const dx = idle ? osc(frame, 150 + i * 17, i) * 4 : 0;
        const dy = idle ? osc(frame, 190 + i * 13, i * 0.7) * 4 : 0;
        const x = Math.cos(ang) * radius + dx;
        const y = Math.sin(ang) * radius + dy;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${p})`,
              opacity: Math.min(1, p * 1.6),
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

/**
 * asyncDrift — PATTERNS §2 #17. Wraps a set of items so each idles on its OWN
 * period. The one-line fix for the "everything moves in lockstep" flat-vector
 * tell, which is what makes cheap motion graphics look cheap.
 * From A_recent-motion-4k-vertical, A_shipping-8-launch-videos.
 */
export const AsyncDrift: React.FC<{
  children: React.ReactNode[];
  ampPx?: number;
  /** base period; each item gets a different one derived from its index */
  periodF?: number;
  rotateDeg?: number;
  phaseF?: number;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}> = ({ children, ampPx = 7, periodF = 160, rotateDeg = 1.4, phaseF = 0, style, itemStyle }) => {
  const frame = useCurrentFrame() + phaseF;
  return (
    <div style={style}>
      {children.map((c, i) => {
        // irrational-ish multipliers so no two items ever sync up
        const px = periodF * (1 + i * 0.237);
        const py = periodF * (1.31 + i * 0.191);
        return (
          <div
            key={i}
            style={{
              ...itemStyle,
              transform:
                `translate(${(osc(frame, px, i) * ampPx).toFixed(2)}px, ` +
                `${(osc(frame, py, i * 0.6) * ampPx).toFixed(2)}px) ` +
                `rotate(${(osc(frame, px * 1.7, i) * rotateDeg).toFixed(2)}deg)`,
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

/**
 * rackLoop — PATTERNS §2 #10. A mirrored focus curve, so the last frame matches
 * the first and an autoplaying hero loops with an invisible seam.
 * From A_recent-motion-4k-vertical.
 */
export const RackLoop: React.FC<{
  children: React.ReactNode;
  /** total loop length; blur peaks at both ends and clears in the middle */
  totalF: number;
  maxBlur?: number;
  scaleAmp?: number;
  style?: React.CSSProperties;
}> = ({ children, totalF, maxBlur = 12, scaleAmp = 0.04, style }) => {
  const frame = useCurrentFrame();
  // Triangle wave: 0 at both ends, 1 in the middle, so the first and last frame
  // are identical. The frame is taken MODULO totalF — without that, anything past
  // totalF drove tri negative, clamped to zero, and the element stayed at maximum
  // blur forever. A move whose entire purpose is looping has to actually loop.
  const cycle = Math.max(1, totalF);
  const tri = 1 - Math.abs(((frame % cycle) / cycle) * 2 - 1);
  const focus = t(tri, 0, 1, "expoOut");
  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        filter: `blur(${at(focus, maxBlur, 0).toFixed(2)}px)`,
        transform: `scale(${at(focus, 1 + scaleAmp, 1).toFixed(4)})`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * flattenToIsometric — PATTERNS §2 #13. ONE shared wrapper transform tilts a
 * flat mock into a dashboard-looking 3D plane; every child panel shares the
 * plane for free rather than being keyframed individually.
 * From A_not-your-average-ui-animation.
 */
export const FlattenToIsometric: React.FC<{
  children: React.ReactNode;
  startF?: number;
  durF?: number;
  /** final tilt; keep under ~16deg or it reads as a template */
  tiltDeg?: number;
  rotateZDeg?: number;
  perspective?: number;
  reverse?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  startF = 0,
  durF = 30,
  tiltDeg = 14,
  rotateZDeg = -8,
  perspective = 1600,
  reverse = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  const q = reverse ? 1 - p : p;
  return (
    <div style={{ ...style, perspective: `${perspective}px`, width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform:
            `rotateX(${(q * tiltDeg).toFixed(2)}deg) ` +
            `rotateZ(${(q * rotateZDeg).toFixed(2)}deg) ` +
            `scale(${at(q, 1, 0.92).toFixed(3)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * fontSwapBlur — PATTERNS §2 #21. Position and size stay locked; only the
 * typeface changes, masked by a short horizontal blur + skew on each swap.
 * Reads more premium than any spatial kinetic-type move, and costs nothing.
 * From B_dynamic-typography-d3.
 */
export const FontSwapBlur: React.FC<{
  text: string;
  /** CSS font-family values cycled through; the last is landed on */
  families: string[];
  startF?: number;
  swapEveryF?: number;
  blurPx?: number;
  skewDeg?: number;
  style?: React.CSSProperties;
}> = ({ text, families, startF = 0, swapEveryF = 7, blurPx = 26, skewDeg = 10, style }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startF);
  const step = Math.floor(local / swapEveryF);
  const landed = step >= families.length - 1;
  const idx = Math.min(families.length - 1, step);
  // blur spikes on the frames either side of a swap, clears in between
  const intoSwap = local % swapEveryF;
  const nearSwap = Math.min(intoSwap, swapEveryF - intoSwap);
  const b = landed ? 0 : Math.max(0, 1 - nearSwap / 2) * blurPx;
  return (
    <span
      style={{
        ...style,
        fontFamily: families[idx],
        display: "inline-block",
        filter: b > 0.2 ? `blur(${b.toFixed(1)}px)` : undefined,
        transform: `skewX(${(b / blurPx * skewDeg).toFixed(2)}deg)`,
      }}
    >
      {text}
    </span>
  );
};

/**
 * shatterDisperse / fragmentsConverge — PATTERNS §2 #5. Fragments fly apart, or
 * fly in and assemble. Used before a wordmark, it argues the brand's value from
 * the product's own vocabulary rather than just presenting a logo.
 * From B_logo-sage-library.
 *
 * `mode="converge"` runs it inward, which is the launch-video direction.
 */
export const Fragments: React.FC<{
  pieces: React.ReactNode[];
  mode?: "disperse" | "converge";
  startF?: number;
  durF?: number;
  staggerF?: number;
  /** how far out the fragments start (converge) or end (disperse), in px */
  spread?: number;
  /**
   * Final offset per piece. WITHOUT this every fragment converges to the same
   * point and they stack invisibly — which is a pile, not an assembled mark.
   * Pass the layout the pieces should form and the move becomes an assembly.
   */
  to?: { x: number; y: number }[];
  style?: React.CSSProperties;
}> = ({ pieces, mode = "converge", startF = 0, durF = 28, staggerF = 2, spread = 420, to, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...style, position: "absolute", inset: 0 }}>
      {pieces.map((piece, i) => {
        const p = t(frame, startF + i * staggerF, durF, mode === "converge" ? "expoOut" : "expoIn");
        const q = mode === "converge" ? 1 - p : p;
        // deterministic scatter direction from the index — no Math.random
        const ang = (i * 137.508 * Math.PI) / 180; // golden angle, spreads evenly
        const dist = spread * (0.55 + ((i % 4) / 4) * 0.45) * q;
        // resting position: the layout the pieces assemble into, or dead centre
        const rest = to?.[i] ?? { x: 0, y: 0 };
        const rx = Math.cos(ang) * dist + rest.x * (1 - q);
        const ry = Math.sin(ang) * dist + rest.y * (1 - q);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              transform:
                `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px) ` +
                `rotate(${(q * (i % 2 ? 55 : -55)).toFixed(1)}deg) scale(${at(q, 1, 0.7).toFixed(3)})`,
              opacity: mode === "converge" ? Math.min(1, p * 2.2) : 1 - p,
            }}
          >
            {piece}
          </div>
        );
      })}
    </div>
  );
};

/**
 * paperFoldIn — PATTERNS §2 #25. A tactile flourish on the FIRST element only.
 * Buys credibility for a later isometric payoff. Use exactly once per video —
 * the spec is explicit that repeating it is what cheapens it.
 * From A_not-your-average-ui-animation.
 */
export const PaperFoldIn: React.FC<{
  children: React.ReactNode;
  startF?: number;
  durF?: number;
  fromDeg?: number;
  origin?: "top" | "bottom" | "left";
  style?: React.CSSProperties;
}> = ({ children, startF = 0, durF = 24, fromDeg = -82, origin = "top", style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoOut");
  const axis = origin === "left" ? "rotateY" : "rotateX";
  const sign = origin === "bottom" ? -1 : 1;
  return (
    <div style={{ ...style, perspective: "1200px" }}>
      <div
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: origin === "left" ? "left center" : `${origin} center`,
          transform: `${axis}(${(at(p, fromDeg, 0) * sign).toFixed(2)}deg)`,
          // the shadow tracks the fold angle, which is what sells it as physical
          boxShadow: `0 ${at(p, 4, 22).toFixed(0)}px ${at(p, 12, 48).toFixed(0)}px rgba(0,0,0,${at(p, 0.35, 0.16).toFixed(2)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

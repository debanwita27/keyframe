import React from "react";
import { useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { at, loop, t } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   TREATMENT — the last 15% that separates "premium" from "flat vector".

   Stack order matters. Bottom to top:
     background → content → Bloom → ChromaticEdge → FilmGrain → Vignette
   Apply sparingly: every one of these at full strength reads as a filter, not
   as craft.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * filmGrain — animated noise. The single highest-value-per-line treatment.
 * Kills the plasticky flatness of pure CSS gradients.
 * Rendered once as an SVG feTurbulence and reseeded per frame.
 */
export const FilmGrain: React.FC<{ opacity?: number; scale?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({
  opacity = 0.055,
  scale = 0.9,
  blend = "overlay",
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: blend, pointerEvents: "none" }}
    >
      <filter id={`grain-${frame % 12}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={scale}
          numOctaves={2}
          seed={frame % 12}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${frame % 12})`} />
    </svg>
  );
};

/** vignette — 12% falloff. Pulls the eye to centre; almost invisible, always helps. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({
  strength = 0.12,
  color = "#000",
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(120% 100% at 50% 50%, transparent 45%, ${color} 140%)`,
      opacity: strength,
      pointerEvents: "none",
    }}
  />
);

/**
 * bloomGlow — fake bloom by duplicating the child, blurring and screening it back.
 * Only ever apply to accent-coloured elements; blooming everything looks foggy.
 */
export const BloomGlow: React.FC<{
  children: React.ReactNode;
  radius?: number;
  intensity?: number;
  style?: React.CSSProperties;
}> = ({ children, radius = 18, intensity = 0.5, style }) => (
  <div style={{ ...style, position: "relative" }}>
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        filter: `blur(${radius}px)`,
        opacity: intensity,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

/**
 * chromaticEdge — r/b split that grows toward the frame edges, like a real lens.
 * 1.5px is plenty. Above 3px it becomes the effect rather than the polish.
 */
export const ChromaticEdge: React.FC<{ children: React.ReactNode; amountPx?: number }> = ({
  children,
  amountPx = 1.5,
}) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${-amountPx}px)`,
        filter: "url(#ca-red)",
        mixBlendMode: "screen",
        opacity: 0.5,
        maskImage: "radial-gradient(120% 100% at 50% 50%, transparent 40%, #000 100%)",
      }}
    >
      {children}
    </div>
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${amountPx}px)`,
        filter: "url(#ca-blue)",
        mixBlendMode: "screen",
        opacity: 0.5,
        maskImage: "radial-gradient(120% 100% at 50% 50%, transparent 40%, #000 100%)",
      }}
    >
      {children}
    </div>
    <div style={{ position: "relative" }}>{children}</div>
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <filter id="ca-red">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="ca-blue">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  </div>
);

/**
 * motionTrail — 3 echoes behind a fast element. Sells speed at 30fps where real
 * motion blur would need per-frame accumulation.
 */
export const MotionTrail: React.FC<{
  children: React.ReactNode;
  echoes?: number;
  spacingF?: number;
  /** how the element is positioned per frame, so echoes can sample the past */
  transformAt: (frame: number) => string;
}> = ({ children, echoes = 3, spacingF = 2, transformAt }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: echoes }, (_, i) => echoes - i).map((k) => (
        <div
          key={k}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            transform: transformAt(frame - k * spacingF),
            opacity: 0.34 / k,
            filter: `blur(${k * 1.4}px)`,
          }}
        >
          {children}
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, transform: transformAt(frame) }}>{children}</div>
    </>
  );
};

/**
 * specularSweep — a hard-edged light band crossing a surface once, on cue.
 * Use on logo lockups and glass cards. Different from ScanSweep (which loops).
 */
export const SpecularSweep: React.FC<{
  children: React.ReactNode;
  startF?: number;
  durF?: number;
  angleDeg?: number;
  widthPct?: number;
  style?: React.CSSProperties;
}> = ({ children, startF = 0, durF = 24, angleDeg = 105, widthPct = 14, style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  const pos = at(p, -30, 130);
  return (
    <div style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${angleDeg}deg, transparent ${pos - widthPct}%, rgba(255,255,255,.85) ${pos}%, transparent ${pos + widthPct}%)`,
          mixBlendMode: "overlay",
          opacity: p > 0 && p < 1 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/**
 * noiseField — dithered organic background using @remotion/noise. This is the
 * one place we reach past CSS: gradients alone cannot make an *organic* field,
 * and a full GLSL pass is overkill.
 */
export const NoiseField: React.FC<{
  colorA: string;
  colorB: string;
  cells?: number;
  speed?: number;
  opacity?: number;
}> = ({ colorA, colorB, cells = 26, speed = 0.004, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const grid = React.useMemo(
    () => Array.from({ length: cells * cells }, (_, i) => ({ x: i % cells, y: Math.floor(i / cells) })),
    [cells],
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cells}, 1fr)`,
        opacity,
        filter: "blur(28px)",
      }}
    >
      {grid.map(({ x, y }, i) => {
        const n = noise2D("field", x * 0.22 + frame * speed, y * 0.22);
        return (
          <div
            key={i}
            style={{ background: n > 0 ? colorA : colorB, opacity: 0.35 + Math.abs(n) * 0.65 }}
          />
        );
      })}
    </div>
  );
};

/** Wrap a whole shot in the standard treatment stack. One import, correct order. */
export const Treated: React.FC<{
  children: React.ReactNode;
  grain?: number;
  vignette?: number;
}> = ({ children, grain = 0.055, vignette = 0.12 }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    {children}
    {grain > 0 && <FilmGrain opacity={grain} />}
    {vignette > 0 && <Vignette strength={vignette} />}
  </div>
);

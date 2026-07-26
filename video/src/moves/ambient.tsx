import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { at, loop, osc, t } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   AMBIENT MOVES — always running, never the subject.

   Law: at least one ambient move is active in EVERY shot. A shot where the
   pixels stop changing reads as a broken render, not as calm. The analyzer
   flags these as "held / static stretches" — treat those as bugs.
   ──────────────────────────────────────────────────────────────────────────── */

/** driftCamera — slow sinusoidal pan+zoom of the whole composition. */
export const DriftCamera: React.FC<{
  children: React.ReactNode;
  ampPct?: number;
  periodF?: number;
  zoom?: number;
  style?: React.CSSProperties;
}> = ({ children, ampPct = 1.5, periodF = 180, zoom = 1.02, style }) => {
  const frame = useCurrentFrame();
  const x = osc(frame, periodF) * ampPct;
  const y = osc(frame, periodF * 1.37, 1.1) * ampPct * 0.6;
  // The base zoom must exceed the drift amplitude, or the drift reveals empty
  // space at the frame edge and clips content that sits in the outer margin.
  const minZoom = 1 + (ampPct * 2) / 100;
  const zMax = Math.max(zoom, minZoom);
  const z = zMax - (1 - (osc(frame, periodF * 2.1, 0.4) + 1) / 2) * (zMax - minZoom);
  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        transform: `translate(${x}%, ${y}%) scale(${z})`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

/** breathe — a hero element idles so it never looks frozen. */
export const Breathe: React.FC<{
  children: React.ReactNode;
  amp?: number;
  periodF?: number;
  style?: React.CSSProperties;
}> = ({ children, amp = 0.015, periodF = 120, style }) => {
  const frame = useCurrentFrame();
  const s = 1 + osc(frame, periodF) * amp;
  return <div style={{ ...style, transform: `scale(${s})`, willChange: "transform" }}>{children}</div>;
};

/**
 * orbitRing — N children placed on a circle. Ring rotates; children counter-rotate
 * so they stay upright. Shubh's signature capability-inventory device: it shows
 * "many things" without a list.
 */
export const OrbitRing: React.FC<{
  children: React.ReactNode[];
  radius: number;
  periodF?: number;
  startAngle?: number;
  /** 0..1 progress for children arriving one by one */
  revealStartF?: number;
  revealStaggerF?: number;
  counterRotate?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  radius,
  periodF = 600,
  startAngle = -90,
  revealStartF = 0,
  revealStaggerF = 2,
  counterRotate = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const spin = loop(frame, periodF) * 360;
  const n = children.length;
  return (
    <div style={{ ...style, position: "absolute", left: "50%", top: "50%" }}>
      {children.map((child, i) => {
        const ang = ((startAngle + (360 / n) * i + spin) * Math.PI) / 180;
        const x = Math.cos(ang) * radius;
        const y = Math.sin(ang) * radius;
        const p = t(frame, revealStartF + i * revealStaggerF, 14, "backOut");
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${p}) rotate(${counterRotate ? -spin : 0}deg)`,
              opacity: p > 0.02 ? 1 : 0,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

/** marquee — scrolling band of text or logos. The only place `linear` is correct. */
export const Marquee: React.FC<{
  children: React.ReactNode;
  periodF?: number;
  gap?: number;
  reverse?: boolean;
  style?: React.CSSProperties;
}> = ({ children, periodF = 300, gap = 48, reverse = false, style }) => {
  const frame = useCurrentFrame();
  const p = loop(frame, periodF) * (reverse ? 1 : -1) * 50;
  return (
    <div style={{ ...style, overflow: "hidden", display: "flex", whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", gap, transform: `translateX(${p}%)`, willChange: "transform" }}>
        {children}
        {children}
      </div>
    </div>
  );
};

/**
 * gradientDrift — animated mesh-ish background from stacked radial gradients
 * whose centres orbit slowly. Pure CSS; no shader needed. This plus grain is
 * 80% of the "premium background" look.
 */
export const GradientDrift: React.FC<{
  colors: string[];
  bg: string;
  periodF?: number;
  blurPx?: number;
  opacity?: number;
}> = ({ colors, bg, periodF = 400, blurPx = 90, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const blobs = colors.map((c, i) => {
    const ph = (i / colors.length) * Math.PI * 2;
    const cx = 50 + osc(frame, periodF * (1 + i * 0.21), ph) * 26;
    const cy = 50 + osc(frame, periodF * (1.4 + i * 0.17), ph + 1.7) * 24;
    return `radial-gradient(38% 42% at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, ${c} 0%, transparent 68%)`;
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: `-${blurPx}px`,
        background: `${blobs.join(", ")}, ${bg}`,
        filter: `blur(${blurPx}px)`,
        opacity,
      }}
    />
  );
};

/**
 * parallaxLayers — ties layer offset to a shared drift so depth reads without 3D.
 * depths: 0 = far (barely moves), 1 = near (moves fully).
 */
export const ParallaxLayers: React.FC<{
  layers: { node: React.ReactNode; depth: number }[];
  ampPx?: number;
  periodF?: number;
}> = ({ layers, ampPx = 12, periodF = 240 }) => {
  const frame = useCurrentFrame();
  const dx = osc(frame, periodF) * ampPx;
  const dy = osc(frame, periodF * 1.4, 0.9) * ampPx * 0.5;
  return (
    <>
      {layers.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${(dx * l.depth).toFixed(2)}px, ${(dy * l.depth).toFixed(2)}px)`,
          }}
        >
          {l.node}
        </div>
      ))}
    </>
  );
};

/**
 * scanSweep — a soft light band crossing the frame on a loop. Reads as "this
 * surface is glass/metal". Much cheaper than a real specular shader.
 */
export const ScanSweep: React.FC<{
  periodF?: number;
  angleDeg?: number;
  width?: number;
  color?: string;
  opacity?: number;
}> = ({ periodF = 210, angleDeg = 100, width = 22, color = "#fff", opacity = 0.28 }) => {
  const frame = useCurrentFrame();
  const pos = at(loop(frame, periodF), -40, 140);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${angleDeg}deg, transparent ${pos - width}%, ${color} ${pos}%, transparent ${pos + width}%)`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

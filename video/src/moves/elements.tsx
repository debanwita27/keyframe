import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EaseName, SpringName, at, t, ts } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   ELEMENT MOVES — cards, chips, icons, panels, lines.

   Law enforced here: opacity NEVER animates alone. Every entrance pairs opacity
   with transform and/or blur. A pure cross-fade is the single clearest signal
   that motion was an afterthought.
   ──────────────────────────────────────────────────────────────────────────── */

type Common = {
  startF?: number;
  durF?: number;
  ease?: EaseName;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * staggerRise — the default for any group: list items, cards, chips, rows.
 * Blur resolves over the first 60% only, so it reads as "coming into focus"
 * rather than "blurry the whole way".
 */
export const StaggerRise: React.FC<{
  items: React.ReactNode[];
  startF?: number;
  durF?: number;
  staggerF?: number;
  yFrom?: number;
  blurFrom?: number;
  springPreset?: SpringName;
  className?: string;
  itemStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}> = ({
  items,
  startF = 0,
  durF = 20,
  staggerF = 3,
  yFrom = 28,
  blurFrom = 8,
  springPreset = "soft",
  className,
  itemStyle,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div className={className} style={style}>
      {items.map((item, i) => {
        const s = startF + i * staggerF;
        const p = ts(frame, fps, s, springPreset, durF);
        const blurP = t(frame, s, Math.round(durF * 0.6), "expoOut");
        return (
          <div
            key={i}
            style={{
              ...itemStyle,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${at(p, yFrom, 0)}px)`,
              filter: blurP < 1 ? `blur(${at(blurP, blurFrom, 0).toFixed(2)}px)` : undefined,
              willChange: "transform, opacity, filter",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

/** scaleIn — cards, modals, thumbnails, images. Lands with a small overshoot. */
export const ScaleIn: React.FC<Common & { scaleFrom?: number; origin?: string }> = ({
  children,
  startF = 0,
  durF = 14,
  ease = "backOut",
  scaleFrom = 0.86,
  origin = "center",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: Math.min(1, p * 2),
        transform: `scale(${at(p, scaleFrom, 1)})`,
        transformOrigin: origin,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};

/** popIn — icons, cursors, badges, emoji. Spring with visible bounce. */
export const PopIn: React.FC<Common & { springPreset?: SpringName }> = ({
  children,
  startF = 0,
  durF = 18,
  springPreset = "snap",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ts(frame, fps, startF, springPreset, durF);
  return (
    <div
      className={className}
      style={{ ...style, transform: `scale(${p})`, opacity: p > 0.02 ? 1 : 0, willChange: "transform" }}
    >
      {children}
    </div>
  );
};

/**
 * drawOn — SVG path drawing via strokeDashoffset. Underlines, connectors,
 * circles, arrows, graph lines, hand-drawn accents.
 * Pass the path length (getTotalLength) or leave it and we use a generous default.
 */
export const DrawOn: React.FC<{
  d: string;
  length?: number;
  stroke: string;
  strokeWidth?: number;
  startF?: number;
  durF?: number;
  ease?: EaseName;
  viewBox: string;
  fill?: string;
  linecap?: "butt" | "round" | "square";
  style?: React.CSSProperties;
}> = ({
  d,
  length = 2000,
  stroke,
  strokeWidth = 3,
  startF = 0,
  durF = 24,
  ease = "expoInOut",
  viewBox,
  fill = "none",
  linecap = "round",
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  return (
    <svg viewBox={viewBox} style={style} fill="none">
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap={linecap}
        strokeDasharray={length}
        strokeDashoffset={at(p, length, 0)}
      />
    </svg>
  );
};

/** unblurIn — logos, hero shots, photos. Focus-pull entrance. */
export const UnblurIn: React.FC<Common & { blurFrom?: number; scaleFrom?: number }> = ({
  children,
  startF = 0,
  durF = 20,
  ease = "expoOut",
  blurFrom = 18,
  scaleFrom = 1.04,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  return (
    <div
      className={className}
      style={{
        ...style,
        filter: `blur(${at(p, blurFrom, 0).toFixed(2)}px)`,
        transform: `scale(${at(p, scaleFrom, 1)})`,
        opacity: Math.min(1, p * 2.5),
        willChange: "filter, transform",
      }}
    >
      {children}
    </div>
  );
};

/**
 * slideStackIn — layered cards / sheets of paper / stacked UI panels.
 * Each layer offsets in z (via translateY + scale + shadow) and arrives late.
 */
export const SlideStackIn: React.FC<{
  layers: React.ReactNode[];
  startF?: number;
  durF?: number;
  staggerF?: number;
  yFrom?: number;
  zStep?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ layers, startF = 0, durF = 20, staggerF = 2, yFrom = 40, zStep = 8, className, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div className={className} style={{ ...style, position: "relative" }}>
      {layers.map((layer, i) => {
        const p = ts(frame, fps, startF + i * staggerF, "soft", durF);
        const depth = layers.length - 1 - i;
        return (
          <div
            key={i}
            style={{
              position: i === 0 ? "relative" : "absolute",
              inset: i === 0 ? undefined : 0,
              zIndex: i,
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${at(p, yFrom, -depth * zStep)}px) scale(${at(p, 0.96, 1 - depth * 0.02)})`,
              boxShadow: `0 ${18 + depth * 6}px ${48 + depth * 12}px rgba(0,0,0,${0.16 - depth * 0.02})`,
              willChange: "transform, opacity",
            }}
          >
            {layer}
          </div>
        );
      })}
    </div>
  );
};

/**
 * checkOn — a checkbox/tick that fills then draws. The single most legible way
 * to say "this step is done" in a product video.
 */
export const CheckOn: React.FC<{
  startF?: number;
  size?: number;
  accent: string;
  ink?: string;
  style?: React.CSSProperties;
}> = ({ startF = 0, size = 28, accent, ink = "#fff", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = ts(frame, fps, startF, "snap", 16);
  const tick = t(frame, startF + 6, 12, "expoOut");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="7"
        fill={accent}
        style={{ transform: `scale(${box})`, transformOrigin: "12px 12px" }}
      />
      <path
        d="M6.5 12.5 L10.5 16.5 L17.5 8"
        stroke={ink}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={20}
        strokeDashoffset={at(tick, 20, 0)}
      />
    </svg>
  );
};

/**
 * cursor — a synthetic pointer that travels between targets and clicks.
 * Essential for UI-showcase videos: a real screen recording can't be timed to
 * a beat grid, but this can.
 */
export const Cursor: React.FC<{
  path: { x: number; y: number; atF: number; click?: boolean }[];
  size?: number;
  color?: string;
}> = ({ path, size = 22, color = "#111" }) => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < path.length - 1 && frame >= path[i + 1].atF) i++;
  const a = path[i];
  const b = path[Math.min(path.length - 1, i + 1)];
  const p = b.atF === a.atF ? 1 : t(frame, a.atF, b.atF - a.atF, "expoInOut");
  const x = at(p, a.x, b.x);
  const y = at(p, a.y, b.y);

  // click ripple: fires on the frame a waypoint marked click is reached
  const clickPt = path.find((q) => q.click && frame >= q.atF && frame < q.atF + 14);
  const ripple = clickPt ? t(frame, clickPt.atF, 14, "expoOut") : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
      {clickPt && (
        <div
          style={{
            position: "absolute",
            left: -18,
            top: -18,
            width: 36,
            height: 36,
            borderRadius: 999,
            border: `2px solid ${color}`,
            opacity: 1 - ripple,
            transform: `scale(${at(ripple, 0.3, 1.5)})`,
          }}
        />
      )}
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))" }}>
        <path d="M5 2 L5 19 L9.5 14.5 L12.5 21.5 L15.5 20 L12.5 13.5 L19 13.5 Z" fill={color} stroke="#fff" strokeWidth="1.4" />
      </svg>
    </div>
  );
};

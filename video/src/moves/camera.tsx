import React from "react";
import { useCurrentFrame } from "remotion";
import { EaseName, at, atScale, osc, t } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   CAMERA MOVES — applied to a whole shot, not to one element.

   Camera is how a flat composition gains depth without 3D. Every shot in a
   launch video should have exactly one camera move; two competing camera moves
   read as a mistake.
   ──────────────────────────────────────────────────────────────────────────── */

type CamProps = {
  children: React.ReactNode;
  startF?: number;
  durF?: number;
  ease?: EaseName;
  style?: React.CSSProperties;
};

/** pushIn — the default. Slow scale up over the whole shot. */
export const PushIn: React.FC<CamProps & { from?: number; to?: number; origin?: string }> = ({
  children,
  startF = 0,
  durF = 90,
  ease = "expoInOut",
  from = 1,
  to = 1.06,
  origin = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const s = at(t(frame, startF, durF, ease), from, to);
  return (
    <div
      style={{ ...style, width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: origin }}
    >
      {children}
    </div>
  );
};

/** pullOut — starts tight, opens up. Use for reveals of context. */
export const PullOut: React.FC<CamProps & { from?: number; to?: number }> = (props) => (
  <PushIn {...props} from={props.from ?? 1.09} to={props.to ?? 1} />
);

/**
 * dollyToUI — zoom and translate so a specific point in the composition ends up
 * centred and magnified. The move that makes a dense interface legible.
 * focus is in percent of the composition (0..100).
 */
export const DollyToUI: React.FC<
  CamProps & { focus: { x: number; y: number }; zoom?: number }
> = ({ children, startF = 0, durF = 36, ease = "expoInOut", focus, zoom = 2.4, style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  // 2.4x by default — large enough that linear scale interpolation visibly
  // decelerates. Interpolate in area space instead.
  const s = atScale(p, 1, zoom);
  // translate so `focus` stays put while scaling from centre
  const tx = at(p, 0, (50 - focus.x) * (zoom - 1) / zoom);
  const ty = at(p, 0, (50 - focus.y) * (zoom - 1) / zoom);
  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        transform: `scale(${s}) translate(${tx}%, ${ty}%)`,
        transformOrigin: "center",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

/**
 * orbit3D — CSS 3D rotation with perspective. Gives a flat card real volume.
 * Keep the angle small (≤14°); more looks like a template.
 */
export const Orbit3D: React.FC<
  CamProps & { fromDeg?: number; toDeg?: number; axis?: "x" | "y"; perspective?: number }
> = ({
  children,
  startF = 0,
  durF = 40,
  ease = "expoOut",
  fromDeg = -12,
  toDeg = 0,
  axis = "y",
  perspective = 1200,
  style,
}) => {
  const frame = useCurrentFrame();
  const deg = at(t(frame, startF, durF, ease), fromDeg, toDeg);
  return (
    <div style={{ ...style, perspective: `${perspective}px`, width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotate${axis.toUpperCase()}(${deg}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * tiltIdle — permanent small 3D wobble. Pair with Orbit3D's resting state so a
 * UI panel keeps a sense of being a physical object.
 */
export const TiltIdle: React.FC<{
  children: React.ReactNode;
  ampDeg?: number;
  periodF?: number;
  perspective?: number;
}> = ({ children, ampDeg = 2.5, periodF = 260, perspective = 1400 }) => {
  const frame = useCurrentFrame();
  const ry = osc(frame, periodF) * ampDeg;
  const rx = osc(frame, periodF * 1.6, 0.8) * ampDeg * 0.5;
  return (
    <div style={{ perspective: `${perspective}px`, width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * rackFocus — front layer blurs out while back layer sharpens. Directs the eye
 * without moving anything. Cheap and very effective.
 */
export const RackFocus: React.FC<{
  front: React.ReactNode;
  back: React.ReactNode;
  startF?: number;
  durF?: number;
  maxBlur?: number;
}> = ({ front, back, startF = 0, durF = 18, maxBlur = 10 }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  return (
    <>
      <div style={{ position: "absolute", inset: 0, filter: `blur(${at(p, maxBlur, 0).toFixed(2)}px)` }}>
        {back}
      </div>
      <div style={{ position: "absolute", inset: 0, filter: `blur(${at(p, 0, maxBlur).toFixed(2)}px)` }}>
        {front}
      </div>
    </>
  );
};

/**
 * whipPan — a TRANSITION, not a reveal. 6 frames, heavy directional blur.
 * Put it at a cut boundary; never inside a shot.
 */
export const WhipPan: React.FC<{
  children: React.ReactNode;
  startF?: number;
  durF?: number;
  dir?: "left" | "right";
  distancePct?: number;
}> = ({ children, startF = 0, durF = 6, dir = "left", distancePct = 60 }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoInOut");
  const sign = dir === "left" ? -1 : 1;
  // blur peaks mid-move
  const blur = Math.sin(p * Math.PI) * 22;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `translateX(${at(p, sign * distancePct, 0)}%)`,
        filter: `blur(${blur.toFixed(1)}px)`,
      }}
    >
      {children}
    </div>
  );
};

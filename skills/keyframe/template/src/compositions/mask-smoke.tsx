import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  ConcentricRings,
  ConcentricShapeBurst,
  FillToStroke,
  HardSwap,
  HoloEchoOutline,
  IrisMaskReveal,
  TravelingShapeWipe,
} from "../moves";

/**
 * Proof that the shape-mask family renders headlessly.
 *
 * `clip-path: circle()`, `clip-path: polygon()`, SVG stroke-dash and
 * `transform-box: fill-box` all behave differently in headless Chromium than in
 * a dev browser, so each one gets exercised here before being used in a film.
 * Render a still at any frame:
 *   npx remotion still src/index.ts MaskSmoke out/masks.png --frame=30
 */

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div
    style={{
      position: "relative",
      background: "#15131C",
      borderRadius: 14,
      overflow: "hidden",
      display: "grid",
      placeItems: "center",
      color: "#8000FF",
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        bottom: 8,
        left: 12,
        font: "600 15px ui-sans-serif, system-ui",
        letterSpacing: "0.06em",
        color: "#8B8797",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

const Swatch: React.FC<{ c: string }> = ({ c }) => (
  <AbsoluteFill style={{ background: c }} />
);

// stroked, not filled — an opaque fill makes the largest copy hide all the rest
const Blob: React.FC = () => (
  <svg viewBox="0 0 100 100" width={90} height={90}>
    <path
      d="M50 8 L88 32 L76 78 L24 78 L12 32 Z"
      fill="none"
      stroke="#B57CFF"
      strokeWidth={4}
    />
  </svg>
);

export const MaskSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0B0A0F", padding: 28 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 18,
          width: "100%",
          height: "100%",
        }}
      >
        <Cell label="iris">
          <IrisMaskReveal startF={0} durF={40} origin={{ x: 70, y: 65 }}>
            <Swatch c="#B57CFF" />
          </IrisMaskReveal>
        </Cell>

        <Cell label="iris invert">
          <IrisMaskReveal startF={0} durF={40} origin={{ x: 35, y: 40 }} invert>
            <Swatch c="#FFBC00" />
          </IrisMaskReveal>
        </Cell>

        <Cell label="traveling shape">
          <TravelingShapeWipe startF={0} durF={44} shape="chevron">
            <Swatch c="#8000FF" />
          </TravelingShapeWipe>
        </Cell>

        <Cell label="rings reveal">
          <ConcentricRings startF={0} durF={34} color="#B57CFF" size={190} />
        </Cell>

        <Cell label="rings ambient">
          <ConcentricRings ambientPeriodF={120} color="#8000FF" size={190} />
        </Cell>

        <Cell label="fill → stroke">
          <FillToStroke
            viewBox="0 0 100 100"
            fill="#8000FF"
            stroke="#B57CFF"
            strokeWidth={3}
            startF={0}
            durF={44}
            style={{ width: 170, height: 170 }}
            geometry={
              <>
                <circle cx="36" cy="40" r="22" />
                <circle cx="64" cy="60" r="22" />
              </>
            }
          />
        </Cell>

        <Cell label="holo echo">
          <HoloEchoOutline
            viewBox="0 0 100 100"
            d="M20 70 C 20 20, 80 20, 80 70"
            length={220}
            startF={0}
            durF={44}
            strokeWidth={4}
            style={{ width: 180, height: 180 }}
          />
        </Cell>

        <Cell label="hard swap + burst">
          <ConcentricShapeBurst
            shape={<Blob />}
            copies={10}
            startF={0}
            durF={40}
            scaleTo={[0.4, 2.2]}
            style={{ position: "absolute", inset: 0 }}
          />
          <HardSwap
            startF={0}
            intervalF={4}
            layers={["◆", "▲", "●", "■"].map((g) => (
              <span key={g} style={{ font: "700 40px ui-sans-serif", color: "#FFBC00" }}>
                {g}
              </span>
            ))}
          />
        </Cell>
      </div>
    </AbsoluteFill>
  );
};

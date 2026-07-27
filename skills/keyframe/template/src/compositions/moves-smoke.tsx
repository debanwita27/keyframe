import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  AsyncDrift,
  ConveyorSlide,
  DualSpeechChips,
  FlattenToIsometric,
  FontSwapBlur,
  Fragments,
  LiveCounter,
  PaperFoldIn,
  ParticleField,
  RackLoop,
  RadialCluster,
  StepRelay,
  ToastPop,
  WordBuild,
  WordCycle,
} from "../moves";

/**
 * Exercises the 15 newly-implemented PATTERNS §2 moves so each is verified to
 * RENDER, not merely to compile. Rendering the mask family caught a component
 * that compiled fine and drew nothing, so this step is not optional.
 *
 *   npx remotion still src/index.ts MovesSmoke out/moves.png --frame=34
 */

const C = { bg: "#0B0A0F", panel: "#1E1B2B", ink: "#EFEDF2", soft: "#8B8797", accent: "#8000FF" };

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div
    style={{
      position: "relative",
      background: C.panel,
      borderRadius: 12,
      overflow: "hidden",
      display: "grid",
      placeItems: "center",
      padding: 14,
      color: C.ink,
      font: "500 20px ui-sans-serif, system-ui",
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        bottom: 6,
        left: 10,
        font: "600 11px ui-sans-serif",
        letterSpacing: "0.08em",
        color: C.soft,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

// #2A2540 against the #1E1B2B panel is a ~12/255 difference per channel, i.e.
// invisible — the isometric cell read as empty twice before this was the cause,
// not the component. Contrast in a smoke test is part of the test.
// Fixed px width, not a percentage. A percentage width on an empty div inside a
// content-sized grid/flex track resolves against an indefinite basis and computes
// to ZERO — the isometric cell laid out correctly (verified with an outline) while
// its children silently collapsed. Real trap; worth knowing.
const Card: React.FC<{ h?: number; c?: string; w?: number }> = ({ h = 52, c = "#6E5FA8", w = 132 }) => (
  <div style={{ width: w, height: h, borderRadius: 8, background: c }} />
);

const Dot: React.FC = () => (
  <div style={{ width: 34, height: 34, borderRadius: 999, background: C.accent }} />
);

/** each cell starts 20f after the previous, so the grid plays through */
const S = (i: number) => i * 20;

export const MovesSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, padding: 22 }}>
      <ParticleField count={40} color="#B57CFF" opacity={0.35} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 14,
          width: "100%",
          height: "100%",
        }}
      >
        <Cell label="wordCycle">
          <WordCycle words={["faster", "clearer", "sharper", "shipped"]} startF={S(0)} durF={48} />
        </Cell>

        <Cell label="wordBuild">
          <WordBuild stem="proto" suffix="typed" startF={S(1)} durF={28} />
        </Cell>

        <Cell label="liveCounter">
          <LiveCounter base={1284} amplitude={40} periodF={41} prefix="" suffix=" req/s" />
        </Cell>

        <Cell label="toastPop">
          <ToastPop startF={S(3)} style={{ font: "600 15px ui-sans-serif" }}>
            PRD ready
          </ToastPop>
        </Cell>

        <Cell label="fontSwapBlur">
          <FontSwapBlur
            text="Launch"
            families={["ui-serif, Georgia", "ui-monospace, monospace", "ui-sans-serif, system-ui"]}
            startF={S(4)}
            swapEveryF={9}
            style={{ fontSize: 30, fontWeight: 700 }}
          />
        </Cell>

        <Cell label="dualSpeechChips">
          <DualSpeechChips
            first="they want someone"
            second="who gets them"
            startF={S(5)}
            solid={C.accent}
            ink="#fff"
            outlineInk="#B57CFF"
            style={{ font: "500 12px ui-sans-serif", width: "100%" }}
          />
        </Cell>

        <Cell label="stepRelay">
          <StepRelay
            steps={["Shape", "Define", "Validate", "Ship"]}
            atF={[S(6), S(6) + 14, S(6) + 28, S(6) + 42]}
            accent={C.accent}
            ink={C.ink}
            inkSoft={C.soft}
            style={{ font: "500 15px ui-sans-serif", width: "100%" }}
          />
        </Cell>

        <Cell label="radialCluster">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <RadialCluster radius={58} startF={S(7)} staggerF={3}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    color: "#111",
                    borderRadius: 8,
                    padding: "5px 9px",
                    font: "600 10px ui-sans-serif",
                  }}
                >
                  tag {i + 1}
                </div>
              ))}
            </RadialCluster>
          </div>
        </Cell>

        <Cell label="asyncDrift">
          <AsyncDrift
            ampPx={9}
            periodF={70}
            style={{ display: "flex", gap: 10 }}
            itemStyle={{ willChange: "transform" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Dot key={i} />
            ))}
          </AsyncDrift>
        </Cell>

        <Cell label="conveyorSlide">
          <ConveyorSlide
            items={["ACME", "Globex", "Initech"].map((n) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: 74,
                  background: "#2A2540",
                  borderRadius: 8,
                  font: "700 18px ui-sans-serif",
                }}
              >
                {n}
              </div>
            ))}
            holdF={18}
            slideDurF={10}
            style={{ width: "88%", height: 74, borderRadius: 8 }}
            containerStyle={{ height: 74 }}
          />
        </Cell>

        <Cell label="flattenToIsometric">
          {/* explicit size: the component is width/height 100%, which collapses
              inside a content-sized grid cell */}
          <div style={{ width: 170, height: 110 }}>
            <FlattenToIsometric startF={S(10)} durF={34} tiltDeg={16} rotateZDeg={-9}>
              {/* width:100% is load-bearing. The Cards use a percentage width, and
                  inside a place-content:center grid the track is sized to content —
                  a percentage against an indefinite track resolves to ZERO, so the
                  cards vanished while the wrapper laid out correctly. */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Card h={20} c="#B57CFF" />
                <Card h={20} />
                <Card h={20} />
              </div>
            </FlattenToIsometric>
          </div>
        </Cell>

        <Cell label="paperFoldIn">
          <PaperFoldIn startF={S(11)} durF={30} origin="top">
            <div
              style={{
                width: 130,
                height: 78,
                borderRadius: 10,
                background: "#fff",
                display: "grid",
                placeItems: "center",
                color: "#111",
                font: "600 12px ui-sans-serif",
              }}
            >
              card
            </div>
          </PaperFoldIn>
        </Cell>

        <Cell label="fragments converge">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Fragments
              mode="converge"
              startF={S(12)}
              durF={34}
              spread={120}
              to={[
                { x: -30, y: -26 }, { x: 0, y: -34 }, { x: 30, y: -26 },
                { x: -30, y: 26 }, { x: 0, y: 34 }, { x: 30, y: 26 },
              ]}
              pieces={[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: i % 2 ? 999 : 5,
                    background: i % 3 === 0 ? C.accent : "#B57CFF",
                  }}
                />
              ))}
            />
          </div>
        </Cell>

        <Cell label="rackLoop">
          <RackLoop totalF={90} maxBlur={10}>
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
              <div style={{ font: "700 26px ui-sans-serif", color: C.ink }}>hero</div>
            </div>
          </RackLoop>
        </Cell>

        <Cell label="particleField">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <ParticleField count={26} color="#FFBC00" opacity={0.9} size={[3, 8]} />
          </div>
        </Cell>
      </div>
    </AbsoluteFill>
  );
};

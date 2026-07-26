import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Breathe,
  CheckOn,
  Cursor,
  DrawOn,
  DriftCamera,
  FilmGrain,
  GradientDrift,
  LineHighlight,
  MaskWipeSide,
  MaskWipeUp,
  OrbitRing,
  PushIn,
  ScaleIn,
  SpecularSweep,
  StaggerRise,
  TiltIdle,
  TypeOn,
  Vignette,
  at,
  osc,
  t,
  ts,
} from "../../moves";
import { useShotPhase } from "../../lib/film";
import { b } from "./beatgrid";
import { C, L, TYPE } from "./theme";

/* ────────────────────────────────────────────────────────────────────────────
   PRODUCT OS — launch film, category 1 (text-heavy tool).

   The problem with a text-heavy product is that every honest shot is words.
   The strategy here: never state a capability without giving it one concrete
   object on screen, and never put a whole sentence up at once.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Both bases own the ambient layer, so no shot can accidentally be still.
 * Amplitudes here are deliberately at the top of the allowed range (drift 1.8%,
 * gradient period 260f): the first cut of this film measured 672/779 frames
 * below the analyzer's static threshold, i.e. visually dead. Ambient motion has
 * to be large enough to register, while staying below conscious notice.
 */
const DarkBase: React.FC<{
  children: React.ReactNode;
  grain?: number;
  /**
   * Whether the CONTENT drifts with the camera. Off for the opening shots: a
   * prompt card is a fixed object on screen, and drifting it made the textarea
   * appear to wander. The background keeps moving either way, so the frame is
   * still alive.
   */
  driftContent?: boolean;
}> = ({ children, grain = 0.05, driftContent = true }) => {
  const phaseF = useShotPhase();
  return (
    <AbsoluteFill style={{ background: C.dark, overflow: "hidden" }}>
      <GradientDrift colors={["#3A0F7A", "#1B0B3D", "#4A1B8F"]} bg={C.dark} periodF={260} opacity={0.55} phaseF={phaseF} />
      {driftContent ? (
        <DriftCamera ampPct={1.4} periodF={240} zoom={1.05} phaseF={phaseF}>
          {children}
        </DriftCamera>
      ) : (
        children
      )}
      <FilmGrain opacity={grain} />
      <Vignette strength={0.22} />
    </AbsoluteFill>
  );
};

const LightBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const phaseF = useShotPhase();
  return (
    <AbsoluteFill style={{ background: C.light, overflow: "hidden" }}>
      <GradientDrift colors={["#E9DDFF", "#FFF3D6", "#F2EAFF"]} bg={C.light} periodF={300} opacity={0.8} phaseF={phaseF} />
      <DriftCamera ampPct={1.3} periodF={280} zoom={1.05} phaseF={phaseF}>
        {children}
      </DriftCamera>
      <FilmGrain opacity={0.045} />
      <Vignette strength={0.1} />
    </AbsoluteFill>
  );
};

/* ── 1. the blank prompt ─────────────────────────────────────────────── 40f */

const PromptCard: React.FC<{
  typedFrom?: number;
  text: string;
  /** frame the send button lights up; omit to keep it inert */
  activateAtF?: number;
  /** true only for the very first shot — everywhere else the card is already there */
  entrance?: boolean;
  /** shown until typing begins, so the card is never blank */
  placeholder?: string;
}> = ({ typedFrom, text, activateAtF, entrance = false, placeholder }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entrance ? ts(frame, fps, 0, "soft", 20) : 1;
  const active = activateAtF !== undefined && frame >= activateAtF;
  // the button lights over 8f rather than popping on a cut
  const lit = activateAtF === undefined ? 0 : t(frame, activateAtF, 8, "expoOut");
  return (
    <div
      style={{
        width: 1380,
        padding: "44px 48px 40px",
        borderRadius: 26,
        background: C.darkPanel,
        border: `1px solid ${C.lineDark}`,
        boxShadow: L.shadowDark,
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${at(p, 26, 0)}px) scale(${at(p, 0.97, 1)})`,
      }}
    >
      <div style={{ ...TYPE.label, color: C.onDarkSoft, marginBottom: 26 }}>product os</div>
      <div style={{ ...TYPE.mono, color: C.onDark, minHeight: 96, lineHeight: 1.35 }}>
        {typedFrom === undefined ? (
          <span style={{ color: C.onDarkSoft }}>{text}</span>
        ) : frame < typedFrom ? (
          // Before the first keystroke the card must not be empty — shot 2 opened
          // on a blank box for two frames, which reads as a broken render.
          <span style={{ color: C.onDarkSoft }}>{placeholder ?? ""}</span>
        ) : (
          <TypeOn text={text} startF={typedFrom} charsPerF={1.15} caret punctuationHoldF={5} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 999,
            background: lit > 0.02 ? C.accent : C.lineDark,
            transform: `scale(${1 + lit * 0.06})`,
            display: "grid",
            placeItems: "center",
            transition: "none",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke={active ? "#fff" : C.onDarkSoft} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const S1_Blank: React.FC = () => (
  <DarkBase driftContent={false}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <PromptCard text="ask product os anything…" entrance />
    </AbsoluteFill>
  </DarkBase>
);

/* ── 2. the real question gets typed ─────────────────────────────────── 85f */

export const S2_Typing: React.FC = () => (
  <DarkBase driftContent={false}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <PromptCard
        text="i have a rough idea. where do i even start?"
        typedFrom={0}
        activateAtF={62}
        placeholder="ask product os anything…"
      />
    </AbsoluteFill>
  </DarkBase>
);

/* ── 3. submit ───────────────────────────────────────────────────────── 25f */

export const S3_Submit: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = t(frame, 22, 5, "expoIn");
  const collapse = t(frame, 13, 14, "expoIn");
  return (
    <DarkBase driftContent={false}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${at(collapse, 1, 1.06)})`,
          filter: `blur(${at(collapse, 0, 12)}px)`,
          opacity: 1 - collapse * 0.6,
        }}
      >
        <PromptCard text="i have a rough idea. where do i even start?" typedFrom={-400} activateAtF={-1} />
      </AbsoluteFill>
      <Cursor
        path={[
          { x: 1120, y: 830, atF: 0 },
          { x: 1521, y: 627, atF: 11, click: true },
        ]}
        color="#F4F1FA"
      />
      <AbsoluteFill style={{ background: C.light, opacity: flash }} />
    </DarkBase>
  );
};

/* ── 4. the title ────────────────────────────────────────────────────── 55f */

export const S4_Title: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <LightBase>
      <PushIn from={1.05} to={1} durF={55}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <MaskWipeUp
              startF={0}
              durF={20}
              perLineStaggerF={3}
              lines={[
                <span key="a" style={{ ...TYPE.hero, color: C.ink }}>
                  Product OS
                </span>,
              ]}
            />
            <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
              <DrawOn
                viewBox="0 0 620 12"
                d="M6 6 C 160 1, 460 11, 614 6"
                length={640}
                stroke={C.accent}
                strokeWidth={7}
                startF={b(1)}
                durF={26}
                style={{ width: 620, height: 12 }}
              />
            </div>
            <div style={{ overflow: "hidden", marginTop: 30 }}>
              <MaskWipeUp
                startF={b(2)}
                durF={18}
                lines={[
                  <span key="b" style={{ ...TYPE.body, color: C.inkSoft }}>
                    A structured partner for the whole product lifecycle
                  </span>,
                ]}
              />
            </div>
          </div>
        </AbsoluteFill>
      </PushIn>
    </LightBase>
  );
};

/* ── 5. the reframe ──────────────────────────────────────────────────── 55f */

export const S5_Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const roles = ["Product", "Design", "Engineering"];
  return (
    <LightBase>
      <AbsoluteFill style={{ padding: L.margin, justifyContent: "center" }}>
        <MaskWipeUp
          startF={0}
          durF={18}
          lines={[
            <span key="a" style={{ ...TYPE.h2, color: C.inkSoft }}>
              Whatever you're building, start here.
            </span>,
          ]}
          style={{ marginBottom: 30 }}
        />
        <MaskWipeUp
          startF={b(1)}
          durF={20}
          perLineStaggerF={3}
          lines={[
            <span key="a" style={{ ...TYPE.h1, color: C.ink }}>
              Made for
            </span>,
          ]}
        />
        <div style={{ display: "flex", gap: 22, marginTop: 20 }}>
          {roles.map((r, i) => {
            const p = t(frame, b(2) + i * 3, 16, "backOut");
            return (
              <div
                key={r}
                style={{
                  ...TYPE.h1,
                  color: i === 1 ? "#fff" : C.ink,
                  background: i === 1 ? C.accent : "transparent",
                  border: i === 1 ? "none" : `3px solid ${C.ink}`,
                  borderRadius: 999,
                  padding: "10px 38px 16px",
                  opacity: Math.min(1, p * 2),
                  transform: `translateY(${at(p, 30, 0)}px) scale(${at(p, 0.92, 1)})`,
                }}
              >
                {r}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </LightBase>
  );
};

/* ── 6. the lifecycle rail ───────────────────────────────────────────── 75f */

const STAGES = ["Shape", "Define", "Validate", "Prototype", "Ship"];

export const S6_Rail: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(STAGES.length - 1, Math.floor(t(frame, b(1), 70, "expoInOut") * STAGES.length));
  return (
    <DarkBase grain={0.055}>
      <AbsoluteFill style={{ padding: L.margin, justifyContent: "center" }}>
        <MaskWipeUp
          startF={0}
          durF={16}
          lines={[
            <span key="a" style={{ ...TYPE.label, color: C.accentSoft }}>
              from first idea to ready-to-build
            </span>,
          ]}
          style={{ marginBottom: 54 }}
        />
        <div style={{ position: "relative", height: 190, width: 1360, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: 52, left: 0, width: "100%" }}>
            <DrawOn
              viewBox="0 0 1520 8"
              d="M4 4 H 1516"
              length={1520}
              stroke={C.lineDark}
              strokeWidth={6}
              startF={0}
              durF={30}
              style={{ width: "100%", height: 8 }}
            />
          </div>
          <div style={{ position: "absolute", top: 52, left: 0, width: "100%" }}>
            <DrawOn
              viewBox="0 0 1520 8"
              d="M4 4 H 1516"
              length={1520}
              stroke={C.accent}
              strokeWidth={6}
              startF={b(1)}
              durF={72}
              style={{ width: "100%", height: 8 }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {STAGES.map((s, i) => {
              const p = t(frame, b(0.5) + i * 3, 16, "backOut");
              const isActive = i <= active;
              return (
                <div key={s} style={{ textAlign: "center", width: 272 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      margin: "30px auto 0",
                      borderRadius: 999,
                      background: isActive ? C.accent : C.darkPanel,
                      border: `3px solid ${isActive ? C.accent : C.lineDark}`,
                      transform: `scale(${p * (i === active ? 1 + Math.abs(osc(frame, 24)) * 0.14 : 1)})`,
                      boxShadow: i === active ? `0 0 34px ${C.accent}` : "none",
                    }}
                  />
                  <div
                    style={{
                      ...TYPE.h2,
                      fontSize: 54,
                      marginTop: 30,
                      color: isActive ? C.onDark : C.onDarkSoft,
                      opacity: Math.min(1, p * 2),
                      transform: `translateY(${at(p, 18, 0)}px)`,
                    }}
                  >
                    {s}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </DarkBase>
  );
};

/* ── 7. capability beats ──────────────────────────────── 6 × 40f = 240f ── */

/** Every capability beat: one line of copy + one concrete object. Never copy alone. */
const Beat: React.FC<{
  label: string;
  n: number;
  dark?: boolean;
  children: React.ReactNode;
}> = ({ label, n, dark, children }) => {
  const Base = dark ? DarkBase : LightBase;
  return (
    <Base>
      {/* Longer than the longest shot (94f) on purpose: the push must still be
          moving when the cut comes, otherwise the extra reading time added to the
          text-heavy beats turns into a frozen tail. */}
      <PushIn from={1} to={1.06} durF={100} ease="expoInOut">
      <AbsoluteFill style={{ padding: L.margin, flexDirection: "row", alignItems: "center", gap: 70 }}>
        <div style={{ flex: "0 0 780px" }}>
          <div
            style={{
              ...TYPE.label,
              color: dark ? C.accentSoft : C.accent,
              marginBottom: 22,
              opacity: t(useCurrentFrame(), 0, 8, "expoOut"),
            }}
          >
            {String(n).padStart(2, "0")}
          </div>
          <MaskWipeUp
            startF={0}
            durF={18}
            perLineStaggerF={3}
            lines={label.split("|").map((l, i) => (
              <span key={i} style={{ ...TYPE.h1, fontSize: 82, color: dark ? C.onDark : C.ink }}>
                {l}
              </span>
            ))}
          />
        </div>
        <div style={{ flex: 1, display: "grid", placeItems: "center", height: "100%" }}>{children}</div>
      </AbsoluteFill>
      </PushIn>
    </Base>
  );
};

const Card: React.FC<{ w?: number; h?: number; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  w = 300,
  h = 180,
  dark,
  children,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: L.radius,
      background: dark ? C.darkPanel : C.lightPanel,
      border: `1px solid ${dark ? C.lineDark : C.line}`,
      boxShadow: dark ? L.shadowDark : L.shadow,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

const SkeletonLines: React.FC<{ n?: number; startF?: number; dark?: boolean; widths?: number[] }> = ({
  n = 4,
  startF = 8,
  dark,
  widths,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: n }, (_, i) => (
        <MaskWipeSide key={i} startF={startF + i * 3} durF={14} dir="ltr">
          <div
            style={{
              height: 12,
              width: `${widths?.[i] ?? 96 - i * 13}%`,
              borderRadius: 6,
              background: dark ? C.lineDark : C.line,
            }}
          />
        </MaskWipeSide>
      ))}
    </div>
  );
};

/** 7a — explore & validate ideas: three idea cards, one gets picked */
export const S7a_Ideas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Beat n={1} label={"Explore and|validate ideas"}>
      <div style={{ position: "relative", width: 700, height: 470 }}>
        <StaggerRise
          startF={0}
          durF={22}
          staggerF={4}
          yFrom={34}
          items={[0, 1, 2].map((i) => (
            <div key={i} style={{ transform: `rotate(${[-4, 0, 4][i]}deg)` }}>
              <Card w={640} h={148} style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ flex: 1 }}>
                    <SkeletonLines n={2} startF={12 + i * 4} widths={[86, 54]} />
                  </div>
                  {i === 1 && <CheckOn startF={b(2)} size={52} accent={C.accent} />}
                </div>
              </Card>
            </div>
          ))}
        />
      </div>
    </Beat>
  );
};

/** 7b — benchmark competitor UX: a grid of screens, one lifts out */
export const S7b_Benchmark: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = t(frame, b(1.5), 18, "expoOut");
  return (
    <Beat n={2} dark label={"Benchmark|competitor UX"}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 250px)", gap: 24 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const p = t(frame, i * 2, 16, "expoOut");
          const hero = i === 4;
          return (
            <div
              key={i}
              style={{
                height: 170,
                borderRadius: L.radiusSm,
                background: "#241F33",
                border: `2px solid ${hero && lift > 0.2 ? C.accent : "#3A3450"}`,
                opacity: Math.min(1, p * 1.5) * (hero ? 1 : 1 - lift * 0.55),
                transform: `translateY(${at(p, 24, 0)}px) scale(${hero ? at(lift, 1, 1.22) : at(lift, 1, 0.96)})`,
                boxShadow: hero && lift > 0.2 ? `0 20px 60px rgba(128,0,255,.45)` : "none",
                padding: 14,
                zIndex: hero ? 2 : 1,
              }}
            >
              <div style={{ height: 10, width: "46%", borderRadius: 5, background: "#4A4368", marginBottom: 12 }} />
              <div style={{ height: 48, borderRadius: 8, background: hero ? "#3A2470" : "#302A45" }} />
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <div style={{ height: 26, flex: 1, borderRadius: 5, background: "#302A45" }} />
                <div style={{ height: 26, flex: 1, borderRadius: 5, background: "#302A45" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Beat>
  );
};

/** 7c — structure the problem: scattered chips snap into an ordered stack */
export const S7c_Structure: React.FC = () => {
  const frame = useCurrentFrame();
  const snap = t(frame, b(1), 22, "expoInOut");
  const chips = ["churn?", "onboarding", "pricing", "retention", "support load"];
  const scatter = [
    { x: -240, y: -160, r: -14 },
    { x: 215, y: -80, r: 11 },
    { x: -165, y: 145, r: 8 },
    { x: 250, y: 120, r: -9 },
    { x: 15, y: -225, r: 5 },
  ];
  return (
    <Beat n={3} label={"Structure the|problem"}>
      <div style={{ position: "relative", width: 720, height: 500 }}>
        {chips.map((c, i) => {
          const appear = t(frame, i * 2, 14, "backOut");
          const x = at(snap, scatter[i].x, 0);
          const y = at(snap, scatter[i].y, -215 + i * 108);
          const r = at(snap, scatter[i].r, 0);
          return (
            <div
              key={c}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                ...TYPE.body,
                fontSize: 42,
                color: C.ink,
                background: C.lightPanel,
                border: `2px solid ${snap > 0.7 && i === 0 ? C.accent : C.line}`,
                borderRadius: 999,
                padding: "16px 34px",
                boxShadow: L.shadow,
                whiteSpace: "nowrap",
                opacity: Math.min(1, appear * 1.6),
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${r}deg) scale(${appear})`,
              }}
            >
              {c}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 5,
            height: at(snap, 0, 500),
            background: C.accent,
            opacity: snap * 0.5,
          }}
        />
      </div>
    </Beat>
  );
};

/** 7d — objectives, metrics, PRD: a document writing itself, with a live metric */
export const S7d_Prd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Beat n={4} dark label={"Objectives,|metrics, PRDs"}>
      <div style={{ position: "relative" }}>
        <TiltIdle ampDeg={2} periodF={200}>
          <ScaleIn startF={0} durF={18}>
            <Card w={640} h={430} dark>
              <div style={{ ...TYPE.label, color: C.onDarkSoft, marginBottom: 20 }}>prd · draft</div>
              <div style={{ ...TYPE.h2, fontSize: 42, color: C.onDark, marginBottom: 26 }}>
                <MaskWipeSide startF={b(0.5)} durF={20}>
                  Reduce time-to-first-PRD
                </MaskWipeSide>
              </div>
              <SkeletonLines n={5} startF={18} dark widths={[94, 78, 88, 62, 40]} />
            </Card>
          </ScaleIn>
        </TiltIdle>
        <div
          style={{
            position: "absolute",
            right: -90,
            bottom: -40,
            opacity: t(frame, b(1.5), 14, "expoOut"),
            transform: `translateY(${at(t(frame, b(1.5), 16, "backOut"), 30, 0)}px)`,
          }}
        >
          <Card w={300} h={150} dark style={{ borderColor: C.accent }}>
            <div style={{ ...TYPE.label, color: C.onDarkSoft, marginBottom: 10 }}>success metric</div>
            <div style={{ ...TYPE.h1, fontSize: 68, color: C.accentSoft }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {Math.round(at(t(frame, b(1.5), 22, "expoOut"), 0, 4))}×
              </span>
            </div>
          </Card>
        </div>
      </div>
    </Beat>
  );
};

/** 7e — research the internal knowledge base: docs orbit a core */
export const S7e_Knowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const docs = ["glossary", "past PRDs", "research", "metrics", "playbooks", "post-mortems"];
  return (
    <Beat n={5} label={"Research our own|knowledge base"}>
      <div style={{ position: "relative", width: 720, height: 520 }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Breathe amp={0.02} periodF={110}>
            <div
              style={{
                width: 168,
                height: 168,
                borderRadius: 999,
                background: C.accent,
                display: "grid",
                placeItems: "center",
                boxShadow: `0 0 70px rgba(128,0,255,.5)`,
                ...TYPE.label,
                color: "#fff",
                fontSize: 16,
              }}
            >
              product os
            </div>
          </Breathe>
        </div>
        <OrbitRing
          radius={250}
          periodF={700}
          revealStartF={0}
          revealStaggerF={3}
          style={{ left: "50%", top: "50%" }}
          children={docs.map((d) => (
            <div
              key={d}
              style={{
                ...TYPE.body,
                fontSize: 26,
                color: C.ink,
                background: C.lightPanel,
                border: `1px solid ${C.line}`,
                borderRadius: 12,
                padding: "12px 20px",
                boxShadow: L.shadow,
                whiteSpace: "nowrap",
              }}
            >
              {d}
            </div>
          ))}
        />
      </div>
    </Beat>
  );
};

/** 7f — visualize and prototype: wireframe assembles into a real UI */
export const S7f_Prototype: React.FC = () => {
  const frame = useCurrentFrame();
  const solidify = t(frame, b(1.25), 20, "expoInOut");
  return (
    <Beat n={6} dark label={"Visualize it, then|prototype it"}>
      <TiltIdle ampDeg={2.4} periodF={230}>
        <ScaleIn startF={0} durF={20} scaleFrom={0.9}>
          <div
            style={{
              width: 760,
              height: 460,
              borderRadius: L.radius,
              background: `rgba(21,19,28,${at(solidify, 0.3, 1)})`,
              border: `${at(solidify, 2, 1)}px ${solidify > 0.5 ? "solid" : "dashed"} ${
                solidify > 0.5 ? C.lineDark : C.accentSoft
              }`,
              boxShadow: solidify > 0.5 ? L.shadowDark : "none",
              padding: 26,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: solidify > 0.5 ? C.accent : "transparent", border: `2px ${solidify > 0.5 ? "solid" : "dashed"} ${C.accentSoft}` }} />
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: solidify > 0.5 ? C.lineDark : "transparent", border: solidify > 0.5 ? "none" : `2px dashed ${C.accentSoft}` }} />
            </div>
            <div style={{ display: "flex", gap: 18, flex: 1 }}>
              {[0, 1, 2].map((i) => {
                const p = t(frame, i * 3, 16, "expoOut");
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      background: solidify > 0.5 ? C.darkPanel : "transparent",
                      border: `2px ${solidify > 0.5 ? "solid" : "dashed"} ${solidify > 0.5 ? C.lineDark : C.accentSoft}`,
                      opacity: Math.min(1, p * 1.5),
                      transform: `translateY(${at(p, 22, 0)}px)`,
                      padding: 16,
                    }}
                  >
                    {solidify > 0.6 && <SkeletonLines n={3} startF={b(1.75)} dark widths={[80, 60, 44]} />}
                  </div>
                );
              })}
            </div>
          </div>
        </ScaleIn>
      </TiltIdle>
    </Beat>
  );
};

/* ── 8. end card ─────────────────────────────────────────────────────── 85f */

export const S8_End: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <DarkBase grain={0.06}>
      <PushIn from={1.04} to={1} durF={85}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <SpecularSweep startF={b(1.5)} durF={34} style={{ borderRadius: 8, padding: "0 12px" }}>
            <MaskWipeUp
              startF={0}
              durF={22}
              perLineStaggerF={4}
              style={{ textAlign: "center" }}
              lines={[
                <span key="a" style={{ ...TYPE.hero, fontSize: 148, color: C.onDark }}>
                  Product OS
                </span>,
              ]}
            />
          </SpecularSweep>
          <div style={{ marginTop: 26, textAlign: "center" }}>
            <MaskWipeUp
              startF={b(1.5)}
              durF={18}
              lines={[
                <span key="b" style={{ ...TYPE.body, fontSize: 38, color: C.onDarkSoft }}>
                  From a rough idea to a ready prototype.
                </span>,
              ]}
            />
          </div>
          <div style={{ marginTop: 44, opacity: t(frame, b(3), 14, "expoOut") }}>
            <span
              style={{
                ...TYPE.label,
                color: "#fff",
                background: C.accent,
                borderRadius: 999,
                padding: "16px 34px",
                display: "inline-block",
                transform: `translateY(${at(t(frame, b(3), 18, "backOut"), 20, 0)}px)`,
              }}
            >
              live now · ask it anything
            </span>
          </div>
        </AbsoluteFill>
      </PushIn>
    </DarkBase>
  );
};

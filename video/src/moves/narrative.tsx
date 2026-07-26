import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EaseName, at, osc, t, ts } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   NARRATIVE MOVES — the copy-carrying beats.

   These are the top-ranked techniques from pipeline/PATTERNS.md §2, ranked by
   (reusability × payoff) ÷ build cost. Every one is cited to the spec it came
   from. They exist because a text-heavy product video lives or dies on how the
   words arrive, and "fade the sentence in" is not an answer.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * wordCycleSettle — PATTERNS §2 #1. A slot machine that spins through candidate
 * words and lands on one. Sells "decided / personalised" on any single-line
 * value prop, for the cost of an array and a frame index.
 *
 * Distinct from `WordSwap`, which shows each word for equal time as a list.
 * This accelerates then DECELERATES onto the final word — the landing is the
 * point.
 * From A_explainer-zhylar-crm-cpq (3-column word cycle).
 */
export const WordCycle: React.FC<{
  /** candidates cycled through; the LAST one is landed on */
  words: string[];
  startF?: number;
  durF?: number;
  /** how many swaps happen before it settles */
  cycles?: number;
  style?: React.CSSProperties;
}> = ({ words, startF = 0, durF = 34, cycles = 9, style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoOut");
  // expoOut on the INDEX is what produces spin-then-settle: even steps early,
  // stretching steps late, landing exactly on the final word.
  const step = Math.min(cycles, Math.floor(p * cycles));
  const landed = p >= 1;
  const word = landed ? words[words.length - 1] : words[step % words.length];
  // a 1-frame vertical kick on each swap so the change is felt, not just seen
  const kick = landed ? 0 : (step % 2 === 0 ? -3 : 3);
  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        transform: `translateY(${kick}px)`,
        filter: landed ? undefined : "blur(0.6px)",
      }}
    >
      {word}
    </span>
  );
};

/**
 * wordBuildReveal — PATTERNS §2 #15. A word grows its own suffix, so a tagline
 * appears to complete itself. Cheaper than per-character typing and reads as
 * intent rather than as a keyboard.
 * From A_explainer-zhylar-crm-cpq.
 */
export const WordBuild: React.FC<{
  stem: string;
  suffix: string;
  startF?: number;
  durF?: number;
  style?: React.CSSProperties;
}> = ({ stem, suffix, startF = 0, durF = 20, style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, "expoOut");
  const n = Math.round(p * suffix.length);
  return (
    <span style={style}>
      {stem}
      {/* the full suffix reserves its own width (hidden) and the growing copy is
          overlaid on top, so the stem never shifts as letters arrive. An earlier
          version used a negative margin and rendered nothing — verified by
          rendering, not by reading. */}
      <span style={{ position: "relative", display: "inline-block" }}>
        <span style={{ visibility: "hidden" }}>{suffix}</span>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "pre" }}>
          {suffix.slice(0, n)}
        </span>
      </span>
    </span>
  );
};

/**
 * liveCounterTick — PATTERNS §2 #3. A readout that never stops changing, as a
 * pure function of frame. The cheapest possible fix for "this hold reads dead":
 * no keyframes, works under every long hold in every video.
 * From A_micro-elements-animations.
 */
export const LiveCounter: React.FC<{
  /** base value; the readout wanders around it forever */
  base: number;
  amplitude?: number;
  periodF?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** integer steps rather than smooth — reads as telemetry, not as an animation */
  quantise?: number;
  style?: React.CSSProperties;
}> = ({
  base,
  amplitude = 12,
  periodF = 47,
  decimals = 0,
  prefix = "",
  suffix = "",
  quantise = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  // two incommensurate periods so it never visibly repeats
  const v = base + osc(frame, periodF) * amplitude + osc(frame, periodF * 2.37, 1.1) * amplitude * 0.4;
  const q = Math.round(v / quantise) * quantise;
  return (
    <span style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {q.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/**
 * toastConfirmationPop — PATTERNS §2 #12. The universal "it worked" beat. A
 * palette-breaking success colour used exactly once rations trust cheaply.
 * From A_explainer-zhylar-crm-cpq.
 */
export const ToastPop: React.FC<{
  children: React.ReactNode;
  startF?: number;
  /** frame it leaves; omit to stay up */
  exitAtF?: number;
  accent?: string;
  ink?: string;
  style?: React.CSSProperties;
}> = ({ children, startF = 0, exitAtF, accent = "#12B76A", ink = "#fff", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = ts(frame, fps, startF, "snap", 16);
  const outP = exitAtF === undefined ? 0 : t(frame, exitAtF, 9, "expoIn");
  const y = at(inP, 26, 0) + at(outP, 0, -18);
  return (
    <div
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: accent,
        color: ink,
        borderRadius: 999,
        padding: "12px 24px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
        opacity: Math.min(1, inP * 2) * (1 - outP),
        transform: `translateY(${y}px) scale(${at(inP, 0.9, 1)})`,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12.5 L10 17.5 L19 7"
          stroke={ink}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={26}
          strokeDashoffset={at(t(frame, startF + 4, 10, "expoOut"), 26, 0)}
        />
      </svg>
      {children}
    </div>
  );
};

/**
 * dualSpeechChipPairing — PATTERNS §2 #11. Fakes a two-speaker exchange by
 * splitting ONE sentence across two chips that enter from opposite sides, one
 * solid and one outlined. No chat UI required.
 * From A_explainer-ai-chatbot-wip.
 */
export const DualSpeechChips: React.FC<{
  first: string;
  second: string;
  startF?: number;
  gapF?: number;
  solid: string;
  ink: string;
  outlineInk?: string;
  style?: React.CSSProperties;
}> = ({ first, second, startF = 0, gapF = 10, solid, ink, outlineInk, style }) => {
  const frame = useCurrentFrame();
  const a = t(frame, startF, 16, "expoOut");
  const b = t(frame, startF + gapF, 16, "expoOut");
  const chip: React.CSSProperties = {
    borderRadius: 999,
    padding: "14px 30px",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ ...style, display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          ...chip,
          background: solid,
          color: ink,
          alignSelf: "flex-start",
          opacity: Math.min(1, a * 2),
          transform: `translateX(${at(a, -70, 0)}px)`,
        }}
      >
        {first}
      </div>
      <div
        style={{
          ...chip,
          background: "transparent",
          border: `2px solid ${outlineInk ?? solid}`,
          color: outlineInk ?? solid,
          alignSelf: "flex-end",
          opacity: Math.min(1, b * 2),
          transform: `translateX(${at(b, 70, 0)}px)`,
        }}
      >
        {second}
      </div>
    </div>
  );
};

/**
 * stepRelayAdvance — PATTERNS §2 #9. A persistent list where only the ACTIVE
 * index changes: neighbours grey out above and below. A free progress indicator
 * for any pipeline / steps narrative, with zero new geometry per step.
 * From A_shipping-8-launch-videos.
 */
export const StepRelay: React.FC<{
  steps: string[];
  /** frame each step becomes active; length must match steps */
  atF: number[];
  accent: string;
  ink: string;
  inkSoft: string;
  style?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
}> = ({ steps, atF, accent, ink, inkSoft, style, rowStyle }) => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < atF.length; i++) if (frame >= atF[i]) active = i;
  return (
    <div style={{ ...style, display: "flex", flexDirection: "column", gap: 14 }}>
      {steps.map((s, i) => {
        const isActive = i === active;
        const done = i < active;
        const p = t(frame, atF[i] ?? 0, 12, "expoOut");
        return (
          <div
            key={s}
            style={{
              ...rowStyle,
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: isActive ? ink : inkSoft,
              opacity: isActive ? 1 : done ? 0.5 : 0.32,
              transform: `translateX(${isActive ? at(p, 12, 0) : 0}px)`,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                flex: "0 0 12px",
                background: isActive || done ? accent : "currentColor",
                boxShadow: isActive ? `0 0 0 6px ${accent}22` : undefined,
                transform: `scale(${isActive ? at(p, 0.6, 1) : 1})`,
              }}
            />
            {s}
          </div>
        );
      })}
    </div>
  );
};

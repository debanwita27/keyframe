import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EaseName, SpringName, at, exitDur, t, ts } from "./easings";

/* ────────────────────────────────────────────────────────────────────────────
   TEXT MOVES

   Rule this library enforces: text reveals happen PER LINE, through a mask.
   Per-letter animation is reserved for exactly one deliberate moment per video
   (LetterCascade) — everywhere else it reads as amateur.
   ──────────────────────────────────────────────────────────────────────────── */

type Common = {
  /** frame the move starts, relative to the enclosing <Sequence> */
  startF?: number;
  durF?: number;
  ease?: EaseName;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * maskWipeUp — THE premium text reveal.
 * Each line sits in an overflow:hidden box; the line translates y 110% → 0.
 * Lines stagger. Nothing fades — the mask does all the work.
 */
export const MaskWipeUp: React.FC<
  Common & {
    lines: React.ReactNode[];
    perLineStaggerF?: number;
    lineHeight?: number;
    exitAtF?: number;
  }
> = ({
  lines,
  startF = 0,
  durF = 16,
  perLineStaggerF = 3,
  ease = "expoOut",
  lineHeight = 1.08,
  exitAtF,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div className={className} style={style}>
      {lines.map((line, i) => {
        const inP = t(frame, startF + i * perLineStaggerF, durF, ease);
        const outP =
          exitAtF === undefined
            ? 0
            : t(frame, exitAtF + i * Math.max(1, perLineStaggerF - 1), exitDur(durF), "expoIn");
        const y = at(inP, 110, 0) - at(outP, 0, 110);
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              lineHeight,
              // a mask box exactly one line tall clips descenders — pad, then pull back
              paddingBottom: "0.18em",
              marginBottom: "-0.18em",
            }}
          >
            <div style={{ transform: `translateY(${y}%)`, willChange: "transform" }}>{line}</div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * maskWipeSide — clip-path inset sweep. Content never moves; the window does.
 * Reads as "printing". Good for labels, rules, code lines, table rows.
 */
export const MaskWipeSide: React.FC<
  Common & { children: React.ReactNode; dir?: "ltr" | "rtl" | "ttb" | "btt" }
> = ({ children, startF = 0, durF = 18, ease = "expoInOut", dir = "ltr", className, style }) => {
  const frame = useCurrentFrame();
  const cut = at(t(frame, startF, durF, ease), 100, 0);
  const inset =
    dir === "ltr" ? `0 ${cut}% 0 0`
    : dir === "rtl" ? `0 0 0 ${cut}%`
    : dir === "ttb" ? `0 0 ${cut}% 0`
    : `${cut}% 0 0 0`;
  return (
    <div className={className} style={{ ...style, clipPath: `inset(${inset})`, willChange: "clip-path" }}>
      {children}
    </div>
  );
};

/**
 * typeOn — terminal / prompt / chat input.
 * The rate is deliberately jittered and pauses on punctuation: a perfectly even
 * type rate is the tell that it's fake. Deterministic, so renders reproduce.
 */
export const TypeOn: React.FC<
  Common & {
    text: string;
    charsPerF?: number;
    caret?: boolean;
    caretBlinkF?: number;
    jitter?: number;
    punctuationHoldF?: number;
  }
> = ({
  text,
  startF = 0,
  charsPerF = 1.4,
  caret = true,
  caretBlinkF = 15,
  jitter = 0.2,
  punctuationHoldF = 4,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startF;

  const costs = React.useMemo(() => {
    let acc = 0;
    return [...text].map((ch, i) => {
      const wobble = 1 + Math.sin(i * 12.9898) * jitter;
      acc += (1 / charsPerF) * wobble + (",.:;—!?".includes(ch) ? punctuationHoldF : 0);
      return acc;
    });
  }, [text, charsPerF, jitter, punctuationHoldF]);

  const shown = costs.filter((c) => c <= local).length;
  const done = shown >= text.length;
  const caretOn = done ? Math.floor(local / caretBlinkF) % 2 === 0 : true;

  return (
    <span className={className} style={style}>
      {text.slice(0, shown)}
      {caret && local >= 0 && (
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            height: "1em",
            marginLeft: "0.06em",
            verticalAlign: "-0.12em",
            background: "currentColor",
            opacity: caretOn ? 1 : 0,
          }}
        />
      )}
    </span>
  );
};

/** letterCascade — per-character entrance. ONE per video, on the word that matters. */
export const LetterCascade: React.FC<
  Common & {
    text: string;
    perCharStaggerF?: number;
    yFrom?: number;
    rotateFrom?: number;
    springPreset?: SpringName;
  }
> = ({
  text,
  startF = 0,
  perCharStaggerF = 1,
  yFrom = 18,
  rotateFrom = 6,
  springPreset = "snap",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span className={className} style={{ ...style, display: "inline-flex" }}>
      {[...text].map((ch, i) => {
        const p = ts(frame, fps, startF + i * perCharStaggerF, springPreset, 24);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transform: `translateY(${at(p, yFrom, 0)}px) rotate(${at(p, rotateFrom, 0)}deg)`,
              opacity: Math.min(1, p * 1.6),
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** counterUp — metrics. Never linear. Tabular figures stop the layout jittering. */
export const CounterUp: React.FC<
  Common & { to: number; from?: number; decimals?: number; prefix?: string; suffix?: string }
> = ({
  to,
  from = 0,
  startF = 0,
  durF = 30,
  ease = "expoOut",
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const v = at(t(frame, startF, durF, ease), from, to);
  return (
    <span className={className} style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/**
 * wordSwap — one word replaces another in the same slot, rolling upward.
 * The workhorse for "it does X… and Y… and Z" copy without cutting away.
 * This is the single most useful move for a text-heavy product.
 */
export const WordSwap: React.FC<
  Common & { words: string[]; holdF?: number; swapDurF?: number }
> = ({ words, startF = 0, holdF = 28, swapDurF = 10, ease = "expoInOut", className, style }) => {
  const frame = useCurrentFrame();
  const cycle = holdF + swapDurF;
  const local = Math.max(0, frame - startF);
  const idx = Math.min(words.length - 1, Math.floor(local / cycle));
  const inCycle = local - idx * cycle;
  const p = inCycle > holdF ? t(inCycle, holdF, swapDurF, ease) : 0;
  const next = words[Math.min(words.length - 1, idx + 1)];
  const shift = at(p, 0, -100);

  return (
    <span
      className={className}
      style={{ ...style, display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
    >
      <span style={{ display: "block", transform: `translateY(${shift}%)` }}>{words[idx]}</span>
      <span style={{ display: "block", transform: `translateY(${shift}%)` }}>{next}</span>
    </span>
  );
};

/**
 * lineHighlight — an accent bar sweeps behind one line of text, then the text
 * inverts to the bg colour. Cheap, and reads as "this is the point".
 */
export const LineHighlight: React.FC<
  Common & { children: React.ReactNode; accent: string; inkOnAccent: string }
> = ({ children, accent, inkOnAccent, startF = 0, durF = 14, ease = "expoOut", className, style }) => {
  const frame = useCurrentFrame();
  const p = t(frame, startF, durF, ease);
  return (
    <span className={className} style={{ ...style, position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          inset: "-0.08em -0.24em",
          background: accent,
          transform: `scaleX(${p})`,
          transformOrigin: "left center",
        }}
      />
      <span style={{ position: "relative", color: p > 0.55 ? inkOnAccent : "currentColor" }}>
        {children}
      </span>
    </span>
  );
};

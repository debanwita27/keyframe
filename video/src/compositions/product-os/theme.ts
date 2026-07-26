import { loadFont as loadDisplay } from "@remotion/google-fonts/Sora";
import { loadFont as loadUI } from "@remotion/google-fonts/InterTight";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const display = loadDisplay();
const ui = loadUI();
const mono = loadMono();

export const FONT = {
  display: display.fontFamily,
  ui: ui.fontFamily,
  mono: mono.fontFamily,
};

/**
 * Three colours plus one support tint. The accent (#8000FF, Headout brand purple)
 * is rationed — it appears on the title underline, the active lifecycle node, and
 * the end card. Nowhere else.
 */
export const C = {
  dark: "#0B0A0F",
  darkPanel: "#1E1B2B",
  light: "#F7F6F4",
  lightPanel: "#FFFFFF",
  ink: "#1A1918",
  inkSoft: "#6B6873",
  onDark: "#EFEDF2",
  onDarkSoft: "#8B8797",
  accent: "#8000FF",
  accentSoft: "#B57CFF",
  support: "#FFBC00",
  line: "#E4E1DC",
  lineDark: "#2A2734",
};

/** Layout constants — a shared margin is what makes shots feel like one film. */
export const L = {
  margin: 128,
  radius: 20,
  radiusSm: 12,
  shadow: "0 18px 48px rgba(10,8,16,0.18)",
  shadowDark: "0 18px 48px rgba(0,0,0,0.45)",
};

export const TYPE = {
  hero: {
    fontFamily: FONT.display,
    fontWeight: 700,
    fontSize: 150,
    letterSpacing: "-0.035em",
    lineHeight: 1.02,
  },
  h1: {
    fontFamily: FONT.display,
    fontWeight: 600,
    fontSize: 100,
    letterSpacing: "-0.03em",
    lineHeight: 1.06,
  },
  h2: {
    fontFamily: FONT.display,
    fontWeight: 600,
    fontSize: 66,
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
  },
  body: {
    fontFamily: FONT.ui,
    fontWeight: 450,
    fontSize: 38,
    letterSpacing: "-0.01em",
    lineHeight: 1.35,
  },
  label: {
    fontFamily: FONT.ui,
    fontWeight: 600,
    fontSize: 22,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
  },
  mono: {
    fontFamily: FONT.mono,
    fontWeight: 400,
    fontSize: 46,
    letterSpacing: "-0.02em",
  },
} as const;

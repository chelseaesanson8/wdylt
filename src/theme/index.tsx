/**
 * The theme: Paper (light) and Ink (dark), following the phone's setting.
 *
 * How it works, in short:
 *   1. <ThemeProvider> sits at the root of the app (src/app/_layout.tsx).
 *   2. It picks a palette from tokens.js: Paper, or Ink when the phone is in
 *      dark mode (or when you force one with setMode).
 *   3. It hands those colours to NativeWind as CSS variables, so classes like
 *      `bg-paper` and `text-ink` change by themselves.
 *   4. For things that need a real colour value (SVG fills, the book stack),
 *      call `useTheme()` and read `colors.verm`, `colors.ink` and so on.
 *
 * It also listens to three accessibility settings on the phone and hands
 * them out as `a11y` from useTheme():
 *   - Reduce Motion: things fade instead of sliding or springing.
 *   - Increase Contrast: the soft greys and hairlines turn full ink.
 *   - Reduce Transparency: nothing is see-through yet, but anything that
 *     becomes see-through later (like a floating tab bar) should read this
 *     and go solid.
 */
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, Platform, useColorScheme, View } from "react-native";
import { vars } from "nativewind";

import tokens from "./tokens";

/** One step of the type scale (see tokens.js). */
export type TypeStyle = {
  font: keyof typeof tokens.fonts;
  size: number;
  lineHeight: number;
  /** Letter spacing in points. Negative pulls letters together. */
  tracking?: number;
  /** Show in capitals. */
  upper?: boolean;
  /** Largest the phone's text-size setting may make it, as a multiple. */
  maxScale?: number;
};

export const palettes = tokens.palettes;
export const fonts = tokens.fonts;
export const type = tokens.type as Record<keyof typeof tokens.type, TypeStyle>;
export const space = tokens.space;
export const motion = tokens.motion;

export type ThemeName = keyof typeof palettes; // "paper" | "ink"
export type Palette = (typeof palettes)["paper"];
export type ColorName = keyof Palette;
export type FontName = keyof typeof fonts;
export type TypeVariant = keyof typeof type;
export type SpaceStep = keyof typeof space;

/** "system" follows the phone's light/dark setting. */
export type ThemeMode = "system" | ThemeName;

/** The phone's accessibility settings that change how the theme behaves. */
export type A11y = {
  reduceMotion: boolean;
  increaseContrast: boolean;
  reduceTransparency: boolean;
};

type ThemeValue = {
  /** Which palette is showing right now. */
  name: ThemeName;
  /** The colours of that palette, as hex (or rgba) strings. */
  colors: Palette;
  /** What was asked for: "system", "paper" or "ink". */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  a11y: A11y;
};

const ThemeContext = createContext<ThemeValue | null>(null);

/** Read the current theme from any component inside <ThemeProvider>. */
export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme() must be used inside <ThemeProvider>.");
  return value;
}

export function ThemeProvider({ children, initialMode = "system" }: { children: ReactNode; initialMode?: ThemeMode }) {
  const phoneScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const a11y = useAccessibilitySettings();

  const name: ThemeName = mode === "system" ? (phoneScheme === "dark" ? "ink" : "paper") : mode;
  const colors = useMemo(() => (a11y.increaseContrast ? highContrast(palettes[name]) : palettes[name]), [name, a11y.increaseContrast]);

  return (
    <ThemeContext.Provider value={{ name, colors, mode, setMode, a11y }}>
      <View style={[{ flex: 1, backgroundColor: colors.paper }, vars(cssVariables(colors))]}>
        <StatusBar style={name === "ink" ? "light" : "dark"} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

/**
 * Increase Contrast: same look, but the quiet colours go full strength, the
 * same swap the landing page makes. Soft greys become ink, hairlines become
 * ink, and the soft off-white on black becomes the full off-white.
 */
function highContrast(p: Palette): Palette {
  // The grid stays an rgba value (that's how its CSS variable is used), just much stronger.
  const grid = `rgba(${hexToChannels(p.verm).split(" ").join(", ")}, 0.8)`;
  return { ...p, muted: p.ink, rule: p.ink, onBlockSoft: p.onBlock, grid };
}

/** Reads Reduce Motion, Increase Contrast and Reduce Transparency, and keeps them up to date. */
function useAccessibilitySettings(): A11y {
  const [a11y, setA11y] = useState<A11y>({ reduceMotion: false, increaseContrast: false, reduceTransparency: false });

  useEffect(() => {
    const set = (key: keyof A11y) => (on: boolean) => setA11y((prev) => (prev[key] === on ? prev : { ...prev, [key]: on }));
    // iPhone calls it "Increase Contrast" (darker system colours); Android calls it "High contrast text".
    const contrast =
      Platform.OS === "ios"
        ? { check: AccessibilityInfo.isDarkerSystemColorsEnabled, event: "darkerSystemColorsChanged" as const }
        : { check: AccessibilityInfo.isHighTextContrastEnabled, event: "highTextContrastChanged" as const };

    const checks: [() => Promise<boolean>, keyof A11y][] = [
      [AccessibilityInfo.isReduceMotionEnabled, "reduceMotion"],
      [AccessibilityInfo.isReduceTransparencyEnabled, "reduceTransparency"],
      [contrast.check, "increaseContrast"],
    ];
    for (const [check, key] of checks)
      check()
        .then(set(key))
        .catch(() => {});

    const subs = [
      AccessibilityInfo.addEventListener("reduceMotionChanged", set("reduceMotion")),
      AccessibilityInfo.addEventListener("reduceTransparencyChanged", set("reduceTransparency")),
      AccessibilityInfo.addEventListener(contrast.event, set("increaseContrast")),
    ];
    return () => subs.forEach((s) => s.remove());
  }, []);

  return a11y;
}

/** Turns { paperDeep: "#E6DBC2" } into { "--color-paper-deep": "230 219 194" } for NativeWind. */
function cssVariables(colors: Palette) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const name = `--color-${key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}`;
    out[name] = value.startsWith("#") ? hexToChannels(value) : value;
  }
  return out;
}

function hexToChannels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

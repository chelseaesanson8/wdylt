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
 */
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { vars } from "nativewind";

import tokens from "./tokens";

/** One step of the type scale (see tokens.js). */
export type TypeStyle = {
  font: keyof typeof tokens.fonts;
  size: number;
  lineHeight: number;
  /** Letter spacing in points. */
  tracking?: number;
  /** Show in capitals. */
  upper?: boolean;
};

export const palettes = tokens.palettes;
export const fonts = tokens.fonts;
export const type = tokens.type as Record<keyof typeof tokens.type, TypeStyle>;

export type ThemeName = keyof typeof palettes; // "paper" | "ink"
export type Palette = (typeof palettes)["paper"];
export type ColorName = keyof Palette;
export type FontName = keyof typeof fonts;
export type TypeVariant = keyof typeof type;

/** "system" follows the phone's light/dark setting. */
export type ThemeMode = "system" | ThemeName;

type ThemeValue = {
  /** Which palette is showing right now. */
  name: ThemeName;
  /** The colours of that palette, as hex (or rgba) strings. */
  colors: Palette;
  /** What was asked for: "system", "paper" or "ink". */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

/** Read the current theme from any component inside <ThemeProvider>. */
export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme() must be used inside <ThemeProvider>.");
  return value;
}

export function ThemeProvider({
  children,
  initialMode = "system",
}: {
  children: ReactNode;
  initialMode?: ThemeMode;
}) {
  const phoneScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const name: ThemeName = mode === "system" ? (phoneScheme === "dark" ? "ink" : "paper") : mode;
  const colors = palettes[name];

  return (
    <ThemeContext.Provider value={{ name, colors, mode, setMode }}>
      <View style={[{ flex: 1, backgroundColor: colors.paper }, vars(cssVariables(colors))]}>
        <StatusBar style={name === "ink" ? "light" : "dark"} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
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

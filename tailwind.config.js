/**
 * NativeWind / Tailwind setup for WDYLT.
 *
 * Colours point at CSS variables (like var(--color-paper)) instead of fixed
 * hex codes. <ThemeProvider> fills those variables in with the Paper or Ink
 * palette, so `bg-paper` or `text-ink` switch by themselves in dark mode.
 *
 * The actual values live in src/theme/tokens.js, including the spacing
 * scale (s1 to s7), so classes like `gap-s2` match the landing page's steps.
 */
const { palettes, fonts, type, space } = require("./src/theme/tokens");

// "paperDeep" -> "paper-deep", so classes read like `bg-paper-deep`.
const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

const colors = {};
for (const key of Object.keys(palettes.paper)) {
  // Solid colours are stored as "R G B" so opacity works (`bg-ink/50`).
  // The grid colour is already see-through, so it is used as is.
  colors[kebab(key)] =
    key === "grid"
      ? `var(--color-${kebab(key)})`
      : `rgb(var(--color-${kebab(key)}) / <alpha-value>)`;
}

const fontFamily = {};
for (const [key, name] of Object.entries(fonts)) {
  fontFamily[kebab(key)] = [name];
}

const fontSize = {};
for (const [key, t] of Object.entries(type)) {
  fontSize[key] = [
    `${t.size}px`,
    { lineHeight: `${t.lineHeight}px`, letterSpacing: t.tracking ? `${t.tracking}px` : undefined },
  ];
}

// The spacing scale: `gap-s2`, `px-s3`, `mt-hair` and so on.
const spacing = {};
for (const [key, value] of Object.entries(space)) {
  spacing[key] = `${value}px`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: { colors, fontFamily, fontSize, spacing },
  },
  plugins: [],
};

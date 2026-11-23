/**
 * Vermilion Block design tokens: the one place to change WDYLT's colours,
 * fonts and text sizes.
 *
 * This is a plain JavaScript file (not TypeScript) on purpose, because
 * tailwind.config.js has to read it too. The app's TypeScript code imports it
 * through src/theme/index.ts, which adds the types.
 *
 * Colours come from the Vermilion Block landing page, so the app and the site
 * match. There are two palettes:
 *   - paper: the light look (cream paper, black blocks, red)
 *   - ink:   the dark look (near-black paper, warm grey blocks, a brighter red)
 * Every palette must have the same keys.
 */

const palettes = {
  paper: {
    paper: "#EFE6D1", // page background
    paperDeep: "#E6DBC2", // a slightly darker band of paper
    card: "#F6F0E0", // raised cards, like an old page
    block: "#1F1D1B", // the big black blocks (headers, buttons)
    onBlock: "#F2EAD6", // text on a block
    onBlockSoft: "#CFC4AC", // quieter text on a block
    ink: "#1F1D1B", // main text on paper
    muted: "#5F574A", // quieter text on paper
    rule: "#CDBF9F", // hairlines, card edges, perforations
    grid: "rgba(213, 70, 42, 0.38)", // squared-paper lines (see-through red)
    verm: "#D5462A", // vermilion: the red bar, stamps, today's book
    vermText: "#B53A20", // vermilion for small text (easier to read)
    field: "#F6F0E0", // text inputs
    bookA: "#1F1D1B", // book colours in the streak stack
    bookB: "#F2EAD6",
    bookC: "#8C7F69",
    bookEdge: "#1F1D1B", // outline on light books
  },
  ink: {
    paper: "#171614",
    paperDeep: "#1E1C1A",
    card: "#211F1C",
    block: "#2A2724",
    onBlock: "#F2EAD6",
    onBlockSoft: "#BDB29B",
    ink: "#EDE5D1",
    muted: "#ADA391",
    rule: "#3A3631",
    grid: "rgba(224, 90, 60, 0.32)",
    verm: "#E05A3C",
    vermText: "#F07A5C",
    field: "#211F1C",
    bookA: "#F2EAD6",
    bookB: "#3A3631",
    bookC: "#8C7F69",
    bookEdge: "#F2EAD6",
  },
};

/**
 * Font names. Each weight is its own font file (that's how React Native
 * works), so "bold" is a different family name, not a fontWeight.
 * The files live in assets/fonts and are loaded in src/app/_layout.tsx.
 */
const fonts = {
  gothic: "ZenKakuGothicNew-Medium", // body text (500)
  gothicBold: "ZenKakuGothicNew-Bold", // labels and buttons (700)
  gothicBlack: "ZenKakuGothicNew-Black", // headlines (900)
  number: "DelaGothicOne-Regular", // big chunky numbers: day count, dates
};

/**
 * The type scale. Sizes are in points, the same units as the mockups
 * (which were drawn on a 390-wide iPhone screen).
 * `upper: true` means the text is shown in capitals.
 */
const type = {
  count: { font: "number", size: 104, lineHeight: 116 }, // "47" in the header
  number: { font: "number", size: 32, lineHeight: 40 }, // "PAGE 47", "23 OCT"
  display: { font: "gothicBlack", size: 34, lineHeight: 42 }, // "Welcome back."
  title: { font: "gothicBlack", size: 28, lineHeight: 36 }, // "What did you learn today?"
  heading: { font: "gothicBlack", size: 20, lineHeight: 28 }, // "books high"
  body: { font: "gothic", size: 16, lineHeight: 24 }, // entries, paragraphs
  small: { font: "gothic", size: 13, lineHeight: 20 }, // hints, captions
  label: { font: "gothicBold", size: 11, lineHeight: 16, tracking: 1.8, upper: true }, // "YESTERDAY · 22 NOV"
  button: { font: "gothicBold", size: 14, lineHeight: 20, tracking: 2.2, upper: true }, // "STAMP THE DAY"
};

module.exports = { palettes, fonts, type };

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
 * (which were drawn on a 390-wide iPhone screen). It matches the landing
 * page (version 2), following the Apple design guide:
 *   - Tracking (letter spacing) changes with size: big text is pulled
 *     tighter, small capitals are opened up a little, body text stays at 0.
 *     Values are in points, worked out from the landing page's em values.
 *   - Leading (line height) falls as size grows: tight on headlines,
 *     roomy on body text.
 *   - `maxScale` caps how far the phone's text-size setting can grow that
 *     step, so a huge "47" can't break the screen. Body text has no cap.
 * `upper: true` means the text is shown in capitals.
 */
const type = {
  count: { font: "number", size: 104, lineHeight: 108, tracking: -2, maxScale: 1.3 }, // "47" in the header (-0.02em)
  number: { font: "number", size: 32, lineHeight: 36, tracking: -0.6, maxScale: 1.5 }, // "PAGE 47", "23 OCT" (-0.02em)
  display: { font: "gothicBlack", size: 34, lineHeight: 38, tracking: -1, maxScale: 1.6 }, // "Welcome back." (-0.03em)
  title: { font: "gothicBlack", size: 28, lineHeight: 32, tracking: -0.6, maxScale: 1.8 }, // "What did you learn today?" (-0.02em)
  heading: { font: "gothicBlack", size: 20, lineHeight: 26, tracking: -0.2 }, // "books high" (-0.01em)
  body: { font: "gothic", size: 16, lineHeight: 26 }, // entries, paragraphs (1.6)
  small: { font: "gothic", size: 13, lineHeight: 19, tracking: 0.1 }, // hints, captions (1.45)
  label: { font: "gothicBold", size: 11, lineHeight: 15, tracking: 1.3, upper: true }, // "YESTERDAY · 22 NOV" (0.12em)
  button: { font: "gothicBold", size: 14, lineHeight: 18, tracking: 1.7, upper: true }, // "STAMP THE DAY" (0.12em)
};

/**
 * One spacing scale, the same 8-point steps as the landing page.
 * Use these for padding, margins and gaps, so nothing on screen is a random
 * number. In classes they're `s1` to `s7` (like `gap-s2` or `px-s3`), plus
 * `hair` for the 4-point nudge between a label and its line.
 */
const space = {
  hair: 4,
  s1: 8,
  s2: 16,
  s3: 24,
  s4: 32,
  s5: 48,
  s6: 64,
  s7: 96,
};

/**
 * Motion, in Apple's two numbers:
 *   damping: 1 = settles with no bounce, under 1 = overshoots a little.
 *   response: roughly how many seconds it takes to get there. Not a fixed
 *   duration, because a spring can be grabbed and sent somewhere else halfway.
 * Use `settle` for almost everything. `flick` is only for something the
 * person threw, like a card swiped away, because only then does a bounce feel
 * earned. `press` is how fast a button sinks when touched.
 * src/theme/motion.ts turns these into Reanimated springs.
 */
const motion = {
  settle: { damping: 1, response: 0.4 },
  flick: { damping: 0.8, response: 0.4 },
  press: { scale: 0.97, ms: 100 },
  /** With Reduce Motion on, things fade instead of moving, over this many ms. */
  fadeMs: 200,
};

module.exports = { palettes, fonts, type, space, motion };

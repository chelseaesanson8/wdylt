// The Signature wordmark: "wdylt." in Newsreader italic with an amber full
// stop. The SVGs live in public/brand/; replace one under the same name to
// update every use. Both editions are in the page and CSS shows the one that
// matches the current theme (see .wordmark--ink and .wordmark--paper).
const SOURCES = {
  ink: "/brand/wdylt-wordmark-dark.svg", // cream letters, for the dark page
  paper: "/brand/wdylt-wordmark-paper.svg", // ink letters, for the light page
} as const;
// Intrinsic size from the SVG's viewBox (375.6 x 158.3).
const RATIO = 375.6 / 158.3;

const heights = { md: 40, lg: 72 } as const;

export function Wordmark({ size = "md" }: { size?: keyof typeof heights }) {
  const height = heights[size];
  const width = Math.round(height * RATIO);
  return (
    <>
      {(Object.keys(SOURCES) as (keyof typeof SOURCES)[]).map((edition) => (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed
        <img
          key={edition}
          className={`wordmark wordmark--${size} wordmark--${edition}`}
          src={SOURCES[edition]}
          alt="What Did You Learn Today"
          width={width}
          height={height}
        />
      ))}
    </>
  );
}

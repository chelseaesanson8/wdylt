// The Signature wordmark: "wdylt." in Bodoni Moda italic with an amber full
// stop. The SVG lives in public/brand/; replace it under the same name to
// update every use.
const WORDMARK_SRC = "/brand/wdylt-wordmark-dark.svg";
// Intrinsic size from the SVG's viewBox (394.5 x 163.5).
const RATIO = 394.5 / 163.5;

const heights = { md: 40, lg: 72 } as const;

export function Wordmark({ size = "md" }: { size?: keyof typeof heights }) {
  const height = heights[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed
    <img
      className={`wordmark wordmark--${size}`}
      src={WORDMARK_SRC}
      alt="What Did You Learn Today"
      width={Math.round(height * RATIO)}
      height={height}
    />
  );
}

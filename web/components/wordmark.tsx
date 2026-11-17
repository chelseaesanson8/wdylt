// The Signature wordmark: "wdylt." in Bodoni italic with an amber full stop.
// The SVG lives in public/brand/. A refined logo can replace that file under
// the same name, and every use here updates.
const WORDMARK_SRC = "/brand/wdylt-2-signature-wordmark-dark.svg";
// Intrinsic size from the SVG's viewBox (387 x 163.5).
const RATIO = 387 / 163.5;

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

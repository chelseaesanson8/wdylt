// Placeholder wordmark until the logo is ready. Swap the contents of this
// component (for example for an <svg> or next/image) and every use updates.
export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span
      className={`wordmark wordmark--${size}`}
      role="img"
      aria-label="What Did You Learn Today"
    >
      WDYLT<span className="wordmark__dot" aria-hidden="true">.</span>
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

// A sample streak, drawn like the page edges in the Marginalia design: one
// bar per day, the newest pages in amber, and an empty slot for tomorrow.
// When it scrolls into view the bars fill in left to right and the count
// climbs to its total. With reduced motion, or without JavaScript, it simply
// shows the finished picture.

// Bar heights from the design's "pages, unbroken" strip (one per day).
const HEIGHTS = [7, 11, 6, 14, 9, 12, 8, 15, 10, 7, 13, 9, 16, 8, 11, 7, 12, 10, 14, 9, 6, 13, 8, 11, 15, 9, 12, 7, 10, 14, 8, 12, 9, 16];
const TOTAL = 47;
const RECENT = 3; // the newest pages show in amber
const STEP_MS = 45; // delay between bars
const COUNT_MS = HEIGHTS.length * STEP_MS + 300;

type State = "static" | "armed" | "play";

export function StreakDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("static");
  const [count, setCount] = useState(TOTAL);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    setState("armed");
    setCount(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setState("play");
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          setCount(Math.round(TOTAL * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="streak-demo"
      data-state={state}
      role="img"
      aria-label={`A sample streak: ${TOTAL} pages written on ${TOTAL} days in a row, with tomorrow's page still empty.`}
    >
      <p className="streak-demo__count" aria-hidden="true">
        <span className="streak-demo__number">{count}</span>
        <span className="mono dim">pages, unbroken</span>
      </p>
      <div className="streak-demo__bars" aria-hidden="true">
        {HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`streak-demo__bar${i >= HEIGHTS.length - RECENT ? " streak-demo__bar--recent" : ""}${
              i % 7 === 3 ? " streak-demo__bar--week" : ""
            }`}
            style={{ "--h": h, "--i": i } as React.CSSProperties}
          />
        ))}
        <span className="streak-demo__bar streak-demo__bar--next" style={{ "--h": 16, "--i": HEIGHTS.length } as React.CSSProperties} />
      </div>
      <p className="streak-demo__axis mono dim" aria-hidden="true">
        <span>day {TOTAL - HEIGHTS.length + 1}</span>
        <span>today</span>
        <span>tomorrow</span>
      </p>
    </div>
  );
}

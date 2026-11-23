"use client";

import { useEffect, useRef, useState } from "react";

// A sample streak drawn as a stack of books: one per page written, today's
// on top in red, and an empty one waiting for tomorrow. When it scrolls into
// view the books drop in from the bottom and the count climbs to its total.
// With reduced motion, or without JavaScript, it shows the finished stack.

const TOTAL = 47;
const STEP_MS = 40; // delay between books
const COUNT_MS = TOTAL * STEP_MS + 360;

type Kind = "a" | "b" | "c";
type Book = {
  kind: Kind;
  w: number;
  h: number;
  x: number;
  band: number;
  bandColour?: string;
};

// Seeded, so the stack looks the same on every visit and on the server.
function makeBooks(): Book[] {
  let seed = 21;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const kinds: Kind[] = ["a", "a", "a", "a", "b", "b", "b", "c"];
  const books: Book[] = [];
  let last: Kind | "" = "";
  for (let i = 0; i <= TOTAL; i++) {
    let kind = kinds[Math.floor(rnd() * kinds.length)];
    if (kind === last) kind = kinds[(kinds.indexOf(kind) + 4) % kinds.length];
    last = kind;
    const w = 66 + rnd() * 30;
    const h = 9 + rnd() * 3.5;
    const x = (rnd() - 0.5) * 6;
    const band = [8, 14, 80, 86][Math.floor(rnd() * 4)];
    const banded = rnd() < 0.5 && i < TOTAL - 1;
    books.push({
      kind,
      w,
      h,
      x,
      band,
      bandColour: banded ? (kind === "a" ? "var(--verm)" : "var(--book-a)") : undefined,
    });
  }
  return books;
}

const BOOKS = makeBooks();

type State = "static" | "armed" | "play";

export function StackDemo() {
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
          setCount(Math.round(TOTAL * t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
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
      className="stack-demo"
      data-state={state}
      role="img"
      aria-label={`A sample streak: ${TOTAL} books stacked, one for each page written on ${TOTAL} days in a row, with tomorrow's book still empty.`}
    >
      <div className="stack-demo__books" aria-hidden="true">
        {BOOKS.map((book, i) => {
          const today = i === TOTAL - 1;
          const next = i === TOTAL;
          const className = next
            ? "book book--next"
            : today
              ? "book book--today"
              : `book${book.kind === "b" ? " book--edge" : ""}`;
          const style = {
            "--w": `${book.w.toFixed(1)}%`,
            "--h": `${book.h.toFixed(1)}px`,
            "--x": `${book.x.toFixed(1)}%`,
            "--i": i,
            "--c": `var(--book-${book.kind})`,
            "--band": `${book.band}%`,
            ...(book.bandColour ? { "--bc": book.bandColour } : {}),
          } as React.CSSProperties;
          return <span key={i} className={className} style={style} />;
        })}
      </div>
      <div className="stack-demo__count" aria-hidden="true">
        <span className="stack-demo__number">{count}</span>
        <span className="stack-demo__unit">books high</span>
        <span className="stack-demo__note">One per page. Today&rsquo;s is on top, in red.</span>
      </div>
    </div>
  );
}

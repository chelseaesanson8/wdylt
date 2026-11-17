"use client";

import { useEffect, useState } from "react";

// The headline types itself out like a fresh journal entry, then a line
// underneath types and erases a few sample learnings in a slow loop.
// Screen readers get the plain headline; the animated text is hidden from
// them. With reduced motion, everything shows at once and nothing moves.

const QUESTION = "What did you\nlearn today?";

const SAMPLES = [
  "Postgres won't use your index if the query wraps the column in a function.",
  "Recursion wasn't the problem, unbounded depth was. An explicit stack fixed it.",
  "git bisect found the commit that broke the build in seven steps.",
  "One line of text-wrap: balance evens out a ragged headline.",
  "Sourdough rises faster in an oven with only the light switched on.",
];

type Phase = "idle" | "question" | "loop" | "static";

function Caret() {
  return <span className="caret" aria-hidden="true" />;
}

export function TypedHero({ id }: { id: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(QUESTION.length);
  const [sample, setSample] = useState(SAMPLES[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("static");
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    (async () => {
      setTyped(0);
      setSample("");
      setPhase("question");
      await wait(400);
      for (let i = 1; i <= QUESTION.length; i++) {
        if (cancelled) return;
        setTyped(i);
        await wait(/[\s?]/.test(QUESTION[i - 1]) ? 140 : 75);
      }
      await wait(1200);
      if (cancelled) return;
      setPhase("loop");
      await wait(500);

      for (let n = 0; !cancelled; n++) {
        const text = SAMPLES[n % SAMPLES.length];
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return;
          setSample(text.slice(0, i));
          await wait(36);
        }
        await wait(2800);
        for (let i = text.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setSample(text.slice(0, i));
          await wait(14);
        }
        await wait(500);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);


  return (
    <div className="typed" data-phase={phase}>
      <h1 id={id} className="hero__title">
        <span className="sr-only">What did you learn today?</span>
        {/* The full question always takes up its space, so nothing reflows
            while it types: untyped letters are drawn invisibly. */}
        <span className="typed__question" aria-hidden="true">
          <span className="typed__shown">{QUESTION.slice(0, typed)}</span>
          {phase === "question" && <Caret />}
          <span className="typed__ghost">{QUESTION.slice(typed)}</span>
        </span>
      </h1>
      <p className="til" aria-hidden="true">
        <span className="til__label mono">today i learned</span>
        <span className="til__text">
          {sample}
          {phase === "loop" && <Caret />}
        </span>
      </p>
    </div>
  );
}

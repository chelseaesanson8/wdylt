"use client";

import { useEffect, useRef } from "react";

// Marks the masthead once the page has scrolled under it, so its soft
// bottom edge (a short fade, not a hard divider) only shows when content
// is actually passing beneath the bar. Renders nothing visible.
export function MastheadEdge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = ref.current?.parentElement;
    if (!bar) return;
    const update = () => bar.setAttribute("data-scrolled", window.scrollY > 4 ? "true" : "false");
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <span ref={ref} hidden />;
}

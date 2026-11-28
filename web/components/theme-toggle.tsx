"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// Switches between the Paper (light) and Ink (dark) editions. Until someone
// presses it the page follows their system setting; their choice is then
// remembered in localStorage. The script in app/layout.tsx applies a stored
// choice before the first paint, so the page never flashes the wrong theme.

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // Unknown on the server; read once mounted.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(currentTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";
    const apply = () => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage can be blocked; the choice still holds for this visit.
      }
      setTheme(next);
    };
    // Cross-fade the whole page where the browser supports view transitions,
    // so the switch between Paper and Ink is never an abrupt brightness jump.
    if (typeof document.startViewTransition === "function") document.startViewTransition(apply);
    else apply();
  }

  // The button names the edition it switches to.
  const nextName = theme === "dark" ? "Paper" : "Ink";
  const label =
    theme === null ? "Switch between light and dark mode" : theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" className="theme-toggle pressable" onClick={toggle} aria-label={label}>
      <i aria-hidden="true" />
      <span className="theme-toggle__text" aria-hidden="true" suppressHydrationWarning>
        {theme === null ? "Ink" : nextName}
      </span>
    </button>
  );
}

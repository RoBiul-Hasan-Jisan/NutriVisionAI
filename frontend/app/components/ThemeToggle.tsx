"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Light / dark mode switch. */

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('foodgenome-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    }
  } catch (e) {}
})();
`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("foodgenome-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    // No explicit choice: mirror the system, and keep mirroring it.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("foodgenome-theme")) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("foodgenome-theme", next);
  }

  // Render nothing until the client knows which state to show.
  if (theme === null) {
    return <div className="w-9 h-9 shrink-0" aria-hidden="true" />;
  }

  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      title={`Switch to ${dark ? "light" : "dark"} theme`}
      onClick={() => choose(dark ? "light" : "dark")}
      className="ink-edge grid place-items-center w-9 h-9 shrink-0"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            fill="none"
            stroke="var(--text)"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="var(--text)" strokeWidth="1.7" />
          <g stroke="var(--text)" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.55 1.55M7.15 16.85 5.6 18.4M18.4 18.4l-1.55-1.55M7.15 7.15 5.6 5.6" />
          </g>
        </svg>
      )}
    </button>
  );
}

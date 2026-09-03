"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** A slim progress bar across the top of the viewport during navigation. */

// Long enough that a prerendered route never flashes it, short enough that a slow one
// does not feel unacknowledged.
const THRESHOLD = 220;
// The bar holds briefly after arrival so it reads as a completed transition rather
// than a flicker, but never long enough to be the reason you waited.
const MIN_VISIBLE = 260;

export function RouteTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const shownAt = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  // Arm on any click that will navigate somewhere else.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank") return;
      // External links leave the app; the browser shows its own progress.
      if (/^[a-z]+:/i.test(href) && !href.startsWith(window.location.origin)) return;

      const to = new URL(href, window.location.href);
      if (to.origin !== window.location.origin) return;
      if (to.pathname === window.location.pathname) return;

      pending.current = setTimeout(() => {
        shownAt.current = Date.now();
        setActive(true);
      }, THRESHOLD);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (pending.current) clearTimeout(pending.current);
    };
  }, []);

  // Arrival.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pending.current) {
      clearTimeout(pending.current);
      pending.current = null;
    }
    if (!active) return;

    const elapsed = Date.now() - shownAt.current;
    const t = setTimeout(() => setActive(false), Math.max(0, MIN_VISIBLE - elapsed));
    return () => clearTimeout(t);
    // `active` is deliberately not a dependency: this must run on navigation, not when
    // the bar's own state settles.
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] overflow-hidden pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading the next page</span>
      <div
        className="h-full w-1/3 animate-[route-bar_0.9s_ease-in-out_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
        }}
      />
      <style>{`
        @keyframes route-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

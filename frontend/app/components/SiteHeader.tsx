"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { SearchItem } from "@/lib/search";

import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/analyze", label: "Analyse" },
  { href: "/dishes", label: "Dishes" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/data", label: "Data" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/methods", label: "Method" },
];

export function SiteHeader({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--page)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--page)]/75">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight shrink-0 py-1.5">
          <span
            className="w-7 h-7 rounded-lg grid place-items-center text-sm font-bold shrink-0"
            style={{ background: "var(--primary)", color: "var(--color-newsprint)" }}
            aria-hidden="true"
          >
            F
          </span>
          FoodGenome<span style={{ color: "var(--primary)" }}>AI</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              style={
                isActive(item.href)
                  ? { background: "var(--primary-tint)", color: "var(--primary)" }
                  : { color: "var(--text-dim)" }
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette index={searchIndex} />
          <ThemeToggle />
          <Link
            href="/analyze"
            className="hidden sm:inline-block ink-edge px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--primary)", color: "var(--color-newsprint)" }}
          >
            Analyse a photo
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden ink-edge px-3 py-2 text-sm font-medium"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-[var(--line)] px-5 py-2 flex flex-col"
          aria-label="Main"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium"
              style={isActive(item.href) ? { color: "var(--primary)" } : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/analyze"
            onClick={() => setOpen(false)}
            className="mt-2 mb-3 text-center ink-edge px-4 py-3 font-display font-semibold"
            style={{ background: "var(--primary)", color: "var(--color-newsprint)" }}
          >
            Analyse a photo
          </Link>
        </nav>
      )}
    </header>
  );
}

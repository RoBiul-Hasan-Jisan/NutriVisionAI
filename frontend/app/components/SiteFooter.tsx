import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/analyze", label: "Analyse a photo" },
      { href: "/dishes", label: "Browse 101 dishes" },
    ],
  },
  {
    heading: "Evidence",
    links: [
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/methods", label: "How it decides" },
      { href: "/methods#limits", label: "Known limits" },
    ],
  },
  {
    heading: "Operations",
    links: [
      { href: "/admin", label: "Admin console" },
      { href: "/admin/models", label: "Model registry" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] mt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display font-semibold text-lg">
            <span
              className="w-6 h-6 rounded-md grid place-items-center text-xs font-bold shrink-0"
              style={{ background: "var(--primary)", color: "var(--color-newsprint)" }}
              aria-hidden="true"
            >
              F
            </span>
            FoodGenome<span style={{ color: "var(--primary)" }}>AI</span>
          </p>
          <p className="mt-2 text-sm text-[var(--text-dim)] max-w-xs">
            Food-101 classification with calibrated confidence, conformal guarantees and
            nutrition traced to the USDA record it came from.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="text-sm font-semibold">{col.heading}</p>
            <ul className="mt-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block py-1.5 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-4 flex flex-wrap gap-x-6 gap-y-1 justify-between text-xs text-[var(--text-dim)]">
          <span>USDA FoodData Central, SR Legacy (April 2018 release)</span>
          <span>
            Nutrition figures are reference values, not dietary advice. Portions vary.
          </span>
        </div>
      </div>
    </footer>
  );
}

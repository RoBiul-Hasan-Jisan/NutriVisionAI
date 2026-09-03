import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "../components/AdminNav";

export const metadata: Metadata = {
  title: "Admin console — FoodGenome AI",
  robots: { index: false, follow: false },
};

/** The operator surface. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full">
      <div className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-semibold text-lg">Admin console</span>
            <span
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "var(--primary-tint)", color: "var(--primary)" }}
            >
              live metrics
            </span>
          </div>
          <Link href="/" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text)]">
            ← Public site
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 grid gap-6 lg:grid-cols-[13rem_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

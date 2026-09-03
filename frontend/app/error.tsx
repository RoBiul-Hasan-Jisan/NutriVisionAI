"use client";

import Link from "next/link";
import { useEffect } from "react";

/** The error boundary. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[foodgenome] unhandled error:", error);
  }, [error]);

  return (
    <main className="flex-1 w-full grid place-items-center px-5 py-20">
      <div className="max-w-xl w-full text-center">
        <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-red)]">
          Something went wrong
        </p>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl mt-4 leading-tight">
          This page hit a snag
        </h1>

        <p className="mt-4 text-[var(--text-dim)]">
          Something on this page failed while rendering. It is not something you did, and
          nothing you uploaded was stored.
        </p>

        {error.digest && (
          <p className="figures text-xs text-[var(--text-dim)] mt-4">
            reference {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="ink-edge px-6 py-3 font-display font-semibold"
            style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
          >
            Try again
          </button>
          <Link href="/" className="ink-edge px-6 py-3 font-display font-semibold">
            Back to the start
          </Link>
        </div>
      </div>
    </main>
  );
}

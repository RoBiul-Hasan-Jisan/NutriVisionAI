import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 w-full grid place-items-center px-5 py-20">
      <div className="max-w-xl w-full text-center">
        <p className="figures text-6xl sm:text-7xl" style={{ color: "var(--color-red)" }}>
          404
        </p>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl mt-4 leading-tight">
          Nothing here
        </h1>

        <p className="mt-4 text-[var(--text-dim)]">
          This page does not exist. The knowledge base covers 101 dish categories — the one
          you were after may be under a different name.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/dishes"
            className="ink-edge px-6 py-3 font-display font-semibold"
            style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
          >
            Browse all 101
          </Link>
          <Link href="/analyze" className="ink-edge px-6 py-3 font-display font-semibold">
            Analyse a photo
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { sessionHeaders } from "@/lib/session";
import { SpiderBar } from "../components/SpiderBar";

type Prediction = {
  at: string;
  food_class: string;
  title: string;
  confidence: number;
  set_size: number;
  abstained: boolean;
  ms: number;
};

type Question = {
  at: string;
  question: string;
  food_class: string | null;
  mode: string;
  grounded: boolean;
  citations: number;
};

type History = {
  enabled: boolean;
  error?: string;
  predictions: Prediction[];
  questions: Question[];
  summary: {
    predictions: number;
    questions: number;
    abstained: number;
    spend_usd: number;
    most_analysed: [string, number][];
  };
};

function when(iso: string): string {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** A person's own record. */
export default function HistoryPage() {
  const [data, setData] = useState<History | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [erasing, setErasing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/history", { cache: "no-store", headers: sessionHeaders() });
      const payload = await res.json();
      if (!res.ok) setError(payload.error ?? "Could not load your history.");
      else {
        setData(payload as History);
        setError(null);
      }
    } catch {
      setError("Could not reach the service.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const erase = async () => {
    setErasing(true);
    try {
      await fetch("/api/history", { method: "DELETE", headers: sessionHeaders() });
      await load();
      setConfirming(false);
    } finally {
      setErasing(false);
    }
  };

  const summary = data?.summary;

  return (
    <main className="flex-1 w-full">
      <section className="mx-auto max-w-5xl px-5 pt-10 pb-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-dim)]">
          Your record
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-none mt-3">
          What you have analysed
        </h1>
        <p className="mt-3 text-[var(--text-dim)] max-w-prose">
          Photographs are never stored — this is the dish name, the confidence and the
          time, kept so you can look back at them.
        </p>
      </section>

      {error && (
        <section className="mx-auto max-w-5xl px-5 pb-6">
          <p
            className="ink-edge px-4 py-3 text-sm"
            style={{ background: "var(--color-amber)", color: "var(--color-ink)" }}
          >
            {error}
          </p>
        </section>
      )}

      {data?.enabled === false && (
        <section className="mx-auto max-w-5xl px-5 pb-6">
          <div className="panel p-5">
            <h2 className="font-display text-lg">History is not switched on</h2>
            <p className="mt-2 text-sm text-[var(--text-dim)]">
              The service is running without a database, so predictions are answered but not
              kept. Everything else works exactly as it does otherwise.
            </p>
          </div>
        </section>
      )}

      {summary && (
        <section className="mx-auto max-w-5xl px-5 pb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            ["dishes analysed", String(summary.predictions), ""],
            ["questions asked", String(summary.questions), ""],
            [
              "declined",
              String(summary.abstained),
              summary.abstained ? "the model was not sure" : "none",
            ],
            [
              "most analysed",
              summary.most_analysed[0]?.[0] ?? "—",
              summary.most_analysed[0] ? `${summary.most_analysed[0][1]}×` : "",
            ],
          ].map(([label, value, note]) => (
            <div key={label} className="panel p-4">
              <p className="text-xs uppercase tracking-widest text-[var(--text-dim)]">{label}</p>
              <p className="figures text-xl sm:text-2xl mt-1 break-words">{value}</p>
              {note && <p className="text-xs text-[var(--text-dim)] mt-1">{note}</p>}
            </div>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-5xl px-5 pb-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-display text-lg">Your predictions</h2>
          {!data ? (
            <SpiderBar label="Fetching your predictions" className="mt-3" />
          ) : data.predictions.length === 0 ? (
            <div className="mt-3">
              <p className="text-sm text-[var(--text-dim)]">Nothing yet.</p>
              <Link
                href="/analyze"
                className="inline-block mt-4 ink-edge px-4 py-2 font-display font-semibold"
                style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
              >
                Analyse a photo
              </Link>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--line)]/15">
              {data.predictions.map((p, i) => (
                <li key={`${p.at}-${i}`} className="py-2.5 flex items-baseline gap-3 flex-wrap">
                  <Link
                    href={`/dishes/${p.food_class.replace(/_/g, "-")}`}
                    className="flex-1 min-w-0 truncate hover:underline"
                  >
                    {p.title}
                  </Link>
                  <span className="figures text-sm">{(p.confidence * 100).toFixed(1)}%</span>
                  {p.set_size > 1 && (
                    <span className="figures text-xs text-[var(--text-dim)]">
                      {p.set_size} candidates
                    </span>
                  )}
                  {p.abstained && (
                    <span
                      className="text-[10px] uppercase px-1.5 py-0.5 ink-edge"
                      style={{ background: "var(--color-amber)", color: "var(--color-ink)" }}
                    >
                      declined
                    </span>
                  )}
                  <span className="figures text-xs text-[var(--text-dim)] shrink-0">
                    {when(p.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg">Your questions</h2>
          {!data || data.questions.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--text-dim)]">
              Nothing yet. After a prediction you can ask about the dish, and every answer
              cites the USDA record it came from.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--line)]/15">
              {data.questions.map((q, i) => (
                <li key={`${q.at}-${i}`} className="py-2.5">
                  <p className="text-sm">{q.question}</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1 flex gap-2 flex-wrap">
                    <span>{when(q.at)}</span>
                    {q.food_class && <span>· {q.food_class.replace(/_/g, " ")}</span>}
                    <span>· {q.citations} citations</span>
                    {q.mode === "insufficient" && (
                      <span style={{ color: "var(--color-amber)" }}>· refused as out of scope</span>
                    )}
                    {!q.grounded && (
                      <span style={{ color: "var(--color-red)" }}>· not grounded</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="panel p-5">
          <h2 className="font-display text-lg">Delete everything</h2>
          <p className="mt-2 text-sm text-[var(--text-dim)] max-w-prose">
            Removes every prediction, question and correction attached to this account,
            immediately and for good. Your account stays; its record does not.
          </p>
          {confirming ? (
            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                type="button"
                disabled={erasing}
                onClick={() => void erase()}
                className="ink-edge px-4 py-2 font-semibold disabled:opacity-50"
                style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
              >
                {erasing ? "Deleting…" : "Yes, delete it all"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="ink-edge px-4 py-2"
              >
                Keep it
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-4 ink-edge px-4 py-2"
            >
              Delete my history
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

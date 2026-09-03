import Link from "next/link";

import { Beat, Caption, GutterRule, Panel, StatPanel } from "./components/comic";
import { getKb } from "@/lib/kb";

const kb = getKb();

export default function Home() {
  return (
    <main className="flex-1 w-full">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 halftone-shade" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--primary)]">
                Vision · Conformal prediction · Grounded retrieval
              </p>

              <h1 className="font-display font-semibold leading-[1.02] mt-4 text-[2.6rem] sm:text-[3.6rem] lg:text-[4.2rem]">
                Read the genome
                <br />
                of your plate
              </h1>

              <p className="mt-6 max-w-xl text-lg text-[var(--text-dim)]">
                Photograph a dish. Get the category, an honestly calibrated confidence, the
                full set of candidates the model cannot rule out, and nutrition traced to
                the USDA record it came from.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/analyze"
                  className="ink-edge px-6 py-3 font-display font-semibold text-lg"
                  style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
                >
                  Analyse a photo
                </Link>
                <Link
                  href="/benchmarks"
                  className="ink-edge px-6 py-3 font-display font-semibold text-lg"
                >
                  See the evidence
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5 lg:pl-6">
              <Panel id="hero-panel" raised className="p-6">
                <p className="text-xs uppercase tracking-widest text-[var(--text-dim)]">
                  Food-101 test split
                </p>
                <p
                  className="figures text-5xl sm:text-6xl leading-none mt-2"
                  style={{ color: "var(--color-red)" }}
                >
                  97.16%
                </p>
                <p className="font-display font-semibold text-lg mt-1">top-1 accuracy</p>
                <p className="mt-3 text-sm text-[var(--text-dim)]">
                  SigLIP-SO400M and EVA-02-L, averaged. Validation was carved out of the
                  training split so all 25,250 test images stayed sealed until the end.
                </p>
              </Panel>

              <Panel className="p-4">
                <p className="figures text-3xl" style={{ color: "var(--color-blue)" }}>
                  99.56%
                </p>
                <p className="text-xs font-display font-semibold mt-1">
                  conformal coverage
                </p>
                <p className="text-xs text-[var(--text-dim)] mt-1">
                  measured · average 1.54 candidates
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat strip ──────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatPanel
            value="101"
            label="dish categories"
            note="each with a USDA-grounded profile"
          />
          <StatPanel
            value="32"
            label="nutrients per dish"
            note="macros, minerals, vitamins"
            accent="var(--color-blue)"
          />
          <StatPanel
            value="99.56%"
            label="conformal coverage"
            note="measured, not assumed"
            accent="var(--color-blue)"
          />
          <StatPanel
            value="97.16%"
            label="test top-1 accuracy"
            note="on a split untouched until final evaluation"
            accent="var(--color-green)"
          />
        </div>
      </section>

      {/* ── How it decides ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Beat
          n="01"
          title="How it decides"
          lede="Three commitments, each of which cost something to keep."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              h: "Two backbones, averaged",
              b: "SigLIP-SO400M and EVA-02-L each score the image. A parameter-free probability average beat a 3.97M-parameter learned fusion head — significantly, by exact McNemar test.",
              link: "/benchmarks",
              cta: "See the ablation",
            },
            {
              h: "Calibrated, not confident",
              b: "Raw softmax is not a probability. Temperature fitted on held-out data cut expected calibration error eightfold, so 80% now means right about 80% of the time.",
              link: "/methods#calibration",
              cta: "See the reliability curve",
            },
            {
              h: "It refuses to guess",
              b: "Questions outside the knowledge base are declined in under 130ms without calling a language model, and no answer states a number that is not in a cited source.",
              link: "/methods#grounding",
              cta: "See the grounding gate",
            },
          ].map((c) => (
            <Panel key={c.h} className="p-6 flex flex-col">
              <h3 className="font-display font-semibold text-xl">{c.h}</h3>
              <p className="mt-2 text-sm text-[var(--text-dim)] flex-1">{c.b}</p>
              <Link
                href={c.link}
                className="mt-4 inline-block py-1.5 text-sm font-semibold underline"
                style={{ color: "var(--color-blue)" }}
              >
                {c.cta} →
              </Link>
            </Panel>
          ))}
        </div>

        <Caption className="mt-8 max-w-3xl">
          Most projects like this report a single accuracy figure. This one reports the
          experiments that failed too — a learned fusion head that lost to an average, and a
          third backbone that earned no place in the ensemble.
        </Caption>
      </section>

      <GutterRule />

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h2 className="font-display font-semibold text-4xl sm:text-5xl leading-tight">
          Photograph something
        </h2>
        <p className="mt-4 text-[var(--text-dim)] max-w-xl mx-auto">
          {kb.num_classes} categories, {kb.entries.length} grounded nutrition profiles, and a
          model that tells you when it is not sure.
        </p>
        <Link
          href="/analyze"
          className="inline-block mt-7 ink-edge px-8 py-4 font-display font-semibold text-xl"
          style={{ background: "var(--color-red)", color: "var(--color-newsprint)" }}
        >
          Get started
        </Link>
      </section>
    </main>
  );
}

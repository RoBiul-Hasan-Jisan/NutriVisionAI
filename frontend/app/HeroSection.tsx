'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
  onCreateClick: () => void;
}

const SLOGAN_WORDS = ['Anonymous', 'Honest', 'Authentic'];

const FEATURES = [
  {
    index: '01',
    label: 'Complete Privacy',
    desc: 'Sender identities are never logged, stored, or traced. Zero data retention.',
  },
  {
    index: '02',
    label: 'Real-Time Delivery',
    desc: 'Messages reach you the instant they are sent — no delays, no buffering.',
  },
  {
    index: '03',
    label: 'Unfiltered Opinions',
    desc: 'Anonymity removes social pressure, so you receive genuine, candid feedback.',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateClick }) => {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % SLOGAN_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: 'rgb(5, 5, 8)' }}>

      {/* ── Noise grain ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* ── Dark Purple Glow (RGB 25, 5, 45) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 28%, rgba(25, 5, 45, 0.85) 0%, transparent 70%)',
        }}
      />

      {/* ── Secondary subtle glow for depth ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 40% 30% at 70% 80%, rgba(25, 5, 45, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* ── Top rule ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-10" />

      {/* ════════════════════════════
          DEVELOPER BADGE — bottom-right corner
      ════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.1, ease: 'easeOut' }}
        className="absolute bottom-5 right-5 z-20 group"
      >
        <div
          className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/3 px-3 py-2 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-500/20 group-hover:bg-white/[0.05]"
        >
          {/* Initials avatar */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold tracking-wide text-violet-300"
            style={{ background: 'rgba(109,77,207,0.2)', fontFamily: "'DM Mono', monospace" }}
          >
            RJ
          </div>

          {/* Name block */}
          <div className="leading-none">
            <p
              className="mb-0.75 text-[9px] font-medium uppercase tracking-[0.14em] text-white/20"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Developed by
            </p>
            <p
              className="text-[11.5px] font-semibold text-white/55"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Robiul Hasan Jisan
            </p>
          </div>

          {/* Divider + icon links */}
          <div className="flex items-center gap-1.5 border-l border-white/[0.07] pl-2.5">
            {/* GitHub */}
            <a
              href="https://github.com/RoBiul-Hasan-Jisan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-5.5 w-5.5 items-center justify-center rounded-md text-white/22 transition-colors duration-200 hover:text-violet-400"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>

            {/* Portfolio globe */}
            <a
              href="https://robiulhasanjisan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="flex h-5.5 w-5.5 items-center justify-center rounded-md text-white/22 transition-colors duration-200 hover:text-violet-400"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════
          MAIN CONTENT
      ════════════════════════════ */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">

        {/* Logo - BIG and prominent */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-4"
        >
          <img
            src="/logo2.png"
            alt="GhostNote"
            className="h-32 md:h-40 w-auto"
            style={{ filter: 'brightness(1.05) contrast(0.95)' }}
          />
        </motion.div>

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/9 bg-white/4 px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
          <span
            className="text-[10px] font-medium tracking-[0.14em] uppercase text-white/40"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Share your thoughts —&nbsp;
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-[10px] font-semibold tracking-[0.14em] uppercase text-violet-300"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {SLOGAN_WORDS[currentWord]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-2 max-w-3xl text-[2rem] font-bold leading-[1.08] tracking-[-0.04em] text-white md:text-[3.5rem]"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Speak freely.{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(167,139,250,0.55) 100%)',
            }}
          >
            Stay anonymous.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
          className="mb-4 max-w-2xl text-[0.9rem] leading-[1.6] text-white/36"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
        >
          Create a personal link. Let anyone send you confessions, compliments,
          and honest opinions — completely anonymously.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="flex flex-col items-center gap-2.5 sm:flex-row"
        >
          <button
            onClick={onCreateClick}
            className="h-10 rounded-xl px-7 text-[0.8rem] font-semibold tracking-wide text-[#060709] transition-all duration-200 hover:scale-[1.015]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: 'linear-gradient(160deg, #ffffff 0%, #e8e3ff 100%)',
            }}
          >
            Create Your Link
          </button>

          <Link href="/login">
            <button
              className="h-10 rounded-xl border border-white/10 bg-transparent px-7 text-[0.8rem] font-medium tracking-wide text-white/50 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.04] hover:text-white/70"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </button>
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="my-5 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          className="grid w-full max-w-3xl grid-cols-1 gap-0 md:grid-cols-3"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
              className={`
                relative px-4 py-3 text-left
                ${i !== 0 ? 'md:border-l md:border-l-white/6' : ''}
                ${i !== FEATURES.length - 1 ? 'border-b border-b-white/6 md:border-b-0' : ''}
              `}
            >
              <p
                className="mb-1 text-[9px] font-medium tracking-[0.18em] uppercase text-white/18"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {f.index}
              </p>
              <h3
                className="mb-0.5 text-[0.8rem] font-semibold leading-tight text-white/75"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {f.label}
              </h3>
              <p
                className="text-[0.7rem] leading-[1.5] text-white/28"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-[9px] tracking-[0.2em] text-white/70"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          NO ACCOUNT REQUIRED TO SEND · ALWAYS FREE
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-16 z-10"
        style={{ background: 'linear-gradient(to top, rgb(5, 5, 8) 0%, transparent 100%)' }}
      />
    </section>
  );
};
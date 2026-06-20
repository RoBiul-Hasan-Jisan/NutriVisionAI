'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Ghost, 
  MessageCircle, 
  Shield, 
  Zap, 
  Share2, 
  Lock, 
  ChevronRight, 
  Sparkles,
  Heart,
  Eye,
  Smile,
  AlertCircle
} from 'lucide-react';

// Animation variants with correct easing
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: 'easeOut' as const 
    } 
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// Feature data
const features = [
  { 
    icon: Ghost, 
    title: 'True anonymity', 
    desc: 'Sender info is never stored. Not even the IP address in messages.',
  },
  { 
    icon: Shield, 
    title: 'Spam protected', 
    desc: 'Rate limiting prevents message flooding. Stay safe.',
  },
  { 
    icon: Zap, 
    title: 'Instant delivery', 
    desc: 'Messages appear on your dashboard the moment they\'re sent.',
  },
];

// Message types
const messageTypes = [
  { label: 'Compliments', icon: Heart },
  { label: 'Confessions', icon: AlertCircle },
  { label: 'Crush notes', icon: Smile },
  { label: 'Secrets', icon: Eye },
  { label: 'Feedback', icon: MessageCircle },
];

// How it works steps
const steps = [
  { 
    icon: Share2, 
    step: '01', 
    title: 'Create your link', 
    desc: 'Sign up and get a unique ghostnote.app/u/yourname link in seconds.' 
  },
  { 
    icon: MessageCircle, 
    step: '02', 
    title: 'Share anywhere', 
    desc: 'Post your link on socials, bios, or WhatsApp. Anyone can message you.' 
  },
  { 
    icon: Lock, 
    step: '03', 
    title: 'Read anonymously', 
    desc: 'Read all messages on your private dashboard. Sender identity never stored.' 
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-600/10 pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full blur-3xl bg-teal-600/8 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto" role="navigation" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 group">
          <Ghost className="w-6 h-6 text-purple-400 transition-transform group-hover:scale-110" />
          <span className="text-lg font-bold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            GhostNote
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" aria-label="Sign in to your account">
            <button className="text-sm px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Sign in
            </button>
          </Link>
          <Link href="/register" aria-label="Create a new account">
            <button className="text-sm px-4 py-2 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40">
              Get started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 pt-20 pb-24 max-w-4xl mx-auto"
        aria-labelledby="hero-title"
      >
        <motion.div 
          variants={fadeUp} 
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-400/20 bg-purple-500/5"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium" style={{ fontFamily: 'Syne' }}>
            100% Anonymous · No login to send
          </span>
        </motion.div>

        <motion.h1 
          id="hero-title"
          variants={fadeUp} 
          className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-slate-50"
          style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
        >
          Messages that{' '}
          <span className="bg-linear-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
            disappear
          </span>
          {' '}into the void
        </motion.h1>

        <motion.p 
          variants={fadeUp} 
          className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-slate-300"
          style={{ fontFamily: 'Inter' }}
        >
          Create your link. Share it anywhere. Let anyone send you confessions,
          compliments, and secrets — completely anonymously, no account needed.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <button className="text-base px-8 py-4 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center gap-2">
              Create my GhostNote link
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/login">
            <button className="text-base px-8 py-4 text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-white/5">
              Sign in
            </button>
          </Link>
        </motion.div>

        {/* Demo link preview */}
        <motion.div 
          variants={fadeUp} 
          className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-purple-400 font-medium" style={{ fontFamily: 'Syne', fontSize: '0.9rem' }}>
            ghostnote.app/u/<span className="text-slate-200">yourname</span>
          </span>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto" aria-labelledby="how-it-works">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 id="how-it-works" className="text-4xl font-bold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
            How it works
          </h2>
          <p className="text-slate-400">Three steps to your inbox of secrets</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-purple-400/15" style={{ fontFamily: 'Syne' }}>
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-100" style={{ fontFamily: 'Syne' }}>
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Message Types */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto" aria-labelledby="message-types">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="message-types" className="text-4xl font-bold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
            What they can send
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {messageTypes.map((type, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="inline-flex items-center gap-2 text-base px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 hover:bg-white/10 transition-colors"
            >
              <type.icon className="w-4 h-4 text-purple-400" />
              {type.label}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto" aria-labelledby="features">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all flex gap-4"
            >
              <div className="shrink-0 mt-0.5 text-purple-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-slate-100" style={{ fontFamily: 'Syne' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 text-center" aria-labelledby="cta-title">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-12 rounded-3xl border border-purple-400/20 bg-linear-to-b from-purple-500/10 to-transparent backdrop-blur-sm shadow-2xl shadow-purple-600/10"
        >
          <Ghost className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h2 id="cta-title" className="text-4xl font-bold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
            Ready to hear the truth?
          </h2>
          <p className="mb-8 text-slate-300">
            Get your anonymous message link in under a minute.
          </p>
          <Link href="/register">
            <button className="text-base px-8 py-4 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40">
              Create free account →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5 text-slate-400/50 text-sm">
        <Ghost className="w-4 h-4 inline-block mr-1" />
        GhostNote · Anonymous messaging, done right
      </footer>
    </div>
  );
}
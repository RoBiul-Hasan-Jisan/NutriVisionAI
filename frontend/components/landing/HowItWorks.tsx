'use client';

import { motion } from 'framer-motion';
import { Share2, MessageCircle, Lock } from 'lucide-react';

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

export const HowItWorks = () => {
  return (
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
            className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
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
  );
};
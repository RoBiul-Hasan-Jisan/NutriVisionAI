'use client';

import { motion } from 'framer-motion';
import { Heart, AlertCircle, Smile, Eye, MessageCircle } from 'lucide-react';

const messageTypes = [
  { label: 'Compliments', icon: Heart },
  { label: 'Confessions', icon: AlertCircle },
  { label: 'Crush notes', icon: Smile },
  { label: 'Secrets', icon: Eye },
  { label: 'Feedback', icon: MessageCircle },
];

export const MessageTypes = () => {
  return (
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
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 text-base px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 hover:bg-white/10 transition-colors cursor-default"
          >
            <type.icon className="w-4 h-4 text-purple-400" />
            {type.label}
          </motion.span>
        ))}
      </div>
    </section>
  );
};
'use client';

import { motion } from 'framer-motion';
import { Ghost, Shield, Zap } from 'lucide-react';

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

export const FeaturesSection = () => {
  return (
    <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto" aria-labelledby="features">
      <div className="grid md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all flex gap-4 group"
          >
            <div className="shrink-0 mt-0.5 text-purple-400 group-hover:text-purple-300 transition-colors">
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
  );
};
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ghost } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const CTASection = ({ 
  title = 'Ready to hear the truth?',
  description = 'Get your anonymous message link in under a minute.',
  buttonText = 'Create free account →',
  buttonLink = '/register'
}: CTASectionProps) => {
  return (
    <section className="relative z-10 px-6 py-24 text-center" aria-labelledby="cta-title">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto p-12 rounded-3xl border border-purple-400/20 bg-gradient-to-b from-purple-500/10 to-transparent backdrop-blur-sm shadow-2xl shadow-purple-600/10"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Ghost className="w-12 h-12 mx-auto mb-4 text-purple-400" />
        </motion.div>
        
        <h2 id="cta-title" className="text-4xl font-bold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
          {title}
        </h2>
        <p className="mb-8 text-slate-300">{description}</p>
        
        <Link href={buttonLink}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-base px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
          >
            {buttonText}
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};
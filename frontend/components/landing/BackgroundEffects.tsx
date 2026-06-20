'use client';

import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-600/10 pointer-events-none"
        style={{ willChange: 'transform' }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full blur-3xl bg-teal-600/8 pointer-events-none"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
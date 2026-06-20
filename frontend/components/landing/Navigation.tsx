'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ghost, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  variant?: 'default' | 'transparent';
}

export const Navigation = ({ variant = 'default' }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav 
      className={`relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto ${
        variant === 'transparent' ? 'bg-transparent' : ''
      }`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Ghost className="w-6 h-6 text-purple-400 transition-transform" />
        </motion.div>
        <span className="text-lg font-bold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
          GhostNote
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        <NavLinks />
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-slate-300 hover:text-white transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <NavLinks mobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => {
  const linkClass = mobile 
    ? "text-sm px-4 py-3 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 w-full text-left"
    : "text-sm px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5";

  return (
    <>
      <Link href="/login" onClick={onClose}>
        <button className={linkClass} aria-label="Sign in to your account">
          Sign in
        </button>
      </Link>
      <Link href="/register" onClick={onClose}>
        <button className={`${mobile ? 'w-full' : ''} text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40`}>
          Get started
        </button>
      </Link>
    </>
  );
};
'use client';

import Link from 'next/link';
import { Ghost, Heart } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/5 pb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Ghost className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-bold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
                GhostNote
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Anonymous messaging, done right. Share your secrets without fear.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
               <FaTwitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-4" style={{ fontFamily: 'Syne' }}>Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4" style={{ fontFamily: 'Syne' }}>Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-slate-400/50">
            © {currentYear} GhostNote. All rights reserved.
          </p>
          <p className="text-sm text-slate-400/50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> in the digital shadows
          </p>
        </div>
      </div>
    </footer>
  );
};
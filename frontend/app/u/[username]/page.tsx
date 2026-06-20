'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, PublicUser, MESSAGE_TYPES, MessageType } from '@/lib/api';
import { Ghost, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const TYPE_CONFIG: Record<MessageType, { label: string; emoji: string; cls: string; color: string; placeholder: string }> = {
  compliment: {
    label: 'Compliment', emoji: '✨', cls: 'chip-compliment', color: '#10B981',
    placeholder: 'Something you genuinely appreciate about this person...',
  },
  confession: {
    label: 'Confession', emoji: '🔥', cls: 'chip-confession', color: '#F87171',
    placeholder: 'Something you\'ve been holding back...',
  },
  crush: {
    label: 'Crush note', emoji: '💜', cls: 'chip-crush', color: '#F472B6',
    placeholder: 'Tell them how you feel...',
  },
  secret: {
    label: 'Secret', emoji: '🤫', cls: 'chip-secret', color: '#FBBF24',
    placeholder: 'Something only you know...',
  },
  feedback: {
    label: 'Feedback', emoji: '💬', cls: 'chip-feedback', color: '#60A5FA',
    placeholder: 'Honest thoughts or suggestions...',
  },
};

export default function PublicMessagePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedType, setSelectedType] = useState<MessageType>('compliment');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!username) return;
    api.getPublicProfile(username)
      .then(setProfile)
      .catch(() => setNotFound(true));
  }, [username]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !profile) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.sendMessage({ username, type: selectedType, message: message.trim() });
      setStatus('sent');
      setMessage('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-purple-600/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6"
          >
            <Ghost className="w-10 h-10 text-purple-400/60" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 text-slate-100" style={{ fontFamily: 'Syne' }}>
            Ghost not found
          </h1>
          <p className="text-slate-400 mb-8">This GhostNote link doesn&apos;t exist.</p>
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2"
            >
              Go home
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <Ghost className="w-12 h-12 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  if (!profile.isAcceptingMessages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-purple-600/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-lg p-12 rounded-3xl max-w-md relative z-10"
        >
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Ghost className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2 text-slate-100" style={{ fontFamily: 'Syne' }}>
            @{profile.username}
          </h1>
          <p className="text-slate-400">
            This GhostNote is currently not accepting messages.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentType = TYPE_CONFIG[selectedType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none bg-purple-600/10" />
      <div className="absolute -bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none bg-teal-600/8" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-lg mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <Ghost className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors" style={{ fontFamily: 'Syne' }}>
              GhostNote
            </span>
          </Link>

          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6 text-3xl"
          >
            👻
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-2 text-slate-50" style={{ fontFamily: 'Syne' }}>
            @{profile.username}
          </h1>
          <p className="text-slate-400">
            Send an anonymous message · Your identity stays hidden
          </p>
        </motion.div>

        {/* Message form */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSend}
          className="glass-lg p-8 rounded-3xl space-y-6"
        >
          {/* Type selector */}
          <motion.div variants={fadeUp}>
            <p className="text-xs mb-4 uppercase tracking-widest font-medium text-slate-400" style={{ fontFamily: 'Syne' }}>
              Message type
            </p>
            <div className="flex flex-wrap gap-3">
              {MESSAGE_TYPES.map(type => {
                const cfg = TYPE_CONFIG[type];
                const isActive = selectedType === type;
                return (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`category-chip ${cfg.cls} transition-all`}
                    style={{
                      opacity: isActive ? 1 : 0.6,
                      cursor: 'pointer',
                    }}
                  >
                    {cfg.emoji} {cfg.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Message textarea */}
          <motion.div variants={fadeUp}>
            <p className="text-xs mb-4 uppercase tracking-widest font-medium text-slate-400" style={{ fontFamily: 'Syne' }}>
              Your message
            </p>
            <div className="relative">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={currentType.placeholder}
                maxLength={500}
                rows={5}
                className="ghost-input resize-none text-slate-100"
                required
              />
              <div className="text-right mt-2 text-xs text-slate-500 font-medium">
                {message.length}/500
              </div>
            </div>
          </motion.div>

          {/* Status messages */}
          <AnimatePresence>
            {status === 'sent' && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-emerald-500/15 border border-emerald-400/30 text-emerald-400"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Message sent! Your identity is safe</span>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-red-500/15 border border-red-400/30 text-red-400"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === 'sending' || !message.trim()}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            style={{ fontFamily: 'Syne' }}
          >
            {status === 'sending' ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ✨
                </motion.span>
                Sending...
              </>
            ) : (
              <>
                Send anonymously
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <motion.p 
            variants={fadeUp}
            className="text-center text-xs text-slate-500 font-medium"
          >
            Your identity is always hidden from the recipient
          </motion.p>
        </motion.form>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-400 mb-4 font-medium">
            Want your own GhostNote link?
          </p>
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2"
              style={{ fontFamily: 'Syne' }}
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

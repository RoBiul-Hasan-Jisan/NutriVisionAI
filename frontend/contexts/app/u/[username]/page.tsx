'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, PublicUser, MESSAGE_TYPES, MessageType } from '@/lib/api';
import { Ghost, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
      <div className="min-h-screen bg-grid radial-bg flex items-center justify-center text-center px-4">
        <div>
          <Ghost className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#A78BFA' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>Ghost not found</h1>
          <p style={{ color: 'rgba(232, 230, 240, 0.5)' }}>This GhostNote link doesn't exist.</p>
          <Link href="/" className="inline-block mt-6">
            <button className="btn-ghost">Go home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-grid radial-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Ghost className="w-8 h-8 animate-pulse" style={{ color: '#A78BFA' }} />
          <p style={{ color: 'rgba(232, 230, 240, 0.4)', fontFamily: 'Syne' }}>Summoning ghost...</p>
        </div>
      </div>
    );
  }

  if (!profile.isAcceptingMessages) {
    return (
      <div className="min-h-screen bg-grid radial-bg flex items-center justify-center text-center px-4">
        <div className="glass p-10 rounded-2xl max-w-md">
          <Ghost className="w-12 h-12 mx-auto mb-4" style={{ color: '#A78BFA' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>@{profile.username}</h1>
          <p style={{ color: 'rgba(232, 230, 240, 0.5)' }}>
            This GhostNote is currently not accepting messages.
          </p>
        </div>
      </div>
    );
  }

  const currentType = TYPE_CONFIG[selectedType];

  return (
    <div className="min-h-screen bg-grid radial-bg px-4 py-12">
      {/* Ambient blob */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: `rgba(108, 61, 212, 0.08)` }} />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity">
            <Ghost className="w-5 h-5" style={{ color: '#A78BFA' }} />
            <span style={{ fontFamily: 'Syne', color: '#E8E6F0', fontSize: '0.9rem' }}>GhostNote</span>
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-2xl"
            style={{ background: 'rgba(108, 61, 212, 0.15)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            👻
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne' }}>
            @{profile.username}
          </h1>
          <p style={{ color: 'rgba(232, 230, 240, 0.5)', fontSize: '0.9rem' }}>
            Send an anonymous message · Your identity stays hidden
          </p>
        </motion.div>

        {/* Message form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSend}
          className="glass p-6 rounded-2xl"
        >
          {/* Type selector */}
          <div className="mb-5">
            <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: 'rgba(232, 230, 240, 0.4)', fontFamily: 'Syne' }}>
              Message type
            </p>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TYPES.map(type => {
                const cfg = TYPE_CONFIG[type];
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`category-chip ${cfg.cls} transition-all`}
                    style={{
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      cursor: 'pointer',
                    }}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message textarea */}
          <div className="mb-5">
            <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: 'rgba(232, 230, 240, 0.4)', fontFamily: 'Syne' }}>
              Your message
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={currentType.placeholder}
              maxLength={500}
              rows={5}
              className="ghost-input resize-none"
              required
            />
            <div className="text-right mt-1 text-xs" style={{ color: 'rgba(232, 230, 240, 0.3)' }}>
              {message.length}/500
            </div>
          </div>

          {/* Status messages */}
          <AnimatePresence>
            {status === 'sent' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981' }}
              >
                <CheckCircle className="w-4 h-4" />
                Message sent! Your identity is safe 👻
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171' }}
              >
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={status === 'sending' || !message.trim()}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {status === 'sending' ? (
              <>
                <span className="animate-spin">🌀</span> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send anonymously
              </>
            )}
          </button>

          <p className="text-center mt-3 text-xs" style={{ color: 'rgba(232, 230, 240, 0.3)' }}>
            🔒 Your identity is never revealed to the recipient
          </p>
        </motion.form>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm mb-3" style={{ color: 'rgba(232, 230, 240, 0.4)' }}>
            Want your own GhostNote link?
          </p>
          <Link href="/register">
            <button className="btn-ghost text-sm">Create free account →</button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

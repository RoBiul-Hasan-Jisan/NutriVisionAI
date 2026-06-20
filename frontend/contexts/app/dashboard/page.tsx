'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Message, MessagesResponse, MESSAGE_TYPES, MessageType } from '@/lib/api';
import {
  Ghost,
  Copy,
  CheckCheck,
  Trash2,
  Eye,
  LogOut,
  ExternalLink,
  MessageCircle,
  Filter,
  RefreshCw,
  Bell,
  BellOff,
  Share2,
  Heart,
  Loader2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const TYPE_CONFIG: Record<string, { label: string; emoji: string; cls: string }> = {
  compliment: { label: 'Compliment', emoji: '✨', cls: 'chip-compliment' },
  confession: { label: 'Confession', emoji: '🔥', cls: 'chip-confession' },
  crush: { label: 'Crush', emoji: '💜', cls: 'chip-crush' },
  secret: { label: 'Secret', emoji: '🤫', cls: 'chip-secret' },
  feedback: { label: 'Feedback', emoji: '💬', cls: 'chip-feedback' },
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function DashboardPage() {
  const { firebaseUser, userProfile, loading, hasProfile, signOut } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [filterType, setFilterType] = useState<string>('all');
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState(false);
  const [acceptingMessages, setAcceptingMessages] = useState(true);
  const [togglingMessages, setTogglingMessages] = useState(false);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
    if (!loading && firebaseUser && !hasProfile) router.push('/register');
    if (userProfile) setAcceptingMessages(userProfile.isAcceptingMessages);
  }, [loading, firebaseUser, hasProfile, userProfile, router]);

  const fetchMessages = useCallback(async () => {
    if (!firebaseUser) return;
    setFetching(true);
    try {
      const params = filterType !== 'all' ? { type: filterType } : undefined;
      const res: MessagesResponse = await api.getMessages(params);
      setMessages(res.messages);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setFetching(false);
    }
  }, [firebaseUser, filterType]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleCopyLink = () => {
    if (!userProfile) return;
    navigator.clipboard.writeText(`${APP_URL}${userProfile.profileLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${APP_URL}${userProfile?.profileLink || ''}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GhostNote',
          text: `Share your thoughts with me anonymously! Send me a message on GhostNote.`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      setStats(prev => ({
        ...prev,
        total: (prev.total || 0) - 1,
      }));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleMarkRead = async (msg: Message) => {
    if (msg.isRead) return;
    try {
      await api.markRead(msg._id);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
    } catch {}
  };

  const handleToggleMessages = async () => {
    setTogglingMessages(true);
    try {
      await api.updateSettings({ isAcceptingMessages: !acceptingMessages });
      setAcceptingMessages(prev => !prev);
    } catch {}
    setTogglingMessages(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-slate-400 text-sm">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const shareLink = `${APP_URL}${userProfile.profileLink}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl pointer-events-none bg-purple-600/5" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none bg-teal-600/5" />

      {/* Topbar */}
      <header className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 group">
          <Ghost className="w-5 h-5 text-purple-400 transition-transform group-hover:scale-110" />
          <span className="font-bold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            GhostNote
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm hidden sm:block text-slate-400">
            @{userProfile.username}
          </span>
          <button
            onClick={handleSignOut}
            className="text-sm px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Welcome + Link card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-slate-100" style={{ fontFamily: 'Syne' }}>
                Welcome back, {userProfile.displayName?.split(' ')[0] || userProfile.username} 👋
              </h1>
              <p className="text-sm text-slate-400">
                Share your link to receive anonymous messages
              </p>
            </div>
            <button
              onClick={handleToggleMessages}
              disabled={togglingMessages}
              className={`text-sm px-4 py-2 rounded-lg border transition-all flex items-center gap-2 shrink-0 ${
                acceptingMessages 
                  ? 'border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10' 
                  : 'border-red-400/20 text-red-400 hover:bg-red-400/10'
              }`}
            >
              {acceptingMessages ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              {acceptingMessages ? 'Accepting' : 'Paused'}
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-400/20">
            <span className="flex-1 truncate text-sm text-purple-400 font-mono">
              {shareLink}
            </span>
            <div className="flex items-center gap-2 justify-end">
              <a
                href={shareLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all font-medium ${
                  copied 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/30' 
                    : 'bg-purple-500/20 text-purple-400 border border-purple-400/30 hover:bg-purple-500/30'
                }`}
                style={{ fontFamily: 'Syne' }}
              >
                {copied ? (
                  <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all bg-purple-500/20 text-purple-400 border border-purple-400/30 hover:bg-purple-500/30 font-medium"
                style={{ fontFamily: 'Syne' }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6"
        >
          {[
            { label: 'Total', value: stats.total || 0, color: '#A78BFA' },
            ...MESSAGE_TYPES.map(t => ({
              label: TYPE_CONFIG[t].label,
              value: stats[t] || 0,
              color: '',
            }))
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm text-center"
            >
              <div className="text-2xl font-extrabold mb-1 text-slate-100" style={{ fontFamily: 'Syne' }}>
                {item.value}
              </div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter + Refresh */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {['all', ...MESSAGE_TYPES].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium capitalize ${
                  filterType === type
                    ? 'bg-purple-500/25 text-purple-400 border border-purple-400/40'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Syne' }}
              >
                {type === 'all' ? 'All' : TYPE_CONFIG[type]?.emoji + ' ' + TYPE_CONFIG[type]?.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchMessages}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Messages */}
        {fetching && messages.length === 0 ? (
          <div className="text-center py-20">
            <Ghost className="w-8 h-8 mx-auto animate-pulse mb-3 text-purple-400" />
            <p className="text-slate-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-400/20" />
            <h3 className="text-lg font-bold mb-2 text-slate-100" style={{ fontFamily: 'Syne' }}>
              No messages yet
            </h3>
            <p className="text-sm mb-6 text-slate-400">
              Share your link to start receiving anonymous messages
            </p>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 font-medium"
              style={{ fontFamily: 'Syne' }}
            >
              <Copy className="w-4 h-4" />
              Copy my link
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-purple-400/20 transition-all cursor-pointer ${
                    msg.isRead ? 'opacity-75' : ''
                  }`}
                  onClick={() => handleMarkRead(msg)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`category-chip ${TYPE_CONFIG[msg.type]?.cls}`}>
                          {TYPE_CONFIG[msg.type]?.emoji} {TYPE_CONFIG[msg.type]?.label}
                        </span>
                        {!msg.isRead && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-base leading-relaxed text-slate-100 break-words">
                        {msg.message}
                      </p>
                      <p className="text-xs mt-3 text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {!msg.isRead && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkRead(msg); }}
                          title="Mark as read"
                          className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                        title="Delete"
                        className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8 mt-8 border-t border-white/5"
        >
          <Link href="/about">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">
              About GhostNote
            </button>
          </Link>
          <Link href="/privacy">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
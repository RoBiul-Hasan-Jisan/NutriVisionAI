'use client';
import Image from "next/image";
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

const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
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
     <Link href="/" className="flex items-center group">
  <Image
    src="/logo2.png"
    alt="GhostNote Logo"
    width={80}
    height={80}
    className="object-contain transition-transform group-hover:scale-110"
    priority
  />
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
          className="glass-lg p-8 rounded-3xl mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold mb-2 text-slate-50" style={{ fontFamily: 'Syne' }}>
                Welcome back, {userProfile.displayName?.split(' ')[0] || userProfile.username}
              </h1>
              <p className="text-slate-400">
                Your anonymous message link is ready to share
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleMessages}
              disabled={togglingMessages}
              className={`text-sm px-5 py-2.5 rounded-xl border transition-all flex items-center gap-2 shrink-0 font-medium ${
                acceptingMessages 
                  ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/25' 
                  : 'bg-red-500/15 border-red-400/30 text-red-400 hover:bg-red-500/25'
              }`}
              style={{ fontFamily: 'Syne' }}
            >
              {acceptingMessages ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              {acceptingMessages ? 'Accepting' : 'Paused'}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-400/20"
          >
            <span className="flex-1 truncate text-sm text-purple-300 font-mono">
              {shareLink}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={shareLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                  copied 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' 
                    : 'bg-purple-500/20 text-purple-400 border border-purple-400/30 hover:bg-purple-500/30'
                }`}
                style={{ fontFamily: 'Syne' }}
              >
                {copied ? (
                  <><CheckCheck className="w-4 h-4" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy</>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all bg-purple-500/20 text-purple-400 border border-purple-400/30 hover:bg-purple-500/30 font-medium"
                style={{ fontFamily: 'Syne' }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total || 0, color: '#A78BFA', bg: 'purple' },
            ...MESSAGE_TYPES.map(t => ({
              label: TYPE_CONFIG[t].label,
              value: stats[t] || 0,
              color: TYPE_CONFIG[t].label,
              bg: t,
            }))
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -5 }}
              className={`glass p-5 rounded-2xl text-center cursor-pointer transition-all ${
                item.bg === 'purple' ? 'bg-purple-500/10' : 
                item.bg === 'compliment' ? 'bg-emerald-500/10' :
                item.bg === 'confession' ? 'bg-red-500/10' :
                item.bg === 'crush' ? 'bg-pink-500/10' :
                item.bg === 'secret' ? 'bg-amber-500/10' :
                'bg-blue-500/10'
              }`}
            >
              <motion.div 
                className="text-3xl font-extrabold mb-2 text-slate-100" 
                style={{ fontFamily: 'Syne' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.value}
              </motion.div>
              <div className="text-xs font-medium text-slate-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter + Refresh */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6 gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {['all', ...MESSAGE_TYPES].map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(type)}
                className={`text-xs px-4 py-2 rounded-lg transition-all font-medium capitalize ${
                  filterType === type
                    ? 'bg-purple-500/25 text-purple-400 border border-purple-400/40 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Syne' }}
              >
                {type === 'all' ? 'All' : TYPE_CONFIG[type]?.emoji + ' ' + TYPE_CONFIG[type]?.label}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            onClick={fetchMessages}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          </motion.button>
        </motion.div>

        {/* Messages */}
        {fetching && messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Ghost className="w-12 h-12 text-purple-400" />
            </motion.div>
            <p className="text-slate-400 font-medium">Loading your messages...</p>
          </motion.div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/10 flex items-center justify-center mx-auto mb-6"
            >
              <MessageCircle className="w-10 h-10 text-purple-400/40" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 text-slate-100" style={{ fontFamily: 'Syne' }}>
              No messages yet
            </h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Share your link to start receiving anonymous messages, confessions, and compliments
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 font-medium"
              style={{ fontFamily: 'Syne' }}
            >
              <Copy className="w-4 h-4" />
              Copy my link
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg._id}
                  layout
                  initial={{ opacity: 0, y: 20, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 100, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass-lg p-6 rounded-2xl cursor-pointer group transition-all ${
                    msg.isRead ? 'opacity-75' : 'border-purple-400/30 shadow-lg shadow-purple-500/10'
                  }`}
                  onClick={() => handleMarkRead(msg)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className={`category-chip ${TYPE_CONFIG[msg.type]?.cls}`}>
                          {TYPE_CONFIG[msg.type]?.emoji} {TYPE_CONFIG[msg.type]?.label}
                        </span>
                        {!msg.isRead && (
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium border border-purple-400/30"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                            New
                          </motion.span>
                        )}
                      </div>
                      <p className="text-base leading-relaxed text-slate-100 break-words mb-4">
                        {msg.message}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); handleMarkRead(msg); }}
                          title="Mark as read"
                          className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-400/30 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                        title="Delete"
                        className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
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

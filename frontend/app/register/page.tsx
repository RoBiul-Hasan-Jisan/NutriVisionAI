'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ghost, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function RegisterPage() {
  const [step, setStep] = useState<'auth' | 'username'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { firebaseUser, hasProfile, refreshProfile } = useAuth();

  useEffect(() => {
    if (firebaseUser && !hasProfile) setStep('username');
    if (firebaseUser && hasProfile) router.push('/dashboard');
  }, [firebaseUser, hasProfile]);

  useEffect(() => {
    if (!username) { setUsernameStatus('idle'); return; }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) { setUsernameStatus('invalid'); return; }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await api.checkUsername(username);
        setUsernameStatus(res.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStep('username');
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      };
      setError(messages[err.code] || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setStep('username');
    } catch (err: any) {
      setError('Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available') return;
    setError('');
    setLoading(true);
    try {
      await api.createProfile({
        username,
        displayName: firebaseUser?.displayName || username,
        photoURL: firebaseUser?.photoURL || undefined,
      });
      await refreshProfile();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-purple-600/10 pointer-events-none" />
      <div className="absolute -bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl bg-teal-600/8 pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <Ghost className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-lg font-bold text-slate-100" style={{ fontFamily: 'Syne' }}>
              GhostNote
            </span>
          </Link>
          {step === 'auth' ? (
            <>
              <h1 className="text-4xl font-extrabold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
                Create account
              </h1>
              <p className="text-slate-400">Join and get your anonymous link</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold mb-3 text-slate-50" style={{ fontFamily: 'Syne' }}>
                Choose your username
              </h1>
              <p className="text-slate-400">This becomes your GhostNote link</p>
            </>
          )}
        </motion.div>

        {/* Main card */}
        <motion.div variants={fadeUp} className="glass-lg p-8 rounded-3xl space-y-6">
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-red-500/15 border border-red-400/30 text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {step === 'auth' ? (
            <>
              {/* Google Button */}
              <motion.button
                variants={fadeUp}
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-slate-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Connecting...' : 'Continue with Google'}
              </motion.button>

              {/* Divider */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-slate-500">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="ghost-input pl-10 text-slate-100"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="ghost-input pl-10 text-slate-100"
                      required
                      minLength={6}
                    />
                  </div>
                </motion.div>

                <motion.button
                  variants={fadeUp}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Syne' }}
                >
                  {loading ? 'Creating account...' : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer link */}
              <motion.p variants={fadeUp} className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Sign in
                </Link>
              </motion.p>
            </>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-5">
              <motion.div variants={fadeUp}>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Your GhostNote username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase())}
                    placeholder="yourname"
                    className="ghost-input pl-10 pr-10 text-slate-100"
                    minLength={3}
                    maxLength={30}
                    pattern="^[a-zA-Z0-9_]+$"
                    required
                  />
                  {usernameStatus === 'available' && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  )}
                  {usernameStatus === 'taken' && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {usernameStatus === 'checking' && 'Checking availability...'}
                  {usernameStatus === 'available' && <span className="text-emerald-400">✓ Username is available!</span>}
                  {usernameStatus === 'taken' && <span className="text-red-400">✗ Username is taken. Try another.</span>}
                  {usernameStatus === 'invalid' && <span className="text-amber-400">Letters, numbers, underscores only (3-30 chars)</span>}
                  {usernameStatus === 'idle' && username === '' && 'Letters, numbers, and underscores only'}
                </div>
              </motion.div>

              {username && usernameStatus === 'available' && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="px-4 py-3 rounded-xl text-sm bg-purple-500/10 border border-purple-400/20"
                >
                  <span className="text-slate-400">Your link: </span>
                  <span className="font-medium text-purple-300" style={{ fontFamily: 'Syne' }}>
                    ghostnote.app/u/{username}
                  </span>
                </motion.div>
              )}

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={loading || usernameStatus !== 'available'}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Syne' }}
              >
                {loading ? 'Creating profile...' : (
                  <>
                    Create my GhostNote
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

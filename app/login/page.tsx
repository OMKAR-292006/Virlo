"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, TrendingUp, Zap, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthSuccess from '@/components/ui/AuthSuccess';
import { setSessionCookie } from '@/lib/session';

const SLIDES = [
  {
    headline: 'A smarter way to grow your brand with AI-powered marketing.',
    sub: 'Generate campaigns, captions, and content plans in seconds — not hours.',
    stats: [
      { label: 'Time saved', value: '8h', unit: '/ week', color: 'text-emerald-400', icon: Clock },
      { label: 'ROAS boost', value: '3.2x', unit: 'avg.', color: 'text-blue-400', icon: TrendingUp },
    ],
  },
  {
    headline: 'Turn trends into campaigns before your competitors even notice.',
    sub: 'Our Trend Engine monitors cultural moments and generates topical content automatically.',
    stats: [
      { label: 'Faster campaigns', value: '10x', unit: 'speed', color: 'text-purple-400', icon: Zap },
      { label: 'Engagement lift', value: '+42%', unit: 'avg.', color: 'text-emerald-400', icon: TrendingUp },
    ],
  },
  {
    headline: "AI that writes, schedules, and optimizes — so you don't have to.",
    sub: 'From captions to full weekly content calendars, Brand Matic handles the heavy lifting.',
    stats: [
      { label: 'Posts scheduled', value: '500+', unit: '/ month', color: 'text-amber-400', icon: Target },
      { label: 'Cost reduction', value: '70%', unit: 'lower', color: 'text-blue-400', icon: Zap },
    ],
  },
  {
    headline: 'Every campaign optimized. Every rupee spent smarter.',
    sub: 'Continuous A/B testing powered by machine learning finds the combinations that convert.',
    stats: [
      { label: 'Avg. CTR', value: '4.8%', unit: 'platform', color: 'text-emerald-400', icon: Target },
      { label: 'Ad spend saved', value: '₹2L', unit: '/ month', color: 'text-blue-400', icon: TrendingUp },
    ],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [slide, setSlide] = useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const [showSuccess, setShowSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!form.email) { setError('Enter your email address first.'); return; }
    setResetLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetSent(true);
    } catch (err: any) {
      setError('Could not send reset email. Check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setSessionCookie();
      setShowSuccess(true);
      setTimeout(() => router.push('/home'), 1800);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Sign in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#111] border border-white/[0.1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-600";

  return (
    <div className="h-screen bg-black flex font-sans overflow-hidden">
      <AnimatePresence>{showSuccess && <AuthSuccess message="Welcome back! Loading your workspace..." />}</AnimatePresence>

      {/* Left panel */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col px-8 sm:px-12 py-6 shrink-0 relative z-10 h-full">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group w-fit mb-6">
          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Brand Matic</span>
        </Link>

        {/* Form — centered vertically */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
            <p className="text-sm text-neutral-500 mb-6">Welcome back — let's pick up where you left off.</p>

            {/* Demo hint */}
            <div className="mb-5 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-start gap-2.5">
              <Sparkles size={13} className="text-neutral-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-400 leading-relaxed">
                Demo: <span className="text-white font-medium">demo@brandmatic.ai</span> / <span className="text-white font-medium">demo1234</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputClass} placeholder="Enter your email" />
                </div>
              </div>

                <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                  <button type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-xs text-neutral-500 hover:text-white transition-colors font-semibold disabled:opacity-50">
                    {resetLoading ? 'Sending...' : resetSent ? '✓ Email sent!' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pr-10`} placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <AlertCircle size={13} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={14} /></>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer — pinned to bottom */}
        <p className="text-xs text-neutral-600">
          Don't have an account?{' '}
          <Link href="/onboarding" className="text-white hover:text-neutral-300 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Right panel — content top-center */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          <AnimatePresence>
            <motion.div key={slide}
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(59,130,246,0.09),transparent)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={`${i * 10}%`} y1="0" x2={`${i * 10 + 50}%`} y2="100%" stroke="white" strokeWidth="0.5" />
            ))}
          </svg>
        </div>

        {/* Content — top-center */}
        <div className="relative z-10 flex flex-col items-center justify-start pt-16 px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={slide} className="text-center max-w-sm"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <p className="text-2xl xl:text-3xl font-bold text-white leading-snug mb-3">
                {SLIDES[slide].headline}
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {SLIDES[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Stat cards */}
          <div className="flex gap-4 mt-10">
            <AnimatePresence mode="wait">
              <motion.div key={`a-${slide}`}
                className="bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-44"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}>
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(SLIDES[slide].stats[0].icon, { size: 13, className: SLIDES[slide].stats[0].color })}
                  <p className="text-[10px] text-neutral-500">{SLIDES[slide].stats[0].label}</p>
                </div>
                <p className="text-xl font-black text-white">
                  {SLIDES[slide].stats[0].value}{' '}
                  <span className="text-xs font-semibold text-neutral-400">{SLIDES[slide].stats[0].unit}</span>
                </p>
                <p className={`text-[9px] font-semibold mt-1 ${SLIDES[slide].stats[0].color}`}>verified metric</p>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div key={`b-${slide}`}
                className="bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-44"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, delay: 0.1 }}>
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(SLIDES[slide].stats[1].icon, { size: 13, className: SLIDES[slide].stats[1].color })}
                  <p className="text-[10px] text-neutral-500">{SLIDES[slide].stats[1].label}</p>
                </div>
                <p className="text-xl font-black text-white">{SLIDES[slide].stats[1].value}</p>
                <p className={`text-[9px] font-semibold mt-1 ${SLIDES[slide].stats[1].color}`}>{SLIDES[slide].stats[1].unit}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators — below cards */}
          <div className="flex items-center gap-3 mt-8">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-px rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

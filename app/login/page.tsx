"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, TrendingUp, Zap, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    headline: 'AI that writes, schedules, and optimizes — so you don\'t have to.',
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
      { label: 'Ad spend saved', value: '$2.4K', unit: '/ month', color: 'text-blue-400', icon: TrendingUp },
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

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (form.email === 'demo@brandmatic.ai' && form.password === 'demo1234') {
      router.push('/home');
    } else if (form.email && form.password.length >= 6) {
      router.push('/home');
    } else {
      setError('Password must be at least 6 characters.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#111] border border-white/[0.1] rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-600";

  return (
    <div className="min-h-screen bg-black flex font-sans">

      {/* ── Left panel: form ── */}
      <div className="w-full lg:w-[420px] xl:w-[480px] flex flex-col px-8 sm:px-12 py-10 shrink-0 relative z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Brand Matic</span>
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div
          className="flex-1 flex flex-col justify-center max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">Sign In</h1>
          <p className="text-sm text-neutral-500 mb-8">Welcome back — let's pick up where you left off.</p>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-start gap-2.5">
            <Sparkles size={13} className="text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Demo: <span className="text-white font-medium">demo@brandmatic.ai</span> / <span className="text-white font-medium">demo1234</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={15} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-wider font-semibold">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={13} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-xs text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Don't have an account?{' '}
          <Link href="/onboarding" className="text-white hover:text-neutral-300 font-semibold transition-colors">
            Sign up
          </Link>
        </motion.p>
      </div>

      {/* ── Right panel: slideshow ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          <AnimatePresence>
            <motion.div
              key={slide}
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_60%_40%,rgba(59,130,246,0.08),transparent)]"
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

        {/* Floating stat cards — update with slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-a-${slide}`}
            className="absolute top-[22%] right-12 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-52"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(SLIDES[slide].stats[0].icon, { size: 14, className: SLIDES[slide].stats[0].color })}
              <p className="text-xs text-neutral-500">{SLIDES[slide].stats[0].label}</p>
            </div>
            <p className="text-2xl font-black text-white">
              {SLIDES[slide].stats[0].value}{' '}
              <span className="text-sm font-semibold text-neutral-400">{SLIDES[slide].stats[0].unit}</span>
            </p>
            <p className={`text-[10px] font-semibold mt-1 ${SLIDES[slide].stats[0].color}`}>↑ verified metric</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`card-b-${slide}`}
            className="absolute top-[48%] right-20 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-48"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(SLIDES[slide].stats[1].icon, { size: 14, className: SLIDES[slide].stats[1].color })}
              <p className="text-xs text-neutral-500">{SLIDES[slide].stats[1].label}</p>
            </div>
            <p className="text-2xl font-black text-white">{SLIDES[slide].stats[1].value}</p>
            <p className={`text-[10px] font-semibold mt-1 ${SLIDES[slide].stats[1].color}`}>{SLIDES[slide].stats[1].unit}</p>
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative z-10 flex flex-col justify-end p-12 pb-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-2xl xl:text-3xl font-bold text-white leading-snug max-w-md mb-4">
                {SLIDES[slide].headline}
              </p>
              <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                {SLIDES[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators + manual nav */}
          <div className="flex items-center gap-3 mt-8">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-px rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

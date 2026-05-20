"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    // Simulate auth check — replace with real auth later
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock credential check
    if (form.email === 'demo@brandmatic.ai' && form.password === 'demo1234') {
      router.push('/home');
    } else if (form.email && form.password.length >= 6) {
      // Accept any valid-looking credentials for demo
      router.push('/home');
    } else {
      setError('Password must be at least 6 characters.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/[0.2] focus:border-white/[0.2] transition-all placeholder:text-neutral-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 font-sans selection:bg-white/10">
      
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none bg-black">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <Link href="/" className="flex items-center gap-2 mb-10 z-10 group">
          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Brand Matic</span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full max-w-sm z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-neutral-500">Sign in to your Brand Matic account</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-xl bg-[#111] border border-white/[0.06] flex items-start gap-2.5">
            <Sparkles size={14} className="text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Demo: <span className="text-white font-medium">demo@brandmatic.ai</span> / <span className="text-white font-medium">demo1234</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-neutral-500 hover:text-white transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-white hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-700 rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-600 mt-6">
            Don't have an account?{' '}
            <Link href="/onboarding" className="text-white hover:text-neutral-300 font-semibold transition-colors">
              Get started free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

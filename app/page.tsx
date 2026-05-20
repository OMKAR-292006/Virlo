"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles, CalendarDays, TrendingUp, Megaphone,
  Zap, TrendingDown, Clock, Menu, ArrowUpRight,
  X, Lock,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

const ease = [0.4, 0, 0.2, 1] as const;

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScaleUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function DemoModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'analytics'>('dashboard');
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Sparkles },
    { id: 'planner' as const, label: 'AI Planner', icon: CalendarDays },
    { id: 'analytics' as const, label: 'Analytics', icon: Zap },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col h-[85vh] max-h-[640px]"
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-white" />
            <span className="text-sm font-semibold text-white">Brand Matic Live Platform Preview</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>
        <div className="flex border-b border-white/[0.08] bg-[#050505] p-2 gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${active ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-hidden relative bg-black p-6">
          <div className="h-full w-full opacity-60 pointer-events-none select-none overflow-y-auto pb-20">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <div className="h-5 w-40 bg-neutral-800 rounded-md mb-2" />
                    <div className="h-3.5 w-60 bg-neutral-900 rounded-md" />
                  </div>
                  <div className="h-8 w-32 bg-neutral-800 rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-white/[0.06] bg-[#0a0a0a] p-4 rounded-xl space-y-3">
                      <div className="h-3 w-16 bg-neutral-800 rounded" />
                      <div className="h-6 w-24 bg-neutral-700 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'planner' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                  <div className="h-5 w-48 bg-neutral-800 rounded-md" />
                  <div className="h-8 w-24 bg-neutral-800 rounded-lg" />
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                    <div key={i} className="border border-white/[0.06] bg-[#0a0a0a] p-3 rounded-xl min-h-[160px] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">{d}</span>
                        <div className="h-2.5 w-full bg-neutral-800 rounded mt-2" />
                        <div className="h-2 w-4/5 bg-neutral-900 rounded mt-1" />
                      </div>
                      <div className="h-4 w-12 bg-neutral-900 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="border border-white/[0.06] bg-[#0a0a0a] p-3 rounded-xl space-y-2">
                      <div className="h-3 w-12 bg-neutral-800 rounded" />
                      <div className="h-5 w-16 bg-neutral-700 rounded" />
                    </div>
                  ))}
                </div>
                <div className="border border-white/[0.06] bg-[#0a0a0a] rounded-xl p-6 h-48 flex items-end gap-2">
                  {[40, 60, 45, 90, 75, 50, 80, 65, 95, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-neutral-800 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-full bg-white/5 border border-white/[0.08] mb-4">
              <Lock size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Access Gated Preview</h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
              Log in to view live metric streams, generate unlimited campaigns, and query the Trend Engine.
            </p>
            <div className="flex gap-3">
              <Link href="/login">
                <button className="px-6 py-2.5 text-xs font-semibold bg-white text-black rounded-xl hover:bg-neutral-100 transition-colors">
                  Log in for Full Details
                </button>
              </Link>
              <Link href="/onboarding">
                <button className="px-6 py-2.5 text-xs font-semibold bg-[#111] border border-white/[0.08] hover:border-white/[0.18] text-white rounded-xl transition-colors">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const rawY = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 1.1]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);
  const heroBgScale = useTransform(heroScroll, [0, 1], [1, 1.2]);

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans selection:bg-white/10 antialiased overflow-x-hidden">
      <AnimatePresence>{showDemo && <DemoModal onClose={() => setShowDemo(false)} />}</AnimatePresence>

      <motion.div className="fixed inset-0 pointer-events-none -z-10 bg-black" style={{ scale: heroBgScale }}>
        <div className="absolute top-0 left-0 right-0 h-[700px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.11),transparent)]" />
      </motion.div>

      <motion.nav
        className="fixed top-0 w-full z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Brand Matic</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-4 py-1.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
          <button className="md:hidden p-2 text-neutral-400 hover:text-white"><Menu size={22} /></button>
        </div>
      </motion.nav>

      <main className="relative z-10 pt-20">
        <motion.section
          ref={heroRef}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16 relative"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-7 text-white"
            style={{ scale: heroScale }}
          >
            {['AI-Powered', 'Marketing'].map((word, i) => (
              <motion.span key={i} className="inline-block mr-4"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              className="text-neutral-400 inline-block"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease }}
            >
              Operating System
            </motion.span>
          </motion.h1>

          <motion.p
            className="max-w-xl mx-auto text-base md:text-lg text-neutral-500 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease }}
          >
            AI generates content, campaigns, captions, ads, and automates growth for businesses.
            Stop doing manual work. Start scaling with intelligence.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-full bg-white text-black font-semibold text-sm"
              >
                Get Started Free
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setShowDemo(true)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-full border border-white/[0.12] bg-white/[0.04] text-white font-semibold text-sm hover:bg-white/[0.08] transition-colors"
            >
              View Demo
            </motion.button>
          </motion.div>
        </motion.section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ScaleUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
              {[
                { icon: Zap, stat: '10x', label: 'Faster Campaign Creation' },
                { icon: TrendingDown, stat: '70%', label: 'Lower Marketing Costs' },
                { icon: Clock, stat: '24/7', label: 'AI Automation' },
              ].map(({ icon: Icon, stat, label }, i) => (
                <motion.div key={i}
                  className="flex flex-col items-center justify-center space-y-3 py-12 bg-[#080808] cursor-default"
                  whileHover={{ backgroundColor: '#0f0f0f', scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="p-2.5 rounded-xl bg-[#111] border border-white/[0.08]"
                    whileHover={{ rotate: 8, scale: 1.15 }} transition={{ duration: 0.25 }}
                  >
                    <Icon size={20} className="text-neutral-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white">{stat}</h3>
                  <p className="text-neutral-500 text-sm font-medium">{label}</p>
                </motion.div>
              ))}
            </div>
          </ScaleUp>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <FadeUp className="text-center mb-10">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest mb-4">Platform</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to grow</h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm leading-relaxed">
              Our operating system replaces your entire marketing stack with a single, intelligent platform.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: CalendarDays, title: 'AI Content Planner', desc: 'Automatically schedule and generate high-converting content across all your social channels for the entire month in minutes.', href: '/content-planner' },
              { icon: TrendingUp, title: 'Festival & Trend Engine', desc: 'Never miss a cultural moment. Our AI predicts viral trends and generates topical campaigns for your brand automatically.', href: '/trend-engine' },
              { icon: Megaphone, title: 'Ad Optimization', desc: 'Continuous A/B testing powered by machine learning. Let the AI find the perfect copy and creative combinations that convert.', href: '/analytics' },
            ].map(({ icon: Icon, title, desc, href }, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <Link href={href}>
                  <motion.div
                    className="group h-full p-8 rounded-3xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    whileHover={{ scale: 1.03, y: -5, borderColor: 'rgba(255,255,255,0.18)' }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <motion.div
                      className="w-11 h-11 rounded-xl bg-[#111] border border-white/[0.08] flex items-center justify-center mb-6"
                      whileHover={{ rotate: -6, scale: 1.1 }} transition={{ duration: 0.25 }}
                    >
                      <Icon size={22} className="text-neutral-400 group-hover:text-neutral-200 transition-colors" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                    <p className="text-neutral-500 leading-relaxed text-sm">{desc}</p>
                    <div className="mt-6 flex items-center gap-1 text-neutral-600 group-hover:text-neutral-300 transition-colors text-xs font-semibold">
                      Learn more <ArrowUpRight size={14} />
                    </div>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>

        <FadeUp>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <motion.div
              className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-12 text-center overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
              whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.14)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to grow smarter?</h2>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm">
                Join thousands of businesses already automating their marketing with Brand Matic AI.
              </p>
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition-colors"
                >
                  Start for free
                </motion.button>
              </Link>
            </motion.div>
          </section>
        </FadeUp>
      </main>

      <motion.footer
        className="border-t border-white/[0.06] bg-black py-10 relative z-10"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10"><Sparkles size={16} className="text-white" /></div>
            <span className="font-semibold text-white">Brand Matic</span>
          </div>
          <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Brand Matic Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
              { label: 'GitHub', path: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' },
            ].map(({ label, path }) => (
              <Link key={label} href="#" className="text-neutral-600 hover:text-neutral-300 transition-colors">
                <span className="sr-only">{label}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

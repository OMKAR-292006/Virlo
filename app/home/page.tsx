"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, CalendarDays, Megaphone, BarChart2,
  ArrowUpRight, Clock, Target, Zap, ChevronRight, Bell,
  User, CheckCircle2, Circle, Plus, RefreshCcw, Flame,
} from 'lucide-react';
import AppSidebar from '@/components/ui/AppSidebar';
import { mockCalendar, mockCampaigns, performanceData } from '@/lib/mock-data';
import { EngagementAreaChart } from '@/components/charts/EngagementAreaChart';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ── Simulated user profile (would come from auth/onboarding in production) ──
const USER = {
  name: 'Omkar',
  business: 'Brand Matic',
  industry: 'E-commerce',
  tone: 'Modern & Bold',
  goals: ['Increase sales', 'Brand awareness'],
  avatar: null,
};

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening';

// ── Quick action cards ──────────────────────────────────────────────────────
const quickActions = [
  { icon: Megaphone, label: 'Generate Caption', desc: 'AI-powered captions for any platform', href: '/caption-generator', color: 'bg-red-500/10 text-red-500', border: 'border-red-500/20' },
  { icon: CalendarDays, label: 'Plan Content', desc: 'Schedule your week in minutes', href: '/content-planner', color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20' },
  { icon: TrendingUp, label: 'Trend Engine', desc: 'Catch the next viral moment', href: '/trend-engine', color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20' },
  { icon: BarChart2, label: 'Analytics', desc: 'Deep-dive into your performance', href: '/analytics', color: 'bg-emerald-500/10 text-emerald-500', border: 'border-emerald-500/20' },
];

// ── Daily tasks ─────────────────────────────────────────────────────────────
const initialTasks = [
  { id: 1, label: 'Review AI-generated content plan', done: false },
  { id: 2, label: 'Approve 3 scheduled posts', done: false },
  { id: 3, label: 'Check campaign ROAS', done: true },
  { id: 4, label: 'Generate festival campaign', done: false },
];

// ── KPI strip ───────────────────────────────────────────────────────────────
const kpis = [
  { label: 'Engagement', value: '2.4M', change: '+12.5%', up: true, icon: Flame },
  { label: 'CTR', value: '4.8%', change: '+1.2%', up: true, icon: Target },
  { label: 'ROAS', value: '3.2x', change: '+0.4x', up: true, icon: Zap },
  { label: 'Followers', value: '12.4K', change: '+24%', up: true, icon: TrendingUp },
];

const ease = [0.4, 0, 0.2, 1] as const;

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay }}>
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [aiTip, setAiTip] = useState(0);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [notifCount, setNotifCount] = useState(3);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{ businessName?: string; industry?: string } | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load Firestore profile
  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, 'profiles', user.uid)).then(snap => {
        if (snap.exists()) setProfile(snap.data() as any);
      });
    }
  }, [user]);

  const displayName = profile?.businessName || user?.displayName || USER.name;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const tips = [
    `Your audience is most active on Thursdays 6–8 PM. Schedule your best content then.`,
    `${USER.industry} brands see 3x more engagement with video content. Try a Reel this week.`,
    `Your ROAS is above average. Consider increasing budget on your top campaign by 20%.`,
    `Diwali is in 14 days — start your festival campaign now for maximum reach.`,
  ];

  useEffect(() => {
    const t = setInterval(() => setAiTip(i => (i + 1) % tips.length), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleTask = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-5 lg:px-8 bg-[#050505] text-white border-b border-white/[0.08] shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <rect width="22" height="2" rx="1" fill="currentColor"/>
                <rect y="7" width="22" height="2" rx="1" fill="currentColor"/>
                <rect y="14" width="22" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <span className="text-white font-bold text-lg tracking-tight">Home</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <Bell size={18} />
                {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Notifications</span>
                      {notifCount > 0 && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{notifCount} new</span>}
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                      {[
                        { icon: '🚀', title: 'Campaign live', desc: 'Summer Sale 2024 is now running.', time: '2m ago' },
                        { icon: '📈', title: 'ROAS spike', desc: 'Instagram Ads ROAS jumped to 4.1x.', time: '1h ago' },
                        { icon: '🤖', title: 'AI plan ready', desc: 'Your weekly content plan is generated.', time: '3h ago' },
                      ].map((n, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer">
                          <span className="text-lg mt-0.5">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{n.desc}</p>
                          </div>
                          <span className="text-[10px] text-neutral-600 shrink-0">{n.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-white/[0.08]">
                      <button
                        onClick={() => { setNotifCount(0); setNotifOpen(false); }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Greeting */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {GREETING}, {displayName} 👋
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Here's what's happening with <span className="font-semibold text-slate-700">{profile?.businessName || USER.business}</span> today.
                </p>
              </div>
              <Link href="/caption-generator">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 bg-[#050505] hover:bg-neutral-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Sparkles size={15} /> Create Content
                </motion.button>
              </Link>
            </div>
          </FadeUp>

          {/* KPI strip */}
          <FadeUp delay={0.05}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {kpis.map((k, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm cursor-default"
                >
                  <div className="flex items-center justify-between mb-2">
                    <k.icon size={16} className="text-slate-400" />
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${k.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {k.change}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{k.value}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{k.label}</p>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: chart + quick actions */}
            <div className="lg:col-span-2 space-y-5">

              {/* Performance chart */}
              <FadeUp delay={0.1}>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Performance This Week</h2>
                    <Link href="/analytics" className="text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1 transition-colors">
                      Full report <ArrowUpRight size={12} />
                    </Link>
                  </div>
                  <EngagementAreaChart data={performanceData} light={true} />
                </div>
              </FadeUp>

              {/* Quick actions */}
              <FadeUp delay={0.15}>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((a, i) => (
                      <Link key={i} href={a.href}>
                        <motion.div
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 rounded-2xl border ${a.border} bg-white hover:shadow-md transition-shadow cursor-pointer`}
                        >
                          <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center mb-3`}>
                            <a.icon size={18} />
                          </div>
                          <p className="text-sm font-bold text-slate-800">{a.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{a.desc}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Right: AI tip + tasks + calendar */}
            <div className="space-y-5">

              {/* AI Insight */}
              <FadeUp delay={0.12}>
                <div className="bg-[#050505] border border-white/[0.08] rounded-3xl p-5 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Insight</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={aiTip}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="text-sm text-neutral-300 leading-relaxed"
                    >
                      {tips[aiTip]}
                    </motion.p>
                  </AnimatePresence>
                  <div className="flex gap-1 mt-4">
                    {tips.map((_, i) => (
                      <button key={i} onClick={() => setAiTip(i)}
                        className={`h-1 rounded-full transition-all ${i === aiTip ? 'w-6 bg-white' : 'w-2 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Daily tasks */}
              <FadeUp delay={0.18}>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Tasks</h2>
                    <span className="text-[11px] font-bold text-slate-400">{completedCount}/{tasks.length} done</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      animate={{ width: tasks.length ? `${(completedCount / tasks.length) * 100}%` : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <motion.button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <motion.div animate={{ scale: task.done ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.2 }}>
                          {task.done
                            ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            : <Circle size={16} className="text-slate-300 shrink-0" />}
                        </motion.div>
                        <span className={`flex-1 text-xs font-semibold transition-colors ${task.done ? 'line-through text-slate-300' : 'text-slate-700'}`}>
                          {task.label}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); setTasks(prev => prev.filter(t => t.id !== task.id)); }}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </motion.button>
                    ))}
                  </div>

                  {/* Add task inline input */}
                  <AnimatePresence>
                    {addingTask ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <input
                          autoFocus
                          value={newTaskLabel}
                          onChange={e => setNewTaskLabel(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newTaskLabel.trim()) {
                              setTasks(prev => [...prev, { id: Date.now(), label: newTaskLabel.trim(), done: false }]);
                              setNewTaskLabel('');
                              setAddingTask(false);
                            }
                            if (e.key === 'Escape') { setAddingTask(false); setNewTaskLabel(''); }
                          }}
                          onBlur={() => {
                            if (newTaskLabel.trim()) {
                              setTasks(prev => [...prev, { id: Date.now(), label: newTaskLabel.trim(), done: false }]);
                            }
                            setNewTaskLabel('');
                            setAddingTask(false);
                          }}
                          placeholder="Task name… press Enter to add"
                          className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-400 placeholder:text-slate-300 transition-colors"
                        />
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => setAddingTask(true)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors py-1.5 rounded-xl hover:bg-slate-50"
                      >
                        <Plus size={13} /> Add task
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>

              {/* Upcoming posts */}
              <FadeUp delay={0.22}>
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upcoming Posts</h2>
                    <Link href="/content-planner" className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors">View all</Link>
                  </div>
                  <div className="space-y-2">
                    {mockCalendar.slice(0, 4).map((item, i) => (
                      <Link key={i} href="/content-planner">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-[#faf8f6] border border-slate-200 shrink-0">
                            <span className="text-[10px] font-black text-slate-700">{item.day}</span>
                            <Clock size={9} className="text-slate-400 mt-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{item.type} · {item.time}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0
                            ${item.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-600' : ''}
                            ${item.status === 'Draft' ? 'bg-slate-100 text-slate-500' : ''}
                            ${item.status === 'AI Generating' ? 'bg-blue-50 text-blue-600' : ''}
                          `}>
                            {item.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* Recent campaigns */}
          <FadeUp delay={0.25}>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Campaigns</h2>
                <Link href="/analytics" className="text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1 transition-colors">
                  All campaigns <ChevronRight size={12} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-[#faf8f6] border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 font-bold rounded-tl-xl">Campaign</th>
                      <th className="px-4 py-2.5 font-bold">Platform</th>
                      <th className="px-4 py-2.5 font-bold">Spend</th>
                      <th className="px-4 py-2.5 font-bold">ROAS</th>
                      <th className="px-4 py-2.5 font-bold rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCampaigns.map((c, i) => (
                      <Link key={i} href="/analytics">
                        <tr className="border-b border-slate-50 hover:bg-[#faf8f6] transition-colors cursor-pointer">
                          <td className="px-4 py-3 font-bold text-slate-800">{c.name}</td>
                          <td className="px-4 py-3 text-slate-500 font-medium">{c.platform}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{c.spend}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-[#faf8f6] border border-slate-200 rounded-md text-xs font-bold text-slate-700">{c.roas}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold
                              ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : ''}
                              ${c.status === 'Completed' ? 'bg-slate-100 text-slate-500' : ''}
                              ${c.status === 'Paused' ? 'bg-amber-50 text-amber-600' : ''}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full
                                ${c.status === 'Active' ? 'bg-emerald-500' : ''}
                                ${c.status === 'Completed' ? 'bg-slate-400' : ''}
                                ${c.status === 'Paused' ? 'bg-amber-500' : ''}
                              `} />
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      </Link>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeUp>

        </div>
      </main>
    </div>
  );
}

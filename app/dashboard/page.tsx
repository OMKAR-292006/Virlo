"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  CalendarDays, 
  TrendingUp, 
  MousePointerClick, 
  IndianRupee, 
  Users, 
  Sparkles, 
  Clock, 
  Target,
  Menu,
  ChevronRight
} from 'lucide-react';
import { performanceData, mockCalendar, mockCampaigns } from '@/lib/mock-data';
import { KpiCard } from '@/components/ui/KpiCard';
import { EngagementAreaChart } from '@/components/charts/EngagementAreaChart';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile } from '@/lib/user-profile';
import { getCampaigns, Campaign } from '@/lib/campaigns';
import { getKpis, KpiData } from '@/lib/kpis';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const kpis = [
  { title: "Total Engagement", valueKey: 'engagement', changeKey: 'engagementChange', icon: TrendingUp, iconColorClass: "text-blue-400", iconBgClass: "bg-blue-400/10" },
  { title: "Average CTR",       valueKey: 'ctr',        changeKey: 'ctrChange',        icon: MousePointerClick, iconColorClass: "text-emerald-400", iconBgClass: "bg-emerald-400/10" },
  { title: "Overall ROAS",      valueKey: 'roas',       changeKey: 'roasChange',       icon: TrendingUp, iconColorClass: "text-purple-400", iconBgClass: "bg-purple-400/10" },
  { title: "New Followers",     valueKey: 'followers',  changeKey: 'followersChange',  icon: Users, iconColorClass: "text-amber-400", iconBgClass: "bg-amber-400/10" },
] as const;

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartRange, setChartRange] = useState('7d');
  const [profile, setProfile] = useState<{ businessName?: string; industry?: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [calendarItems, setCalendarItems] = useState<{ day: string; time: string; type: string; title: string; status: string }[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    getProfile(user.uid).then(p => { if (p) setProfile(p); }).catch(() => {});
    getCampaigns(user.uid, 10).then(setCampaigns).catch(() => {});
    getKpis(user.uid).then(setKpiData).catch(() => {});

    // Load this week's calendar
    const today = new Date();
    const dow = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    mon.setHours(0, 0, 0, 0);
    const weekKey = mon.toISOString().split('T')[0];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    getDoc(doc(db, 'calendar', user.uid, 'weeks', weekKey)).then(snap => {
      if (!snap.exists()) return;
      const days: { name: string; posts: any[] }[] = snap.data().days ?? [];
      const items = days.flatMap((d, i) =>
        d.posts
          .filter((p: any) => !p.empty && !p.isHolidayBanner && p.caption)
          .map((p: any) => ({
            day: dayNames[i],
            time: p.time || '',
            type: p.isTip ? 'Tip' : p.image ? 'Photo' : 'Post',
            title: (p.caption as string).slice(0, 40) + ((p.caption as string).length > 40 ? '...' : ''),
            status: 'Scheduled',
          }))
      );
      if (items.length > 0) setCalendarItems(items);
    }).catch(() => {});
  }, [user]);

  const businessName = profile?.businessName || user?.displayName || 'your business';
  const industry = profile?.industry || 'your industry';

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">

      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#050505] border-b border-white/[0.08] z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="text-white font-bold text-lg tracking-tight">Dashboard</span>
          </div>
        </header>

        {/* Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Analytics Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {kpis.map((kpi, i) => {
                const value = kpiData?.[kpi.valueKey] ?? '—';
                const change = kpiData?.[kpi.changeKey] ?? '—';
                const isPositive = change.startsWith('+');
                const lightIconColorClass = kpi.iconColorClass
                  .replace('text-blue-400', 'text-blue-600')
                  .replace('text-emerald-400', 'text-emerald-600')
                  .replace('text-purple-400', 'text-purple-600')
                  .replace('text-amber-400', 'text-amber-600');
                const lightIconBgClass = kpi.iconBgClass
                  .replace('bg-blue-400/10', 'bg-blue-50 border border-blue-100')
                  .replace('bg-emerald-400/10', 'bg-emerald-50 border border-emerald-100')
                  .replace('bg-purple-400/10', 'bg-purple-50 border border-purple-100')
                  .replace('bg-amber-400/10', 'bg-amber-50 border border-amber-100');
                return (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } }}
                  >
                    <KpiCard
                      title={kpi.title}
                      value={value}
                      change={change}
                      isPositive={isPositive}
                      icon={kpi.icon}
                      iconColorClass={lightIconColorClass}
                      iconBgClass={lightIconBgClass}
                      light={true}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Main Content Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              
              {/* Chart & AI Recommendations (Left/Middle Column) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Chart */}
                <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Performance Overview</h2>
                  <select
                    value={chartRange}
                    onChange={e => setChartRange(e.target.value)}
                    className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="month">This Month</option>
                  </select>
                  </div>
                  <EngagementAreaChart data={performanceData} light={true} />
                </div>

                {/* AI Recommendations Panel */}
                <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="text-slate-800" size={20} />
                      <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Recommendations</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Link href="/trend-engine">
                        <div className="p-4 rounded-2xl bg-[#faf8f6] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all shadow-sm cursor-pointer group">
                          <div className="text-slate-500 mb-2 group-hover:text-blue-500 transition-colors"><CalendarDays size={18} /></div>
                          <h4 className="text-sm font-semibold mb-1 text-slate-800">Upcoming Festival</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Plan your next festival campaign early. AI suggests starting creatives at least 14 days in advance.
                          </p>
                        </div>
                      </Link>
                      <Link href="/content-planner">
                        <div className="p-4 rounded-2xl bg-[#faf8f6] border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all shadow-sm cursor-pointer group">
                          <div className="text-slate-500 mb-2 group-hover:text-emerald-500 transition-colors"><Clock size={18} /></div>
                          <h4 className="text-sm font-semibold mb-1 text-slate-800">Best Posting Time</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Optimize your {industry} content schedule. Consistent posting boosts reach by up to 3x.
                          </p>
                        </div>
                      </Link>
                      <Link href="/analytics">
                        <div className="p-4 rounded-2xl bg-[#faf8f6] border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all shadow-sm cursor-pointer group">
                          <div className="text-slate-500 mb-2 group-hover:text-purple-500 transition-colors"><Target size={18} /></div>
                          <h4 className="text-sm font-semibold mb-1 text-slate-800">Ad Optimization</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Review your active campaigns for {businessName} and boost the top performer by 20%.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Content Calendar (Right Column) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Content Calendar</h2>
                  <Link href="/content-planner" className="text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors">View All</Link>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {(calendarItems.length > 0 ? calendarItems : mockCalendar).map((item, i) => (
                    <Link key={i} href="/content-planner">
                      <div className="group p-3 rounded-2xl border border-slate-200 bg-[#faf8f6] hover:border-slate-300 hover:bg-white transition-all cursor-pointer flex items-center gap-4 shadow-sm">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 flex-shrink-0">
                          <span className="text-xs font-bold text-slate-700">{item.day}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.time.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {item.type}
                            </span>
                            <span className={`text-[10px] font-semibold flex items-center gap-1
                              ${item.status === 'Draft' ? 'text-slate-400' : ''}
                              ${item.status === 'Scheduled' ? 'text-slate-600' : ''}
                              ${item.status === 'AI Generating' ? 'text-blue-600' : ''}
                            `}>
                              {item.status === 'AI Generating' && <Sparkles size={10} className="animate-pulse" />}
                              {item.status}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Campaigns Table */}
            <motion.div
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Campaigns</h2>
                <button
                  onClick={() => {
                    const source = campaigns.length > 0 ? campaigns : mockCampaigns;
                    const csv = [
                      'ID,Name,Platform,Type,Status',
                      ...source.map(c => `${(c as any).id ?? ''},${c.name},${c.platform},${'type' in c ? (c as any).type : ''},${c.status}`)
                    ].join('\n');
                    const a = document.createElement('a');
                    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                    a.download = 'campaigns.csv';
                    a.click();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors"
                >
                  Export <ChevronRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-[#faf8f6] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl font-bold">Campaign ID</th>
                      <th className="px-4 py-3 font-bold">Name</th>
                      <th className="px-4 py-3 font-bold">Platform</th>
                      <th className="px-4 py-3 font-bold">Spend</th>
                      <th className="px-4 py-3 font-bold">ROAS</th>
                      <th className="px-4 py-3 rounded-tr-xl font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(campaigns.length > 0 ? campaigns : mockCampaigns).map((c, i) => (
                      <Link key={i} href="/analytics">
                        <tr className="border-b border-slate-100 hover:bg-[#faf8f6] transition-colors cursor-pointer">
                          <td className="px-4 py-4 font-semibold text-slate-400">{'id' in c ? (c as any).id : `CAMP-00${i+1}`}</td>
                          <td className="px-4 py-4 font-bold text-slate-800">{c.name}</td>
                          <td className="px-4 py-4 text-slate-500 font-medium">{c.platform}</td>
                          <td className="px-4 py-4 text-slate-800 font-bold">{'spend' in c ? (c as any).spend : '—'}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f6] border border-slate-200 text-slate-800 font-bold text-xs">
                              {'roas' in c ? (c as any).roas : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#faf8f6] border border-slate-200
                              ${c.status === 'Active' ? 'text-slate-800' : ''}
                              ${c.status === 'Completed' ? 'text-slate-500' : ''}
                              ${c.status === 'Draft' ? 'text-amber-600' : ''}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full
                                ${c.status === 'Active' ? 'bg-emerald-500' : ''}
                                ${c.status === 'Completed' ? 'bg-slate-400' : ''}
                                ${c.status === 'Draft' ? 'bg-amber-400' : ''}
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
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

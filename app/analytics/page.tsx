"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, MousePointerClick, IndianRupee, Activity, Menu, Sparkles
} from 'lucide-react';
import { PIE_COLORS } from '@/lib/mock-data';
import { KpiCard } from '@/components/ui/KpiCard';
import { EngagementChart } from '@/components/charts/EngagementChart';
import { DemographicsChart } from '@/components/charts/DemographicsChart';
import { CampaignPerformanceChart } from '@/components/charts/CampaignPerformanceChart';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getKpis, KpiData } from '@/lib/kpis';
import { getCampaigns, Campaign } from '@/lib/campaigns';
import { getAnalytics, DemographicEntry } from '@/lib/analytics';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

// Derive engagement chart from calendar posts
function buildEngagementData(
  calDays: { name: string; posts: any[] }[],
  range: '7d' | '30d' | 'all'
) {
  if (range === '7d') {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((name, i) => ({
      name,
      engagement: (calDays[i]?.posts.filter((p: any) => !p.empty && !p.isHolidayBanner).length ?? 0) * 100,
      reach: (calDays[i]?.posts.filter((p: any) => !p.empty && !p.isHolidayBanner).length ?? 0) * 150,
    }));
  }
  // For wider ranges, use campaign count as a proxy per week/month
  return [];
}

// Derive campaign chart from Firestore campaigns
function buildCampaignData(campaigns: Campaign[]) {
  const byPlatform: Record<string, number> = {};
  campaigns.forEach(c => {
    byPlatform[c.platform] = (byPlatform[c.platform] ?? 0) + 1;
  });
  return Object.entries(byPlatform).map(([name, count]) => ({
    name,
    spend: count * 10000,   // placeholder spend per campaign
    revenue: count * 22000, // placeholder revenue
  }));
}

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [demographics, setDemographics] = useState<DemographicEntry[]>([]);
  const [engagementData, setEngagementData] = useState<{ name: string; engagement: number; reach: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    Promise.all([
      getKpis(user.uid),
      getCampaigns(user.uid, 50),
      getAnalytics(user.uid),
    ]).then(([kpis, camps, analyticsData]) => {
      setKpiData(kpis);
      setCampaigns(camps);
      setDemographics(analyticsData.demographics);
    }).catch(() => {}).finally(() => setLoading(false));

    // Load this week's calendar for engagement chart
    const today = new Date();
    const dow = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    mon.setHours(0, 0, 0, 0);
    const weekKey = mon.toISOString().split('T')[0];

    getDoc(doc(db, 'calendar', user.uid, 'weeks', weekKey)).then(snap => {
      if (!snap.exists()) return;
      const days = snap.data().days ?? [];
      setEngagementData(buildEngagementData(days, '7d'));
    }).catch(() => {});
  }, [user]);

  const campaignChartData = buildCampaignData(campaigns);

  const kpis = [
    { title: "Click-Through Rate",  value: kpiData?.ctr        ?? '—', change: kpiData?.ctrChange        ?? '—', isPositive: (kpiData?.ctrChange ?? '').startsWith('+'),        icon: MousePointerClick, iconColorClass: "text-blue-500",    iconBgClass: "bg-blue-50"    },
    { title: "ROAS",                value: kpiData?.roas       ?? '—', change: kpiData?.roasChange       ?? '—', isPositive: (kpiData?.roasChange ?? '').startsWith('+'),       icon: TrendingUp,        iconColorClass: "text-purple-500",  iconBgClass: "bg-purple-50"  },
    { title: "Engagement",          value: kpiData?.engagement ?? '—', change: kpiData?.engagementChange ?? '—', isPositive: (kpiData?.engagementChange ?? '').startsWith('+'), icon: Activity,          iconColorClass: "text-orange-500",  iconBgClass: "bg-orange-50"  },
    { title: "Followers",           value: kpiData?.followers  ?? '—', change: kpiData?.followersChange  ?? '—', isPositive: (kpiData?.followersChange ?? '').startsWith('+'),  icon: Users,             iconColorClass: "text-pink-500",    iconBgClass: "bg-pink-50"    },
    { title: "Campaigns",           value: String(campaigns.length || '—'), change: campaigns.length > 0 ? `${campaigns.length} total` : '—', isPositive: true, icon: TrendingUp, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
  ];

  const hasDemographicData = demographics.some(d => d.value > 0);
  const hasCampaignData = campaignChartData.length > 0;
  const hasEngagementData = engagementData.some(d => d.engagement > 0);

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden relative">
        <header className="h-16 bg-[#050505] border-b border-white/[0.08] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-neutral-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <span className="text-white font-bold text-lg tracking-tight">Analytics</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-4">

            {/* Time range selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                {(['7d', '30d', 'all'] as const).map(r => (
                  <button key={r} onClick={() => setTimeRange(r)}
                    className={`px-4 py-1 text-xs transition-all duration-200 rounded-lg ${timeRange === r ? 'font-bold text-slate-800 bg-[#faf8f6] border border-slate-200 shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-800'}`}>
                    {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
                  </button>
                ))}
              </div>
              {!loading && kpiData?.ctr === '—' && (
                <Link href="/settings" className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1">
                  <Sparkles size={11} /> Set your KPIs in Settings
                </Link>
              )}
            </div>

            {/* KPI Cards */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {kpis.map((kpi, i) => (
                <motion.div key={`${timeRange}-${i}`}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } } }}>
                  <KpiCard {...kpi} light={true} />
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Grid */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>

              <div className="lg:col-span-2">
                {hasEngagementData ? (
                  <EngagementChart data={engagementData} light={true} />
                ) : (
                  <EmptyChart title="Engagement & Reach" hint="Schedule posts in the Content Planner to see data here." href="/content-planner" />
                )}
              </div>

              <div>
                {hasDemographicData ? (
                  <DemographicsChart data={demographics} colors={PIE_COLORS} light={true} />
                ) : (
                  <EmptyChart title="Audience Demographics" hint="Add demographic data in Settings → Analytics." href="/settings" />
                )}
              </div>

              <div className="lg:col-span-3">
                {hasCampaignData ? (
                  <CampaignPerformanceChart data={campaignChartData} light={true} />
                ) : (
                  <EmptyChart title="Campaign Performance" hint="Generate campaigns to see performance data here." href="/caption-generator" />
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyChart({ title, hint, href }: { title: string; hint: string; href: string }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[200px]">
      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed mb-3">{hint}</p>
      <Link href={href} className="text-xs text-blue-500 font-bold hover:underline">Get started →</Link>
    </div>
  );
}

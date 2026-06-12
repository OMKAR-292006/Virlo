"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Users, MousePointerClick, IndianRupee,
  Menu
} from 'lucide-react';
import { PIE_COLORS } from '@/lib/mock-data';
import { KpiCard } from '@/components/ui/KpiCard';
import { EngagementChart } from '@/components/charts/EngagementChart';
import { DemographicsChart } from '@/components/charts/DemographicsChart';
import { CampaignPerformanceChart } from '@/components/charts/CampaignPerformanceChart';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';

const dataSets = {
  '7d': {
    kpis: [
      { title: "Click-Through Rate", value: "4.8%", change: "+1.2%", isPositive: true, icon: MousePointerClick, iconColorClass: "text-blue-500", iconBgClass: "bg-blue-50" },
      { title: "Cost Per Click", value: "₹70", change: "-₹10", isPositive: true, icon: IndianRupee, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
      { title: "ROAS", value: "3.2x", change: "+0.4x", isPositive: true, icon: TrendingUp, iconColorClass: "text-purple-500", iconBgClass: "bg-purple-50" },
      { title: "New Followers", value: "12,490", change: "+2,100", isPositive: true, icon: Users, iconColorClass: "text-pink-500", iconBgClass: "bg-pink-50" },
      { title: "Engagement Rate", value: "8.4%", change: "-0.5%", isPositive: false, icon: Activity, iconColorClass: "text-orange-500", iconBgClass: "bg-orange-50" },
    ],
    performanceData: [
      { name: 'Mon', engagement: 4000, reach: 2400 },
      { name: 'Tue', engagement: 3000, reach: 1398 },
      { name: 'Wed', engagement: 2000, reach: 9800 },
      { name: 'Thu', engagement: 2780, reach: 3908 },
      { name: 'Fri', engagement: 1890, reach: 4800 },
      { name: 'Sat', engagement: 2390, reach: 3800 },
      { name: 'Sun', engagement: 3490, reach: 4300 },
    ],
    campaignData: [
      { name: 'Instagram Ads', spend: 332000, revenue: 697200 },
      { name: 'Google Search', spend: 249000, revenue: 614034 },
      { name: 'TikTok Influencers', spend: 166000, revenue: 481400 },
      { name: 'Email Marketing', spend: 83000, revenue: 324364 },
    ],
    demographicData: [
      { name: '18-24', value: 400 },
      { name: '25-34', value: 300 },
      { name: '35-44', value: 300 },
      { name: '45+', value: 200 },
    ]
  },
  '30d': {
    kpis: [
      { title: "Click-Through Rate", value: "5.1%", change: "+1.8%", isPositive: true, icon: MousePointerClick, iconColorClass: "text-blue-500", iconBgClass: "bg-blue-50" },
      { title: "Cost Per Click", value: "₹65", change: "-₹18", isPositive: true, icon: IndianRupee, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
      { title: "ROAS", value: "3.6x", change: "+0.8x", isPositive: true, icon: TrendingUp, iconColorClass: "text-purple-500", iconBgClass: "bg-purple-50" },
      { title: "New Followers", value: "48,290", change: "+8,400", isPositive: true, icon: Users, iconColorClass: "text-pink-500", iconBgClass: "bg-pink-50" },
      { title: "Engagement Rate", value: "9.2%", change: "+1.1%", isPositive: true, icon: Activity, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
    ],
    performanceData: [
      { name: 'Wk 1', engagement: 14000, reach: 18000 },
      { name: 'Wk 2', engagement: 18000, reach: 24000 },
      { name: 'Wk 3', engagement: 19500, reach: 31000 },
      { name: 'Wk 4', engagement: 22000, reach: 35000 },
    ],
    campaignData: [
      { name: 'Instagram Ads', spend: 1361200, revenue: 2858520 },
      { name: 'Google Search', spend: 1020900, revenue: 2517390 },
      { name: 'TikTok Influencers', spend: 680600, revenue: 1973740 },
      { name: 'Email Marketing', spend: 340300, revenue: 1329660 },
    ],
    demographicData: [
      { name: '18-24', value: 1600 },
      { name: '25-34', value: 1250 },
      { name: '35-44', value: 1100 },
      { name: '45+', value: 850 },
    ]
  },
  'all': {
    kpis: [
      { title: "Click-Through Rate", value: "5.6%", change: "+2.1%", isPositive: true, icon: MousePointerClick, iconColorClass: "text-blue-500", iconBgClass: "bg-blue-50" },
      { title: "Cost Per Click", value: "₹60", change: "-₹22", isPositive: true, icon: IndianRupee, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
      { title: "ROAS", value: "4.1x", change: "+1.2x", isPositive: true, icon: TrendingUp, iconColorClass: "text-purple-500", iconBgClass: "bg-purple-50" },
      { title: "New Followers", value: "245,800", change: "+42,000", isPositive: true, icon: Users, iconColorClass: "text-pink-500", iconBgClass: "bg-pink-50" },
      { title: "Engagement Rate", value: "10.5%", change: "+2.4%", isPositive: true, icon: Activity, iconColorClass: "text-emerald-500", iconBgClass: "bg-emerald-50" },
    ],
    performanceData: [
      { name: 'Jan', engagement: 45000, reach: 68000 },
      { name: 'Feb', engagement: 52000, reach: 74000 },
      { name: 'Mar', engagement: 61000, reach: 88000 },
      { name: 'Apr', engagement: 58000, reach: 95000 },
      { name: 'May', engagement: 72000, reach: 110000 },
      { name: 'Jun', engagement: 85000, reach: 130000 },
      { name: 'Jul', engagement: 94000, reach: 145000 },
    ],
    campaignData: [
      { name: 'Instagram Ads', spend: 8134000, revenue: 17845000 },
      { name: 'Google Search', spend: 6225000, revenue: 15355000 },
      { name: 'TikTok Influencers', spend: 4316000, revenue: 12284000 },
      { name: 'Email Marketing', spend: 2324000, revenue: 7885000 },
    ],
    demographicData: [
      { name: '18-24', value: 8200 },
      { name: '25-34', value: 6800 },
      { name: '35-44', value: 5900 },
      { name: '45+', value: 4100 },
    ]
  }
};

export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const currentData = dataSets[timeRange];

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden relative">
        {/* Black header bar */}
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
            <div className="flex justify-end">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => setTimeRange('7d')}
                  className={`px-4 py-1 text-xs transition-all duration-200 rounded-lg ${timeRange === '7d' ? 'font-bold text-slate-800 bg-[#faf8f6] border border-slate-200 shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-800'}`}>
                  7 Days
                </button>
                <button onClick={() => setTimeRange('30d')}
                  className={`px-4 py-1 text-xs transition-all duration-200 rounded-lg ${timeRange === '30d' ? 'font-bold text-slate-800 bg-[#faf8f6] border border-slate-200 shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-800'}`}>
                  30 Days
                </button>
                <button onClick={() => setTimeRange('all')}
                  className={`px-4 py-1 text-xs transition-all duration-200 rounded-lg ${timeRange === 'all' ? 'font-bold text-slate-800 bg-[#faf8f6] border border-slate-200 shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-800'}`}>
                  All Time
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {currentData.kpis.map((kpi, i) => (
                <motion.div
                  key={`${timeRange}-${i}`}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } } }}
                >
                  <KpiCard {...kpi} light={true} />
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="lg:col-span-2">
                <EngagementChart data={currentData.performanceData} light={true} />
              </div>
              <div>
                <DemographicsChart data={currentData.demographicData} colors={PIE_COLORS} light={true} />
              </div>
              <div className="lg:col-span-3">
                <CampaignPerformanceChart data={currentData.campaignData} light={true} />
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}



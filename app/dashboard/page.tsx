"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  CalendarDays, 
  BarChart2, 
  Settings, 
  Bell, 
  User, 
  TrendingUp, 
  MousePointerClick, 
  DollarSign, 
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

const kpis = [
  { title: "Total Engagement", value: "2.4M", change: "+12.5%", isPositive: true, icon: TrendingUp, iconColorClass: "text-blue-400", iconBgClass: "bg-blue-400/10" },
  { title: "Average CTR", value: "4.8%", change: "+1.2%", isPositive: true, icon: MousePointerClick, iconColorClass: "text-emerald-400", iconBgClass: "bg-emerald-400/10" },
  { title: "Overall ROAS", value: "3.2x", change: "+0.4x", isPositive: true, icon: DollarSign, iconColorClass: "text-purple-400", iconBgClass: "bg-purple-400/10" },
  { title: "New Followers", value: "12.4K", change: "+24%", isPositive: true, icon: Users, iconColorClass: "text-amber-400", iconBgClass: "bg-amber-400/10" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                      {...kpi} 
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
                    <select className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Month</option>
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
                            Diwali is approaching. AI suggests starting campaign creatives 14 days in advance.
                          </p>
                        </div>
                      </Link>
                      <Link href="/content-planner">
                        <div className="p-4 rounded-2xl bg-[#faf8f6] border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all shadow-sm cursor-pointer group">
                          <div className="text-slate-500 mb-2 group-hover:text-emerald-500 transition-colors"><Clock size={18} /></div>
                          <h4 className="text-sm font-semibold mb-1 text-slate-800">Best Posting Time</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Your audience is most active on Thursdays between 6 PM - 8 PM IST.
                          </p>
                        </div>
                      </Link>
                      <Link href="/analytics">
                        <div className="p-4 rounded-2xl bg-[#faf8f6] border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all shadow-sm cursor-pointer group">
                          <div className="text-slate-500 mb-2 group-hover:text-purple-500 transition-colors"><Target size={18} /></div>
                          <h4 className="text-sm font-semibold mb-1 text-slate-800">Ad Optimization</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Increase budget on "Summer Sale 2024" by 20% to maximize current high ROAS.
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
                  {mockCalendar.map((item, i) => (
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
                    const csv = ['Campaign ID,Name,Platform,Spend,ROAS,Status',
                      ...mockCampaigns.map(c => `${c.id},${c.name},${c.platform},${c.spend},${c.roas},${c.status}`)
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
                    {mockCampaigns.map((campaign) => (
                      <Link key={campaign.id} href="/analytics">
                        <tr className="border-b border-slate-100 hover:bg-[#faf8f6] transition-colors cursor-pointer">
                          <td className="px-4 py-4 font-semibold text-slate-400">{campaign.id}</td>
                          <td className="px-4 py-4 font-bold text-slate-800">{campaign.name}</td>
                          <td className="px-4 py-4 text-slate-500 font-medium">{campaign.platform}</td>
                          <td className="px-4 py-4 text-slate-800 font-bold">{campaign.spend}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#faf8f6] border border-slate-200 text-slate-800 font-bold text-xs">
                              {campaign.roas}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#faf8f6] border border-slate-200
                              ${campaign.status === 'Active' ? 'text-slate-800' : ''}
                              ${campaign.status === 'Completed' ? 'text-slate-500' : ''}
                              ${campaign.status === 'Paused' ? 'text-slate-400' : ''}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full
                                ${campaign.status === 'Active' ? 'bg-emerald-500' : ''}
                                ${campaign.status === 'Completed' ? 'bg-slate-400' : ''}
                                ${campaign.status === 'Paused' ? 'bg-amber-500' : ''}
                              `} />
                              {campaign.status}
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

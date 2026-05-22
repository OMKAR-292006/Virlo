"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CalendarHeart, Timer, TrendingUp,
  Lightbulb, Hash, CheckCircle2, Building2, Briefcase, Menu
} from 'lucide-react';
import { FestivalResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getProfile } from '@/lib/user-profile';
import AppSidebar from '@/components/ui/AppSidebar';

const UPCOMING_FESTIVALS = [
  { id: 1, name: "Halloween", date: "2026-10-31", category: "Holiday" },
  { id: 2, name: "Black Friday", date: "2026-11-27", category: "Shopping" },
  { id: 3, name: "Cyber Monday", date: "2026-11-30", category: "Shopping" },
  { id: 4, name: "Christmas Eve", date: "2026-12-24", category: "Holiday" },
  { id: 5, name: "New Year's Eve", date: "2026-12-31", category: "Holiday" },
  { id: 6, name: "Valentine's Day", date: "2027-02-14", category: "Holiday" }
];

const inputClass = "bg-black border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-white/[0.2] outline-none w-full sm:w-48 transition-all placeholder:text-neutral-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]";

export default function TrendEngine() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');

  // Pre-fill from Firestore profile
  useEffect(() => {
    if (user?.uid) {
      getProfile(user.uid).then(p => {
        if (p) {
          setBusinessName(p.businessName || '');
          setIndustry(p.industry || '');
        }
      });
    }
  }, [user]);
  const [selectedFestival, setSelectedFestival] = useState<typeof UPCOMING_FESTIVALS[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<FestivalResponse | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<Record<number, number>>({});

  useEffect(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const remaining: Record<number, number> = {};
    UPCOMING_FESTIVALS.forEach(fest => {
      const diffTime = new Date(fest.date).getTime() - today.getTime();
      remaining[fest.id] = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });
    setDaysRemaining(remaining);
  }, []);

  const handleGenerateCampaign = async (festival: typeof UPCOMING_FESTIVALS[0]) => {
    if (!businessName || !industry) { setError("Please enter your Business Name and Industry first."); return; }
    setSelectedFestival(festival); setLoading(true); setError(null); setCampaignData(null);
    try {
      const response = await fetch('/api/generate-festival-campaign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festivalName: festival.name, businessName, industry }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate festival campaign');
      setCampaignData(data.data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden">
        {/* Black header bar */}
        <header className="h-16 bg-[#050505] border-b border-white/[0.08] shrink-0 flex items-center px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden text-neutral-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-5">

            {/* Header & Settings */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#050505] text-white">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Festival & Trend Engine</h1>
                  <p className="text-slate-500 text-xs font-semibold mt-0.5">AI-powered campaign ideas for upcoming dates</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                    className="bg-[#faf8f6] border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-slate-400 outline-none w-full sm:w-48 transition-all placeholder:text-slate-400"
                    placeholder="Business Name" />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input value={industry} onChange={e => setIndustry(e.target.value)}
                    className="bg-[#faf8f6] border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-slate-400 outline-none w-full sm:w-48 transition-all placeholder:text-slate-400"
                    placeholder="Industry" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Festival List */}
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CalendarHeart size={16} className="text-slate-500" /> Upcoming Events
                </h2>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
                  initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
                >
                  {UPCOMING_FESTIVALS.map((festival) => {
                    const days = daysRemaining[festival.id];
                    const isUrgent = days <= 14 && days > 0;
                    const isSelected = selectedFestival?.id === festival.id;
                    return (
                      <motion.div key={festival.id}
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } } }}
                        className={`relative overflow-hidden p-4 rounded-2xl transition-all duration-300 border shadow-sm
                          ${isSelected ? 'bg-[#050505] border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded mb-1.5
                              ${isSelected ? 'bg-white/10 text-neutral-400 border border-white/10' : 'bg-slate-100 text-slate-500'}`}>
                              {festival.category}
                            </span>
                            <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{festival.name}</h3>
                            <p className={`text-xs mt-0.5 ${isSelected ? 'text-neutral-500' : 'text-slate-400'}`}>
                              {new Date(festival.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className={`flex flex-col items-center justify-center p-2 rounded-xl border shrink-0
                            ${isUrgent ? 'bg-red-50 border-red-200 text-red-500' : isSelected ? 'bg-white/5 border-white/10 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Timer size={12} className="mb-0.5" />
                            <span className="text-sm font-bold leading-none">{days}</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Days</span>
                          </div>
                        </div>
                        <button onClick={() => handleGenerateCampaign(festival)} disabled={loading && isSelected}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                            ${isSelected ? 'bg-white text-black hover:bg-neutral-100' : 'bg-[#050505] text-white hover:bg-neutral-800'}`}>
                          {loading && isSelected ? (<><Sparkles className="animate-spin" size={14} /> Generating...</>) : (<><Sparkles size={14} /> Generate Campaign</>)}
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* AI Output */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl">{error}
                    </motion.div>
                  )}
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                      <div className="w-14 h-14 relative mb-5">
                        <div className="absolute inset-0 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto text-slate-400 animate-pulse" size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Analyzing Trends...</h3>
                      <p className="text-slate-500 text-sm">Crafting the perfect campaign for {selectedFestival?.name}</p>
                    </motion.div>
                  ) : campaignData ? (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <h2 className="text-xl font-extrabold text-slate-900 flex flex-wrap items-center gap-2">
                        {selectedFestival?.name}
                        <span className="text-slate-400 font-normal text-base">Campaign Strategy</span>
                      </h2>

                      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Lightbulb size={13} /> Primary Campaign Idea
                        </h3>
                        <p className="text-base text-slate-800 leading-relaxed font-medium">{campaignData.suggestedCampaign}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp size={13} /> Marketing Suggestions
                          </h3>
                          <ul className="space-y-2.5">
                            {campaignData.marketingSuggestions.map((s, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={15} />
                                <span className="text-slate-600 text-sm leading-relaxed">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Hash size={13} /> Suggested Hashtags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {campaignData.suggestedHashtags.map((tag, i) => (
                              <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-[#faf8f6] border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 transition-colors cursor-default">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 border-dashed rounded-3xl shadow-sm">
                      <div className="w-16 h-16 bg-[#faf8f6] border border-slate-200 rounded-full flex items-center justify-center mb-5">
                        <TrendingUp size={28} className="text-slate-400" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">Festival Intelligence</h2>
                      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                        Select an upcoming festival to instantly generate a targeted marketing campaign, hashtags, and growth suggestions.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

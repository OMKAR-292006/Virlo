"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CalendarHeart, Timer, TrendingUp,
  Lightbulb, Hash, CheckCircle2, Building2, Briefcase
} from 'lucide-react';
import { FestivalResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [businessName, setBusinessName] = useState('Brand Matic');
  const [industry, setIndustry] = useState('E-commerce');
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
    <div className="min-h-screen bg-black text-neutral-50 p-6 lg:p-12 font-sans selection:bg-white/10">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.07),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header & Settings */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Festival & Trend Engine</h1>
              <p className="text-neutral-500 text-sm mt-1">AI-powered campaign ideas for upcoming dates</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-3 rounded-2xl">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClass} placeholder="Business Name" />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
              <input value={industry} onChange={e => setIndustry(e.target.value)} className={inputClass} placeholder="Industry" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Festival List */}
          <div className="xl:col-span-5 space-y-4">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-neutral-300">
              <CalendarHeart size={18} /> Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              {UPCOMING_FESTIVALS.map((festival) => {
                const days = daysRemaining[festival.id];
                const isUrgent = days <= 14 && days > 0;
                const isSelected = selectedFestival?.id === festival.id;
                return (
                  <div key={festival.id} className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-300 border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] ${isSelected ? 'bg-[#0f0f0f] border-white/[0.25]' : 'bg-[#0a0a0a] border-white/[0.08] hover:border-white/[0.15]'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-2.5 py-1 bg-[#111] text-[10px] font-bold uppercase tracking-widest rounded mb-2 text-neutral-400 border border-white/[0.08]">
                          {festival.category}
                        </span>
                        <h3 className="text-base font-bold text-white">{festival.name}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{new Date(festival.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${isUrgent ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-black border-white/[0.08] text-neutral-500'}`}>
                        <Timer size={14} className="mb-1" />
                        <span className="text-base font-bold leading-none">{days}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Days</span>
                      </div>
                    </div>
                    <button onClick={() => handleGenerateCampaign(festival)} disabled={loading && isSelected} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${isSelected ? 'bg-white text-black' : 'bg-[#111] border border-white/[0.08] text-white hover:bg-[#1a1a1a]'}`}>
                      {loading && isSelected ? (<><Sparkles className="animate-spin" size={16} /> Generating...</>) : (<><Sparkles size={16} /> Generate Campaign</>)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Output */}
          <div className="xl:col-span-7">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl">{error}</motion.div>
              )}
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl border-dashed">
                  <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-neutral-400 animate-pulse" size={22} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyzing Trends...</h3>
                  <p className="text-neutral-500">Crafting the perfect campaign for {selectedFestival?.name}</p>
                </motion.div>
              ) : campaignData ? (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6 flex flex-wrap items-center gap-3">
                    <span>{selectedFestival?.name}</span>
                    <span className="text-neutral-500 font-normal text-lg">Campaign Strategy</span>
                  </h2>

                  <div className="bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 sm:p-8 rounded-3xl">
                    <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Lightbulb size={14} /> Primary Campaign Idea
                    </h3>
                    <p className="text-lg text-white leading-relaxed font-medium">{campaignData.suggestedCampaign}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 rounded-3xl">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <TrendingUp size={14} /> Marketing Suggestions
                      </h3>
                      <ul className="space-y-3">
                        {campaignData.marketingSuggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="text-white mt-0.5 shrink-0" size={16} />
                            <span className="text-neutral-300 text-sm leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 rounded-3xl">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Hash size={14} /> Suggested Hashtags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {campaignData.suggestedHashtags.map((tag, i) => (
                          <span key={i} className="text-sm font-medium px-3 py-1.5 bg-[#111] border border-white/[0.08] rounded-xl text-neutral-300 hover:border-white/[0.2] transition-colors cursor-default">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl border-dashed">
                  <div className="w-20 h-20 bg-[#111] border border-white/[0.08] rounded-full flex items-center justify-center mb-6">
                    <TrendingUp size={32} className="text-neutral-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Festival Intelligence</h2>
                  <p className="text-neutral-500 max-w-md leading-relaxed">
                    Select an upcoming festival to instantly generate a targeted marketing campaign, hashtags, and growth suggestions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

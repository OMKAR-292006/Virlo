"use client";

import React, { useState } from 'react';
import { Sparkles, Building2, Target, Briefcase, RefreshCcw, CheckCircle2, Menu } from 'lucide-react';
import { StrategyResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile } from '@/lib/user-profile';

export default function StrategyExample() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [formData, setFormData] = useState({ businessName: '', industry: '', targetAudience: '', goals: '' });

  React.useEffect(() => {
    if (user?.uid) {
      getProfile(user.uid).then(p => {
        if (p) setFormData(f => ({ ...f, businessName: p.businessName || '', industry: p.industry || '', targetAudience: p.targetAudience || '' }));
      });
    }
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null); setStrategy(null);
    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, goals: formData.goals.split(',').map(g => g.trim()).filter(Boolean) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to generate strategy');
      setStrategy(result.data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-400 transition-all placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-800 font-sans flex overflow-hidden selection:bg-black/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden">
        <header className="h-16 bg-[#050505] border-b border-white/[0.08] shrink-0 flex items-center px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden text-neutral-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="p-2.5 rounded-xl bg-[#050505] text-white"><Sparkles size={20} /></div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Strategy Generator</h1>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">Generate a full marketing strategy tailored to your business</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div className="lg:col-span-4"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.45 }}>
                <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Business</h2>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input required value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className={`${inputClass} pl-9`} placeholder="e.g. Acme Corp" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className={`${inputClass} pl-9`} placeholder="e.g. E-commerce" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Audience</label>
                    <div className="relative">
                      <Target className="absolute left-3 top-3 text-slate-400" size={14} />
                      <textarea required value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className={`${inputClass} pl-9 resize-none h-20`} placeholder="e.g. Gen Z tech enthusiasts..." />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Goals <span className="text-slate-400 normal-case font-normal">(comma separated)</span></label>
                    <input required value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} className={inputClass} placeholder="e.g. Increase sales, Brand awareness" />
                  </div>
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 bg-[#050505] hover:bg-neutral-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    {loading ? (<><RefreshCcw className="animate-spin" size={15} /> Generating...</>) : (<><Sparkles size={15} /> Generate Strategy</>)}
                  </motion.button>
                  {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">{error}</div>}
                </form>
              </motion.div>

              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {strategy ? (
                    <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Brand Tone</h3>
                        <p className="text-base text-slate-800 leading-relaxed font-medium">{strategy.brandTone}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Content Pillars</h3>
                          <ul className="space-y-2">
                            {strategy.contentPillars.map((pillar, i) => (
                              <li key={i} className="flex items-start gap-2.5 bg-[#faf8f6] p-3 rounded-xl border border-slate-100">
                                <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                                <span className="text-xs text-slate-700 leading-relaxed">{pillar}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Competitor Positioning</h3>
                          <p className="text-xs text-slate-600 leading-relaxed bg-[#faf8f6] p-4 rounded-xl border border-slate-100">{strategy.competitorPositioning}</p>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Overall Marketing Strategy</h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-[#faf8f6] p-4 rounded-xl border border-slate-100">{strategy.marketingStrategy}</p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Weekly Campaign Ideas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {strategy.weeklyCampaignIdeas.map((campaign, i) => (
                            <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                              className="bg-[#faf8f6] border border-slate-200 p-4 rounded-2xl hover:border-slate-300 transition-colors cursor-default">
                              <span className="inline-block px-2 py-0.5 bg-slate-200 text-[10px] font-bold rounded-md mb-2 text-slate-600">{campaign.platform}</span>
                              <h4 className="font-bold text-sm text-slate-800 mb-1">{campaign.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{campaign.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 border-dashed rounded-3xl shadow-sm">
                      <div className="w-16 h-16 bg-[#faf8f6] border border-slate-200 rounded-full flex items-center justify-center mb-5">
                        <Sparkles size={28} className="text-slate-400" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">No Strategy Generated Yet</h2>
                      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Fill out the form on the left to generate a comprehensive AI marketing strategy tailored to your business.</p>
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

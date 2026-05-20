"use client";

import React, { useState } from 'react';
import { Sparkles, Building2, Target, Briefcase, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { StrategyResponse } from '@/lib/gemini';

export default function StrategyExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    goals: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStrategy(null);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          goals: formData.goals.split(',').map(g => g.trim()).filter(Boolean)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate strategy');
      }

      setStrategy(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 lg:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 text-blue-400 mb-8">
            <Sparkles size={24} />
            <h1 className="text-2xl font-bold text-white">AI Strategy Generator</h1>
          </div>

          <form onSubmit={handleGenerate} className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  required
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Industry</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  required
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. E-commerce"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Target Audience</label>
              <div className="relative">
                <Target className="absolute left-3 top-3 text-slate-500" size={16} />
                <textarea 
                  required
                  value={formData.targetAudience}
                  onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                  placeholder="e.g. Gen Z tech enthusiasts..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Goals (comma separated)</label>
              <input 
                required
                value={formData.goals}
                onChange={e => setFormData({...formData, goals: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Increase sales, Brand awareness"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              {loading ? (
                <><RefreshCcw className="animate-spin" size={18} /> Generating AI Strategy...</>
              ) : (
                <><Sparkles size={18} /> Generate Strategy</>
              )}
            </button>

            {error && (
              <div className="p-3 mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8">
          {strategy ? (
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Brand Tone</h3>
                <p className="text-lg leading-relaxed text-slate-200">{strategy.brandTone}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Content Pillars</h3>
                  <ul className="space-y-3">
                    {strategy.contentPillars.map((pillar, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                        <CheckCircle2 className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                        <span className="text-sm text-slate-300">{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Competitor Positioning</h3>
                  <p className="text-sm leading-relaxed text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 h-full">
                    {strategy.competitorPositioning}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Overall Marketing Strategy</h3>
                <p className="text-slate-300 leading-relaxed bg-white/5 p-5 rounded-xl border border-white/5">
                  {strategy.marketingStrategy}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Weekly Campaign Ideas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {strategy.weeklyCampaignIdeas.map((campaign, i) => (
                    <div key={i} className="bg-gradient-to-b from-blue-500/10 to-purple-500/10 border border-white/10 p-5 rounded-xl hover:border-blue-500/30 transition-colors cursor-default">
                      <span className="inline-block px-2.5 py-1 bg-white/10 text-xs font-medium rounded-md mb-3 text-blue-300">
                        {campaign.platform}
                      </span>
                      <h4 className="font-semibold mb-2">{campaign.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {campaign.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/30 border border-white/5 rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={28} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No Strategy Generated Yet</h2>
              <p className="text-slate-500 max-w-sm">
                Fill out the form on the left to instruct our AI to build a comprehensive marketing strategy tailored to your business.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

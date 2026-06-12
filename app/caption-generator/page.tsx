"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Megaphone, RefreshCcw, 
  Copy, CheckCircle2, Heart, MessageCircle, Send, Bookmark,
  History, ArrowRight,
  Smile, Briefcase, Flame, GraduationCap,
  Home, CalendarDays, BarChart2, Settings, Menu,
  ChevronDown, TrendingUp, Compass, Target, Plus, Search,
  Play, User
} from 'lucide-react';
import { CaptionResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile } from '@/lib/user-profile';
import { saveCampaign } from '@/lib/campaigns';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function CaptionGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CaptionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Custom Dropdowns States
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  
  const [tone, setTone] = useState<'Professional' | 'Funny' | 'Hype' | 'Empathetic'>('Professional');
  const [platform, setPlatform] = useState<'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter/X'>('Instagram');
  
  const [prompt, setPrompt] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const { user } = useAuth();

  // Pre-fill prompt from user profile
  useEffect(() => {
    if (user?.uid) {
      getProfile(user.uid).then(p => {
        if (p) {
          setPrompt(`${p.businessName || 'Our brand'} — ${p.industry || ''} — targeting ${p.targetAudience || 'our audience'}.`);
        }
      }).catch(() => {});
    }
  }, [user]);

  const toneRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toneRef.current && !toneRef.current.contains(event.target as Node)) {
        setToneDropdownOpen(false);
      }
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setPlatformDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);
    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: prompt,
          targetAudience: 'Social media growth audience',
          tone: tone
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate captions');
      setResult(data.data);
      setSelectedOptionIndex(0);
      // Save campaign to Firestore
      if (user?.uid) {
        saveCampaign(user.uid, {
          name: prompt.slice(0, 60),
          platform,
          type: 'caption',
          status: 'Active',
        }).catch(() => {});
      }
    } catch (err: any) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCaption = result 
    ? result.captions[selectedOptionIndex]
    : "Tired of guessing what to post? 🤯 Let our AI analyze your audience, craft the perfect captions, and schedule your week in under 5 minutes. 🚀";

  const activeHashtags = result
    ? result.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')
    : "#socialmedia #marketingtips #aiwriting #growthmarketing";

  const activeCTA = result ? result.cta : "Link in bio to get started for free!";

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans flex overflow-hidden selection:bg-white/10">
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Off-white Light Theme as in User Screenshot */}
      <main className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden bg-[#f6f2ee] text-slate-800">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.08] bg-[#050505] text-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-neutral-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AI Content Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const drafts = JSON.parse(localStorage.getItem('caption_drafts') || '[]');
                if (drafts.length === 0) { alert('No saved drafts yet.'); return; }
                const list = drafts.map((d: any, i: number) => `${i+1}. ${d.prompt} (${d.tone})`).join('\n');
                alert('Saved Drafts:\n\n' + list);
              }}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-xs font-semibold items-center gap-1.5">
              <History size={14} /> History
            </button>
            <button
              onClick={() => {
                if (!prompt.trim()) { alert('Nothing to save.'); return; }
                const drafts = JSON.parse(localStorage.getItem('caption_drafts') || '[]');
                drafts.unshift({ prompt, tone, platform, savedAt: new Date().toLocaleString() });
                localStorage.setItem('caption_drafts', JSON.stringify(drafts.slice(0, 10)));
                alert('Draft saved!');
              }}
              className="hidden sm:block px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black transition-colors text-xs font-bold">
              Save Draft
            </button>
          </div>
        </header>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 xl:grid-cols-12 max-w-[1300px] w-full mx-auto p-4 sm:p-5 gap-5 sm:gap-6">
          
          {/* Left Column */}
          <div className="xl:col-span-7 flex flex-col space-y-5">

            {/* Input Card Container */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              
              {/* Card Title */}
              <div className="flex items-center gap-2 text-slate-800">
                <div className="w-5 h-5 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Compass size={14} className="stroke-[2.5]" />
                </div>
                <h2 className="text-xs font-bold tracking-tight">Caption Generator</h2>
              </div>

              {/* Textarea Area */}
              <div className="relative border border-slate-200 bg-white rounded-xl p-3 transition-all focus-within:border-slate-300">
                <textarea
                  required
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className="w-full bg-transparent resize-none h-20 text-xs text-slate-700 focus:outline-none placeholder:text-slate-400 leading-relaxed"
                  placeholder="Describe your post or let the AI write it for you..."
                />
              </div>

              {/* Input Selectors Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                
                {/* Tone Dropdown Selector */}
                <div className="relative" ref={toneRef}>
                  <button
                    type="button"
                    onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all text-left"
                  >
                    <span>Tone: {tone}</span>
                    <ChevronDown size={14} className="text-slate-400 ml-2" />
                  </button>
                  
                  <AnimatePresence>
                    {toneDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden"
                      >
                        {['Professional', 'Funny', 'Hype', 'Empathetic'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setTone(option as any);
                              setToneDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-slate-50 ${
                              tone === option ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                            }`}
                          >
                            Tone: {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Platform Dropdown Selector */}
                <div className="relative" ref={platformRef}>
                  <button
                    type="button"
                    onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all text-left"
                  >
                    <span>Platform: {platform}</span>
                    <ChevronDown size={14} className="text-slate-400 ml-2" />
                  </button>
                  
                  <AnimatePresence>
                    {platformDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden"
                      >
                        {['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setPlatform(option as any);
                              setPlatformDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-slate-50 ${
                              platform === option ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                            }`}
                          >
                            Platform: {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Red Magic Generate Button with glow */}
              <motion.button
                onClick={handleGenerate}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                className="w-full py-3 rounded-xl bg-[#ff2d3a] hover:bg-[#e6222e] disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,45,58,0.25)]"
              >
                {loading ? (
                  <>
                    <RefreshCcw size={14} className="animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Magic Generate
                  </>
                )}
              </motion.button>

            </div>

            {/* Ad Recommendations Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                  <TrendingUp size={15} className="text-amber-500 stroke-[2.5]" />
                  <h3 className="text-xs font-bold tracking-tight">Ad Suggestions</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200 rounded-full px-2 py-0.5">Sample templates</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Recommendation Card 1 */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Megaphone size={16} className="stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900">Weekend Promo Boost</h4>
                      <p className="text-[9px] text-slate-400 font-semibold mb-0.5">Instagram Feed & Stories</p>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-[8px] font-bold text-emerald-500 border border-emerald-100">
                        Est. 2.4x ROAS
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Budget</span>
                      <span className="text-xs font-extrabold text-slate-900 leading-none">₹4,200</span>
                    </div>
                    <button type="button" className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Recommendation Card 2 */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Target size={16} className="stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900">Retargeting: Cart Abandon</h4>
                      <p className="text-[9px] text-slate-400 font-semibold mb-0.5">Facebook Feed</p>
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-50 text-[8px] font-bold text-purple-500 border border-purple-100">
                        Est. 1.8x ROAS
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Budget</span>
                      <span className="text-xs font-extrabold text-slate-900 leading-none">₹2,500</span>
                    </div>
                    <button type="button" className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (iOS Smartphone Mock Live Preview) — hidden on mobile */}
          <div className="hidden xl:flex xl:col-span-5 flex-col items-center justify-center overflow-hidden py-1 space-y-3">

            {/* iOS Phone Shell Mockup */}
            <div className="relative w-full max-w-[320px] h-[520px] bg-[#0c1017] border-[5px] border-[#181d26] rounded-[44px] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden select-none">
              
              {/* iPhone Dynamic Island Speaker Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <div className="w-10 h-0.5 bg-neutral-800 rounded-full" />
              </div>

              {/* Inner Mock Phone Screen */}
              <div className="bg-white rounded-[36px] overflow-hidden border border-slate-100 pt-10 flex flex-col h-full">
                
                {/* Mock Instagram Header */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-extrabold tracking-tight text-slate-900">{platform}</span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <button><Heart size={13} className="stroke-[2.5]" /></button>
                    <button><Plus size={13} className="stroke-[2.5]" /></button>
                  </div>
                </div>

                {/* Mock Sponsored Post Profile Header */}
                <div className="flex items-center justify-between px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-[1px]">
                      <div className="w-full h-full bg-white rounded-full p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                          className="w-full h-full object-cover rounded-full"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-extrabold text-slate-900 block leading-none">thefriendlyagency</span>
                      <span className="text-[7.5px] text-slate-400 font-semibold block mt-0.5 leading-none">Sponsored</span>
                    </div>
                  </div>
                  <button className="text-slate-400 text-[10px] font-bold">•••</button>
                </div>

                {/* Post Graphic / Image Box */}
                <div className="relative aspect-[4/3] w-full bg-[#f1f3f5] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80" 
                    alt="Creative team preview" 
                    className="w-full h-full object-cover"
                  />
                  {/* Call to action overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/45 backdrop-blur-md flex items-center justify-between text-white">
                    <div>
                      <h4 className="text-[9.5px] font-extrabold tracking-tight">Grow Your Brand</h4>
                      <p className="text-[8px] opacity-90 font-medium">Let AI do the heavy lifting.</p>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-[#ff2d3a] hover:bg-[#e6222e] text-[8px] font-bold tracking-tight text-white flex items-center transition-colors">
                      Learn More <ArrowRight size={8} className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Feed Action Bar */}
                <div className="p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <button><Heart size={13} className="stroke-[2.5]" /></button>
                      <button><MessageCircle size={13} className="stroke-[2.5]" /></button>
                      <button><Send size={13} className="stroke-[2.5]" /></button>
                    </div>
                    <button><Bookmark size={13} className="stroke-[2.5]" /></button>
                  </div>

                  {/* Likes */}
                  <div className="text-[9px] font-extrabold text-slate-900 leading-none">248 likes</div>

                  {/* Caption & Hashtags Block */}
                  <div className="space-y-1 text-[9.5px] leading-relaxed text-slate-700">
                    <p className="line-clamp-3">
                      <span className="font-extrabold text-slate-900 mr-1">thefriendlyagency</span>
                      {activeCaption}
                    </p>
                    {activeCTA && (
                      <p className="text-slate-400 font-bold text-[8px] uppercase tracking-wider">{activeCTA}</p>
                    )}
                    <p className="text-blue-600 font-medium line-clamp-1">{activeHashtags}</p>
                  </div>
                </div>

                {/* iPhone Instagram Bottom Navigation Bar */}
                <div className="mt-auto border-t border-slate-100 px-4 py-1.5 flex items-center justify-between text-slate-500 bg-white">
                  <button className="text-slate-800"><Home size={13} className="stroke-[2.5]" /></button>
                  <button><Search size={13} className="stroke-[2.5]" /></button>
                  <button><Plus size={13} className="stroke-[2.5]" /></button>
                  <button><Play size={13} className="stroke-[2.5]" /></button>
                  <div className="w-4 h-4 rounded-full border border-slate-200 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      className="w-full h-full object-cover" 
                      alt="Profile"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Option selector or Copy controls */}
            <div className="flex gap-2">
              {result && (
                <div className="flex gap-1">
                  {result.captions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOptionIndex(idx)}
                      className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wider border transition-all ${
                        selectedOptionIndex === idx
                          ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Option {idx + 1}
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => handleCopy(`${activeCaption}\n\n${activeCTA}\n\n${activeHashtags}`)}
                className="px-3.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-200 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.2 shadow-sm"
              >
                {copied ? (
                  <><CheckCircle2 size={11} className="text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy size={11} /> Copy Caption</>
                )}
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

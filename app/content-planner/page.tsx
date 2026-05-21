"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, Megaphone, CalendarDays, Clock, Plus, ChevronLeft, ChevronRight,
  Home, BarChart2, Settings, Menu, X, Check, Camera, ThumbsUp, HelpCircle,
  Building2, Briefcase, Target, RefreshCcw, Trash2, ArrowRight, Save, Trash
} from 'lucide-react';
import { PlannerResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile } from '@/lib/user-profile';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface CalendarPost {
  isHolidayBanner?: boolean;
  holidayTitle?: string;
  isTip?: boolean;
  tipText?: string;
  image?: string;
  caption?: string;
  time?: string;
  platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  empty?: boolean;
}

interface CalendarDay {
  name: string;
  date: string;
  posts: CalendarPost[];
}

// ── Mini calendar week picker ──────────────────────────────────────────────
function WeekPicker({ weekOffset, onOffsetChange }: { weekOffset: number; onOffsetChange: (o: number) => void }) {
  const [open, setOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Get Monday of current week + offset
  const getMonday = (offset: number) => {
    const today = new Date();
    const dow = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
    mon.setHours(0, 0, 0, 0);
    return mon;
  };

  const selectedMonday = getMonday(weekOffset);

  // Build calendar grid for calMonth
  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0=Sun
  // Start grid from Monday before first of month
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - (startDow === 0 ? 6 : startDow - 1));

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    // Stop if we've passed the month and filled at least 4 weeks
    if (w >= 3 && week[0].getMonth() !== month && week[6].getMonth() !== month) break;
  }

  const isSameWeek = (mon: Date) => mon.getTime() === selectedMonday.getTime();
  const isToday = (d: Date) => {
    const t = new Date(); t.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  };

  const handleWeekClick = (mon: Date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const todayMon = getMonday(0);
    const diff = Math.round((mon.getTime() - todayMon.getTime()) / (7 * 86400000));
    onOffsetChange(diff);
    setOpen(false);
  };

  const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="relative" ref={ref}>
      {/* Trigger pill */}
      <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm overflow-hidden">
        <button
          onClick={() => onOffsetChange(weekOffset - 1)}
          className="px-2.5 py-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => setOpen(o => !o)}
          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5"
        >
          <CalendarDays size={12} />
          {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : weekOffset > 0 ? `In ${weekOffset} weeks` : `${Math.abs(weekOffset)} weeks ago`}
        </button>
        <button
          onClick={() => onOffsetChange(weekOffset + 1)}
          className="px-2.5 py-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 top-10 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-72"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-bold text-slate-800">{MONTHS[month]} {year}</span>
              <button
                onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => {
              const mon = week[0];
              const selected = isSameWeek(mon);
              return (
                <button
                  key={wi}
                  onClick={() => handleWeekClick(mon)}
                  className="grid grid-cols-7 w-full mb-0.5 group/week"
                >
                  {week.map((day, di) => {
                    const inMonth = day.getMonth() === month;
                    const today = isToday(day);
                    const isFirst = di === 0;
                    const isLast = di === 6;
                    return (
                      <div key={di} className={`
                        text-center py-1.5 text-xs font-semibold transition-colors
                        ${isFirst ? 'rounded-l-xl' : ''} ${isLast ? 'rounded-r-xl' : ''}
                        ${selected
                          ? 'bg-slate-900 text-white'
                          : 'group-hover/week:bg-slate-100 ' + (inMonth ? 'text-slate-700' : 'text-slate-300')}
                        ${today && !selected ? 'text-red-500 font-black' : ''}
                      `}>
                        {day.getDate()}
                      </div>
                    );
                  })}
                </button>
              );
            })}

            {/* Today shortcut */}
            <button
              onClick={() => { onOffsetChange(0); setOpen(false); }}
              className="mt-2 w-full py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Jump to Today
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContentPlanner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  
  // Right-sliding details drawer state
  const [selectedPost, setSelectedPost] = useState<{
    dayIdx: number;
    postIdx: number;
    caption?: string;
    time?: string;
    platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
    image?: string;
    isTip?: boolean;
    tipText?: string;
  } | null>(null);

  const [editCaption, setEditCaption] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPlatform, setEditPlatform] = useState<'instagram' | 'facebook' | 'linkedin' | 'twitter'>('instagram');

  const pathname = usePathname();

  // Real week navigation
  const [weekOffset, setWeekOffset] = useState(0);

  // Compute the Monday of the current week + offset
  const getWeekDays = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        name,
        date: String(d.getDate()),
        month: d.toLocaleString('default', { month: 'short' }),
        fullDate: d,
      };
    });
  };

  const weekDays = getWeekDays(weekOffset);
  const weekStart = weekDays[0].fullDate;
  const weekEnd = weekDays[6].fullDate;
  const isCurrentWeek = weekOffset === 0;

  const formatWeekLabel = () => {
    const startStr = `${weekDays[0].month} ${weekDays[0].date}`;
    const endStr = `${weekDays[6].month} ${weekDays[6].date}`;
    const year = weekEnd.getFullYear();
    return `${startStr} – ${endStr}, ${year}`;
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ businessName: '', industry: '', targetAudience: '' });
  const { user } = useAuth();

  // Pre-fill AI generator form from Firestore profile
  useEffect(() => {
    if (user?.uid) {
      getProfile(user.uid).then(p => {
        if (p) {
          setFormData({
            businessName: p.businessName || '',
            industry: p.industry || '',
            targetAudience: p.targetAudience || '',
          });
        }
      });
    }
  }, [user]);

  // Default demo schedule — dates come from real weekDays
  const initialDays: CalendarDay[] = [
    {
      name: 'Mon',
      date: weekDays[0].date,
      posts: [
        {
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
          caption: 'Starting the week strong! Check out our new guide on local SEO...',
          time: '09:00 AM',
          platform: 'instagram'
        }
      ]
    },
    {
      name: 'Tue',
      date: weekDays[1].date,
      posts: [
        {
          isTip: true,
          tipText: 'TIP',
          caption: 'Did you know? Consistent posting can increase your reach by up to...',
          time: '12:30 PM',
          platform: 'facebook'
        }
      ]
    },
    {
      name: 'Wed',
      date: weekDays[2].date,
      posts: [
        {
          empty: true,
          caption: 'Drop a post here or create new',
          time: '',
          platform: 'instagram'
        }
      ]
    },
    {
      name: 'Thu',
      date: weekDays[3].date,
      posts: [
        {
          isHolidayBanner: true,
          holidayTitle: '☕ National Coffee Day'
        },
        {
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80',
          caption: 'Happy National Coffee Day! ☕ How many cups does it take to run your...',
          time: '08:00 AM',
          platform: 'instagram'
        }
      ]
    },
    {
      name: 'Fri',
      date: weekDays[4].date,
      posts: [
        {
          empty: true,
          caption: 'Drop a post here or create new',
          time: '',
          platform: 'instagram'
        }
      ]
    },
    {
      name: 'Sat',
      date: weekDays[5].date,
      posts: [
        {
          image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80',
          caption: 'Weekend gear checks! What is your absolute must-have essential today?',
          time: '10:00 AM',
          platform: 'instagram'
        }
      ]
    },
    {
      name: 'Sun',
      date: weekDays[6].date,
      posts: [
        {
          empty: true,
          caption: 'Drop a post here or create new',
          time: '',
          platform: 'instagram'
        }
      ]
    }
  ];

  // Reset calendar when week changes
  const [calendarData, setCalendarData] = useState<CalendarDay[]>(() => initialDays);
  useEffect(() => {
    setCalendarData(initialDays.map((day, i) => ({ ...day, date: weekDays[i].date })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  // Sync edits when drawer opens
  useEffect(() => {
    if (selectedPost) {
      setEditCaption(selectedPost.caption || '');
      setEditTime(selectedPost.time || '');
      setEditPlatform(selectedPost.platform || 'instagram');
    }
  }, [selectedPost]);

  const fillMockData = () => {
    setFormData({ 
      businessName: 'FitLife Studios', 
      industry: 'Health & Fitness', 
      targetAudience: 'Busy professionals looking for quick home workouts' 
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate content plan');
      
      const generatedPlan: PlannerResponse = data.data;
      
      // Map API result to calendar days
      const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const updatedCalendar = weekdayNames.map((name, idx) => {
        const apiDayPlan = generatedPlan.days.find(d => d.day.toLowerCase().includes(name.toLowerCase()));
        
        const posts: CalendarPost[] = [];
        // Keep National Coffee Day holiday banner on Thursday
        if (name === 'Thu') {
          posts.push({
            isHolidayBanner: true,
            holidayTitle: '☕ National Coffee Day'
          });
        }

        if (apiDayPlan) {
          posts.push({
            caption: apiDayPlan.captionIdea,
            time: apiDayPlan.postingTime || '09:00 AM',
            platform: apiDayPlan.postType.toLowerCase().includes('facebook') ? 'facebook' : 'instagram',
            tipText: apiDayPlan.postType.toLowerCase().includes('tip') ? 'TIP' : undefined,
            isTip: apiDayPlan.postType.toLowerCase().includes('tip')
          });
        } else {
          posts.push({
            empty: true,
            caption: 'Drop a post here or create new',
            time: '',
            platform: 'instagram'
          });
        }

        return {
          name,
          date: String(24 + idx),
          posts
        };
      });

      setCalendarData(updatedCalendar);
      setGeneratorModalOpen(false);
    } catch (err: any) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  // Save changes from details drawer back into calendar state
  const handleSavePostDetails = () => {
    if (!selectedPost) return;
    const { dayIdx, postIdx } = selectedPost;
    
    setCalendarData(prev => {
      const copy = [...prev];
      const day = { ...copy[dayIdx] };
      const posts = [...day.posts];
      posts[postIdx] = {
        ...posts[postIdx],
        caption: editCaption,
        time: editTime,
        platform: editPlatform
      };
      day.posts = posts;
      copy[dayIdx] = day;
      return copy;
    });

    setSelectedPost(null);
  };

  // Delete post from calendar state
  const handleDeletePost = () => {
    if (!selectedPost) return;
    const { dayIdx, postIdx } = selectedPost;

    setCalendarData(prev => {
      const copy = [...prev];
      const day = { ...copy[dayIdx] };
      const posts = [...day.posts];
      
      // Instead of completely deleting, replace with the empty placeholder
      posts[postIdx] = {
        empty: true,
        caption: 'Drop a post here or create new',
        time: '',
        platform: 'instagram'
      };
      
      day.posts = posts;
      copy[dayIdx] = day;
      return copy;
    });

    setSelectedPost(null);
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Campaigns', icon: Megaphone, href: '/caption-generator' },
    { name: 'AI Planner', icon: CalendarDays, href: '/content-planner' },
    { name: 'Analytics', icon: BarChart2, href: '/analytics' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans flex overflow-hidden selection:bg-white/10">
      
      <AppSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Styled to fit page height with right sliding layout */}
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
              <span className="font-bold text-lg text-white tracking-tight">AI Content Planner</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setGeneratorModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-yellow-400" /> Create AI Plan
            </button>
            <button className="hidden sm:block px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black transition-colors text-xs font-bold">
              Export Calendar
            </button>
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-hidden h-[calc(100vh-64px)] relative">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 shrink-0 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900">{formatWeekLabel()}</h2>
              <WeekPicker weekOffset={weekOffset} onOffsetChange={setWeekOffset} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fbf5ee] border border-amber-200/50 rounded-full text-xs font-semibold text-amber-900">
                ☕ National Coffee Day (Thu)
              </span>
              <button 
                onClick={() => setNewPostModalOpen(true)}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-500/20 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} /> New Post
              </button>
            </div>
          </div>

          {/* Calendar Horizontal Sliding Columns Container */}
          <motion.div 
            className="flex-1 flex gap-3 sm:gap-5 overflow-x-auto pb-6 pt-1 items-stretch snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {calendarData.map((dayPlan, i) => (
              <motion.div
                key={i}
                className="w-[85vw] sm:w-[280px] md:w-[290px] shrink-0 flex flex-col h-full snap-start select-none"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } } }}
              >
                
                {/* Day Header */}
                <div className="text-sm font-bold text-slate-900 mb-3.5 flex items-baseline gap-1">
                  <span>{dayPlan.name === weekDays[3].name && weekDays[3].fullDate.getMonth() === 9 ? <span className="text-amber-600">{dayPlan.name}</span> : dayPlan.name}</span>
                  <span className="text-slate-400 font-semibold text-xs">{dayPlan.date}</span>
                  {i === 0 || dayPlan.date === '1' ? (
                    <span className="text-slate-300 font-semibold text-[10px]">{weekDays[i]?.month}</span>
                  ) : null}
                </div>

                {/* Day Column Card Container */}
                <div className="flex-1 bg-white border border-slate-200/80 rounded-[28px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-4 overflow-y-auto relative border-dashed border-slate-300">
                  
                  {dayPlan.posts.map((post, j) => {
                    // Check if it's a holiday banner post type
                    if (post.isHolidayBanner) {
                      return (
                        <div key={j} className="py-2.5 px-4 bg-[#fbf5ee] border border-amber-200/50 text-[10px] font-bold text-amber-800 rounded-xl text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
                          ☕ National Coffee Day
                        </div>
                      );
                    }

                    // Check if empty post layout placeholder
                    if (post.empty) {
                      return (
                        <div key={j} className="flex-1 flex flex-col items-center justify-center text-center py-8">
                          <button 
                            onClick={() => setNewPostModalOpen(true)}
                            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:border-red-500/30 text-slate-400 hover:text-red-500 flex items-center justify-center mb-3 transition-colors shadow-sm"
                          >
                            <Plus size={16} />
                          </button>
                          <p className="text-[11px] font-medium text-slate-400 leading-normal max-w-[140px]">
                            Drop a post here or <button onClick={() => setNewPostModalOpen(true)} className="text-red-500 font-bold hover:underline">create new</button>
                          </p>
                        </div>
                      );
                    }

                    // Standard Calendar Post Card
                    return (
                      <div 
                        key={j} 
                        onClick={() => setSelectedPost({ dayIdx: i, postIdx: j, ...post })}
                        className="cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col shrink-0 group hover:shadow-md hover:border-slate-200/80 transition-all"
                      >
                        {post.image ? (
                          <div className="aspect-[16/10] w-full bg-[#f1f3f5] overflow-hidden relative">
                            <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Post preview" />
                          </div>
                        ) : post.isTip ? (
                          <div className="aspect-[16/10] w-full bg-[#fff0f0] flex items-center justify-center relative">
                            <span className="text-[32px] font-extrabold tracking-widest text-[#ff3a49]/15 select-none">{post.tipText}</span>
                            <span className="absolute font-black text-lg tracking-wider text-[#ff3a49]">{post.tipText}</span>
                          </div>
                        ) : null}

                        <div className="p-3.5 flex flex-col gap-3">
                          <p className="text-[11px] font-semibold text-slate-700 leading-relaxed line-clamp-3">
                            {post.caption}
                          </p>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-400">
                              {post.time}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-700 group-hover:border-slate-300 transition-colors">
                              {post.platform === 'instagram' ? (
                                <InstagramIcon className="text-red-500 stroke-[2.2]" />
                              ) : (
                                <FacebookIcon className="text-blue-600 stroke-[2.2]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>

      {/* AI Strategy Generator Modal Overlay */}
      <AnimatePresence>
        {generatorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {/* Backdrop close */}
            <div className="absolute inset-0" onClick={() => setGeneratorModalOpen(false)} />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 text-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="text-yellow-500 fill-yellow-500" size={18} />
                  <h3 className="font-extrabold text-base tracking-tight">Generate AI Content Plan</h3>
                </div>
                <button onClick={() => setGeneratorModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required 
                      value={formData.businessName} 
                      onChange={e => setFormData({...formData, businessName: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                      placeholder="e.g. FitLife Studios" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required 
                      value={formData.industry} 
                      onChange={e => setFormData({...formData, industry: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                      placeholder="e.g. Health & Fitness" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Target Audience</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 text-slate-400" size={16} />
                    <textarea 
                      required 
                      value={formData.targetAudience} 
                      onChange={e => setFormData({...formData, targetAudience: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none h-20 placeholder:text-slate-400 leading-normal" 
                      placeholder="Describe your ideal customers..." 
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-100 mt-5">
                  <button 
                    type="button" 
                    onClick={fillMockData} 
                    className="flex-1 py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold transition-all text-center"
                  >
                    Demo Data
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {loading ? (
                      <><RefreshCcw className="animate-spin" size={14} /> Generating...</>
                    ) : (
                      <><Sparkles size={14} /> Create Weekly Plan</>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-500 text-xs rounded-xl mt-3">
                    {error}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Custom Post Modal Overlay */}
      <AnimatePresence>
        {newPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setNewPostModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 text-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-extrabold text-base tracking-tight text-slate-900">Create Custom Post</h3>
                <button onClick={() => setNewPostModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Post Caption</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none h-20 placeholder:text-slate-400 leading-normal" 
                    placeholder="Type your custom caption here..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Posting Day</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Posting Time</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400" 
                      placeholder="e.g. 09:00 AM" 
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-100 mt-5">
                  <button 
                    type="button" 
                    onClick={() => setNewPostModalOpen(false)}
                    className="flex-1 py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewPostModalOpen(false)}
                    className="flex-1 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center shadow-sm"
                  >
                    Schedule Post
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right sliding post detail drawer */}
      <AnimatePresence>
        {selectedPost && (
          <>
            {/* Dark Dimmer Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-all"
              onClick={() => setSelectedPost(null)}
            />

            {/* Sliding Drawer Container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[380px] bg-white border-l border-slate-200 shadow-2xl z-[60] flex flex-col"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">Post Details</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body content (scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Preview Segment */}
                {selectedPost.image ? (
                  <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
                    <img src={selectedPost.image} className="w-full h-full object-cover" alt="Detail preview" />
                  </div>
                ) : selectedPost.isTip ? (
                  <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#fff0f0] border border-[#ff3a49]/10 flex items-center justify-center relative shadow-sm">
                    <span className="text-[32px] font-black tracking-widest text-[#ff3a49]/15 select-none">{selectedPost.tipText}</span>
                    <span className="absolute font-black text-lg tracking-wider text-[#ff3a49]">{selectedPost.tipText}</span>
                  </div>
                ) : null}

                {/* Edit Fields */}
                <div className="space-y-4">
                  {/* Platform Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Platform Channel</label>
                    <div className="flex gap-2">
                      {(['instagram', 'facebook', 'linkedin', 'twitter'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setEditPlatform(p)}
                          className={`flex-1 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                            editPlatform === p
                              ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {p === 'instagram' ? <InstagramIcon /> : <FacebookIcon />}
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scheduled Posting Time */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Posting Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        value={editTime}
                        onChange={e => setEditTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                        placeholder="e.g. 09:00 AM"
                      />
                    </div>
                  </div>

                  {/* Post Caption Body Textarea */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Caption Idea</label>
                    <textarea 
                      value={editCaption}
                      onChange={e => setEditCaption(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none h-32 leading-relaxed"
                      placeholder="Type post caption..."
                    />
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  type="button"
                  onClick={handleSavePostDetails}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}

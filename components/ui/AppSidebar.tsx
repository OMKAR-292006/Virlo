"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, House, LayoutDashboard, Megaphone, CalendarDays, BarChart2, X, User, Settings, LogOut, TrendingUp, Lightbulb } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  { name: 'Home', icon: House, href: '/home' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Campaigns', icon: Megaphone, href: '/caption-generator' },
  { name: 'AI Planner', icon: CalendarDays, href: '/content-planner' },
  { name: 'Analytics', icon: BarChart2, href: '/analytics' },
  { name: 'Trend Engine', icon: TrendingUp, href: '/trend-engine' },
  { name: 'AI Strategy', icon: Lightbulb, href: '/strategy-example' },
];

function HamburgerIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect x="0" y="0" width="18" height="2" rx="1" fill="rgb(163,163,163)" />
      <rect x="0" y="6" width="18" height="2" rx="1" fill="rgb(163,163,163)" />
      <rect x="0" y="12" width="18" height="2" rx="1" fill="rgb(163,163,163)" />
    </svg>
  );
}

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AppSidebar({ mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setCollapsed(true);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 shrink-0
          bg-[#050505] border-r border-white/[0.08] flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
        `}
        animate={{ width: collapsed ? 56 : 256 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="h-16 flex items-center border-b border-white/[0.08] shrink-0 px-3">
          <AnimatePresence mode="wait" initial={false}>
            {collapsed ? (
              /* Collapsed: only hamburger button, centered */
              <motion.button
                key="hamburger"
                onClick={() => setCollapsed(false)}
                className="w-full flex items-center justify-center h-8 rounded-lg hover:bg-white/10 transition-colors"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                aria-label="Expand sidebar"
              >
                <HamburgerIcon />
              </motion.button>
            ) : (
              /* Expanded: logo + name, hamburger on right */
              <motion.div
                key="brand"
                className="flex items-center gap-2 w-full"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Link href="/home" className="flex items-center gap-2 flex-1 min-w-0 group">
                  <div className="p-1.5 rounded-lg bg-white/10 text-white shrink-0 group-hover:bg-white/20 transition-colors">
                    <Sparkles size={18} />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap group-hover:text-neutral-300 transition-colors">
                    Brand Matic
                  </span>
                </Link>
                {/* Desktop collapse button */}
                <button
                  onClick={() => setCollapsed(true)}
                  className="hidden lg:flex shrink-0 w-8 h-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <HamburgerIcon />
                </button>
                {/* Mobile close */}
                <button
                  onClick={onMobileClose}
                  className="lg:hidden shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item, idx) => {
            const active = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={() => { onMobileClose(); setCollapsed(true); }}
                  title={collapsed ? item.name : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={18} className="shrink-0" />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        className="whitespace-nowrap overflow-hidden"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Profile section at bottom */}
        <div className="border-t border-white/[0.08] p-2 relative" ref={profileRef}>
          <button
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
                setProfileOpen(true);
              } else {
                setProfileOpen(o => !o);
              }
            }}
            title={collapsed ? (user?.email || 'Profile') : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <User size={13} className="text-slate-300" />
              </div>
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  className="flex-1 min-w-0 text-left overflow-hidden"
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}
                >
                  <p className="text-xs font-semibold text-white truncate">{user?.displayName || 'My Account'}</p>
                  <p className="text-[10px] text-neutral-500 truncate">{user?.email || 'demo@brandmatic.ai'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Profile popup */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-2 right-2 mb-2 bg-[#0d0d0d] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.08]">
                  <p className="text-xs font-bold text-white truncate">{user?.displayName || 'My Account'}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user?.email || 'demo@brandmatic.ai'}</p>
                </div>
                <div className="py-1">
                  <Link href="/settings" onClick={() => { setProfileOpen(false); setCollapsed(true); }}>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <Settings size={14} /> Settings
                    </div>
                  </Link>
                </div>
                <div className="border-t border-white/[0.08] py-1">
                  <button onClick={() => { handleSignOut(); setCollapsed(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.04] transition-colors">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, Check, Eye, EyeOff, CreditCard, BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile, updateProfile, UserProfile } from '@/lib/user-profile';
import { getKpis, saveKpis, KpiData } from '@/lib/kpis';
import { getAnalytics, saveAnalytics } from '@/lib/analytics';
import { updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/Toast';

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" onClick={() => setOn(!on)}
      className={`relative w-12 h-6 rounded-full transition-colors flex items-center shrink-0 ${on ? 'bg-[#00c592]' : 'bg-slate-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-all absolute ${on ? 'left-[25px]' : 'left-[3px]'}`}>
        {on && <Check size={12} className="text-[#00c592] stroke-[3]" />}
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', newPassword: '' });
  const [kpis, setKpis] = useState<KpiData>({ engagement: '', engagementChange: '', ctr: '', ctrChange: '', roas: '', roasChange: '', followers: '', followersChange: '' });
  const [kpiSaved, setKpiSaved] = useState(false);
  const [kpiSaving, setKpiSaving] = useState(false);
  const [demographics, setDemographics] = useState([
    { name: '18-24', value: 0 },
    { name: '25-34', value: 0 },
    { name: '35-44', value: 0 },
    { name: '45+',   value: 0 },
  ]);
  const [demoSaved, setDemoSaved] = useState(false);
  const [demoSaving, setDemoSaving] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getProfile(user.uid).then(p => {
        if (p) {
          setProfile(p);
          setForm({
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            email: p.email || user.email || '',
            newPassword: '',
          });
        } else {
          setForm(f => ({ ...f, email: user.email || '' }));
        }
      }).catch(() => {
        setForm(f => ({ ...f, email: user.email || '' }));
      });
      getKpis(user.uid).then(data => setKpis(k => ({ ...k, ...data }))).catch(() => {});
      getAnalytics(user.uid).then(data => {
        if (data.demographics?.some(d => d.value > 0)) setDemographics(data.demographics);
      }).catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateProfile(user.uid, {
        firstName: form.firstName,
        lastName: form.lastName,
      });
      if (form.newPassword && form.newPassword.length >= 6) {
        await updatePassword(user, form.newPassword);
        setForm(f => ({ ...f, newPassword: '' }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const msg = err?.code === 'auth/requires-recent-login'
        ? 'Please sign out and sign back in to change your password.'
        : 'Failed to save. Please try again.';
      toast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleKpiSave = async () => {
    if (!user?.uid) return;
    setKpiSaving(true);
    try {
      await saveKpis(user.uid, kpis);
      setKpiSaved(true);
      setTimeout(() => setKpiSaved(false), 2500);
    } catch {
      toast('Failed to save KPIs.', 'error');
    } finally {
      setKpiSaving(false);
    }
  };

  const handleDemoSave = async () => {
    if (!user?.uid) return;
    setDemoSaving(true);
    try {
      await saveAnalytics(user.uid, { demographics });
      setDemoSaved(true);
      setTimeout(() => setDemoSaved(false), 2500);
    } catch {
      toast('Failed to save demographics.', 'error');
    } finally {
      setDemoSaving(false);
    }
  };

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
            <span className="text-white font-bold text-lg tracking-tight">Settings</span>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Profile</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1">Manage your account settings, billing, and notifications.</p>
            </motion.div>

            {/* Profile Information Card */}
            <motion.div
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">Profile Information</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Column */}
                <div className="flex flex-col items-center shrink-0 space-y-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-white font-black text-2xl">
                        {form.firstName ? form.firstName[0].toUpperCase() : (user?.email?.[0]?.toUpperCase() || '?')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold text-center leading-normal">
                    {user?.email}
                  </span>
                </div>

                {/* Form Column */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="First name"
                        className="w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Last name"
                        className="w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 text-xs font-semibold focus:outline-none transition-all cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password <span className="text-slate-400 normal-case font-normal">(leave blank to keep current)</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.newPassword}
                        onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className="w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400 pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button onClick={handleSave} disabled={saving}
                      className="px-6 py-2 bg-[#e52521] hover:bg-[#c81916] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Billing & Plan Card */}
            <motion.div
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">Billing & Plan</h2>

              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <CreditCard size={24} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Billing coming soon</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1 max-w-xs leading-relaxed">
                    Subscription management and invoice history will be available here once billing is set up.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  In Progress
                </span>
              </div>
            </motion.div>

            {/* KPI Metrics Card */}
            <motion.div
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <BarChart2 size={14} className="text-slate-500" /> KPI Metrics
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold mt-1">These values appear on your Home and Dashboard.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { label: 'Engagement', key: 'engagement', changeKey: 'engagementChange', placeholder: 'e.g. 2.4M' },
                  { label: 'CTR', key: 'ctr', changeKey: 'ctrChange', placeholder: 'e.g. 4.8%' },
                  { label: 'ROAS', key: 'roas', changeKey: 'roasChange', placeholder: 'e.g. 3.2x' },
                  { label: 'Followers', key: 'followers', changeKey: 'followersChange', placeholder: 'e.g. 12.4K' },
                ] as const).map(({ label, key, changeKey, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                    <div className="flex gap-2">
                      <input
                        value={kpis[key] ?? ''}
                        onChange={e => setKpis(k => ({ ...k, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="flex-1 bg-[#faf8f6] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                      <input
                        value={kpis[changeKey] ?? ''}
                        onChange={e => setKpis(k => ({ ...k, [changeKey]: e.target.value }))}
                        placeholder="+12%"
                        className="w-20 bg-[#faf8f6] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={handleKpiSave} disabled={kpiSaving}
                  className="px-6 py-2 bg-[#e52521] hover:bg-[#c81916] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                  {kpiSaving ? 'Saving...' : kpiSaved ? 'Saved!' : 'Save KPIs'}
                </button>
              </div>
            </motion.div>

            {/* Audience Demographics Card */}
            <motion.div
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Audience Demographics</h2>
                <p className="text-slate-400 text-xs font-semibold mt-1">Shown on the Analytics page demographics chart.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {demographics.map((d, i) => (
                  <div key={d.name} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{d.name}</label>
                    <input
                      type="number"
                      min="0"
                      value={d.value}
                      onChange={e => setDemographics(prev => prev.map((x, j) => j === i ? { ...x, value: Number(e.target.value) } : x))}
                      placeholder="0"
                      className="w-full bg-[#faf8f6] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={handleDemoSave} disabled={demoSaving}
                  className="px-6 py-2 bg-[#e52521] hover:bg-[#c81916] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                  {demoSaving ? 'Saving...' : demoSaved ? 'Saved!' : 'Save Demographics'}
                </button>
              </div>
            </motion.div>

            {/* Notification Preferences Card */}
            <motion.div
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notification Preferences</h2>
                <p className="text-slate-500 text-xs font-semibold mt-1">Choose what updates you want to receive.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Weekly Marketing Summary", desc: "Receive an email digest of your upcoming content calendar.", defaultOn: true },
                  { label: "Approval Reminders", desc: "Push notifications when new AI content needs your review.", defaultOn: false },
                  { label: "Billing Alerts", desc: "Get notified about upcoming payments or failed transactions.", defaultOn: true }
                ].map((pref, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#faf8f6] border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="pr-4">
                      <h4 className="text-xs font-bold text-slate-800">{pref.label}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{pref.desc}</p>
                    </div>
                    <Toggle defaultOn={pref.defaultOn} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

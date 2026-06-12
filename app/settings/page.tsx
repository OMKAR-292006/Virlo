"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, Check, Eye, EyeOff, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/ui/AppSidebar';
import { useAuth } from '@/lib/auth-context';
import { getProfile, updateProfile, UserProfile } from '@/lib/user-profile';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', newPassword: '' });

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
      alert(msg);
    } finally {
      setSaving(false);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Growth Plan Box */}
                <div className="bg-[#faf8f6] border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Growth Plan</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Perfect for small businesses scaling their marketing.
                  </p>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-800">₹4,099</span>
                    <span className="text-slate-400 text-xs font-bold"> /mo</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Next billing date: Oct 15, 2023
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button className="flex-1 bg-[#231f20] hover:bg-[#1a1718] text-white text-xs font-bold py-2 rounded-xl transition-colors">
                      Upgrade
                    </button>
                  </div>
                </div>

                {/* Payment Method Box */}
                <div className="bg-[#faf8f6] border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Payment Method</span>
                    <CreditCard size={16} className="text-slate-400" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm mt-2">
                    <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-extrabold rounded-md border border-blue-100">
                      VISA
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Visa ending in 1234</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Expires 12/25</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <button className="w-full bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition-colors">
                      Update Payment Method
                    </button>
                  </div>
                </div>
              </div>

              {/* Invoice History Sub-section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice History</h3>
                
                <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#faf8f6] border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {[
                        { date: "Sep 15, 2023", amount: "₹4,099", status: "Paid" },
                        { date: "Aug 15, 2023", amount: "₹4,099", status: "Paid" },
                        { date: "Jul 15, 2023", amount: "₹4,099", status: "Paid" },
                      ].map((invoice, i) => (
                        <tr key={i} className="hover:bg-[#faf8f6] transition-colors">
                          <td className="px-4 py-3 text-slate-500 font-semibold">{invoice.date}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold">{invoice.amount}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {/* Empty as in reference or can have a small download link */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

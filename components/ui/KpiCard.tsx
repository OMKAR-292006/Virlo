import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  light?: boolean;
}

export function KpiCard({ title, value, change, isPositive, icon: Icon, iconColorClass, iconBgClass, light }: KpiCardProps) {
  if (light) {
    return (
      <div className="bg-white border border-slate-200/80 shadow-sm p-5 rounded-[22px] hover:shadow-md transition-all duration-300 group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${iconBgClass}`}>
            <Icon size={18} className={iconColorClass} />
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {change}
          </div>
        </div>
        <h3 className="text-slate-500 text-xs font-semibold mb-1">{title}</h3>
        <p className="text-2xl font-black text-slate-800 group-hover:scale-[1.02] transform origin-left transition-transform duration-300">
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-5 rounded-2xl hover:border-white/[0.15] hover:shadow-xl hover:shadow-black transition-all duration-300 group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${iconBgClass}`}>
          <Icon size={20} className={iconColorClass} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white group-hover:scale-[1.02] transform origin-left transition-transform duration-300">
        {value}
      </p>
    </div>
  );
}

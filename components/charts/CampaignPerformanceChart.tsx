import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export interface CampaignPerformanceChartProps {
  data: Array<{ name: string; spend: number; revenue: number; [key: string]: any }>;
  light?: boolean;
}

export function CampaignPerformanceChart({ data, light }: CampaignPerformanceChartProps) {
  return (
    <div className={`${light ? 'bg-white border border-slate-200/80 shadow-sm' : 'bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'} p-6 rounded-3xl transition-colors h-full w-full`}>
      <h2 className={`text-lg font-bold ${light ? 'text-slate-800' : 'text-white'} mb-6`}>Campaign Performance (Spend vs Revenue)</h2>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke={light ? '#e2e8f0' : '#334155'} vertical={false} />
            <XAxis dataKey="name" stroke={light ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={light ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
            <RechartsTooltip 
              cursor={light ? { fill: '#f1f5f9' } : { fill: '#1e293b' }}
              contentStyle={light ? { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } : { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="spend" name="Ad Spend" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export interface EngagementChartProps {
  data: Array<{ name: string; reach: number; engagement: number; [key: string]: any }>;
  light?: boolean;
}

export function EngagementChart({ data, light }: EngagementChartProps) {
  return (
    <div className={`${light ? 'bg-white border border-slate-200/80 shadow-sm' : 'bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'} p-6 rounded-3xl transition-colors h-full w-full`}>
      <h2 className={`text-lg font-bold ${light ? 'text-slate-800' : 'text-white'} mb-6`}>Engagement & Reach Timeline</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={light ? '#e2e8f0' : '#334155'} vertical={false} />
            <XAxis dataKey="name" stroke={light ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={light ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
            <RechartsTooltip 
              contentStyle={light ? { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } : { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              itemStyle={light ? { color: '#334155' } : { color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="reach" name="Total Reach" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: light ? '#ffffff' : '#0f172a' }} activeDot={{ r: 6, fill: '#8b5cf6' }} />
            <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: light ? '#ffffff' : '#0f172a' }} activeDot={{ r: 6, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

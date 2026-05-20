import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export interface EngagementAreaChartProps {
  data: Array<{ name: string; engagement: number; ctr: number; [key: string]: any }>;
  light?: boolean;
}

export function EngagementAreaChart({ data, light }: EngagementAreaChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={light ? 0.15 : 0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={light ? 0.15 : 0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={light ? "#e2e8f0" : "#1e293b"} vertical={false} />
          <XAxis dataKey="name" stroke={light ? "#94a3b8" : "#64748b"} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={light ? "#94a3b8" : "#64748b"} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: light ? '#ffffff' : '#0f172a', 
              borderColor: light ? '#e2e8f0' : '#1e293b', 
              borderRadius: '12px', 
              color: light ? '#0f172a' : '#f8fafc',
              fontSize: '11px',
              boxShadow: light ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}
            itemStyle={{ color: light ? '#334155' : '#e2e8f0' }}
          />
          <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
          <Area type="monotone" dataKey="ctr" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCtr)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

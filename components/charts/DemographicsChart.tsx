import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export interface DemographicsChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  light?: boolean;
}

export function DemographicsChart({ data, colors, light }: DemographicsChartProps) {
  return (
    <div className={`${light ? 'bg-white border border-slate-200/80 shadow-sm' : 'bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'} p-6 rounded-3xl transition-colors h-full w-full`}>
      <h2 className={`text-lg font-bold ${light ? 'text-slate-800' : 'text-white'} mb-6`}>Audience Demographics</h2>
      <div className="h-[300px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={light ? { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } : { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              itemStyle={light ? { color: '#0f172a' } : { color: '#e2e8f0' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

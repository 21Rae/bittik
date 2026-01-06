
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketMetrics } from '../types';

interface MetricGraphProps {
  data: MarketMetrics[];
  dataKey: keyof MarketMetrics;
  color: string;
  label: string;
}

export const MetricGraph: React.FC<MetricGraphProps> = ({ data, dataKey, color, label }) => {
  const latestValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
  
  return (
    <div className="glass p-5 rounded-2xl flex flex-col h-full transition-all hover:border-slate-600 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</h3>
          <p className="text-2xl font-extrabold text-white tracking-tight mono">
            {typeof latestValue === 'number' && dataKey.includes('Price') ? `$${latestValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 
             typeof latestValue === 'number' && dataKey.includes('Dominance') ? `${latestValue.toFixed(1)}%` :
             latestValue}
          </p>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      
      <div className="h-32 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f8fafc' 
              }}
              labelFormatter={(val) => new Date(val).toLocaleDateString()}
              cursor={{ stroke: color, strokeWidth: 1 }}
            />
            <Area 
              type="basis" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#grad-${dataKey})`} 
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

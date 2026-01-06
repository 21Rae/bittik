
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Bar, BarChart, Cell, ReferenceLine
} from 'recharts';
import { MarketMetrics, TimeFrame } from '../types';

interface DetailedChartsProps {
  data: MarketMetrics[];
  timeframe: TimeFrame;
}

export const DetailedCharts: React.FC<DetailedChartsProps> = ({ data, timeframe }) => {
  const formatDate = (val: string) => {
    const d = new Date(val);
    if (timeframe === 'daily') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeframe === 'weekly') return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
  };

  const chartCard = (title: string, children: React.ReactNode, fullWidth = false) => (
    <div className={`glass p-6 rounded-3xl border-slate-800 transition-all hover:border-slate-700 ${fullWidth ? 'lg:col-span-2' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
        {fullWidth && (
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">High Precision</span>
        )}
      </div>
      <div className="h-72 w-full">
        {children}
      </div>
    </div>
  );

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{new Date(label).toLocaleString()}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                <span className="text-xs font-bold text-slate-400">{entry.name}:</span>
              </div>
              <span className="text-sm font-black text-slate-100 mono">{entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Focused Price Action - Dual Axis for Daily View */}
      {timeframe === 'daily' && chartCard("BTC & ETH Price Momentum (Focused)", (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBtcFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEthFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} />
            <YAxis yAxisId="btc" hide domain={['auto', 'auto']} />
            <YAxis yAxisId="eth" orientation="right" hide domain={['auto', 'auto']} />
            <Tooltip content={customTooltip} />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Area 
              yAxisId="btc" 
              type="monotone" 
              dataKey="btcPrice" 
              name="BTC Price" 
              stroke="#f59e0b" 
              fill="url(#colorBtcFocus)" 
              strokeWidth={3} 
              dot={false}
              animationDuration={1200}
            />
            <Area 
              yAxisId="eth" 
              type="monotone" 
              dataKey="ethPrice" 
              name="ETH Price" 
              stroke="#6366f1" 
              fill="url(#colorEthFocus)" 
              strokeWidth={3} 
              dot={false}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      ), true)}

      {/* Price vs Volume Chart */}
      {timeframe === 'daily' && chartCard("Daily Market Activity (Price & Volume)", (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} />
            <YAxis yAxisId="left" hide domain={['auto', 'auto']} />
            <YAxis yAxisId="right" hide orientation="right" />
            <Tooltip content={customTooltip} />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Area yAxisId="left" type="monotone" dataKey="btcPrice" name="BTC Price ($)" stroke="#f59e0b" fill="url(#colorPrice)" strokeWidth={3} dot={false} />
            <Bar yAxisId="right" dataKey="tradingVolume" name="Trade Volume ($B)" fill="#334155" opacity={0.4} radius={[4, 4, 0, 0]} barSize={30} />
          </ComposedChart>
        </ResponsiveContainer>
      ), true)}

      {/* Asset Correlation with Dual Axis */}
      {chartCard("Asset Correlation (BTC vs ETH)", (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} minTickGap={30} />
            <YAxis yAxisId="btc" hide domain={['auto', 'auto']} />
            <YAxis yAxisId="eth" hide orientation="right" domain={['auto', 'auto']} />
            <Tooltip content={customTooltip} />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Line yAxisId="btc" type="monotone" dataKey="btcPrice" name="BTC" stroke="#f59e0b" strokeWidth={3} dot={false} animationDuration={1000} />
            <Line yAxisId="eth" type="monotone" dataKey="ethPrice" name="ETH" stroke="#6366f1" strokeWidth={3} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      ))}

      {chartCard("Dominance vs Sentiment", (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={customTooltip} />
            <Area type="monotone" dataKey="btcDominance" name="BTC Dom %" stroke="#6366f1" fillOpacity={1} fill="url(#colorDom)" strokeWidth={2} />
            <Line type="monotone" dataKey="memeVelocity" name="Social Velocity" stroke="#ec4899" strokeWidth={2} dot={{r: 4}} />
          </AreaChart>
        </ResponsiveContainer>
      ))}

      {chartCard("Infrastructure Usage (TVL & L2)", (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} />
            <YAxis hide />
            <Tooltip content={customTooltip} />
            <Bar dataKey="totalTvl" name="Total TVL ($B)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            <Line type="stepAfter" dataKey="ethL2Volume" name="L2 Volume ($B)" stroke="#8b5cf6" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      ))}

      {chartCard("Institutional Flux (ETF Flows)", (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
             <XAxis dataKey="timestamp" tickFormatter={formatDate} tick={{fill: '#475569', fontSize: 10}} />
             <YAxis hide />
             <Tooltip content={customTooltip} />
             <ReferenceLine y={0} stroke="#475569" />
             <Bar dataKey="etfNetFlows" name="Net Inflow ($M)" radius={[4, 4, 0, 0]}>
               {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.etfNetFlows > 0 ? '#10b981' : '#ef4444'} />
               ))}
             </Bar>
          </BarChart>
        </ResponsiveContainer>
      ))}
    </div>
  );
};

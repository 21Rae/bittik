
import { MarketMetrics, SignalFlag, SignalType, TimeFrame } from '../types';

export const generateMockMetrics = (timeframe: TimeFrame = 'daily'): MarketMetrics[] => {
  const now = new Date();
  let length = 7; // default daily
  let step = 1; // 1 day steps
  
  if (timeframe === 'weekly') {
    length = 12; // 12 weeks
    step = 7;
  } else if (timeframe === 'monthly') {
    length = 12; // 12 months
    step = 30;
  }

  return Array.from({ length }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (length - 1 - i) * step);
    
    // Add some trend/volatility to the mock data
    const trend = i * 200; 
    return {
      timestamp: d.toISOString(),
      btcPrice: 90000 + trend + Math.random() * 5000,
      ethPrice: 2400 + (trend / 40) + Math.random() * 300,
      btcDominance: 52 + Math.random() * 2,
      stablecoinCap: 160 + (i * 0.5),
      totalTvl: 80 + (i * 1.2),
      ethL2Volume: 15 + (i * 0.8) + Math.random() * 2,
      etfNetFlows: Math.random() * 800 - 200,
      memeVelocity: 40 + Math.random() * 60,
      tradingVolume: 40 + Math.random() * 40 + (i * 2), // Mock volume in billions
    };
  });
};

export const detectSignals = (metrics: MarketMetrics[]): SignalFlag[] => {
  if (metrics.length < 2) return [];
  const latest = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];
  
  const signals: SignalFlag[] = [];

  if (latest.btcDominance < previous.btcDominance - 0.5) {
    signals.push({
      id: 'sig-1',
      type: SignalType.ROTATION,
      severity: 'info',
      title: 'Altcoin Rotation Signal',
      description: 'BTC dominance cooling off, suggesting capital moving into high-beta assets.',
      timestamp: new Date().toISOString(),
      source: 'On-chain Dominance Tracking',
    });
  }

  if (latest.etfNetFlows > 400) {
    signals.push({
      id: 'sig-2',
      type: SignalType.LIQUIDITY_SHIFT,
      severity: 'info',
      title: 'Institutional Inflow Surge',
      description: 'Major ETF buy-side pressure detected in the last 24h window.',
      timestamp: new Date().toISOString(),
      source: 'SEC Filings / Bloomberg',
    });
  }

  if (Math.random() > 0.8) {
    signals.push({
      id: 'sig-3',
      type: SignalType.RISK_EVENT,
      severity: 'warning',
      title: 'MEV Relay Latency Warning',
      description: 'Anomalous block construction patterns detected on major relays.',
      timestamp: new Date().toISOString(),
      source: 'Security Monitor Bot',
    });
  }

  if (latest.memeVelocity > 85) {
    signals.push({
      id: 'sig-4',
      type: SignalType.SOCIAL_VELOCITY,
      severity: 'critical',
      title: 'Social Peak Alert',
      description: 'Retail engagement metrics hitting extreme overbought territory.',
      timestamp: new Date().toISOString(),
      source: 'Social Intelligence Engine',
    });
  }

  return signals;
};

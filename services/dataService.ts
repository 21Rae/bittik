
import { MarketMetrics, SignalFlag, SignalType } from '../types';

export const generateMockMetrics = (): MarketMetrics[] => {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return {
      timestamp: d.toISOString(),
      btcPrice: 90000 + Math.random() * 10000,
      ethPrice: 2500 + Math.random() * 500,
      btcDominance: 52 + Math.random() * 5,
      stablecoinCap: 160 + Math.random() * 10,
      totalTvl: 80 + Math.random() * 20,
      ethL2Volume: 15 + Math.random() * 5,
      etfNetFlows: Math.random() * 500 - 100,
      memeVelocity: Math.random() * 100,
    };
  });
};

export const detectSignals = (metrics: MarketMetrics[]): SignalFlag[] => {
  const latest = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];
  
  const signals: SignalFlag[] = [];

  // Logic: Capital Rotation
  if (latest.btcDominance < previous.btcDominance - 1) {
    signals.push({
      id: 'sig-1',
      type: SignalType.ROTATION,
      severity: 'info',
      title: 'Altcoin Rotation Signal',
      description: 'BTC dominance dropped by >1% while stablecoin market cap remained steady, suggesting internal capital flow.',
      timestamp: new Date().toISOString(),
      source: 'On-chain Dominance Tracking',
    });
  }

  // Logic: ETF Flows
  if (latest.etfNetFlows > 300) {
    signals.push({
      id: 'sig-2',
      type: SignalType.LIQUIDITY_SHIFT,
      severity: 'info',
      title: 'Institutional Inflow Surge',
      description: 'Daily ETF net flows exceeded $300M, indicating sustained institutional demand.',
      timestamp: new Date().toISOString(),
      source: 'SEC Filings / Bloomberg Terminals',
    });
  }

  // Logic: Risk Event (Mock)
  if (Math.random() > 0.7) {
    signals.push({
      id: 'sig-3',
      type: SignalType.RISK_EVENT,
      severity: 'warning',
      title: 'DeFi Bridge Exploit Detected',
      description: 'Anomalous outbound transactions detected on a cross-chain bridge protocol.',
      timestamp: new Date().toISOString(),
      source: 'Security Monitor Bot',
    });
  }

  // Logic: Meme Velocity
  if (latest.memeVelocity > 80) {
    signals.push({
      id: 'sig-4',
      type: SignalType.SOCIAL_VELOCITY,
      severity: 'critical',
      title: 'Speculative Social Spike',
      description: 'Meme coin social velocity is in the top 5th percentile, historical indicator of local tops.',
      timestamp: new Date().toISOString(),
      source: 'Social Intelligence Engine',
    });
  }

  return signals;
};

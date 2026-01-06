
export enum SignalType {
  ROTATION = 'ROTATION',
  LIQUIDITY_SHIFT = 'LIQUIDITY_SHIFT',
  NARRATIVE_EMERGENCE = 'NARRATIVE_EMERGENCE',
  RISK_EVENT = 'RISK_EVENT',
  SOCIAL_VELOCITY = 'SOCIAL_VELOCITY'
}

export interface MarketMetrics {
  timestamp: string;
  btcPrice: number;
  ethPrice: number;
  btcDominance: number;
  stablecoinCap: number;
  totalTvl: number;
  ethL2Volume: number;
  etfNetFlows: number;
  memeVelocity: number;
}

export interface SignalFlag {
  id: string;
  type: SignalType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

export interface NarrativeInsight {
  title: string;
  content: string;
  behavioralContext: string;
  historicalComparison: string;
}

export interface GeneratedContent {
  id: string;
  type: 'newsletter' | 'journal' | 'email_hook' | 'blog_outline';
  title: string;
  body: string;
  timestamp: string;
}

export interface SystemState {
  metrics: MarketMetrics[];
  signals: SignalFlag[];
  narratives: NarrativeInsight[];
  isIngesting: boolean;
  lastIngestion: string;
}


import React, { useState, useEffect, useCallback } from 'react';
import { MarketMetrics, SignalFlag, NarrativeInsight, GeneratedContent, SignalType } from './types';
import { generateMockMetrics, detectSignals } from './services/dataService';
import { generateNarrative, generateAutomatedContent } from './services/geminiService';
import { MetricGraph } from './components/MetricGraph';

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<MarketMetrics[]>([]);
  const [signals, setSignals] = useState<SignalFlag[]>([]);
  const [narrative, setNarrative] = useState<NarrativeInsight | null>(null);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'narratives' | 'generator'>('dashboard');

  const runIngestion = useCallback(async () => {
    setLoading(true);
    try {
      const mockMetrics = generateMockMetrics();
      const detected = detectSignals(mockMetrics);
      setMetrics(mockMetrics);
      setSignals(detected);
      
      const narration = await generateNarrative(detected, mockMetrics);
      setNarrative(narration);

      const news = await generateAutomatedContent(narration, 'newsletter');
      const journal = await generateAutomatedContent(narration, 'journal');
      setContents([news, journal]);
    } catch (error) {
      console.error("Ingestion failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runIngestion();
  }, [runIngestion]);

  const SidebarItem = ({ id, label, icon }: { id: typeof view, label: string, icon: string }) => (
    <button 
      onClick={() => setView(id)}
      className={`flex items-center space-x-4 w-full p-4 rounded-xl transition-all duration-300 relative group ${
        view === id 
          ? 'bg-indigo-600/10 text-indigo-400' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {view === id && (
        <div className="absolute left-0 w-1.5 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
      )}
      <span className={`text-xl transition-transform group-hover:scale-110 ${view === id ? 'opacity-100' : 'opacity-60'}`}>{icon}</span>
      <span className="font-semibold text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 glass border-r border-slate-800 p-8 flex flex-col fixed h-full z-20">
        <div className="mb-12 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
            ES
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white">ETHERSENSE</h1>
            <p className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase">Intelligence</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          <SidebarItem id="dashboard" label="MARKET PULSE" icon="📊" />
          <SidebarItem id="narratives" label="NARRATIVE LAYER" icon="🧠" />
          <SidebarItem id="generator" label="CONTENT ENGINE" icon="✍️" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Health</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[94%]"></div>
            </div>
          </div>
          <button 
            onClick={runIngestion}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center space-x-3 group"
          >
            <span>{loading ? 'ANALYZING...' : 'REFRESH DATA'}</span>
            {!loading && <span className="group-hover:rotate-12 transition-transform">⚡</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 max-w-[1600px] mx-auto w-full">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-2">
              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
              <span>Secure Session Alpha-7</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight capitalize">
              {view === 'dashboard' ? 'Market Terminal' : view.replace('_', ' ')}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Last Sync</p>
            <p className="text-sm font-bold text-slate-300 mono">{new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-[3px] border-indigo-500/20 rounded-full"></div>
              <div className="w-20 h-20 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-full absolute top-5 left-5 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold tracking-widest text-sm mb-2 animate-pulse uppercase">Syncing On-Chain Streams</p>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-medium">Aggregating TVL, Exchange Flows, and Sentiment Vectors via Gemini 3 Flash...</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            {view === 'dashboard' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricGraph data={metrics} dataKey="btcPrice" color="#f59e0b" label="BTC/USD Index" />
                  <MetricGraph data={metrics} dataKey="btcDominance" color="#6366f1" label="Market Dominance" />
                  <MetricGraph data={metrics} dataKey="etfNetFlows" color="#10b981" label="Institutional Flux" />
                  <MetricGraph data={metrics} dataKey="memeVelocity" color="#ec4899" label="Meme Psychology" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mr-3 text-sm">🚩</span>
                        SIGNAL TRIAGE
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{signals.length} Anomalies Detected</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {signals.map(sig => (
                        <div key={sig.id} className={`p-6 rounded-2xl glass transition-all hover:translate-x-1 group ${
                          sig.severity === 'critical' ? 'border-red-500/30' : 
                          sig.severity === 'warning' ? 'border-amber-500/30' : 
                          'border-blue-500/30'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                  sig.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 
                                  sig.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {sig.type}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold mono">{new Date(sig.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">{sig.title}</h4>
                              <p className="text-sm text-slate-400 leading-relaxed font-medium">{sig.description}</p>
                            </div>
                            <div className="ml-6 flex flex-col items-end">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Source</span>
                              <span className="text-[10px] font-bold text-slate-300 mono bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">{sig.source}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mr-3 text-sm">🧠</span>
                      DIRECTIVE
                    </h3>
                    {narrative && (
                      <div className="glass p-8 rounded-3xl border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-indigo-500/10"></div>
                        <h4 className="text-indigo-400 text-sm font-black tracking-widest uppercase mb-4">{narrative.title}</h4>
                        <p className="text-slate-300 leading-relaxed font-medium mb-8">
                          {narrative.content.substring(0, 180)}...
                        </p>
                        <button 
                          onClick={() => setView('narratives')}
                          className="w-full py-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:border-indigo-500/30 transition-all flex items-center justify-center space-x-2"
                        >
                          <span>Detailed Briefing</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'narratives' && narrative && (
              <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
                <div className="glass bg-slate-900/40 p-12 rounded-[2.5rem] border-slate-800 relative shadow-2xl overflow-hidden">
                  <div className="absolute top-10 right-10 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div>
                  </div>

                  <div className="border-b border-slate-800 pb-10 mb-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      <span>Behavioral Analysis Active</span>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-tight mb-4">{narrative.title}</h3>
                    <div className="flex items-center space-x-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      <span>Doc: INT-09X-2025</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span>Clearance: Level 4</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span>Agent: EtherSense Engine</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    <section>
                      <h4 className="text-xs font-black uppercase text-indigo-500 tracking-[0.3em] mb-4">I. Primary Intelligence</h4>
                      <p className="text-xl text-slate-100 leading-relaxed font-medium">
                        {narrative.content}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <section className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-4">II. Market Psychology</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                          "{narrative.behavioralContext}"
                        </p>
                      </section>
                      <section className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-4">III. Historical Precedent</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                          {narrative.historicalComparison}
                        </p>
                      </section>
                    </div>

                    <div className="pt-10 border-t border-slate-800 flex flex-wrap gap-4">
                       <div className="px-5 py-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-4">
                          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xl">🔍</div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Impact Score</p>
                            <p className="text-lg font-black text-white mono">0.94</p>
                          </div>
                       </div>
                       <div className="px-5 py-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-4">
                          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl text-xl">⏳</div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Narrative Decay</p>
                            <p className="text-lg font-black text-white mono">14D</p>
                          </div>
                       </div>
                       <div className="px-5 py-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center space-x-4">
                          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl text-xl">⚖️</div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sentiment Vector</p>
                            <p className="text-lg font-black text-white mono">NEUTRAL</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'generator' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                {contents.map(item => (
                  <div key={item.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#fafafa] text-[#1a1a1a] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border border-white">
                      <div className="bg-[#f0f0f0] px-8 py-5 flex justify-between items-center border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            item.type === 'newsletter' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold mono">GEN-ID: {item.id}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-10 flex-1 overflow-auto max-h-[700px] custom-scrollbar">
                        <h3 className="text-3xl font-black mb-8 border-b-4 border-indigo-600 inline-block tracking-tighter">{item.title}</h3>
                        <div className="space-y-6">
                           {item.body.split('\n').map((line, i) => (
                             <p key={i} className={`leading-relaxed ${
                               line.startsWith('-') || line.startsWith('•') || line.match(/^\d\./) 
                               ? 'pl-6 text-slate-700 font-semibold relative before:content-[""] before:absolute before:left-0 before:top-3 before:w-1.5 before:h-1.5 before:bg-indigo-500 before:rounded-full' 
                               : line.length < 50 ? 'text-lg font-black text-slate-900 tracking-tight' : 'text-slate-600 font-medium'
                             }`}>
                               {line.startsWith('-') || line.startsWith('•') ? line.substring(1).trim() : line}
                             </p>
                           ))}
                        </div>
                      </div>
                      <div className="bg-[#f0f0f0] p-6 flex items-center justify-between border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Syndication Pipeline Ready</span>
                        <div className="flex items-center space-x-4">
                           <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Deploy Content</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

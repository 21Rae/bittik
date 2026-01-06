
import { GoogleGenAI, Type } from "@google/genai";
import { SignalFlag, MarketMetrics, NarrativeInsight, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNarrative = async (signals: SignalFlag[], metrics: MarketMetrics[]): Promise<NarrativeInsight> => {
  const latestMetrics = metrics[metrics.length - 1];
  const prompt = `Analyze the following crypto market signals and metrics:
  Signals: ${JSON.stringify(signals)}
  Latest Metrics: ${JSON.stringify(latestMetrics)}
  
  Generate a narrative intelligence report including:
  1. A concise headline title.
  2. Content: Translate signals into a readable narrative (e.g., "Capital is rotating from X to Y because Z").
  3. Behavioral Context: Explain the market psychology behind this behavior.
  4. Historical Comparison: How this behavior compares to previous cycles.
  
  TONE: Neutral, analytical, educational, non-promotional. Use simple language.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          behavioralContext: { type: Type.STRING },
          historicalComparison: { type: Type.STRING },
        },
        required: ["title", "content", "behavioralContext", "historicalComparison"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateAutomatedContent = async (narrative: NarrativeInsight, type: string): Promise<GeneratedContent> => {
  const prompt = `Based on this market narrative: "${narrative.content}", generate a ${type}.
  
  If type is 'newsletter', include:
  - "Market Pulse" section (BTC/ETH snapshot)
  - "Narrative Watch" (the main trend)
  - "Risk Report" (security/macro threats)
  
  If type is 'journal', generate 3 reflection-based questions for an investor or builder.
  
  If type is 'email_hook', generate 5 high-open-rate subject lines.
  
  TONE: Educational, Analytical, Professional.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["title", "body"]
      }
    }
  });

  const res = JSON.parse(response.text);
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: type as any,
    title: res.title,
    body: res.body,
    timestamp: new Date().toISOString(),
  };
};

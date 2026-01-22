import { GoogleGenAI, Type } from "@google/genai";
import { SleepSession, AnalysisResult } from '../types';

export const analyzeSleep = async (sessions: SleepSession[]): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Filter last 7 days for relevant analysis
  const recentSessions = sessions.slice(0, 10);
  
  const prompt = `
    Actúa como un experto somnólogo avanzado. Analiza los siguientes datos de sueño de un usuario (formato JSON).
    Proporciona un resumen científico pero fácil de entender, una puntuación de sueño (0-100) basada en la consistencia y duración, y 3 consejos prácticos.
    El tono debe ser futurista, alentador y profesional.
    Datos: ${JSON.stringify(recentSessions)}
    
    Responde estrictamente en JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            score: { type: Type.INTEGER },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "score", "tips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "No se pudo conectar con la red neuronal de análisis. Intenta más tarde.",
      score: 0,
      tips: ["Verifica tu conexión a internet."]
    };
  }
};

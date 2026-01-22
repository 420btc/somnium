import { GoogleGenAI, Type } from "@google/genai";
import { SleepSession, AnalysisResult, DreamEntry, DailyJournalEntry } from '../types';

export const analyzeSleep = async (sessions: SleepSession[]): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const analyzeDreamsAndHabits = async (
  sessions: SleepSession[],
  dreams: DreamEntry[],
  journal: DailyJournalEntry[]
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const recentSessions = sessions.slice(0, 10);
  const recentDreams = dreams.slice(0, 20);
  const recentJournal = journal.slice(0, 20);

  const prompt = `
    Actúa como un somnólogo e investigador de sueños de alto nivel.
    Recibirás TRES bloques de información en JSON:
    1) sesiones de sueño (horas y duración),
    2) diario de sueños (contenido, emociones, pesadillas, lucidez),
    3) journal diario (estado de ánimo, estrés, hábitos).

    Debes:
    - Detectar patrones entre sueños, calidad de sueño y hábitos diarios.
    - Valorar la salud del sueño y del mundo onírico del usuario con una puntuación 0-100.
    - Ofrecer 3-4 recomendaciones muy concretas, accionables y personalizadas.
    - Mantener un tono científico pero cercano, futurista y motivador.

    SESIONES_DE_SUEÑO: ${JSON.stringify(recentSessions)}
    SUEÑOS: ${JSON.stringify(recentDreams)}
    JOURNAL_DIARIO: ${JSON.stringify(recentJournal)}

    Devuelve estrictamente un objeto JSON con:
    {
      "summary": "texto resumen en español",
      "score": 0-100,
      "tips": ["consejo 1", "consejo 2", "consejo 3"]
    }
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
    console.error("Gemini Dreams Analysis Error:", error);
    return {
      summary: "No se pudo generar el análisis combinado de sueños y hábitos. Intenta más tarde.",
      score: 0,
      tips: ["Verifica tu conexión a internet.", "Revisa que tu clave de API sea válida."]
    };
  }
};

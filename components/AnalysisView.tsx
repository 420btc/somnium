import React, { useState } from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';
import { SleepSession, AnalysisResult } from '../types';
import { analyzeSleep, analyzeDreamsAndHabits } from '../services/geminiService';
import { getDreamEntries, getDailyJournalEntries } from '../services/storage';

interface AnalysisViewProps {
  data: SleepSession[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'sleepOnly' | 'dreamsAndHabits'>('dreamsAndHabits');

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      let result: AnalysisResult;
      if (mode === 'sleepOnly') {
        result = await analyzeSleep(data);
      } else {
        const dreams = getDreamEntries();
        const journal = getDailyJournalEntries();
        result = await analyzeDreamsAndHabits(data, dreams, journal);
      }
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
        <Brain className="w-16 h-16 text-zinc-700 mb-6" />
        <h2 className="text-xl font-bold mb-2">Datos Insuficientes</h2>
        <p className="text-zinc-500">Necesitas al menos 2 registros de sueño para generar un estudio neuronal avanzado.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 animate-in fade-in duration-500">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent">
          Estudio de Sueño
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Análisis profundo de sueño, sueños y hábitos impulsado por Gemini AI
        </p>
      </div>

      {!analysis && !loading && (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <Sparkles className="w-12 h-12 text-white mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Generar Informe IA</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Nuestros algoritmos analizarán tus patrones nocturnos y sueños para detectar anomalías y oportunidades de mejora.
          </p>
          <div className="flex items-center justify-center gap-2 mb-4 text-[10px] uppercase tracking-[0.22em]">
            <button
              type="button"
              onClick={() => setMode('dreamsAndHabits')}
              className={`px-3 py-1 rounded-full border ${
                mode === 'dreamsAndHabits'
                  ? 'bg-white text-black border-white'
                  : 'bg-black/40 text-zinc-400 border-white/10'
              }`}
            >
              Sueño + sueños + hábitos
            </button>
            <button
              type="button"
              onClick={() => setMode('sleepOnly')}
              className={`px-3 py-1 rounded-full border ${
                mode === 'sleepOnly'
                  ? 'bg-white text-black border-white'
                  : 'bg-black/40 text-zinc-400 border-white/10'
              }`}
            >
              Solo sueño
            </button>
          </div>
          <button 
            onClick={handleAnalyze}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
          >
            <Zap size={18} fill="currentColor" /> INICIAR ANÁLISIS
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-6"></div>
          <p className="text-zinc-400 animate-pulse text-sm tracking-widest uppercase">Procesando datos neuronales...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="flex items-center justify-between p-6 bg-zinc-900/80 border border-white/10 rounded-3xl backdrop-blur-md">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Puntuación de Salud</p>
              <p className="text-4xl font-display font-bold text-white">{analysis.score}/100</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${analysis.score > 80 ? 'border-green-500/50 text-green-400' : analysis.score > 60 ? 'border-yellow-500/50 text-yellow-400' : 'border-red-500/50 text-red-400'}`}>
              <Brain size={24} />
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-glass-white border border-white/5 rounded-3xl">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-200" /> Resumen Ejecutivo
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              {analysis.summary}
            </p>
          </div>

          {/* Tips */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-widest text-zinc-500 ml-2">Recomendaciones</h3>
            {analysis.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-zinc-900 border border-white/5 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <p className="text-zinc-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setAnalysis(null)} 
            className="w-full py-4 mt-4 text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            Realizar nuevo análisis
          </button>
        </div>
      )}
    </div>
  );
};

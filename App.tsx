import React, { useState, useEffect } from 'react';
import { GiantClock } from './components/GiantClock';
import { SleepControls } from './components/SleepControls';
import { ChartsSection } from './components/ChartsSection';
import { HistoryList } from './components/HistoryList';
import { AnalysisView } from './components/AnalysisView';
import { Navbar } from './components/Navbar';
import { DreamDiary } from './components/DreamDiary';
import { EnergyBeamMemo } from './components/EnergyBeam';
import { AppScreen, DailyJournalEntry, SleepSession } from './types';
import { getDailyJournalEntries, getSleepHistory } from './services/storage';

const App: React.FC = () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [screen, setScreen] = useState<AppScreen>(AppScreen.CLOCK);
  const [history, setHistory] = useState<SleepSession[]>([]);
  const [journalToday, setJournalToday] = useState<DailyJournalEntry | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('somnium_theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const [wakeUpTime, setWakeUpTime] = useState<string>(() => {
    const stored = localStorage.getItem('somnium_wake_time');
    return stored && stored.trim().length > 0 ? stored : '07:00';
  });
  const [sleepGoalHours, setSleepGoalHours] = useState<number>(() => {
    const stored = localStorage.getItem('somnium_sleep_goal');
    const parsed = stored ? Number(stored) : 8;
    return Number.isNaN(parsed) ? 8 : parsed;
  });
  const [isSleeping, setIsSleeping] = useState(false);
  const [showSleepNav, setShowSleepNav] = useState(false);
  const [ritualChecks, setRitualChecks] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('somnium_ritual');
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.date === todayKey && parsed?.checks) {
        return parsed.checks as Record<string, boolean>;
      }
    } catch {
      return {};
    }
    return {};
  });
  const titleGradient = theme === 'light' ? 'from-black via-zinc-700 to-zinc-500' : 'from-white via-zinc-200 to-zinc-600';
  const cardSurface = theme === 'light' ? 'bg-white/80 border-zinc-200 text-black' : 'bg-black/70 border-white/10 text-white';

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('somnium_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('somnium_sleep_goal', String(sleepGoalHours));
  }, [sleepGoalHours]);

  useEffect(() => {
    localStorage.setItem('somnium_wake_time', wakeUpTime);
  }, [wakeUpTime]);

  useEffect(() => {
    localStorage.setItem('somnium_ritual', JSON.stringify({ date: todayKey, checks: ritualChecks }));
  }, [ritualChecks, todayKey]);

  const refreshData = () => {
    setHistory(getSleepHistory());
    const journalEntries = getDailyJournalEntries();
    const todayEntry = journalEntries.find(entry => entry.date === todayKey) ?? null;
    setJournalToday(todayEntry);
  };

  const ritualSteps = [
    { id: 'pantallas', label: 'Pantallas off' },
    { id: 'respirar', label: 'Respiracion 2 min' },
    { id: 'agua', label: 'Agua ligera' },
    { id: 'entorno', label: 'Luz tenue' },
    { id: 'diario', label: 'Diario rapido' }
  ];

  const toggleRitual = (id: string) => {
    setRitualChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const recentSessions = history.slice(0, 7);
  const goalMinutes = sleepGoalHours * 60;
  const totalMinutes = recentSessions.reduce((acc, session) => acc + session.durationMinutes, 0);
  const averageHours = recentSessions.length > 0 ? totalMinutes / 60 / recentSessions.length : 0;
  const averageQuality = recentSessions.length > 0
    ? recentSessions.reduce((acc, session) => acc + (session.quality ?? 3), 0) / recentSessions.length
    : 3;
  const sleepDebtMinutes = recentSessions.reduce(
    (acc, session) => acc + Math.max(0, goalMinutes - session.durationMinutes),
    0
  );
  const streakCount = history.reduce((acc, session) => {
    if (session.durationMinutes >= goalMinutes && acc === history.indexOf(session)) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const startMinutes = recentSessions
    .map(session => {
      const date = new Date(session.startTime);
      return date.getHours() * 60 + date.getMinutes();
    });
  const meanStart = startMinutes.length > 0
    ? startMinutes.reduce((acc, value) => acc + value, 0) / startMinutes.length
    : 0;
  const varianceStart = startMinutes.length > 0
    ? startMinutes.reduce((acc, value) => acc + Math.pow(value - meanStart, 2), 0) / startMinutes.length
    : 0;
  const deviationHours = Math.sqrt(varianceStart) / 60;
  const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - deviationHours * 18)));
  const journalStress = journalToday?.stressLevel ?? 3;
  const readinessBase = Math.min(1.2, averageHours / sleepGoalHours) * 70 + (averageQuality / 5) * 30;
  const readinessPenalty = Math.max(0, journalStress - 3) * 6;
  const readinessScore = Math.max(0, Math.min(100, Math.round(readinessBase - readinessPenalty)));
  const ritualCompleted = ritualSteps.filter(step => ritualChecks[step.id]).length;
  const lastSession = history[0] ?? null;
  const lastStart = lastSession ? new Date(lastSession.startTime) : null;
  const lastEnd = lastSession?.endTime ? new Date(lastSession.endTime) : null;
  const lastDurationHours = lastSession ? lastSession.durationMinutes / 60 : 0;
  const averageStartLabel = startMinutes.length > 0 ? Math.round(meanStart) : null;
  const recommendation = (() => {
    if (sleepDebtMinutes > 120) {
      return 'Deuda alta: intenta acostarte 30-60 min antes.';
    }
    if (averageHours < sleepGoalHours - 0.5) {
      return 'Promedio bajo: busca completar el objetivo semanal.';
    }
    if (consistencyScore < 60) {
      return 'Horarios variables: intenta repetir la hora de dormir.';
    }
    return 'Ritmo estable: mantén el ritual y luz tenue.';
  })();

  const formatClockTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatMinutesClock = (minutes: number | null) => {
    if (minutes === null || Number.isNaN(minutes)) return '--:--';
    const total = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen overflow-x-hidden pb-20 selection:bg-white selection:text-black ${theme === 'light' ? 'bg-zinc-100 text-black' : 'bg-black text-white'}`}>
      <div className={`fixed inset-0 w-screen h-screen pointer-events-none z-0 transition-opacity duration-700 ${screen === AppScreen.CLOCK ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 opacity-90">
          <EnergyBeamMemo className="w-full h-full hue-rotate-[205deg] saturate-[0.35] brightness-[1.15]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),rgba(110,168,255,0.12)_45%,rgba(0,0,0,0)_70%)] opacity-60 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.62)_60%,rgba(0,0,0,0.86)_100%)]"></div>
      </div>

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 ${theme === 'light' ? 'bg-black/10' : 'bg-white/5'}`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 ${theme === 'light' ? 'bg-black/10' : 'bg-zinc-800/20'}`}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto min-h-screen flex flex-col">
          

          {/* Content Area */}
          <main className="flex-1 flex flex-col">
          {screen === AppScreen.CLOCK && (
            <div
              className={`flex-1 flex flex-col animate-in fade-in duration-500 transition-all ease-out ${
                isSleeping ? 'translate-y-2 opacity-90' : 'translate-y-0 opacity-100'
              }`}
            >
              <section className="min-h-[100svh] flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <GiantClock />
                </div>
                <div className="mt-auto pb-24">
                  <SleepControls onSessionUpdate={refreshData} onSleepStateChange={setIsSleeping} />
                </div>
              </section>

              {!isSleeping && (
                <section className="pb-16 pt-16">
                  {/* Mini Stats Preview */}
                  <div className="px-6 mt-2">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-white/60 font-light mb-2 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
                      <span>Hoy</span>
                      <span>{history.length > 0 ? (history[0].durationMinutes / 60).toFixed(1) + 'h' : '--'}</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/80 transition-all duration-1000"
                        style={{
                          width: history.length > 0
                            ? `${Math.min((history[0].durationMinutes / (sleepGoalHours * 60)) * 100, 100)}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="px-6 mt-8 grid grid-cols-2 gap-5">
                    <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] opacity-50 pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Somnium Pulse</p>
                          <p className="text-sm text-white">Ultimos 7 dias</p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.24em] ${consistencyScore > 75 ? 'text-emerald-300' : consistencyScore > 55 ? 'text-amber-300' : 'text-rose-300'}`}>
                          Consistencia {consistencyScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Indice</p>
                          <p className="text-2xl font-display text-white">{readinessScore}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Promedio</p>
                          <p className="text-2xl font-display text-white">{averageHours.toFixed(1)}h</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Deuda</p>
                          <p className="text-2xl font-display text-white">{(sleepDebtMinutes / 60).toFixed(1)}h</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Racha</p>
                          <p className="text-2xl font-display text-white">{streakCount} dias</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Estado hoy</p>
                          <p className="text-sm text-white">
                            {journalToday
                              ? `Estres ${journalStress}/5`
                              : 'Sin diario rapido'}
                          </p>
                        </div>
                        <button
                          onClick={() => setScreen(AppScreen.ANALYSIS)}
                          className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.24em] border border-white/15 text-white/70 hover:text-white"
                        >
                          Ver analisis
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_60%)] opacity-60 pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Ultima noche</p>
                          <p className="text-sm text-white">Detalle del ultimo registro</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                          {lastSession ? `Calidad ${lastSession.quality ?? 3}/5` : 'Sin datos'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Duracion</p>
                          <p className="text-2xl font-display text-white">
                            {lastSession ? `${lastDurationHours.toFixed(1)}h` : '--'}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Calidad</p>
                          <p className="text-2xl font-display text-white">
                            {lastSession ? `${lastSession.quality ?? 3}/5` : '--'}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Inicio</p>
                          <p className="text-2xl font-display text-white">{formatClockTime(lastStart)}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Fin</p>
                          <p className="text-2xl font-display text-white">{formatClockTime(lastEnd)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        <span>Promedio calidad {averageQuality.toFixed(1)}/5</span>
                        <span>Deuda {Math.max(0, sleepDebtMinutes / 60).toFixed(1)}h</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:160%_160%] opacity-40 pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Ritmo circadiano</p>
                          <p className="text-sm text-white">Regularidad y promedio</p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.24em] ${consistencyScore > 75 ? 'text-emerald-300' : consistencyScore > 55 ? 'text-amber-300' : 'text-rose-300'}`}>
                          {consistencyScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Hora media</p>
                          <p className="text-2xl font-display text-white">{formatMinutesClock(averageStartLabel)}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Variacion</p>
                          <p className="text-2xl font-display text-white">{deviationHours.toFixed(1)}h</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Meta</p>
                          <p className="text-2xl font-display text-white">{sleepGoalHours}h</p>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-zinc-400">
                        {recommendation}
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:160%_160%] opacity-40 pointer-events-none"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Ventana ideal</p>
                          <p className="text-sm text-white">Para despertar a las {wakeUpTime}</p>
                        </div>
                        <button
                          onClick={() => setScreen(AppScreen.SETTINGS)}
                          className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.24em] border border-white/15 text-white/70 hover:text-white"
                        >
                          Ajustar
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Dormir a las</p>
                          <p className="text-2xl font-display text-white">
                            {(() => {
                              if (!wakeUpTime) return '--:--';
                              const [h, m] = wakeUpTime.split(':').map(Number);
                              const target = new Date();
                              target.setHours(h, m, 0, 0);
                              target.setTime(target.getTime() - sleepGoalHours * 60 * 60 * 1000);
                              return formatClockTime(target);
                            })()}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/10 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">Meta</p>
                          <p className="text-2xl font-display text-white">{sleepGoalHours}h</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)] opacity-60 pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Ritual nocturno</p>
                          <p className="text-sm text-white">{ritualCompleted} de {ritualSteps.length} completado</p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.24em] ${ritualCompleted === ritualSteps.length ? 'text-emerald-300' : 'text-zinc-500'}`}>
                          {ritualCompleted === ritualSteps.length ? 'Listo' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ritualSteps.map(step => (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => toggleRitual(step.id)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] border transition-colors ${
                              ritualChecks[step.id]
                                ? 'bg-white text-black border-white'
                                : 'bg-zinc-950 text-zinc-400 border-white/10'
                            }`}
                          >
                            {step.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {screen === AppScreen.STATS && (
            <div className="px-4 py-2 animate-in fade-in duration-500">
              <h1 className={`text-3xl font-display font-bold mb-6 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent px-2`}>
                Métricas
              </h1>
              <ChartsSection data={history} />
            </div>
          )}

          {screen === AppScreen.HISTORY && (
            <div className="px-4 py-2 animate-in fade-in duration-500">
              <h1 className={`text-3xl font-display font-bold mb-6 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent px-2`}>
                Historial
              </h1>
              <HistoryList data={history} onUpdate={refreshData} />
            </div>
          )}

          {screen === AppScreen.DREAMS && (
            <DreamDiary />
          )}

          {screen === AppScreen.ANALYSIS && (
            <AnalysisView data={history} />
          )}

          {screen === AppScreen.SETTINGS && (
            <div className="px-4 pb-24 animate-in fade-in duration-500">
              <h1 className={`text-3xl font-display font-bold mb-6 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent px-2`}>
                Preferencias
              </h1>
              <div className="space-y-4">
                <div className={`p-5 rounded-3xl border backdrop-blur-xl ${cardSurface}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-zinc-500">Tema</p>
                      <p className="font-semibold mt-1">Dark / Light</p>
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${theme === 'light' ? 'bg-black/5 border-black/10 text-black' : 'bg-white/10 border-white/10 text-white'}`}
                    >
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                </div>
                <div className={`p-5 rounded-3xl border backdrop-blur-xl ${cardSurface}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-zinc-500">Objetivo</p>
                      <p className="font-semibold mt-1">Horas de sueño</p>
                    </div>
                    <select
                      value={sleepGoalHours}
                      onChange={(e) => setSleepGoalHours(Number(e.target.value))}
                      className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] focus:outline-none border ${theme === 'light' ? 'bg-black/5 border-black/10 text-black' : 'bg-zinc-950/70 border-white/10 text-white'}`}
                    >
                      {[6, 7, 8, 9, 10].map((hours) => (
                        <option key={hours} value={hours}>{hours}h</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={`p-5 rounded-3xl border backdrop-blur-xl ${cardSurface}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-zinc-500">Despertar</p>
                      <p className="font-semibold mt-1">Hora objetivo</p>
                    </div>
                    <input
                      type="time"
                      value={wakeUpTime}
                      onChange={(e) => setWakeUpTime(e.target.value)}
                      className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] focus:outline-none border ${theme === 'light' ? 'bg-black/5 border-black/10 text-black' : 'bg-zinc-950/70 border-white/10 text-white'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          </main>

          <div
            className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-out ${
              isSleeping && !showSleepNav
                ? 'translate-y-full opacity-0 pointer-events-none'
                : 'translate-y-0 opacity-100'
            }`}
          >
            <Navbar currentScreen={screen} onNavigate={setScreen} />
          </div>
          {isSleeping && (
            <button
              type="button"
              aria-label="Mostrar navegación"
              onClick={() => setShowSleepNav(true)}
              onMouseEnter={() => setShowSleepNav(true)}
              onMouseLeave={() => setShowSleepNav(false)}
              className="fixed bottom-0 left-0 right-0 z-40 h-6"
            />
          )}
      </div>
    </div>
  );
};

export default App;

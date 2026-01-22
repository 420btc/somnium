import React, { useState, useEffect } from 'react';
import { GiantClock } from './components/GiantClock';
import { SleepControls } from './components/SleepControls';
import { ChartsSection } from './components/ChartsSection';
import { HistoryList } from './components/HistoryList';
import { AnalysisView } from './components/AnalysisView';
import { Navbar } from './components/Navbar';
import { DreamDiary } from './components/DreamDiary';
import { EnergyBeam } from './components/EnergyBeam';
import { AppScreen, SleepSession } from './types';
import { getSleepHistory } from './services/storage';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.CLOCK);
  const [history, setHistory] = useState<SleepSession[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('somnium_theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const [sleepGoalHours, setSleepGoalHours] = useState<number>(() => {
    const stored = localStorage.getItem('somnium_sleep_goal');
    const parsed = stored ? Number(stored) : 8;
    return Number.isNaN(parsed) ? 8 : parsed;
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

  const refreshData = () => {
    setHistory(getSleepHistory());
  };

  return (
    <div className={`min-h-screen overflow-x-hidden pb-20 selection:bg-white selection:text-black ${theme === 'light' ? 'bg-zinc-100 text-black' : 'bg-black text-white'}`}>
      {screen === AppScreen.CLOCK && (
        <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0">
          <div className="absolute inset-0 opacity-90">
            <EnergyBeam className="w-full h-full" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)'
            }}
          ></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.62)_60%,rgba(0,0,0,0.86)_100%)]"></div>
        </div>
      )}

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 ${theme === 'light' ? 'bg-black/10' : 'bg-white/5'}`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 ${theme === 'light' ? 'bg-black/10' : 'bg-zinc-800/20'}`}></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
          

          {/* Content Area */}
          <main className="flex-1 flex flex-col">
          {screen === AppScreen.CLOCK && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-500">
              <GiantClock />
              <SleepControls onSessionUpdate={refreshData} />
              
              {/* Mini Stats Preview */}
              <div className="px-6 mt-8">
                 <div className="flex justify-between text-xs uppercase tracking-widest text-white/60 font-light mb-2 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
                    <span>Hoy</span>
                    <span>{history.length > 0 ? (history[0].durationMinutes / 60).toFixed(1) + 'h' : '--'}</span>
                 </div>
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/80 transition-all duration-1000" 
                      style={{ width: history.length > 0 ? `${Math.min((history[0].durationMinutes / 480) * 100, 100)}%` : '0%' }}
                    ></div>
                 </div>
              </div>
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
                      {[6, 7, 8, 9].map((hours) => (
                        <option key={hours} value={hours}>{hours}h</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          </main>

          <Navbar currentScreen={screen} onNavigate={setScreen} />
      </div>
    </div>
  );
};

export default App;

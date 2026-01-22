import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { SleepSession } from '../types';
import { saveSleepSession } from '../services/storage';

interface SleepControlsProps {
  onSessionUpdate: () => void;
  onSleepStateChange?: (isSleeping: boolean) => void;
}

export const SleepControls: React.FC<SleepControlsProps> = ({
  onSessionUpdate,
  onSleepStateChange
}) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Restore state from local session if app closed while sleeping
  useEffect(() => {
    const active = localStorage.getItem('somnium_active_session');
    if (active) {
      const data = JSON.parse(active);
      setIsSleeping(true);
      setCurrentSessionId(data.id);
      setStartTime(new Date(data.startTime));
    }
  }, []);

  useEffect(() => {
    onSleepStateChange?.(isSleeping);
  }, [isSleeping, onSleepStateChange]);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> to avoid NodeJS namespace dependency in browser environment
    let interval: ReturnType<typeof setInterval>;
    if (isSleeping && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        setElapsed(Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSleeping, startTime]);

  const defaultNightName = (date: Date) => {
    const label = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    return `Noche ${label}`;
  };

  const toggleSleep = () => {
    if (!isSleeping) {
      // Start Sleep
      const now = new Date();
      const newId = crypto.randomUUID();
      const sessionData = { id: newId, startTime: now.toISOString() };
      
      localStorage.setItem('somnium_active_session', JSON.stringify(sessionData));
      setStartTime(now);
      setCurrentSessionId(newId);
      setIsSleeping(true);
    } else {
      // Wake Up
      if (!startTime || !currentSessionId) return;
      
      const now = new Date();
      const durationMins = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
      
      // Save full session
      const session: SleepSession = {
        id: currentSessionId,
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        durationMinutes: durationMins,
        quality: 3,
        name: defaultNightName(startTime),
        notes: ''
      };
      
      saveSleepSession(session);
      localStorage.removeItem('somnium_active_session');
      
      setIsSleeping(false);
      setStartTime(null);
      setCurrentSessionId(null);
      setElapsed(0);
      onSessionUpdate();
    }
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full px-6 mb-8">
      <div className="relative">
        <div className={`absolute -inset-[2px] rounded-[999px] transition-all duration-700 ${isSleeping ? 'bg-white/8 blur-xl' : 'bg-white/6 blur-lg'}`}></div>
        <button
          onClick={toggleSleep}
          className={`relative w-full overflow-hidden rounded-[999px] border transition-all duration-500 ${
            isSleeping
              ? 'bg-zinc-950 border-white/15 shadow-[0_18px_55px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-18px_28px_rgba(0,0,0,0.8)]'
              : 'bg-zinc-950 border-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-18px_28px_rgba(0,0,0,0.78)] hover:border-white/20'
          }`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_22%,rgba(255,255,255,0.00)_55%)] opacity-70 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)] opacity-60 pointer-events-none"></div>
          {isSleeping ? (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-5 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Estado</span>
                  <span className="text-sm font-semibold text-white">Dormido</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Tiempo</span>
                <span className="text-2xl font-display font-bold tabular-nums text-white">{formatElapsed(elapsed)}</span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-white">Despertar</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 px-6 py-5 relative">
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Estado</span>
                <span className="text-lg font-semibold tracking-[0.18em] text-white">Iniciar Sueño</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Clock, BarChart3, Brain, List, Moon, Settings2 } from 'lucide-react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  className = ''
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="max-w-md mx-auto relative rounded-full h-16 flex items-center justify-around px-2 border border-white/15 bg-zinc-950 backdrop-blur-2xl shadow-[0_18px_55px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-18px_28px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_22%,rgba(255,255,255,0.00)_55%)] opacity-65 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)] opacity-50 pointer-events-none"></div>
        <button 
          onClick={() => onNavigate(AppScreen.CLOCK)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.CLOCK ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Clock size={20} />
          {currentScreen === AppScreen.CLOCK && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>

        <button 
          onClick={() => onNavigate(AppScreen.STATS)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.STATS ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <BarChart3 size={20} />
          {currentScreen === AppScreen.STATS && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>

        <button 
          onClick={() => onNavigate(AppScreen.HISTORY)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.HISTORY ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <List size={20} />
          {currentScreen === AppScreen.HISTORY && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>

        <button 
          onClick={() => onNavigate(AppScreen.DREAMS)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.DREAMS ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Moon size={20} />
          {currentScreen === AppScreen.DREAMS && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>

        <button 
          onClick={() => onNavigate(AppScreen.ANALYSIS)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.ANALYSIS ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Brain size={20} />
          {currentScreen === AppScreen.ANALYSIS && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>

        <button 
          onClick={() => onNavigate(AppScreen.SETTINGS)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${currentScreen === AppScreen.SETTINGS ? 'text-white bg-white/8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]' : 'text-zinc-500 hover:text-white'}`}
        >
          <Settings2 size={20} />
          {currentScreen === AppScreen.SETTINGS && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          )}
        </button>
      </div>
    </div>
  );
};

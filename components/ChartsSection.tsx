import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { SleepSession } from '../types';

interface ChartsSectionProps {
  data: SleepSession[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  // Process data for charts
  const chartData = [...data]
    .reverse() // Show chronological
    .slice(-7) // Last 7 sessions
    .map(session => ({
      date: new Date(session.startTime).toLocaleDateString('es-ES', { weekday: 'short' }),
      hours: parseFloat((session.durationMinutes / 60).toFixed(1)),
      quality: session.quality || 3
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-400 text-xs mb-1 uppercase">{label}</p>
          <p className="text-white font-bold text-lg">{payload[0].value} hrs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden animate-float-slow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] opacity-50 pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/6 blur-[80px] rounded-full pointer-events-none"></div>
        <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-6">Tendencia Semanal</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 'dataMax + 2']} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#ffffff" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHours)"
                isAnimationActive
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] opacity-60 pointer-events-none"></div>
           <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Promedio</h3>
           <p className="text-3xl font-display font-bold text-white">
             {chartData.length > 0 
                ? (chartData.reduce((acc, curr) => acc + curr.hours, 0) / chartData.length).toFixed(1)
                : '0.0'
             } <span className="text-sm font-normal text-zinc-500">h</span>
           </p>
        </div>
        
        <div className="p-5 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:160%_160%] opacity-50 animate-sheen pointer-events-none"></div>
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/6 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
           <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Eficiencia</h3>
           <p className="text-3xl font-display font-bold text-white">87%</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_55%)] opacity-50 pointer-events-none"></div>
        <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Calidad percibida</h3>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 11 }} 
                dy={6}
              />
              <YAxis hide domain={[0, 5]} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="quality" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="rgba(255,255,255,0.7)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)] opacity-50 pointer-events-none"></div>
        <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Guía de Hábitos</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Objetivo</p>
            <p className="text-sm text-white font-semibold">7–9 h por noche</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Constancia</p>
            <p className="text-sm text-white font-semibold">Mismo horario diario</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Ambiente</p>
            <p className="text-sm text-white font-semibold">Oscuro y fresco</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Pantallas</p>
            <p className="text-sm text-white font-semibold">30 min sin dispositivos</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Cafeína</p>
            <p className="text-sm text-white font-semibold">Evita tarde/noche</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Cena</p>
            <p className="text-sm text-white font-semibold">Ligera y temprana</p>
          </div>
        </div>
      </div>
    </div>
  );
};

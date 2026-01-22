import React, { useState, useEffect } from 'react';

export const GiantClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 animate-float">
      <div className="relative flex items-center justify-center px-3 overflow-visible">
        <div className="absolute w-[36vw] h-[36vw] rounded-full bg-white/6 blur-[80px] animate-glow"></div>
        <div className="absolute w-[26vw] h-[26vw] rounded-full bg-white/4 blur-[60px] animate-glow"></div>
        <div className="relative px-2 text-[clamp(110px,24vw,180px)] sm:text-[18vw] font-display font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none drop-shadow-[0_0_18px_rgba(255,255,255,0.22)] text-center whitespace-nowrap">
          {formatTime(time)}
        </div>
      </div>
      <div className="text-zinc-400 text-lg uppercase tracking-[0.2em] font-light mt-4">
        {formatDate(time)}
      </div>
    </div>
  );
};

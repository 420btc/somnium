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

  const timeText = formatTime(time);
  const timeChars = timeText.split('');

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 animate-float">
      <div className="relative flex items-center justify-center px-3 overflow-visible">
        <div className="absolute w-[36vw] h-[36vw] rounded-full bg-white/6 blur-[80px] animate-glow"></div>
        <div className="absolute w-[26vw] h-[26vw] rounded-full bg-white/4 blur-[60px] animate-glow"></div>

        <div className="relative px-2 translate-x-[calc(0.03em+1px)] text-[clamp(110px,24vw,180px)] sm:text-[18vw] font-display font-bold leading-none tracking-tight select-none text-center whitespace-nowrap">
          <div className="relative flex items-baseline justify-center text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-[0_0_18px_rgba(255,255,255,0.22)]">
            {timeChars.map((ch, idx) => {
              const isEdge = idx === 0 || idx === timeChars.length - 1;
              const isColon = ch === ':';

              if (!isEdge) {
                return (
                  <span
                    key={`${ch}-${idx}`}
                    className={isColon ? 'mx-[0.02em] opacity-70' : undefined}
                  >
                    {ch}
                  </span>
                );
              }

              return (
                <span
                  key={`${ch}-${idx}`}
                  className={isColon ? 'mx-[0.02em] opacity-70' : undefined}
                >
                  <span className="relative inline-block">
                    <span
                      aria-hidden
                      className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-transparent bg-clip-text bg-gradient-to-b from-neutral-500 to-neutral-900 opacity-80 blur-[0.3px]"
                    >
                      {ch}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-[1px] -translate-y-[1px] text-white/70 blur-[0.4px]"
                    >
                      {ch}
                    </span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-[0_0_26px_rgba(255,255,255,0.28)]">
                      {ch}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-white/70 text-lg uppercase tracking-[0.2em] font-light mt-4 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
        {formatDate(time)}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    UnicornStudio?: { init: () => void };
    SomniumUnicornInitialized?: boolean;
  }
}

interface EnergyBeamProps {
  projectId?: string;
  className?: string;
}

export const EnergyBeam: React.FC<EnergyBeamProps> = ({
  projectId = 'hRFfUymDGOHwtFe7evR2',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const ensureScript = () => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-somnium-unicornstudio="true"]'
      );
      if (existing) return;

      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
      script.async = true;
      script.dataset.somniumUnicornstudio = 'true';
      document.head.appendChild(script);
    };

    ensureScript();

    const tryInit = () => {
      if (initializedRef.current) return;
      if (!window.UnicornStudio) return;
      if (!containerRef.current) return;
      if (window.SomniumUnicornInitialized) {
        initializedRef.current = true;
        return;
      }
      initializedRef.current = true;
      window.SomniumUnicornInitialized = true;
      window.UnicornStudio.init();
    };

    const interval = window.setInterval(tryInit, 200);
    window.setTimeout(tryInit, 0);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        data-us-project={projectId}
        className="w-full h-full"
      />
    </div>
  );
};

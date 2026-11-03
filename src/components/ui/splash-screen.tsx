'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { WarpText } from '@/components/ui/WarpText';

export interface SplashScreenProps {
  duration?: number; // duration in ms, default 2000
  onComplete?: () => void;
}

export function SplashScreen({ duration = 2000, onComplete }: SplashScreenProps) {
  const [visible, setVisible] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);

  React.useEffect(() => {
    // Respect prefers-reduced-motion
    const reduceMotion =
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

    const actualDuration = reduceMotion ? Math.min(duration, 800) : duration;

    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 500); // 500ms smooth fade transition
      return () => clearTimeout(removeTimer);
    }, actualDuration);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        setFadeOut(true);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading ReviewFlow"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F6] text-slate-900 select-none transition-opacity duration-500 ease-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <style>{`
        @keyframes splash-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

      {/* Atmospheric Soft Light Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 48%, rgba(99, 102, 241, 0.12) 0%, rgba(244, 63, 94, 0.05) 35%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl text-center">
     

        {/* WarpText Fluid Shader Animation in Light Theme (Dark Ink) */}
        <div className="w-full h-[240px] sm:h-[280px] flex items-center justify-center">
          <WarpText
            text={'ReviewFlow\nfor every business'}
            color="#0f172a"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            lens="bulge"
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.35}
            idleDrift={0.2}
            ripple
            clickRipple
            intro
            fontSize="clamp(2.2rem, 5.5vw, 4.2rem)"
            fontWeight={800}
            style={{ height: '260px', width: '100%', maxWidth: '800px' }}
            fontFamily="inherit"
            letterSpacing="-0.04em"
            lineHeight={1.05}
          />
        </div>

        {/* Animated Progress Track in Light Theme (2000ms duration) */}
        <div className="w-44 sm:w-60 h-1.5 bg-slate-200/90 border border-slate-300/40 rounded-full overflow-hidden mt-4 relative">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 rounded-full"
            style={{
              animation: `splash-progress ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            }}
          />
        </div>

        <p className="text-[11px] text-slate-500 tracking-wider uppercase font-semibold mt-3.5 opacity-90">
        
        </p>

     
      </div>
    </div>
  );
}

export default SplashScreen;

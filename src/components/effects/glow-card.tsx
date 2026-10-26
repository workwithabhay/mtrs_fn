'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  isInteractive?: boolean;
}

/**
 * Purposeful ReactBits-inspired micro-interaction component:
 * Enhances surface elements with a subtle, accessible mouse-follow radial highlight.
 * Automatically disabled under prefers-reduced-motion.
 */
export function GlowCard({
  children,
  className,
  glowColor = 'rgba(79, 70, 229, 0.12)',
  isInteractive = true,
  ...props
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isInteractive) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => isInteractive && setIsHovered(false)}
      className={cn(
        'relative rounded-2xl bg-brand-surface border border-brand-border p-6 shadow-card overflow-hidden transition-all duration-200',
        isInteractive && 'hover:border-indigo-200 hover:shadow-elevated',
        className,
      )}
      {...props}
    >
      {/* Dynamic radial glow overlay */}
      {isHovered && isInteractive && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 motion-reduce:hidden"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

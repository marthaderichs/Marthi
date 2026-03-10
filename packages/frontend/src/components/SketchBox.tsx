import React from 'react';
import { cn } from '../lib/utils';

interface SketchBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

/**
 * Hand-drawn rectangular border via SVG.
 * Four separate edge paths – each with its own stroke width and slight curvature.
 * Corners intentionally don't meet exactly, giving an organic, drawn-by-hand feel.
 */
export function SketchBox({ children, className, style, color = '#673147' }: SketchBoxProps) {
  return (
    <div className={cn('relative', className)} style={style}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        {/* Top – slight dip mid-span; corners offset from neighbours */}
        <path
          d="M 3.5,2.2 C 22,0.6 48,3.2 74,1.6 S 93.5,3 97,2"
          stroke={color}
          strokeWidth="1.65"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Right – very gently bowed outward, thinner than top */}
        <path
          d="M 98.5,3.5 C 100.3,22 99.8,52 100.6,75 S 99.2,94 97.5,97.8"
          stroke={color}
          strokeWidth="1.35"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Bottom – slight upward bow, drawn right-to-left; thickest edge */}
        <path
          d="M 96.2,99 C 76,100.8 50,97.6 26,100.2 S 7.5,98.5 3,99.5"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Left – subtle S-curve; corners don't align with top/bottom ends */}
        <path
          d="M 2,97.8 C 0.2,78 1.4,52 -0.4,26 S 1.6,7.5 2.8,3"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </div>
  );
}

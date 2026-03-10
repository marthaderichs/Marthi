import React from 'react';
import { motion } from 'motion/react';

interface SubjectCircleProps {
  color: string;
  index: number;
  label: string;
  fullName: string;
  onClick: () => void;
}

export function SubjectCircle({ color, index, label, fullName, onClick }: SubjectCircleProps) {
  const tilt = ((index * 7) % 11) - 5;

  // Slightly varied highlight center per circle → each looks individually hand-painted
  const hlX = 38 + (index % 5) * 4;   // 38–54
  const hlY = 34 + (index % 4) * 4;   // 34–46

  const gradId  = `wc-g-${index}`;
  const grainId = `wc-n-${index}`;
  const maskId  = `wc-m-${index}`;

  return (
    <div className="flex flex-col items-center">
      <motion.button
        initial={{ rotate: tilt }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        onClick={onClick}
        className="aspect-square w-full relative flex items-center justify-center group"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask: clips everything to the circle */}
            <mask id={maskId}>
              <circle cx="50" cy="50" r="44" fill="white" />
            </mask>

            {/* Watercolor radial gradient:
                - off-center highlight (paper shining through)
                - slightly darker ring near edge (paint pooling) */}
            <radialGradient id={gradId} cx={`${hlX}%`} cy={`${hlY}%`} r="62%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
              <stop offset="40%"  stopColor="white" stopOpacity="0.06" />
              <stop offset="72%"  stopColor={color} stopOpacity="0.00" />
              <stop offset="88%"  stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0.38" />
            </radialGradient>

            {/* Grain filter: fractal noise for pigment texture */}
            <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72"
                numOctaves="4"
                seed={index * 7 + 2}
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0.09 0"
                in="noise"
                result="grain"
              />
              <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
            </filter>
          </defs>

          {/* 1. Transparent watercolor base (like real paint on paper) */}
          <circle cx="50" cy="50" r="44" fill={color} opacity="0.84" />

          {/* 2. Edge darkening + center highlight overlay */}
          <circle cx="50" cy="50" r="44" fill={`url(#${gradId})`} />

          {/* 3. Grain/pigment texture — clipped to circle */}
          <rect
            x="0" y="0" width="100" height="100"
            fill={color}
            opacity="0.15"
            filter={`url(#${grainId})`}
            mask={`url(#${maskId})`}
          />
        </svg>

        <div className="relative z-10 w-full px-2 text-center text-white font-typewriter uppercase tracking-widest [text-shadow:0_1px_4px_rgba(0,0,0,0.28)]">
          <span className="text-lg group-hover:hidden">{label}</span>
          <span className="text-[10px] hidden group-hover:block leading-tight">{fullName}</span>
        </div>
      </motion.button>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';

/**
 * Generates a smooth wobbly circle as an SVG path.
 * Uses quadratic bezier curves through slightly perturbed points —
 * organic shape but with completely smooth edges.
 */
function getWobblyPath(seed: number): string {
  const n = 10;
  const cx = 50, cy = 50;
  const baseR = 41;
  const maxVar = 3.5;

  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const v = Math.sin(seed * 1.9 + i * 2.4) * maxVar
            + Math.sin(seed * 0.7 + i * 4.1) * (maxVar * 0.4);
    const r = baseR + v;
    return [
      +(cx + r * Math.cos(angle)).toFixed(2),
      +(cy + r * Math.sin(angle)).toFixed(2),
    ];
  });

  // Midpoints become the on-curve points; original points become control points
  const mids = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    return [+((p[0] + q[0]) / 2).toFixed(2), +((p[1] + q[1]) / 2).toFixed(2)];
  });

  let d = `M${mids[0][0]},${mids[0][1]}`;
  for (let i = 0; i < n; i++) {
    d += ` Q${pts[i][0]},${pts[i][1]} ${mids[(i + 1) % n][0]},${mids[(i + 1) % n][1]}`;
  }
  return d + 'Z';
}

interface SubjectCircleProps {
  color: string;
  /** Stable index used to derive consistent shape + tilt per subject */
  index: number;
  label: string;
  fullName: string;
  onClick: () => void;
}

/**
 * A hand-painted watercolor dot for subject selection.
 * Shared between ContentLibrary and ExamMode so both look identical.
 */
export function SubjectCircle({ color, index, label, fullName, onClick }: SubjectCircleProps) {
  const tilt = ((index * 7) % 11) - 5;
  const seed = index * 13 + 3;
  const path = getWobblyPath(seed);
  const gradId = `wc-grad-${seed}`;

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
            {/* Subtle off-center highlight — mimics light catching wet paint */}
            <radialGradient id={gradId} cx="42%" cy="38%" r="52%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
              <stop offset="55%"  stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base watercolor fill — slightly transparent like real paint on paper */}
          <path d={path} fill={color} opacity="0.90" />
          {/* Subtle highlight layer */}
          <path d={path} fill={`url(#${gradId})`} />
        </svg>

        <div className="relative z-10 w-full px-2 text-center text-white font-typewriter uppercase tracking-widest [text-shadow:0_1px_3px_rgba(0,0,0,0.22)]">
          <span className="text-lg group-hover:hidden">{label}</span>
          <span className="text-[10px] hidden group-hover:block leading-tight">{fullName}</span>
        </div>
      </motion.button>
    </div>
  );
}

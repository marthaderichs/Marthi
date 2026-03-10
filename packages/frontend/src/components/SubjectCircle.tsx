import React from 'react';
import { motion } from 'motion/react';

/**
 * Smooth wobbly circle path — slightly organic, edges completely smooth.
 * Uses quadratic bezier midpoint technique so the outline is always C1-continuous.
 */
function getWobblyPath(seed: number): string {
  const n = 11;
  const cx = 50, cy = 50, baseR = 42, maxVar = 3.2;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const v =
      Math.sin(seed * 1.9 + i * 2.4) * maxVar +
      Math.sin(seed * 0.7 + i * 4.1) * maxVar * 0.35;
    return [
      +(cx + (baseR + v) * Math.cos(a)).toFixed(2),
      +(cy + (baseR + v) * Math.sin(a)).toFixed(2),
    ];
  });
  const mids = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    return [+((p[0] + q[0]) / 2).toFixed(2), +((p[1] + q[1]) / 2).toFixed(2)];
  });
  let d = `M${mids[0][0]},${mids[0][1]}`;
  pts.forEach((p, i) => {
    d += ` Q${p[0]},${p[1]} ${mids[(i + 1) % n][0]},${mids[(i + 1) % n][1]}`;
  });
  return d + 'Z';
}

interface SubjectCircleProps {
  color: string;
  index: number;
  label: string;
  fullName: string;
  onClick: () => void;
}

export function SubjectCircle({ color, index, label, fullName, onClick }: SubjectCircleProps) {
  const tilt    = ((index * 7) % 11) - 5;
  const seed    = index * 13 + 3;
  const path    = getWobblyPath(seed);

  // Each circle gets unique brush stroke angles + highlight position
  const a1 = -22 + (seed % 5) * 9;           // first stroke angle  (-22..+14°)
  const a2 =  18 + (seed % 4) * 11;           // second stroke angle ( 18..+51°)
  const a3 = -8  + (seed % 6) * 7;            // third stroke angle
  const off = (seed % 5) * 1.4;               // position jitter (0..5.6)
  const hlX = 41 + (seed % 6) * 2;            // highlight center X (41..51)
  const hlY = 37 + (seed % 5) * 2;            // highlight center Y (37..45)

  const cpId   = `wc-cp-${index}`;
  const gnId   = `wc-gn-${index}`;

  return (
    <div className="flex flex-col items-center">
      <motion.button
        initial={{ rotate: tilt }}
        whileHover={{ scale: 1.07, rotate: 0 }}
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
            {/* Clip everything to the wobbly circle shape */}
            <clipPath id={cpId}>
              <path d={path} />
            </clipPath>

            {/*
              Paper grain filter — fractalNoise blended multiply at low opacity
              gives the look of pigment sitting on paper fibres.
            */}
            <filter id={gnId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.52"
                numOctaves="4"
                seed={seed}
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0.22 0"
                in="noise"
                result="g"
              />
              <feBlend in="SourceGraphic" in2="g" mode="multiply" />
            </filter>
          </defs>

          {/*
            ── Watercolor layering strategy ──────────────────────────────────
            Real watercolor = overlapping transparent brush strokes at different
            angles. Each ellipse = one stroke. Clipped to the wobbly outline.
            No radial gradient → no billiard-ball effect.
          */}

          {/* Stroke 1: wide first wash — sets the main colour */}
          <ellipse
            cx={50 - off * 0.6} cy={50 + off * 0.4}
            rx="38" ry="31"
            fill={color} opacity="0.58"
            transform={`rotate(${a1} 50 50)`}
            clipPath={`url(#${cpId})`}
          />

          {/* Stroke 2: second pass at crossing angle — builds pigment */}
          <ellipse
            cx={50 + off * 0.5} cy={50 - off * 0.5}
            rx="33" ry="26"
            fill={color} opacity="0.40"
            transform={`rotate(${a2} 50 50)`}
            clipPath={`url(#${cpId})`}
          />

          {/* Stroke 3: third stroke, smaller, adds density in one region */}
          <ellipse
            cx={50 - off * 0.3} cy={50 + off * 0.8}
            rx="26" ry="20"
            fill={color} opacity="0.30"
            transform={`rotate(${a3} 50 50)`}
            clipPath={`url(#${cpId})`}
          />

          {/* Stroke 4: tiny accent stroke — pigment pooling near one edge */}
          <ellipse
            cx={50 + off} cy={52 + off * 0.5}
            rx="18" ry="13"
            fill={color} opacity="0.24"
            transform={`rotate(${a1 * -0.6} 50 50)`}
            clipPath={`url(#${cpId})`}
          />

          {/*
            Edge darkening — paint always pools where it meets air.
            A thick stroke along the outline (clipped = stays inside).
          */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="7"
            opacity="0.18"
            clipPath={`url(#${cpId})`}
          />

          {/*
            Paper transparency highlight — where the brush was lighter / lifted.
            Slightly off-centre so it doesn't look like a 3D sphere.
          */}
          <ellipse
            cx={hlX} cy={hlY}
            rx="16" ry="12"
            fill="white"
            opacity="0.18"
            transform={`rotate(${a1 * 0.4} 50 50)`}
            clipPath={`url(#${cpId})`}
          />

          {/* Paper grain on top — very subtle, makes it look on-paper */}
          <path
            d={path}
            fill={color}
            opacity="0.10"
            filter={`url(#${gnId})`}
          />
        </svg>

        {/* Label */}
        <div className="relative z-10 w-full px-2 text-center text-white font-typewriter uppercase tracking-widest [text-shadow:0_1px_4px_rgba(0,0,0,0.30)]">
          <span className="text-lg group-hover:hidden">{label}</span>
          <span className="text-[10px] hidden group-hover:block leading-tight">{fullName}</span>
        </div>
      </motion.button>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';

const BLOBS = [
  '42% 58% 54% 46% / 48% 44% 56% 52%',
  '56% 44% 48% 52% / 52% 58% 42% 48%',
  '50% 50% 44% 56% / 56% 44% 52% 48%',
  '46% 54% 58% 42% / 44% 56% 48% 52%',
  '54% 46% 50% 50% / 50% 54% 46% 50%',
  '48% 52% 46% 54% / 54% 46% 56% 44%',
  '58% 42% 52% 48% / 46% 54% 44% 56%',
  '44% 56% 56% 44% / 52% 48% 54% 46%',
  '52% 48% 42% 58% / 48% 52% 58% 42%',
  '50% 50% 50% 50% / 44% 56% 50% 50%',
];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

function abbr(name: string): string {
  return name.slice(0, 3).toUpperCase();
}

function Text({ str }: { str: string }) {
  return <>{str.toUpperCase()}</>;
}

interface SubjectBlobProps {
  color: string;
  index: number;
  name: string;
  onClick: () => void;
}

export function SubjectBlob({ color, index, name, onClick }: SubjectBlobProps) {
  const shape = BLOBS[index % BLOBS.length];
  const tilt  = ((index * 7) % 9) - 4;

  return (
    <motion.button
      initial={{ rotate: tilt }}
      whileHover={{ scale: 1.06, rotate: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={onClick}
      className="aspect-square w-full relative flex items-center justify-center group"
    >
      {/* Blob fill */}
      <div className="absolute inset-1.5" style={{ borderRadius: shape, backgroundColor: color, opacity: 0.82 }} />

      {/* Grain overlay */}
      <div
        className="absolute inset-1.5 mix-blend-overlay pointer-events-none"
        style={{ borderRadius: shape, backgroundImage: GRAIN, backgroundSize: '180px 180px', opacity: 0.13 }}
      />

      {/* Default: 3-letter abbr */}
      <span className="relative z-10 font-typewriter text-white text-[15px] tracking-[0.22em] [text-shadow:0_1px_3px_rgba(0,0,0,0.25)] group-hover:hidden">
        {abbr(name)}
      </span>

      {/* Hover: full name, umlauts shrunk */}
      <span className="relative z-10 font-typewriter text-white text-[11px] tracking-[0.15em] [text-shadow:0_1px_3px_rgba(0,0,0,0.25)] hidden group-hover:block text-center px-3 leading-snug">
        <Text str={name} />
      </span>
    </motion.button>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Heart, HeartPulse, HeartHandshake, Flower2, ArrowRight } from 'lucide-react';

// ── Handdrawn divider ─────────────────────────────────────────────────────────
function Squiggle() {
  return (
    <svg viewBox="0 0 200 10" className="w-full h-2.5 text-[#673147]/20" preserveAspectRatio="none" aria-hidden>
      <path d="M0,6 C6,2 12,8 20,5 S32,1 42,6 S54,9 64,4 S76,1 88,5 S100,8 112,4 S124,1 136,6 S148,9 160,4 S174,2 184,6 S194,8 200,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Scribbled heart (nav) ─────────────────────────────────────────────────────
// Each heart is slightly tilted differently for a hand-drawn feel
const HEART_TILTS = [-8, 6, -5, 9];
// Slightly different heart paths per index for organic variation
const HEART_PATHS = [
  "M50,77 C18,62 3,44 3,29 Q3,11 22,11 Q37,11 50,27 Q63,11 78,11 Q97,11 97,29 C97,44 82,62 50,77 Z",
  "M50,79 C17,63 2,45 2,30 Q2,10 21,10 Q36,10 50,27 Q64,10 79,10 Q98,10 98,30 C98,45 83,63 50,79 Z",
  "M50,76 C19,61 4,43 4,28 Q4,10 23,10 Q37,10 50,26 Q63,10 77,10 Q96,10 96,28 C96,43 81,61 50,76 Z",
  "M50,78 C18,63 3,45 3,30 Q3,11 22,11 Q36,11 50,28 Q64,11 78,11 Q97,11 97,30 C97,45 82,63 50,78 Z",
];

function WcDot({ color, index, children }: { color: string; index: number; children: React.ReactNode }) {
  const nId = `wcd-n-${index}`;
  const tilt = HEART_TILTS[index % HEART_TILTS.length];
  const path = HEART_PATHS[index % HEART_PATHS.length];

  return (
    <div className="w-[72px] h-[72px] relative flex items-center justify-center shrink-0">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <defs>
          <filter id={nId} x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" seed={index * 7 + 2} result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0" in="noise" result="g"/>
            <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
          </filter>
        </defs>
        {/* Filled heart with grain */}
        <path d={path} fill={color} opacity="0.82" filter={`url(#${nId})`}/>
        {/* Soft scribble outline */}
        <path d={path} fill="none" stroke={color} strokeWidth="3" opacity="0.20" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="relative z-10" style={{ marginTop: '6px' }}>{children}</div>
    </div>
  );
}

// ── Quick links ───────────────────────────────────────────────────────────────
const LINKS = [
  { to: '/exam',       icon: HeartPulse,    label: 'Klausur',    color: '#EA6C47', desc: 'Wissen testen'  },
  { to: '/content',    icon: Heart,         label: 'Bibliothek', color: '#009CA6', desc: 'Kapitel lesen'  },
  { to: '/flashcards', icon: HeartHandshake,label: 'Karten',     color: '#8D377C', desc: 'Fakten lernen'  },
  { to: '/garden',     icon: Flower2,       label: 'Garten',     color: '#6A902C', desc: 'Fehler pflegen' },
] as const;

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: subjects, isLoading } = useSubjects();

  if (isLoading) return <div className="flex justify-center py-40"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 space-y-7">

      {/* ── Greeting card ───────────────────────────────────────────────── */}
      <div className="scribble-border bg-[var(--light-cream)] px-8 pt-8 pb-7 space-y-3">
        <p className="text-[13px] font-typewriter tracking-[0.38em] text-[#673147]/38 uppercase">
          Willkommen
        </p>
        <h1 className="font-display text-[clamp(2.8rem,8vw,4.2rem)] text-[#673147] leading-[1.05]">
          hey marthi.
        </h1>
        <Squiggle />
        <p className="font-typewriter text-[17px] text-[#4A3A2F]/52 pt-0.5">
          Wähle ein Fach und leg los.
        </p>
      </div>

      {/* ── Nav circles ─────────────────────────────────────────────────── */}
      <div className="bg-[var(--light-cream)] px-6 py-7 border border-[#673147]/10">
        <p className="text-[13px] font-typewriter tracking-[0.38em] text-[#673147]/35 uppercase mb-6">
          Schnellzugriff
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LINKS.map((link, i) => (
            <NavLink key={link.to} to={link.to} className="group outline-none">
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className="flex flex-col items-center gap-2.5 py-3 text-center"
              >
                <WcDot color={link.color} index={i}>
                  <link.icon className="w-5 h-5 text-white stroke-[1.3]" />
                </WcDot>
                <div>
                  <div className="font-display text-[1.35rem] text-[#673147] leading-none group-hover:opacity-55 transition-opacity">
                    {link.label}
                  </div>
                  <p className="text-[11px] font-typewriter uppercase tracking-[0.2em] text-[#4A3A2F]/38 mt-0.5">
                    {link.desc}
                  </p>
                </div>
              </motion.div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── Subjects ─────────────────────────────────────────────────────── */}
      <div className="scribble-border bg-[var(--light-cream)] px-7 py-6 space-y-1">
        <p className="text-[13px] font-typewriter tracking-[0.38em] text-[#673147]/35 uppercase mb-4">Fachbereiche</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {subjects?.slice(0, 8).map((s) => (
            <NavLink
              key={s.id}
              to="/content"
              className="group flex items-center gap-3 py-2 border-b border-[#673147]/7 last:border-0 hover:border-[#673147]/18 transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color, opacity: 0.8 }} />
              <span className="font-typewriter text-[14px] text-[#4A3A2F]/60 group-hover:text-[#673147] transition-colors flex-1 truncate">
                {s.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#673147]/15 group-hover:text-[#673147]/40 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      className="w-7 h-7 border-2 border-[#673147]/15 border-t-[#673147]/55 rounded-full"
    />
  );
}

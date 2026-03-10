import React from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

// ── Handdrawn divider ─────────────────────────────────────────────────────────
function Squiggle() {
  return (
    <svg viewBox="0 0 200 10" className="w-full h-2.5 text-[#673147]/20" preserveAspectRatio="none" aria-hidden>
      <path d="M0,6 C6,2 12,8 20,5 S32,1 42,6 S54,9 64,4 S76,1 88,5 S100,8 112,4 S124,1 136,6 S148,9 160,4 S174,2 184,6 S194,8 200,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Cute cartoon heart with radiating dashes ──────────────────────────────────
const TILTS = [-7, 5, -4, 8];
const HEART = "M50,74 C22,59 4,42 4,26 Q4,8 23,8 Q37,8 50,25 Q63,8 77,8 Q96,8 96,26 C96,42 78,59 50,74 Z";
const NUM_DASHES = 16;
const HCX = 50, HCY = 41, R1 = 62, R2 = 76;
const DASHES = Array.from({ length: NUM_DASHES }, (_, i) => {
  const a = (i / NUM_DASHES) * Math.PI * 2 - Math.PI / 2;
  return { x1: HCX + R1 * Math.cos(a), y1: HCY + R1 * Math.sin(a), x2: HCX + R2 * Math.cos(a), y2: HCY + R2 * Math.sin(a) };
});

function CuteHeart({ color, index }: { color: string; index: number }) {
  return (
    <div className="w-[84px] h-[84px] flex items-center justify-center shrink-0">
      <svg viewBox="-22 -22 144 144" className="w-full h-full" style={{ transform: `rotate(${TILTS[index % 4]}deg)` }}>
        {DASHES.map((d, i) => (
          <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="#3D2420" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
        ))}
        <path d={HEART} fill={color} />
        <path d={HEART} fill="none" stroke="#2A1810" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Quick links ───────────────────────────────────────────────────────────────
const LINKS = [
  { to: '/exam',       label: 'Klausur',    color: '#EA6C47', desc: 'Wissen testen'  },
  { to: '/content',    label: 'Bibliothek', color: '#009CA6', desc: 'Kapitel lesen'  },
  { to: '/flashcards', label: 'Karten',     color: '#8D377C', desc: 'Fakten lernen'  },
  { to: '/garden',     label: 'Garten',     color: '#6A902C', desc: 'Fehler pflegen' },
] as const;

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: subjects, isLoading } = useSubjects();

  if (isLoading) return <div className="flex justify-center py-40"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-16 pb-10 sm:py-10 space-y-7">

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
                <CuteHeart color={link.color} index={i} />
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

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PenLine, BookOpen, BookMarked, Flower2, ArrowRight } from 'lucide-react';

// ── Handdrawn divider ─────────────────────────────────────────────────────────
function Squiggle() {
  return (
    <svg viewBox="0 0 200 6" className="w-full h-1.5 text-[#673147]/15" preserveAspectRatio="none" aria-hidden>
      <path d="M0,3 C30,1 60,5 100,3 S160,1 200,3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Watercolor dot (nav) ──────────────────────────────────────────────────────
function WcDot({ color, index, children }: { color: string; index: number; children: React.ReactNode }) {
  const a1 = -22 + (index % 5) * 9;
  const a2 =  18 + (index % 4) * 11;
  const off = (index % 5) * 1.3;
  const hlX = 41 + (index % 6) * 2;
  const hlY = 37 + (index % 5) * 2;
  const gId = `wcd-g-${index}`;
  const mId = `wcd-m-${index}`;
  const nId = `wcd-n-${index}`;

  return (
    <div className="w-[72px] h-[72px] relative flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <clipPath id={mId}><circle cx="50" cy="50" r="44"/></clipPath>
          <radialGradient id={gId} cx={`${hlX}%`} cy={`${hlY}%`} r="60%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.26"/>
            <stop offset="45%"  stopColor="white" stopOpacity="0.05"/>
            <stop offset="72%"  stopColor={color} stopOpacity="0"/>
            <stop offset="88%"  stopColor={color} stopOpacity="0.16"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.35"/>
          </radialGradient>
          <filter id={nId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed={index * 7 + 2} result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.20 0" in="noise" result="g"/>
            <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
          </filter>
        </defs>
        <ellipse cx={50 - off * 0.5} cy={50 + off * 0.4} rx="37" ry="31" fill={color} opacity="0.58" transform={`rotate(${a1} 50 50)`} clipPath={`url(#${mId})`}/>
        <ellipse cx={50 + off * 0.4} cy={50 - off * 0.5} rx="32" ry="26" fill={color} opacity="0.40" transform={`rotate(${a2} 50 50)`} clipPath={`url(#${mId})`}/>
        <ellipse cx="50" cy={52 + off * 0.6} rx="22" ry="17" fill={color} opacity="0.27" transform={`rotate(${a1 * -0.5} 50 50)`} clipPath={`url(#${mId})`}/>
        <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="6" opacity="0.17" clipPath={`url(#${mId})`}/>
        <ellipse cx={hlX} cy={hlY} rx="14" ry="11" fill="white" opacity="0.17" clipPath={`url(#${mId})`}/>
        <circle cx="50" cy="50" r="44" fill={color} opacity="0.08" filter={`url(#${nId})`}/>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Quick links ───────────────────────────────────────────────────────────────
const LINKS = [
  { to: '/exam',       icon: PenLine,    label: 'Klausur',    color: '#EA6C47', desc: 'Wissen testen'  },
  { to: '/content',    icon: BookOpen,   label: 'Bibliothek', color: '#009CA6', desc: 'Kapitel lesen'  },
  { to: '/flashcards', icon: BookMarked, label: 'Karten',     color: '#8D377C', desc: 'Fakten lernen'  },
  { to: '/garden',     icon: Flower2,    label: 'Garten',     color: '#6A902C', desc: 'Fehler pflegen' },
] as const;

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: subjects, isLoading } = useSubjects();

  const stats = useMemo(() => {
    if (!subjects) return { topics: 0, questions: 0 };
    return subjects.reduce(
      (a, s) => ({ topics: a.topics + (s._count?.topics || 0), questions: a.questions + (s._count?.questions || 0) }),
      { topics: 0, questions: 0 }
    );
  }, [subjects]);

  if (isLoading) return <div className="flex justify-center py-40"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 space-y-7">

      {/* ── Greeting card ───────────────────────────────────────────────── */}
      <div className="scribble-border bg-[var(--light-cream)] px-8 pt-8 pb-7 space-y-3">
        <p className="text-[9px] font-typewriter tracking-[0.38em] text-[#673147]/38 uppercase">
          Willkommen
        </p>
        <h1 className="font-display text-[clamp(2.8rem,8vw,4.2rem)] text-[#673147] leading-[1.05]">
          hey marthi.
        </h1>
        <Squiggle />
        <p className="font-typewriter text-[15px] text-[#4A3A2F]/52 pt-0.5">
          Wähle ein Fach und leg los.
        </p>
      </div>

      {/* ── Nav circles ─────────────────────────────────────────────────── */}
      <div className="scribble-border bg-[var(--light-cream)] px-6 py-7">
        <p className="text-[9px] font-typewriter tracking-[0.38em] text-[#673147]/35 uppercase mb-6">
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
                  <link.icon className="w-6 h-6 text-white stroke-[1.6]" />
                </WcDot>
                <div>
                  <div className="font-display text-[1.35rem] text-[#673147] leading-none group-hover:opacity-55 transition-opacity">
                    {link.label}
                  </div>
                  <p className="text-[9px] font-typewriter uppercase tracking-[0.2em] text-[#4A3A2F]/38 mt-0.5">
                    {link.desc}
                  </p>
                </div>
              </motion.div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── Stats + Subjects ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">

        {/* Stats */}
        <div className="scribble-border bg-[var(--light-cream)] px-7 py-6 space-y-4">
          <p className="text-[9px] font-typewriter tracking-[0.38em] text-[#673147]/35 uppercase">Inhalt</p>
          <div className="flex items-end gap-6">
            <div>
              <div className="font-display text-[3.2rem] text-[#673147] leading-none tabular-nums">{stats.topics}</div>
              <p className="text-[9px] font-typewriter uppercase tracking-[0.28em] text-[#4A3A2F]/42 mt-1">Kapitel</p>
            </div>
            <div className="mb-3 w-px h-10 bg-[#673147]/12 shrink-0" />
            <div>
              <div className="font-display text-[3.2rem] text-[#673147] leading-none tabular-nums">{stats.questions}</div>
              <p className="text-[9px] font-typewriter uppercase tracking-[0.28em] text-[#4A3A2F]/42 mt-1">Fragen</p>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="scribble-border bg-[var(--light-cream)] px-7 py-6 space-y-1">
          <p className="text-[9px] font-typewriter tracking-[0.38em] text-[#673147]/35 uppercase mb-3">Fachbereiche</p>
          {subjects?.slice(0, 6).map((s) => (
            <NavLink
              key={s.id}
              to="/content"
              className="group flex items-center gap-2.5 py-1.5 border-b border-[#673147]/7 last:border-0 hover:border-[#673147]/18 transition-colors"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color, opacity: 0.8 }} />
              <span className="font-typewriter text-[12.5px] text-[#4A3A2F]/60 group-hover:text-[#673147] transition-colors flex-1 truncate">
                {s.name}
              </span>
              <ArrowRight className="w-3 h-3 text-[#673147]/15 group-hover:text-[#673147]/40 group-hover:translate-x-0.5 transition-all" />
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

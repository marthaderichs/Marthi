import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Pen, BookOpen, Layers, Sprout } from 'lucide-react';

// ── Handdrawn SVG divider line ────────────────────────────────────────────────
function HandLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 6"
      className={cn('w-full h-1.5', className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,3 C60,1.2 140,4.8 200,3 S320,1.4 380,3.2 S460,4.5 500,3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Watercolor dot for nav items ──────────────────────────────────────────────
function WatercolorDot({
  color,
  index,
  children,
}: {
  color: string;
  index: number;
  children: React.ReactNode;
}) {
  const hlX = 38 + (index % 5) * 4;
  const hlY = 34 + (index % 4) * 4;
  const gradId  = `wc-d-${index}`;
  const maskId  = `wc-dm-${index}`;
  const grainId = `wc-dg-${index}`;

  return (
    <div className="w-20 h-20 relative flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <mask id={maskId}>
            <circle cx="50" cy="50" r="44" fill="white" />
          </mask>
          <radialGradient id={gradId} cx={`${hlX}%`} cy={`${hlY}%`} r="62%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
            <stop offset="40%"  stopColor="white" stopOpacity="0.06" />
            <stop offset="72%"  stopColor={color} stopOpacity="0"    />
            <stop offset="88%"  stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.38" />
          </radialGradient>
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
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0"
              in="noise"
              result="grain"
            />
            <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="44" fill={color} opacity="0.84" />
        <circle cx="50" cy="50" r="44" fill={`url(#${gradId})`} />
        <rect
          x="0" y="0" width="100" height="100"
          fill={color}
          opacity="0.12"
          filter={`url(#${grainId})`}
          mask={`url(#${maskId})`}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const quickLinks = [
  { to: '/exam',       icon: Pen,      label: 'Klausur',    color: '#EA6C47', desc: 'Wissen testen'  },
  { to: '/content',    icon: BookOpen, label: 'Bibliothek', color: '#009CA6', desc: 'Kapitel lesen'  },
  { to: '/flashcards', icon: Layers,   label: 'Karten',     color: '#8D377C', desc: 'Fakten lernen'  },
  { to: '/garden',     icon: Sprout,   label: 'Garten',     color: '#6A902C', desc: 'Fehler pflegen' },
] as const;

export default function Dashboard() {
  const { data: subjects, isLoading } = useSubjects();

  const stats = useMemo(() => {
    if (!subjects) return { totalTopics: 0, totalQuestions: 0 };
    return subjects.reduce(
      (acc, s) => ({
        totalTopics:     acc.totalTopics     + (s._count?.topics    || 0),
        totalQuestions:  acc.totalQuestions  + (s._count?.questions || 0),
      }),
      { totalTopics: 0, totalQuestions: 0 }
    );
  }, [subjects]);

  if (isLoading) return (
    <div className="flex justify-center py-40">
      <Spinner />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-14">

      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-[10px] font-typewriter tracking-[0.42em] text-[#673147]/35 uppercase">
          おかえり &nbsp;·&nbsp; willkommen
        </p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,5.5rem)] text-[#673147] leading-none">
          hey marthi.
        </h1>
        <div className="text-[#673147]/14 pt-0.5">
          <HandLine />
        </div>
        <p className="font-typewriter text-base text-[#4A3A2F]/48 pt-1">
          Womit fangen wir heute an?
        </p>
      </div>

      {/* ── Quick navigation ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickLinks.map((link, i) => (
          <NavLink key={link.to} to={link.to} className="group outline-none">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              className="flex flex-col items-center gap-3 py-5 px-2 text-center rounded-sm"
            >
              <WatercolorDot color={link.color} index={i}>
                <link.icon className="w-7 h-7 text-white stroke-[1.5]" />
              </WatercolorDot>
              <div>
                <div className="font-display text-[1.45rem] text-[#673147] leading-none group-hover:opacity-60 transition-opacity">
                  {link.label}
                </div>
                <div className="text-[9px] font-typewriter uppercase tracking-[0.22em] text-[#4A3A2F]/38 mt-1">
                  {link.desc}
                </div>
              </div>
            </motion.div>
          </NavLink>
        ))}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="text-[#673147]/12">
        <HandLine />
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end gap-10">
        <div>
          <div className="font-display text-[5.5rem] text-[#673147] leading-none tabular-nums">
            {stats.totalTopics}
          </div>
          <p className="text-[10px] font-typewriter uppercase tracking-[0.32em] text-[#4A3A2F]/42 mt-1.5">
            Kapitel
          </p>
        </div>

        <div className="pb-5 text-[#673147]/18 font-display text-5xl select-none">·</div>

        <div>
          <div className="font-display text-[5.5rem] text-[#673147] leading-none tabular-nums">
            {stats.totalQuestions}
          </div>
          <p className="text-[10px] font-typewriter uppercase tracking-[0.32em] text-[#4A3A2F]/42 mt-1.5">
            Fragen
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="text-[#673147]/12">
        <HandLine />
      </div>

      {/* ── Subject list ──────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <p className="text-[10px] font-typewriter tracking-[0.42em] text-[#673147]/35 uppercase">
          Fachbereiche
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {subjects?.slice(0, 10).map((s) => (
            <NavLink
              key={s.id}
              to="/content"
              className="group flex items-center gap-3 py-2.5 border-b border-[#673147]/7 last:border-0 hover:border-[#673147]/20 transition-colors pr-3"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                style={{ backgroundColor: s.color, opacity: 0.82 }}
              />
              <span className="font-typewriter text-[13px] text-[#4A3A2F]/62 group-hover:text-[#673147] transition-colors flex-1 truncate">
                {s.name}
              </span>
              <span className="text-[#673147]/15 text-[11px] group-hover:text-[#673147]/40 group-hover:translate-x-0.5 transition-all inline-block">
                →
              </span>
            </NavLink>
          ))}
        </div>

        {subjects && subjects.length > 10 && (
          <NavLink
            to="/content"
            className="text-[9px] font-typewriter uppercase tracking-[0.35em] text-[#673147]/38 hover:text-[#673147] transition-colors"
          >
            Alle {subjects.length} Fächer →
          </NavLink>
        )}
      </div>

    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      className="w-7 h-7 border-2 border-[#673147]/15 border-t-[#673147]/60 rounded-full"
    />
  );
}

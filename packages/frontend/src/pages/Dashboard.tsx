import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { useMistakes } from '../hooks/useMistakes';
import { getIcon } from '../lib/icons';
import {
  Brain, CheckSquare, Flower2, BookOpen, ArrowRight, Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const CARD_BASE = "px-7 pb-8 pt-10 transition-all";

export default function Dashboard() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { mistakes } = useMistakes();

  const stats = useMemo(() => {
    if (!subjects) return { totalTopics: 0, totalQuestions: 0 };
    return subjects.reduce((acc, s) => ({
      totalTopics: acc.totalTopics + (s._count?.topics || 0),
      totalQuestions: acc.totalQuestions + (s._count?.questions || 0)
    }), { totalTopics: 0, totalQuestions: 0 });
  }, [subjects]);

  const quickLinks = [
    { to: '/exam',       icon: CheckSquare, label: 'Klausur',    color: '#C96843', desc: 'Wissen testen' },
    { to: '/content',    icon: BookOpen,    label: 'Bibliothek', color: '#2F9E98', desc: 'Kapitel lesen' },
    { to: '/flashcards', icon: Brain,       label: 'Karten',     color: '#7F2982', desc: 'Fakten lernen' },
    { to: '/garden',     icon: Flower2,     label: 'Garten',     color: '#899E70', desc: 'Fehler pflegen' },
  ];

  if (subjectsLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-[#673147]" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pt-20 pb-10 px-4 space-y-12">

      {/* Top row: Welcome left + Stats right */}
      <div className="flex flex-wrap items-start gap-12">

        {/* Welcome */}
        <div className={cn(CARD_BASE, "scribble-border bg-[var(--light-cream)] max-w-xl")}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#673147]/10 text-[#673147] text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" /> hey marthi!
          </div>
          <h1 className="text-5xl md:text-6xl font-display text-[#673147] leading-tight mt-3">
            Schön, dass du da bist!
          </h1>
          <p className="text-xl text-[#4A3A2F]/60 font-typewriter mt-4">
            Wähle ein Fach und leg los.
          </p>
        </div>

        {/* Stats */}
        <div className={cn(CARD_BASE, "scribble-border bg-[var(--light-cream)] flex flex-col justify-center gap-6 min-w-[200px]")}>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Kapitel</div>
            <div className="font-display text-5xl text-[#673147]">{stats.totalTopics}</div>
          </div>
          <div className="border-t border-[#4A3A2F]/10" />
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Fragen</div>
            <div className="font-display text-5xl text-[#673147]">{stats.totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Quick Actions */}
        <div className={cn(CARD_BASE, "lg:col-span-7 bg-[var(--light-cream)] scribble-border space-y-6")}>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Schnellzugriff</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="group scribble-border flex items-center justify-between px-6 py-5 bg-white/40 hover:bg-white/60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: `${link.color}`, color: 'white' }}>
                    <link.icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-3xl text-[#673147] leading-none">{link.label}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mt-1">{link.desc}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#4A3A2F]/20 group-hover:text-[#673147] group-hover:translate-x-1 transition-all" />
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className={cn(CARD_BASE, "lg:col-span-5 scribble-border bg-[var(--light-cream)] space-y-8")}>

          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Fortschritt</div>
            {subjects?.slice(0, 4).map(s => (
              <div key={s.id} className="space-y-2 pb-4 border-b border-[#4A3A2F]/8 last:border-0">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#4A3A2F]/60">
                  <span>{s.name}</span>
                  <span>{(s as any).progress || 0}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#4A3A2F]/10 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s as any).progress || 0}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
            <NavLink to="/content" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#673147]/50 hover:text-[#673147] hover:gap-3 transition-all">
              Alle Fächer <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>

          <div className="border-t border-[#4A3A2F]/10" />

          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-3">Zuletzt besucht</div>
            {subjects?.slice(4, 8).map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <NavLink key={s.id} to="/content" className="flex items-center gap-3 py-2.5 border-b border-[#4A3A2F]/8 last:border-0 group">
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center" style={{ backgroundColor: `${s.color}30`, color: s.color }}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-[#4A3A2F]/60 truncate flex-1 group-hover:text-[#4A3A2F] transition-colors">{s.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#4A3A2F]/20 group-hover:text-[#673147] transition-colors" />
                </NavLink>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className={cn("w-10 h-10 border-4 border-current border-t-transparent rounded-full", className)}
  />
);

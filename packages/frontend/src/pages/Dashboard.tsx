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

const CARD = "bg-[#F2EDD7] p-7";

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
    { to: '/exam',       icon: CheckSquare, label: 'Klausur',    color: '#8B1E1E', desc: 'Wissen testen' },
    { to: '/content',    icon: BookOpen,    label: 'Bibliothek', color: '#A3B18A', desc: 'Kapitel lesen' },
    { to: '/flashcards', icon: Brain,       label: 'Karten',     color: '#E9C46A', desc: 'Fakten lernen' },
    { to: '/garden',     icon: Flower2,     label: 'Garten',     color: '#B8D3E5', desc: 'Fehler pflegen' },
  ];

  if (subjectsLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-4">

      {/* Top row: Welcome left + Stats right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Welcome */}
        <div className={cn(CARD, "lg:col-span-8 space-y-3")}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B1E1E]/10 text-[#8B1E1E] text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" /> hey marthi!
          </div>
          <h1 className="text-5xl md:text-6xl font-display text-[#8B1E1E] leading-tight">
            Schön, dass du da bist
          </h1>
          <p className="text-base text-[#4A3A2F]/60 font-serif italic">
            Bereit für eine Prise medizinisches Wissen?
          </p>
        </div>

        {/* Stats */}
        <div className={cn(CARD, "lg:col-span-4 flex flex-col justify-center gap-4")}>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Kapitel</div>
            <div className="font-display text-5xl text-[#8B1E1E]">{stats.totalTopics}</div>
          </div>
          <div className="border-t border-[#4A3A2F]/10" />
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Fragen</div>
            <div className="font-display text-5xl text-[#8B1E1E]">{stats.totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Quick Actions */}
        <div className={cn(CARD, "lg:col-span-7 space-y-2")}>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-4">Schnellzugriff</div>
          {quickLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="group flex items-center justify-between px-5 py-4 bg-white/80 hover:bg-white border border-[#4A3A2F]/6 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ backgroundColor: `${link.color}18`, color: link.color }}>
                  <link.icon className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl text-[#4A3A2F]">{link.label}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30 hidden sm:inline">{link.desc}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A3A2F]/20 group-hover:text-[#8B1E1E] group-hover:translate-x-1 transition-all" />
            </NavLink>
          ))}
        </div>

        {/* Sidebar */}
        <div className={cn(CARD, "lg:col-span-5 space-y-5")}>

          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Fortschritt</div>
            {subjects?.slice(0, 4).map(s => (
              <div key={s.id} className="space-y-1.5 pb-3 border-b border-[#4A3A2F]/8 last:border-0">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/50">
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
            <NavLink to="/content" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8B1E1E]/50 hover:text-[#8B1E1E] hover:gap-3 transition-all">
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
                  <ArrowRight className="w-3 h-3 text-[#4A3A2F]/20 group-hover:text-[#8B1E1E] transition-colors" />
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

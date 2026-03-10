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
    { to: '/exam',       icon: CheckSquare, label: 'Klausur',    color: '#EA6C47', desc: 'Wissen testen' },
    { to: '/content',    icon: BookOpen,    label: 'Bibliothek', color: '#009CA6', desc: 'Kapitel lesen' },
    { to: '/flashcards', icon: Brain,       label: 'Karten',     color: '#8D377C', desc: 'Fakten lernen' },
    { to: '/garden',     icon: Flower2,     label: 'Garten',     color: '#6A902C', desc: 'Fehler pflegen' },
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
            <div className="text-xl font-display text-[#4A3A2F]/40 leading-none">Kapitel</div>
            <div className="font-display text-6xl text-[#673147]">{stats.totalTopics}</div>
          </div>
          
          {/* Hand-drawn Divider */}
          <div className="h-4 flex items-center justify-center -mx-4">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full text-[#4A3A2F]/15">
              <path 
                d="M 5,5 Q 25,2 50,5 T 95,5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                className="path-scribble"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-display text-[#4A3A2F]/40 leading-none">Fragen</div>
            <div className="font-display text-6xl text-[#673147]">{stats.totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Quick Actions */}
        <div className={cn(CARD_BASE, "lg:col-span-7 bg-[var(--light-cream)] scribble-border space-y-6")}>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">Schnellzugriff</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickLinks.map((link, i) => {
              const filterId = `wc-dash-${i}`;
              const seeds = [3, 7, 14, 21];
              const offsets = [{ x: 44, y: 43 }, { x: 55, y: 46 }, { x: 42, y: 55 }, { x: 56, y: 44 }];
              const off = offsets[i % offsets.length];
              return (
              <NavLink
                key={link.to}
                to={link.to}
                className="group scribble-border flex items-center justify-between px-6 py-5 bg-white/40 hover:bg-white/60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 relative flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                          <feTurbulence type="turbulence" baseFrequency="0.038" numOctaves="4" seed={seeds[i]} result="noise"/>
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G"/>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="40" fill={link.color} filter={`url(#${filterId})`} opacity="0.88"/>
                      <circle cx={off.x} cy={off.y} r="27" fill={link.color} filter={`url(#${filterId})`} opacity="0.28"/>
                      <circle cx={100 - off.x} cy={100 - off.y} r="18" fill="white" filter={`url(#${filterId})`} opacity="0.18"/>
                    </svg>
                    <link.icon className="w-6 h-6 stroke-[2.5] text-white relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-3xl text-[#673147] leading-none">{link.label}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mt-1">{link.desc}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#4A3A2F]/20 group-hover:text-[#673147] group-hover:translate-x-1 transition-all" />
              </NavLink>
              );
            })}
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

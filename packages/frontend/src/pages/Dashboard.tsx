import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { useMistakes } from '../hooks/useMistakes';
import { getIcon } from '../lib/icons';
import {
  Brain, CheckSquare, Flower2, TrendingUp, BookOpen, ArrowRight, Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

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
    { to: '/exam', icon: CheckSquare, label: 'klausur', color: '#8B1E1E', desc: 'wissen testen' },
    { to: '/content', icon: BookOpen, label: 'bibliothek', color: '#A3B18A', desc: 'kapitel lesen' },
    { to: '/flashcards', icon: Brain, label: 'karten', color: '#E9C46A', desc: 'fakten lernen' },
    { to: '/garden', icon: Flower2, label: 'garten', color: '#B8D3E5', desc: 'fehler pflegen' },
  ];

  if (subjectsLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]" /></div>;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Welcome */}
      <div className="pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B1E1E]/8 rounded-full text-[#8B1E1E] text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3" /> hey marthi!
        </div>
        <h1 className="text-5xl md:text-6xl font-display text-[#8B1E1E] lowercase leading-tight">schön, dass du da bist</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-lg text-[#4A3A2F]/60 font-serif italic">bereit für eine prise medizinisches wissen?</p>
          <span className="px-4 py-1.5 bg-[#F9F4E8] rounded-full text-[#8B1E1E] font-black text-xs">{stats.totalTopics} kapitel</span>
          <span className="px-4 py-1.5 bg-[#B8D3E5] rounded-full text-[#4A3A2F] font-black text-xs">{stats.totalQuestions} fragen</span>
        </div>
      </div>

      {/* Checker divider */}
      <div className="border-checker mb-10" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8">

        {/* Quick Actions – Pill-Shapes */}
        <div className="lg:col-span-7 space-y-3">
          {quickLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="group flex items-center justify-between px-8 py-5 bg-[#F9F4E8] rounded-full border border-[#4A3A2F]/8 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.06)' }}
            >
              <div className="flex items-center gap-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${link.color}18`, color: link.color }}>
                  <link.icon className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-[#4A3A2F] lowercase">{link.label}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/35 lowercase hidden sm:inline">{link.desc}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A3A2F]/25 group-hover:text-[#8B1E1E] group-hover:translate-x-1 transition-all" />
            </NavLink>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-8 pt-2 lg:pl-8 lg:border-l lg:border-[#4A3A2F]/10">

          {/* Fortschritt */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-[#8B1E1E] lowercase">dein fortschritt</h3>
            <div className="space-y-3">
              {subjects?.slice(0, 4).map(s => (
                <div key={s.id} className="space-y-1.5 pb-3 border-b border-[#4A3A2F]/8 last:border-0">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/50 lowercase">
                    <span>{s.name.toLowerCase()}</span>
                    <span>{(s as any).progress || 0}%</span>
                  </div>
                  <div className="h-1 w-full bg-[#4A3A2F]/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(s as any).progress || 0}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <NavLink to="/content" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8B1E1E]/50 hover:text-[#8B1E1E] hover:gap-3 transition-all lowercase">
              alle fächer <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>

          <div className="border-t border-[#4A3A2F]/10" />

          {/* Fachbereiche */}
          <div className="space-y-1">
            <h4 className="text-2xl font-display text-[#8B1E1E] lowercase mb-3">zuletzt besucht</h4>
            {subjects?.slice(4, 8).map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-[#4A3A2F]/8 last:border-0 group cursor-pointer">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: `${s.color}25`, color: s.color }}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-[#4A3A2F]/60 truncate lowercase flex-1 group-hover:text-[#4A3A2F] transition-colors">{s.name.toLowerCase()}</span>
                  <ArrowRight className="w-3 h-3 text-[#4A3A2F]/20 group-hover:text-[#8B1E1E] transition-colors" />
                </div>
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

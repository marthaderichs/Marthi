import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudyPlan } from '../hooks/useStudyPlan';
import { useSubjects } from '../hooks/useSubjects';
import { Plus, X, Check, Trash2, ChevronLeft, ChevronRight, BookOpen, Brain, CheckSquare, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const TYPE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  reading:    { label: 'Lesen',     icon: BookOpen,     color: '#A3B18A' },
  flashcards: { label: 'Karten',    icon: Brain,        color: '#E9C46A' },
  exam:       { label: 'Klausur',   icon: CheckSquare,  color: '#8B1E1E' },
};

function getWeekRange(offset: number) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function StudyPlan() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAdd, setShowAdd] = useState<string | null>(null); // date string
  const [draft, setDraft] = useState({ subjectId: '', type: 'reading', durationMin: 30 });

  const weekDays = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const from = weekDays[0];
  const to = weekDays[6];

  const { items, isLoading, addItem, toggleCompleted, deleteItem } = useStudyPlan(from, to);
  const { data: subjects } = useSubjects();

  const today = new Date().toISOString().split('T')[0];

  const itemsForDay = (date: string) => items.filter(i => i.date === date);

  const handleAdd = async () => {
    if (!draft.subjectId || !showAdd) return;
    await addItem(showAdd, draft.subjectId, draft.type, draft.durationMin);
    setShowAdd(null);
    setDraft({ subjectId: '', type: 'reading', durationMin: 30 });
  };

  const subjectFor = (id: string) => subjects?.find(s => s.id === id);

  const weekLabel = () => {
    if (weekOffset === 0) return 'Diese Woche';
    if (weekOffset === 1) return 'Nächste Woche';
    if (weekOffset === -1) return 'Letzte Woche';
    const d = new Date(from);
    return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })} – ${new Date(to).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-7xl font-display text-[#8B1E1E]">Lernplan</h1>
        <p className="text-xl text-[#4A3A2F]/45 font-serif italic">
          „Kleine Schritte, jeden Tag."
        </p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between pb-2">
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-xl text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-display text-2xl text-[#4A3A2F]">{weekLabel()}</span>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 rounded-xl text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, i) => {
          const dayItems = itemsForDay(date);
          const isToday = date === today;
          return (
            <div
              key={date}
              className={cn(
                "flex flex-col gap-2 min-h-[200px] p-3 rounded-2xl border transition-all",
                isToday
                  ? "bg-[#8B1E1E]/5 border-[#8B1E1E]/15"
                  : "bg-[#F9F4E8] border-[#4A3A2F]/8"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40">{DAY_LABELS[i]}</div>
                  <div className={cn("font-display text-xl leading-none", isToday ? "text-[#8B1E1E]" : "text-[#4A3A2F]/60")}>
                    {new Date(date).getDate()}
                  </div>
                </div>
                <button
                  onClick={() => setShowAdd(date)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-[#4A3A2F]/8 hover:bg-[#8B1E1E] hover:text-white text-[#4A3A2F]/40 transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <AnimatePresence>
                  {dayItems.map(item => {
                    const sub = subjectFor(item.subjectId);
                    const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.reading;
                    const Icon = typeInfo.icon;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                          "group relative rounded-xl p-2 text-left cursor-pointer transition-all",
                          item.completed ? "opacity-50" : ""
                        )}
                        style={{ backgroundColor: `${sub?.color || '#8B1E1E'}18`, borderLeft: `3px solid ${sub?.color || '#8B1E1E'}` }}
                        onClick={() => toggleCompleted(item.id, !item.completed)}
                      >
                        <div className="flex items-start gap-1.5">
                          <Icon className="w-3 h-3 mt-0.5 shrink-0" style={{ color: sub?.color || '#8B1E1E' }} />
                          <div className="flex-1 min-w-0">
                            <div className={cn("text-[10px] font-bold leading-snug truncate", item.completed && "line-through")}
                              style={{ color: sub?.color || '#8B1E1E' }}>
                              {sub?.name || item.subjectId}
                            </div>
                            <div className="text-[9px] text-[#4A3A2F]/40">{typeInfo.label} · {item.durationMin}min</div>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#4A3A2F]/30 hover:text-[#8B1E1E] transition-all"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4A3A2F]/40 backdrop-blur-sm"
            onClick={() => setShowAdd(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-[#F9F4E8] rounded-[32px] shadow-2xl p-10 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-[#8B1E1E]">
                  Einheit planen · {new Date(showAdd).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
                </h2>
                <button onClick={() => setShowAdd(null)} className="p-2 rounded-full border border-[#4A3A2F]/10 text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-2 block">Fachbereich</label>
                  <select
                    value={draft.subjectId}
                    onChange={e => setDraft(d => ({ ...d, subjectId: e.target.value }))}
                    className="w-full bg-white border border-[#4A3A2F]/10 rounded-xl px-4 py-3 text-sm font-medium text-[#4A3A2F] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/10"
                  >
                    <option value="">Fach wählen…</option>
                    {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-2 block">Art</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(TYPE_LABELS).map(([key, info]) => {
                      const Icon = info.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setDraft(d => ({ ...d, type: key }))}
                          className={cn(
                            "flex flex-col items-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all",
                            draft.type === key ? "border-[#8B1E1E] bg-[#8B1E1E]/5 text-[#8B1E1E]" : "border-transparent bg-white text-[#4A3A2F]/50"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {info.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-2 block">Dauer</label>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60, 90].map(min => (
                      <button
                        key={min}
                        onClick={() => setDraft(d => ({ ...d, durationMin: min }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl font-bold text-xs border-2 transition-all",
                          draft.durationMin === min ? "bg-[#8B1E1E] text-white border-[#8B1E1E]" : "bg-white border-transparent text-[#4A3A2F]/50"
                        )}
                      >
                        {min}min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!draft.subjectId}
                className="w-full py-4 bg-[#8B1E1E] text-white rounded-2xl font-display text-xl shadow-lg hover:bg-[#763428] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Hinzufügen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

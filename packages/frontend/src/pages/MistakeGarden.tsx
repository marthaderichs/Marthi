import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMistakes, Mistake } from '../hooks/useMistakes';
import { useSubjects } from '../hooks/useSubjects';
import { cn } from '../lib/utils';
import {
  Flower2, ArrowRight, CheckCircle2, XCircle,
  Trash2, Sprout, X
} from 'lucide-react';

export default function MistakeGarden() {
  const { mistakes, removeMistake } = useMistakes();
  const { data: subjects } = useSubjects();

  const [activeMistake, setActiveMistake] = useState<Mistake | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (selectedOption === activeMistake?.correctAnswerIndex) {
      removeMistake(activeMistake!.id);
    }
    setActiveMistake(null);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DCE2C8] rounded-full text-[#344E41] text-xs font-black uppercase tracking-[0.2em]">
           <Sprout className="w-3 h-3" /> Wachstumszone
        </div>
        <h1 className="text-7xl font-display text-[#8B1E1E]">Fehler-Garten</h1>
        <p className="text-xl text-[#4A3A2F]/50 font-serif italic">
          „Aus Fehlern wachsen die schönsten Erkenntnisse."
        </p>
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-[#F9F4E8] p-20 rounded-2xl text-center border border-[#4A3A2F]/8 flex flex-col items-center gap-6" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
           <div className="w-24 h-24 bg-[#E2E8D4]/40 rounded-full flex items-center justify-center">
              <Flower2 className="w-12 h-12 text-[#A3B18A]" />
           </div>
           <h2 className="text-4xl font-display text-[#8B1E1E]">Dein Garten blüht prächtig!</h2>
           <p className="text-[#4A3A2F]/50 font-sans text-lg">Keine Fehler mehr übrig. Zeit für eine neue Klausur?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {mistakes.map((m) => {
              const subject = subjects?.find(s => s.id === m.subjectId);
              return (
                <motion.button
                  key={m.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setActiveMistake(m)}
                  className="group relative p-8 bg-[#F9F4E8] rounded-2xl border border-[#4A3A2F]/8 text-left transition-all hover:-translate-y-0.5 overflow-hidden"
                  style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}
                >
                  <div className="absolute inset-0 opacity-[0.02] bg-stripes-blue -z-10" />

                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: subject?.color || '#DCE2C8', borderRadius: '16px 4px 16px 4px' }}
                    >
                      <Sprout className="w-6 h-6 text-white/80" />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMistake(m.id); }}
                      className="p-2 text-[#8B1E1E]/10 hover:text-[#8B1E1E] transition-colors"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-[#4A3A2F] leading-tight line-clamp-3 mb-4 font-sans">{m.text}</h3>

                  <div className="mt-auto pt-4 border-t border-black/[0.03]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/20">{subject?.name || 'Fach'}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeMistake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4A3A2F]/40 backdrop-blur-sm"
            onClick={() => { if (!isAnswered) setActiveMistake(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#F9F4E8] rounded-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute inset-0 opacity-[0.03] bg-stripes-blue -z-10" />

              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-8">
                <div className="flex items-center justify-between mb-4">
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B1E1E]/40">Frage korrigieren</div>
                   {!isAnswered && (
                     <button onClick={() => setActiveMistake(null)} className="p-2 bg-[#E2E8D4] rounded-full text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                   )}
                </div>

                <h2 className="text-3xl md:text-4xl font-display text-[#8B1E1E] leading-tight text-center mb-8">{activeMistake.text}</h2>

                <div className="space-y-3">
                  {activeMistake.options.map((opt, idx) => {
                    const isCorrect = idx === activeMistake.correctAnswerIndex;
                    const isSelected = selectedOption === idx;

                    let classes = "bg-[#E2E8D4]/50 border-transparent hover:bg-white hover:border-black/5";
                    if (isAnswered) {
                      if (isCorrect) classes = "bg-[#A3B18A]/20 border-[#A3B18A] text-[#1E3A1E]";
                      else if (isSelected) classes = "bg-[#8B1E1E]/10 border-[#8B1E1E] text-[#8B1E1E]";
                      else classes = "opacity-30 grayscale-[50%]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswered}
                        className={cn(
                          "w-full text-left p-6 rounded-[24px] font-sans text-lg font-bold transition-all flex items-center justify-between border-2",
                          classes
                        )}
                      >
                        <span className="pr-4">{opt}</span>
                        <div className="shrink-0">
                          {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-[#A3B18A]" />}
                          {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-[#8B1E1E]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t border-black/[0.03] space-y-6"
                    >
                      <div className="bg-[#E2E8D4]/50 p-6 rounded-3xl border border-black/[0.02]">
                         <h4 className="text-[10px] font-black uppercase text-[#8B1E1E] mb-3">Erklärung</h4>
                         <p className="text-lg text-[#4A3A2F]/80 leading-relaxed font-serif italic">„{activeMistake.explanation}"</p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="w-full py-6 bg-[#8B1E1E] text-white rounded-3xl font-display text-3xl shadow-xl hover:bg-[#763428] transition-all flex items-center justify-center gap-4"
                      >
                         <span>{selectedOption === activeMistake.correctAnswerIndex ? 'Erledigt!' : 'Weiter üben'}</span>
                         <ArrowRight className="w-8 h-8" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

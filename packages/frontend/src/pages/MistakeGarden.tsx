import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMistakes, Mistake } from '../hooks/useMistakes';
import { useSubjects } from '../hooks/useSubjects';
import { cn } from '../lib/utils';
import {
  Flower2, ArrowRight, CheckCircle2, XCircle,
  Trash2, Sprout, X
} from 'lucide-react';
import { DisplayText } from '../components/DisplayText';

// ── Tulip SVG (viewBox 0 0 100 180, base at y=178) ─────────────────────────
function Tulip({ color, stemColor = '#6B6A18' }: { color: string; stemColor?: string }) {
  return (
    <>
      {/* Stem */}
      <path d="M 50 108 Q 51 140 50 176" stroke={stemColor} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Left leaf */}
      <path d="M 48 125 C 36 116 10 122 8 144 C 6 159 32 154 48 137 Z" fill={stemColor} />
      {/* Right leaf */}
      <path d="M 52 132 C 64 123 90 128 92 150 C 94 165 68 160 52 143 Z" fill={stemColor} />
      {/* Tulip head – 3 rounded petals */}
      <path
        d="M 50 110
           C 24 110, 12 92, 12 72
           C 12 46, 21 16, 32 14
           C 36 13, 40 31, 43 37
           C 45 25, 47 11, 50 9
           C 53 11, 55 25, 57 37
           C 60 31, 64 13, 68 14
           C 79 16, 88 46, 88 72
           C 88 92, 76 110, 50 110 Z"
        fill={color}
      />
    </>
  );
}

const GARDEN_TULIPS = [
  { cx: 58,  s: 0.72, color: '#C2341E' },   // rot
  { cx: 155, s: 0.94, color: '#E9C46A' },   // gelb
  { cx: 268, s: 0.78, color: '#E07A8A' },   // rosa
  { cx: 378, s: 1.00, color: '#673147' },   // pflaume
  { cx: 490, s: 0.86, color: '#F2B091' },   // lachs
  { cx: 600, s: 0.80, color: '#9B4F78' },   // lila
  { cx: 700, s: 0.93, color: '#B8D3E5' },   // blau-lavendel
  { cx: 792, s: 0.74, color: '#D98A5E' },   // terrakotta
];

function TulipGarden() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 160 }}>
      <svg
        viewBox="0 0 850 200"
        preserveAspectRatio="xMidYMax meet"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {GARDEN_TULIPS.map(({ cx, s, color }, i) => (
          <g key={i} transform={`translate(${(cx - 50 * s).toFixed(1)}, ${(200 - 180 * s).toFixed(1)}) scale(${s})`}>
            <Tulip color={color} />
          </g>
        ))}
      </svg>
    </div>
  );
}

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
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DCE2C8] rounded-full text-[#344E41] text-xs font-black uppercase tracking-[0.2em] translate-y-1">
           <Sprout className="w-3 h-3" /> Wachstumszone
        </div>
        <h1 className="text-7xl font-display text-[#673147]">Fehler-Garten</h1>
        <p className="text-xl text-[#4A3A2F]/50 font-typewriter">
          „Aus Fehlern wachsen die schönsten Erkenntnisse."
        </p>
        <TulipGarden />
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-[#F9F4E8] p-20 rounded-2xl text-center border border-[#4A3A2F]/8 flex flex-col items-center gap-6" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
           <div className="w-24 h-24 bg-[#E2E8D4]/40 rounded-full flex items-center justify-center">
              <Flower2 className="w-12 h-12 text-[#A3B18A]" />
           </div>
           <h2 className="text-4xl font-display text-[#673147]"><DisplayText>Dein Garten blüht prächtig!</DisplayText></h2>
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
                      className="p-2 text-[#673147]/10 hover:text-[#673147] transition-colors"
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
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#673147]/40">Frage korrigieren</div>
                   {!isAnswered && (
                     <button onClick={() => setActiveMistake(null)} className="p-2 bg-[#E2E8D4] rounded-full text-[#4A3A2F]/40 hover:text-[#673147] transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                   )}
                </div>

                <h2 className="text-3xl md:text-4xl font-display text-[#673147] leading-tight text-center mb-8">{activeMistake.text}</h2>

                <div className="space-y-3">
                  {activeMistake.options.map((opt, idx) => {
                    const isCorrect = idx === activeMistake.correctAnswerIndex;
                    const isSelected = selectedOption === idx;

                    let classes = "bg-[#E2E8D4]/50 border-transparent hover:bg-white hover:border-black/5";
                    if (isAnswered) {
                      if (isCorrect) classes = "bg-[#A3B18A]/20 border-[#A3B18A] text-[#1E3A1E]";
                      else if (isSelected) classes = "bg-[#673147]/10 border-[#673147] text-[#673147]";
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
                          {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-[#673147]" />}
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
                         <h4 className="text-2xl font-display text-[#673147] mb-3">Erklärung</h4>
                         <p className="text-lg text-[#4A3A2F]/80 leading-relaxed font-serif italic">„{activeMistake.explanation}"</p>
                      </div>
                      <button
                        onClick={handleNext}
                        className="mx-auto flex items-center gap-2 px-7 py-2.5 border border-[#673147] text-[#673147] font-display text-xl rounded-full hover:bg-[#673147] hover:text-white transition-all"
                      >
                         <DisplayText>{selectedOption === activeMistake.correctAnswerIndex ? 'Erledigt!' : 'Weiter üben'}</DisplayText>
                         <ArrowRight className="w-4 h-4" />
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

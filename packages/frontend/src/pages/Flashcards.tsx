import React, { useState, useMemo, useEffect } from 'react';
import { useFlashcards, useDueFlashcards, useReviewFlashcard } from '../hooks/useFlashcards';
import { useSubjects } from '../hooks/useSubjects';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, RotateCw, Loader2, Check, X,
  Brain, Sparkles, Play, List, Trophy, Eye, Clock, Calendar, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

type ViewState = 'setup' | 'learning' | 'summary' | 'overview';
type StudyMode = 'due' | 'all';

export default function Flashcards() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  const [view, setView] = useState<ViewState>('setup');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('due');
  const [sessionSize, setSessionSize] = useState<number | 'all'>(10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const { data: allCards, isLoading: allLoading } = useFlashcards(selectedSubjectId || undefined);
  const { data: dueCards, isLoading: dueLoading } = useDueFlashcards(selectedSubjectId || undefined);
  const reviewMutation = useReviewFlashcard();

  const activeSubject = useMemo(() => subjects?.find(s => s.id === selectedSubjectId), [subjects, selectedSubjectId]);

  const sessionCards = useMemo(() => {
    const source = studyMode === 'due' ? dueCards : allCards;
    if (!source) return [];

    // Shuffle
    const shuffled = [...source].sort(() => Math.random() - 0.5);

    if (studyMode === 'due') return shuffled; // Due cards should all be done
    return sessionSize === 'all' ? shuffled : shuffled.slice(0, sessionSize);
  }, [allCards, dueCards, studyMode, sessionSize, view === 'learning']);

  const currentCard = sessionCards[currentIndex];

  const handleStartSession = () => {
    if (sessionCards.length === 0) return;
    setCurrentIndex(0);
    setCompletedCount(0);
    setIsFlipped(false);
    setView('learning');
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < sessionCards.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 150);
    } else {
      setTimeout(() => setView('summary'), 150);
    }
  };

  const handleReview = (quality: number) => {
    if (currentCard) {
      reviewMutation.mutate({ id: currentCard.id, quality });
      setCompletedCount(c => c + 1);
      handleNext();
    }
  };

  if (subjectsLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-[#B33F33]/30" />
    </div>
  );

  // --- VIEW: OVERVIEW ---
  if (view === 'overview' && activeSubject) {
    return (
      <div className="bg-white p-10 md:p-16 rounded-[48px] shadow-2xl space-y-10 max-w-4xl mx-auto border border-black/[0.02]">
        <div className="flex items-center justify-between border-b border-[#8B3E2F]/10 pb-8">
          <h1 className="text-5xl font-display text-[#8B3E2F]">Karten: {activeSubject.name}</h1>
          <button
            onClick={() => setView('setup')}
            className="px-6 py-2.5 bg-[#E2E8D4] rounded-full text-xs font-bold uppercase tracking-widest text-[#8B3E2F] hover:bg-[#8B3E2F] hover:text-white transition-all shadow-sm"
          >
            Zurück
          </button>
        </div>
        <div className="grid gap-4">
          {allCards?.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-8 bg-[#E2E8D4]/30 rounded-3xl border border-black/[0.01] relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-[#8B3E2F]/30 uppercase tracking-[0.2em]">Vorderseite</div>
                  <p className="text-2xl font-display text-[#4A3A2F] leading-tight">{c.front}</p>
                </div>
                <div className="space-y-2 md:border-l md:pl-8 border-black/[0.05]">
                  <div className="text-[10px] font-black text-[#A3B18A] uppercase tracking-[0.2em]">Antwort</div>
                  <p className="text-lg text-[#4A3A2F]/80 font-sans leading-relaxed italic">{c.back}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW: SETUP ---
  if (view === 'setup') {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-7xl text-[#8B3E2F] font-display">Karteikarten</h1>
          <p className="text-xl text-[#4A3A2F]/45 font-serif italic">
            „Wiederholung ist das Fundament der Meisterschaft."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Subject Selection */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-black/[0.02] space-y-8">
              <h2 className="text-3xl font-display text-[#8B3E2F] flex items-center gap-3">
                 <Layers className="w-6 h-6" /> 1. Fachbereich wählen
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subjects?.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className={cn(
                      "p-6 rounded-[24px] border-2 transition-all text-base font-bold shadow-sm font-display tracking-wide text-left relative overflow-hidden group",
                      selectedSubjectId === s.id
                        ? "shadow-md ring-4 ring-[#8B3E2F]/10 scale-[1.02]"
                        : "bg-[#E2E8D4]/50 text-[#4A3A2F]/60 border-transparent hover:bg-white hover:border-[#8B3E2F]/10"
                    )}
                    style={selectedSubjectId === s.id ? { backgroundColor: s.color, borderColor: s.color, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' } : {}}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Study Mode */}
            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-black/[0.02] space-y-8">
              <h2 className="text-3xl font-display text-[#8B3E2F] flex items-center gap-3">
                 <Brain className="w-6 h-6" /> 2. Lern-Modus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button
                    onClick={() => setStudyMode('due')}
                    className={cn(
                       "p-6 rounded-[24px] border-2 transition-all text-left space-y-2",
                       studyMode === 'due' ? "bg-[#A3B18A]/10 border-[#A3B18A]" : "bg-[#E2E8D4]/50 border-transparent hover:bg-white hover:border-black/5"
                    )}
                 >
                    <div className="flex items-center gap-2 text-[#A3B18A] font-bold uppercase tracking-widest text-[10px]">
                       <Clock className="w-3 h-3" /> Fällige Karten
                    </div>
                    <div className="text-2xl font-display text-[#4A3A2F]">Intelligente Wiederholung</div>
                    <p className="text-xs text-[#4A3A2F]/40 leading-relaxed font-sans">Karten, die du laut SM-2-Algorithmus heute wiederholen solltest.</p>
                 </button>

                 <button
                    onClick={() => setStudyMode('all')}
                    className={cn(
                       "p-6 rounded-[24px] border-2 transition-all text-left space-y-2",
                       studyMode === 'all' ? "bg-[#8B1E1E]/5 border-[#8B1E1E]/20" : "bg-[#E2E8D4]/50 border-transparent hover:bg-white hover:border-black/5"
                    )}
                 >
                    <div className="flex items-center gap-2 text-[#8B1E1E] font-bold uppercase tracking-widest text-[10px]">
                       <Calendar className="w-3 h-3" /> Alle Karten
                    </div>
                    <div className="text-2xl font-display text-[#4A3A2F]">Stapel durchblättern</div>
                    <p className="text-xs text-[#4A3A2F]/40 leading-relaxed font-sans">Alle Karten des Fachbereichs im Schnelldurchlauf lernen.</p>
                 </button>
              </div>

              {studyMode === 'all' && (
                 <div className="pt-6 border-t border-black/[0.03] animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#4A3A2F]/40 mb-4">Portionsgröße</h4>
                    <div className="flex flex-wrap gap-2">
                       {[5, 10, 20, 50, 'all'].map(size => (
                          <button
                             key={size}
                             onClick={() => setSessionSize(size as any)}
                             className={cn(
                                "px-6 py-2 rounded-full border-2 font-bold text-xs tracking-widest transition-all",
                                sessionSize === size ? "bg-[#8B1E1E] text-white border-[#8B1E1E]" : "bg-[#E2E8D4]/50 border-transparent hover:bg-white hover:border-black/5"
                             )}
                          >
                             {size === 'all' ? 'Alle' : size}
                          </button>
                       ))}
                    </div>
                 </div>
              )}
            </section>
          </div>

          {/* Start Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-black/[0.01] sticky top-32 space-y-8 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] bg-stripes-blue -z-10" />

              <div className="w-20 h-20 bg-[#E2E8D4] rounded-[24px] flex items-center justify-center mx-auto mb-6">
                 <Brain className="w-10 h-10 text-[#8B3E2F]" />
              </div>

              <div className="space-y-2">
                 <h3 className="text-4xl font-display text-[#8B3E2F]">Dein Stapel</h3>
                 <p className="text-xs font-black uppercase tracking-widest text-[#4A3A2F]/30">
                    {activeSubject ? activeSubject.name : 'Fach wählen'}
                 </p>
              </div>

              <div className="bg-[#E2E8D4]/50 p-6 rounded-3xl border border-black/[0.02]">
                 <div className="text-5xl font-display text-[#8B1E1E]">{sessionCards.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/40 mt-1">
                    {studyMode === 'due' ? 'Fällige Karten' : 'Karten im Paket'}
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleStartSession}
                  disabled={!selectedSubjectId || sessionCards.length === 0}
                  className="w-full py-6 bg-[#8B1E1E] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#763428] transition-all flex items-center justify-center gap-3 disabled:opacity-20 group"
                >
                  <span>Starten</span>
                  <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => setView('overview')}
                  disabled={!selectedSubjectId || !allCards?.length}
                  className="w-full py-2 text-[#4A3A2F]/30 font-bold text-[10px] uppercase tracking-widest hover:text-[#8B1E1E] transition-all flex items-center justify-center gap-2 disabled:opacity-0"
                >
                  <Eye className="w-4 h-4" /> Alle Karten ansehen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: SUMMARY ---
  if (view === 'summary') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center p-16 bg-white rounded-[48px] shadow-2xl border border-black/[0.02]"
        >
          <div className="w-24 h-24 bg-[#E9C46A]/20 flex items-center justify-center mx-auto mb-10 rounded-3xl shadow-sm">
            <Trophy className="w-12 h-12 text-[#8B1E1E]" />
          </div>
          <h2 className="text-5xl font-display text-[#8B1E1E] mb-3">Stapel gemeistert!</h2>
          <p className="text-lg text-[#4A3A2F]/40 mb-12 font-serif italic px-4">„Du hast heute {completedCount} Karten gelernt. Dein Gehirn wird es dir danken!"</p>
          <div className="space-y-4">
            <button
              onClick={() => setView('setup')}
              className="w-full py-5 bg-[#8B1E1E] text-white rounded-2xl font-display text-2xl shadow-xl hover:bg-[#763428] transition-all"
            >
              Nächste Lerneinheit
            </button>
            <button
              onClick={handleStartSession}
              className="w-full py-3 text-[#4A3A2F]/30 font-bold text-xs hover:text-[#4A3A2F] transition-all uppercase tracking-widest"
            >
              Stapel nochmal wiederholen
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- VIEW: LEARNING ---
  return (
    <div className="max-w-3xl mx-auto space-y-12 bg-white p-8 md:p-16 rounded-[48px] shadow-2xl border border-black/[0.02] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#E2E8D4]">
         <motion.div
            className="h-full bg-[#8B1E1E]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
         />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('setup')}
          className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30 hover:text-[#8B1E1E] transition-colors"
        >
          Abbrechen
        </button>
        <div className="px-4 py-1 bg-[#E2E8D4] rounded-full text-xl font-display text-[#8B1E1E]">
           {currentIndex + 1} <span className="text-xs opacity-40 mx-1">von</span> {sessionCards.length}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-lg" style={{ perspective: '2000px' }}>
          <motion.div
            className="relative w-full cursor-pointer"
            style={{ transformStyle: 'preserve-3d', height: '450px' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div
              className="absolute inset-0 p-12 flex flex-col bg-[#E2E8D4]/40 border border-black/[0.02] rounded-[40px] shadow-sm overflow-hidden"
              style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 1 }}
            >
              <div className="flex items-center justify-between mb-auto">
                <div className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-sm" style={{ backgroundColor: activeSubject?.color }}>
                  {activeSubject?.name}
                </div>
                <RotateCw className="w-5 h-5 text-[#8B1E1E]/20" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-4xl font-display text-[#8B1E1E] text-center leading-tight">{currentCard?.front}</p>
              </div>
              <div className="mt-auto text-center flex items-center justify-center gap-2 opacity-[0.2]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Wenden</span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 p-12 flex flex-col bg-white border-4 border-[#E2E8D4] rounded-[40px] shadow-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 1 : 0 }}
            >
              <div className="flex items-center justify-between mb-auto">
                <div className="px-5 py-2 bg-[#8B1E1E]/10 text-[#8B1E1E] text-[10px] font-black uppercase tracking-widest rounded-full">Die Antwort</div>
                <RotateCw className="w-5 h-5 text-[#8B1E1E]/10" />
              </div>
              <div className="flex-1 flex items-center justify-center overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-xl md:text-2xl text-[#4A3A2F] text-center leading-[1.6] font-serif italic">{currentCard?.back}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8" onClick={e => e.stopPropagation()}>
                <button
                   onClick={() => handleReview(1)}
                   className="py-4 bg-[#E2E8D4] text-[#8B1E1E] rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#8B1E1E]/10 transition-all shadow-sm"
                >
                   Wiederholen
                </button>
                <button
                   onClick={() => handleReview(5)}
                   className="py-4 bg-[#8B1E1E] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#8B1E1E]/20"
                >
                   Gewusst!
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-12 mt-12">
          <button onClick={() => { setIsFlipped(false); setTimeout(() => setCurrentIndex(i => (i - 1 + sessionCards.length) % sessionCards.length), 150); }} className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-[#4A3A2F]/20 hover:text-[#8B1E1E] transition-all border border-black/5 shadow-md"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={() => { setIsFlipped(false); setTimeout(() => setCurrentIndex(i => (i + 1) % sessionCards.length), 150); }} className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-[#4A3A2F]/20 hover:text-[#8B1E1E] transition-all border border-black/5 shadow-md"><ChevronRight className="w-8 h-8" /></button>
        </div>
      </div>
    </div>
  );
}

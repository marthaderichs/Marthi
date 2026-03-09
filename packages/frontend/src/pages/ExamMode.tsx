import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { useExamGenerate, useExamSubmit } from '../hooks/useExam';
import { useMistakes } from '../hooks/useMistakes';
import { cn } from '../lib/utils';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Loader2, RotateCcw, Sparkles, Settings2, Info, Layers } from 'lucide-react';
import { getIcon } from '../lib/icons';

// Helper to clean up messy explanation texts
const formatExplanation = (text: string) => {
  if (!text) return null;
  
  // Remove technical prefixes like "frage:", "thema:", "kernaspekt:" if they appear at start of line
  let cleaned = text.replace(/^(frage|thema|kernaspekt|antwort|erklärung):\s*/gmi, '');
  
  cleaned = cleaned.replace(/\|?\s*:?-+:?\s*\|/g, '');
  const parts = cleaned.split('|').map(p => p.trim()).filter(p => p.length > 0);
  
  if (parts.length > 5) {
    return (
      <div className="space-y-4">
        {parts.map((part, i) => {
          if (/^[A-E]$/.test(part)) {
            return <div key={i} className="font-bold text-[#8B1E1E] pt-2 border-t border-black/5 mt-4 first:mt-0 first:border-0 lowercase">option {part}:</div>;
          }
          return <p key={i} className={cn("leading-relaxed", part === 'Richtig' || part === 'richtig' ? "text-[#A3B18A] font-bold" : part === 'Falsch' || part === 'falsch' ? "text-[#8B1E1E]/60" : "")}>{part}</p>;
        })}
      </div>
    );
  }
  return <p className="leading-relaxed whitespace-pre-wrap">{cleaned}</p>;
};

export default function ExamMode() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { addMistake } = useMistakes();
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [quizCount, setQuizCount] = useState(10);
  const [onlyNew, setOnlyNew] = useState(false);

  const { data: examSession, isLoading: examLoading, refetch } = useExamGenerate(
    quizStarted ? selectedSubjectId : null, 
    quizCount, 
    selectedTopicIds,
    onlyNew
  );
  
  const submitExam = useExamSubmit();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);

  const questions = examSession?.questions || [];
  const question = questions[currentIndex];
  const subject = subjects?.find(s => s.id === selectedSubjectId);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setAnswers(prev => [...prev, { questionId: question.id, selectedIndex: index }]);
    if (index === question.correctAnswerIndex) {
      setScore(s => s + 1);
    } else {
      addMistake(question);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      submitExam.mutate({ subjectId: selectedSubjectId!, answers });
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0); setSelectedOption(null); setIsAnswered(false);
    setScore(0); setShowSummary(false); setAnswers([]);
    refetch();
  };

  const selectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedTopicIds([]);
    setSetupMode(true);
  };

  const startQuiz = () => {
    setCurrentIndex(0); setSelectedOption(null); setIsAnswered(false);
    setScore(0); setShowSummary(false); setAnswers([]);
    setSetupMode(false);
    setQuizStarted(true);
  };

  if (subjectsLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-[#8B3E2F]/40" /></div>;

  if (!quizStarted && !setupMode) return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#8B1E1E] lowercase">klausur-modus</h1>
        <p className="text-xl text-[#4A3A2F]/50 font-medium font-sans lowercase">wähle ein fach und leg los.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects?.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSubject(s.id)}
            className="group relative p-8 bg-[#F9F4E8] rounded-2xl border border-[#4A3A2F]/8 transition-all text-left hover:-translate-y-0.5"
            style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-6 rounded-2xl" style={{ backgroundColor: s.color }}>
                {React.createElement(getIcon(s.icon), { className: "w-7 h-7 text-white" })}
            </div>
            <h3 className="text-3xl font-bold text-[#8B1E1E] font-display mb-1">{s.name}</h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30 lowercase">{s._count?.questions || 0} fragen</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (setupMode && subject) return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-[#F9F4E8] p-10 rounded-2xl border border-[#4A3A2F]/8 space-y-8" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
            <div className="flex items-center gap-6 pb-6 border-b border-black/[0.03]">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: subject.color }}>
                    {React.createElement(getIcon(subject.icon), { className: "w-8 h-8 text-white" })}
                </div>
                <div>
                    <h2 className="text-4xl font-display text-[#8B1E1E]">{subject.name}</h2>
                    <button onClick={() => setSetupMode(false)} className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30 hover:text-[#8B1E1E] transition-colors lowercase">abbrechen</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#4A3A2F]/50 flex items-center gap-2 lowercase"><Settings2 className="w-3 h-3" /> fragenanzahl</h4>
                  <div className="flex gap-3">
                      {[5, 10, 20].map(count => (
                          <button key={count} onClick={() => setQuizCount(count)} className={cn("flex-1 py-4 rounded-2xl font-display text-2xl border-2 transition-all", quizCount === count ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-lg" : "bg-[#E2E8D4]/50 border-transparent text-[#4A3A2F]/40 hover:bg-white")}>{count}</button>
                      ))}
                  </div>
              </div>

              <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#4A3A2F]/50 flex items-center gap-2 lowercase"><Sparkles className="w-3 h-3" /> filter</h4>
                  <button 
                    onClick={() => setOnlyNew(!onlyNew)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-display text-xl border-2 transition-all flex items-center justify-center gap-3",
                      onlyNew ? "bg-[#A3B18A] text-white border-[#A3B18A] shadow-lg" : "bg-[#E2E8D4]/50 border-transparent text-[#4A3A2F]/40 hover:bg-white"
                    )}
                  >
                    {onlyNew ? 'nur neue fragen' : 'alle fragen'}
                  </button>
              </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#4A3A2F]/50 flex items-center gap-2 lowercase"><Layers className="w-3 h-3" /> themen (optional)</h4>
                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar text-sm">
                    {subject.topics?.map(topic => (
                        <button key={topic.id} onClick={() => setSelectedTopicIds(prev => prev.includes(topic.id) ? prev.filter(id => id !== topic.id) : [...prev, topic.id])} className={cn("text-left p-4 rounded-xl font-bold border-2 transition-all flex justify-between items-center group", selectedTopicIds.includes(topic.id) ? "bg-[#A3B18A]/10 border-[#A3B18A] text-[#1E3A1E]" : "bg-white border-black/[0.03] text-[#4A3A2F]/60")}>
                            <span className="truncate pr-4">{topic.title}</span>
                            <div className={cn("w-5 h-5 rounded-full border-2 transition-all shrink-0", selectedTopicIds.includes(topic.id) ? "bg-[#A3B18A] border-[#A3B18A]" : "border-black/10")} />
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={startQuiz} className="w-full py-6 bg-[#8B1E1E] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#763428] transition-all lowercase">starten</button>
        </div>
    </div>
  );

  if (examLoading) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Sparkles className="w-10 h-10 text-[#E9C46A] animate-pulse" /><p className="text-2xl font-bold text-[#8B1E1E] tracking-tight font-display lowercase">lade fragen...</p></div>;

  if (showSummary) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center p-16 bg-[#F9F4E8] rounded-2xl border border-[#4A3A2F]/8" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
            <Trophy className="w-16 h-16 text-[#E9C46A] mx-auto mb-8" />
            <h2 className="text-5xl font-bold text-[#8B1E1E] font-display mb-4 lowercase">ergebnis</h2>
            <div className="text-8xl font-extrabold text-[#8B1E1E] mb-10 font-display">{Math.round((score / questions.length) * 100)}%</div>
            <div className="space-y-4">
                <button onClick={handleRestart} className="w-full py-5 bg-[#8B1E1E] text-white rounded-2xl font-bold text-xl font-display shadow-lg lowercase">nochmal</button>
                <button onClick={() => { setQuizStarted(false); setSetupMode(false); }} className="w-full py-2 text-[#4A3A2F]/30 font-bold text-xs uppercase font-sans lowercase">beenden</button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#F9F4E8] p-8 md:p-16 rounded-2xl space-y-12 max-w-4xl mx-auto border border-[#4A3A2F]/8 relative overflow-hidden" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[#E2E8D4]"><motion.div className="h-full bg-[#8B1E1E]" initial={{ width: 0 }} animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }} transition={{ duration: 0.4 }} /></div>
      <div className="flex items-center justify-between">
        <button onClick={() => { setQuizStarted(false); setSetupMode(false); }} className="text-[10px] font-black uppercase text-[#4A3A2F]/20 hover:text-[#8B1E1E] font-sans lowercase">abbrechen</button>
        <div className="px-4 py-1 bg-[#E2E8D4] rounded-full text-xl font-display text-[#8B1E1E]">{currentIndex + 1} / {questions.length}</div>
      </div>
      <div className="space-y-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 text-[#4A3A2F]/30 text-[10px] font-black uppercase lowercase"><Info className="w-3 h-3" /> frage {currentIndex + 1}</div>
             <h3 className="text-4xl font-display text-[#4A3A2F] leading-tight">{question?.text}</h3>
          </div>
          <div className="grid gap-3">
            {question?.options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(index)} disabled={isAnswered} className={cn("w-full text-left p-6 rounded-2xl font-bold text-lg border-2 transition-all min-h-[80px]", isAnswered ? (index === question.correctAnswerIndex ? "bg-[#A3B18A]/20 border-[#A3B18A] text-[#1E3A1E]" : (selectedOption === index ? "bg-[#8B1E1E]/10 border-[#8B1E1E] text-[#8B1E1E]" : "opacity-30")) : (selectedOption === index ? "border-[#8B1E1E] ring-4 ring-[#8B1E1E]/5 shadow-md" : "bg-[#E2E8D4]/50 border-transparent hover:bg-white"))}>
                  <span className="font-sans pr-4 leading-relaxed">{option}</span>
                </button>
            ))}
          </div>
          <AnimatePresence>
            {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 lg:p-12 bg-[#E2E8D4]/60 rounded-[40px] border border-black/[0.02] space-y-8 shadow-inner">
                  <div className="space-y-6">
                     <h4 className="text-xl lg:text-2xl font-display text-[#8B1E1E] flex items-center gap-3 lowercase"><Sparkles className="w-5 h-5" /> erklärung</h4>
                     <div className="text-xl text-[#4A3A2F]/80 leading-relaxed font-serif italic">
                        {formatExplanation(question.explanation)}
                     </div>
                  </div>
                  <button onClick={handleNext} className="w-full py-6 bg-[#8B1E1E] text-white rounded-3xl font-bold text-2xl hover:bg-[#763428] transition-all flex items-center justify-center gap-4 shadow-xl font-display lowercase"><span>{currentIndex < questions.length - 1 ? 'nächste frage' : 'ergebnis anzeigen'}</span><ArrowRight className="w-6 h-6" /></button>
                </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

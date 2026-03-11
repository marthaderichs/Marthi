import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSubjects } from '../hooks/useSubjects';
import { useExamGenerate, useExamSubmit } from '../hooks/useExam';
import { useMistakes } from '../hooks/useMistakes';
import { cn } from '../lib/utils';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Loader2, RotateCcw, Sparkles, Settings2, Info, Layers, Shuffle, List, Trash2 } from 'lucide-react';
import { DisplayText } from '../components/DisplayText';

import { getIcon } from '../lib/icons';
import { SubjectBlob } from '../components/SubjectBlob';
import { useQuestions } from '../hooks/useQuestions';
import { useDeleteQuestion } from '../hooks/useTopics';

// Clean up AI-generated explanation texts
const formatExplanation = (text: string) => {
  if (!text) return null;

  const cleaned = text
    // Remove lines that are ONLY a label word
    .replace(/^[\s*_#]*(?:frage|thema|kernaspekt|antwort|erklärung|option|konzept|details?|krankheitsbild|diagnose|therapie|merke|hinweis|zusammenfassung|fazit|grund|begründung)[\s*_#]*:?[\s*_#\d.]*$/gmi, '')
    // Remove "Label: " prefixes at start of lines
    .replace(/^[\s*_#]*(?:frage|thema|kernaspekt|antwort|erklärung|konzept|details?|krankheitsbild|diagnose|therapie|merke|hinweis)[\s*_#]*:\s*/gmi, '')
    // Remove markdown bold/italic wrappers around single words (e.g. **Konzept**)
    .replace(/\*{1,2}([A-ZÄÖÜ][a-zäöüß]+)\*{1,2}/g, '$1')
    // Remove pipe-table dividers
    .replace(/\|?\s*:?-+:?\s*\|/g, '')
    // Remove pipe-separated content entirely if it looks like a table row
    .replace(/^.*\|.*\|.*$/gm, '')
    // Remove standalone numbers, possibly with markdown decoration (e.g. **4**, 4., 4:)
    .replace(/^[\s*_]*\d+[.):]?[\s*_]*$/gm, '')
    // Collapse excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Pipe-separated format
  const parts = cleaned.split('|').map(p => p.trim()).filter(p => p.length > 0);
  if (parts.length > 4) {
    return (
      <div className="space-y-3">
        {parts.map((part, i) => {
          if (/^[A-E]$/.test(part)) return null;
          const lower = part.toLowerCase();
          if (lower === 'richtig') return <p key={i} className="font-semibold text-[#5C8E78]">{part}</p>;
          if (lower === 'falsch') return <p key={i} className="font-semibold text-[#673147]/60">{part}</p>;
          return <p key={i} className="leading-relaxed">{part}</p>;
        })}
      </div>
    );
  }

  return <p className="leading-relaxed whitespace-pre-wrap">{cleaned}</p>;
};

export default function ExamMode() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { addMistake } = useMistakes();
  const [searchParams] = useSearchParams();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [overviewSubjectId, setOverviewSubjectId] = useState<string | undefined>(undefined);
  const [confirmDeleteQuestionId, setConfirmDeleteQuestionId] = useState<string | null>(null);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    const subjectId = searchParams.get('subjectId');
    if (subjectId && !selectedSubjectId) setSelectedSubjectId(subjectId);
  }, [searchParams]);

  const { data: allQuestions, isLoading: questionsLoading } = useQuestions(showOverview ? overviewSubjectId : undefined);
  const deleteQuestion = useDeleteQuestion();

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion.mutate(id);
    setDeletedQuestionIds(prev => [...prev, id]);
    setConfirmDeleteQuestionId(null);
  };
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

  const isAllMode = selectedSubjectId === 'all';

  const selectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedTopicIds([]);
    setSetupMode(true);
  };

  const selectAllSubjects = () => {
    setSelectedSubjectId('all');
    setSelectedTopicIds([]);
    setSetupMode(true);
  };

  const startQuiz = () => {
    setCurrentIndex(0); setSelectedOption(null); setIsAnswered(false);
    setScore(0); setShowSummary(false); setAnswers([]);
    setSetupMode(false);
    setQuizStarted(true);
  };

  const abbreviate = (name: string) => {
    if (name.length <= 3) return name.toUpperCase();
    return name.substring(0, 3).toUpperCase();
  };

  if (subjectsLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-[#673147]/40" /></div>;

  // --- VIEW: FRAGEN ÜBERSICHT ---
  if (showOverview) {
    const visibleQuestions = (allQuestions ?? []).filter(q => !deletedQuestionIds.includes(q.id));
    const overviewSubject = subjects?.find(s => s.id === overviewSubjectId);
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-4">
        <div className="flex items-center justify-between border-b border-[#673147]/10 pb-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40 mb-1">Klausurfragen</div>
            <h1 className="text-5xl font-display text-[#673147]">
              {overviewSubject ? <DisplayText>{overviewSubject.name}</DisplayText> : 'Alle Fächer'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#E2E8D4]/60 rounded-full text-sm font-bold text-[#673147]/60">
              {visibleQuestions.length} Fragen
            </div>
            <button
              onClick={() => { setShowOverview(false); setDeletedQuestionIds([]); setConfirmDeleteQuestionId(null); }}
              className="px-6 py-2.5 bg-[#E2E8D4] rounded-full text-xs font-bold uppercase tracking-widest text-[#673147] hover:bg-[#673147] hover:text-white transition-all"
            >
              Zurück
            </button>
          </div>
        </div>

        {/* Subject filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setOverviewSubjectId(undefined)}
            className={cn("px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all",
              overviewSubjectId === undefined ? "bg-[#673147] text-white border-[#673147]" : "bg-[#E2E8D4]/50 border-transparent text-[#673147]/50 hover:border-[#673147]/20"
            )}
          >Alle</button>
          {subjects?.map(s => (
            <button
              key={s.id}
              onClick={() => setOverviewSubjectId(s.id)}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all",
                overviewSubjectId === s.id ? "text-white border-transparent" : "bg-[#E2E8D4]/50 border-transparent text-[#673147]/50 hover:border-[#673147]/20"
              )}
              style={overviewSubjectId === s.id ? { backgroundColor: s.color } : {}}
            >{s.name}</button>
          ))}
        </div>

        {questionsLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#673147]/30" /></div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {visibleQuestions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.015 }}
                  className="group flex items-start gap-4 p-6 bg-[#F9F4E8] rounded-2xl border border-[#4A3A2F]/6"
                  style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.05)' }}
                >
                  <div className="flex-1 space-y-2">
                    <p className="font-serif text-[#4A3A2F] leading-snug">{q.text}</p>
                    <div className="flex gap-2 flex-wrap">
                      {q.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "text-[10px] px-2.5 py-1 rounded-full font-bold",
                            idx === q.correctAnswerIndex
                              ? "bg-[#A3B18A]/20 text-[#344E41]"
                              : "bg-[#E2E8D4]/60 text-[#4A3A2F]/40"
                          )}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {confirmDeleteQuestionId === q.id ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="px-2.5 py-1 bg-red-500 text-white text-[10px] rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >Löschen</button>
                        <button
                          onClick={() => setConfirmDeleteQuestionId(null)}
                          className="px-2.5 py-1 bg-[#E2E8D4] text-[#4A3A2F] text-[10px] rounded-lg font-bold"
                        >×</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteQuestionId(q.id)}
                        className="p-1.5 text-[#4A3A2F]/0 group-hover:text-[#4A3A2F]/25 hover:!text-red-500 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {visibleQuestions.length === 0 && (
                <div className="text-center py-20 text-[#4A3A2F]/30 font-typewriter">Keine Fragen vorhanden.</div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  if (!quizStarted && !setupMode) return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#673147]">Klausur-Modus</h1>
        <p className="text-xl text-[#673147]/50 font-typewriter">Wähle ein Fach und leg los.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects?.map((s, i) => (
          <SubjectBlob
            key={s.id}
            color={s.color}
            index={i}
            name={s.name}
            onClick={() => selectSubject(s.id)}
          />
        ))}
      </div>
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={selectAllSubjects}
        className="w-full p-5 border-2 border-[#673147]/20 rounded-2xl flex items-center gap-4 text-left hover:border-[#673147]/40 hover:bg-white/50 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-[#673147]/10 flex items-center justify-center shrink-0">
          <Shuffle className="w-6 h-6 text-[#673147]" />
        </div>
        <div>
          <div className="font-display text-2xl text-[#673147]">Alle Fächer gemischt</div>
          <p className="text-xs font-typewriter text-[#673147]/40">Fragen aus allen Fachbereichen in zufälliger Reihenfolge</p>
        </div>
      </motion.button>
      <div className="flex justify-center">
        <button
          onClick={() => { setOverviewSubjectId(undefined); setShowOverview(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E2E8D4] rounded-full text-xs font-bold uppercase tracking-widest text-[#673147] hover:bg-[#673147] hover:text-white transition-all"
        >
          <List className="w-3.5 h-3.5" /> Fragen verwalten
        </button>
      </div>
    </div>
  );

  if (setupMode && (subject || isAllMode)) return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-[#F9F4E8] p-10 rounded-2xl border border-[#4A3A2F]/8 space-y-8" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
            <div className="flex items-center gap-6 pb-6 border-b border-black/[0.03]">
                {isAllMode ? (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm bg-[#673147]/10">
                    <Shuffle className="w-8 h-8 text-[#673147]" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: subject!.color }}>
                    {React.createElement(getIcon(subject!.icon), { className: "w-8 h-8 text-white" })}
                  </div>
                )}
                <div>
                    <h2 className="text-4xl font-display text-[#673147]">
                      {isAllMode ? 'Alle Fächer' : <DisplayText>{subject!.name}</DisplayText>}
                    </h2>
                    <button onClick={() => setSetupMode(false)} className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30 hover:text-[#673147] transition-colors">Abbrechen</button>
                </div>
            </div>

            {/* Fortschritt */}
            {!isAllMode && subject && (
              <div className="flex items-center gap-6 py-4 px-6 bg-white rounded-2xl border border-[#4A3A2F]/6">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#673147]/40">
                    <span>Fortschritt</span>
                    <span style={{ color: subject.color }}>{subject.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-[#E2E8D4] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${subject.progress ?? 0}%`, backgroundColor: subject.color }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#673147]/30 font-typewriter">
                    <span>{Math.round((subject.progress ?? 0) * (subject._count?.questions ?? 0) / 100)} von {subject._count?.questions ?? 0} Fragen richtig beantwortet</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#673147]/50 flex items-center gap-2"><Settings2 className="w-3 h-3" /> Fragenanzahl</h4>
                  <div className="flex gap-3">
                      {[5, 10, 20].map(count => (
                          <button key={count} onClick={() => setQuizCount(count)} className={cn("flex-1 py-4 rounded-2xl font-display text-2xl border-2 transition-all", quizCount === count ? "bg-[#673147] text-white border-[#673147] shadow-lg" : "bg-[#E2E8D4]/50 border-transparent text-[#673147]/40 hover:bg-white")}>{count}</button>
                      ))}
                  </div>
              </div>

              <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#673147]/50 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Filter</h4>
                  <button
                    onClick={() => setOnlyNew(!onlyNew)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-display text-xl border-2 transition-all flex items-center justify-center gap-3",
                      onlyNew ? "bg-[#A3B18A] text-white border-[#A3B18A] shadow-lg" : "bg-[#E2E8D4]/50 border-transparent text-[#673147]/40 hover:bg-white"
                    )}
                  >
                    {onlyNew ? 'Nur neue Fragen' : 'Alle Fragen'}
                  </button>
              </div>
            </div>

            {!isAllMode && (
              <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#673147]/50 flex items-center gap-2"><Layers className="w-3 h-3" /> Themen (optional)</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar text-sm">
                      {subject!.topics?.map(topic => (
                          <button key={topic.id} onClick={() => setSelectedTopicIds(prev => prev.includes(topic.id) ? prev.filter(id => id !== topic.id) : [...prev, topic.id])} className={cn("text-left p-4 rounded-xl font-bold border-2 transition-all flex justify-between items-center group", selectedTopicIds.includes(topic.id) ? "bg-[#A3B18A]/10 border-[#A3B18A] text-[#1E3A1E]" : "bg-white border-black/[0.03] text-[#673147]/60")}>
                              <span className="truncate pr-4">{topic.title}</span>
                              <div className={cn("w-5 h-5 rounded-full border-2 transition-all shrink-0", selectedTopicIds.includes(topic.id) ? "bg-[#A3B18A] border-[#A3B18A]" : "border-black/10")} />
                          </button>
                      ))}
                  </div>
              </div>
            )}
            <button onClick={startQuiz} className="w-full py-6 bg-[#673147] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#763428] transition-all">Starten</button>
        </div>
    </div>
  );

  if (examLoading) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Sparkles className="w-10 h-10 text-[#E9C46A] animate-pulse" /><p className="text-2xl font-bold text-[#673147] tracking-tight font-display">Lade Fragen...</p></div>;

  if (showSummary) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center p-16 bg-[#F9F4E8] rounded-2xl border border-[#4A3A2F]/8" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
            <Trophy className="w-16 h-16 text-[#E9C46A] mx-auto mb-8" />
            <h2 className="text-5xl font-bold text-[#673147] font-display mb-4">Ergebnis</h2>
            <div className="text-8xl font-extrabold text-[#673147] mb-10 font-display">{Math.round((score / questions.length) * 100)}%</div>
            <div className="space-y-4">
                <button onClick={handleRestart} className="w-full py-5 bg-[#673147] text-white rounded-2xl font-bold text-xl font-display shadow-lg">Nochmal</button>
                <button onClick={() => { setQuizStarted(false); setSetupMode(false); }} className="w-full py-2 text-[#673147]/30 font-bold text-xs uppercase font-sans">Beenden</button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#F9F4E8] p-8 md:p-16 rounded-2xl space-y-12 max-w-4xl mx-auto border border-[#4A3A2F]/8 relative overflow-hidden" style={{ boxShadow: '2px 2px 0 rgba(74,58,47,0.07)' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[#E2E8D4]"><motion.div className="h-full bg-[#673147]" initial={{ width: 0 }} animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }} transition={{ duration: 0.4 }} /></div>
      <div className="flex items-center justify-between">
        <button onClick={() => { setQuizStarted(false); setSetupMode(false); }} className="text-[10px] font-black uppercase text-[#673147]/20 hover:text-[#673147] font-sans">Abbrechen</button>
        <div className="px-4 py-1 bg-[#E2E8D4] rounded-full text-xl font-display text-[#673147]">{currentIndex + 1} / {questions.length}</div>
      </div>
      <div className="space-y-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 text-[#673147]/30 text-[10px] font-black uppercase"><Info className="w-3 h-3" /> Frage {currentIndex + 1}</div>
             <h3 className="text-4xl font-display text-[#673147] leading-tight"><DisplayText>{question?.text ?? ''}</DisplayText></h3>
          </div>
          <div className="grid gap-3">
            {question?.options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(index)} disabled={isAnswered} className={cn("w-full text-left p-6 rounded-2xl font-bold text-lg border-2 transition-all min-h-[80px]", isAnswered ? (index === question.correctAnswerIndex ? "bg-[#A3B18A]/20 border-[#A3B18A] text-[#1E3A1E]" : (selectedOption === index ? "bg-[#673147]/10 border-[#673147] text-[#673147]" : "opacity-30")) : (selectedOption === index ? "border-[#673147] ring-4 ring-[#673147]/5 shadow-md" : "bg-[#E2E8D4]/50 border-transparent hover:bg-white"))}>
                  <span className="font-serif text-lg pr-4 leading-snug">{option}</span>
                </button>
            ))}
          </div>
          <AnimatePresence>
            {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 lg:p-12 bg-[#E2E8D4]/60 rounded-[40px] border border-black/[0.02] space-y-8 shadow-inner">
                  <div className="space-y-6">
                     <h4 className="text-3xl lg:text-4xl font-display text-[#673147] flex items-center gap-3 mb-6">
                       <Sparkles className="w-8 h-8" /> <DisplayText>Erklärung</DisplayText>
                     </h4>
                     <div className="text-xl text-[#673147]/80 leading-relaxed font-serif">
                        {formatExplanation(question.explanation)}
                     </div>
                  </div>
                  <button onClick={handleNext} className="w-full py-6 bg-[#673147] text-[#FAF9F2] rounded-3xl text-2xl hover:bg-[#763428] transition-all flex items-center justify-center gap-4 shadow-xl font-serif font-medium">{currentIndex < questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}<ArrowRight className="w-6 h-6" /></button>
                </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

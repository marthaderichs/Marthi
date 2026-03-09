import React, { useState } from 'react';
import { useImport } from '../hooks/useImport';
import { useSubjects } from '../hooks/useSubjects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, CheckCircle2, AlertCircle, FileJson, Copy,
  Sparkles, Loader2, List, Brain, BookOpen, ChevronRight, Info, XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ImportData() {
  const [jsonInput, setJsonInput] = useState('');
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const importMutation = useImport();
  const [parseError, setParseError] = useState<string | null>(null);

  const handleImport = () => {
    setParseError(null);
    if (!jsonInput.trim()) return;
    try {
      let cleanedInput = jsonInput.trim();
      if (cleanedInput.startsWith('```')) {
        cleanedInput = cleanedInput.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
      }
      const data = JSON.parse(cleanedInput);
      importMutation.mutate(data);
    } catch (e) {
      setParseError('Ungültiges JSON-Format. Bitte Eingabe prüfen (z. B. fehlende Anführungszeichen oder Kommas).');
    }
  };

  const copyPrompt = () => {
    const subjectList = subjects?.map(s => `- ${s.name} (id: "${s.id}")`).join('\n') || '';
    const prompt = `Du bist ein Experte für medizinisches Wissen und Spaced Repetition. Konvertiere die folgenden Informationen in ein präzises JSON-Format.

DEINE AUFGABE:
Erstelle aus dem Text Zusammenfassungen (topics), Prüfungsfragen (questions) und Karteikarten (flashcards).

WICHTIG FÜR KARTEIKARTEN:
- Erstelle pro Information MINDESTENS 3–5 verschiedene Karteikarten.
- Nutze das Prinzip der „atomaren Informationen": Eine Karte = Ein Fakt.
- Erstelle Karten für: Definitionen, Symptome, Goldstandard-Diagnostik, Therapie der Wahl und typische Fallstricke.
- Wenn eine Multiple-Choice-Frage gegeben ist, erstelle Karten für den richtigen Fakt UND für die Begründungen in der Erklärung.

STRUKTUR:
Das JSON muss ein Objekt mit drei Arrays sein:
1. "topics": Zusammenfassungen (subjectId, title, content).
2. "questions": MC-Fragen (subjectId, text, options[], correctAnswerIndex, explanation).
3. "flashcards": Karteikarten (subjectId, front, back).

ERLAUBTE SUBJECT-IDS:
${subjectList}

REGELN:
- Antworte NUR mit dem JSON. Keine Markdown-Backticks.
- Sprache: Deutsch, professionell, präzise.
- Korrekte deutsche Groß- und Kleinschreibung verwenden.
- Erklärungen vollständig und klar formulieren.

INHALTE:
[DEINE INHALTE HIER EINFÜGEN]`;

    navigator.clipboard.writeText(prompt);
    alert('Prompt wurde kopiert! Die KI wird nun deutlich mehr Karten erstellen.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#8B1E1E]">Daten-Import</h1>
        <p className="text-xl text-[#4A3A2F]/50 font-serif italic">
          „Füttere deine App mit neuem Wissen."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Side: Input & Actions */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[48px] shadow-xl border border-white space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-display text-[#8B1E1E] flex items-center gap-3">
                  <FileJson className="w-6 h-6" /> JSON-Eingabe
               </h2>
               <button
                 onClick={() => { setJsonInput(''); setParseError(null); }}
                 className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/20 hover:text-[#8B1E1E] transition-colors"
               >
                 Leeren
               </button>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"topics": [], "questions": [], "flashcards": []}'
              className="w-full h-[400px] p-6 bg-[#E2E8D4]/30 border border-black/[0.03] rounded-[32px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#8B1E1E]/5 transition-all font-mono text-sm leading-relaxed"
            />

            <button
              onClick={handleImport}
              disabled={!jsonInput.trim() || importMutation.isPending}
              className="w-full py-6 bg-[#8B1E1E] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#763428] transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
            >
              {importMutation.isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              <span>Import starten</span>
            </button>

            <AnimatePresence>
              {importMutation.isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#A3B18A]/20 rounded-3xl flex items-center gap-4 text-[#1E3A1E]"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#A3B18A]" />
                  <div className="text-sm font-bold">Import erfolgreich! Deine App ist nun klüger geworden.</div>
                </motion.div>
              )}

              {(parseError || importMutation.isError) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#8B1E1E]/10 rounded-3xl flex items-start gap-4 text-[#8B1E1E]"
                >
                  <XCircle className="w-6 h-6 shrink-0" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold">Fehler beim Import</div>
                    <p className="text-xs opacity-80">{parseError || importMutation.error?.message || 'Unbekannter Fehler'}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: AI Guide & Help */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[48px] border border-white space-y-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stripes-blue opacity-[0.05] -rotate-45 translate-x-10 -translate-y-10" />

              <div className="space-y-2 relative z-10">
                 <div className="flex items-center gap-2 text-[#AF4D3C] font-black uppercase tracking-widest text-[10px]">
                    <Sparkles className="w-3 h-3" /> KI-Helfer
                 </div>
                 <h3 className="text-4xl font-display text-[#8B1E1E]">KI-Assistent nutzen</h3>
              </div>

              <p className="text-[#4A3A2F]/60 text-sm font-medium font-sans leading-relaxed relative z-10">
                 Am einfachsten ist es, wenn du eine KI (wie ChatGPT oder Claude) bittest, deine Altfragen oder Texte zu konvertieren.
                 Ich habe dir einen fertigen Prompt vorbereitet.
              </p>

              <button
                onClick={copyPrompt}
                className="w-full group py-5 bg-white/80 border-2 border-[#8B1E1E]/10 rounded-[24px] flex items-center justify-between px-8 hover:border-[#8B1E1E] hover:shadow-lg transition-all"
              >
                 <span className="font-display text-2xl text-[#8B1E1E]">Prompt kopieren</span>
                 <Copy className="w-5 h-5 text-[#8B1E1E]/40 group-hover:scale-110 transition-transform" />
              </button>

              <div className="space-y-4 pt-4 border-t border-black/[0.03]">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[#4A3A2F]/30">Format-Vorschau</h4>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                       <BookOpen className="w-5 h-5 mx-auto mb-2 text-[#8B1E1E]/40" />
                       <div className="text-[10px] font-black uppercase text-[#4A3A2F]/40">Bibliothek</div>
                    </div>
                    <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                       <List className="w-5 h-5 mx-auto mb-2 text-[#A3B18A]/40" />
                       <div className="text-[10px] font-black uppercase text-[#4A3A2F]/40">Fragen</div>
                    </div>
                    <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                       <Brain className="w-5 h-5 mx-auto mb-2 text-[#E9C46A]/40" />
                       <div className="text-[10px] font-black uppercase text-[#4A3A2F]/40">Karten</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white/40 p-8 rounded-[40px] border border-black/[0.02] space-y-4 shadow-sm">
              <h4 className="text-xl font-display text-[#4A3A2F] flex items-center gap-2">
                 <Info className="w-4 h-4" /> Tipps für den Import
              </h4>
              <ul className="space-y-3 text-xs text-[#4A3A2F]/60 font-medium font-sans list-disc pl-4 italic">
                 <li>Achte darauf, dass die <code className="bg-black/5 px-1 rounded text-[#8B1E1E]">subjectId</code> exakt stimmt.</li>
                 <li>Du kannst alle drei Bereiche gleichzeitig importieren oder nur einen.</li>
                 <li>Bilder werden aktuell noch nicht unterstützt.</li>
                 <li>Bei großen Mengen in kleinen Häppchen importieren.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

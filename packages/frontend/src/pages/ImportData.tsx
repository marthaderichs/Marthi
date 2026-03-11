import React, { useState } from 'react';
import { useImport } from '../hooks/useImport';
import { useSubjects } from '../hooks/useSubjects';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, CheckCircle2, FileJson, Copy, Sparkles, Loader2,
  Brain, BookOpen, Info, XCircle, Pencil, Trash2, ArrowLeft,
  Check, CheckSquare, List
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Types ───────────────────────────────────────────────────────────────────

type DraftTopic = { subjectId: string; title: string; content: string };
type DraftQuestion = {
  subjectId: string; text: string; options: string[];
  correctAnswerIndex: number; explanation: string; topicId?: string | null;
};
type DraftFlashcard = { subjectId: string; front: string; back: string; topicId?: string | null };
type DraftData = { topics: DraftTopic[]; questions: DraftQuestion[]; flashcards: DraftFlashcard[] };
type ActiveTab = 'topics' | 'questions' | 'flashcards';
type EditingItem =
  | { tab: 'topics'; index: number; draft: DraftTopic }
  | { tab: 'questions'; index: number; draft: DraftQuestion }
  | { tab: 'flashcards'; index: number; draft: DraftFlashcard }
  | null;

// ── Shared card shell ───────────────────────────────────────────────────────

function CardShell({ children, onEdit, onDelete, isEditing }: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  return (
    <div className={cn(
      "bg-[#F9F4E8] rounded-2xl border transition-all",
      isEditing ? "border-[#673147]/30 shadow-md" : "border-[#4A3A2F]/6"
    )}>
      <div className="p-5">{children}</div>
      {!isEditing && (
        <div className="flex justify-end gap-1 px-5 pb-4">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#673147]/40 hover:text-[#673147] hover:bg-[#673147]/5 rounded-lg transition-all">
            <Pencil className="w-3 h-3" /> Bearbeiten
          </button>
          <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#673147]/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-3 h-3" /> Löschen
          </button>
        </div>
      )}
    </div>
  );
}

function EditActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-2">
      <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 bg-[#673147] text-white rounded-xl text-xs font-bold hover:bg-[#763428] transition-all">
        <Check className="w-3 h-3" /> Speichern
      </button>
      <button onClick={onCancel} className="px-4 py-2 bg-black/5 text-[#4A3A2F]/60 rounded-xl text-xs font-bold hover:bg-black/10 transition-all">
        Abbrechen
      </button>
    </div>
  );
}

// ── Topic card ──────────────────────────────────────────────────────────────

function TopicCard({ item, editing, onEdit, onDelete, onChange, onSave, onCancel }: {
  item: DraftTopic; editing: DraftTopic | null;
  onEdit: () => void; onDelete: () => void;
  onChange: (f: string, v: any) => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete} isEditing={!!editing}>
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Titel</label>
            <input value={editing.title} onChange={e => onChange('title', e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#673147]/10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Inhalt</label>
            <textarea value={editing.content} onChange={e => onChange('content', e.target.value)}
              rows={8} className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#673147]/10 resize-y" />
          </div>
          <EditActions onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-[#673147]/30 shrink-0 mt-0.5" />
            <h3 className="font-display text-lg text-[#673147] leading-snug">{item.title}</h3>
          </div>
          <p className="text-sm text-[#4A3A2F]/55 leading-relaxed font-sans line-clamp-3 pl-6">{item.content}</p>
          <p className="text-[10px] text-[#673147]/25 font-bold pl-6">{item.subjectId}</p>
        </div>
      )}
    </CardShell>
  );
}

// ── Question card ───────────────────────────────────────────────────────────

function QuestionCard({ item, editing, onEdit, onDelete, onChange, onSave, onCancel }: {
  item: DraftQuestion; editing: DraftQuestion | null;
  onEdit: () => void; onDelete: () => void;
  onChange: (f: string, v: any) => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete} isEditing={!!editing}>
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Frage</label>
            <textarea value={editing.text} onChange={e => onChange('text', e.target.value)}
              rows={3} className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#673147]/10 resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Antworten — klicke auf ○ für die richtige</label>
            {editing.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <button onClick={() => onChange('correctAnswerIndex', i)}
                  className={cn("w-5 h-5 rounded-full border-2 shrink-0 transition-all",
                    editing.correctAnswerIndex === i ? "bg-[#A3B18A] border-[#A3B18A]" : "border-[#673147]/20 hover:border-[#673147]/40"
                  )} />
                <input value={opt} onChange={e => { const o = [...editing.options]; o[i] = e.target.value; onChange('options', o); }}
                  className={cn("flex-1 p-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#673147]/10",
                    editing.correctAnswerIndex === i ? "bg-[#A3B18A]/10 border-[#A3B18A] font-bold" : "bg-white border-[#673147]/10"
                  )} />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Erklärung</label>
            <textarea value={editing.explanation} onChange={e => onChange('explanation', e.target.value)}
              rows={4} className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#673147]/10 resize-y" />
          </div>
          <EditActions onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-display text-lg text-[#673147] leading-snug">{item.text}</p>
          <div className="space-y-1 pl-1">
            {item.options.map((opt, i) => (
              <div key={i} className={cn("flex items-center gap-2 text-sm rounded-lg px-2 py-0.5",
                i === item.correctAnswerIndex ? "text-[#1E3A1E] font-bold" : "text-[#4A3A2F]/45")}>
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                  i === item.correctAnswerIndex ? "bg-[#A3B18A]" : "bg-[#4A3A2F]/15")} />
                {opt}
              </div>
            ))}
          </div>
          {item.explanation && (
            <p className="text-xs text-[#4A3A2F]/45 font-sans italic leading-relaxed line-clamp-2 pl-1">{item.explanation}</p>
          )}
          <p className="text-[10px] text-[#673147]/25 font-bold">{item.subjectId}</p>
        </div>
      )}
    </CardShell>
  );
}

// ── Flashcard card ──────────────────────────────────────────────────────────

function FlashcardCard({ item, editing, onEdit, onDelete, onChange, onSave, onCancel }: {
  item: DraftFlashcard; editing: DraftFlashcard | null;
  onEdit: () => void; onDelete: () => void;
  onChange: (f: string, v: any) => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete} isEditing={!!editing}>
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Vorderseite</label>
            <textarea value={editing.front} onChange={e => onChange('front', e.target.value)}
              rows={3} className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#673147]/10 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#673147]/40">Rückseite</label>
            <textarea value={editing.back} onChange={e => onChange('back', e.target.value)}
              rows={3} className="w-full p-3 bg-white rounded-xl border border-[#673147]/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#673147]/10 resize-none" />
          </div>
          <EditActions onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30">Vorderseite</div>
            <p className="font-display text-lg text-[#673147] leading-snug">{item.front}</p>
          </div>
          <div className="space-y-1 border-l border-[#4A3A2F]/8 pl-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#A3B18A]/60">Rückseite</div>
            <p className="text-sm text-[#4A3A2F]/65 font-sans leading-relaxed italic">{item.back}</p>
          </div>
        </div>
      )}
    </CardShell>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ImportData() {
  const [jsonInput, setJsonInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [view, setView] = useState<'input' | 'review'>('input');
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('topics');
  const [editing, setEditing] = useState<EditingItem>(null);

  const { data: subjects } = useSubjects();
  const importMutation = useImport();

  // Parse JSON → go to review (no backend call yet)
  const handleReview = () => {
    setParseError(null);
    if (!jsonInput.trim()) return;
    try {
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
      }
      const data = JSON.parse(cleaned);
      const draft: DraftData = {
        topics: data.topics || [],
        questions: data.questions || [],
        flashcards: data.flashcards || [],
      };
      setDraftData(draft);
      setEditing(null);
      setActiveTab(draft.topics.length > 0 ? 'topics' : draft.questions.length > 0 ? 'questions' : 'flashcards');
      setView('review');
    } catch (err) {
      const msg = err instanceof SyntaxError ? err.message : String(err);
      setParseError(`Ungültiges JSON: ${msg}`);
    }
  };

  const deleteItem = (tab: ActiveTab, index: number) => {
    setDraftData(prev => {
      if (!prev) return prev;
      return { ...prev, [tab]: prev[tab].filter((_, i) => i !== index) };
    });
    if (editing?.tab === tab && editing.index === index) setEditing(null);
  };

  const startEdit = (tab: ActiveTab, index: number) => {
    const item = draftData![tab][index];
    setEditing({ tab, index, draft: { ...(item as any) } } as EditingItem);
  };

  const updateDraft = (field: string, value: any) => {
    setEditing(prev => prev ? { ...prev, draft: { ...prev.draft, [field]: value } } as EditingItem : null);
  };

  const saveEdit = () => {
    if (!editing) return;
    setDraftData(prev => {
      if (!prev) return prev;
      const arr = [...(prev[editing.tab] as any[])];
      arr[editing.index] = editing.draft;
      return { ...prev, [editing.tab]: arr };
    });
    setEditing(null);
  };

  const copyPrompt = () => {
    const subjectList = subjects?.map(s => `- ${s.name} (id: "${s.id}")`).join('\n') || '';
    const prompt = `Du bist ein Experte für medizinisches Lernen. Konvertiere die folgenden Inhalte in ein strukturiertes JSON für eine Lern-App.

DEINE AUFGABE:
Erstelle aus dem Text drei Arten von Inhalten:
1. Bibliotheks-Kapitel (topics) – ausführliche Zusammenfassungen zum Nachlesen
2. Klausurfragen (questions) – Multiple-Choice-Fragen
3. Karteikarten (flashcards) – atomare Fakten zum Einprägen

━━━ BIBLIOTHEK (topics) ━━━
- Schreibe pro Thema ein ausführliches Kapitel als Fließtext (mehrere Absätze).
- Decke ab: Pathophysiologie, Symptome, Diagnostik, Therapie, Besonderheiten.
- Schreibe vollständige Sätze – keine Stichpunkte, keine Tabellen.

━━━ KLAUSURFRAGEN (questions) ━━━
- Erstelle realistische MC-Fragen im IMPP-Stil (4–5 Antwortoptionen).
- Erklärungsfeld: Erkläre in 2–4 klaren Sätzen, WARUM die richtige Antwort korrekt ist und warum die anderen falsch sind.
- VERBOTEN in Erklärungen: Label-Wörter wie "Konzept:", "Details:", "Krankheitsbild:", "Kernaspekt:", "Thema:", "Antwort:", "Erklärung:" – nur sauberer Fließtext.
- KEINE Pipes (|), Trennstriche oder Tabellen in Erklärungen.

━━━ KARTEIKARTEN (flashcards) ━━━
- Erstelle pro Klausurfrage genau 1–2 Karteikarten, die den Kernfakt der Frage festigen.
- Vorderseite: eine klare Frage oder ein unvollständiger Satz.
- Rückseite: die präzise Antwort (1–2 Sätze max).
- Eine Karte = ein Fakt.

STRUKTUR:
{
  "topics": [{ "subjectId": "...", "title": "...", "content": "..." }],
  "questions": [{ "subjectId": "...", "text": "...", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "..." }],
  "flashcards": [{ "subjectId": "...", "front": "...", "back": "..." }]
}

ERLAUBTE SUBJECT-IDS:
${subjectList}

REGELN:
- Antworte NUR mit dem JSON-Objekt. Keine Markdown-Backticks, kein Kommentar drumherum.
- Sprache: Deutsch, professionell, präzise.

INHALTE:
[DEINE INHALTE HIER EINFÜGEN]`;
    navigator.clipboard.writeText(prompt);
    alert('Prompt kopiert!');
  };

  const totalItems = draftData
    ? draftData.topics.length + draftData.questions.length + draftData.flashcards.length
    : 0;

  // ── REVIEW VIEW ────────────────────────────────────────────────────────────
  if (view === 'review' && draftData) {
    const tabs: { key: ActiveTab; label: string; icon: React.ReactNode; count: number }[] = [
      { key: 'topics',     label: 'Bibliothek',   icon: <BookOpen className="w-3.5 h-3.5" />,    count: draftData.topics.length },
      { key: 'questions',  label: 'Fragen',        icon: <CheckSquare className="w-3.5 h-3.5" />, count: draftData.questions.length },
      { key: 'flashcards', label: 'Karteikarten',  icon: <Brain className="w-3.5 h-3.5" />,       count: draftData.flashcards.length },
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-16 sm:pt-10 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => { setView('input'); setEditing(null); }}
            className="flex items-center gap-2 text-sm font-bold text-[#673147]/40 hover:text-[#673147] transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-display text-[#673147]">Entwurf prüfen</h1>
            <p className="text-xs font-typewriter text-[#673147]/40 mt-0.5">{totalItems} Einträge — bearbeite oder lösche vor dem Import</p>
          </div>
          <button
            onClick={() => importMutation.mutate(draftData)}
            disabled={importMutation.isPending || totalItems === 0}
            className="flex items-center gap-2 px-5 py-3 bg-[#673147] text-white rounded-2xl font-display text-lg hover:bg-[#763428] transition-all disabled:opacity-30 shadow-lg shrink-0"
          >
            {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importieren
          </button>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {importMutation.isSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#A3B18A]/20 rounded-2xl flex items-center gap-3 text-[#1E3A1E]">
              <CheckCircle2 className="w-5 h-5 text-[#A3B18A] shrink-0" />
              <span className="font-bold text-sm">Import erfolgreich! Alle Einträge wurden gespeichert.</span>
            </motion.div>
          )}
          {importMutation.isError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#673147]/10 rounded-2xl flex items-center gap-3 text-[#673147]">
              <XCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold">Fehler beim Import. Bitte erneut versuchen.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-[#F9F4E8] p-1.5 rounded-2xl">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setEditing(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.key ? "bg-white text-[#673147] shadow-sm" : "text-[#673147]/40 hover:text-[#673147]"
              )}>
              {tab.icon} {tab.label}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-black",
                activeTab === tab.key ? "bg-[#673147]/10 text-[#673147]" : "bg-black/5")}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Item list */}
        <div className="space-y-3">
          {activeTab === 'topics' && draftData.topics.map((item, i) => (
            <TopicCard key={i} item={item} index={i}
              editing={editing?.tab === 'topics' && editing.index === i ? editing.draft as DraftTopic : null}
              onEdit={() => startEdit('topics', i)} onDelete={() => deleteItem('topics', i)}
              onChange={updateDraft} onSave={saveEdit} onCancel={() => setEditing(null)} />
          ))}
          {activeTab === 'questions' && draftData.questions.map((item, i) => (
            <QuestionCard key={i} item={item} index={i}
              editing={editing?.tab === 'questions' && editing.index === i ? editing.draft as DraftQuestion : null}
              onEdit={() => startEdit('questions', i)} onDelete={() => deleteItem('questions', i)}
              onChange={updateDraft} onSave={saveEdit} onCancel={() => setEditing(null)} />
          ))}
          {activeTab === 'flashcards' && draftData.flashcards.map((item, i) => (
            <FlashcardCard key={i} item={item} index={i}
              editing={editing?.tab === 'flashcards' && editing.index === i ? editing.draft as DraftFlashcard : null}
              onEdit={() => startEdit('flashcards', i)} onDelete={() => deleteItem('flashcards', i)}
              onChange={updateDraft} onSave={saveEdit} onCancel={() => setEditing(null)} />
          ))}
          {draftData[activeTab].length === 0 && (
            <div className="py-16 text-center text-[#673147]/25 font-typewriter text-lg">
              Keine Einträge in diesem Bereich.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── INPUT VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-16 sm:pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#673147]">Daten-Import</h1>
        <p className="text-xl text-[#673147]/50 font-typewriter">„Füttere deine App mit neuem Wissen."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: JSON Input */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[48px] shadow-xl border border-white space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display text-[#673147] flex items-center gap-3">
                <FileJson className="w-6 h-6" /> JSON-Eingabe
              </h2>
              <button onClick={() => { setJsonInput(''); setParseError(null); }}
                className="text-[10px] font-black uppercase tracking-widest text-[#673147]/20 hover:text-[#673147] transition-colors">
                Leeren
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"topics": [], "questions": [], "flashcards": []}'
              className="w-full h-[400px] p-6 bg-[#E2E8D4]/30 border border-black/[0.03] rounded-[32px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#673147]/5 transition-all font-mono text-sm leading-relaxed"
            />
            <button
              onClick={handleReview}
              disabled={!jsonInput.trim()}
              className="w-full py-6 bg-[#673147] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#763428] transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
            >
              <CheckCircle2 className="w-8 h-8" />
              <span>Prüfen & Bearbeiten</span>
            </button>
            {parseError && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-mono break-all">{parseError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Guide */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[48px] border border-white space-y-8 relative overflow-hidden shadow-sm">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-[#AF4D3C] font-black uppercase tracking-widest text-[10px]">
                <Sparkles className="w-3 h-3" /> KI-Helfer
              </div>
              <h3 className="text-4xl font-display text-[#673147]">KI-Assistent nutzen</h3>
            </div>
            <p className="text-[#673147]/60 text-sm font-medium font-sans leading-relaxed relative z-10">
              Lasse eine KI (ChatGPT oder Claude) deine Altfragen oder Texte konvertieren.
              Ich habe dir einen fertigen Prompt vorbereitet.
            </p>
            <button onClick={copyPrompt}
              className="w-full group py-5 bg-white/80 border-2 border-[#673147]/10 rounded-[24px] flex items-center justify-between px-8 hover:border-[#673147] hover:shadow-lg transition-all">
              <span className="font-display text-2xl text-[#673147]">Prompt kopieren</span>
              <Copy className="w-5 h-5 text-[#673147]/40 group-hover:scale-110 transition-transform" />
            </button>
            <div className="space-y-4 pt-4 border-t border-black/[0.03]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#673147]/30">Format-Vorschau</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                  <BookOpen className="w-5 h-5 mx-auto mb-2 text-[#673147]/40" />
                  <div className="text-[10px] font-black uppercase text-[#673147]/40">Bibliothek</div>
                </div>
                <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                  <List className="w-5 h-5 mx-auto mb-2 text-[#A3B18A]/40" />
                  <div className="text-[10px] font-black uppercase text-[#673147]/40">Fragen</div>
                </div>
                <div className="bg-[#E2E8D4]/40 p-4 rounded-2xl text-center">
                  <Brain className="w-5 h-5 mx-auto mb-2 text-[#E9C46A]/40" />
                  <div className="text-[10px] font-black uppercase text-[#673147]/40">Karten</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/40 p-8 rounded-[40px] border border-black/[0.02] space-y-4 shadow-sm">
            <h4 className="text-xl font-display text-[#673147] flex items-center gap-2">
              <Info className="w-4 h-4" /> Tipps für den Import
            </h4>
            <ul className="space-y-3 text-xs text-[#673147]/60 font-medium font-sans list-disc pl-4 italic">
              <li>Achte darauf, dass die <code className="bg-black/5 px-1 rounded text-[#673147]">subjectId</code> exakt stimmt.</li>
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

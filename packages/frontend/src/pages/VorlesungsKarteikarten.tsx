import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, CheckCircle2, FileJson, Copy, Sparkles, Loader2,
  BookOpen, XCircle, Pencil, Trash2, ArrowLeft, Check, GraduationCap, Info,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLectureImport } from '../hooks/useLectureImport';
import { useSubjects } from '../hooks/useSubjects';

// ── Types ────────────────────────────────────────────────────────────────────

type DraftCard = { front: string; back: string; lectureTag?: string | null };
type DraftSummary = { title: string; content: string; lectureTag?: string | null };
type DraftData = {
  subjectId: string;
  lectureTag?: string | null;
  lectureCards: DraftCard[];
  lectureSummaries: DraftSummary[];
};
type MainView = 'import' | 'review';
type ActiveTab = 'lectureSummaries' | 'lectureCards';
type EditingItem =
  | { tab: 'lectureSummaries'; index: number; draft: DraftSummary }
  | { tab: 'lectureCards'; index: number; draft: DraftCard }
  | null;

// ── Card shell ────────────────────────────────────────────────────────────────

function CardShell({ children, onEdit, onDelete, isEditing }: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  return (
    <div className={cn(
      "bg-[#F9F4E8] rounded-2xl border transition-all",
      isEditing ? "border-[#5A7FA8]/30 shadow-md" : "border-[#4A3A2F]/6"
    )}>
      <div className="p-5">{children}</div>
      {!isEditing && (
        <div className="flex justify-end gap-1 px-5 pb-4">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/40 hover:text-[#5A7FA8] hover:bg-[#5A7FA8]/5 rounded-lg transition-all">
            <Pencil className="w-3 h-3" /> Bearbeiten
          </button>
          <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
      <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 bg-[#5A7FA8] text-white rounded-xl text-xs font-bold hover:bg-[#4a6f98] transition-all">
        <Check className="w-3 h-3" /> Speichern
      </button>
      <button onClick={onCancel} className="px-4 py-2 bg-black/5 text-[#4A3A2F]/60 rounded-xl text-xs font-bold hover:bg-black/10 transition-all">
        Abbrechen
      </button>
    </div>
  );
}

function SummaryCard({ item, editing, onEdit, onDelete, onChange, onSave, onCancel }: {
  item: DraftSummary; editing: DraftSummary | null;
  onEdit: () => void; onDelete: () => void;
  onChange: (f: string, v: any) => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete} isEditing={!!editing}>
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/40">Titel</label>
            <input value={editing.title} onChange={e => onChange('title', e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-[#5A7FA8]/10 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#5A7FA8]/10" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/40">Inhalt</label>
            <textarea value={editing.content} onChange={e => onChange('content', e.target.value)}
              rows={6} className="w-full p-3 bg-white rounded-xl border border-[#5A7FA8]/10 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5A7FA8]/10 resize-y" />
          </div>
          <EditActions onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-[#5A7FA8]/30 shrink-0 mt-0.5" />
            <h3 className="font-display text-lg text-[#5A7FA8] leading-snug">{item.title}</h3>
          </div>
          <p className="text-sm text-[#4A3A2F]/55 leading-relaxed font-sans line-clamp-3 pl-6">{item.content}</p>
        </div>
      )}
    </CardShell>
  );
}

function LectureCardDraft({ item, editing, onEdit, onDelete, onChange, onSave, onCancel }: {
  item: DraftCard; editing: DraftCard | null;
  onEdit: () => void; onDelete: () => void;
  onChange: (f: string, v: any) => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete} isEditing={!!editing}>
      {editing ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/40">Vorderseite</label>
            <textarea value={editing.front} onChange={e => onChange('front', e.target.value)}
              rows={3} className="w-full p-3 bg-white rounded-xl border border-[#5A7FA8]/10 text-base font-serif focus:outline-none focus:ring-2 focus:ring-[#5A7FA8]/10 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/40">Rückseite</label>
            <textarea value={editing.back} onChange={e => onChange('back', e.target.value)}
              rows={3} className="w-full p-3 bg-white rounded-xl border border-[#5A7FA8]/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5A7FA8]/10 resize-none" />
          </div>
          <EditActions onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/30">Vorderseite</div>
            <p className="font-display text-lg text-[#5A7FA8] leading-snug">{item.front}</p>
          </div>
          <div className="space-y-1 border-l border-[#4A3A2F]/8 pl-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/30">Rückseite</div>
            <p className="text-sm text-[#4A3A2F]/65 font-sans leading-relaxed italic">{item.back}</p>
          </div>
        </div>
      )}
    </CardShell>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function VorlesungsKarteikarten() {
  const { data: subjects } = useSubjects();
  const [jsonInput, setJsonInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [mainView, setMainView] = useState<MainView>('import');
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('lectureSummaries');
  const [editing, setEditing] = useState<EditingItem>(null);

  const importMutation = useLectureImport();

  const subjectList = subjects?.map(s => `- ${s.name} (id: "${s.id}")`).join('\n') ?? '';

  const KI_PROMPT = `Du bist ein Experte für medizinisches Lernen. Konvertiere den folgenden Vorlesungsinhalt in JSON für eine Lern-App.

DEINE AUFGABE:
1. Vorlesungs-Zusammenfassungen (lectureSummaries) – kompakte Zusammenfassungen zum Nachlesen
2. Vorlesungskarteikarten (lectureCards) – atomare Fakten zum Einprägen

━━━ ZUSAMMENFASSUNGEN (lectureSummaries) ━━━
Schreibe pro Thema eine kompakte Zusammenfassung als Fließtext.
Kernaussagen, Definitionen, klinische Relevanz – vollständige Sätze, kein Stichpunkt.

━━━ KARTEIKARTEN (lectureCards) ━━━
Vorderseite (front): klare Frage oder unvollständiger Satz.
Rückseite (back): präzise Antwort, max. 2 Sätze. Eine Karte = ein Fakt.

STRUKTUR:
{
  "subjectId": "<id aus der Liste unten>",
  "lectureTag": "VL 3",
  "lectureSummaries": [{ "title": "...", "content": "..." }],
  "lectureCards": [{ "front": "...", "back": "..." }]
}

ERLAUBTE SUBJECT-IDS:
${subjectList}

REGELN:
- Antworte NUR mit dem JSON-Objekt. Keine Backticks, kein Kommentar.
- Sprache: Deutsch, professionell.

INHALTE:
[VORLESUNGSINHALTE HIER EINFÜGEN]`;

  const handleReview = () => {
    setParseError(null);
    if (!jsonInput.trim()) return;
    try {
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
      }
      const data = JSON.parse(cleaned);
      if (!data.subjectId) {
        setParseError('Fehlendes Pflichtfeld: "subjectId" muss angegeben werden.');
        return;
      }
      const draft: DraftData = {
        subjectId: data.subjectId,
        lectureTag: data.lectureTag ?? null,
        lectureCards: data.lectureCards || [],
        lectureSummaries: data.lectureSummaries || [],
      };
      setDraftData(draft);
      setEditing(null);
      setActiveTab(draft.lectureSummaries.length > 0 ? 'lectureSummaries' : 'lectureCards');
      setMainView('review');
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
    navigator.clipboard.writeText(KI_PROMPT);
    alert('Prompt kopiert!');
  };

  const totalItems = draftData
    ? draftData.lectureSummaries.length + draftData.lectureCards.length
    : 0;

  const subjectName = draftData
    ? subjects?.find(s => s.id === draftData.subjectId)?.name ?? draftData.subjectId
    : '';

  // ── REVIEW VIEW ──────────────────────────────────────────────────────────────
  if (mainView === 'review' && draftData) {
    const tabs = [
      { key: 'lectureSummaries' as ActiveTab, label: 'Zusammenfassungen', icon: <BookOpen className="w-3.5 h-3.5" />, count: draftData.lectureSummaries.length },
      { key: 'lectureCards' as ActiveTab,     label: 'Karteikarten',      icon: <GraduationCap className="w-3.5 h-3.5" />, count: draftData.lectureCards.length },
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-16 sm:pt-10 pb-24">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => { setMainView('import'); setEditing(null); }}
            className="flex items-center gap-2 text-sm font-bold text-[#5A7FA8]/40 hover:text-[#5A7FA8] transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-display text-[#5A7FA8]">Entwurf prüfen</h1>
            <p className="text-xs font-typewriter text-[#5A7FA8]/40 mt-0.5">
              {subjectName}{draftData.lectureTag ? ` · ${draftData.lectureTag}` : ''} · {totalItems} Einträge
            </p>
          </div>
          <button
            onClick={() => importMutation.mutate(draftData)}
            disabled={importMutation.isPending || totalItems === 0}
            className="flex items-center gap-2 px-5 py-3 bg-[#5A7FA8] text-white rounded-2xl font-display text-lg hover:bg-[#4a6f98] transition-all disabled:opacity-30 shadow-lg shrink-0">
            {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importieren
          </button>
        </div>

        <AnimatePresence>
          {importMutation.isSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#A3B18A]/20 rounded-2xl flex items-center gap-3 text-[#1E3A1E]">
              <CheckCircle2 className="w-5 h-5 text-[#A3B18A] shrink-0" />
              <span className="font-bold text-sm">Import erfolgreich! In der Bibliothek und bei den Karten erscheinen sie jetzt unter "{subjectName}".</span>
            </motion.div>
          )}
          {importMutation.isError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#5A7FA8]/10 rounded-2xl flex items-start gap-3 text-[#5A7FA8]">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-sm font-bold block">Fehler beim Import.</span>
                {importMutation.error?.message && (
                  <span className="text-xs font-mono block opacity-70">{importMutation.error.message}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-1.5 bg-[#F9F4E8] p-1.5 rounded-2xl">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setEditing(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.key ? "bg-white text-[#5A7FA8] shadow-sm" : "text-[#5A7FA8]/40 hover:text-[#5A7FA8]"
              )}>
              {tab.icon} {tab.label}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-black",
                activeTab === tab.key ? "bg-[#5A7FA8]/10 text-[#5A7FA8]" : "bg-black/5")}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeTab === 'lectureSummaries' && draftData.lectureSummaries.map((item, i) => (
            <SummaryCard key={i} item={item}
              editing={editing?.tab === 'lectureSummaries' && editing.index === i ? editing.draft as DraftSummary : null}
              onEdit={() => startEdit('lectureSummaries', i)} onDelete={() => deleteItem('lectureSummaries', i)}
              onChange={updateDraft} onSave={saveEdit} onCancel={() => setEditing(null)} />
          ))}
          {activeTab === 'lectureCards' && draftData.lectureCards.map((item, i) => (
            <LectureCardDraft key={i} item={item}
              editing={editing?.tab === 'lectureCards' && editing.index === i ? editing.draft as DraftCard : null}
              onEdit={() => startEdit('lectureCards', i)} onDelete={() => deleteItem('lectureCards', i)}
              onChange={updateDraft} onSave={saveEdit} onCancel={() => setEditing(null)} />
          ))}
          {draftData[activeTab].length === 0 && (
            <div className="py-16 text-center text-[#5A7FA8]/25 font-typewriter text-lg">
              Keine Einträge in diesem Bereich.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── IMPORT VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-16 sm:pt-10">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-display text-[#5A7FA8]">Vorlesungen</h1>
        <p className="text-xl text-[#5A7FA8]/50 font-typewriter">„Vorlesungsstoff direkt in Karten und Zusammenfassungen."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[48px] shadow-xl border border-white space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display text-[#5A7FA8] flex items-center gap-3">
                <FileJson className="w-6 h-6" /> JSON-Eingabe
              </h2>
              <button onClick={() => { setJsonInput(''); setParseError(null); }}
                className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/20 hover:text-[#5A7FA8] transition-colors">
                Leeren
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"subjectId": "cardio", "lectureTag": "VL 3", "lectureSummaries": [], "lectureCards": []}'
              className="w-full h-[400px] p-6 bg-[#E2E8D4]/30 border border-black/[0.03] rounded-[32px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#5A7FA8]/5 transition-all font-mono text-sm leading-relaxed"
            />
            <button
              onClick={handleReview}
              disabled={!jsonInput.trim()}
              className="w-full py-6 bg-[#5A7FA8] text-white rounded-[24px] font-display text-3xl shadow-xl hover:bg-[#4a6f98] transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale">
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

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[48px] border border-white space-y-8 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#5A7FA8] font-black uppercase tracking-widest text-[10px]">
                <Sparkles className="w-3 h-3" /> KI-Helfer
              </div>
              <h3 className="text-4xl font-display text-[#5A7FA8]">KI-Assistent nutzen</h3>
            </div>
            <p className="text-[#5A7FA8]/60 text-sm font-medium font-sans leading-relaxed">
              Kopiere deine Vorlesungsfolien oder Mitschriften in ChatGPT oder Claude.
              Der Prompt enthält bereits alle erlaubten Fach-IDs.
            </p>
            <button onClick={copyPrompt}
              className="w-full group py-5 bg-white/80 border-2 border-[#5A7FA8]/10 rounded-[24px] flex items-center justify-between px-8 hover:border-[#5A7FA8] hover:shadow-lg transition-all">
              <span className="font-display text-2xl text-[#5A7FA8]">Prompt kopieren</span>
              <Copy className="w-5 h-5 text-[#5A7FA8]/40 group-hover:scale-110 transition-transform" />
            </button>
            <div className="space-y-3 pt-4 border-t border-black/[0.03]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#5A7FA8]/30">Erlaubte Fach-IDs</h4>
              <div className="flex flex-wrap gap-1.5">
                {subjects?.map(s => (
                  <span key={s.id} className="px-2 py-1 bg-[#5A7FA8]/8 rounded-lg text-[10px] font-bold text-[#5A7FA8]/60 font-mono">
                    {s.id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/40 p-8 rounded-[40px] border border-black/[0.02] space-y-4 shadow-sm">
            <h4 className="text-xl font-display text-[#5A7FA8] flex items-center gap-2">
              <Info className="w-4 h-4" /> So funktioniert es
            </h4>
            <ul className="space-y-3 text-xs text-[#5A7FA8]/60 font-medium font-sans list-disc pl-4 italic">
              <li>Prompt kopieren → in KI einfügen → Vorlesungstext anhängen</li>
              <li>KI-Antwort (JSON) hier einfügen → Prüfen → Importieren</li>
              <li>Zusammenfassungen erscheinen in der <strong>Bibliothek</strong> unter "Vorlesung"</li>
              <li>Karteikarten erscheinen bei den <strong>Karten</strong> unter "Vorlesungs-Karten"</li>
              <li><code className="bg-black/5 px-1 rounded text-[#5A7FA8]">lectureTag</code> ist optional – z.B. "VL 3"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

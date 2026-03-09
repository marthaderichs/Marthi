import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotes, Note } from '../hooks/useNotes';
import { useSubjects } from '../hooks/useSubjects';
import { Plus, Trash2, X, Pencil, Check, Loader2, StickyNote } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Notes() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const { data: subjects } = useSubjects();

  const [editing, setEditing] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', subjectId: '' });

  const openNew = () => {
    setDraft({ title: '', content: '', subjectId: '' });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (note: Note) => {
    setDraft({ title: note.title, content: note.content, subjectId: note.subjectId || '' });
    setEditing(note);
    setIsCreating(false);
  };

  const closeModal = () => { setIsCreating(false); setEditing(null); };

  const save = async () => {
    if (!draft.title.trim()) return;
    const subId = draft.subjectId || null;
    if (editing) {
      await updateNote(editing.id, draft.title, draft.content, subId);
    } else {
      await createNote(draft.title, draft.content, subId);
    }
    closeModal();
  };

  const subjectColor = (id: string | null) =>
    subjects?.find(s => s.id === id)?.color;

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-[#8B1E1E]/30" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-7xl font-display text-[#8B1E1E]">Notizen</h1>
          <p className="text-xl text-[#4A3A2F]/45 font-serif italic">
            „Gedanken, die es wert sind, festgehalten zu werden."
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#8B1E1E] text-white rounded-full font-bold text-sm hover:bg-[#763428] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Neue Notiz
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-[#4A3A2F]/25">
          <StickyNote className="w-16 h-16" />
          <p className="font-serif italic text-xl">Noch keine Notizen vorhanden.</p>
          <button onClick={openNew} className="mt-2 px-6 py-3 bg-[#F9F4E8] border border-[#4A3A2F]/10 rounded-full text-sm font-bold text-[#8B1E1E] hover:shadow transition-all">
            Erste Notiz anlegen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {notes.map(note => {
              const color = subjectColor(note.subjectId);
              const sub = subjects?.find(s => s.id === note.subjectId);
              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-[#F9F4E8] rounded-2xl p-6 border-l-[3px] flex flex-col gap-3 cursor-pointer hover:-translate-y-0.5 transition-all"
                  style={{
                    borderLeftColor: color || '#8B1E1E',
                    boxShadow: '2px 2px 0 rgba(74,58,47,0.07)',
                  }}
                  onClick={() => openEdit(note)}
                >
                  {sub && (
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: color }}>
                      {sub.name}
                    </span>
                  )}
                  <h3 className="font-serif text-lg text-[#4A3A2F] leading-snug">{note.title}</h3>
                  {note.content && (
                    <p className="text-sm text-[#4A3A2F]/55 font-sans leading-relaxed line-clamp-3">{note.content}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-[#4A3A2F]/30 font-sans">
                      {new Date(note.updatedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-[#4A3A2F]/30 hover:text-[#8B1E1E] hover:bg-[#8B1E1E]/8 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {(isCreating || editing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4A3A2F]/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#F9F4E8] rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-[#4A3A2F]/8">
                <h2 className="font-display text-3xl text-[#8B1E1E]">
                  {editing ? 'Notiz bearbeiten' : 'Neue Notiz'}
                </h2>
                <button onClick={closeModal} className="p-2.5 rounded-full border border-[#4A3A2F]/10 text-[#4A3A2F]/40 hover:text-[#8B1E1E] transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 space-y-5">
                <input
                  autoFocus
                  type="text"
                  placeholder="Titel"
                  value={draft.title}
                  onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  className="w-full font-display text-2xl text-[#4A3A2F] bg-transparent border-b-2 border-[#4A3A2F]/12 focus:border-[#8B1E1E]/30 focus:outline-none pb-2 placeholder:text-[#4A3A2F]/20"
                />

                <select
                  value={draft.subjectId}
                  onChange={e => setDraft(d => ({ ...d, subjectId: e.target.value }))}
                  className="w-full bg-white border border-[#4A3A2F]/10 rounded-xl px-4 py-2.5 text-sm font-medium text-[#4A3A2F]/70 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/10"
                >
                  <option value="">Kein Fachbereich</option>
                  {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <textarea
                  placeholder="Inhalt der Notiz…"
                  value={draft.content}
                  onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
                  rows={8}
                  className="w-full bg-white border border-[#4A3A2F]/10 rounded-2xl p-5 text-[#4A3A2F]/80 font-serif text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/10 resize-none"
                />

                <button
                  onClick={save}
                  disabled={!draft.title.trim()}
                  className="w-full py-4 bg-[#8B1E1E] text-white rounded-2xl font-display text-xl shadow-lg hover:bg-[#763428] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Speichern
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

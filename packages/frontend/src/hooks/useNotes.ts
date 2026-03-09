import { useState, useEffect, useCallback } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  subjectId: string | null;
  topicId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch('/api/notes');
    setNotes(await res.json());
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createNote = async (title: string, content: string, subjectId?: string | null) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subjectId }),
    });
    const note: Note = await res.json();
    setNotes(prev => [note, ...prev]);
    return note;
  };

  const updateNote = async (id: string, title: string, content: string, subjectId?: string | null) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subjectId }),
    });
    const note: Note = await res.json();
    setNotes(prev => prev.map(n => n.id === id ? note : n));
    return note;
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return { notes, isLoading, createNote, updateNote, deleteNote };
}

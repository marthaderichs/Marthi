import { useState, useEffect, useCallback } from 'react';

export type StudyPlanItem = {
  id: string;
  date: string;
  subjectId: string;
  type: string;
  durationMin: number;
  completed: boolean;
  note: string | null;
  createdAt: string;
};

export function useStudyPlan(from: string, to: string) {
  const [items, setItems] = useState<StudyPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(`/api/studyplan?from=${from}&to=${to}`);
    setItems(await res.json());
    setIsLoading(false);
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  const addItem = async (date: string, subjectId: string, type: string, durationMin: number, note?: string) => {
    const res = await fetch('/api/studyplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, subjectId, type, durationMin, note }),
    });
    const item: StudyPlanItem = await res.json();
    setItems(prev => [...prev, item].sort((a, b) => a.date.localeCompare(b.date)));
    return item;
  };

  const toggleCompleted = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/studyplan/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    const item: StudyPlanItem = await res.json();
    setItems(prev => prev.map(i => i.id === id ? item : i));
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/studyplan/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return { items, isLoading, addItem, toggleCompleted, deleteItem };
}

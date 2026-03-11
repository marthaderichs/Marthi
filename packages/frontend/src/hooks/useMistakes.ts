import { useState, useEffect } from 'react';
import { api } from '../api/client';

export interface Mistake {
  id: string;
  subjectId: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  addedAt: number;
  masteredCount: number;
}

type RawMistake = Omit<Mistake, 'options' | 'addedAt'> & {
  options: string;
  addedAt: string;
};

function parse(m: RawMistake): Mistake {
  return {
    ...m,
    options: typeof m.options === 'string' ? JSON.parse(m.options) : m.options,
    addedAt: new Date(m.addedAt).getTime(),
  };
}

export function useMistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    api.get<RawMistake[]>('/mistakes').then(data => setMistakes(data.map(parse)));
  }, []);

  const addMistake = async (q: any) => {
    if (mistakes.some(m => m.id === q.id)) return;
    const created = await api.post<RawMistake>('/mistakes', {
      id: q.id,
      subjectId: q.subjectId,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation,
    });
    setMistakes(prev => [parse(created), ...prev]);
  };

  const masterMistake = async (id: string) => {
    const res = await fetch(`/api/mistakes/${id}/master`, { method: 'PATCH' });
    if (res.status === 204) {
      setMistakes(prev => prev.filter(m => m.id !== id));
    } else {
      const updated: RawMistake = await res.json();
      setMistakes(prev => prev.map(m => m.id === id ? parse(updated) : m));
    }
  };

  const removeMistake = async (id: string) => {
    await api.delete(`/mistakes/${id}`);
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  return { mistakes, addMistake, masterMistake, removeMistake };
}

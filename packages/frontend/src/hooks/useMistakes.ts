import { useState, useEffect } from 'react';

export interface Mistake {
  id: string;
  subjectId: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  addedAt: number;
  masteredCount: number; // Count how many times it was correctly answered in the garden
}

export function useMistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('medilearn_mistakes');
    if (saved) {
      try {
        setMistakes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load mistakes', e);
      }
    }
  }, []);

  const saveMistakes = (newMistakes: Mistake[]) => {
    setMistakes(newMistakes);
    localStorage.setItem('medilearn_mistakes', JSON.stringify(newMistakes));
  };

  const addMistake = (q: any) => {
    if (mistakes.some(m => m.id === q.id)) return;
    const newMistake: Mistake = {
      ...q,
      addedAt: Date.now(),
      masteredCount: 0
    };
    saveMistakes([newMistake, ...mistakes]);
  };

  const masterMistake = (id: string) => {
    const updated = mistakes.map(m => {
      if (m.id === id) {
        return { ...m, masteredCount: m.masteredCount + 1 };
      }
      return m;
    }).filter(m => m.masteredCount < 2); // Remove if correctly answered 2 times
    saveMistakes(updated);
  };

  const removeMistake = (id: string) => {
    saveMistakes(mistakes.filter(m => m.id !== id));
  };

  return { mistakes, addMistake, masterMistake, removeMistake };
}

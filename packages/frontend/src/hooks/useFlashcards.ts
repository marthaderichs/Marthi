import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Flashcard } from '@medilearn/shared';

export function useFlashcards(subjectId?: string) {
  const [data, setData] = useState<Flashcard[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get<Flashcard[]>(`/flashcards${subjectId ? `?subjectId=${subjectId}` : ''}`)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [subjectId]);

  return { data, isLoading, error };
}

export function useDueFlashcards(subjectId?: string) {
  const [data, setData] = useState<Flashcard[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get<Flashcard[]>(`/flashcards/due${subjectId ? `?subjectId=${subjectId}` : ''}`)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [subjectId]);

  return { data, isLoading };
}

export function useDeleteFlashcard() {
  const [isPending, setIsPending] = useState(false);
  const mutate = async (id: string) => {
    setIsPending(true);
    try { await api.delete(`/flashcards/${id}`); }
    finally { setIsPending(false); }
  };
  return { mutate, isPending };
}

export function useReviewFlashcard() {
  const [isPending, setIsPending] = useState(false);

  const mutate = ({ id, quality }: { id: string; quality: number }) => {
    setIsPending(true);
    return api.post(`/flashcards/${id}/review`, { quality })
      .finally(() => setIsPending(false));
  };

  return { mutate, isPending };
}

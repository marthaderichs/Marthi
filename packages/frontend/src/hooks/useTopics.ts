import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Topic, Question } from '@medilearn/shared';

export function useTopics(subjectId?: string) {
  const [data, setData] = useState<Topic[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get<Topic[]>(`/topics${subjectId ? `?subjectId=${subjectId}` : ''}`)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [subjectId]);

  return { data, isLoading, error };
}

export function useDeleteTopic() {
  const [isPending, setIsPending] = useState(false);
  const mutate = async (id: string) => {
    setIsPending(true);
    try { await api.delete(`/topics/${id}`); }
    finally { setIsPending(false); }
  };
  return { mutate, isPending };
}

export function useDeleteQuestion() {
  const [isPending, setIsPending] = useState(false);
  const mutate = async (id: string) => {
    setIsPending(true);
    try { await api.delete(`/questions/${id}`); }
    finally { setIsPending(false); }
  };
  return { mutate, isPending };
}

export function useTopic(id: string | null) {
  const [data, setData] = useState<(Topic & { questions: Question[] }) | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.get<Topic & { questions: Question[] }>(`/topics/${id}`)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data, isLoading, error };
}

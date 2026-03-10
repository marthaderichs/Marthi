import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Question } from '@medilearn/shared';

export function useQuestions(subjectId?: string) {
  const [data, setData] = useState<Question[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get<Question[]>(`/questions${subjectId ? `?subjectId=${subjectId}` : ''}`)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [subjectId]);

  return { data, isLoading };
}

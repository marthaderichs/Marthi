import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Subject } from '@medilearn/shared';

export function useSubjects() {
  const [data, setData] = useState<Subject[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get<Subject[]>('/subjects')
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}

export function useSubject(id: string | null) {
  const [data, setData] = useState<Subject | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.get<Subject>(`/subjects/${id}`)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data, isLoading, error };
}

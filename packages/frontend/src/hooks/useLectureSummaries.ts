import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { LectureSummary } from '@medilearn/shared';

export function useLectureSummaries(lectureTag?: string) {
  const [data, setData] = useState<LectureSummary[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = lectureTag
      ? `/lecture-summaries?lectureTag=${encodeURIComponent(lectureTag)}`
      : '/lecture-summaries';
    api.get<LectureSummary[]>(endpoint)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [lectureTag]);

  return { data, isLoading };
}

export function useDeleteLectureSummary() {
  const [isPending, setIsPending] = useState(false);
  const mutate = (id: string, callbacks?: { onSuccess?: () => void }) => {
    setIsPending(true);
    api.delete(`/lecture-summaries/${id}`)
      .then(() => callbacks?.onSuccess?.())
      .finally(() => setIsPending(false));
  };
  return { mutate, isPending };
}

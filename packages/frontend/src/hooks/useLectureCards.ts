import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { LectureCard } from '@medilearn/shared';

export function useLectureCards(lectureTag?: string) {
  const [data, setData] = useState<LectureCard[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = lectureTag
      ? `/lecture-cards?lectureTag=${encodeURIComponent(lectureTag)}`
      : '/lecture-cards';
    api.get<LectureCard[]>(endpoint)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [lectureTag]);

  return { data, isLoading };
}

export function useDueLectureCards(lectureTag?: string) {
  const [data, setData] = useState<LectureCard[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = lectureTag
      ? `/lecture-cards/due?lectureTag=${encodeURIComponent(lectureTag)}`
      : '/lecture-cards/due';
    api.get<LectureCard[]>(endpoint)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [lectureTag]);

  return { data, isLoading };
}

export function useDeleteLectureCard() {
  const [isPending, setIsPending] = useState(false);
  const mutate = (id: string, callbacks?: { onSuccess?: () => void }) => {
    setIsPending(true);
    api.delete(`/lecture-cards/${id}`)
      .then(() => callbacks?.onSuccess?.())
      .finally(() => setIsPending(false));
  };
  return { mutate, isPending };
}

export function useReviewLectureCard() {
  const [isPending, setIsPending] = useState(false);
  const mutate = (id: string, quality: number, callbacks?: { onSuccess?: (data: LectureCard) => void }) => {
    setIsPending(true);
    api.post<LectureCard>(`/lecture-cards/${id}/review`, { quality })
      .then((data) => callbacks?.onSuccess?.(data))
      .finally(() => setIsPending(false));
  };
  return { mutate, isPending };
}

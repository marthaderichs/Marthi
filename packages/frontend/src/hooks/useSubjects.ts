import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Subject } from '@medilearn/shared';

const WATERCOLOR_PALETTE = [
  '#C96843', // Red-Orange
  '#2F9E98', // Teal
  '#F2BB05', // Yellow
  '#7F2982', // Deep Purple
  '#899E70', // Sage Green
  '#E85D04', // Orange
  '#00509D', // Blue
  '#D4A373', // Mustard
  '#9B5DE5', // Purple
  '#43AA8B', // Green
];

export function useSubjects() {
  const [data, setData] = useState<Subject[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get<Subject[]>('/subjects')
      .then(subjects => {
        const transformed = subjects.map((s, i) => ({
          ...s,
          color: WATERCOLOR_PALETTE[i % WATERCOLOR_PALETTE.length]
        }));
        setData(transformed);
      })
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
    
    // We fetch ALL subjects to find the correct index for the color mapping
    api.get<Subject[]>('/subjects')
      .then(subjects => {
        const index = subjects.findIndex(s => s.id === id);
        const subject = subjects[index];
        if (subject) {
          setData({
            ...subject,
            color: index !== -1 ? WATERCOLOR_PALETTE[index % WATERCOLOR_PALETTE.length] : subject.color
          });
        }
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data, isLoading, error };
}

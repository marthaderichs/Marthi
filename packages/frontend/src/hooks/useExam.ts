import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { Question } from '@medilearn/shared';

export interface ExamSession {
  sessionId: string;
  subjectId: string;
  questions: Question[];
  totalAvailable: number;
}

export function useExamGenerate(subjectId: string | null, count = 20, topicIds: string[] = [], onlyNew = false) {
  const [data, setData] = useState<ExamSession | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    if (!subjectId) {
        setData(undefined);
        return;
    }
    
    setIsLoading(true);
    
    let url = `/exams/generate?subjectId=${subjectId}&count=${count}&onlyNew=${onlyNew}`;
    if (topicIds && topicIds.length > 0) {
      url += `&topicIds=${topicIds.join(',')}`;
    }

    api.get<ExamSession>(url)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [subjectId, count, topicIds.join(',')]);

  useEffect(() => {
    if (subjectId) {
        refetch();
    }
  }, [refetch, subjectId]);

  return { data, isLoading, refetch };
}

export function useExamSubmit() {
  const [isPending, setIsPending] = useState(false);

  const mutate = (data: { subjectId: string; answers: { questionId: string; selectedIndex: number }[] }) => {
    setIsPending(true);
    return api.post('/exams/submit', data)
      .finally(() => setIsPending(false));
  };

  return { mutate, isPending };
}

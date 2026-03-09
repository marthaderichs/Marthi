import { useState } from 'react';
import { api } from '../api/client';
import { ImportPayload } from '@medilearn/shared';

export function useImport() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = (
    payload: ImportPayload,
    callbacks?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }
  ) => {
    setIsPending(true);
    setIsSuccess(false);
    setError(null);
    
    api.post('/import', payload)
      .then((data) => {
        setIsSuccess(true);
        callbacks?.onSuccess?.(data);
      })
      .catch((err) => {
        setError(err);
        callbacks?.onError?.(err);
      })
      .finally(() => setIsPending(false));
  };

  return { mutate, isPending, isSuccess, isError: !!error, error };
}

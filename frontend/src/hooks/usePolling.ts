import { useEffect, useRef } from 'react';

export const usePolling = (callback: () => void, intervalMs: number) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!intervalMs) {
      return undefined;
    }

    const id = window.setInterval(() => {
      savedCallback.current();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);
};

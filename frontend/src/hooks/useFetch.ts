import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T,>(fetcher: () => Promise<T>, refreshToken?: number) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((result) => {
        if (!mounted) return;
        setState({ data: result, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!mounted) return;
        setState({ data: null, loading: false, error: error.message });
      });

    return () => {
      mounted = false;
    };
  }, [fetcher, refreshToken]);

  return state;
};

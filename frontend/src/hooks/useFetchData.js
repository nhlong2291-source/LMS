import { useState, useEffect, useCallback, useRef } from "react";

// fetcher: async function (...args) => returns data
// deps: dependency array to control automatic fetch
export default function useFetchData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher(...args);
        if (mountedRef.current) setData(res);
        return res;
      } catch (err) {
        if (mountedRef.current) setError(err);
        throw err;
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [fetcher]
  );

  useEffect(() => {
    mountedRef.current = true;
    // auto-fetch on mount / deps change
    (async () => {
      try {
        await fetchData();
      } catch (e) {
        // swallow here; consumer can call refetch
      }
    })();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

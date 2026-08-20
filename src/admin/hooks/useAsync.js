import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Har qanday async funksiyani yuklanish holati bilan chaqirish uchun
 * universal hook. Xizmat qatlami o'zgarsa ham sahifa kodi o'zgarmaydi.
 *
 *   const { data, loading, error, reload } = useAsync(() => getOrders());
 */
export default function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      if (mounted.current) setData(result);
    } catch (err) {
      if (mounted.current) setError(err.message || "Xatolik yuz berdi");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return { data, loading, error, reload: run };
}

export function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
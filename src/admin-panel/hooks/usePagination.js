import { useEffect, useMemo, useState } from "react";

/**
 * Umumiy pagination holati:
 *
 *   const page = usePagination(total, pageSize);
 *   ... items = list.slice(page.start, page.end)
 *   <Pagination {...page} />
 */
export default function usePagination(total = 0, pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const value = useMemo(
    () => ({
      page,
      pageSize,
      total,
      totalPages,
      start: (page - 1) * pageSize,
      end: Math.min(page * pageSize, total),
      setPage,
      goNext: () => setPage((p) => Math.min(totalPages, p + 1)),
      goPrev: () => setPage((p) => Math.max(1, p - 1)),
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }),
    [page, pageSize, total, totalPages]
  );

  return value;
}

export function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const list = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of list) {
    if (p - prev > 1) result.push("...");
    result.push(p);
    prev = p;
  }
  return result;
}
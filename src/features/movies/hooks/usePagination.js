import { useMemo, useState } from 'react';

function usePagination(items = [], pageSize = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, page, pageSize]);

  const nextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  const prevPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const goToPage = (value) => {
    setPage(Math.min(totalPages, Math.max(1, value)));
  };

  return {
    page,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage,
  };
}

export default usePagination;

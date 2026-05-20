import { useMemo, useState } from 'react';
import useMovies from '@/features/movies/hooks/useMovies';
import usePagination from '@/features/movies/hooks/usePagination';
import useDebounce from '@/features/movies/hooks/useDebounce';

function useMovieListPage() {
  const { movies, loading, error } = useMovies();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 250);

  const filteredMovies = useMemo(() => {
    const query = debouncedKeyword.trim().toLowerCase();

    if (!query) {
      return movies;
    }

    return movies.filter((movie) => movie.title?.toLowerCase().includes(query));
  }, [movies, debouncedKeyword]);

  const { page, totalPages, paginatedItems, nextPage, prevPage } = usePagination(filteredMovies, 8);

  const highlightedGenres = useMemo(() => {
    const genres = movies.map((movie) => movie.genre).filter(Boolean);
    return Array.from(new Set(genres)).slice(0, 6);
  }, [movies]);

  return {
    movies,
    loading,
    error,
    keyword,
    filteredMovies,
    highlightedGenres,
    page,
    totalPages,
    paginatedMovies: paginatedItems,
    setKeyword,
    nextPage,
    prevPage,
  };
}

export default useMovieListPage;

import { useMemo, useState } from 'react';
import useMovies from '@/features/movies/hooks/useMovies';
import usePagination from '@/features/movies/hooks/usePagination';
import useDebounce from '@/features/movies/hooks/useDebounce';

function useMovieListPage() {
  const { movies, loading, error } = useMovies();
  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const debouncedKeyword = useDebounce(keyword, 250);

  const highlightedGenres = useMemo(() => {
    const genres = movies.map((movie) => movie.genre).filter(Boolean);
    return Array.from(new Set(genres)).slice(0, 6);
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = movies;

    if (selectedGenre !== 'All') {
      result = result.filter((movie) => movie.genre === selectedGenre);
    }

    const query = debouncedKeyword.trim().toLowerCase();
    if (query) {
      result = result.filter((movie) => movie.title?.toLowerCase().includes(query));
    }

    return result;
  }, [movies, debouncedKeyword, selectedGenre]);

  const { page, totalPages, paginatedItems, nextPage, prevPage } = usePagination(filteredMovies, 8);

  return {
    movies,
    loading,
    error,
    keyword,
    selectedGenre,
    filteredMovies,
    highlightedGenres,
    page,
    totalPages,
    paginatedMovies: paginatedItems,
    setKeyword,
    setSelectedGenre,
    nextPage,
    prevPage,
  };
}

export default useMovieListPage;

import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useMovies from '@/features/movies/hooks/useMovies';
import usePagination from '@/features/movies/hooks/usePagination';
import useDebounce from '@/features/movies/hooks/useDebounce';

function useMovieListPage() {
  const { movies, loading, error } = useMovies();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialGenre = queryParams.get('genre') || 'All';

  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const debouncedKeyword = useDebounce(keyword, 250);

  // Sync selectedGenre to URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedGenre === 'All') {
      params.delete('genre');
    } else {
      params.set('genre', selectedGenre);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedGenre, navigate, location.search]);

  const highlightedGenres = useMemo(() => {
    const allGenres = new Set();
    movies.forEach((movie) => {
      if (!movie.genre) return;
      const genres = movie.genre.split(',').map(g => g.trim()).filter(Boolean);
      genres.forEach(g => allGenres.add(g));
    });
    return Array.from(allGenres).slice(0, 8); // Lấy tối đa 8 thể loại nổi bật
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = movies;

    if (selectedGenre !== 'All') {
      result = result.filter((movie) => {
        if (!movie.genre) return false;
        const genres = movie.genre.split(',').map(g => g.trim());
        return genres.includes(selectedGenre);
      });
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

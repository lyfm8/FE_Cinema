import { useState, useCallback, useEffect } from 'react';
import { publicMovieService } from '@/features/movies/services/movieService';

export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const result = await publicMovieService.getMovies();
      // Ensure we only use valid movies
      const validMovies = (result.data || [])
        .filter((m) => m && !Number.isNaN(Number(m.id)))
        .map((m) => ({ ...m, title: m.title || m.name }));
      setMovies(validMovies);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}

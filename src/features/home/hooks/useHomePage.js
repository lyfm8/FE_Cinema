import { useState, useCallback, useEffect } from 'react';
import { publicMovieService } from '@/features/movies/services/movieService';

export default function useHomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const result = await publicMovieService.getMovies();
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

  // Split movies by status
  const nowShowing = movies.filter((m) => m.status === 'NOW_SHOWING');
  const comingSoon = movies.filter((m) => m.status === 'COMING_SOON');

  // Featured movies for hero banner (prefer now-showing, fallback to coming-soon)
  const moviesWithPoster = nowShowing.filter((m) => m.posterUrl);
  const featuredMovies = moviesWithPoster.length > 0
    ? moviesWithPoster.slice(0, 5)
    : comingSoon.filter((m) => m.posterUrl).slice(0, 5);

  return {
    movies,
    nowShowing,
    comingSoon,
    featuredMovies,
    loading,
    error,
    refetch: fetchMovies,
  };
}

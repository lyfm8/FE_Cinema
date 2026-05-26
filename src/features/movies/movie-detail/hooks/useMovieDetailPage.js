import { useState, useEffect } from 'react';
import { publicMovieService } from '@/features/movies/services/movieService';

export default function useMovieDetailPage(movieId) {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!movieId) {
        if (isMounted) {
          setLoading(false);
          setError('Không tìm thấy thông tin phim.');
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [movieRes, showtimesRes] = await Promise.all([
          publicMovieService.getMovieById(movieId),
          publicMovieService.getShowtimesByMovieId(movieId),
        ]);

        if (isMounted) {
          setMovie(movieRes.data);
          setShowtimes(showtimesRes.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load movie details:', err);
          setError('Không thể tải chi tiết phim. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  return {
    movie,
    showtimes,
    loading,
    error,
  };
}

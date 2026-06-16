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

  // Split movies by status (still needed for banner)
  const nowShowing = movies.filter((m) => m.status === 'NOW_SHOWING');
  const comingSoon = movies.filter((m) => m.status === 'COMING_SOON');

  // Featured movies for hero banner
  const moviesWithPoster = nowShowing.filter((m) => m.posterUrl);
  const featuredMovies = moviesWithPoster.length > 0
    ? moviesWithPoster.slice(0, 5)
    : comingSoon.filter((m) => m.posterUrl).slice(0, 5);

  // Group ALL valid movies by Genre
  const moviesByGenre = {};
  movies.forEach((movie) => {
    if (!movie.genre) return;
    const genres = movie.genre.split(',').map(g => g.trim()).filter(Boolean);
    genres.forEach(g => {
      if (!moviesByGenre[g]) {
        moviesByGenre[g] = [];
      }
      moviesByGenre[g].push(movie);
    });
  });

  // Convert to array and get top genres
  const genreSections = Object.entries(moviesByGenre)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8) // Show up to 8 genres
    .map(([genre, genreMovies]) => ({
      genre,
      movies: genreMovies.slice(0, 10) // Show up to 10 movies per genre
    }));

  return {
    movies,
    featuredMovies,
    genreSections,
    loading,
    error,
    refetch: fetchMovies,
  };
}

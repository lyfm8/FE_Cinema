import { useEffect, useState } from "react";
import { publicMovieService } from "@/features/movies/services/movieService";

export default function useMovieDetailPage(movieId) {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState({});
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [error, setError] = useState(null);
  const [showtimesError, setShowtimesError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMovie() {
      if (!movieId) {
        if (isMounted) {
          setLoadingMovie(false);
          setLoadingShowtimes(false);
          setError("Movie id is missing.");
        }
        return;
      }

      setLoadingMovie(true);
      setError(null);

      try {
        const movieRes = await publicMovieService.getMovieById(movieId);

        if (isMounted) {
          const movieData = movieRes?.data || {};
          setMovie({
            ...movieData,
            title: movieData?.title || movieData?.name,
          });
        }
      } catch (requestError) {
        if (isMounted) {
          console.error("Failed to load movie details:", requestError);
          setError("Failed to load movie details. Please try again.");
          setMovie(null);
        }
      } finally {
        if (isMounted) {
          setLoadingMovie(false);
        }
      }
    }

    async function loadShowtimes() {
      if (!movieId) return;

      setLoadingShowtimes(true);
      setShowtimesError(null);

      try {
        const showtimesRes = await publicMovieService.getShowtimesByMovieId(movieId);

        if (isMounted) {
          setShowtimes(showtimesRes?.data || {});
        }
      } catch (requestError) {
        if (isMounted) {
          console.error("Failed to load showtimes:", requestError);
          setShowtimes({});
          setShowtimesError("Failed to load showtimes.");
        }
      } finally {
        if (isMounted) {
          setLoadingShowtimes(false);
        }
      }
    }

    loadMovie();
    loadShowtimes();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  return {
    movie,
    showtimes,
    loading: loadingMovie,
    loadingMovie,
    loadingShowtimes,
    error,
    showtimesError,
  };
}

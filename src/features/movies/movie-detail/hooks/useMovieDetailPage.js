import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '@/features/movies/services/movieService';
import { getShowtimesByMovieId } from '@/features/movies/services/showtimeService';
import { extractMovieItem, normalizeMovieItem } from '@/features/movies/utils/movieAdapter';
import { mockMovies, mockShowtimes } from '@/utils/mockData';

function useMovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [openTrailer, setOpenTrailer] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadMovieDetail() {
      try {
        const [movieResult, showtimeResult] = await Promise.all([
          getMovieById(id),
          getShowtimesByMovieId(id),
        ]);

        if (mounted) {
          const mappedMovie = normalizeMovieItem(extractMovieItem(movieResult));
          setMovie(mappedMovie);
          setShowtimes(showtimeResult?.data ?? showtimeResult);
        }
      } catch {
        if (mounted) {
          const fallbackMovie = mockMovies.find((item) => String(item.id) === String(id)) ?? mockMovies[0];
          setMovie(fallbackMovie);
          setShowtimes(mockShowtimes);
        }
      }
    }

    loadMovieDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    movie,
    showtimes,
    openTrailer,
    setOpenTrailer,
  };
}

export default useMovieDetailPage;

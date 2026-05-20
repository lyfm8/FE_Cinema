import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieInfo from '@/pages/movies/movie-detail/components/MovieInfo';
import ShowtimeList from '@/pages/movies/movie-detail/components/ShowtimeList';
import TrailerModal from '@/pages/movies/movie-detail/components/TrailerModal';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { getMovieById } from '@/features/movies/services/movieService';
import { getShowtimesByMovieId } from '@/features/movies/services/showtimeService';
import { mockMovies, mockShowtimes } from '@/utils/mockData';

function MovieDetailPage() {
  const { tx } = useLanguage();
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
          setMovie(movieResult?.data ?? movieResult);
          setShowtimes(showtimeResult?.data ?? showtimeResult);
        }
      } catch {
        if (mounted) {
          setMovie(mockMovies.find((item) => item.id === id) ?? mockMovies[0]);
          setShowtimes(mockShowtimes);
        }
      }
    }

    loadMovieDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!movie) {
    return <div className="page-container text-sm text-stone">{tx('Loading movie...', 'Äang táº£i phim...')}</div>;
  }

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Movie Detail', 'Chi tiáº¿t phim')}
        </p>
        <h1 className="movie-title text-3xl">{movie.title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <MovieInfo movie={movie} onOpenTrailer={() => setOpenTrailer(true)} />
        <ShowtimeList showtimes={showtimes} />
      </div>

      <TrailerModal isOpen={openTrailer} onClose={() => setOpenTrailer(false)} title={movie.title} />
    </div>
  );
}

export default MovieDetailPage;



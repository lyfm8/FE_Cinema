import MovieInfo from '@/pages/movies/movie-detail/components/MovieInfo';
import ShowtimeList from '@/pages/movies/movie-detail/components/ShowtimeList';
import TrailerModal from '@/pages/movies/movie-detail/components/TrailerModal';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useMovieDetailPage from '@/features/movies/movie-detail/hooks/useMovieDetailPage';

function MovieDetailPage() {
  const { tx } = useLanguage();
  const { movie, showtimes, openTrailer, setOpenTrailer } = useMovieDetailPage();

  if (!movie) {
    return <div className="page-container text-sm text-stone">{tx('Loading movie...', 'Đang tải phim...')}</div>;
  }

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Movie Detail', 'Chi tiết phim')}
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

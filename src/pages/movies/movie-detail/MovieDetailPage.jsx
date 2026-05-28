import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieInfo from '@/pages/movies/movie-detail/components/MovieInfo';
import ShowtimeList from '@/pages/movies/movie-detail/components/ShowtimeList';
import TrailerModal from '@/pages/movies/movie-detail/components/TrailerModal';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useMovieDetailPage from '@/features/movies/movie-detail/hooks/useMovieDetailPage';

function MovieDetailPage() {
  const { id } = useParams();
  const { tx } = useLanguage();
  const { movie, showtimes, loading, error } = useMovieDetailPage(id);
  const [openTrailer, setOpenTrailer] = useState(false);

  if (loading) {
    return <div className="page-container py-12 text-center text-sm font-medium text-stone">{tx('Loading movie...', 'Đang tải phim...')}</div>;
  }
  if (error || !movie) {
    return <div className="page-container py-12 text-center text-sm font-medium text-rose">{error || tx('Movie not found', 'Không tìm thấy phim')}</div>;
  }

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2 mb-4">
        <p className="text-sm font-bold text-galaxyBlue uppercase tracking-widest">
          {tx('Movie Detail', 'Chi tiết phim')}
        </p>
        <div className="flex items-center gap-3">
          {movie.ageLimit && (
            <span className="shrink-0 rounded bg-galaxyOrange px-2 py-1 text-sm font-bold text-white shadow-sm">
              {movie.ageLimit}+
            </span>
          )}
          <h1 className="movie-title text-3xl">{movie.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <MovieInfo movie={movie} onOpenTrailer={() => setOpenTrailer(true)} />
        <ShowtimeList showtimes={showtimes} />
      </div>

      <TrailerModal 
        isOpen={openTrailer} 
        onClose={() => setOpenTrailer(false)} 
        title={movie.title} 
        trailerUrl={movie.trailerUrl}
      />
    </div>
  );
}

export default MovieDetailPage;

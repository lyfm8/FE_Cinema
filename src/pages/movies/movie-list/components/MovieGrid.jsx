import MovieCard from '@/pages/movies/movie-list/components/MovieCard';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/shared/Pagination';
import useLanguage from '@/hooks/useLanguage';

/**
 * @param {{
 *  movies: Array<{ id: string, title: string, genre: string, duration: string, rating: number, price: number }>,
 *  loading: boolean,
 *  page: number,
 *  totalPages: number,
 *  onPrevPage: () => void,
 *  onNextPage: () => void
 * }} props
 */
function MovieGrid({ movies, loading, page, totalPages, onPrevPage, onNextPage }) {
  const { tx } = useLanguage();

  if (loading) {
    return (
      <div className="surface-card flex min-h-56 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="surface-card flex min-h-56 flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="movie-title text-lg">{tx('No movies found', 'Không tìm thấy phim')}</p>
        <p className="text-sm text-stone">{tx('Try another keyword or clear the filter.', 'Thử từ khóa khác hoặc xóa bộ lọc.')}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-end">
        <Pagination page={page} totalPages={totalPages} onPrev={onPrevPage} onNext={onNextPage} />
      </div>
    </section>
  );
}

export default MovieGrid;




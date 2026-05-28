import MovieFilter from '@/pages/movies/movie-list/components/MovieFilter';
import MovieGrid from '@/pages/movies/movie-list/components/MovieGrid';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useMovieListPage from '@/features/movies/movie-list/hooks/useMovieListPage';

function MovieListPage() {
  const { tx } = useLanguage();
  const {
    loading,
    error,
    keyword,
    filteredMovies,
    highlightedGenres,
    page,
    totalPages,
    paginatedMovies,
    setKeyword,
    nextPage,
    prevPage,
  } = useMovieListPage();

  return (
    <div className="page-container space-y-7">
      <div className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-medium text-ink">{tx('Movie catalog', 'Danh mục phim')}</h1>
          <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">
            {tx(`${filteredMovies.length} titles available`, `${filteredMovies.length} phim hiện có`)}
          </span>
        </div>
      </div>

      <div className="surface-card p-4">
        <p className="section-label mb-3">{tx('Popular Genres', 'Thể loại phổ biến')}</p>
        <div className="flex flex-wrap gap-2">
          {highlightedGenres.map((genre) => (
            <span key={genre} className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">
              {genre}
            </span>
          ))}
        </div>
      </div>

      <MovieFilter keyword={keyword} onKeywordChange={setKeyword} />

      {error ? <p className="text-xs text-rose">{tx(error, 'Không thể tải phim từ API. Đang hiển thị dữ liệu mẫu.')}</p> : null}

      <MovieGrid
        movies={paginatedMovies}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </div>
  );
}

export default MovieListPage;

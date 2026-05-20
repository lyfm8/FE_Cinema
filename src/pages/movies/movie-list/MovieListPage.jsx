import { useMemo, useState } from 'react';
import MovieFilter from '@/pages/movies/movie-list/components/MovieFilter';
import MovieGrid from '@/pages/movies/movie-list/components/MovieGrid';
import useMovies from '@/features/movies/hooks/useMovies';
import usePagination from '@/features/movies/hooks/usePagination';
import useDebounce from '@/features/movies/hooks/useDebounce';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function MovieListPage() {
  const { movies, loading, error } = useMovies();
  const { tx } = useLanguage();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 250);

  const filteredMovies = useMemo(() => {
    const q = debouncedKeyword.trim().toLowerCase();

    if (!q) {
      return movies;
    }

    return movies.filter((movie) => movie.title?.toLowerCase().includes(q));
  }, [movies, debouncedKeyword]);

  const { page, totalPages, paginatedItems, nextPage, prevPage } = usePagination(filteredMovies, 8);
  const highlightedGenres = useMemo(() => {
    const values = movies.map((movie) => movie.genre).filter(Boolean);
    return Array.from(new Set(values)).slice(0, 6);
  }, [movies]);

  return (
    <div className="page-container space-y-7">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Movies', 'Phim')}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-medium text-ink">{tx('Movie catalog', 'Danh mục phim')}</h1>
          <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">
            {tx(`${filteredMovies.length} titles available`, `${filteredMovies.length} phim hiện có`)}
          </span>
        </div>
      </div>

      <div className="surface-card p-4">
        <p className="section-label mb-3">{tx('Popular Genres', 'Thể loại pho bien')}</p>
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
        movies={paginatedItems}
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




import MovieCard from '@/pages/movies/movie-list/components/MovieCard';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ movies: Array<{id: string, title: string, genre: string, duration: string, rating: number, price: number}> }} props */
function NowShowingSection({ movies }) {
  const { tx } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="section-label mb-2">{tx('Now Showing', 'Đang chiếu')}</p>
          <h2 className="text-xl font-medium text-ink">{tx('Current box office lineup', 'Danh sách phim đang hot')}</h2>
        </div>
        <Link to="/movies" className="text-sm text-stone transition-colors hover:text-charcoal">
          {tx('View all', 'Xem tất cả')}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default NowShowingSection;




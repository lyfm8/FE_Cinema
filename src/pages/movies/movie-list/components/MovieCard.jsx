import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/** @param {{ movie: { id: string, title: string, genre: string, duration: string, rating: number, price: number } }} props */
function MovieCard({ movie }) {
  const { tx } = useLanguage();

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-colors hover:border-charcoal">
      <div className="relative flex h-48 items-end justify-between border-b border-ash bg-cream p-3">
        <span className="rounded-full border-base bg-paper px-2 py-0.5 text-[11px] text-stone">{movie.genre}</span>
        <span className="rounded-full border-base bg-gold px-2 py-0.5 text-[11px] text-charcoal">{movie.rating}</span>
        <span className="section-label absolute left-3 top-3">{tx('Poster', 'Áp phích')}</span>
      </div>

      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <Badge tone="outline">{movie.duration}</Badge>
          <span className="text-xs text-stone">{tx('2D • Sub', '2D • Phụ đề')}</span>
        </div>

        <Link to={`/movies/${movie.id}`} className="movie-title block text-lg leading-tight transition-colors group-hover:text-charcoal">
          {movie.title}
        </Link>

        <div className="flex items-center justify-between text-xs text-stone">
          <span>{tx('From', 'Từ')}</span>
          <span className="movie-title text-sm">{formatCurrency(movie.price)}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;


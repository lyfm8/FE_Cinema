import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ movie: any }} props */
function MovieCard({ movie }) {
  const { tx } = useLanguage();

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-all duration-200 hover:border-charcoal hover:shadow-md flex flex-col h-full">
      <div className="relative flex h-64 w-full items-end justify-between border-b border-ash bg-cream p-3 overflow-hidden">
        {movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList?.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${movie.posterUrl ? 'hidden' : ''}`}>
          <span className="section-label">{tx('Poster', 'Áp phích')}</span>
        </div>
        
        {/* Overlay gradient to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex w-full items-center justify-between">
          <span className="rounded-full border border-white/20 bg-paper/90 px-2.5 py-0.5 text-[11px] font-medium text-stone shadow-sm backdrop-blur-sm">
            {movie.genre || '—'}
          </span>
          {movie.ageLimit && (
            <span className="rounded-full border border-white/20 bg-rose/90 px-2.5 py-0.5 text-[11px] font-bold text-paper shadow-sm backdrop-blur-sm">
              {movie.ageLimit}+
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Badge tone="outline">{movie.durationMinutes || movie.duration ? `${movie.durationMinutes || movie.duration} ${tx('min', 'phút')}` : '—'}</Badge>
          <span className="text-xs font-medium text-stone">{movie.language || tx('Original', 'Gốc')}</span>
        </div>

        <Link to={`/movies/${movie.id}`} className="movie-title block text-lg leading-tight transition-colors group-hover:text-charcoal flex-1">
          {movie.title}
        </Link>
      </div>
    </article>
  );
}

export default MovieCard;
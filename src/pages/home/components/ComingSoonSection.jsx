import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function ComingSoonCard({ movie }) {
  const { tx } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return tx('TBA', 'Chưa xác định');
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-all duration-200 hover:border-charcoal hover:shadow-sm">
      <div className="relative flex h-52 items-end overflow-hidden bg-cream">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-ash">
            <span className="text-4xl text-fog">🎬</span>
          </div>
        )}
        {/* Coming soon label overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="relative z-10 flex w-full items-end justify-between p-3">
          <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[11px] font-medium text-charcoal backdrop-blur-sm">
            {tx('Coming Soon', 'Sắp chiếu')}
          </span>
          {movie.ageLimit && (
            <span className="rounded-full bg-rose/90 px-2 py-0.5 text-[11px] font-medium text-paper">
              {movie.ageLimit}+
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between text-[11px] text-stone">
          <span>{movie.genre || '—'}</span>
          <span>{movie.durationMinutes ? `${movie.durationMinutes} ${tx('min', 'phút')}` : '—'}</span>
        </div>

        <Link
          to={`/movies/${movie.id}`}
          className="movie-title block truncate text-lg leading-tight transition-colors group-hover:text-charcoal"
        >
          {movie.title}
        </Link>

        <div className="flex items-center justify-between text-xs text-stone">
          <span>{tx('Release', 'Khởi chiếu')}</span>
          <span className="font-medium text-charcoal">{formatReleaseDate(movie.releaseDate)}</span>
        </div>
      </div>
    </article>
  );
}

/** @param {{ movies: Array<any> }} props */
function ComingSoonSection({ movies }) {
  const { tx } = useLanguage();

  return (
    <section className="space-y-4">
      <div>
        <p className="section-label mb-2 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          {tx('Coming Soon', 'Sắp chiếu')}
        </p>
        <h2 className="text-xl font-medium text-ink">
          {tx('Early previews and next releases', 'Preview sớm và phim sắp ra mắt')}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <ComingSoonCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default ComingSoonSection;

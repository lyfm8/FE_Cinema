import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function MovieHomeCard({ movie }) {
  const { tx } = useLanguage();
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-all duration-200 hover:border-charcoal hover:shadow-sm">
      <div className="relative flex h-52 items-end overflow-hidden bg-cream">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-ash">
            <span className="text-4xl text-fog">🎬</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        {/* Genre badge */}
        <div className="relative z-10 flex w-full items-end justify-between p-3">
          <span className="rounded-full bg-paper/90 px-2 py-0.5 text-[11px] text-stone backdrop-blur-sm">
            {movie.genre || tx('N/A', 'N/A')}
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
          <span>{movie.durationMinutes ? `${movie.durationMinutes} ${tx('min', 'phút')}` : '—'}</span>
          <span>{movie.language || '—'}</span>
        </div>

        <Link
          to={`/movies/${movie.id}`}
          className="movie-title block truncate text-lg leading-tight transition-colors group-hover:text-charcoal"
        >
          {movie.title}
        </Link>

        {movie.director && (
          <p className="truncate text-xs text-stone">
            {tx('Director', 'Đạo diễn')}: {movie.director}
          </p>
        )}
      </div>
    </article>
  );
}

/** @param {{ movies: Array<any> }} props */
function NowShowingSection({ movies }) {
  const { tx } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="section-label mb-2 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-green" />
            {tx('Now Showing', 'Đang chiếu')}
          </p>
          <h2 className="text-xl font-medium text-ink">{tx('Current box office lineup', 'Danh sách phim đang hot')}</h2>
        </div>
        <Link to="/movies" className="whitespace-nowrap text-sm text-stone transition-colors hover:text-charcoal">
          {tx('View all', 'Xem tất cả')} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieHomeCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default NowShowingSection;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function MovieHomeCard({ movie }) {
  const { tx } = useLanguage();
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-100">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl text-gray-300">🎬</span>
          </div>
        )}
        {/* Hover Overlay with Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-galaxyBlue/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
          <Link to={`/booking/${movie.id}/seats`} className="w-3/4 text-center rounded bg-galaxyOrange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-galaxyOrangeHover shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {tx('Buy Ticket', 'Mua Vé')}
          </Link>
          <Link to={`/movies/${movie.id}`} className="w-3/4 text-center rounded border-2 border-white px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-galaxyBlue shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {tx('Details', 'Xem Chi Tiết')}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-3 pb-2 px-2">
        <div className="flex items-start gap-2">
          <Link
            to={`/movies/${movie.id}`}
            className="movie-title block text-lg font-bold uppercase transition-colors hover:text-galaxyBlue line-clamp-2"
          >
            {movie.title}
          </Link>
        </div>
        
        <div className="mt-2 flex flex-wrap items-center text-sm font-medium text-stone">
          <span>{movie.genre || tx('N/A', 'N/A')}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{movie.durationMinutes ? `${movie.durationMinutes} ${tx('min', 'phút')}` : '—'}</span>
          {movie.ageLimit && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-galaxyOrange font-bold">{movie.ageLimit}+</span>
            </>
          )}
        </div>
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

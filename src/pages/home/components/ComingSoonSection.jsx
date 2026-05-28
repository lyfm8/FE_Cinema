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
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-5xl text-gray-300">🎬</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="rounded-md bg-[#034ea2] px-2 py-0.5 text-xs font-bold text-white shadow-lg">
            {tx('Coming Soon', 'Sắp chiếu')}
          </span>
          {movie.ageLimit && (
            <span className="rounded-md bg-[#f26b38] px-2 py-0.5 text-xs font-bold text-white shadow-lg">
              {movie.ageLimit}+
            </span>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-medium text-white/80">
            {tx('Release', 'Khởi chiếu')}: <span className="font-bold text-white">{formatReleaseDate(movie.releaseDate)}</span>
          </p>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#034ea2]/70 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
          <Link
            to={`/movies/${movie.id}`}
            className="w-3/4 text-center rounded-lg border-2 border-white px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#034ea2] shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            {tx('Details', 'Xem Chi Tiết')}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3">
        <Link
          to={`/movies/${movie.id}`}
          className="font-bold text-base text-ink uppercase leading-snug transition-colors hover:text-[#034ea2] line-clamp-2"
        >
          {movie.title}
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-500">
          <span className="rounded bg-gray-100 px-2 py-0.5">{movie.genre || '—'}</span>
          {movie.durationMinutes && (
            <span className="rounded bg-gray-100 px-2 py-0.5">{movie.durationMinutes} {tx('min', 'phút')}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/** @param {{ movies: Array<any> }} props */
function ComingSoonSection({ movies }) {
  const { tx } = useLanguage();

  return (
    <section className="page-container py-10">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-[#034ea2]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#034ea2] mb-1">
              {tx('Coming Soon', 'Sắp chiếu')}
            </p>
            <h2 className="text-2xl font-bold text-ink">
              {tx('Upcoming releases', 'Phim sắp ra mắt')}
            </h2>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <ComingSoonCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default ComingSoonSection;

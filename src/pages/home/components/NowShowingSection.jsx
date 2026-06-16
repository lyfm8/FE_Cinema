import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function MovieHomeCard({ movie }) {
  const { tx } = useLanguage();
  const [imgError, setImgError] = useState(false);

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

        {/* Age limit badge */}
        {movie.ageLimit && (
          <div className="absolute top-3 right-3">
            <span className="rounded-md bg-[#f26b38] px-2 py-0.5 text-xs font-bold text-white shadow-lg">
              {movie.ageLimit}+
            </span>
          </div>
        )}

        {/* Hover Overlay with Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#034ea2]/70 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
          <Link
            to={`/movies/${movie.id}#showtimes`}
            className="w-3/4 text-center rounded-lg bg-[#f26b38] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#fb9440] shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            {tx('Buy Ticket', 'Mua Vé')}
          </Link>
          <Link
            to={`/movies/${movie.id}`}
            className="w-3/4 text-center rounded-lg border-2 border-white px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#034ea2] shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            {tx('Details', 'Chi Tiết')}
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
          <span className="rounded bg-gray-100 px-2 py-0.5">{movie.genre || tx('N/A', 'N/A')}</span>
          {movie.durationMinutes && (
            <span className="rounded bg-gray-100 px-2 py-0.5">{movie.durationMinutes} {tx('min', 'phút')}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/** @param {{ movies: Array<any>, genreName: string }} props */
function NowShowingSection({ movies, genreName }) {
  const { tx } = useLanguage();

  return (
    <section className="page-container py-10">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-[#f26b38]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#f26b38] mb-1">
              {tx('Genre', 'Thể loại')}
            </p>
            <h2 className="text-2xl font-bold text-ink">
              {genreName}
            </h2>
          </div>
        </div>
        <Link
          to={`/movies?genre=${encodeURIComponent(genreName)}`}
          className="group whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:border-[#034ea2] hover:text-[#034ea2] hover:shadow-sm"
        >
          {tx('View all', 'Xem tất cả')}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieHomeCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default NowShowingSection;

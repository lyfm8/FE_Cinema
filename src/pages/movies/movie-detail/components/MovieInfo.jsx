import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/** @param {{ movie: any, onOpenTrailer: () => void }} props */
function MovieInfo({ movie, onOpenTrailer }) {
  const { tx } = useLanguage();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
      {/* Left Column: Poster & Trailer */}
      <div className="w-full md:w-[320px] shrink-0 space-y-4">
        <div className="relative flex h-[480px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-inner">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.classList?.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${movie.posterUrl ? 'hidden' : ''}`}>
            <span className="text-4xl text-gray-300">🎬</span>
          </div>
        </div>

        {movie.trailerUrl && (
          <Button variant="secondary" onClick={onOpenTrailer} className="w-full">
            {tx('Watch trailer', 'Xem trailer')}
          </Button>
        )}
      </div>

      {/* Right Column: Info */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline" className="border-gray-200 text-galaxyBlue">{movie.genre || '—'}</Badge>
          <Badge tone="muted">{movie.durationMinutes || movie.duration ? `${movie.durationMinutes || movie.duration} ${tx('min', 'phút')}` : '—'}</Badge>
          {movie.ageLimit && <Badge tone="outline" className="bg-galaxyOrange text-white border-transparent font-bold">{movie.ageLimit}+</Badge>}
        </div>

        <div className="space-y-4 text-sm text-stone">
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tx('Release', 'Khởi chiếu')}</span>
              <p className="font-medium text-ink text-base">{formatDate(movie.releaseDate)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tx('Language', 'Ngôn ngữ')}</span>
              <p className="font-medium text-ink text-base">{movie.language || '—'}</p>
            </div>
          </div>

          {(movie.director || movie.cast) && (
            <div className="mt-6 space-y-4">
              {movie.director && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{tx('Director', 'Đạo diễn')}</span>
                  <p className="font-medium text-ink text-base">{movie.director}</p>
                </div>
              )}
              {movie.cast && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{tx('Cast', 'Diễn viên')}</span>
                  <p className="font-medium text-ink leading-relaxed text-base">{movie.cast}</p>
                </div>
              )}
            </div>
          )}

          {movie.description && (
            <div className="pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{tx('Synopsis', 'Nội dung phim')}</span>
              <p className="text-ink leading-relaxed text-base">{movie.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MovieInfo;


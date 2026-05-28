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
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 space-y-5 p-6">
      <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-inner">
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

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="outline" className="border-gray-200 text-galaxyBlue">{movie.genre || '—'}</Badge>
        <Badge tone="muted">{movie.durationMinutes || movie.duration ? `${movie.durationMinutes || movie.duration} ${tx('min', 'phút')}` : '—'}</Badge>
        {movie.ageLimit && <Badge tone="outline" className="bg-galaxyOrange text-white border-transparent font-bold">{movie.ageLimit}+</Badge>}
      </div>

      <div className="space-y-4 text-sm text-stone">
        {movie.description && (
          <p className="text-ink leading-relaxed">{movie.description}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <p><span className="font-bold text-gray-500 mr-1">{tx('Release', 'Khởi chiếu')}:</span> <span className="font-medium text-ink">{formatDate(movie.releaseDate)}</span></p>
          <p><span className="font-bold text-gray-500 mr-1">{tx('Language', 'Ngôn ngữ')}:</span> <span className="font-medium text-ink">{movie.language || '—'}</span></p>
        </div>
        {(movie.director || movie.cast) && (
          <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4 border border-gray-100">
            {movie.director && <p><span className="font-bold text-gray-500 mr-1">{tx('Director', 'Đạo diễn')}:</span> <span className="font-medium text-ink">{movie.director}</span></p>}
            {movie.cast && <p><span className="font-bold text-gray-500 mr-1">{tx('Cast', 'Diễn viên')}:</span> <span className="font-medium text-ink">{movie.cast}</span></p>}
          </div>
        )}
      </div>

      {movie.trailerUrl && (
        <Button variant="secondary" onClick={onOpenTrailer} className="w-full mt-4">
          {tx('Watch trailer', 'Xem trailer')}
        </Button>
      )}
    </section>
  );
}

export default MovieInfo;


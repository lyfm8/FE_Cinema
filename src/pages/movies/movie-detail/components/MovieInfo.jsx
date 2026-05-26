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
    <section className="surface-card space-y-4 p-4">
      <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-md border-base bg-cream">
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
          <span className="section-label">{tx('Poster', 'Áp phích')}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="outline">{movie.genre || '—'}</Badge>
        <Badge tone="muted">{movie.durationMinutes || movie.duration ? `${movie.durationMinutes || movie.duration} ${tx('min', 'phút')}` : '—'}</Badge>
        {movie.ageLimit && <Badge tone="outline" className="text-rose border-rose">{movie.ageLimit}+</Badge>}
      </div>

      <div className="space-y-1 text-sm text-stone">
        {movie.description && (
          <p className="mb-4 text-charcoal">{movie.description}</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <p><span className="section-label mr-1">{tx('Release', 'Khởi chiếu')}:</span> <span className="text-charcoal">{formatDate(movie.releaseDate)}</span></p>
          <p><span className="section-label mr-1">{tx('Language', 'Ngôn ngữ')}:</span> <span className="text-charcoal">{movie.language || '—'}</span></p>
        </div>
        {(movie.director || movie.cast) && (
          <div className="mt-2 space-y-1 rounded-md border-base bg-cream/60 p-3">
            {movie.director && <p><span className="section-label mr-1">{tx('Director', 'Đạo diễn')}:</span> <span className="text-charcoal">{movie.director}</span></p>}
            {movie.cast && <p><span className="section-label mr-1">{tx('Cast', 'Diễn viên')}:</span> <span className="text-charcoal">{movie.cast}</span></p>}
          </div>
        )}
      </div>

      {movie.trailerUrl && (
        <Button variant="secondary" onClick={onOpenTrailer}>
          {tx('Watch trailer', 'Xem trailer')}
        </Button>
      )}
    </section>
  );
}

export default MovieInfo;


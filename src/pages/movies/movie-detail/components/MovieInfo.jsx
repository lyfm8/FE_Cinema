import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useLanguage from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/** @param {{ movie: { title: string, genre: string, duration: string, rating: number, price: number }, onOpenTrailer: () => void }} props */
function MovieInfo({ movie, onOpenTrailer }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card space-y-4 p-4">
      <div className="flex h-72 items-center justify-center rounded-md border-base bg-cream">
        <span className="section-label">{tx('Poster', 'Áp phích')}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="outline">{movie.genre}</Badge>
        <Badge tone="muted">{movie.duration}</Badge>
        <Badge tone="gold">{movie.rating} / 10</Badge>
      </div>

      <div className="space-y-1">
        <p className="section-label">{tx('Starting price', 'Giá khởi điểm')}</p>
        <p className="movie-title text-2xl">{formatCurrency(movie.price)}</p>
      </div>

      <div className="grid gap-2 text-sm text-stone">
        <div className="rounded-md border-base bg-cream/60 px-3 py-2">
          <span className="section-label mb-1 block">{tx('Format', 'Định dạng')}</span>
          {tx('2D / 3D / IMAX available', 'Có 2D / 3D / IMAX')}
        </div>
        <div className="rounded-md border-base bg-cream/60 px-3 py-2">
          <span className="section-label mb-1 block">{tx('Language', 'Ngôn ngữ')}</span>
          {tx('Original audio with subtitles', 'Âm thanh gốc kèm phụ đề')}
        </div>
      </div>

      <Button variant="secondary" onClick={onOpenTrailer}>
        {tx('Watch trailer', 'Xem trailer')}
      </Button>
    </section>
  );
}

export default MovieInfo;


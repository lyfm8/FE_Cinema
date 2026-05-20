import Modal from '@/components/ui/Modal';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import formatDate from '@/utils/formatDate';

function renderValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return value;
}

/**
 * @param {{
 *  open: boolean,
 *  movie: any,
 *  loading?: boolean,
 *  onClose: () => void
 * }} props
 */
function MovieDetailModal({ open, movie, loading = false, onClose }) {
  const { tx } = useLanguage();

  return (
    <Modal isOpen={open} onClose={onClose} title={tx('Movie detail', 'Chi tiết phim')}>
      {loading ? (
        <p className="text-sm text-stone">{tx('Loading movie detail...', 'Đang tải chi tiết phim...')}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            {movie?.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="h-60 w-40 rounded border-base object-cover" />
            ) : (
              <div className="flex h-60 w-40 items-center justify-center rounded border-base bg-cream text-sm text-stone">
                {tx('No poster', 'Không có poster')}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="movie-title text-2xl">{renderValue(movie?.title)}</h3>
              <p className="text-sm text-stone">
                {tx('Genre', 'Thể loại')}: <span className="text-charcoal">{renderValue(movie?.genre)}</span>
              </p>
              <p className="text-sm text-stone">
                {tx('Duration', 'Thời lượng')}:{' '}
                <span className="text-charcoal">
                  {movie?.durationMinutes ? `${movie.durationMinutes} min` : '-'}
                </span>
              </p>
              <p className="text-sm text-stone">
                {tx('Release date', 'Ngày phát hành')}:{' '}
                <span className="text-charcoal">{movie?.releaseDate ? formatDate(movie.releaseDate) : '-'}</span>
              </p>
              <p className="text-sm text-stone">
                {tx('Status', 'Trạng thái')}: <span className="text-charcoal">{renderValue(movie?.status)}</span>
              </p>
              <p className="text-sm text-stone">
                {tx('Language', 'Ngôn ngữ')}: <span className="text-charcoal">{renderValue(movie?.language)}</span>
              </p>
              <p className="text-sm text-stone">
                {tx('Age limit', 'Giới hạn tuổi')}:{' '}
                <span className="text-charcoal">{movie?.ageLimit || movie?.ageLimit === 0 ? movie.ageLimit : '-'}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="section-label">{tx('Director', 'Đạo diễn')}</p>
            <p className="text-sm text-charcoal">{renderValue(movie?.director)}</p>
          </div>

          <div className="space-y-2">
            <p className="section-label">{tx('Cast', 'Diễn viên')}</p>
            <p className="text-sm text-charcoal">{renderValue(movie?.cast)}</p>
          </div>

          <div className="space-y-2">
            <p className="section-label">{tx('Description', 'Mô tả')}</p>
            <p className="text-sm text-charcoal">{renderValue(movie?.description)}</p>
          </div>

          <div className="space-y-2">
            <p className="section-label">{tx('Trailer URL', 'Link trailer')}</p>
            <p className="break-all text-sm text-charcoal">{renderValue(movie?.trailerUrl)}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default MovieDetailModal;

import DataTable from '@/components/shared/DataTable';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import formatDate from '@/utils/formatDate';

const STATUS_TONE_MAP = {
  NOW_SHOWING: 'border-success-green bg-success-green/10 text-success-green',
  COMING_SOON: 'border-gold bg-gold/20 text-charcoal',
  STOPPED: 'border-ash bg-cream text-stone',
};

/**
 * @param {{
 *  movies: Array<{
 *    id: number,
 *    title: string,
 *    genre: string,
 *    durationMinutes: number,
 *    releaseDate: string,
 *    status: string,
 *    posterUrl?: string
 *  }>,
 *  deletingMovieId?: number | null,
 *  onView: (movie: any) => void,
 *  onEdit: (movie: any) => void,
 *  onDelete: (movie: any) => void
 * }} props
 */
function MovieTable({ movies, deletingMovieId = null, onView, onEdit, onDelete }) {
  const { tx } = useLanguage();

  const columns = [
    { key: 'id', label: tx('ID', 'Mã') },
    { key: 'poster', label: tx('Poster', 'Poster') },
    { key: 'title', label: tx('Title', 'Tiêu đề') },
    { key: 'genre', label: tx('Genre', 'Thể loại') },
    { key: 'durationMinutes', label: tx('Duration', 'Thời lượng') },
    { key: 'releaseDate', label: tx('Release Date', 'Ngày phát hành') },
    { key: 'status', label: tx('Status', 'Trạng thái') },
    { key: 'actions', label: tx('Actions', 'Hành động') },
  ];

  const rows = movies.map((movie) => ({
    id: movie.id,
    poster: movie.posterUrl ? (
      <img src={movie.posterUrl} alt={movie.title} className="h-14 w-10 rounded border-base object-cover" />
    ) : (
      <div className="flex h-14 w-10 items-center justify-center rounded border-base bg-cream text-[10px] text-stone">N/A</div>
    ),
    title: <span className="movie-title text-sm">{movie.title || '-'}</span>,
    genre: movie.genre || '-',
    durationMinutes: movie.durationMinutes ? `${movie.durationMinutes} min` : '-',
    releaseDate: movie.releaseDate ? formatDate(movie.releaseDate) : '-',
    status: (
      <span
        className={`inline-flex rounded-full border-base px-2.5 py-1 text-xs font-medium ${
          STATUS_TONE_MAP[movie.status] ?? STATUS_TONE_MAP.COMING_SOON
        }`}
      >
        {tx(
          movie.status === 'NOW_SHOWING'
            ? 'Now Showing'
            : movie.status === 'STOPPED'
              ? 'Stopped'
              : 'Coming Soon',
          movie.status === 'NOW_SHOWING'
            ? 'Đang chiếu'
            : movie.status === 'STOPPED'
              ? 'Ngừng chiếu'
              : 'Sắp chiếu',
        )}
      </span>
    ),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" className="px-2.5 py-1 text-xs" onClick={() => onView(movie)}>
          {tx('View', 'Xem')}
        </Button>
        <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => onEdit(movie)}>
          {tx('Edit', 'Sửa')}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => onDelete(movie)}
          disabled={deletingMovieId === movie.id}
        >
          {deletingMovieId === movie.id ? tx('Deleting...', 'Đang xóa...') : tx('Delete', 'Xóa')}
        </Button>
      </div>
    ),
  }));

  return <DataTable columns={columns} rows={rows} />;
}

export default MovieTable;

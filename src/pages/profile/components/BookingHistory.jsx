import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/**
 * @param {{
 *  bookings: Array<{ id: string, createdAt?: string, status?: string, movieTitle?: string, showtimeAt?: string, totalAmount?: number }>,
 *  loading?: boolean
 * }} props
 */
function BookingHistory({ bookings, loading = false }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4 lg:col-span-2">
      <p className="section-label mb-3">{tx('Booking History', 'Lịch sử đặt vé')}</p>

      {loading ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('Loading booking history...', 'Đang tải lịch sử đặt vé...')}
        </p>
      ) : null}

      {!loading && bookings.length === 0 ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('No booking history.', 'Chưa có lịch sử đặt vé.')}
        </p>
      ) : null}

      {!loading && bookings.length > 0 ? (
        <ul className="space-y-2 text-sm text-charcoal">
          {bookings.map((booking) => (
            <li key={booking.id} className="space-y-1 rounded-md border-base bg-cream/40 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="movie-title">#{booking.id}</span>
                <span className="text-xs uppercase tracking-wider text-stone">{booking.status}</span>
              </div>
              {booking.movieTitle ? (
                <p className="text-xs text-stone">
                  {tx('Movie', 'Phim')}: {booking.movieTitle}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-stone">
                  {tx('Created at', 'Ngày tạo')}: {formatDate(booking.createdAt)}
                </span>
                <span className="text-xs text-stone">
                  {tx('Showtime', 'Suất chiếu')}:{' '}
                  {booking.showtimeAt ? formatDate(booking.showtimeAt) : tx('Updating', 'Đang cập nhật')}
                </span>
                <span className="movie-title text-xs">{formatCurrency(booking.totalAmount || 0)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default BookingHistory;


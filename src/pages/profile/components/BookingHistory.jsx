import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { QRCodeSVG } from 'qrcode.react';

/**
 * @param {{
 *  bookings: Array<object>,
 *  loading?: boolean,
 *  error?: string
 * }} props
 */
function BookingHistory({ bookings, loading = false, error = '' }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4 lg:col-span-2">
      <p className="section-label mb-3">{tx('My tickets', 'Vé của tôi')}</p>

      {loading ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('Loading booking history...', 'Đang tải lịch sử đặt vé...')}
        </p>
      ) : null}

      {!loading && error ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-rose">
          {tx(error, 'Không thể tải vé của bạn.')}
        </p>
      ) : null}

      {!loading && !error && bookings.length === 0 ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('No booking history.', 'Chưa có lịch sử đặt vé.')}
        </p>
      ) : null}

      {!loading && bookings.length > 0 ? (
        <ul className="space-y-2 text-sm text-charcoal">
          {bookings.map((booking) => (
            <li key={booking.id} className="space-y-1 rounded-md border-base bg-cream/40 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="movie-title">{booking.bookingCode || `#${booking.id}`}</span>
                <span className="text-xs uppercase tracking-wider text-stone">{booking.status}</span>
              </div>
              {booking.showtime?.movie?.title ? (
                <p className="text-xs text-stone">
                  {tx('Movie', 'Phim')}: {booking.showtime.movie.title}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-stone">
                  {tx('Created at', 'Ngày tạo')}: {formatDate(booking.createdAt)}
                </span>
                <span className="text-xs text-stone">
                  {tx('Showtime', 'Suất chiếu')}:{' '}
                  {booking.showtime?.publicStartTime
                    ? formatDate(booking.showtime.publicStartTime)
                    : tx('Updating', 'Đang cập nhật')}
                </span>
                <span className="movie-title text-xs">{formatCurrency(booking.totalAmount || 0)}</span>
              </div>

              {booking.tickets?.some((ticket) => ticket.qrCode) ? (
                <div className="mt-3 border-t border-stone/20 pt-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-charcoal">
                    {tx('Your QR tickets', 'Mã QR vé của bạn')}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {booking.tickets.filter((ticket) => ticket.qrCode).map((ticket) => {
                      const seatLabel = ticket.seat
                        ? `${ticket.seat.row}${ticket.seat.number}`
                        : `#${ticket.seatId}`;

                      return (
                        <div
                          key={ticket.id}
                          className="rounded-md border-base bg-paper p-3 text-center"
                        >
                          <p className="mb-2 text-xs font-semibold text-charcoal">
                            {tx('Seat', 'Ghế')} {seatLabel}
                          </p>
                          <QRCodeSVG
                            value={ticket.qrCode}
                            size={152}
                            level="M"
                            className="mx-auto max-w-full rounded bg-white p-2"
                          />
                          <p className="mt-2 break-all font-mono text-[10px] text-stone">
                            {ticket.qrCode}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-stone">
                            {ticket.isCheckedIn
                              ? tx('Checked in', 'Đã soát vé')
                              : tx('Not checked in', 'Chưa soát vé')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default BookingHistory;


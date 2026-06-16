import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { QRCodeSVG } from 'qrcode.react';

function getStatusColor(status) {
  switch (status) {
    case 'PAID':
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'CANCELLED':
    case 'FAILED':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'PAID':
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'Thành công';
    case 'PENDING':
      return 'Chờ thanh toán';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'FAILED':
      return 'Thất bại';
    default:
      return status;
  }
}

function BookingHistory({
  bookings = [],
  loading = false,
  error = '',
  onViewTicket,
  onPayNow,
}) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4 lg:col-span-2 mt-6">
      <p className="section-label mb-4">{tx('My tickets', 'Vé của tôi')}</p>

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
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone text-center">
          {tx('No booking history.', 'Chưa có lịch sử đặt vé.')}
        </p>
      ) : null}

      {!loading && !error && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const { id, bookingCode, status, totalAmount, showtime } = booking;
            const movie = showtime?.movie;
            const isSuccess = ['PAID', 'CONFIRMED', 'COMPLETED'].includes(status);

            return (
              <div
                key={id}
                className="rounded-xl border border-base bg-paper p-4 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    {movie?.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="h-20 w-14 rounded object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-20 w-14 items-center justify-center rounded border border-base bg-cream">
                        <span className="text-[10px] text-ink/40">No Img</span>
                      </div>
                    )}

                    <div className="flex flex-col">
                      <h4 className="line-clamp-1 font-semibold text-ink">
                        {movie?.title || showtime?.movie?.title || 'Unknown Movie'}
                      </h4>
                      <p className="mt-1 text-xs text-ink/70">
                        {showtime?.publicStartTime ? formatDate(showtime.publicStartTime) : 'N/A'}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(status)}`}>
                          {tx(status, getStatusText(status))}
                        </span>
                        {bookingCode ? (
                          <span className="text-[11px] font-medium text-ink/50">
                            Mã: {bookingCode}
                          </span>
                        ) : null}
                        <span className="text-sm font-bold text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-center gap-2 sm:flex-row md:ml-auto">
                    {status === 'PENDING' && onPayNow ? (
                      <button
                        type="button"
                        onClick={() => onPayNow(booking)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#f26b38]/30 bg-[#f26b38]/10 px-3 py-1.5 text-xs font-bold text-[#f26b38] transition-all hover:bg-[#f26b38] hover:text-white hover:shadow-md active:scale-95 sm:w-auto"
                      >
                        {tx('Pay Now', 'Thanh toán')}
                      </button>
                    ) : null}

                    {onViewTicket ? (
                      <button
                        type="button"
                        onClick={() => onViewTicket(booking)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#034ea2]/30 bg-[#034ea2]/5 px-3 py-1.5 text-xs font-semibold text-[#034ea2] transition-all hover:bg-[#034ea2] hover:text-white hover:shadow-md active:scale-95 sm:w-auto"
                      >
                        {isSuccess ? tx('View Ticket', 'Xem vé') : tx('View Details', 'Xem chi tiết')}
                      </button>
                    ) : null}
                  </div>
                </div>

                {booking.tickets?.some((ticket) => ticket.qrCode) ? (
                  <div className="mt-4 border-t border-stone/20 pt-4">
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
                            className="rounded-md border-base bg-cream/40 p-3 text-center"
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
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default BookingHistory;

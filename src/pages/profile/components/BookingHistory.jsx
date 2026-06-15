import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import useLanguage from '@/features/i18n/hooks/useLanguage';

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

function BookingHistory({ bookings, loading = false, onViewTicket, onPayNow }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4 lg:col-span-2 mt-6">
      <p className="section-label mb-4">{tx('Booking History', 'Lịch sử đặt vé')}</p>

      {loading ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('Loading booking history...', 'Đang tải lịch sử đặt vé...')}
        </p>
      ) : null}

      {!loading && (!bookings || bookings.length === 0) ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone text-center">
          {tx('No booking history.', 'Chưa có lịch sử đặt vé.')}
        </p>
      ) : null}

      {!loading && bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const { id, bookingCode, status, totalAmount, showtime, createdAt } = booking;
            const movie = showtime?.movie;
            const startTime = showtime?.publicStartTime ? new Date(showtime.publicStartTime) : null;
            
            const isSuccess = ['PAID', 'CONFIRMED', 'COMPLETED'].includes(status);

            return (
              <div key={id} className="flex flex-col justify-between gap-4 rounded-xl border border-base bg-paper p-4 shadow-sm md:flex-row md:items-center hover:border-primary/50 transition-colors">
                <div className="flex gap-4 items-center">
                  {movie?.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-20 w-14 rounded object-cover shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-14 rounded bg-cream flex items-center justify-center border border-base">
                      <span className="text-[10px] text-ink/40">No Img</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-ink line-clamp-1">{movie?.title || 'Unknown Movie'}</h4>
                    <p className="text-xs text-ink/70 mt-1">
                      {startTime ? `${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${startTime.toLocaleDateString('vi-VN')}` : 'N/A'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${getStatusColor(status)}`}>
                        {tx(status, getStatusText(status))}
                      </span>
                      {bookingCode && (
                        <span className="text-[11px] font-medium text-ink/50">
                          Mã: {bookingCode}
                        </span>
                      )}
                      <span className="text-sm font-bold text-primary ml-auto">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex-shrink-0 flex items-center gap-2 flex-col sm:flex-row">
                  {status === 'PENDING' && onPayNow && (
                    <button
                      type="button"
                      onClick={() => onPayNow(booking)}
                      className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg border border-[#f26b38]/30 bg-[#f26b38]/10 px-3 py-1.5 text-xs font-bold text-[#f26b38] transition-all hover:bg-[#f26b38] hover:text-white hover:shadow-md active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      {tx('Pay Now', 'Thanh toán')}
                    </button>
                  )}
                  {onViewTicket && (
                    <button
                      type="button"
                      onClick={() => onViewTicket(booking)}
                      className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg border border-[#034ea2]/30 bg-[#034ea2]/5 px-3 py-1.5 text-xs font-semibold text-[#034ea2] transition-all hover:bg-[#034ea2] hover:text-white hover:shadow-md active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {isSuccess ? tx('View Ticket', 'Xem vé') : tx('View Details', 'Xem chi tiết')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default BookingHistory;

import { formatDate } from '@/utils/formatDate';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ bookings: Array<{ id: string, createdAt?: string, status?: string }> }} props */
function BookingHistory({ bookings }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4 lg:col-span-2">
      <p className="section-label mb-3">{tx('Booking History', 'Lịch sử đặt vé')}</p>

      {bookings.length === 0 ? (
        <p className="rounded-md border-base bg-cream px-3 py-4 text-sm text-stone">
          {tx('No booking history.', 'Chưa có lịch sử đặt vé.')}
        </p>
      ) : (
        <ul className="space-y-2 text-sm text-charcoal">
          {bookings.map((booking) => (
            <li key={booking.id} className="grid gap-1 rounded-md border-base bg-cream/40 px-3 py-2 md:grid-cols-[1fr_auto_auto] md:items-center">
              <span className="movie-title">#{booking.id}</span>
              <span className="text-xs uppercase tracking-wider text-stone">{booking.status}</span>
              <span className="text-xs text-stone">{formatDate(booking.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BookingHistory;


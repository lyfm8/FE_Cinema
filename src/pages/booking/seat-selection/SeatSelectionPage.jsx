import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SeatMap from '@/pages/booking/seat-selection/components/SeatMap';
import SeatLegend from '@/pages/booking/seat-selection/components/SeatLegend';
import BookingSummary from '@/pages/booking/seat-selection/components/BookingSummary';
import useBooking from '@/features/booking/hooks/useBooking';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { mockSeats } from '@/utils/mockData';

function SeatSelectionPage() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const { showtimeId } = useParams();
  const { selectedSeats, toggleSeat, setShowtime } = useBooking();

  useEffect(() => {
    setShowtime(showtimeId);
  }, [setShowtime, showtimeId]);

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Booking', 'Đặt vé')}
        </p>
        <h1 className="text-2xl font-medium text-ink">{tx('Seat selection', 'Chọn ghế')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="surface-card space-y-5 p-4 md:p-6">
          <div className="mx-auto max-w-lg rounded-full border-base bg-cream py-1.5 text-center text-xs text-stone">
            {tx('SCREEN THIS WAY', 'MÀN HÌNH PHÍA NÀY')}
          </div>

          <SeatMap seats={mockSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          <SeatLegend />
        </section>

        <BookingSummary
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onContinue={() => navigate('/booking/payment')}
        />
      </div>
    </div>
  );
}

export default SeatSelectionPage;




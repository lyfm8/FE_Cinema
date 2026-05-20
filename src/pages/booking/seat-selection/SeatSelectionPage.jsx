import SeatMap from '@/pages/booking/seat-selection/components/SeatMap';
import SeatLegend from '@/pages/booking/seat-selection/components/SeatLegend';
import BookingSummary from '@/pages/booking/seat-selection/components/BookingSummary';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useSeatSelectionPage from '@/features/booking/seat-selection/hooks/useSeatSelectionPage';

function SeatSelectionPage() {
  const { tx } = useLanguage();
  const {
    seats,
    selectedSeats,
    totalPrice,
    toggleSeat,
    handleContinuePayment,
  } = useSeatSelectionPage();

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

          <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          <SeatLegend />
        </section>

        <BookingSummary
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onContinue={handleContinuePayment}
        />
      </div>
    </div>
  );
}

export default SeatSelectionPage;

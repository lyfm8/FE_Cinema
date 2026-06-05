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
    loading,
    error,
  } = useSeatSelectionPage();

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2 mb-4">
        <p className="text-sm font-bold text-galaxyBlue uppercase tracking-widest">
          {tx('Booking', 'Đặt vé')}
        </p>
        <h1 className="text-3xl font-bold text-ink">{tx('Seat selection', 'Chọn ghế')}</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section className="surface-card space-y-5 p-4 md:p-6 overflow-hidden">
          <div className="mx-auto max-w-2xl text-center mb-8">
            <div className="h-2 w-full rounded-[50%] bg-charcoal/20 shadow-[0_15px_15px_-10px_rgba(0,0,0,0.1)]"></div>
            <p className="mt-4 text-xs font-medium tracking-[0.2em] text-stone">
              {tx('SCREEN', 'MÀN HÌNH')}
            </p>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center text-stone">
              {tx('Loading seats...', 'Đang tải sơ đồ ghế...')}
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center text-error">
              {error}
            </div>
          ) : (
            <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          )}

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

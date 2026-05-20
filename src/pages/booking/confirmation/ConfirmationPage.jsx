import TicketCard from '@/pages/booking/confirmation/components/TicketCard';
import QRCode from '@/pages/booking/confirmation/components/QRCode';
import useBooking from '@/features/booking/hooks/useBooking';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function ConfirmationPage() {
  const { selectedSeats } = useBooking();
  const { tx } = useLanguage();

  return (
    <div className="page-container flex justify-center">
      <section className="surface-card w-full max-w-2xl space-y-5 p-6 text-center">
        <p className="section-label eyebrow-row justify-center">
          <span className="kicker-dot" />
          {tx('Confirmation', 'Xác nhận')}
        </p>
        <h1 className="text-3xl font-medium text-ink">{tx('Booking confirmed', 'Đặt vé thanh cong')}</h1>
        <p className="text-sm text-stone">{tx('Your e-ticket is ready. Show this screen at the cinema gate.', 'Vé điện tử đã sẵn sàng. Hãy đưa màn hình này tại cổng soát vé.')}</p>
        <TicketCard seats={selectedSeats} />
        <QRCode />
      </section>
    </div>
  );
}

export default ConfirmationPage;




import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ seats: string[] }} props */
function TicketCard({ seats }) {
  const { tx } = useLanguage();

  return (
    <div className="rounded-lg border-base border-dashed bg-cream/40 p-4 text-left">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">{tx('Ticket Information', 'Thông tin vé')}</p>
          <p className="movie-title text-xl tracking-[0.1em]">CINEPLEX</p>
        </div>
        <span className="rounded-full border-base bg-paper px-2.5 py-1 text-xs text-success-green">
          {tx('CONFIRMED', 'ĐÃ XÁC NHẬN')}
        </span>
      </div>

      <div className="grid gap-2 text-sm text-charcoal md:grid-cols-2">
        <p>
          {tx('Seats', 'Ghế')}: {seats.join(', ') || tx('No seat selected', 'Chưa chọn ghế')}
        </p>
        <p>{tx('Gate open: 20 minutes before showtime', 'Mở cổng: trước giờ chiếu 20 phút')}</p>
      </div>
    </div>
  );
}

export default TicketCard;


import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const QUICK_PROGRAMS = [
  { slot: '09:30', hall: 'Room A', label: 'Family hour' },
  { slot: '14:20', hall: 'VIP 1', label: 'Premium pick' },
  { slot: '20:15', hall: 'Room C', label: 'Prime time' },
];

/** @param {{ onExplore: () => void }} props */
function HeroBanner({ onExplore }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 border-base border-b p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx('Curated for tonight', 'Đề xuất tối nay')}
          </p>

          <h1 className="movie-title max-w-xl text-3xl leading-tight md:text-[2.05rem]">
            {tx('Minimal design, maximum focus on what to watch next', 'Thiết kế tối giản, tập trung tối đa vào phim bạn sắp xem')}
          </h1>

          <p className="max-w-xl text-sm text-stone md:text-[15px]">
            {tx(
              'A faster way to discover films, compare showtimes, and reserve your seats without visual noise or crowded steps.',
              'Cách nhanh hơn để khám phá phim, so sánh suất chiếu và giữ ghế mà không bị rối mắt bởi giao diện.',
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onExplore}>{tx('Browse movies', 'Xem danh sách phim')}</Button>
            <span className="rounded-full border-base bg-cream px-3 py-2 text-xs text-stone">{tx('12 cinemas online', '12 rạp đang mở')}</span>
            <span className="rounded-full border-base bg-cream px-3 py-2 text-xs text-stone">{tx('84 showtimes today', '84 suất chiếu hôm nay')}</span>
            <span className="rounded-full border-base bg-cream px-3 py-2 text-xs text-stone">{tx('Avg checkout 02:00', 'Thanh toán trung bình 02:00')}</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx('Top Genre', 'Thể loại nổi bật')}</p>
              <p className="text-sm text-charcoal">{tx('Action / Drama', 'Hành động / Tâm lý')}</p>
            </article>
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx('Peak Hour', 'Khung giờ cao điểm')}</p>
              <p className="text-sm text-charcoal">19:00 - 21:00</p>
            </article>
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx('VIP Rooms', 'Phòng VIP')}</p>
              <p className="text-sm text-charcoal">{tx('5 active rooms', '5 phòng đang hoạt động')}</p>
            </article>
          </div>
        </div>

        <div className="space-y-3 bg-cream p-5 md:p-6">
          <article className="surface-card flex items-center justify-between p-3">
            <div>
              <p className="section-label mb-1">{tx('Audience Pick', 'Lựa chọn khán giả')}</p>
              <p className="movie-title text-lg">The Silent Frame</p>
            </div>
            <span className="rounded-full border-base bg-gold px-2.5 py-1 text-xs text-charcoal">8.9 / 10</span>
          </article>

          <article className="surface-card p-3">
            <p className="section-label mb-2">{tx('Today Program', 'Lịch chiếu hôm nay')}</p>
            <div className="space-y-2">
              {QUICK_PROGRAMS.map((program) => (
                <div key={program.slot} className="flex items-center justify-between rounded-md border-base bg-paper px-3 py-2">
                  <div>
                    <p className="movie-title text-base">{program.slot}</p>
                    <p className="text-xs text-stone">{program.hall}</p>
                  </div>
                  <span className="text-xs text-stone">
                    {tx(
                      program.label,
                      program.label === 'Family hour'
                        ? 'Suất gia đình'
                        : program.label === 'Premium pick'
                          ? 'Suất cao cấp'
                          : 'Giờ vàng',
                    )}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card flex items-center justify-between p-3">
            <div>
              <p className="section-label mb-1">{tx('Fast Checkout', 'Thanh toán nhanh')}</p>
              <p className="text-sm text-charcoal">{tx('Seat to payment under two minutes', 'Từ chọn ghế đến thanh toán dưới hai phút')}</p>
            </div>
            <p className="movie-title text-2xl">02:00</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;


import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/**
 * @param {{
 *  onExplore: () => void,
 *  showAdminAccess?: boolean,
 *  onGoAdmin?: () => void,
 *  stats?: { totalCinemas: number, todayShowtimes: number, totalNowShowing: number, totalComingSoon: number },
 *  upcomingShowtimes?: Array<{ id: number, publicStartTime: string, format: string, movie: { title: string }, room: { name: string, cinema: { name: string } } }>,
 *  audiencePick?: { id: number, title: string, genre: string, durationMinutes: number } | null,
 * }} props
 */
function HeroBanner({
  onExplore,
  showAdminAccess = false,
  onGoAdmin = () => {},
  stats = {},
  upcomingShowtimes = [],
  audiencePick = null,
}) {
  const { tx } = useLanguage();

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="surface-card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
        {/* ── Left panel ── */}
        <div className="space-y-5 border-base border-b p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx('Curated for tonight', 'Đề xuất tối nay')}
          </p>

          <h1 className="movie-title max-w-xl text-3xl leading-tight md:text-[2.05rem]">
            {tx(
              'Discover movies, compare showtimes, and book seats — all in one place',
              'Khám phá phim, so sánh suất chiếu, và đặt vé — tất cả tại một nơi',
            )}
          </h1>

          <p className="max-w-xl text-sm text-stone md:text-[15px]">
            {tx(
              'A streamlined cinema experience: browse the latest films, find perfect showtimes, and reserve your seats in minutes.',
              'Trải nghiệm rạp chiếu mượt mà: duyệt phim mới nhất, tìm suất chiếu phù hợp, và giữ ghế chỉ trong vài phút.',
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onExplore}>{tx('Browse movies', 'Xem danh sách phim')}</Button>
            {showAdminAccess ? (
              <Button variant="secondary" onClick={onGoAdmin}>
                {tx('Open Admin Dashboard', 'Vào dashboard admin')}
              </Button>
            ) : null}
            <span className="rounded-full border-base bg-cream px-3 py-2 text-xs text-stone">
              {stats.totalCinemas || 0} {tx('cinemas online', 'rạp đang mở')}
            </span>
            <span className="rounded-full border-base bg-cream px-3 py-2 text-xs text-stone">
              {stats.todayShowtimes || 0} {tx('showtimes today', 'suất chiếu hôm nay')}
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx('Now Showing', 'Đang chiếu')}</p>
              <p className="text-sm text-charcoal">
                {stats.totalNowShowing || 0} {tx('movies', 'phim')}
              </p>
            </article>
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx('Coming Soon', 'Sắp chiếu')}</p>
              <p className="text-sm text-charcoal">
                {stats.totalComingSoon || 0} {tx('movies', 'phim')}
              </p>
            </article>
            <article className="rounded-md border-base bg-cream px-3 py-2">
              <p className="section-label mb-1">{tx("Today's Schedule", 'Lịch chiếu hôm nay')}</p>
              <p className="text-sm text-charcoal">
                {stats.todayShowtimes || 0} {tx('sessions', 'suất')}
              </p>
            </article>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-3 bg-cream p-5 md:p-6">
          {/* Audience Pick */}
          {audiencePick && (
            <article className="surface-card flex items-center justify-between p-3">
              <div>
                <p className="section-label mb-1">{tx('Audience Pick', 'Lựa chọn khán giả')}</p>
                <p className="movie-title text-lg">{audiencePick.title}</p>
              </div>
              <span className="rounded-full border-base bg-gold px-2.5 py-1 text-xs text-charcoal">
                {audiencePick.genre || '—'}
              </span>
            </article>
          )}

          {/* Upcoming showtimes today */}
          <article className="surface-card p-3">
            <p className="section-label mb-2">{tx('Upcoming Today', 'Sắp chiếu hôm nay')}</p>
            <div className="space-y-2">
              {upcomingShowtimes.length > 0 ? (
                upcomingShowtimes.map((showtime) => (
                  <div
                    key={showtime.id}
                    className="flex items-center justify-between rounded-md border-base bg-paper px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="movie-title truncate text-base">
                        {formatTime(showtime.publicStartTime)}
                      </p>
                      <p className="truncate text-xs text-stone">
                        {showtime.room?.name || '—'} • {showtime.room?.cinema?.name || '—'}
                      </p>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="truncate text-xs font-medium text-charcoal">
                        {showtime.movie?.title || '—'}
                      </p>
                      <p className="text-[10px] text-stone">{showtime.format}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-md border-base bg-paper px-3 py-3 text-center text-xs text-stone">
                  {tx('No upcoming showtimes today', 'Không có suất chiếu sắp tới hôm nay')}
                </p>
              )}
            </div>
          </article>

          {/* Quick info */}
          <article className="surface-card flex items-center justify-between p-3">
            <div>
              <p className="section-label mb-1">{tx('Fast Booking', 'Đặt vé nhanh')}</p>
              <p className="text-sm text-charcoal">
                {tx(
                  'Browse, select seats, and pay — all in minutes',
                  'Duyệt phim, chọn ghế, thanh toán — chỉ vài phút',
                )}
              </p>
            </div>
            <p className="movie-title text-2xl">⚡</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;

import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function countTotalSessions(showtimesObj) {
  if (!showtimesObj || typeof showtimesObj !== 'object') return 0;
  return Object.values(showtimesObj).reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0);
}

/** @param {{ showtimes: Record<string, Array<any>> }} props */
function ShowtimeList({ showtimes = {} }) {
  const { tx } = useLanguage();
  const safeShowtimes = typeof showtimes === 'object' && !Array.isArray(showtimes) ? showtimes : {};
  const totalSessions = countTotalSessions(safeShowtimes);
  const days = Object.keys(safeShowtimes);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-xl font-bold text-galaxyBlue uppercase tracking-wider">{tx('Showtimes', 'Lịch Chiếu')}</h3>
        <span className="rounded bg-galaxyBg px-3 py-1 text-xs font-bold text-galaxyOrange shadow-sm">{tx(`${totalSessions} sessions`, `${totalSessions} suất`)}</span>
      </div>

      <div className="space-y-6">
        {days.length === 0 ? (
          <p className="text-sm text-stone">{tx('No showtimes available.', 'Chưa có lịch chiếu.')}</p>
        ) : (
          days.map((day) => (
            <article key={day} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-galaxyOrange shadow-sm"></span>
                <p className="text-base font-bold text-ink">
                  {day === 'Today' ? tx('Today', 'Hôm nay') : day === 'Tomorrow' ? tx('Tomorrow', 'Ngày mai') : day}
                </p>
                <span className="ml-auto text-xs font-medium text-stone">{tx(`${safeShowtimes[day].length} slots`, `${safeShowtimes[day].length} khung giờ`)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {safeShowtimes[day].map((showtime) => {
                  const startTime = new Date(showtime.movieStartTime);
                  const timeString = startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <Link
                      key={showtime.id}
                      to={`/booking/${showtime.id}/seats`}
                      className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all hover:border-galaxyBlue hover:bg-galaxyBlue shadow-sm"
                    >
                      <span className="text-lg font-bold text-galaxyBlue transition-colors group-hover:text-white">{timeString}</span>
                      <span className="text-[10px] font-bold text-stone transition-colors group-hover:text-blue-100">
                        R{showtime.room?.name || showtime.roomId} - {showtime.format?.replace('FORMAT_', '') || showtime.format}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ShowtimeList;


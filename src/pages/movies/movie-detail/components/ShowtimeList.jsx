import { Link } from 'react-router-dom';
import useLanguage from '@/hooks/useLanguage';

function groupByDay(showtimes) {
  return showtimes.reduce((accumulator, item) => {
    const key = item.day || 'Today';

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(item);
    return accumulator;
  }, {});
}

/** @param {{ showtimes: Array<{ id: string, day?: string, time: string, room: string, format: string, availability: string }> }} props */
function ShowtimeList({ showtimes }) {
  const { tx } = useLanguage();
  const groupedShowtimes = groupByDay(showtimes);
  const days = Object.keys(groupedShowtimes);

  return (
    <section className="surface-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="section-label">{tx('Showtimes', 'Suất chiếu')}</p>
        <span className="text-xs text-stone">{tx(`${showtimes.length} sessions`, `${showtimes.length} suất`)}</span>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <article key={day} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="movie-title text-lg">
                {day === 'Today' ? tx('Today', 'Hôm nay') : day === 'Tomorrow' ? tx('Tomorrow', 'Ngày mai') : day}
              </p>
              <span className="text-xs text-stone">{tx(`${groupedShowtimes[day].length} slots`, `${groupedShowtimes[day].length} khung giờ`)}</span>
            </div>

            <div className="space-y-2.5">
              {groupedShowtimes[day].map((showtime) => (
                <Link
                  key={showtime.id}
                  to={`/booking/${showtime.id}/seats`}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border-base px-3 py-2.5 transition-colors hover:border-charcoal"
                >
                  <span className="movie-title text-base">{showtime.time}</span>
                  <span className="text-sm text-charcoal">
                    {showtime.room} - {showtime.format}
                  </span>
                  <span className={`text-xs ${showtime.availability.toLowerCase().includes('few') ? 'text-rose' : 'text-success-green'}`}>
                    {showtime.availability}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ShowtimeList;


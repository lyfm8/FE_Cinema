import { useState, useMemo } from "react";
import Spinner from "@/components/ui/Spinner";
import useLanguage from "@/features/i18n/hooks/useLanguage";

function countTotalSessions(showtimesObj) {
  if (!showtimesObj || typeof showtimesObj !== "object") return 0;
  return Object.values(showtimesObj).reduce(
    (total, arr) => total + (Array.isArray(arr) ? arr.length : 0),
    0,
  );
}

/**
 * @param {{
 *   showtimes: Record<string, Array<any>>,
 *   loading?: boolean,
 *   error?: string | null,
 *   onSelectShowtime?: (showtime: any) => void
 * }} props
 */
function ShowtimeList({ showtimes = {}, loading = false, error = null, onSelectShowtime }) {
  const { tx } = useLanguage();
  const safeShowtimes =
    typeof showtimes === "object" && !Array.isArray(showtimes) ? showtimes : {};
    
  // Extract all unique cinemas
  const cinemas = useMemo(() => {
    const map = new Map();
    Object.values(safeShowtimes).flat().forEach(st => {
      if (st.room?.cinema) {
        map.set(st.room.cinema.id, st.room.cinema);
      }
    });
    return Array.from(map.values());
  }, [safeShowtimes]);

  const [selectedCinemaId, setSelectedCinemaId] = useState("");

  // Auto-select first cinema if not selected
  useMemo(() => {
    if (cinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(String(cinemas[0].id));
    }
  }, [cinemas, selectedCinemaId]);

  // Filter showtimes by selected cinema
  const filteredShowtimes = useMemo(() => {
    if (!selectedCinemaId) return {};
    const filtered = {};
    Object.keys(safeShowtimes).forEach(day => {
      const slots = safeShowtimes[day].filter(st => String(st.room?.cinemaId || st.room?.cinema?.id) === selectedCinemaId);
      if (slots.length > 0) {
        filtered[day] = slots;
      }
    });
    return filtered;
  }, [safeShowtimes, selectedCinemaId]);

  const totalSessions = countTotalSessions(filteredShowtimes);
  const days = Object.keys(filteredShowtimes);

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold uppercase tracking-wider text-galaxyBlue">
            {tx("Showtimes", "Lịch chiếu")}
          </h3>
          <span className="rounded bg-galaxyBg px-3 py-1 text-xs font-bold text-galaxyOrange shadow-sm">
            {tx(`${totalSessions} sessions`, `${totalSessions} suất`)}
          </span>
        </div>

        {cinemas.length > 0 && (
          <select 
            className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-ink shadow-sm focus:border-galaxyBlue focus:outline-none focus:ring-1 focus:ring-galaxyBlue"
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
          >
            {cinemas.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-cream p-4 text-sm text-stone">
          <Spinner />
          <span>{tx("Loading showtimes...", "Đang tải lịch chiếu...")}</span>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-lg border border-rose bg-rose/10 p-4 text-sm text-rose">
          {tx(
            "Cannot load showtimes right now. Please refresh later.",
            "Không tải được lịch chiếu lúc này. Vui lòng thử lại sau.",
          )}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-6">
          {days.length === 0 ? (
            <p className="text-sm text-stone">
              {tx("No showtimes available.", "Chưa có lịch chiếu.")}
            </p>
          ) : (
            days.map((day) => (
              <article key={day} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1.5 rounded-full bg-galaxyOrange shadow-sm" />
                  <p className="text-base font-bold text-ink">
                    {day === "Today"
                      ? tx("Today", "Hôm nay")
                      : day === "Tomorrow"
                        ? tx("Tomorrow", "Ngày mai")
                        : day}
                  </p>
                  <span className="ml-auto text-xs font-medium text-stone">
                    {tx(
                      `${filteredShowtimes[day].length} slots`,
                      `${filteredShowtimes[day].length} khung giờ`,
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {filteredShowtimes[day].map((showtime) => {
                    const startTime = new Date(
                      showtime.movieStartTime || showtime.publicStartTime,
                    );
                    const timeString = startTime.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <button
                        key={showtime.id}
                        type="button"
                        onClick={() => onSelectShowtime?.(showtime)}
                        disabled={typeof onSelectShowtime !== "function"}
                        className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-galaxyBlue hover:bg-galaxyBlue disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="text-lg font-bold text-galaxyBlue transition-colors group-hover:text-white">
                          {timeString}
                        </span>
                        <span className="text-[10px] font-bold text-stone transition-colors group-hover:text-blue-100">
                          R{showtime.room?.name || showtime.roomId} -{" "}
                          {showtime.format?.replace("FORMAT_", "") || showtime.format}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}

export default ShowtimeList;

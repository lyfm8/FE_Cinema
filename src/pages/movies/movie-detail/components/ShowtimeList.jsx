import { useState, useMemo, useRef, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/shared/Pagination";
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
  const safeShowtimes = useMemo(
    () =>
      typeof showtimes === "object" && !Array.isArray(showtimes)
        ? showtimes
        : {},
    [showtimes],
  );
    
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  // Auto-select first cinema if not selected
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinemaId) {
      setSelectedCinemaId(String(cinemas[0].id));
      setCurrentPage(1);
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

  // Reset page when cinema changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCinemaId]);

  const totalSessions = countTotalSessions(filteredShowtimes);
  const days = Object.keys(filteredShowtimes);

  // Pagination logic
  const itemsPerPage = 7;
  const totalPages = Math.ceil(days.length / itemsPerPage);
  const paginatedDays = days.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-3 text-sm font-semibold text-ink shadow-sm transition-all hover:border-galaxyBlue hover:shadow-md focus:outline-none focus:ring-2 focus:ring-galaxyBlue/30"
            >
              <svg className="w-4 h-4 text-galaxyBlue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="max-w-[180px] truncate">
                {cinemas.find(c => String(c.id) === selectedCinemaId)?.name || tx("Select cinema", "Chọn rạp")}
              </span>
              <svg
                className={`w-4 h-4 text-stone transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 z-30 mt-1 min-w-[100%] rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
                style={{ animation: "dropdown-in 0.15s ease-out" }}
              >
                {cinemas.map(c => {
                  const isActive = String(c.id) === selectedCinemaId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCinemaId(String(c.id)); setDropdownOpen(false); }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-galaxyBlue/8 font-semibold text-galaxyBlue"
                          : "text-ink hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex-1 truncate">{c.name}</span>
                      {isActive && (
                        <svg className="w-4 h-4 text-galaxyBlue flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
            paginatedDays.map((day) => (
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
                          {showtime.room?.roomType || "Standard"} –{" "}
                          {showtime.format?.replace("FORMAT_", "") || showtime.format}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default ShowtimeList;

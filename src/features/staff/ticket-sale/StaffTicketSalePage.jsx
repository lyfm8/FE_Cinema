import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShowtimesByCinemaId } from '@/features/movies/services/showtimeService';
import { cinemaService } from '@/features/admin/cinemas/services/cinemaService';
import Spinner from '@/components/ui/Spinner';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function StaffTicketSalePage() {
  const { tx } = useLanguage();
  const navigate = useNavigate();
  
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [error, setError] = useState(null);

  const [cinemaShowtimes, setCinemaShowtimes] = useState([]);
  const [moviesForCinema, setMoviesForCinema] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch cinemas on mount
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoadingCinemas(true);
        const res = await cinemaService.getCinemas({ pageSize: 100 });
        const cinemaList = res.data?.items || res.data || [];
        setCinemas(cinemaList);
        if (cinemaList.length > 0) {
          setSelectedCinemaId(cinemaList[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch cinemas:', err);
        setError(tx('Failed to load cinemas.', 'Không thể tải danh sách rạp.'));
      } finally {
        setLoadingCinemas(false);
      }
    };
    fetchCinemas();
  }, [tx]);

  // Fetch showtimes when cinema changes
  useEffect(() => {
    if (!selectedCinemaId) return;

    const fetchShowtimes = async () => {
      try {
        setLoadingShowtimes(true);
        setSelectedMovieId(null);
        const response = await getShowtimesByCinemaId(selectedCinemaId);
        
        const now = new Date();
        const todayString = now.toISOString().split('T')[0];
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];
        
        const todayShowtimes = response.data?.[todayString] || [];
        const tomorrowShowtimes = response.data?.[tomorrowString] || [];
        const combinedShowtimes = [...todayShowtimes, ...tomorrowShowtimes];
        
        setCinemaShowtimes(combinedShowtimes);

        // Extract unique movies from combined showtimes
        const movieMap = new Map();
        combinedShowtimes.forEach(st => {
          if (st.movie && !movieMap.has(st.movie.id)) {
            movieMap.set(st.movie.id, st.movie);
          }
        });
        setMoviesForCinema(Array.from(movieMap.values()));
      } catch (err) {
        console.error('Failed to fetch showtimes for cinema:', err);
        setCinemaShowtimes([]);
        setMoviesForCinema([]);
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [selectedCinemaId]);

  const handleSelectMovie = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleSelectShowtime = (showtimeId) => {
    navigate(`/staff/ticket-sale/${showtimeId}/seats`);
  };

  if (loadingCinemas) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Get showtimes for the selected movie
  const selectedMovieShowtimes = cinemaShowtimes.filter(
    st => st.movieId === selectedMovieId
  );

  const now = new Date();
  const todayString = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  const todayList = selectedMovieShowtimes.filter(st => new Date(st.publicStartTime).toISOString().split('T')[0] === todayString);
  const tomorrowList = selectedMovieShowtimes.filter(st => new Date(st.publicStartTime).toISOString().split('T')[0] === tomorrowString);

  const renderShowtimeGroup = (title, list) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="h-5 w-1.5 rounded-full bg-galaxyOrange shadow-sm" />
          <h3 className="text-lg font-bold text-ink">
            {title}
          </h3>
          <span className="ml-auto text-xs font-medium text-stone">
            {tx(`${list.length} slots`, `${list.length} suất`)}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {list.map(st => {
            const startTime = new Date(st.movieStartTime || st.publicStartTime);
            const timeString = startTime.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <button
                key={st.id}
                onClick={() => handleSelectShowtime(st.id)}
                className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-galaxyBlue hover:bg-galaxyBlue"
              >
                <span className="text-lg font-bold text-galaxyBlue transition-colors group-hover:text-white">
                  {timeString}
                </span>
                <span className="text-[10px] font-bold text-stone transition-colors group-hover:text-blue-100 uppercase">
                  {st.room?.roomType || "Standard"} – {st.format?.replace("FORMAT_", "") || st.format || "2D"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container space-y-7 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ink">{tx('Staff Ticket Sale', 'Bán vé tại quầy')}</h1>
          <p className="text-sm text-stone">{tx("Select a cinema and movie to view today's showtimes.", "Chọn rạp và phim để xem suất chiếu hôm nay/ngày mai.")}</p>
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-galaxyBlue focus:ring-1 focus:ring-galaxyBlue"
          >
            {cinemas.map(cinema => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="text-rose text-sm">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Movies List */}
        <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {loadingShowtimes ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : moviesForCinema.length === 0 ? (
            <div className="text-sm text-stone py-4 px-2">
              {tx('No movies have showtimes today at this cinema.', 'Không có phim nào chiếu hôm nay/ngày mai tại rạp này.')}
            </div>
          ) : (
            moviesForCinema.map(movie => (
              <button
                key={movie.id}
                onClick={() => handleSelectMovie(movie.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMovieId === movie.id 
                    ? 'border-galaxyBlue bg-blue-50/50 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-ink truncate">{movie.title}</h3>
                <p className="text-xs text-stone mt-1">{movie.durationMinutes || movie.duration} {tx('min', 'phút')}</p>
              </button>
            ))
          )}
        </div>

        {/* Showtimes */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm min-h-[400px]">
          {!selectedMovieId ? (
            <div className="h-full flex flex-col items-center justify-center text-stone">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p>{tx('Please select a movie from the list.', 'Vui lòng chọn một bộ phim từ danh sách.')}</p>
            </div>
          ) : selectedMovieShowtimes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone">
              <p>{tx('No showtimes available today for this movie.', 'Không có suất chiếu nào trong hôm nay/ngày mai cho phim này.')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {renderShowtimeGroup(tx('Today', 'Hôm nay'), todayList)}
              {renderShowtimeGroup(tx('Tomorrow', 'Ngày mai'), tomorrowList)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffTicketSalePage;

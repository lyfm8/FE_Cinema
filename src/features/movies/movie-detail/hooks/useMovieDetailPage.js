import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '@/features/movies/services/movieService';
import { getShowtimesByMovieId } from '@/features/movies/services/showtimeService';
import { extractMovieItem, normalizeMovieItem } from '@/features/movies/utils/movieAdapter';
import { mockMovies, mockShowtimes } from '@/utils/mockData';

function useMovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [openTrailer, setOpenTrailer] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadMovieDetail() {
      try {
        const [movieResult, showtimeResult] = await Promise.all([
          getMovieById(id),
          getShowtimesByMovieId(id),
        ]);

        if (mounted) {
          const mappedMovie = normalizeMovieItem(extractMovieItem(movieResult));
          setMovie(mappedMovie);
          
          // Format showtimes from backend (which is grouped by date) to flat array for the UI component
          // or we can map it to match what the component expects
          const groupedData = showtimeResult?.data || {};
          let flatShowtimes = [];
          
          Object.keys(groupedData).forEach(dateStr => {
            const date = new Date(dateStr);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let dayLabel = date.toLocaleDateString('vi-VN');
            if (date.toDateString() === today.toDateString()) {
              dayLabel = 'Today';
            } else if (date.toDateString() === tomorrow.toDateString()) {
              dayLabel = 'Tomorrow';
            }
            
            groupedData[dateStr].forEach(st => {
              const timeStr = new Date(st.publicStartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              const formatStr = st.format.replace('FORMAT_', '');
              
              flatShowtimes.push({
                id: st.id,
                day: dayLabel,
                time: timeStr,
                room: st.room?.name || `Phòng ${st.roomId}`,
                format: formatStr,
                availability: 'Nhiều ghế', // Mock since backend doesn't return availability yet
              });
            });
          });
          
          // Fallback to mock showtimes if no real data exists for testing the UI
          if (flatShowtimes.length === 0) {
            flatShowtimes = [
              { id: '1', day: 'Today', time: '14:30', room: 'Phòng 1', format: '2D', availability: 'Nhiều ghế' },
              { id: '2', day: 'Today', time: '18:45', room: 'Phòng 2', format: '3D', availability: 'Sắp hết' },
              { id: '3', day: 'Tomorrow', time: '10:15', room: 'Phòng 1', format: 'IMAX', availability: 'Nhiều ghế' },
              { id: '4', day: 'Tomorrow', time: '20:00', room: 'VIP', format: '2D', availability: 'Nhiều ghế' }
            ];
          }

          setShowtimes(flatShowtimes);
        }
      } catch (err) {
        console.error("Error loading movie detail:", err);
        if (mounted) {
          const fallbackMovie = mockMovies.find((item) => String(item.id) === String(id)) ?? mockMovies[0];
          setMovie(fallbackMovie);
          setShowtimes(mockShowtimes);
        }
      }
    }

    loadMovieDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    movie,
    showtimes,
    openTrailer,
    setOpenTrailer,
  };
}

export default useMovieDetailPage;

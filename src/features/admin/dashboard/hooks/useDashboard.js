import { useEffect, useMemo, useState } from 'react';
import { getBookings } from '@/features/admin/bookings/services/bookingService';
import { cinemaService } from '@/features/admin/cinemas/services/cinemaService';
import { movieService } from '@/features/admin/movies/services/movieService';

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function getSeatCount(booking) {
  return Array.isArray(booking?.seatHolds) ? booking.seatHolds.length : 0;
}

function getResponseArray(response) {
  return Array.isArray(response?.data) ? response.data : [];
}

function getLastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      month: date.toLocaleString('en-US', { month: 'short' }),
      value: 0,
    };
  });
}

function formatBookingRow(booking) {
  return {
    id: booking.bookingCode || booking.id,
    customer: booking.user?.fullName || booking.staff?.fullName || '',
    movie: booking.showtime?.movie?.title || '',
    amount: formatNumber(Number(booking.totalAmount) || 0),
    status: booking.status || '',
  };
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useDashboard(tx) {
  const [bookings, setBookings] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [bookingResponse, cinemaResponse, movieResponse] = await Promise.all([
          getBookings({ page: 1, pageSize: 100 }),
          cinemaService.getCinemas({ page: 1, pageSize: 100 }),
          movieService.getMovies({ page: 1, pageSize: 100 }),
        ]);

        if (isMounted) {
          setBookings(getResponseArray(bookingResponse));
          setCinemas(getResponseArray(cinemaResponse));
          setMovies(getResponseArray(movieResponse));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (isMounted) {
          setBookings([]);
          setCinemas([]);
          setMovies([]);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    const paidBookings = bookings.filter((booking) => booking.status === 'PAID');
    const revenue = paidBookings.reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);
    const tickets = paidBookings.reduce((sum, booking) => sum + getSeatCount(booking), 0);
    const activeMovies = movies.filter((movie) =>
      ['NOW_SHOWING', 'ACTIVE', 'SHOWING'].includes(movie.status),
    ).length || movies.length;

    return [
      { label: tx('Revenue', 'Doanh thu'), value: formatNumber(revenue) },
      { label: tx('Tickets', 'Vé bán ra'), value: formatNumber(tickets) },
      { label: tx('Cinemas', 'Rạp phim'), value: formatNumber(cinemas.length) },
      { label: tx('Active movies', 'Phim đang chiếu'), value: formatNumber(activeMovies) },
    ];
  }, [bookings, cinemas.length, movies, tx]);

  const monthlyRevenue = useMemo(() => {
    const months = getLastSixMonths();
    const monthByKey = new Map(months.map((month) => [month.key, month]));

    bookings
      .filter((booking) => booking.status === 'PAID')
      .forEach((booking) => {
        const date = new Date(booking.createdAt);
        if (Number.isNaN(date.getTime())) return;

        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const month = monthByKey.get(key);
        if (month) {
          month.value += Number(booking.totalAmount) || 0;
        }
      });

    const maxRevenue = Math.max(...months.map((month) => month.value), 0);
    if (maxRevenue === 0) return months.map(({ month }) => ({ month, value: 0 }));

    return months.map(({ month, value }) => ({
      month,
      value: Math.round((value / maxRevenue) * 100),
    }));
  }, [bookings]);

  const recentBookingColumns = useMemo(
    () => [
      { key: 'id', label: tx('Booking ID', 'Mã đặt vé') },
      { key: 'customer', label: tx('Customer', 'Khách hàng') },
      { key: 'movie', label: tx('Movie', 'Phim') },
      { key: 'amount', label: tx('Amount', 'Số tiền') },
      { key: 'status', label: tx('Status', 'Trạng thái') },
    ],
    [tx],
  );

  const recentBookingRows = useMemo(
    () => bookings.slice(0, 5).map(formatBookingRow),
    [bookings],
  );

  return {
    statCards,
    monthlyRevenue,
    recentBookingColumns,
    recentBookingRows,
  };
}

export default useDashboard;

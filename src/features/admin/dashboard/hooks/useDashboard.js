import { useEffect, useMemo, useState } from 'react';
import { getBookings } from '@/features/admin/bookings/services/bookingService';
import { dashboardService } from '@/features/admin/dashboard/services/dashboardService';

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function getResponseArray(response) {
  return Array.isArray(response?.data) ? response.data : [];
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
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [moviePerformance, setMoviePerformance] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, tickets: 0, cinemas: 0, activeMovies: 0 });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [recentBookingResponse, revenueResponse, moviesResponse, summaryResponse] = await Promise.all([
          getBookings({ page: 1, pageSize: 5 }),
          dashboardService.getRevenueStatistics('month'),
          dashboardService.getMoviePerformance(),
          dashboardService.getSummary(),
        ]);

        if (isMounted) {
          setRecentBookings(getResponseArray(recentBookingResponse));
          setRevenueData(getResponseArray(revenueResponse));
          setMoviePerformance(getResponseArray(moviesResponse));
          setSummary(summaryResponse?.data || { revenue: 0, tickets: 0, cinemas: 0, activeMovies: 0 });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (isMounted) {
          setRecentBookings([]);
          setRevenueData([]);
          setMoviePerformance([]);
          setSummary({ revenue: 0, tickets: 0, cinemas: 0, activeMovies: 0 });
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    return [
      { label: tx('Revenue', 'Doanh thu'), value: formatNumber(summary.revenue) },
      { label: tx('Tickets', 'Vé bán ra'), value: formatNumber(summary.tickets) },
      { label: tx('Cinemas', 'Rạp phim'), value: formatNumber(summary.cinemas) },
      { label: tx('Active movies', 'Phim đang chiếu'), value: formatNumber(summary.activeMovies) },
    ];
  }, [summary, tx]);

  const monthlyRevenue = useMemo(() => {
    if (!revenueData || revenueData.length === 0) return [];
    
    // revenueData is expected to be { period: 'YYYY-MM', revenue: number }[]
    const maxRevenue = Math.max(...revenueData.map((item) => item.revenue), 0);
    
    return revenueData.map((item) => {
      // Convert 'YYYY-MM' to short month name 'Jan', 'Feb', etc.
      const [year, monthStr] = item.period.split('-');
      const date = new Date(year, parseInt(monthStr, 10) - 1, 1);
      const month = date.toLocaleString('en-US', { month: 'short' });
      
      return {
        month,
        value: maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0,
      };
    });
  }, [revenueData]);

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
    () => recentBookings.map(formatBookingRow),
    [recentBookings],
  );

  const movieColumns = useMemo(
    () => [
      { key: 'title', label: tx('Movie Title', 'Tên Phim') },
      { key: 'ticketsSold', label: tx('Tickets Sold', 'Vé Đã Bán') },
      { key: 'occupancyRate', label: tx('Occupancy Rate', 'Tỷ Lệ Lấp Đầy') },
      { key: 'revenue', label: tx('Revenue', 'Doanh Thu') },
    ],
    [tx],
  );

  const movieRows = useMemo(
    () => moviePerformance.map((movie) => ({
      id: movie.id,
      title: movie.title,
      ticketsSold: formatNumber(movie.ticketsSold),
      occupancyRate: `${movie.occupancyRate}%`,
      revenue: formatNumber(movie.revenue),
    })),
    [moviePerformance],
  );

  return {
    statCards,
    monthlyRevenue,
    recentBookingColumns,
    recentBookingRows,
    movieColumns,
    movieRows,
  };
}

export default useDashboard;

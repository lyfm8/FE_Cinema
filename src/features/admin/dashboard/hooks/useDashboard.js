import { useMemo } from 'react';
import { mockAdminBookings, mockCinemas, mockMovies } from '@/utils/mockData';

function parseAmount(amountValue) {
  return Number.parseInt(String(amountValue).replaceAll(',', ''), 10) || 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function getSeatCount(seatValue) {
  if (!seatValue) {
    return 0;
  }

  return String(seatValue)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean).length;
}

function formatAverageOccupancy(cinemas) {
  if (cinemas.length === 0) {
    return '0%';
  }

  const total = cinemas.reduce((sum, cinema) => sum + Number.parseInt(cinema.occupancy, 10), 0);
  return `${Math.round(total / cinemas.length)}%`;
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useDashboard(tx) {
  const statCards = useMemo(() => {
    const revenue = mockAdminBookings.reduce((sum, booking) => sum + parseAmount(booking.amount), 0);
    const tickets = mockAdminBookings.reduce((sum, booking) => sum + getSeatCount(booking.seats), 0);
    const occupancy = formatAverageOccupancy(mockCinemas);
    const activeMovies = mockMovies.length;

    return [
      { label: tx('Revenue', 'Doanh thu'), value: formatNumber(revenue) },
      { label: tx('Tickets', 'Vé bán ra'), value: formatNumber(tickets) },
      { label: tx('Occupancy', 'Lấp đầy'), value: occupancy },
      { label: tx('Active movies', 'Phim đang chiếu'), value: formatNumber(activeMovies) },
    ];
  }, [tx]);

  const monthlyRevenue = useMemo(
    () => [
      { month: 'Jan', value: 58 },
      { month: 'Feb', value: 65 },
      { month: 'Mar', value: 61 },
      { month: 'Apr', value: 74 },
      { month: 'May', value: 82 },
      { month: 'Jun', value: 77 },
    ],
    [],
  );

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
    () =>
      mockAdminBookings.slice(0, 5).map((booking) => ({
        id: booking.id,
        customer: booking.customer,
        movie: booking.movie,
        amount: booking.amount,
        status: booking.status,
      })),
    [],
  );

  return {
    statCards,
    monthlyRevenue,
    recentBookingColumns,
    recentBookingRows,
  };
}

export default useDashboard;

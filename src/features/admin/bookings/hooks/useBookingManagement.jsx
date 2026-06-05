import { useEffect, useMemo, useState } from 'react';
import { getBookings } from '@/features/admin/bookings/services/bookingService';

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value) || 0);
}

function formatDateTime(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatSeats(booking) {
  const seatHolds = Array.isArray(booking.seatHolds) ? booking.seatHolds : [];
  return seatHolds
    .map((hold) => {
      const seat = hold.seat;
      if (seat?.row && (seat?.number || seat?.column)) {
        return `${seat.row}${seat.number ?? seat.column}`;
      }
      return hold.seatId ? `#${hold.seatId}` : '';
    })
    .filter(Boolean)
    .join(', ');
}

function normalizeBooking(booking) {
  return {
    id: booking.bookingCode || booking.id,
    customer: booking.user?.fullName || booking.staff?.fullName || '',
    movie: booking.showtime?.movie?.title || '',
    seats: formatSeats(booking),
    amount: formatCurrency(booking.totalAmount),
    status: booking.status || '',
    createdAt: formatDateTime(booking.createdAt),
  };
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useBookingManagement(tx) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        const response = await getBookings({ page: 1, pageSize: 100 });
        const bookings = Array.isArray(response?.data) ? response.data : [];
        if (isMounted) {
          setRows(bookings.map(normalizeBooking));
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
        if (isMounted) {
          setRows([]);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      { key: 'id', label: tx('Booking ID', 'Mã đặt vé') },
      { key: 'customer', label: tx('Customer', 'Khách hàng') },
      { key: 'movie', label: tx('Movie', 'Phim') },
      { key: 'seats', label: tx('Seats', 'Ghế') },
      { key: 'amount', label: tx('Amount', 'Số tiền') },
      { 
        key: 'status', 
        label: tx('Status', 'Trạng thái'),
        render: (value) => {
          const isPaid = value === 'PAID';
          const isPending = value === 'PENDING';
          const isRefund = value === 'REFUND';
          let colorClass = 'bg-gray-100 text-gray-700';
          if (isPaid) colorClass = 'bg-green-100 text-green-700 font-medium';
          if (isPending) colorClass = 'bg-orange-100 text-orange-700 font-medium';
          if (isRefund) colorClass = 'bg-red-100 text-red-700 font-medium';
          
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs tracking-wide ${colorClass}`}>
              {value}
            </span>
          );
        }
      },
      { key: 'createdAt', label: tx('Created At', 'Thời gian tạo') },
    ],
    [tx],
  );

  const summary = useMemo(() => {
    const paidOrders = rows.filter((booking) => booking.status === 'PAID').length;
    const refunds = rows.filter((booking) =>
      ['REFUND', 'REFUNDED', 'CANCELLED'].includes(booking.status),
    ).length;

    return {
      totalToday: rows.length,
      paidOrders,
      refunds,
    };
  }, [rows]);

  return {
    columns,
    rows,
    summary,
  };
}

export default useBookingManagement;

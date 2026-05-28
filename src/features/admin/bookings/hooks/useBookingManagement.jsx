import { useMemo } from 'react';
import { mockAdminBookings } from '@/utils/mockData';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useBookingManagement(tx) {
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

  const rows = useMemo(() => mockAdminBookings, []);

  const summary = useMemo(() => {
    const paidOrders = mockAdminBookings.filter((booking) => booking.status === 'PAID').length;
    const refunds = mockAdminBookings.filter((booking) => booking.status === 'REFUND').length;

    return {
      totalToday: mockAdminBookings.length,
      paidOrders,
      refunds,
    };
  }, []);

  return {
    columns,
    rows,
    summary,
  };
}

export default useBookingManagement;

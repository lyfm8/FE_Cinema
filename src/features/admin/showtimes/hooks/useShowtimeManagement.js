import { useMemo } from 'react';
import { mockShowtimeRows } from '@/utils/mockData';

function getBookedRatio(seatsValue) {
  const [booked, total] = String(seatsValue).split('/').map((value) => Number.parseInt(value, 10));

  if (!total || Number.isNaN(booked) || Number.isNaN(total)) {
    return 0;
  }

  return booked / total;
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useShowtimeManagement(tx) {
  const columns = useMemo(
    () => [
      { key: 'movie', label: tx('Movie', 'Phim') },
      { key: 'cinema', label: tx('Cinema', 'Rạp') },
      { key: 'time', label: tx('Time', 'Giờ') },
      { key: 'room', label: tx('Room', 'Phòng') },
      { key: 'format', label: tx('Format', 'Định dạng') },
      { key: 'seats', label: tx('Booked/Total', 'Đặt/Tổng') },
    ],
    [tx],
  );

  const rows = useMemo(() => mockShowtimeRows, []);

  const summary = useMemo(() => {
    const highDemandSlots = mockShowtimeRows.filter((showtime) => getBookedRatio(showtime.seats) >= 0.6).length;

    return {
      description: tx(
        'Manage movie schedule and monitor seat occupancy per session.',
        'Quản lý lịch chiếu và theo dõi số ghế đã đặt mỗi suất.',
      ),
      sessionCountLabel: tx(`${mockShowtimeRows.length} sessions`, `${mockShowtimeRows.length} suất`),
      highDemandLabel: tx(`${highDemandSlots} high-demand slots`, `${highDemandSlots} suất nhu cầu cao`),
    };
  }, [tx]);

  return {
    columns,
    rows,
    summary,
  };
}

export default useShowtimeManagement;

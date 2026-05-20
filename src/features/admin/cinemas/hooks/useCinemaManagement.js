import { useMemo } from 'react';
import { mockCinemas } from '@/utils/mockData';

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
function useCinemaManagement(tx) {
  const columns = useMemo(
    () => [
      { key: 'name', label: tx('Cinema', 'Rạp') },
      { key: 'city', label: tx('City', 'Thành phố') },
      { key: 'rooms', label: tx('Rooms', 'Phòng chiếu') },
      { key: 'occupancy', label: tx('Occupancy', 'Tỷ lệ lấp đầy') },
      { key: 'manager', label: tx('Manager', 'Quản lý') },
    ],
    [tx],
  );

  const rows = useMemo(
    () =>
      mockCinemas.map((cinema) => ({
        name: cinema.name,
        city: cinema.city,
        rooms: cinema.rooms,
        occupancy: cinema.occupancy,
        manager: cinema.manager,
      })),
    [],
  );

  const summary = useMemo(() => {
    const totalRooms = mockCinemas.reduce((sum, cinema) => sum + cinema.rooms, 0);

    return {
      activeBranches: mockCinemas.length,
      totalRooms,
      averageOccupancy: formatAverageOccupancy(mockCinemas),
    };
  }, []);

  return {
    columns,
    rows,
    summary,
  };
}

export default useCinemaManagement;

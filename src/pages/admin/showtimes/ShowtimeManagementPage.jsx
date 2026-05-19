import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/hooks/useLanguage';
import { mockShowtimeRows } from '@/utils/mockData';

function ShowtimeManagementPage() {
  const { tx } = useLanguage();
  const columns = [
    { key: 'movie', label: tx('Movie', 'Phim') },
    { key: 'cinema', label: tx('Cinema', 'Rạp') },
    { key: 'time', label: tx('Time', 'Giờ') },
    { key: 'room', label: tx('Room', 'Phòng') },
    { key: 'format', label: tx('Format', 'Định dạng') },
    { key: 'seats', label: tx('Booked/Total', 'Đặt/Tổng') },
  ];

  return (
    <div className="space-y-5">
      <p className="section-label eyebrow-row">
        <span className="kicker-dot" />
        {tx('Admin', 'Quản trị')}
      </p>
      <h1 className="text-3xl font-medium text-ink">{tx('Showtime Management', 'Quản lý lịch chiếu')}</h1>

      <section className="surface-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <p className="text-sm text-stone">
          {tx('Manage movie schedule and monitor seat occupancy per session.', 'Quản lý lịch chiếu và theo dõi số ghế đã đặt mỗi suất.')}
        </p>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{tx('5 sessions', '5 suất')}</span>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{tx('2 high-demand slots', '2 suất nhu cầu cao')}</span>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('Schedule Table', 'Bảng lịch chiếu')}</p>
        <DataTable columns={columns} rows={mockShowtimeRows} />
      </section>
    </div>
  );
}

export default ShowtimeManagementPage;


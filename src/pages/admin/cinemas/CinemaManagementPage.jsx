import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useCinemaManagement from '@/features/admin/cinemas/hooks/useCinemaManagement';

function CinemaManagementPage() {
  const { tx } = useLanguage();
  const { columns, rows, summary } = useCinemaManagement(tx);

  return (
    <div className="space-y-5">
      <p className="section-label eyebrow-row">
        <span className="kicker-dot" />
        {tx('Admin', 'Quản trị')}
      </p>
      <h1 className="text-3xl font-medium text-ink">{tx('Cinema Management', 'Quản lý rạp')}</h1>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Active Branches', 'Chi nhánh hoạt động')}</p>
          <p className="movie-title text-xl">{summary.activeBranches}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Total Rooms', 'Tổng số phòng')}</p>
          <p className="movie-title text-xl">{summary.totalRooms}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Average Occupancy', 'Lấp đầy trung bình')}</p>
          <p className="movie-title text-xl">{summary.averageOccupancy}</p>
        </article>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('Branch List', 'Danh sách chi nhánh')}</p>
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
}

export default CinemaManagementPage;

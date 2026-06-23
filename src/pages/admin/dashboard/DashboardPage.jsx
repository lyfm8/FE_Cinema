import StatCard from '@/pages/admin/dashboard/components/StatCard';
import RevenueChart from '@/pages/admin/dashboard/components/RevenueChart';
import RecentBookings from '@/pages/admin/dashboard/components/RecentBookings';
import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useDashboard from '@/features/admin/dashboard/hooks/useDashboard';

function DashboardPage() {
  const { tx } = useLanguage();
  const { 
    statCards, 
    monthlyRevenue, 
    recentBookingColumns, 
    recentBookingRows,
    movieColumns,
    movieRows 
  } = useDashboard(tx);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RevenueChart
          title={tx('Revenue Trend', 'Xu hướng doanh thu')}
          data={monthlyRevenue}
        />
        <RecentBookings
          title={tx('Recent Bookings', 'Đặt vé gần đây')}
          hint={tx('Latest 5 records', '5 bản ghi mới nhất')}
          columns={recentBookingColumns}
          rows={recentBookingRows}
        />
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-label">{tx('Movie Performance', 'Hiệu suất phim')}</p>
        </div>
        <DataTable columns={movieColumns} rows={movieRows} />
      </section>
    </div>
  );
}

export default DashboardPage;

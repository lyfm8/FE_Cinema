import StatCard from '@/pages/admin/dashboard/components/StatCard';
import RevenueChart from '@/pages/admin/dashboard/components/RevenueChart';
import RecentBookings from '@/pages/admin/dashboard/components/RecentBookings';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useDashboard from '@/features/admin/dashboard/hooks/useDashboard';

function DashboardPage() {
  const { tx } = useLanguage();
  const { statCards, monthlyRevenue, recentBookingColumns, recentBookingRows } = useDashboard(tx);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Admin', 'Quản trị')}
        </p>
        <h1 className="text-3xl font-medium text-ink">{tx('Dashboard', 'Tổng quan')}</h1>
      </div>

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
    </div>
  );
}

export default DashboardPage;

import StatCard from '@/pages/admin/dashboard/components/StatCard';
import RevenueChart from '@/pages/admin/dashboard/components/RevenueChart';
import RecentBookings from '@/pages/admin/dashboard/components/RecentBookings';
import useLanguage from '@/hooks/useLanguage';

function DashboardPage() {
  const { tx } = useLanguage();

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
        <StatCard label={tx('Revenue', 'Doanh thu')} value="1,240,000,000" />
        <StatCard label={tx('Tickets', 'Vé bán ra')} value="13,280" />
        <StatCard label={tx('Occupancy', 'Lấp đầy')} value="74%" />
        <StatCard label={tx('Active movies', 'Phim đang chiếu')} value="22" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <RecentBookings />
      </section>
    </div>
  );
}

export default DashboardPage;




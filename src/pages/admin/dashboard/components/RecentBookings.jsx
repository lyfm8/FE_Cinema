import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/hooks/useLanguage';
import { mockAdminBookings } from '@/utils/mockData';

function RecentBookings() {
  const { tx } = useLanguage();
  const columns = [
    { key: 'id', label: tx('Booking ID', 'Mã đặt vé') },
    { key: 'customer', label: tx('Customer', 'Khách hàng') },
    { key: 'movie', label: tx('Movie', 'Phim') },
    { key: 'amount', label: tx('Amount', 'Số tiền') },
    { key: 'status', label: tx('Status', 'Trạng thái') },
  ];

  const rows = mockAdminBookings.slice(0, 5).map((item) => ({
    id: item.id,
    customer: item.customer,
    movie: item.movie,
    amount: item.amount,
    status: item.status,
  }));

  return (
    <article className="surface-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="section-label">{tx('Recent Bookings', 'Đặt vé gần đây')}</p>
        <span className="text-xs text-stone">{tx('Latest 5 records', '5 bản ghi mới nhất')}</span>
      </div>
      <DataTable columns={columns} rows={rows} />
    </article>
  );
}

export default RecentBookings;


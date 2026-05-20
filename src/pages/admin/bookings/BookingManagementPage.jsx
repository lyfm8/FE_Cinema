import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { mockAdminBookings } from '@/utils/mockData';

function BookingManagementPage() {
  const { tx } = useLanguage();
  const columns = [
    { key: 'id', label: tx('Booking ID', 'Mã đặt vé') },
    { key: 'customer', label: tx('Customer', 'Khách hàng') },
    { key: 'movie', label: tx('Movie', 'Phim') },
    { key: 'seats', label: tx('Seats', 'Ghế') },
    { key: 'amount', label: tx('Amount', 'Số tiền') },
    { key: 'status', label: tx('Status', 'Trạng thái') },
    { key: 'createdAt', label: tx('Created At', 'Thời gian tạo') },
  ];

  return (
    <div className="space-y-5">
      <p className="section-label eyebrow-row">
        <span className="kicker-dot" />
        {tx('Admin', 'Quản trị')}
      </p>
      <h1 className="text-3xl font-medium text-ink">{tx('Booking Management', 'Quản lý đặt vé')}</h1>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Total Today', 'Tổng hôm nay')}</p>
          <p className="movie-title text-xl">186</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Paid Orders', 'Đơn đã thanh toán')}</p>
          <p className="movie-title text-xl">159</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Refunds', 'Hoàn tiền')}</p>
          <p className="movie-title text-xl">6</p>
        </article>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('Transaction Feed', 'Nhật ký giao dịch')}</p>
        <DataTable columns={columns} rows={mockAdminBookings} />
      </section>
    </div>
  );
}

export default BookingManagementPage;


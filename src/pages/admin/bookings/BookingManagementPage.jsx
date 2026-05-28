import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useBookingManagement from '@/features/admin/bookings/hooks/useBookingManagement';

function BookingManagementPage() {
  const { tx } = useLanguage();
  const { columns, rows, summary } = useBookingManagement(tx);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Total Today', 'Tổng hôm nay')}</p>
          <p className="movie-title text-xl">{summary.totalToday}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Paid Orders', 'Đơn đã thanh toán')}</p>
          <p className="movie-title text-xl">{summary.paidOrders}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Refunds', 'Hoàn tiền')}</p>
          <p className="movie-title text-xl">{summary.refunds}</p>
        </article>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('Transaction Feed', 'Nhật ký giao dịch')}</p>
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
}

export default BookingManagementPage;

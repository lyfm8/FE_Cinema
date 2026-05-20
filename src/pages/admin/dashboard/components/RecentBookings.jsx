import DataTable from '@/components/shared/DataTable';

/**
 * @param {{
 *  title: string,
 *  hint: string,
 *  columns: Array<{ key: string, label: string }>,
 *  rows: Array<Record<string, string | number>>
 * }} props
 */
function RecentBookings({ title, hint, columns, rows }) {
  return (
    <article className="surface-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="section-label">{title}</p>
        <span className="text-xs text-stone">{hint}</span>
      </div>
      <DataTable columns={columns} rows={rows} />
    </article>
  );
}

export default RecentBookings;

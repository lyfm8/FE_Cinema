import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useUserManagement from '@/features/admin/users/hooks/useUserManagement';

function UserManagementPage() {
  const { tx } = useLanguage();
  const { columns, rows, summary } = useUserManagement(tx);

  return (
    <div className="space-y-5">
      <p className="section-label eyebrow-row">
        <span className="kicker-dot" />
        {tx('Admin', 'Quản trị')}
      </p>
      <h1 className="text-3xl font-medium text-ink">{tx('User Management', 'Quản lý người dùng')}</h1>

      <section className="surface-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <p className="text-sm text-stone">{summary.description}</p>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{summary.userCountLabel}</span>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{summary.lockedCountLabel}</span>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('User Directory', 'Danh bạ người dùng')}</p>
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
}

export default UserManagementPage;

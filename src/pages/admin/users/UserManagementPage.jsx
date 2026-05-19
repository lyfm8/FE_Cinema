import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/hooks/useLanguage';
import { mockUsers } from '@/utils/mockData';

function UserManagementPage() {
  const { tx } = useLanguage();
  const columns = [
    { key: 'name', label: tx('Full Name', 'Họ và tên') },
    { key: 'email', label: tx('Email', 'Email') },
    { key: 'role', label: tx('Role', 'Vai trò') },
    { key: 'status', label: tx('Status', 'Trạng thái') },
    { key: 'joined', label: tx('Joined', 'Ngày tham gia') },
  ];

  return (
    <div className="space-y-5">
      <p className="section-label eyebrow-row">
        <span className="kicker-dot" />
        {tx('Admin', 'Quản trị')}
      </p>
      <h1 className="text-3xl font-medium text-ink">{tx('User Management', 'Quản lý người dùng')}</h1>

      <section className="surface-card grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <p className="text-sm text-stone">
          {tx(
            'Review member access, role assignment, and account status in one place.',
            'Theo dõi quyền truy cập, vai trò và trạng thái tài khoản tại một màn hình.',
          )}
        </p>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{tx('6 users', '6 người dùng')}</span>
        <span className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">{tx('1 locked account', '1 tài khoản bị khóa')}</span>
      </section>

      <section className="surface-card p-4">
        <p className="section-label mb-3">{tx('User Directory', 'Danh bạ người dùng')}</p>
        <DataTable columns={columns} rows={mockUsers} />
      </section>
    </div>
  );
}

export default UserManagementPage;


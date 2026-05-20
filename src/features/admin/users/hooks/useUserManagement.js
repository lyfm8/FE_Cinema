import { useMemo } from 'react';
import { mockUsers } from '@/utils/mockData';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useUserManagement(tx) {
  const columns = useMemo(
    () => [
      { key: 'name', label: tx('Full Name', 'Họ và tên') },
      { key: 'email', label: tx('Email', 'Email') },
      { key: 'role', label: tx('Role', 'Vai trò') },
      { key: 'status', label: tx('Status', 'Trạng thái') },
      { key: 'joined', label: tx('Joined', 'Ngày tham gia') },
    ],
    [tx],
  );

  const rows = useMemo(() => mockUsers, []);

  const summary = useMemo(() => {
    const lockedAccounts = mockUsers.filter((user) => user.status === 'LOCKED').length;

    return {
      description: tx(
        'Review member access, role assignment, and account status in one place.',
        'Theo dõi quyền truy cập, vai trò và trạng thái tài khoản tại một màn hình.',
      ),
      userCountLabel: tx(`${mockUsers.length} users`, `${mockUsers.length} người dùng`),
      lockedCountLabel: tx(`${lockedAccounts} locked account`, `${lockedAccounts} tài khoản bị khóa`),
    };
  }, [tx]);

  return {
    columns,
    rows,
    summary,
  };
}

export default useUserManagement;

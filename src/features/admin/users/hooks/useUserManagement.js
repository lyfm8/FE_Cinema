import { useEffect, useMemo, useState } from 'react';
import { getUsers } from '@/features/admin/users/services/userService';

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('vi-VN');
}

function normalizeUser(user) {
  return {
    name: user.fullName || user.name || '',
    email: user.email || '',
    role: user.role || '',
    status: user.status || '',
    joined: formatDate(user.createdAt),
  };
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useUserManagement(tx) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const response = await getUsers({ page: 1, pageSize: 100 });
        const users = Array.isArray(response?.data) ? response.data : [];
        if (isMounted) {
          setRows(users.map(normalizeUser));
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        if (isMounted) {
          setRows([]);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const summary = useMemo(() => {
    const lockedAccounts = rows.filter((user) =>
      ['BLOCKED', 'LOCKED'].includes(user.status),
    ).length;

    return {
      description: tx(
        'Review member access, role assignment, and account status in one place.',
        'Theo dõi quyền truy cập, vai trò và trạng thái tài khoản tại một màn hình.',
      ),
      userCountLabel: tx(`${rows.length} users`, `${rows.length} người dùng`),
      lockedCountLabel: tx(`${lockedAccounts} locked account`, `${lockedAccounts} tài khoản bị khóa`),
    };
  }, [rows, tx]);

  return {
    columns,
    rows,
    summary,
  };
}

export default useUserManagement;

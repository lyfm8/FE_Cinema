import DataTable from '@/components/shared/DataTable';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function CinemaTable({ cinemas, deletingId, onEdit, onDelete }) {
  const { tx } = useLanguage();

  const columns = [
    { key: 'id', label: tx('Cinema ID', 'Mã rạp') },
    { key: 'name', label: tx('Cinema Name', 'Tên rạp') },
    { key: 'address', label: tx('Address', 'Địa chỉ') },
    { key: 'phone', label: tx('Phone', 'Số điện thoại') },
    { key: 'email', label: tx('Email', 'Email') },
    { key: 'actions', label: tx('Actions', 'Thao tác') },
  ];

  const rows = cinemas.map((cinema) => ({
    id: cinema.id,
    name: <span className="movie-title text-sm">{cinema.name}</span>,
    address: cinema.address,
    phone: cinema.phone,
    email: cinema.email,
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => onEdit(cinema)}>
          {tx('Edit', 'Sửa')}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => onDelete(cinema)}
          disabled={deletingId === cinema.id}
        >
          {deletingId === cinema.id ? tx('Deleting...', 'Đang xóa...') : tx('Delete', 'Xóa')}
        </Button>
      </div>
    ),
  }));

  return <DataTable columns={columns} rows={rows} />;
}

export default CinemaTable;


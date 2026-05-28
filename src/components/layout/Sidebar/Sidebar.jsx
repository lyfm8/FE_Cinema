import { Link, NavLink } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/movies', label: 'Movies' },
  { to: '/admin/cinemas', label: 'Cinemas' },
  { to: '/admin/rooms', label: 'Rooms' },
  { to: '/admin/ticket-prices', label: 'Ticket Prices' },
  { to: '/admin/showtimes', label: 'Showtimes' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
];

function Sidebar() {
  const { tx } = useLanguage();

  return (
    <aside className="h-screen w-64 border-r border-gray-100 bg-white p-4 shadow-sm flex flex-col">
      <div className="mb-6 pb-6 px-2 mt-2 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{tx('Admin Panel', 'Bảng quản trị')}</p>
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f26b38] text-white font-bold text-lg shadow-md shadow-[#f26b38]/20 transition-transform group-hover:scale-105">
            C
          </div>
          <div className="leading-tight">
            <p className="font-sans text-xl font-bold tracking-wide text-[#034ea2] m-0">CINEPLEX</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 m-0">{tx('Online Cinema', 'Rạp phim online')}</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2.5 transition-all duration-200 text-sm ${
                isActive 
                  ? 'bg-[#034ea2]/10 text-[#034ea2] font-bold' 
                  : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-charcoal'
              }`
            }
          >
            {tx(
              link.label,
              link.label === 'Dashboard'
                ? 'Tổng quan'
                : link.label === 'Movies'
                  ? 'Phim'
                  : link.label === 'Cinemas'
                    ? 'Rạp'
                    : link.label === 'Rooms'
                      ? 'Phòng'
                      : link.label === 'Ticket Prices'
                        ? 'Giá vé'
                      : link.label === 'Showtimes'
                        ? 'Lịch chiếu'
                        : link.label === 'Bookings'
                          ? 'Đặt vé'
                          : 'Người dùng',
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

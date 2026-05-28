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
    <aside className="h-screen w-60 border-base border-r bg-paper p-4">
      <div className="mb-6 px-1">
        <p className="section-label mb-3">{tx('Admin Panel', 'Bảng quản trị')}</p>
        <Link to="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f26b38] text-white font-bold text-lg">
            C
          </div>
          <div className="leading-tight">
            <p className="movie-title text-xl text-[#034ea2] tracking-wide m-0">CINEPLEX</p>
            <p className="text-[10px] uppercase tracking-widest text-stone m-0">{tx('Online Cinema', 'Rạp phim online')}</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 transition-colors ${isActive ? 'border-selected bg-cream text-ink' : 'border-base text-stone hover:border-charcoal'}`
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

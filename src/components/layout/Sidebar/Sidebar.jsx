import { Link, NavLink } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/movies', label: 'Movies' },
  { to: '/admin/cinemas', label: 'Cinemas' },
  { to: '/admin/rooms', label: 'Rooms' },
  { to: '/admin/showtimes', label: 'Showtimes' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
];

function Sidebar() {
  const { tx } = useLanguage();

  return (
    <aside className="h-screen w-60 border-base border-r bg-paper p-4">
      <div className="mb-6 border-base rounded-lg bg-cream p-3">
        <p className="section-label mb-1">{tx('Admin Panel', 'Bảng quản trị')}</p>
        <p className="movie-title text-lg tracking-[0.08em]">CINEPLEX</p>
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
                      : link.label === 'Showtimes'
                        ? 'Lịch chiếu'
                        : link.label === 'Bookings'
                          ? 'Đặt vé'
                          : 'Người dùng',
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-ash pt-4">
        <Link
          to="/"
          className="block rounded-md border-base px-3 py-2 text-sm text-stone transition-colors hover:border-charcoal"
        >
          {tx('Back to User Site', 'Về trang người dùng')}
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;

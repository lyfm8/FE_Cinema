import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import NotificationBell from '@/components/shared/NotificationBell/NotificationBell';

function Header() {
  const { isAuthenticated, signOut, user } = useAuth();
  const { isVietnamese, toggleLanguage, tx } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navClassName = ({ isActive }) =>
    `relative pb-1 text-sm font-medium transition-colors ${
      isActive ? 'text-galaxyBlue after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-galaxyOrange' : 'text-stone hover:text-galaxyBlue'
    }`;

  const displayName = user?.fullName || user?.email?.split('@')[0] || tx('User', 'Người dùng');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="border-base border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f26b38] text-white font-bold text-lg">
                C
              </div>
              <div className="leading-tight">
                <p className="movie-title text-xl text-[#034ea2] tracking-wide m-0">CINEPLEX</p>
                <p className="text-[10px] uppercase tracking-widest text-stone m-0">{tx('Online Cinema', 'Rạp phim online')}</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <NavLink to="/" end className={navClassName}>
                {tx('Home', 'Trang chủ')}
              </NavLink>
              <NavLink to="/movies" className={navClassName}>
                {tx('Movies', 'Phim')}
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-md border-base px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-gray-50 hover:text-galaxyBlue"
              aria-label={tx('Switch language', 'Chuyển ngôn ngữ')}
            >
              {isVietnamese ? 'VI / EN' : 'EN / VI'}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-galaxyBlue/30 shadow-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#034ea2] text-xs font-bold text-white">
                    {initial}
                  </div>
                  <span className="text-sm font-medium text-ink max-w-[100px] truncate">{displayName}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-ink truncate">{displayName}</p>
                      <p className="text-xs text-stone mt-0.5 capitalize">{user?.role?.toLowerCase() || tx('Member', 'Thành viên')}</p>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-ink hover:bg-gray-50 hover:text-galaxyBlue transition-colors"
                      >
                        {tx('Admin Dashboard', 'Quản trị hệ thống')}
                      </Link>
                    )}
                    <Link 
                      to="/booking-history" 
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-ink hover:bg-gray-50 hover:text-galaxyBlue transition-colors"
                    >
                      {tx('Booking History', 'Lịch sử đặt vé')}
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-ink hover:bg-gray-50 hover:text-galaxyBlue transition-colors"
                    >
                      {tx('My Profile', 'Hồ sơ của tôi')}
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={() => { setShowDropdown(false); signOut(); }}
                      className="w-full text-left px-4 py-2 text-sm text-rose hover:bg-red-50 transition-colors font-medium"
                    >
                      {tx('Logout', 'Đăng xuất')}
                    </button>
                  </div>
                )}
              </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-stone transition-colors hover:text-galaxyBlue">
                  {tx('Login', 'Đăng nhập')}
                </Link>
                <Link to="/register" className="rounded-md bg-[#f26b38] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#fb9440]">
                  {tx('Register', 'Đăng ký')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;




import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import useAuth from '@/features/auth/hooks/useAuth';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function AdminLayout() {
  const { signOut, user } = useAuth();
  const { isVietnamese, toggleLanguage, tx } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.fullName || user?.email?.split('@')[0] || tx('User', 'Người dùng');
  const initial = displayName.charAt(0).toUpperCase();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return tx('Dashboard', 'Tổng quan');
    if (path.startsWith('/admin/movies')) return tx('Movie Management', 'Quản lý phim');
    if (path.startsWith('/admin/cinemas')) return tx('Cinema Management', 'Quản lý rạp');
    if (path.startsWith('/admin/rooms')) return tx('Room Management', 'Quản lý phòng');
    if (path.startsWith('/admin/ticket-prices')) return tx('Ticket Prices', 'Quản lý giá vé');
    if (path.startsWith('/admin/showtimes')) return tx('Showtimes', 'Quản lý lịch chiếu');
    if (path.startsWith('/admin/bookings')) return tx('Bookings', 'Quản lý đặt vé');
    if (path.startsWith('/admin/users')) return tx('User Management', 'Quản lý người dùng');
    return tx('Admin Panel', 'Bảng quản trị');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 gap-4 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-ink">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-md border-base px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-gray-50 hover:text-[#034ea2]"
            aria-label={tx('Switch language', 'Chuyển ngôn ngữ')}
          >
            {isVietnamese ? 'VI / EN' : 'EN / VI'}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#034ea2]/30 shadow-sm"
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
                <Link 
                  to="/" 
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 text-sm text-ink hover:bg-gray-50 hover:text-[#034ea2] transition-colors"
                >
                  {tx('Back to Website', 'Về trang người dùng')}
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 text-sm text-ink hover:bg-gray-50 hover:text-[#034ea2] transition-colors"
                >
                  {tx('My Profile', 'Hồ sơ của tôi')}
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <button 
                  onClick={() => { setShowDropdown(false); signOut(); }}
                  className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-red-50 transition-colors font-medium"
                >
                  {tx('Logout', 'Đăng xuất')}
                </button>
              </div>
            )}
          </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

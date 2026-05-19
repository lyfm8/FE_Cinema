import { Link, NavLink } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import useLanguage from '@/hooks/useLanguage';
import Button from '@/components/ui/Button';

function Header() {
  const { isAuthenticated, signOut, user } = useAuth();
  const { isVietnamese, toggleLanguage, tx } = useLanguage();

  const navClassName = ({ isActive }) =>
    `relative pb-1 text-sm transition-colors ${
      isActive ? 'text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-ink' : 'text-stone'
    }`;

  return (
    <header className="border-base border-b bg-paper">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="kicker-dot" />
            <div className="leading-tight">
              <p className="movie-title text-base tracking-[0.14em]">CINEPLEX</p>
              <p className="text-[10px] uppercase tracking-widest text-stone">{tx('Cinema Management', 'Quản lý rạp phim')}</p>
            </div>
          </Link>

          <nav className="flex items-center gap-5">
            <NavLink to="/" end className={navClassName}>
              {tx('Home', 'Trang chủ')}
            </NavLink>
            <NavLink to="/movies" className={navClassName}>
              {tx('Movies', 'Phim')}
            </NavLink>
            <NavLink to="/profile" className={navClassName}>
              {tx('Profile', 'Tài khoản')}
            </NavLink>
          </nav>

          <div className="flex min-w-36 items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-md border-base px-3 py-2 text-xs text-stone transition-colors hover:bg-cream"
              aria-label={tx('Switch language', 'Chuyển ngôn ngữ')}
            >
              {isVietnamese ? 'VI / EN' : 'EN / VI'}
            </button>
            {isAuthenticated ? (
              <>
                <span className="hidden rounded-full border-base bg-cream px-2.5 py-1 text-xs text-stone md:inline-flex">
                  {user?.name ?? tx('Member', 'Thành viên')}
                </span>
                <Button variant="ghost" onClick={signOut}>
                  {tx('Logout', 'Đăng xuất')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md border-base px-3 py-2 text-sm text-stone transition-colors hover:bg-cream">
                  {tx('Login', 'Đăng nhập')}
                </Link>
                <Link to="/register" className="rounded-md border-base border-charcoal bg-ink px-3 py-2 text-sm text-paper transition-colors hover:bg-charcoal">
                  {tx('Register', 'Đăng ký')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;




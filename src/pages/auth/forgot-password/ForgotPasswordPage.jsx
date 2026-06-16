import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useForgotPasswordPage from '@/features/auth/forgot-password/hooks/useForgotPasswordPage';

function ForgotPasswordPage() {
  const { tx } = useLanguage();
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    message,
    error,
    loading,
    countdown,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    handleSendOtp,
    handleResetPassword,
  } = useForgotPasswordPage(tx);

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative bg-charcoal items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1779952745/cinema_auth_bg_xqupgd.jpg" 
            className="w-full h-full object-cover opacity-80 animate-slow-pan" 
            alt="Cinema Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-[#111111]/10"></div>
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <p className="text-[#f26b38] font-bold tracking-widest uppercase mb-4 text-sm">{tx('Welcome Back', 'Chào mừng quay lại')}</p>
          <h1 className="text-5xl font-black mb-6 tracking-tight">CINEPLEX</h1>
          <p className="text-lg text-blue-100 leading-relaxed font-medium">
            {tx(
              'Sign in to continue booking, track ticket history, and manage your favorite cinemas in one place.',
              'Đăng nhập để tiếp tục đặt vé, theo dõi lịch sử và quản lý rạp yêu thích tại một nơi.',
            )}
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50/50">
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="surface-card w-full max-w-md p-6">
          <p className="section-label mb-2">{tx('Account', 'Tài khoản')}</p>
          <h1 className="mb-6 text-xl font-medium text-ink">{tx('Forgot password', 'Quên mật khẩu')}</h1>

          {step === 1 && (
            <div className="mb-4">
              <Input
                name="email"
                label={tx('Email', 'Email')}
                type="email"
                value={email}
                placeholder="name@email.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mb-4">
              <div>
                <Input
                  name="otp"
                  label={tx('OTP Code', 'Mã OTP')}
                  type="text"
                  value={otp}
                  placeholder={tx('Enter 6-digit OTP', 'Nhập mã OTP 6 số')}
                  onChange={(event) => setOtp(event.target.value)}
                  required
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || countdown > 0}
                    className="text-xs font-medium text-primary hover:underline disabled:text-stone disabled:no-underline"
                  >
                    {countdown > 0 
                      ? tx(`Resend in ${countdown}s`, `Gửi lại sau ${countdown}s`) 
                      : tx('Resend OTP', 'Gửi lại mã OTP')}
                  </button>
                </div>
              </div>
              <Input
                name="newPassword"
                label={tx('New Password', 'Mật khẩu mới')}
                type="password"
                value={newPassword}
                placeholder={tx('Enter new password', 'Nhập mật khẩu mới')}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <Input
                name="confirmPassword"
                label={tx('Confirm Password', 'Xác nhận mật khẩu mới')}
                type="password"
                value={confirmPassword}
                placeholder={tx('Re-enter new password', 'Nhập lại mật khẩu mới')}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          )}

          {message ? <p className="mb-4 text-xs text-success-green">{message}</p> : null}
          {error ? <p className="mb-4 text-xs text-rose">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? tx('Processing...', 'Đang xử lý...') 
              : step === 1 
                ? tx('Send OTP', 'Gửi mã OTP') 
                : tx('Reset Password', 'Đổi mật khẩu')}
          </Button>

          <div className="mt-6 pt-4 border-t border-stone-200/50 text-center">
            <Link to="/" className="text-sm text-stone hover:text-ink transition-colors inline-flex items-center justify-center gap-2">
              <span>&larr;</span> {tx('Back to Home', 'Quay về trang chủ')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

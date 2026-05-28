import LoginForm from '@/pages/auth/login/LoginForm';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useLoginPage from '@/features/auth/login/hooks/useLoginPage';

function LoginPage() {
  const { tx } = useLanguage();
  const {
    formData,
    fieldErrors,
    loading,
    apiError,
    handleChange,
    handleSubmit,
  } = useLoginPage(tx);

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left panel - Image & Welcome text */}
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

      {/* Right panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50/50">
        <LoginForm
          formData={formData}
          fieldErrors={fieldErrors}
          loading={loading}
          apiError={apiError}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default LoginPage;

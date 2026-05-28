import RegisterForm from "@/pages/auth/register/RegisterForm";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useRegisterPage from "@/features/auth/register/hooks/useRegisterPage";

function RegisterPage() {
  const { tx } = useLanguage();
  const {
    formData,
    loading,
    sendingOtp,
    otpSent,
    message,
    error,
    handleChange,
    handleSendOtp,
    handleSubmit,
  } = useRegisterPage(tx);

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
          <p className="text-[#f26b38] font-bold tracking-widest uppercase mb-4 text-sm">
            {tx("New Member", "Thành viên mới")}
          </p>
          <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">
            {tx("Create your cinema account", "Tạo tài khoản cinema")}
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed font-medium">
            {tx(
              "Register now to get faster checkout, seat history, and personalized recommendations from ongoing shows.",
              "Đăng ký ngay để thanh toán nhanh hơn, xem lịch sử ghế và nhận gợi ý phù hợp.",
            )}
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50/50">
        <RegisterForm
          formData={formData}
          loading={loading}
          sendingOtp={sendingOtp}
          otpSent={otpSent}
          message={message}
          error={error}
          onChange={handleChange}
          onSendOtp={handleSendOtp}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default RegisterPage;

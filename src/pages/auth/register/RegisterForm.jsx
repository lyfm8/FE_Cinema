import { Link } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useLanguage from "@/features/i18n/hooks/useLanguage";

/**
 * @param {{
 *  formData: { name: string, email: string, otp: string, password: string, confirmPassword: string },
 *  loading: boolean,
 *  sendingOtp: boolean,
 *  otpSent: boolean,
 *  message: string,
 *  error: string,
 *  onChange: (field: string, value: string) => void,
 *  onSendOtp: () => void,
 *  onSubmit: (event: import('react').FormEvent<HTMLFormElement>) => void
 * }} props
 */
function RegisterForm({
  formData,
  loading,
  sendingOtp,
  otpSent,
  message,
  error,
  onChange,
  onSendOtp,
  onSubmit,
}) {
  const { tx } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="surface-card w-full max-w-md p-6">
      <p className="section-label mb-2">{tx("Account", "Tài khoản")}</p>
      <h1 className="mb-6 text-xl font-medium text-ink">
        {tx("Register", "Đăng ký")}
      </h1>

      <div className="mb-4">
        <Input
          name="name"
          label={tx("Full name", "Họ và tên")}
          value={formData.name}
          placeholder={tx("Your full name", "Nhập họ và tên")}
          onChange={(event) => onChange("name", event.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          name="email"
          label={tx("Email", "Email")}
          type="email"
          value={formData.email}
          placeholder="name@email.com"
          onChange={(event) => onChange("email", event.target.value)}
        />
      </div>

      <div className="mb-4">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onSendOtp}
          disabled={loading || sendingOtp}
        >
          {sendingOtp
            ? tx("Sending OTP...", "Đang gửi OTP...")
            : otpSent
              ? tx("Resend OTP", "Gửi lại OTP")
              : tx("Send OTP", "Gửi OTP")}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          name="otp"
          label={tx("OTP Code", "Mã OTP")}
          value={formData.otp}
          placeholder={tx("Enter OTP from email", "Nhập OTP từ email")}
          onChange={(event) => onChange("otp", event.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          name="password"
          label={tx("Password", "Mật khẩu")}
          type="password"
          value={formData.password}
          placeholder="******"
          onChange={(event) => onChange("password", event.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          name="confirmPassword"
          label={tx("Confirm password", "Xác nhận mật khẩu")}
          type="password"
          value={formData.confirmPassword}
          placeholder="******"
          onChange={(event) => onChange("confirmPassword", event.target.value)}
        />
      </div>

      {message ? (
        <p className="mb-4 text-xs text-success-green">{message}</p>
      ) : null}
      {error ? <p className="mb-4 text-xs text-rose">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? tx("Submitting...", "Đang gửi...")
          : tx("Create account", "Tạo tài khoản")}
      </Button>

      <p className="mt-4 text-right text-xs text-stone">
        {tx("Already have an account?", "Đã có tài khoản?")}{" "}
        <Link to="/login" className="text-ink underline">
          {tx("Login", "Đăng nhập")}
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;

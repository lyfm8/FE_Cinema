import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useForgotPasswordPage from '@/features/auth/forgot-password/hooks/useForgotPasswordPage';

function ForgotPasswordPage() {
  const { tx } = useLanguage();
  const {
    email,
    message,
    error,
    loading,
    setEmail,
    handleSubmit,
  } = useForgotPasswordPage(tx);

  return (
    <div className="page-container flex items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="surface-card w-full max-w-md p-6">
        <p className="section-label mb-2">{tx('Account', 'Tài khoản')}</p>
        <h1 className="mb-6 text-xl font-medium text-ink">{tx('Forgot password', 'Quên mật khẩu')}</h1>

        <div className="mb-4">
          <Input
            name="email"
            label={tx('Email', 'Email')}
            type="email"
            value={email}
            placeholder="name@email.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {message ? <p className="mb-4 text-xs text-success-green">{message}</p> : null}
        {error ? <p className="mb-4 text-xs text-rose">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? tx('Sending...', 'Đang gửi...') : tx('Send reset link', 'Gửi liên kết đặt lại')}
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;

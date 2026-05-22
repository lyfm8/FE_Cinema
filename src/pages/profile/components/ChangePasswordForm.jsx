import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function ChangePasswordForm() {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4">
      <p className="section-label mb-3">{tx('Security', 'Bảo mật')}</p>
      <p className="text-sm text-stone">
        {tx(
          'Password reset is handled via OTP for your account security.',
          'Đổi mật khẩu được thực hiện qua OTP để đảm bảo an toàn tài khoản.',
        )}
      </p>
      <div className="mt-4">
        <Link to="/forgot-password">
          <Button>{tx('Reset password with OTP', 'Đặt lại mật khẩu bằng OTP')}</Button>
        </Link>
      </div>
    </section>
  );
}

export default ChangePasswordForm;


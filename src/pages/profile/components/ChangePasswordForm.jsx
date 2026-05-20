import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useChangePasswordForm from '@/features/profile/hooks/useChangePasswordForm';

function ChangePasswordForm() {
  const { tx } = useLanguage();
  const { password, setPassword, handleSubmit } = useChangePasswordForm();

  return (
    <form onSubmit={handleSubmit} className="surface-card p-4">
      <p className="section-label mb-3">{tx('Security', 'Bảo mật')}</p>
      <Input
        label={tx('New password', 'Mật khẩu mới')}
        type="password"
        value={password}
        placeholder="******"
        onChange={(event) => setPassword(event.target.value)}
      />
      <p className="mt-2 text-xs text-stone">
        {tx('Use at least 8 characters for better account security.', 'Sử dụng ít nhất 8 ký tự để tăng bảo mật.')}
      </p>
      <div className="mt-4">
        <Button type="submit">{tx('Update password', 'Cập nhật mật khẩu')}</Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;

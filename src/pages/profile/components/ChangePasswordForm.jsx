import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useChangePasswordForm from '@/features/profile/hooks/useChangePasswordForm';

function ChangePasswordForm() {
  const { tx } = useLanguage();
  const { form, loading, message, error, updateField, handleSubmit } = useChangePasswordForm();

  return (
    <section className="surface-card p-4">
      <p className="section-label mb-3">{tx('Security', 'Bảo mật')}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="oldPassword"
          label={tx('Current password', 'Mật khẩu hiện tại')}
          type="password"
          value={form.oldPassword}
          placeholder="******"
          onChange={(event) => updateField('oldPassword', event.target.value)}
        />

        <Input
          name="newPassword"
          label={tx('New password', 'Mật khẩu mới')}
          type="password"
          value={form.newPassword}
          placeholder="******"
          onChange={(event) => updateField('newPassword', event.target.value)}
        />

        <Input
          name="confirmPassword"
          label={tx('Confirm new password', 'Xác nhận mật khẩu mới')}
          type="password"
          value={form.confirmPassword}
          placeholder="******"
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />

        {error ? <p className="text-xs text-rose">{tx(error, error)}</p> : null}
        {message ? <p className="text-xs text-success-green">{message}</p> : null}

        <div className="pt-1">
          <Button type="submit" disabled={loading}>
            {loading ? tx('Saving...', 'Đang lưu...') : tx('Change password', 'Đổi mật khẩu')}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ChangePasswordForm;


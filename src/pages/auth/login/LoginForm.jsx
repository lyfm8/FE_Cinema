import { Link } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/**
 * @param {{
 *  formData: { email: string, password: string },
 *  fieldErrors: Record<string, string>,
 *  loading: boolean,
 *  apiError: string | null,
 *  onChange: (field: string, value: string) => void,
 *  onSubmit: (event: import('react').FormEvent<HTMLFormElement>) => void
 * }} props
 */
function LoginForm({ formData, fieldErrors, loading, apiError, onChange, onSubmit }) {
  const { tx } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="surface-card w-full max-w-md p-6">
      <p className="section-label mb-2">{tx('Account', 'Tài khoản')}</p>
      <h1 className="mb-6 text-xl font-medium text-ink">{tx('Login', 'Đăng nhập')}</h1>

      <div className="mb-4">
        <Input
          name="email"
          label={tx('Email', 'Email')}
          type="email"
          value={formData.email}
          error={fieldErrors.email}
          placeholder="name@email.com"
          onChange={(event) => onChange('email', event.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          name="password"
          label={tx('Password', 'Mật khẩu')}
          type="password"
          value={formData.password}
          error={fieldErrors.password}
          placeholder="******"
          onChange={(event) => onChange('password', event.target.value)}
        />
      </div>

      {apiError ? (
        <p className="mb-4 text-xs text-rose">
          {apiError === 'Login failed.' ? tx('Login failed.', 'Đăng nhập thất bại.') : apiError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? tx('Signing in...', 'Đang đăng nhập...') : tx('Sign in', 'Đăng nhập')}
      </Button>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-stone">
        <Link to="/forgot-password" className="transition-colors hover:text-charcoal">
          {tx('Forgot password?', 'Quên mật khẩu?')}
        </Link>
        <p>
          {tx("Don't have an account?", 'Chưa có tài khoản?')}{' '}
          <Link to="/register" className="text-ink underline">
            {tx('Register', 'Đăng ký')}
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-200/50 text-center">
        <Link to="/" className="text-sm text-stone hover:text-ink transition-colors inline-flex items-center justify-center gap-2">
          <span>&larr;</span> {tx('Back to Home', 'Quay về trang chủ')}
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/pages/auth/login/LoginForm';
import useAuth from '@/features/auth/hooks/useAuth';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { validateLoginForm } from '@/utils/validators';

function LoginPage() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateLoginForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors({
        email:
          errors.email === 'Email is required.'
            ? tx('Email is required.', 'Email là bắt buộc.')
            : errors.email === 'Email format is invalid.'
              ? tx('Email format is invalid.', 'Định dạng email không hợp lệ.')
              : '',
        password:
          errors.password === 'Password is required.'
            ? tx('Password is required.', 'Mật khẩu là bắt buộc.')
            : errors.password === 'Password must have at least 6 characters.'
              ? tx('Password must have at least 6 characters.', 'Mật khẩu phải có ít nhất 6 ký tự.')
              : '',
      });
      return;
    }

    const result = await signIn(formData);

    if (result.ok) {
      navigate('/');
    }
  };

  return (
    <div className="page-container py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="surface-card hidden p-8 lg:block">
          <p className="section-label mb-3">{tx('Welcome Back', 'Chào mừng quay lại')}</p>
          <h1 className="movie-title mb-3 text-4xl leading-tight">CINEPLEX</h1>
          <p className="max-w-md text-sm text-stone">
            {tx(
              'Sign in to continue booking, track ticket history, and manage your favorite cinemas in one place.',
              'Đăng nhập de tiep tuc dat ve, theo doi lich su va quan ly rap yeu thich tai mot noi.',
            )}
          </p>
        </section>

        <LoginForm
          formData={formData}
          fieldErrors={fieldErrors}
          loading={loading}
          apiError={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default LoginPage;




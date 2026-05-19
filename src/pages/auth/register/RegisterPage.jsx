import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/pages/auth/register/RegisterForm';
import { register } from '@/features/auth/services/authService';
import useLanguage from '@/hooks/useLanguage';
import { isEmail, minLength } from '@/utils/validators';

function RegisterPage() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      return tx('Name is required.', 'Vui lòng nhập họ tên.');
    }

    if (!isEmail(formData.email)) {
      return tx('Email is invalid.', 'Email không hợp lệ.');
    }

    if (!minLength(formData.password, 6)) {
      return tx('Password must have at least 6 characters.', 'Mật khẩu phải có ít nhất 6 ký tự.');
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/login');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? tx('Register failed.', 'Đăng ký thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="surface-card hidden p-8 lg:block">
          <p className="section-label mb-3">{tx('New Member', 'Thành viên mới')}</p>
          <h1 className="movie-title mb-3 text-4xl leading-tight">{tx('Create your cinema account', 'Tạo tài khoản cinema')}</h1>
          <p className="max-w-md text-sm text-stone">
            {tx(
              'Register now to get faster checkout, seat history, and personalized recommendations from ongoing shows.',
              'Đăng ký ngay để thanh toán nhanh hơn, xem lịch sử ghế và nhận gợi ý phù hợp.',
            )}
          </p>
        </section>

        <RegisterForm
          formData={formData}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default RegisterPage;




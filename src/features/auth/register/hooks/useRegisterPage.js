import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/features/auth/services/authService';
import { isEmail, minLength } from '@/utils/validators';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useRegisterPage(tx) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateRegisterForm = () => {
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
    const validationError = validateRegisterForm();

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

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}

export default useRegisterPage;

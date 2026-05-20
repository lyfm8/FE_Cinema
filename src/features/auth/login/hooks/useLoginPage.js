import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { validateLoginForm } from '@/utils/validators';

function mapLoginValidationErrors(errors, tx) {
  return {
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
  };
}

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useLoginPage(tx) {
  const navigate = useNavigate();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(mapLoginValidationErrors(validationErrors, tx));
      return;
    }

    const result = await signIn(formData);

    if (result.ok) {
      navigate('/');
    }
  };

  return {
    formData,
    fieldErrors,
    loading,
    apiError: error,
    handleChange,
    handleSubmit,
  };
}

export default useLoginPage;

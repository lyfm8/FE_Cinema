import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, sendOtp } from '@/features/auth/services/authService';
import { isEmail, minLength } from '@/utils/validators';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useRegisterPage(tx) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateBeforeSendOtp = () => {
    if (!formData.name.trim()) {
      return tx('Name is required.', 'Vui lòng nhập họ tên.');
    }

    if (!isEmail(formData.email)) {
      return tx('Email is invalid.', 'Email không hợp lệ.');
    }

    return '';
  };

  const validateRegisterForm = () => {
    const otpValidationError = validateBeforeSendOtp();
    if (otpValidationError) {
      return otpValidationError;
    }

    if (!formData.otp.trim()) {
      return tx('OTP is required.', 'Vui lòng nhập mã OTP.');
    }

    if (!minLength(formData.password, 6)) {
      return tx(
        'Password must have at least 6 characters.',
        'Mật khẩu phải có ít nhất 6 ký tự.',
      );
    }

    if (!formData.confirmPassword.trim()) {
      return tx('Confirm password is required.', 'Vui lòng nhập xác nhận mật khẩu.');
    }

    if (formData.password !== formData.confirmPassword) {
      return tx('Passwords do not match.', 'Mật khẩu xác nhận không khớp.');
    }

    return '';
  };

  const handleSendOtp = async () => {
    const validationError = validateBeforeSendOtp();

    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }

    setSendingOtp(true);
    setError('');
    setMessage('');

    try {
      const result = await sendOtp({
        email: formData.email,
        purpose: 'REGISTER',
      });

      if (result?.success === false) {
        setError(result?.message ?? tx('Send OTP failed.', 'Gửi OTP thất bại.'));
        return;
      }

      setOtpSent(true);
      setMessage(tx('OTP sent to your email.', 'OTP đã được gửi tới email của bạn.'));
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          tx('Send OTP failed.', 'Gửi OTP thất bại.'),
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateRegisterForm();

    if (validationError) {
      setError(validationError);
      setMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        email: formData.email,
        otp: formData.otp.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      await register(payload);
      navigate('/login');
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          tx('Register failed.', 'Đăng ký thất bại.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    sendingOtp,
    otpSent,
    message,
    error,
    handleChange,
    handleSendOtp,
    handleSubmit,
  };
}

export default useRegisterPage;

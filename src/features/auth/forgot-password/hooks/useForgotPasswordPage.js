import { useState, useEffect } from 'react';
import { forgotPassword, sendOtp } from '@/features/auth/services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useForgotPasswordPage(tx) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Passwords
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (countdown > 0) return;

    if (!email) {
      setError(tx('Please enter your email.', 'Vui lòng nhập email.'));
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await sendOtp({ email, purpose: 'FORGOT_PASSWORD' });
      setMessage(tx('OTP has been sent to your email.', 'Mã OTP đã được gửi đến email của bạn.'));
      setStep(2);
      setCountdown(60);
    } catch (requestError) {
      const apiError = requestError?.response?.data?.error?.message || requestError?.response?.data?.message;
      setError(apiError ?? tx('Failed to send OTP.', 'Gửi mã OTP thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      setError(tx('Password must have at least 6 characters.', 'Mật khẩu phải có ít nhất 6 ký tự.'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(tx('Passwords do not match.', 'Mật khẩu xác nhận không khớp.'));
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await forgotPassword({ email, otp, newPassword, confirmPassword });
      setMessage(tx('Password reset successfully. You can now login.', 'Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay.'));
      setTimeout(() => navigate('/login'), 3000);
    } catch (requestError) {
      const apiError = requestError?.response?.data?.error?.message || requestError?.response?.data?.message;
      setError(apiError ?? tx('Failed to reset password.', 'Đổi mật khẩu thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    message,
    error,
    loading,
    countdown,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    handleSendOtp,
    handleResetPassword,
  };
}

export default useForgotPasswordPage;

import { useState } from 'react';
import { forgotPassword } from '@/features/auth/services/authService';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useForgotPasswordPage(tx) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await forgotPassword({ email });
      setMessage(tx('Password reset request sent successfully.', 'Yêu cầu đặt lại mật khẩu đã được gửi.'));
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? tx('Request failed.', 'Gửi yêu cầu thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    message,
    error,
    loading,
    setEmail,
    handleSubmit,
  };
}

export default useForgotPasswordPage;

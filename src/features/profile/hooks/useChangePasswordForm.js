import { useState } from 'react';
import { changePassword } from '@/features/profile/services/userService';

const INITIAL_FORM = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function useChangePasswordForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setError('');
    setMessage('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must have at least 6 characters.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Confirm password does not match.');
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setError('New password must be different from old password.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await changePassword(form);

      if (!result?.success) {
        setError(result?.message || 'Unable to change password.');
        return;
      }

      setForm(INITIAL_FORM);
      setMessage(result?.message || 'Password changed successfully.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to change password.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    message,
    error,
    updateField,
    handleSubmit,
  };
}

export default useChangePasswordForm;


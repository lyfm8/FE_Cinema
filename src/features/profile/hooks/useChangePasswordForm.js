import { useState } from 'react';

function useChangePasswordForm() {
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setPassword('');
  };

  return {
    password,
    setPassword,
    handleSubmit,
  };
}

export default useChangePasswordForm;

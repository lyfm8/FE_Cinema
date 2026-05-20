import LoginForm from '@/pages/auth/login/LoginForm';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useLoginPage from '@/features/auth/login/hooks/useLoginPage';

function LoginPage() {
  const { tx } = useLanguage();
  const {
    formData,
    fieldErrors,
    loading,
    apiError,
    handleChange,
    handleSubmit,
  } = useLoginPage(tx);

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
          apiError={apiError}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default LoginPage;

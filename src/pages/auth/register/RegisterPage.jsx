import RegisterForm from '@/pages/auth/register/RegisterForm';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useRegisterPage from '@/features/auth/register/hooks/useRegisterPage';

function RegisterPage() {
  const { tx } = useLanguage();
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useRegisterPage(tx);

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

import ProfileInfo from '@/pages/profile/components/ProfileInfo';
import ChangePasswordForm from '@/pages/profile/components/ChangePasswordForm';
import BookingHistory from '@/pages/profile/components/BookingHistory';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useProfilePage from '@/features/profile/hooks/useProfilePage';

function ProfilePage() {
  const { tx } = useLanguage();
  const { profile, bookings, loading, error } = useProfilePage();

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Account', 'Tài khoản')}
        </p>
        <h1 className="text-2xl font-medium text-ink">{tx('Profile', 'Hồ sơ')}</h1>
      </div>

      {error ? (
        <p className="rounded-md border-base bg-cream px-3 py-2 text-xs text-rose">
          {tx(error, 'Không thể tải đầy đủ dữ liệu hồ sơ. Một phần dữ liệu có thể là mặc định.')}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileInfo profile={profile} />
        <ChangePasswordForm />
        <BookingHistory bookings={bookings} loading={loading} />
      </div>
    </div>
  );
}

export default ProfilePage;

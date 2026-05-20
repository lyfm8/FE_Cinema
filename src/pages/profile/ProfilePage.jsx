import ProfileInfo from '@/pages/profile/components/ProfileInfo';
import ChangePasswordForm from '@/pages/profile/components/ChangePasswordForm';
import BookingHistory from '@/pages/profile/components/BookingHistory';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useProfilePage from '@/features/profile/hooks/useProfilePage';

function ProfilePage() {
  const { tx } = useLanguage();
  const { profile, bookings } = useProfilePage();

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Account', 'Tài khoản')}
        </p>
        <h1 className="text-2xl font-medium text-ink">{tx('Profile', 'Hồ sơ')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileInfo profile={profile} />
        <ChangePasswordForm />
        <BookingHistory bookings={bookings} />
      </div>
    </div>
  );
}

export default ProfilePage;

import ProfileInfo from '@/pages/profile/components/ProfileInfo';
import ChangePasswordForm from '@/pages/profile/components/ChangePasswordForm';
import LoyaltyInfoCard from '@/pages/profile/components/LoyaltyInfoCard';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useProfilePage from '@/features/profile/hooks/useProfilePage';

function ProfilePage() {
  const { tx } = useLanguage();
  const {
    profile,
    bookings,
    loading,
    error,
    bookingsError,
    saving,
    saveMessage,
    saveError,
    saveProfile,
  } = useProfilePage();

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-ink">{tx('Profile', 'Hồ sơ')}</h1>
      </div>

      {error ? (
        <p className="rounded-md border-base bg-cream px-3 py-2 text-xs text-rose">
          {tx(error, 'Không thể tải đầy đủ dữ liệu hồ sơ. Một phần dữ liệu có thể là mặc định.')}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <ProfileInfo
          profile={profile}
          saving={saving}
          saveMessage={saveMessage}
          saveError={saveError}
          onSave={saveProfile}
        />
        <LoyaltyInfoCard profile={profile} />
        <div className="lg:col-span-2 grid gap-6 lg:grid-cols-2 items-start">
           <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

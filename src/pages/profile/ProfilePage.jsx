import { useEffect, useState } from 'react';
import ProfileInfo from '@/pages/profile/components/ProfileInfo';
import ChangePasswordForm from '@/pages/profile/components/ChangePasswordForm';
import BookingHistory from '@/pages/profile/components/BookingHistory';
import { getProfile } from '@/features/profile/services/userService';
import { getMyBookings } from '@/features/booking/services/bookingService';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { mockProfileBookings } from '@/utils/mockData';

function ProfilePage() {
  const { tx } = useLanguage();
  const [profile, setProfile] = useState({ name: 'Guest User', email: 'guest@example.com' });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [profileResult, bookingsResult] = await Promise.all([getProfile(), getMyBookings()]);

        if (mounted) {
          setProfile(profileResult?.data ?? profileResult);
          setBookings(bookingsResult?.data ?? bookingsResult);
        }
      } catch {
        if (mounted) {
          setBookings(mockProfileBookings);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

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




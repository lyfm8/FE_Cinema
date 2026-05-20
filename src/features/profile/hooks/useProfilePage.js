import { useEffect, useState } from 'react';
import { getProfile } from '@/features/profile/services/userService';
import { getMyBookings } from '@/features/booking/services/bookingService';
import { mockProfileBookings } from '@/utils/mockData';

const DEFAULT_PROFILE = {
  name: 'Guest User',
  email: 'guest@example.com',
};

function useProfilePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadProfileData() {
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

    loadProfileData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    profile,
    bookings,
  };
}

export default useProfilePage;

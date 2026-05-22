import { useEffect, useState } from 'react';
import { getProfile } from '@/features/profile/services/userService';
import { getMyBookings } from '@/features/booking/services/bookingService';
import { mockProfileBookings } from '@/utils/mockData';
import { AUTH_STORAGE_KEYS } from '@/utils/constants';

const DEFAULT_PROFILE = {
  name: 'Guest User',
  email: 'guest@example.com',
  phone: '',
  role: '',
  status: '',
  loyaltyPoints: 0,
  createdAt: '',
};

function normalizeProfile(payload) {
  if (!payload) {
    return DEFAULT_PROFILE;
  }

  return {
    name: payload.fullName || payload.email?.split('@')?.[0] || DEFAULT_PROFILE.name,
    email: payload.email || DEFAULT_PROFILE.email,
    phone: payload.phone || '',
    role: payload.role || '',
    status: payload.status || '',
    loyaltyPoints: Number(payload.loyaltyPoints || 0),
    createdAt: payload.createdAt || '',
  };
}

function normalizeBooking(item) {
  return {
    id: item.bookingCode || String(item.id || ''),
    createdAt: item.createdAt,
    status: item.status || 'PENDING',
    movieTitle: item?.showtime?.movie?.title || '',
    showtimeAt: item?.showtime?.startTime || '',
    totalAmount: Number(item?.totalAmount || 0),
  };
}

function readCurrentUserFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function useProfilePage() {
  const cachedUser = readCurrentUserFromStorage();
  const [profile, setProfile] = useState(
    cachedUser
      ? normalizeProfile({
          fullName: cachedUser.fullName || cachedUser.name,
          email: cachedUser.email,
          phone: cachedUser.phone,
          role: cachedUser.role,
          status: cachedUser.status,
          loyaltyPoints: cachedUser.loyaltyPoints,
        })
      : DEFAULT_PROFILE,
  );
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadProfileData() {
      setLoading(true);
      setError('');

      const [profileResult, bookingsResult] = await Promise.allSettled([getProfile(), getMyBookings()]);

      if (!mounted) {
        return;
      }

      if (profileResult.status === 'fulfilled') {
        const profileData = profileResult.value?.data || profileResult.value;
        setProfile(normalizeProfile(profileData));
      } else {
        setError('Unable to load complete profile data.');
      }

      if (bookingsResult.status === 'fulfilled') {
        const bookingsData = bookingsResult.value?.data || bookingsResult.value;
        const normalized = Array.isArray(bookingsData) ? bookingsData.map(normalizeBooking) : [];
        setBookings(normalized);
      } else {
        setBookings(mockProfileBookings);
      }

      setLoading(false);
    }

    loadProfileData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    profile,
    bookings,
    loading,
    error,
  };
}

export default useProfilePage;


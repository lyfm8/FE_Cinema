import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/features/profile/services/userService';
import { getMyBookings } from '@/features/booking/services/bookingService';
import { mockProfileBookings } from '@/utils/mockData';
import { AUTH_STORAGE_KEYS } from '@/utils/constants';

const DEFAULT_PROFILE = {
  name: 'Guest User',
  fullName: 'Guest User',
  email: 'guest@example.com',
  phone: '',
  gender: '',
  dateOfBirth: '',
  role: '',
  status: '',
  loyaltyPoints: 0,
  createdAt: '',
};

function normalizeProfile(payload) {
  if (!payload) {
    return DEFAULT_PROFILE;
  }

  const fullName = payload.fullName || payload.name || payload.email?.split('@')?.[0] || DEFAULT_PROFILE.fullName;

  return {
    name: fullName,
    fullName,
    email: payload.email || DEFAULT_PROFILE.email,
    phone: payload.phone || '',
    gender: payload.gender || '',
    dateOfBirth: payload.dateOfBirth || '',
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

function persistCurrentUserProfile(profile) {
  const currentUser = readCurrentUserFromStorage();
  if (!currentUser) {
    return;
  }

  const merged = {
    ...currentUser,
    name: profile.fullName,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
  };

  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(merged));
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
          gender: cachedUser.gender,
          dateOfBirth: cachedUser.dateOfBirth,
        })
      : DEFAULT_PROFILE,
  );
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

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

  const saveProfile = async (values) => {
    setSaving(true);
    setSaveMessage('');
    setSaveError('');

    const payload = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      gender: values.gender,
      dateOfBirth: values.dateOfBirth || null,
    };

    try {
      const response = await updateProfile(payload);
      const refetch = await getProfile();
      const updatedData = refetch?.data || response?.data || response;
      const normalized = normalizeProfile(updatedData);

      setProfile(normalized);
      persistCurrentUserProfile(normalized);
      setSaveMessage(response?.message || 'Profile updated successfully.');
      return { ok: true };
    } catch (requestError) {
      const message =
        requestError?.response?.data?.error?.message ||
        requestError?.response?.data?.message ||
        requestError?.message ||
        'Unable to update profile.';
      setSaveError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    bookings,
    loading,
    error,
    saving,
    saveMessage,
    saveError,
    saveProfile,
  };
}

export default useProfilePage;

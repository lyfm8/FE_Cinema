import axiosInstance from '@/services/axiosInstance';

export async function getProfile() {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
}

export async function updateProfile(payload) {
  void payload;
  throw new Error('Update profile API is not available in backend yet.');
}

export default {
  getProfile,
  updateProfile,
};

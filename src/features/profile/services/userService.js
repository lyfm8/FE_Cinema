import axiosInstance from '@/services/axiosInstance';

export async function getProfile() {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
}

export async function updateProfile(payload) {
  const response = await axiosInstance.put('/users/profile', payload);
  return response.data;
}

export async function changePassword(payload) {
  const response = await axiosInstance.post('/auth/change-password', payload);
  return response.data;
}

export default {
  getProfile,
  updateProfile,
  changePassword,
};

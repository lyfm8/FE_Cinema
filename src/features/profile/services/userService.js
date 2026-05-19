import axiosInstance from '@/services/axiosInstance';

export async function getProfile() {
  const response = await axiosInstance.get('/users/me');
  return response.data;
}

export async function updateProfile(payload) {
  const response = await axiosInstance.patch('/users/me', payload);
  return response.data;
}

export default {
  getProfile,
  updateProfile,
};

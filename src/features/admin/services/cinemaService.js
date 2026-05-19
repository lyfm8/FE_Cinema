import axiosInstance from '@/services/axiosInstance';

export async function getCinemas(params = {}) {
  const response = await axiosInstance.get('/cinemas', { params });
  return response.data;
}

export default {
  getCinemas,
};

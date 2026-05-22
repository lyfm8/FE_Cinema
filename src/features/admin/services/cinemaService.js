import axiosInstance from '@/services/axiosInstance';

export async function getCinemas(params = {}) {
  const response = await axiosInstance.get('/cinemas', { params });
  return response.data;
}

export async function createCinema(payload) {
  const response = await axiosInstance.post('/cinemas', payload);
  return response.data;
}

export async function updateCinema(id, payload) {
  const response = await axiosInstance.put(`/cinemas/${id}`, payload);
  return response.data;
}

export async function deleteCinema(id) {
  const response = await axiosInstance.delete(`/cinemas/${id}`);
  return response.data;
}

export default {
  getCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
};

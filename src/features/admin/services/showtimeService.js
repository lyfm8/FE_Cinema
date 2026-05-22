import axiosInstance from '@/services/axiosInstance';

// ── Showtime CRUD ──

export async function getShowtimes(params = {}) {
  const response = await axiosInstance.get('/showtimes', { params });
  return response.data;
}

export async function getShowtimeById(id) {
  const response = await axiosInstance.get(`/showtimes/${id}`);
  return response.data;
}

export async function createShowtime(payload) {
  const response = await axiosInstance.post('/showtimes', payload);
  return response.data;
}

export async function updateShowtime(id, payload) {
  const response = await axiosInstance.put(`/showtimes/${id}`, payload);
  return response.data;
}

export async function deleteShowtime(id) {
  const response = await axiosInstance.delete(`/showtimes/${id}`);
  return response.data;
}

// ── Supporting lookups ──

export async function getCinemas(params = {}) {
  const response = await axiosInstance.get('/cinemas', { params });
  return response.data;
}

export async function getRoomsByCinema(cinemaId) {
  const response = await axiosInstance.get(`/cinemas/${cinemaId}/rooms`);
  return response.data;
}

export async function getMovies(params = {}) {
  const response = await axiosInstance.get('/movies/get-all-movies', { params });
  return response.data;
}

export default {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getCinemas,
  getRoomsByCinema,
  getMovies,
};

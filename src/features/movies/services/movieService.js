import axiosInstance from '@/services/axiosInstance';

export async function getMovies(params = {}) {
  const response = await axiosInstance.get('/movies', { params });
  return response.data;
}

export async function getMovieById(id) {
  const response = await axiosInstance.get(`/movies/${id}`);
  return response.data;
}

export default {
  getMovies,
  getMovieById,
};

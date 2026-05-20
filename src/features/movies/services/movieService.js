import axiosInstance from '@/services/axiosInstance';

const MOVIE_MULTIPART_CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export async function getMovies(params = {}) {
  const response = await axiosInstance.get('/movies', { params });
  return response.data;
}

export async function getMovieById(id) {
  const response = await axiosInstance.get(`/movies/${id}`);
  return response.data;
}

export async function createMovie(payload) {
  const response = await axiosInstance.post('/movies', payload, MOVIE_MULTIPART_CONFIG);
  return response.data;
}

export async function updateMovie(id, payload) {
  const response = await axiosInstance.patch(`/movies/${id}`, payload, MOVIE_MULTIPART_CONFIG);
  return response.data;
}

export async function deleteMovie(id) {
  const response = await axiosInstance.delete(`/movies/${id}`);
  return response.data;
}

export default {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};

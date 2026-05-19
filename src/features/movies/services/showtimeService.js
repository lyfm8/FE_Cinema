import axiosInstance from '@/services/axiosInstance';

export async function getShowtimesByMovieId(movieId) {
  const response = await axiosInstance.get(`/movies/${movieId}/showtimes`);
  return response.data;
}

export default {
  getShowtimesByMovieId,
};

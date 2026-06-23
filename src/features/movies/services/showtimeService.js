import axiosInstance from '@/services/axiosInstance';

export async function getShowtimesByMovieId(movieId) {
  const response = await axiosInstance.get(`/showtimes/by-movie/${movieId}`);
  return response.data;
}

export async function getShowtimesByCinemaId(cinemaId) {
  const response = await axiosInstance.get(`/showtimes/by-cinema/${cinemaId}`);
  return response.data;
}

export default {
  getShowtimesByMovieId,
  getShowtimesByCinemaId,
};

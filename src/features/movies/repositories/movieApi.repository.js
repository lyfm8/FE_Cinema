import { apiClient } from '@/core/api/apiClient';

/**
 * Repository handling public-facing movie & showtime API calls.
 */
export class PublicMovieApiRepository {
  /** @param {Object} [params] */
  getMovies(params = {}) {
    return apiClient.get('/movies/get-all-movies', { params });
  }

  /** @param {number|string} id */
  getMovieById(id) {
    return apiClient.get(`/movies/get-movie/${id}`);
  }

  /** @param {number|string} movieId */
  getShowtimesByMovieId(movieId) {
    return apiClient.get(`/showtimes/by-movie/${movieId}`);
  }
}

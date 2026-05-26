import { apiClient } from '@/core/api/apiClient';

/**
 * Repository handling all Showtime CRUD and supporting lookup API calls.
 */
export class ShowtimeApiRepository {
  /** @param {Object} [params] */
  getShowtimes(params = {}) {
    return apiClient.get('/showtimes', { params });
  }

  /** @param {number|string} id */
  getShowtimeById(id) {
    return apiClient.get(`/showtimes/${id}`);
  }

  /** @param {Object} payload */
  createShowtime(payload) {
    return apiClient.post('/showtimes', payload);
  }

  /** @param {number|string} id @param {Object} payload */
  updateShowtime(id, payload) {
    return apiClient.put(`/showtimes/${id}`, payload);
  }

  /** @param {number|string} id */
  deleteShowtime(id) {
    return apiClient.delete(`/showtimes/${id}`);
  }

  // ── Supporting lookups ──

  /** @param {Object} [params] */
  getCinemas(params = {}) {
    return apiClient.get('/cinemas', { params });
  }

  /** @param {number|string} cinemaId */
  getRoomsByCinema(cinemaId) {
    return apiClient.get(`/cinemas/${cinemaId}/rooms`);
  }

  /** @param {Object} [params] */
  getMovies(params = {}) {
    return apiClient.get('/movies/get-all-movies', { params });
  }
}

import { apiClient } from '@/core/api/apiClient';

const MULTIPART_CONFIG = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

/**
 * Repository handling all Movie CRUD API calls (admin side).
 */
export class MovieApiRepository {
  /** @param {Object} [params] */
  getMovies(params = {}) {
    return apiClient.get('/movies/get-all-movies', { params });
  }

  /** @param {number|string} id */
  getMovieById(id) {
    return apiClient.get(`/movies/get-movie/${id}`);
  }

  /** @param {FormData} payload */
  createMovie(payload) {
    return apiClient.post('/movies/create-movie', payload, MULTIPART_CONFIG);
  }

  /** @param {number|string} id @param {FormData} payload */
  updateMovie(id, payload) {
    return apiClient.put(`/movies/update-movie/${id}`, payload, MULTIPART_CONFIG);
  }

  /** @param {number|string} id */
  deleteMovie(id) {
    return apiClient.delete(`/movies/delete-movie/${id}`);
  }
}

import { apiClient } from '@/core/api/apiClient';

/**
 * Repository handling all Cinema & Room API calls.
 */
export class CinemaApiRepository {
  /** @param {Object} [params] */
  getCinemas(params = {}) {
    return apiClient.get('/cinemas', { params });
  }

  /** @param {number|string} cinemaId */
  getCinemaById(cinemaId) {
    return apiClient.get(`/cinemas/${cinemaId}`);
  }

  /** @param {Object} data */
  createCinema(data) {
    return apiClient.post('/cinemas', data);
  }

  /** @param {number|string} cinemaId @param {Object} data */
  updateCinema(cinemaId, data) {
    return apiClient.put(`/cinemas/${cinemaId}`, data);
  }

  /** @param {number|string} cinemaId */
  deleteCinema(cinemaId) {
    return apiClient.delete(`/cinemas/${cinemaId}`);
  }

  /** @param {number|string} cinemaId */
  getRoomsByCinema(cinemaId) {
    return apiClient.get(`/cinemas/${cinemaId}/rooms`);
  }

  /** @param {number|string} roomId */
  getRoomById(roomId) {
    return apiClient.get(`/cinemas/rooms/${roomId}`);
  }

  /** @param {number|string} cinemaId @param {Object} data */
  createRoom(cinemaId, data) {
    return apiClient.post(`/cinemas/${cinemaId}/rooms`, data);
  }

  /** @param {number|string} roomId @param {Object} data */
  updateRoom(roomId, data) {
    return apiClient.put(`/cinemas/rooms/${roomId}`, data);
  }

  /** @param {number|string} roomId */
  deleteRoom(roomId) {
    return apiClient.delete(`/cinemas/rooms/${roomId}`);
  }
}

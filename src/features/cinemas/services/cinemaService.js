import { apiClient } from '@/core/api/apiClient';

export const publicCinemaService = {
  /**
   * Lấy danh sách tất cả các rạp (có thể kèm filter)
   * @param {Object} params
   */
  getAllCinemas: (params = {}) => {
    return apiClient.get('/cinemas', { params });
  },

  /**
   * Lấy danh sách các phòng chiếu của một rạp cụ thể
   * @param {number|string} cinemaId
   */
  getRoomsByCinemaId: (cinemaId) => {
    return apiClient.get(`/cinemas/${cinemaId}/rooms`);
  },
};

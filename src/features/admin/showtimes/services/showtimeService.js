import { ShowtimeApiRepository } from '../repositories/showtimeApi.repository';

/**
 * Showtime service — business logic layer.
 * Receives a repository via constructor injection (DI).
 */
export class ShowtimeService {
  /** @param {InstanceType<typeof ShowtimeApiRepository>} [showtimeRepository] */
  constructor(showtimeRepository) {
    this.showtimeRepository = showtimeRepository || new ShowtimeApiRepository();
  }

  getShowtimes(params) {
    return this.showtimeRepository.getShowtimes(params);
  }

  getShowtimeById(id) {
    return this.showtimeRepository.getShowtimeById(id);
  }

  createShowtime(payload) {
    return this.showtimeRepository.createShowtime(payload);
  }

  updateShowtime(id, payload) {
    return this.showtimeRepository.updateShowtime(id, payload);
  }

  deleteShowtime(id) {
    return this.showtimeRepository.deleteShowtime(id);
  }

  bulkCreateShowtime(payload) {
    return this.showtimeRepository.bulkCreateShowtime(payload);
  }

  getShowtimesByCinema(cinemaId) {
    return this.showtimeRepository.getShowtimesByCinema(cinemaId);
  }

  getCinemas(params) {
    return this.showtimeRepository.getCinemas(params);
  }

  getRoomsByCinema(cinemaId) {
    return this.showtimeRepository.getRoomsByCinema(cinemaId);
  }

  getMovies(params) {
    return this.showtimeRepository.getMovies(params);
  }
}

export const showtimeService = new ShowtimeService();

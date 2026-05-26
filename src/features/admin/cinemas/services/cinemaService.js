import { CinemaApiRepository } from '../repositories/cinemaApi.repository';

/**
 * Cinema service — business logic layer.
 * Receives a repository via constructor injection (DI),
 * defaults to CinemaApiRepository when none is provided.
 */
export class CinemaService {
  /** @param {InstanceType<typeof CinemaApiRepository>} [cinemaRepository] */
  constructor(cinemaRepository) {
    this.cinemaRepository = cinemaRepository || new CinemaApiRepository();
  }

  getCinemas(params) {
    return this.cinemaRepository.getCinemas(params);
  }

  getCinemaById(id) {
    return this.cinemaRepository.getCinemaById(id);
  }

  createCinema(data) {
    return this.cinemaRepository.createCinema(data);
  }

  updateCinema(id, data) {
    return this.cinemaRepository.updateCinema(id, data);
  }

  deleteCinema(id) {
    return this.cinemaRepository.deleteCinema(id);
  }

  getRoomsByCinema(cinemaId) {
    return this.cinemaRepository.getRoomsByCinema(cinemaId);
  }

  getRoomById(roomId) {
    return this.cinemaRepository.getRoomById(roomId);
  }

  createRoom(cinemaId, data) {
    return this.cinemaRepository.createRoom(cinemaId, data);
  }

  updateRoom(roomId, data) {
    return this.cinemaRepository.updateRoom(roomId, data);
  }

  deleteRoom(roomId) {
    return this.cinemaRepository.deleteRoom(roomId);
  }
}

export const cinemaService = new CinemaService();

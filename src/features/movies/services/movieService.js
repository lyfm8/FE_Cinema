import { PublicMovieApiRepository } from "../repositories/movieApi.repository";

/**
 * Public movie service — business logic layer for public-facing pages.
 * Receives a repository via constructor injection (DI).
 */
export class PublicMovieService {
  /** @param {InstanceType<typeof PublicMovieApiRepository>} [movieRepository] */
  constructor(movieRepository) {
    this.movieRepository = movieRepository || new PublicMovieApiRepository();
  }

  getMovies(params) {
    return this.movieRepository.getMovies(params);
  }

  getMovieById(id) {
    return this.movieRepository.getMovieById(id);
  }

  getShowtimesByMovieId(movieId) {
    return this.movieRepository.getShowtimesByMovieId(movieId);
  }

  getShowtimeById(showtimeId) {
    return this.movieRepository.getShowtimeById(showtimeId);
  }
}

export const publicMovieService = new PublicMovieService();

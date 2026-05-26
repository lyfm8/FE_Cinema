import { MovieApiRepository } from '../repositories/movieApi.repository';

/**
 * Movie service — business logic layer (admin).
 * Receives a repository via constructor injection (DI).
 */
export class MovieService {
  /** @param {InstanceType<typeof MovieApiRepository>} [movieRepository] */
  constructor(movieRepository) {
    this.movieRepository = movieRepository || new MovieApiRepository();
  }

  getMovies(params) {
    return this.movieRepository.getMovies(params);
  }

  getMovieById(id) {
    return this.movieRepository.getMovieById(id);
  }

  createMovie(payload) {
    return this.movieRepository.createMovie(payload);
  }

  updateMovie(id, payload) {
    return this.movieRepository.updateMovie(id, payload);
  }

  deleteMovie(id) {
    return this.movieRepository.deleteMovie(id);
  }
}

export const movieService = new MovieService();

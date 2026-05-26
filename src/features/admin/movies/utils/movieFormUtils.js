/**
 * Build a FormData object for creating/updating a movie.
 *
 * @param {Object} values - Form values
 * @param {File|null} posterFile - Poster image file (if selected)
 * @param {Object|null} currentMovie - Current movie data (for edit mode)
 * @returns {FormData}
 */
export function buildMovieFormData(values, posterFile, currentMovie) {
  const formData = new FormData();

  formData.append('name', values.title);
  formData.append('description', values.description);
  formData.append('status', values.status);
  formData.append('trailerUrl', values.trailerUrl);
  formData.append('duration', String(values.durationMinutes));
  formData.append('releaseDate', values.releaseDate);
  formData.append('genre', values.genre);
  formData.append('director', values.director);
  formData.append('language', values.language);
  formData.append('ageLimit', String(values.ageLimit));

  const actors = (values.cast || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  actors.forEach((actor) => formData.append('actors', actor));

  if (posterFile) {
    formData.append('poster', posterFile);
  } else if (currentMovie?.posterUrl) {
    formData.append('imageUrl', currentMovie.posterUrl);
  }

  return formData;
}

export function extractMovieList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export function extractMovieItem(payload) {
  if (!payload) {
    return null;
  }

  if (payload?.data?.data && !Array.isArray(payload.data.data)) {
    return payload.data.data;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
}

export function normalizeMovieItem(rawMovie) {
  if (!rawMovie) {
    return null;
  }

  return {
    ...rawMovie,
    id: rawMovie.id ?? rawMovie.movieId,
    title: rawMovie.title ?? rawMovie.name ?? '',
    posterUrl: rawMovie.posterUrl ?? rawMovie.imageUrl ?? '',
    durationMinutes: Number(rawMovie.durationMinutes ?? rawMovie.duration ?? 0),
  };
}

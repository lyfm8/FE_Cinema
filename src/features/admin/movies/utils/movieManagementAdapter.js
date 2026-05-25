export const MOVIE_STATUS = {
  NOW_SHOWING: "NOW_SHOWING",
  COMING_SOON: "COMING_SOON",
  STOPPED: "STOPPED",
};

export function getErrorMessage(error, fallbackMessage) {
  const raw =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message ??
    fallbackMessage;

  if (Array.isArray(raw)) return raw.join(", ");
  if (raw && typeof raw === "object")
    return raw.message ? String(raw.message) : JSON.stringify(raw);
  return String(raw || fallbackMessage);
}

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

export function extractMovie(payload) {
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

export function normalizeMovie(rawMovie) {
  if (!rawMovie) {
    return null;
  }

  const id = rawMovie.id ?? rawMovie.movieId;
  const title = rawMovie.title ?? rawMovie.name ?? "";
  const status = rawMovie.status ?? MOVIE_STATUS.COMING_SOON;

  return {
    id: Number(id),
    title,
    genre: rawMovie.genre ?? "",
    durationMinutes: Number(rawMovie.durationMinutes ?? rawMovie.duration ?? 0),
    director: rawMovie.director ?? "",
    cast:
      rawMovie.cast ??
      (Array.isArray(rawMovie.actors)
        ? rawMovie.actors.join(", ")
        : (rawMovie.actors ?? "")),
    releaseDate: rawMovie.releaseDate ?? "",
    description: rawMovie.description ?? "",
    language: rawMovie.language ?? "",
    ageLimit:
      rawMovie.ageLimit !== undefined && rawMovie.ageLimit !== null
        ? Number(rawMovie.ageLimit)
        : 0,
    posterUrl: rawMovie.posterUrl ?? rawMovie.imageUrl ?? "",
    trailerUrl: rawMovie.trailerUrl ?? "",
    status: Object.values(MOVIE_STATUS).includes(status)
      ? status
      : MOVIE_STATUS.COMING_SOON,
  };
}

export function buildMovieFormData(values, posterFile, currentMovie) {
  const formData = new FormData();

  formData.append("name", values.title);
  formData.append("description", values.description);
  formData.append("status", values.status);
  formData.append("trailerUrl", values.trailerUrl);
  formData.append("duration", String(values.durationMinutes));
  formData.append("releaseDate", values.releaseDate);
  formData.append("genre", values.genre);
  formData.append("director", values.director);
  formData.append("language", values.language);
  formData.append("ageLimit", String(values.ageLimit));

  const actors = (values.cast || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  actors.forEach((actor) => formData.append("actors", actor));

  if (posterFile) {
    formData.append("poster", posterFile);
  } else if (currentMovie?.posterUrl) {
    formData.append("imageUrl", currentMovie.posterUrl);
  }

  return formData;
}

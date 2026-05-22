export const SHOWTIME_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const MOVIE_FORMAT = {
  '2D': '2D',
  '3D': '3D',
  IMAX: 'IMAX',
};

export function getErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

/**
 * Trích xuất danh sách từ response API (hỗ trợ nhiều shape khác nhau).
 */
export function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

/**
 * Trích xuất single item từ response API.
 */
export function extractItem(payload) {
  if (!payload) return null;
  if (payload?.data?.data && !Array.isArray(payload.data.data)) return payload.data.data;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

/**
 * Normalize 1 showtime row cho DataTable.
 */
export function normalizeShowtime(raw) {
  if (!raw) return null;

  return {
    id: Number(raw.id),
    movieId: Number(raw.movieId),
    roomId: Number(raw.roomId),
    movieTitle: raw.movie?.title ?? '',
    cinemaName: raw.room?.cinema?.name ?? raw.room?.cinemaName ?? '',
    roomName: raw.room?.name ?? '',
    publicStartTime: raw.publicStartTime ?? '',
    movieStartTime: raw.movieStartTime ?? '',
    movieEndTime: raw.movieEndTime ?? '',
    roomReleaseTime: raw.roomReleaseTime ?? '',
    preShowMinutes: raw.preShowMinutes ?? 10,
    postMovieBufferMinutes: raw.postMovieBufferMinutes ?? 15,
    format: raw.format ?? '2D',
    status: Object.values(SHOWTIME_STATUS).includes(raw.status)
      ? raw.status
      : SHOWTIME_STATUS.SCHEDULED,
  };
}

export function formatTime(dateInput) {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

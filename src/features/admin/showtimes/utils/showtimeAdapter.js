export const SHOWTIME_STATUS = {
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const MOVIE_FORMAT = {
  FORMAT_2D: "FORMAT_2D",
  FORMAT_3D: "FORMAT_3D",
  IMAX: "IMAX",
};

export const MOVIE_FORMAT_LABEL = {
  FORMAT_2D: "2D",
  FORMAT_3D: "3D",
  IMAX: "IMAX",
};

export const TIMELINE_DEFAULT_START_HOUR = 8;
export const TIMELINE_DEFAULT_END_HOUR = 24;

function pad2(value) {
  return String(value).padStart(2, "0");
}

function toNumberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function createDayBoundary(dateKey, hour) {
  const base = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  base.setHours(hour, 0, 0, 0);
  return base;
}

function clampInterval(startMs, endMs, minMs, maxMs) {
  const clampedStart = Math.max(startMs, minMs);
  const clampedEnd = Math.min(endMs, maxMs);
  if (clampedEnd <= clampedStart) return null;
  return { startMs: clampedStart, endMs: clampedEnd };
}

function getMinutes(startMs, endMs) {
  return Math.max(0, Math.round((endMs - startMs) / 60000));
}

export function getMovieFormatLabel(format) {
  return MOVIE_FORMAT_LABEL[format] ?? format ?? "-";
}

export function getErrorMessage(error, fallbackMessage) {
  const dataError = error?.response?.data?.error;
  // Backend trả { error: { code, message } } hoặc { error: "string" }
  const errorMsg =
    typeof dataError === 'object' && dataError !== null
      ? dataError.message
      : dataError;

  return (
    error?.response?.data?.message ||
    errorMsg ||
    error?.message ||
    fallbackMessage
  );
}

export function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export function extractItem(payload) {
  if (!payload) return null;
  if (payload?.data?.data && !Array.isArray(payload.data.data))
    return payload.data.data;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

export function toDateKey(dateInput) {
  if (!dateInput) return "";
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function getTodayDateKey() {
  return toDateKey(new Date());
}

export function normalizeShowtime(raw) {
  if (!raw) return null;

  const cinemaIdRaw =
    raw.room?.cinema?.id ?? raw.cinemaId ?? raw.room?.cinemaId ?? null;

  return {
    id: Number(raw.id),
    movieId: Number(raw.movieId),
    roomId: Number(raw.roomId),
    cinemaId: cinemaIdRaw === null ? NaN : Number(cinemaIdRaw),
    movieTitle: raw.movie?.title ?? raw.movie?.name ?? "",
    cinemaName: raw.room?.cinema?.name ?? raw.room?.cinemaName ?? "",
    roomName: raw.room?.name ?? "",
    publicStartTime: raw.publicStartTime ?? "",
    movieStartTime: raw.movieStartTime ?? "",
    movieEndTime: raw.movieEndTime ?? "",
    roomReleaseTime: raw.roomReleaseTime ?? "",
    preShowMinutes: raw.preShowMinutes ?? 10,
    postMovieBufferMinutes: raw.postMovieBufferMinutes ?? 15,
    format: Object.values(MOVIE_FORMAT).includes(raw.format)
      ? raw.format
      : MOVIE_FORMAT.FORMAT_2D,
    status: Object.values(SHOWTIME_STATUS).includes(raw.status)
      ? raw.status
      : SHOWTIME_STATUS.SCHEDULED,
  };
}

export function formatTime(dateInput) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function buildTimelineHourMarks(startHour, endHour) {
  const start = Number(startHour);
  const end = Number(endHour);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return [];
  const marks = [];
  for (let h = start; h <= end; h += 1) {
    marks.push(h);
  }
  return marks;
}

export function buildTimelineRows({
  showtimes = [],
  rooms = [],
  selectedDate = "",
  selectedCinemaId = "",
  selectedRoomId = "",
  startHour = TIMELINE_DEFAULT_START_HOUR,
  endHour = TIMELINE_DEFAULT_END_HOUR,
}) {
  const dateKey = selectedDate || getTodayDateKey();
  const start = Number(startHour);
  const end = Number(endHour);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return [];
  }

  const dayStart = createDayBoundary(dateKey, start);
  const dayEnd = createDayBoundary(dateKey, end);

  if (!dayStart || !dayEnd) return [];

  const dayStartMs = dayStart.getTime();
  const dayEndMs = dayEnd.getTime();
  const totalMs = Math.max(1, dayEndMs - dayStartMs);

  const cinemaFilter = toNumberOrNull(selectedCinemaId);
  const roomFilter = toNumberOrNull(selectedRoomId);

  const rowsByRoomId = new Map();

  for (const room of rooms) {
    const roomId = Number(room?.id);
    if (!Number.isFinite(roomId)) continue;
    if (roomFilter !== null && roomId !== roomFilter) continue;

    rowsByRoomId.set(roomId, {
      roomId,
      roomName: room?.name ?? `Room ${roomId}`,
      blocks: [],
      freeSlots: [],
    });
  }

  for (const st of showtimes) {
    const roomId = Number(st?.roomId);
    if (!Number.isFinite(roomId)) continue;
    if (roomFilter !== null && roomId !== roomFilter) continue;

    const stCinemaId = toNumberOrNull(st?.cinemaId);
    if (cinemaFilter !== null && stCinemaId !== cinemaFilter) continue;

    const stDateKey = toDateKey(st?.publicStartTime);
    if (stDateKey !== dateKey) continue;

    const rawStartMs = new Date(st?.publicStartTime).getTime();
    const rawEndMs = new Date(st?.roomReleaseTime).getTime();
    if (!Number.isFinite(rawStartMs) || !Number.isFinite(rawEndMs)) continue;

    const clamped = clampInterval(rawStartMs, rawEndMs, dayStartMs, dayEndMs);
    if (!clamped) continue;

    if (!rowsByRoomId.has(roomId)) {
      rowsByRoomId.set(roomId, {
        roomId,
        roomName: st?.roomName || `Room ${roomId}`,
        blocks: [],
        freeSlots: [],
      });
    }

    const row = rowsByRoomId.get(roomId);

    const leftPct = ((clamped.startMs - dayStartMs) / totalMs) * 100;
    const rawWidthPct = ((clamped.endMs - clamped.startMs) / totalMs) * 100;

    const safeLeft = Math.max(0, Math.min(100, leftPct));
    const safeWidth = Math.max(0.8, Math.min(100 - safeLeft, rawWidthPct));

    row.blocks.push({
      id: Number(st.id),
      movieTitle: st.movieTitle || `Showtime #${st.id}`,
      status: st.status,
      format: st.format,
      startMs: clamped.startMs,
      endMs: clamped.endMs,
      startText: formatTime(clamped.startMs),
      endText: formatTime(clamped.endMs),
      leftPct: safeLeft,
      widthPct: safeWidth,
    });
  }

  const rows = Array.from(rowsByRoomId.values()).sort((a, b) =>
    a.roomName.localeCompare(b.roomName, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  for (const row of rows) {
    row.blocks.sort((a, b) => a.startMs - b.startMs);

    const freeSlots = [];
    let cursor = dayStartMs;

    for (const block of row.blocks) {
      if (block.startMs > cursor) {
        freeSlots.push({
          startMs: cursor,
          endMs: block.startMs,
          startText: formatTime(cursor),
          endText: formatTime(block.startMs),
          minutes: getMinutes(cursor, block.startMs),
        });
      }
      cursor = Math.max(cursor, block.endMs);
    }

    if (cursor < dayEndMs) {
      freeSlots.push({
        startMs: cursor,
        endMs: dayEndMs,
        startText: formatTime(cursor),
        endText: formatTime(dayEndMs),
        minutes: getMinutes(cursor, dayEndMs),
      });
    }

    row.freeSlots = freeSlots.filter((slot) => slot.minutes >= 5);
  }

  return rows;
}

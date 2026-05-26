export const CINEMA_STATUS = {
  ACTIVE: "ACTIVE",
  MAINTENANCE: "MAINTENANCE",
  INACTIVE: "INACTIVE",
};

export const ROOM_STATUS = {
  ACTIVE: "ACTIVE",
  MAINTENANCE: "MAINTENANCE",
  INACTIVE: "INACTIVE",
};

export const ROOM_TYPE = {
  STANDARD: "STANDARD",
  VIP: "VIP",
  IMAX: "IMAX",
};

export function getErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
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


export function normalizeCinema(raw) {
  if (!raw) return null;

  return {
    id: Number(raw.id),
    name: raw.name ?? "",
    address: raw.address ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    status: Object.values(CINEMA_STATUS).includes(raw.status)
      ? raw.status
      : CINEMA_STATUS.ACTIVE,
    roomsCount: Array.isArray(raw.rooms)
      ? raw.rooms.length
      : Number(raw.roomsCount ?? 0),
  };
}

export function normalizeRoom(raw) {
  if (!raw) return null;

  return {
    id: Number(raw.id),
    cinemaId: Number(raw.cinemaId),
    name: raw.name ?? "",
    totalSeats: Number(raw.totalSeats ?? 0),
    roomType: Object.values(ROOM_TYPE).includes(raw.roomType)
      ? raw.roomType
      : ROOM_TYPE.STANDARD,
    status: Object.values(ROOM_STATUS).includes(raw.status)
      ? raw.status
      : ROOM_STATUS.ACTIVE,
  };
}

export function extractPagination(payload) {
  return (
    payload?.pagination ||
    payload?.data?.pagination ||
    payload?.data?.data?.pagination ||
    null
  );
}

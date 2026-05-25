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

export function extractPagination(payload) {
  return (
    payload?.pagination ||
    payload?.data?.pagination ||
    payload?.data?.data?.pagination ||
    null
  );
}

export function normalizeCinema(raw) {
  if (!raw) return null;
  return {
    id: Number(raw.id),
    name: raw.name ?? '',
    address: raw.address ?? '',
    phone: raw.phone ?? '',
    email: raw.email ?? '',
  };
}


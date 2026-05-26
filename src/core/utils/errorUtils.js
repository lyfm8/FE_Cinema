/**
 * Extract a human-readable error message from an Axios error or generic Error.
 *
 * Handles multiple backend response shapes:
 *  - { message: "..." }
 *  - { error: "..." }
 *  - { error: { code, message } }
 *  - Validation errors (message as array)
 *
 * @param {any} error - The caught error (typically AxiosError)
 * @param {string} [fallbackMessage='An error occurred.'] - Fallback when no message can be extracted
 * @returns {string}
 */
export function getErrorMessage(error, fallbackMessage = 'An error occurred.') {
  const dataError = error?.response?.data?.error;

  const errorMsg =
    typeof dataError === 'object' && dataError !== null
      ? dataError.message
      : dataError;

  const raw =
    error?.response?.data?.message ??
    errorMsg ??
    error?.message ??
    fallbackMessage;

  if (Array.isArray(raw)) return raw.join(', ');
  if (raw && typeof raw === 'object') {
    return raw.message ? String(raw.message) : JSON.stringify(raw);
  }
  return String(raw || fallbackMessage);
}

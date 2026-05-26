/**
 * Standard API response shape returned by the backend.
 *
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} [message] - Optional message from the server
 * @property {T} [data] - The response payload
 * @property {{ page: number, pageSize: number, totalItems: number, totalPages: number }} [pagination]
 */

export default {};

import { apiClient } from "@/core/api/apiClient";

export function getBookings(params = {}) {
  return apiClient.get("/bookings", { params });
}

export default {
  getBookings,
};

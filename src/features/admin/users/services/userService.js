import { apiClient } from "@/core/api/apiClient";

export function getUsers(params = {}) {
  return apiClient.get("/users", { params });
}

export default {
  getUsers,
};

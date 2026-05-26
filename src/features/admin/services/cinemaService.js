import axiosInstance from "@/services/axiosInstance";

export async function getCinemas(params = {}) {
  const response = await axiosInstance.get("/cinemas", { params });
  return response.data;
}

export async function getCinemaById(cinemaId) {
  const response = await axiosInstance.get(`/cinemas/${cinemaId}`);
  return response.data;
}

export async function createCinema(data) {
  const response = await axiosInstance.post("/cinemas", data);
  return response.data;
}

export async function updateCinema(cinemaId, data) {
  const response = await axiosInstance.put(`/cinemas/${cinemaId}`, data);
  return response.data;
}

export async function deleteCinema(cinemaId) {
  const response = await axiosInstance.delete(`/cinemas/${cinemaId}`);
  return response.data;
}

export async function getRoomsByCinema(cinemaId) {
  const response = await axiosInstance.get(`/cinemas/${cinemaId}/rooms`);
  return response.data;
}

export async function getRoomById(cinemaId, roomId) {
  const response = await axiosInstance.get(
    `/cinemas/${cinemaId}/rooms/${roomId}`,
  );
  return response.data;
}

export async function createRoom(cinemaId, data) {
  const response = await axiosInstance.post(`/cinemas/${cinemaId}/rooms`, data);
  return response.data;
}

export async function updateRoom(cinemaId, roomId, data) {
  const response = await axiosInstance.put(
    `/cinemas/${cinemaId}/rooms/${roomId}`,
    data,
  );
  return response.data;
}

export async function deleteRoom(cinemaId, roomId) {
  const response = await axiosInstance.delete(
    `/cinemas/${cinemaId}/rooms/${roomId}`,
  );
  return response.data;
}

export async function createCinema(payload) {
  const response = await axiosInstance.post('/cinemas', payload);
  return response.data;
}

export async function updateCinema(id, payload) {
  const response = await axiosInstance.put(`/cinemas/${id}`, payload);
  return response.data;
}

export async function deleteCinema(id) {
  const response = await axiosInstance.delete(`/cinemas/${id}`);
  return response.data;
}

export default {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
  getRoomsByCinema,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

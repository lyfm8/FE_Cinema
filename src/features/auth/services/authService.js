import axiosInstance from "@/services/axiosInstance";

export async function login(payload) {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
}

export async function sendOtp(payload) {
  const response = await axiosInstance.post("/auth/send-otp", payload);
  return response.data;
}

export async function register(payload) {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
}

export async function forgotPassword(payload) {
  const response = await axiosInstance.post("/auth/forgot-password", payload);
  return response.data;
}

export async function logout() {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
}

export default {
  login,
  sendOtp,
  register,
  forgotPassword,
  logout,
};

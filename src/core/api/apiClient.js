import axiosInstance from '@/services/axiosInstance';

class ApiClient {
  async get(url, config) {
    const response = await axiosInstance.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

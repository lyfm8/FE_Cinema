import axiosInstance from '@/services/axiosInstance';

export async function createBooking(payload) {
  const response = await axiosInstance.post('/bookings', payload);
  return response.data;
}

export async function getMyBookings() {
  const response = await axiosInstance.get('/bookings/me');
  return response.data;
}

export default {
  createBooking,
  getMyBookings,
};

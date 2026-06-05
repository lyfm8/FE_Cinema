import axiosInstance from '@/services/axiosInstance';

export async function createBooking(payload) {
  const response = await axiosInstance.post('/bookings', payload);
  return response.data;
}

export async function getMyBookings() {
  const response = await axiosInstance.get('/bookings/my-bookings');
  return response.data;
}

export async function holdSeats(payload) {
  const response = await axiosInstance.post('/bookings/hold-seats', payload);
  return response.data;
}

export async function getBookedSeatsForShowtime(showtimeId) {
  const response = await axiosInstance.get(`/bookings/showtime/${showtimeId}/seats`);
  return response.data;
}

export default {
  createBooking,
  getMyBookings,
  holdSeats,
  getBookedSeatsForShowtime,
};

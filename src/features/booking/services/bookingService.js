import axiosInstance from '@/services/axiosInstance';

export async function createBooking(payload) {
  const response = await axiosInstance.post('/bookings', payload);
  return response.data;
}

export async function getMyBookings(page = 1, pageSize = 5) {
  const response = await axiosInstance.get('/bookings/my-bookings', {
    params: { page, pageSize },
  });
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

export async function getConcessions() {
  const response = await axiosInstance.get('/concessions');
  return response.data;
}

export default {
  createBooking,
  getMyBookings,
  holdSeats,
  getBookedSeatsForShowtime,
  getConcessions,
};

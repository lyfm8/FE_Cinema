import axiosInstance from '@/services/axiosInstance';

export async function prepareCheckout(bookingId) {
  const response = await axiosInstance.get(`/payments/prepare/${bookingId}`);
  return response.data;
}

export async function createPaymentUrl(payload) {
  const response = await axiosInstance.post('/payments/checkout', payload);
  return response.data;
}

export async function getPaymentStatus(bookingId) {
  const response = await axiosInstance.get(`/payments/status/${bookingId}`);
  return response.data;
}

export async function getPaymentStatusByBookingCode(bookingCode) {
  const response = await axiosInstance.get(`/payments/status-by-code/${bookingCode}`);
  return response.data;
}

export default {
  prepareCheckout,
  createPaymentUrl,
  getPaymentStatus,
  getPaymentStatusByBookingCode,
};

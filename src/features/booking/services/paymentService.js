import axiosInstance from '@/services/axiosInstance';

export async function createPaymentIntent(payload) {
  const response = await axiosInstance.post('/payments/intents', payload);
  return response.data;
}

export async function confirmPayment(payload) {
  const response = await axiosInstance.post('/payments/confirm', payload);
  return response.data;
}

export default {
  createPaymentIntent,
  confirmPayment,
};

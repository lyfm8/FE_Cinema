import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_COUNT = 20; // 20 × 3s = 60 giây polling tối đa

function usePaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingCode = searchParams.get('bookingCode');

  const [status, setStatus] = useState('PENDING');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pollCountRef = useRef(0);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    if (!bookingCode) return;

    try {
      const response = await axiosInstance.get(`/payments/status-by-code/${bookingCode}`);
      if (response.data?.success) {
        const data = response.data.data;
        setBookingData(data);
        setStatus(data.status);
        setLoading(false);

        // Dừng poll khi có kết quả cuối
        if (data.status === 'PAID' || data.status === 'FAILED' || data.status === 'EXPIRED') {
          clearInterval(intervalRef.current);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể lấy trạng thái thanh toán');
      setLoading(false);
      clearInterval(intervalRef.current);
    }

    pollCountRef.current += 1;
    if (pollCountRef.current >= MAX_POLL_COUNT) {
      clearInterval(intervalRef.current);
      setLoading(false);
    }
  }, [bookingCode]);

  useEffect(() => {
    if (!bookingCode) {
      navigate('/');
      return;
    }

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [bookingCode, fetchStatus]);

  return {
    bookingCode,
    status,
    bookingData,
    loading,
    error,
  };
}

export default usePaymentResultPage;

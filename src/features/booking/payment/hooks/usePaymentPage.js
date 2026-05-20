import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { confirmPayment } from '@/features/booking/services/paymentService';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function usePaymentPage(tx) {
  const navigate = useNavigate();
  const { selectedSeats } = useBooking();
  const [method, setMethod] = useState('CARD');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmPayment({
        method,
        customerName,
        seats: selectedSeats,
      });

      navigate('/booking/confirmation');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? tx('Payment failed.', 'Thanh toán thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    method,
    customerName,
    loading,
    error,
    totalPrice,
    setMethod,
    setCustomerName,
    handleSubmit,
  };
}

export default usePaymentPage;

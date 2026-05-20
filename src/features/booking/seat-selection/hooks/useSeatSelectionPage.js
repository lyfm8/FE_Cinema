import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { mockSeats } from '@/utils/mockData';

function useSeatSelectionPage() {
  const navigate = useNavigate();
  const { showtimeId } = useParams();
  const { selectedSeats, toggleSeat, setShowtime } = useBooking();

  useEffect(() => {
    setShowtime(showtimeId);
  }, [setShowtime, showtimeId]);

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleContinuePayment = () => {
    navigate('/booking/payment');
  };

  return {
    seats: mockSeats,
    selectedSeats,
    totalPrice,
    toggleSeat,
    handleContinuePayment,
  };
}

export default useSeatSelectionPage;

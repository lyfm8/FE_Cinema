import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { SEAT_STATUS } from '@/utils/constants';
import axiosInstance from '@/services/axiosInstance';
import useSeatSocket from '@/hooks/useSeatSocket';

function useSeatSelectionPage() {
  const navigate = useNavigate();
  const { showtimeId } = useParams();
  const { selectedSeats, toggleSeat, setShowtime } = useBooking();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rawSeats, setRawSeats] = useState([]);
  
  const { unavailableSeatIds } = useSeatSocket(showtimeId);

  const fetchShowtimeSeats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/showtimes/${showtimeId}`);
      if (response.data?.data?.seats) {
        setRawSeats(response.data.data.seats);
      }
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError('Không thể tải danh sách ghế. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => {
    if (showtimeId) {
      setShowtime(showtimeId);
      fetchShowtimeSeats();
    }
  }, [fetchShowtimeSeats, setShowtime, showtimeId]);

  const seats = useMemo(() => {
    if (!rawSeats || rawSeats.length === 0) return [];

    const grouped = {};
    rawSeats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      
      let finalStatus = seat.status?.toLowerCase() || SEAT_STATUS.AVAILABLE;
      if (unavailableSeatIds.includes(seat.seatId)) {
        finalStatus = SEAT_STATUS.RESERVED;
      }

      grouped[seat.row].push({
        id: seat.seatId,
        status: finalStatus,
        row: seat.row,
        col: seat.column,
      });
    });

    const sortedRows = Object.keys(grouped).sort();
    
    return sortedRows.map((rowLetter) => {
      const rowSeats = grouped[rowLetter].sort((a, b) => a.col - b.col);
      return {
        rowLabel: rowLetter,
        seats: rowSeats,
      };
    });
  }, [rawSeats, unavailableSeatIds]);

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleContinuePayment = async () => {
    if (selectedSeats.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      // Bước 1: Giữ ghế (5 phút – đồng bộ với backend timeout)
      await axiosInstance.post('/bookings/hold-seats', {
        showtimeId: Number(showtimeId),
        seatIds: selectedSeats,
      });

      // Bước 2: Tạo booking (backend tính tiền, không nhận từ FE)
      const bookingResponse = await axiosInstance.post('/bookings', {
        showtimeId: Number(showtimeId),
        seatIds: selectedSeats,
      });

      if (bookingResponse.data?.success) {
        const bookingId = bookingResponse.data.data?.id;
        navigate('/booking/checkout', { state: { bookingId } });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Không thể tiến hành đặt vé. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    seats,
    selectedSeats,
    totalPrice,
    toggleSeat,
    handleContinuePayment,
    loading,
    submitting,
    error,
  };
}

export default useSeatSelectionPage;


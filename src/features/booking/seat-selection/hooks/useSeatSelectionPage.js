import { useEffect, useMemo, useState } from 'react';
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
  const [rawSeats, setRawSeats] = useState([]);
  
  // Real-time socket updates
  const { unavailableSeatIds } = useSeatSocket(showtimeId);

  useEffect(() => {
    if (showtimeId) {
      setShowtime(showtimeId);
      fetchShowtimeSeats();
    }
  }, [setShowtime, showtimeId]);

  const fetchShowtimeSeats = async () => {
    try {
      setLoading(true);
      // Gọi API lấy chi tiết suất chiếu, trong đó BE đã đính kèm danh sách ghế ở mảng 'seats'
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
  };

  // Group rawSeats by row to match SeatMap component's expected structure
  const seats = useMemo(() => {
    if (!rawSeats || rawSeats.length === 0) return [];

    const grouped = {};
    rawSeats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      
      // Xác định trạng thái cuối cùng: nếu nằm trong list của Socket thì chuyển thành RESERVED
      let finalStatus = seat.status?.toLowerCase() || SEAT_STATUS.AVAILABLE;
      if (unavailableSeatIds.includes(seat.seatId)) {
        finalStatus = SEAT_STATUS.RESERVED; // hoặc SEAT_STATUS.SOLD tuỳ UI
      }

      grouped[seat.row].push({
        id: seat.seatId, // Numeric ID từ BE
        status: finalStatus,
        row: seat.row,
        col: seat.column,
      });
    });

    // Sắp xếp các hàng theo alphabet (A -> Z)
    const sortedRows = Object.keys(grouped).sort();
    
    return sortedRows.map((rowLetter) => {
      // Sắp xếp ghế trong hàng theo cột (1 -> 16)
      const rowSeats = grouped[rowLetter].sort((a, b) => a.col - b.col);
      return {
        rowLabel: rowLetter,
        seats: rowSeats,
      };
    });
  }, [rawSeats, unavailableSeatIds]);

  // Giả sử giá vé tạm thời là 90k, thực tế sẽ phải tính giá linh hoạt dựa trên roomType/dayType
  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleContinuePayment = () => {
    // FE chỉ chuyển hướng, lúc nào render trang Checkout mới gọi API holdSeats
    navigate('/booking/payment');
  };

  return {
    seats,
    selectedSeats,
    totalPrice,
    toggleSeat,
    handleContinuePayment,
    loading,
    error,
  };
}

export default useSeatSelectionPage;

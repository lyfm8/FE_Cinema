import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { SEAT_STATUS } from '@/utils/constants';

function generateSeats() {
  const rows = [];
  const rowLetters = 'ABCDEFGHIJKLMN'.split('');
  
  for (const letter of rowLetters) {
    const rowSeats = [];
    for (let i = 1; i <= 16; i++) {
      let status = SEAT_STATUS.AVAILABLE;
      
      // Randomly assign some sold/reserved status for mockup
      const rand = Math.random();
      if (rand < 0.1) {
        status = SEAT_STATUS.SOLD;
      } else if (rand < 0.15) {
        status = SEAT_STATUS.RESERVED;
      }
      
      rowSeats.push({
        id: `${letter}${i}`,
        status,
        row: letter,
        col: i,
      });
    }
    rows.push({ rowLabel: letter, seats: rowSeats });
  }
  return rows;
}

function useSeatSelectionPage() {
  const navigate = useNavigate();
  const { showtimeId } = useParams();
  const { selectedSeats, toggleSeat, setShowtime } = useBooking();
  
  // Use useMemo so the random generation doesn't re-run on every re-render
  const seats = useMemo(() => generateSeats(), []);

  useEffect(() => {
    setShowtime(showtimeId);
  }, [setShowtime, showtimeId]);

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleContinuePayment = () => {
    navigate('/booking/payment');
  };

  return {
    seats,
    selectedSeats,
    totalPrice,
    toggleSeat,
    handleContinuePayment,
  };
}

export default useSeatSelectionPage;

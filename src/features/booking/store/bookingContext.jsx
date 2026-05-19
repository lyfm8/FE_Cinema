import { useCallback, useMemo, useReducer } from 'react';
import bookingReducer, { BOOKING_ACTION_TYPES, initialBookingState } from '@/features/booking/store/bookingReducer';
import { BookingContext } from '@/features/booking/store/bookingStore';

function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);

  const setShowtime = useCallback((showtimeId) => {
    dispatch({ type: BOOKING_ACTION_TYPES.SET_SHOWTIME, payload: showtimeId });
  }, []);

  const toggleSeat = useCallback((seatId) => {
    dispatch({ type: BOOKING_ACTION_TYPES.TOGGLE_SEAT, payload: seatId });
  }, []);

  const resetBooking = useCallback(() => {
    dispatch({ type: BOOKING_ACTION_TYPES.RESET_BOOKING });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setShowtime,
      toggleSeat,
      resetBooking,
    }),
    [state, setShowtime, toggleSeat, resetBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export { BookingProvider };
export default BookingProvider;


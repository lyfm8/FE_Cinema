import { useContext } from 'react';
import { BookingContext } from '@/features/booking/store/bookingStore';

function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error('useBooking must be used within BookingProvider.');
  }

  return context;
}

export default useBooking;


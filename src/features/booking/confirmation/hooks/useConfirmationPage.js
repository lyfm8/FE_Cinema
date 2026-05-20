import useBooking from '@/features/booking/hooks/useBooking';

function useConfirmationPage() {
  const { selectedSeats } = useBooking();

  return {
    selectedSeats,
  };
}

export default useConfirmationPage;

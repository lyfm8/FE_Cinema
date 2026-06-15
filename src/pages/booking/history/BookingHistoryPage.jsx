import { useEffect, useState } from 'react';
import BookingHistory from '@/pages/profile/components/BookingHistory';
import ETicketModal from '@/pages/profile/components/ETicketModal';
import { getMyBookings } from '@/features/booking/services/bookingService';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function BookingHistoryPage() {
  const { tx } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      setLoading(true);
      try {
        const result = await getMyBookings();
        if (mounted && result && result.status !== 'rejected') {
          setBookings(result.data || result);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBookings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-ink">{tx('Booking History', 'Lịch sử đặt vé')}</h1>
      </div>

      <div className="rounded-xl bg-white">
        <BookingHistory bookings={bookings} loading={loading} onViewTicket={handleViewTicket} />
      </div>

      <ETicketModal
        isOpen={isTicketModalOpen}
        booking={selectedBooking}
        onClose={handleCloseTicketModal}
      />
    </div>
  );
}

export default BookingHistoryPage;

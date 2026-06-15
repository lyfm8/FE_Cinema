import { useEffect, useState, useCallback } from 'react';
import BookingHistory from '@/pages/profile/components/BookingHistory';
import ETicketModal from '@/pages/profile/components/ETicketModal';
import { getMyBookings } from '@/features/booking/services/bookingService';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const PAGE_SIZE = 5;

function BookingHistoryPage() {
  const { tx } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 0 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const loadBookings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result = await getMyBookings(page, PAGE_SIZE);
      if (result) {
        setBookings(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings(1);
  }, [loadBookings]);

  const handlePageChange = (newPage) => {
    loadBookings(newPage);
  };

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

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 pb-4">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="rounded-lg border border-base bg-white px-3 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← {tx('Previous', 'Trước')}
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all ${
                pageNum === pagination.page
                  ? 'bg-[#034ea2] text-white shadow-md'
                  : 'border border-base bg-white text-ink/70 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="rounded-lg border border-base bg-white px-3 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tx('Next', 'Sau')} →
          </button>
        </div>
      )}

      <ETicketModal
        isOpen={isTicketModalOpen}
        booking={selectedBooking}
        onClose={handleCloseTicketModal}
      />
    </div>
  );
}

export default BookingHistoryPage;

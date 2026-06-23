import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicMovieService } from '@/features/movies/services/movieService';
import { staffHoldSeats, staffCreateBooking, getBookedSeatsForShowtime, getConcessions } from '@/features/booking/services/bookingService';
import useBooking from '@/features/booking/hooks/useBooking';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { io } from 'socket.io-client';
import InlineSeatBooking from '@/pages/movies/movie-detail/components/InlineSeatBooking';

// We reuse the normalization functions from InlineSeatBooking here or just import them if they were exported.
// Since they are not exported, we will duplicate the normalization logic.
const ROOM_PRICES = {
  standard: 75000,
  vip: 120000,
  imax: 150000,
  couple: 200000,
};

function normalizeRoomType(value) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("vip")) return "vip";
  if (normalized.includes("imax")) return "imax";
  if (normalized.includes("couple")) return "couple";
  return "standard";
}

function normalizeSeatStatus(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["booked", "sold", "reserved", "maintenance", "confirmed"].includes(normalized)) return "booked";
  if (normalized === "selected") return "available";
  if (normalized === "holding") return "booked";
  return "available";
}

function normalizeSeat(rawSeat, defaultIsCouple) {
  if (!rawSeat) return null;
  const seatId = rawSeat.seatId ?? rawSeat.id;
  if (seatId === undefined || seatId === null) return null;
  const row = String(rawSeat.row ?? "").toUpperCase();
  const column = Number(rawSeat.column ?? rawSeat.number ?? 0);
  if (!row || Number.isNaN(column) || column <= 0) return null;

  return {
    seatId: String(seatId),
    row,
    column,
    status: normalizeSeatStatus(rawSeat.status),
    isCouple: Boolean(rawSeat.isCouple ?? defaultIsCouple),
    label: rawSeat.label || `${row}${column}`,
  };
}

function normalizeShowtimeDetail(rawShowtime) {
  const roomType = normalizeRoomType(rawShowtime?.roomType ?? rawShowtime?.room?.roomType);
  const rows = Number(rawShowtime?.rows ?? rawShowtime?.room?.rows) || 0;
  const columns = Number(rawShowtime?.columns ?? rawShowtime?.room?.columns) || 0;
  const isCouple = Boolean(rawShowtime?.room?.isCouple) || roomType === "couple";

  const rawSeats = Array.isArray(rawShowtime?.seats) ? rawShowtime.seats : Array.isArray(rawShowtime?.room?.seats) ? rawShowtime.room.seats : [];
  const seats = rawSeats.map((seat) => normalizeSeat(seat, isCouple)).filter(Boolean);
  seats.sort((a, b) => a.row.localeCompare(b.row) || a.column - b.column);

  return {
    id: rawShowtime?.id,
    roomType,
    rows,
    columns,
    isCouple,
    roomName: rawShowtime?.room?.name || rawShowtime?.roomName || "",
    format: rawShowtime?.format || "",
    seats,
  };
}

function StaffSeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const { selectedSeats, toggleSeat, resetBooking } = useBooking();

  const [showtime, setShowtime] = useState(null);
  const [showtimeDetail, setShowtimeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [concessionProducts, setConcessionProducts] = useState([]);
  const [selectedConcessions, setSelectedConcessions] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    resetBooking();
    getConcessions().then(res => setConcessionProducts(res.data || []));

    const loadData = async () => {
      try {
        setLoading(true);
        const [response, bookedResponse] = await Promise.all([
          publicMovieService.getShowtimeById(showtimeId),
          getBookedSeatsForShowtime(showtimeId).catch(() => ({ data: { allUnavailableSeatIds: [] } }))
        ]);
        
        setShowtime(response?.data);
        const normalized = normalizeShowtimeDetail(response?.data || {});
        const unavailableIds = bookedResponse?.data?.allUnavailableSeatIds || [];

        if (unavailableIds.length > 0 && normalized.seats) {
          normalized.seats = normalized.seats.map(seat => {
            if (unavailableIds.includes(Number(seat.seatId))) {
              return { ...seat, status: 'booked' };
            }
            return seat;
          });
        }
        setShowtimeDetail(normalized);
      } catch (err) {
        setError("LOAD_SEATMAP_FAILED");
      } finally {
        setLoading(false);
      }
    };

    if (showtimeId) loadData();
  }, [showtimeId, resetBooking]);

  useEffect(() => {
    if (!showtimeId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000/seat';
    const socket = io(socketUrl, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('join-showtime', { showtimeId: Number(showtimeId) });
    });

    socket.on('seat-update', (data) => {
      if (data && data.allUnavailableSeatIds) {
        setShowtimeDetail((prev) => {
          if (!prev || !prev.seats) return prev;
          const newSeats = prev.seats.map((seat) => {
            const isBooked = data.allUnavailableSeatIds.includes(Number(seat.seatId));
            const newStatus = isBooked ? 'booked' : 'available';
            if (seat.status !== newStatus) {
              return { ...seat, status: newStatus };
            }
            return seat;
          });
          return { ...prev, seats: newSeats };
        });
      }
    });

    return () => {
      socket.emit('leave-showtime', { showtimeId: Number(showtimeId) });
      socket.disconnect();
    };
  }, [showtimeId]);

  const selectedSeatIdSet = useMemo(() => new Set((selectedSeats || []).map((seatId) => String(seatId))), [selectedSeats]);
  const selectedSeatObjects = useMemo(() => {
    if (!showtimeDetail?.seats?.length) return [];
    return showtimeDetail.seats.filter((seat) => selectedSeatIdSet.has(seat.seatId));
  }, [showtimeDetail, selectedSeatIdSet]);
  const selectedSeatLabels = useMemo(() => selectedSeatObjects.map((seat) => seat.label), [selectedSeatObjects]);
  const pricePerSeat = ROOM_PRICES[showtimeDetail?.roomType] ?? ROOM_PRICES.standard;
  const totalPrice = selectedSeatObjects.length * pricePerSeat;

  const handleConcessionChange = (productId, delta) => {
    setSelectedConcessions((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const concessionTotal = Object.entries(selectedConcessions).reduce((sum, [id, qty]) => {
    const product = concessionProducts.find((p) => p.id === Number(id));
    return sum + (product?.price || 0) * qty;
  }, 0);

  const grandTotal = totalPrice + concessionTotal;

  const handleToggleSeat = (seat) => {
    if (!seat || seat.status === "booked") return;
    toggleSeat(seat.seatId);
  };

  const [customerId, setCustomerId] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResult, setCustomerResult] = useState(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);

  const handleSearchCustomer = async () => {
    if (!customerSearch.trim()) return;
    setSearchingCustomer(true);
    try {
      const axiosInstance = (await import('@/services/axiosInstance')).default;
      const res = await axiosInstance.get(`/users/search?keyword=${customerSearch}`);
      if (res.data?.data && res.data.data.length > 0) {
        setCustomerResult(res.data.data[0]);
        setCustomerId(res.data.data[0].id);
      } else {
        alert("Không tìm thấy khách hàng nào.");
        setCustomerResult(null);
        setCustomerId(null);
      }
    } catch (err) {
      alert("Lỗi tìm kiếm khách hàng.");
    } finally {
      setSearchingCustomer(false);
    }
  };

  const confirmBooking = async () => {
    setBookingLoading(true);
    try {
      const seatIds = selectedSeatObjects.map(s => Number(s.seatId));
      
      await staffHoldSeats({
        showtimeId: Number(showtimeId),
        seatIds,
      });

      const concessionItems = Object.entries(selectedConcessions)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ productId: Number(id), quantity: qty }));

      const bookingPayload = {
        showtimeId: Number(showtimeId),
        seatIds,
        source: 'OFFLINE',
      };
      if (customerId) bookingPayload.customerId = customerId;
      if (concessionItems.length > 0) bookingPayload.concessions = concessionItems;

      const response = await staffCreateBooking(bookingPayload);
      setShowConfirmModal(false);
      navigate(`/staff/ticket-sale/${response.data.id}/checkout`);
    } catch (err) {
      console.error(err);
      setShowConfirmModal(false);
      alert(err?.response?.data?.message || "Không thể đặt vé.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="page-container py-8 max-w-5xl">
      <div className="mb-4 space-y-2">
        <p className="text-sm font-bold text-galaxyBlue uppercase tracking-widest">{tx('Staff Ticket Sale', 'Bán vé tại quầy')}</p>
      </div>

      <InlineSeatBooking
        showtime={showtime}
        showtimeDetail={showtimeDetail}
        loading={loading}
        error={error}
        selectedSeatIds={selectedSeats}
        selectedSeatLabels={selectedSeatLabels}
        pricePerSeat={pricePerSeat}
        totalPrice={totalPrice}
        onBack={() => navigate('/staff/ticket-sale')}
        onToggleSeat={handleToggleSeat}
        onBookTickets={() => setShowConfirmModal(true)}
        showConfirmModal={false}
        onCloseConfirmModal={() => setShowConfirmModal(false)}
        onConfirmBooking={confirmBooking}
        bookingLoading={bookingLoading}
        concessionProducts={concessionProducts}
        selectedConcessions={selectedConcessions}
        onConcessionChange={handleConcessionChange}
        concessionTotal={concessionTotal}
        grandTotal={grandTotal}
      />
      
      {/* Ghi đè Confirm Modal mặc định của InlineSeatBooking */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-[fadeInUp_0.25s_ease-out]">
            <div className="bg-gradient-to-r from-[#034ea2] to-[#0366d6] px-6 py-5 text-white">
              <h3 className="text-lg font-bold">{tx('Customer & Confirm Booking', 'Thông tin khách hàng & Xác nhận')}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Customer Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone uppercase tracking-wide">
                  {tx('Search Customer (Phone/Email) - Optional', 'Tìm khách hàng (SĐT/Email) - Không bắt buộc')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-galaxyBlue focus:outline-none focus:ring-1 focus:ring-galaxyBlue"
                    placeholder="SĐT hoặc Email"
                  />
                  <button
                    type="button"
                    onClick={handleSearchCustomer}
                    disabled={searchingCustomer || !customerSearch}
                    className="rounded-lg bg-galaxyBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {searchingCustomer ? '...' : tx('Search', 'Tìm')}
                  </button>
                </div>
                {customerResult && (
                  <div className="p-2 bg-green-50 rounded border border-green-100 mt-2">
                    <p className="text-sm font-semibold text-green-800">{customerResult.fullName || customerResult.email}</p>
                    <p className="text-xs text-green-700">Điểm hiện có: <span className="font-bold">{customerResult.loyaltyPoints || 0}</span></p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-ink/70">
                  <span>{tx('Seats', 'Ghế')} ({selectedSeatLabels?.length || 0}x)</span>
                  <span className="font-semibold text-ink">{totalPrice.toLocaleString('vi-VN')} đ</span>
                </div>
                {concessionTotal > 0 && (
                  <div className="flex items-center justify-between text-sm text-ink/70">
                    <span>{tx('Concessions', 'Bắp nước')}</span>
                    <span className="font-semibold text-ink">{concessionTotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase text-ink/70">{tx('Grand Total', 'Tổng cộng')}</p>
                  <p className="text-xl font-bold text-[#f26b38]">{grandTotal.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={bookingLoading}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-stone hover:bg-gray-50 disabled:opacity-50"
              >
                {tx('Cancel', 'Hủy')}
              </button>
              <button
                type="button"
                onClick={confirmBooking}
                disabled={bookingLoading}
                className="flex-1 rounded-xl bg-[#f26b38] py-3 text-sm font-bold text-white hover:bg-[#fb9440] disabled:opacity-60"
              >
                {bookingLoading ? '...' : tx('Create Booking', 'Tạo đơn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffSeatSelectionPage;

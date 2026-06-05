import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBooking from "@/features/booking/hooks/useBooking";
import { publicMovieService } from "@/features/movies/services/movieService";
import { holdSeats, createBooking, getBookedSeatsForShowtime } from "@/features/booking/services/bookingService";
import { io } from "socket.io-client";

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

  if (
    ["booked", "sold", "reserved", "maintenance", "confirmed"].includes(
      normalized,
    )
  ) {
    return "booked";
  }

  // "selected" từ backend thường là trạng thái hold tạm thời,
  // không nên render như local selected của user hiện tại.
  if (normalized === "selected") {
    return "available";
  }

  // Ghế đang bị người khác hold tạm xem như không còn trống.
  if (normalized === "holding") {
    return "booked";
  }

  return "available";
}

function toSeatLabel(row, column) {
  return `${row}${column}`;
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
    label: rawSeat.label || toSeatLabel(row, column),
  };
}

function normalizeShowtimeDetail(rawShowtime) {
  const roomType = normalizeRoomType(
    rawShowtime?.roomType ?? rawShowtime?.room?.roomType,
  );

  const rows =
    Number(
      rawShowtime?.rows ?? rawShowtime?.room?.rows,
    ) || 0;
  const columns =
    Number(
      rawShowtime?.columns ??
        rawShowtime?.room?.columns,
    ) || 0;
  const isCouple =
    Boolean(rawShowtime?.room?.isCouple) || roomType === "couple";

  const rawSeats = Array.isArray(rawShowtime?.seats)
    ? rawShowtime.seats
    : Array.isArray(rawShowtime?.room?.seats)
      ? rawShowtime.room.seats
      : [];

  const seats = rawSeats
    .map((seat) => normalizeSeat(seat, isCouple))
    .filter(Boolean);

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

function useInlineSeatBooking() {
  const navigate = useNavigate();
  const { selectedSeats, setShowtime, toggleSeat, resetBooking } = useBooking();

  const [activeShowtime, setActiveShowtime] = useState(null);
  const [showtimeDetail, setShowtimeDetail] = useState(null);
  const [loadingSeatMap, setLoadingSeatMap] = useState(false);
  const [seatMapError, setSeatMapError] = useState("");

  const selectedSeatIdSet = useMemo(
    () => new Set((selectedSeats || []).map((seatId) => String(seatId))),
    [selectedSeats],
  );

  const selectedSeatObjects = useMemo(() => {
    if (!showtimeDetail?.seats?.length) return [];
    return showtimeDetail.seats.filter((seat) =>
      selectedSeatIdSet.has(seat.seatId),
    );
  }, [showtimeDetail, selectedSeatIdSet]);

  const selectedSeatLabels = useMemo(
    () => selectedSeatObjects.map((seat) => seat.label),
    [selectedSeatObjects],
  );

  const pricePerSeat =
    ROOM_PRICES[showtimeDetail?.roomType] ?? ROOM_PRICES.standard;

  const totalPrice = useMemo(
    () => selectedSeatObjects.length * pricePerSeat,
    [selectedSeatObjects.length, pricePerSeat],
  );

  const selectShowtime = async (showtime) => {
    if (!showtime?.id) return;

    setLoadingSeatMap(true);
    setSeatMapError("");
    setActiveShowtime(showtime);
    setShowtime(String(showtime.id));

    try {
      const [response, bookedResponse] = await Promise.all([
        publicMovieService.getShowtimeById(showtime.id),
        getBookedSeatsForShowtime(showtime.id).catch(() => ({ data: { allUnavailableSeatIds: [] } }))
      ]);
      
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
    } catch (error) {
      console.error("Failed to load showtime seat map:", error);
      setSeatMapError("LOAD_SEATMAP_FAILED");
      setShowtimeDetail(null);
    } finally {
      setLoadingSeatMap(false);
    }
  };

  // WebSocket setup for realtime seat map updates
  useEffect(() => {
    if (!activeShowtime?.id) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
    const socketUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const socket = io(`${socketUrl}/seat`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join-showtime", { showtimeId: activeShowtime.id });
    });

    socket.on("seat-update", (data) => {
      const { allUnavailableSeatIds } = data;
      
      setShowtimeDetail((prev) => {
        if (!prev || !prev.seats) return prev;
        
        const newSeats = prev.seats.map((seat) => {
          const isUnavailable = allUnavailableSeatIds.includes(Number(seat.seatId));
          const newStatus = isUnavailable ? "booked" : "available";
          
          if (seat.status !== newStatus && seat.status !== "maintenance") {
            return { ...seat, status: newStatus };
          }
          return seat;
        });

        return { ...prev, seats: newSeats };
      });
    });

    return () => {
      socket.emit("leave-showtime", { showtimeId: activeShowtime.id });
      socket.disconnect();
    };
  }, [activeShowtime?.id]);

  const handleToggleSeat = (seat) => {
    if (!seat || seat.status === "booked") return;
    toggleSeat(seat.seatId);
  };

  const handleBackToShowtimes = () => {
    setActiveShowtime(null);
    setShowtimeDetail(null);
    setSeatMapError("");
    setLoadingSeatMap(false);
    resetBooking();
  };

  const handleBookTickets = async () => {
    if (selectedSeatObjects.length === 0 || !activeShowtime?.id) return;

    const isConfirm = window.confirm("Xác nhận tạo đơn đặt vé?");
    if (!isConfirm) return;

    try {
      const seatIds = selectedSeatObjects.map(s => Number(s.seatId) || s.seatId);
      
      // Bắt buộc phải hold ghế trong Redis trước khi tạo đơn
      await holdSeats({
        showtimeId: activeShowtime.id,
        seatIds,
      });

      // Sau đó gọi API tạo Booking
      const response = await createBooking({
        showtimeId: activeShowtime.id,
        seatIds,
      });

      // Bỏ qua resetBooking để giữ giao diện, chuyển sang trang Thanh toán cùng bookingId
      navigate("/booking/payment", { state: { bookingId: response.data.id } });
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert(err?.response?.data?.message || "Không thể đặt vé. Vui lòng thử lại!");
    }
  };

  return {
    activeShowtime,
    showtimeDetail,
    loadingSeatMap,
    seatMapError,
    selectedSeats,
    selectedSeatLabels,
    pricePerSeat,
    totalPrice,
    selectShowtime,
    handleToggleSeat,
    handleBackToShowtimes,
    handleBookTickets,
  };
}

export default useInlineSeatBooking;

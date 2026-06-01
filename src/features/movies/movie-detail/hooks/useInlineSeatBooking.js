import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBooking from "@/features/booking/hooks/useBooking";
import { publicMovieService } from "@/features/movies/services/movieService";

const ROOM_PRICES = {
  standard: 75000,
  vip: 120000,
  imax: 150000,
  couple: 200000,
};

const ROOM_LAYOUTS = {
  standard: { rows: 8, columns: 10 },
  vip: { rows: 4, columns: 10 },
  imax: { rows: 10, columns: 12 },
  couple: { rows: 2, columns: 10 },
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

function buildFallbackSeats(rows, columns, isCouple) {
  const generated = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    for (let column = 1; column <= columns; column += 1) {
      const seatId = `${rowLabel}${column}`;
      generated.push({
        seatId,
        row: rowLabel,
        column,
        status: "available",
        isCouple,
        label: toSeatLabel(rowLabel, column),
      });
    }
  }

  return generated;
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
  const defaultLayout = ROOM_LAYOUTS[roomType] || ROOM_LAYOUTS.standard;

  const rows =
    Number(
      rawShowtime?.rows ?? rawShowtime?.room?.rows ?? defaultLayout.rows,
    ) || defaultLayout.rows;
  const columns =
    Number(
      rawShowtime?.columns ??
        rawShowtime?.room?.columns ??
        defaultLayout.columns,
    ) || defaultLayout.columns;
  const isCouple =
    Boolean(rawShowtime?.room?.isCouple) || roomType === "couple";

  const rawSeats = Array.isArray(rawShowtime?.seats)
    ? rawShowtime.seats
    : Array.isArray(rawShowtime?.room?.seats)
      ? rawShowtime.room.seats
      : [];

  let seats = rawSeats
    .map((seat) => normalizeSeat(seat, isCouple))
    .filter(Boolean);

  if (seats.length === 0) {
    seats = buildFallbackSeats(rows, columns, isCouple);
  }

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
      const response = await publicMovieService.getShowtimeById(showtime.id);
      const normalized = normalizeShowtimeDetail(response?.data || {});
      setShowtimeDetail(normalized);
    } catch (error) {
      console.error("Failed to load showtime seat map:", error);
      setSeatMapError("LOAD_SEATMAP_FAILED");
      setShowtimeDetail(null);
    } finally {
      setLoadingSeatMap(false);
    }
  };

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

  const handleBookTickets = () => {
    if (selectedSeatObjects.length === 0) return;
    navigate("/booking/payment");
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

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import SeatMap from "@/pages/movies/movie-detail/components/SeatMap";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import { formatCurrency } from "@/utils/formatCurrency";

const ROOM_LABELS = {
  standard: { en: "Standard", vi: "Thường" },
  vip: { en: "VIP", vi: "VIP" },
  imax: { en: "IMAX", vi: "IMAX" },
  couple: { en: "Couple", vi: "Couple" },
};

const AVAILABLE_COLOR_CLASS = "bg-violet-100 border-violet-200";

function formatShowtimeDateTime(showtime) {
  const startTime = showtime?.movieStartTime || showtime?.publicStartTime;
  if (!startTime) return "";

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function LegendItem({ label, className }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/75 px-2.5 py-1.5 text-xs font-semibold text-stone shadow-sm">
      <span className={`h-4 w-4 rounded-md border ${className}`} />
      <span>{label}</span>
    </div>
  );
}

/**
 * @param {{
 *   showtime: any,
 *   showtimeDetail: any,
 *   loading: boolean,
 *   error: string,
 *   selectedSeatIds: string[],
 *   selectedSeatLabels: string[],
 *   pricePerSeat: number,
 *   totalPrice: number,
 *   onBack: () => void,
 *   onToggleSeat: (seat: any) => void,
 *   onBookTickets: () => void,
 * }} props
 */
function InlineSeatBooking({
  showtime,
  showtimeDetail,
  loading,
  error,
  selectedSeatIds,
  selectedSeatLabels,
  pricePerSeat,
  totalPrice,
  onBack,
  onToggleSeat,
  onBookTickets,
}) {
  const { tx } = useLanguage();

  const roomType = showtimeDetail?.roomType || "standard";
  const roomLabel = ROOM_LABELS[roomType] || ROOM_LABELS.standard;
  const showtimeLabel = formatShowtimeDateTime(showtime);
  const availableLegendClass = AVAILABLE_COLOR_CLASS;
  const priceUnit =
    roomType === "couple" ? tx("/couple seat", "/cặp") : tx("/seat", "/ghế");
  const selectedSeatCount = selectedSeatLabels.length;

  return (
    <section className="surface-card space-y-6 overflow-hidden p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="px-0 py-0 text-sm font-semibold text-galaxyBlue hover:bg-transparent"
          >
            {"<-"} {tx("Back to showtimes", "Quay lại lịch chiếu")}
          </Button>
          <h3 className="text-2xl font-bold text-ink">
            {tx("Choose your seats", "Chọn ghế của bạn")}
          </h3>
          {showtimeLabel ? (
            <p className="text-sm text-stone">{showtimeLabel}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">{tx(roomLabel.en, roomLabel.vi)}</Badge>
          <Badge tone="muted">
            {tx("Room", "Phòng")}{" "}
            {showtimeDetail?.roomName ||
              showtime?.room?.name ||
              showtime?.roomId ||
              "N/A"}
          </Badge>
          {showtimeDetail?.format ? (
            <Badge tone="muted">
              {String(showtimeDetail.format).replace("FORMAT_", "")}
            </Badge>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-lg border-base bg-cream p-8 text-sm text-stone">
          <Spinner />
          <span>{tx("Loading seat map...", "Đang tải sơ đồ ghế...")}</span>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-lg border border-rose bg-rose/10 p-4 text-sm text-rose">
          {tx(
            "Failed to load seat map. Please try another showtime.",
            "Tải sơ đồ ghế thất bại. Vui lòng thử lịch chiếu khác.",
          )}
        </div>
      ) : null}

      {!loading && !error && showtimeDetail ? (
        <>
          <SeatMap
            roomType={showtimeDetail.roomType}
            format={showtimeDetail.format}
            rows={showtimeDetail.rows}
            columns={showtimeDetail.columns}
            seats={showtimeDetail.seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
          />

          <div className="flex flex-wrap items-center gap-3 rounded-xl border-base bg-paper/95 p-3">
            <LegendItem
              label={tx("Available (zone color)", "Còn trống (màu zone)")}
              className={availableLegendClass}
            />
            <LegendItem
              label={tx("Booked", "Đã đặt")}
              className="bg-gray-300 border-gray-400"
            />
            <LegendItem
              label={tx("Selected", "Đang chọn")}
              className="bg-orange-500 border-orange-600"
            />
          </div>

          <div className="grid gap-4 rounded-xl border-base bg-cream/40 p-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                  {tx("Selected seats", "Ghế đang chọn")}
                </p>
                <span className="rounded-full bg-galaxyBlue/10 px-2 py-0.5 text-[11px] font-semibold text-galaxyBlue">
                  {selectedSeatCount}
                </span>
              </div>

              {selectedSeatCount > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeatLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-charcoal">
                  {tx("No seat selected", "Chưa chọn ghế")}
                </p>
              )}

              <p className="text-xs text-stone">
                {tx("Price", "Giá")}: {formatCurrency(pricePerSeat)} {priceUnit}
              </p>
            </div>

            <div className="space-y-3 md:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                {tx("Total", "Tổng tiền")}
              </p>
              <p className="text-2xl font-bold text-galaxyBlue">
                {formatCurrency(totalPrice)}
              </p>
              <Button
                className="w-full md:min-w-[160px]"
                onClick={onBookTickets}
                disabled={selectedSeatCount === 0}
              >
                {tx("Book ticket", "Đặt vé")}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default InlineSeatBooking;

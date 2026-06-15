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
  showConfirmModal,
  onCloseConfirmModal,
  onConfirmBooking,
  bookingLoading,
  concessionProducts,
  selectedConcessions,
  onConcessionChange,
  concessionTotal,
  grandTotal,
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
          </div>

          {/* ─── Concession Picker ─── */}
          {concessionProducts && concessionProducts.length > 0 && (
            <div className="rounded-xl border-base bg-cream/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-3">
                {tx("Food & Drinks", "Bắp nước kèm theo")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {concessionProducts.map((product) => {
                  const qty = selectedConcessions[product.id] || 0;
                  return (
                    <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg border border-base bg-white px-3 py-2.5 shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{product.name}</p>
                        <p className="text-xs font-medium text-primary">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onConcessionChange(product.id, -1)}
                          disabled={qty === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-base bg-gray-50 text-sm font-bold text-ink/60 transition-colors hover:bg-gray-100 disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink">{qty}</span>
                        <button
                          type="button"
                          onClick={() => onConcessionChange(product.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-base bg-[#034ea2]/5 text-sm font-bold text-[#034ea2] transition-colors hover:bg-[#034ea2]/10"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {concessionTotal > 0 && (
                <p className="mt-3 text-right text-xs text-ink/60">
                  {tx("Concession subtotal", "Tạm tính bắp nước")}: <span className="font-semibold text-ink">{formatCurrency(concessionTotal)}</span>
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border-base bg-cream/40 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone">
              {tx("Order Summary", "Chi tiết đơn hàng")}
            </p>

            {/* Seat line */}
            <div className="flex items-center justify-between text-sm text-ink/80">
              <span>{tx("Seats", "Ghế")} ({selectedSeatCount}x {formatCurrency(pricePerSeat)})</span>
              <span className="font-semibold text-ink">{formatCurrency(totalPrice)}</span>
            </div>

            {/* Concession lines */}
            {concessionProducts && concessionProducts.filter(p => (selectedConcessions[p.id] || 0) > 0).map((product) => {
              const qty = selectedConcessions[product.id];
              return (
                <div key={product.id} className="flex items-center justify-between text-sm text-ink/80">
                  <span>{product.name} ({qty}x {formatCurrency(product.price)})</span>
                  <span className="font-semibold text-ink">{formatCurrency(product.price * qty)}</span>
                </div>
              );
            })}

            {/* Divider + Grand Total */}
            <div className="border-t border-base pt-3 flex items-center justify-between">
              <p className="text-sm font-bold uppercase text-ink/70">
                {tx("Grand Total", "Tổng cộng")}
              </p>
              <p className="text-2xl font-bold text-galaxyBlue">
                {formatCurrency(grandTotal)}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                className="w-full md:min-w-[200px]"
                onClick={onBookTickets}
                disabled={selectedSeatCount === 0}
              >
                {tx("Book ticket", "Đặt vé")}
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {/* ─── Confirm Booking Modal ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-[fadeInUp_0.25s_ease-out]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#034ea2] to-[#0366d6] px-6 py-5 text-white">
              <h3 className="text-lg font-bold">{tx('Confirm Booking', 'Xác nhận đặt vé')}</h3>
              <p className="text-sm text-white/80 mt-1">{tx('Please review your booking details', 'Vui lòng kiểm tra thông tin đặt vé')}</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#034ea2]/10 text-[#034ea2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div>
                  <p className="text-xs text-ink/50 font-medium uppercase">{tx('Showtime', 'Suất chiếu')}</p>
                  <p className="text-sm font-semibold text-ink">{formatShowtimeDateTime(showtime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f26b38]/10 text-[#f26b38]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="text-xs text-ink/50 font-medium uppercase">{tx('Seats', 'Ghế đã chọn')}</p>
                  <p className="text-sm font-semibold text-ink">
                    {selectedSeatLabels && selectedSeatLabels.length > 0
                      ? selectedSeatLabels.join(', ')
                      : 'N/A'}
                    <span className="text-ink/50 font-normal ml-1">({selectedSeatLabels?.length || 0} {tx('seats', 'ghế')})</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-[#034ea2]/5 to-[#f26b38]/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-ink/70">
                  <span>{tx('Seats', 'Ghế')} ({selectedSeatLabels?.length || 0}x {formatCurrency(pricePerSeat)})</span>
                  <span className="font-semibold text-ink">{formatCurrency(totalPrice)}</span>
                </div>
                {concessionProducts && concessionProducts.filter(p => (selectedConcessions[p.id] || 0) > 0).map((product) => {
                  const qty = selectedConcessions[product.id];
                  return (
                    <div key={product.id} className="flex items-center justify-between text-sm text-ink/70">
                      <span>{product.name} ({qty}x {formatCurrency(product.price)})</span>
                      <span className="font-semibold text-ink">{formatCurrency(product.price * qty)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-base/50 pt-2 mt-2 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase text-ink/70">{tx('Grand Total', 'Tổng cộng')}</p>
                  <p className="text-xl font-bold text-[#034ea2]">{formatCurrency(grandTotal)}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={onCloseConfirmModal}
                disabled={bookingLoading}
                className="flex-1 rounded-xl border border-base bg-white py-3 text-sm font-semibold text-ink/70 transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
              >
                {tx('Cancel', 'Hủy')}
              </button>
              <button
                type="button"
                onClick={onConfirmBooking}
                disabled={bookingLoading}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#f26b38] to-[#fb9440] py-3 text-sm font-bold text-white shadow-lg shadow-[#f26b38]/25 transition-all hover:shadow-xl hover:shadow-[#f26b38]/30 active:scale-[0.98] disabled:opacity-60"
              >
                {bookingLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    {tx('Processing...', 'Đang xử lý...')}
                  </span>
                ) : tx('Confirm Booking', 'Xác nhận đặt vé')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default InlineSeatBooking;

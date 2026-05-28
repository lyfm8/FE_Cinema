import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useBulkCreateShowtime from "@/features/admin/showtimes/hooks/useBulkCreateShowtime";

/**
 * @param {{
 *  open: boolean,
 *  onClose: () => void,
 *  onSuccess: () => void
 * }} props
 */
function BulkCreateShowtimeModal({ open, onClose, onSuccess }) {
  const { tx } = useLanguage();
  const {
    values,
    errors,
    submitError,
    submitting,
    result,
    movies,
    cinemas,
    rooms,
    roomsLoading,
    formatOptions,
    preview,
    handleFieldChange,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleTimeSlotChange,
    handleSubmit,
    handleClose,
  } = useBulkCreateShowtime({ onClose, onSuccess, tx });

  // ── If we have a result, show the result screen ──
  if (result) {
    return (
      <Modal
        isOpen={open}
        onClose={handleClose}
        title={tx("Bulk Create Result", "Kết quả tạo hàng loạt")}
      >
        <div className="space-y-4">
          {/* Success summary */}
          <div className="rounded-lg border border-success-green/30 bg-success-green/10 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-semibold text-success-green">
                  {tx("Successfully created", "Tạo thành công")}
                </p>
                <p className="text-2xl font-bold text-success-green">
                  {result.successCount}{" "}
                  <span className="text-sm font-normal">
                    {tx("showtime(s)", "suất chiếu")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Failed summary */}
          {result.failedCount > 0 ? (
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {tx("Failed", "Thất bại")}:{" "}
                    <strong>{result.failedCount}</strong>{" "}
                    {tx("slot(s)", "suất chiếu")}
                  </p>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.failedSlots?.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded bg-paper px-2 py-1 text-xs"
                  >
                    <span className="text-rose font-medium shrink-0">✕</span>
                    <span className="text-charcoal">
                      {slot.date}: {slot.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button onClick={handleClose}>{tx("Close", "Đóng")}</Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Form screen ──
  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={tx("Bulk Create Showtimes", "Tạo hàng loạt lịch chiếu")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Movie */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Movie", "Phim")}
            </span>
            <select
              value={values.movieId}
              onChange={handleFieldChange("movieId")}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.movieId ? "border-rose" : ""
              }`}
            >
              <option value="">
                {tx("-- Select movie --", "-- Chọn phim --")}
              </option>
              {movies.map((m) => {
                const movieTitle = m.title ?? m.name ?? `#${m.id}`;
                const movieDuration = m.durationMinutes ?? m.duration ?? null;
                return (
                  <option key={m.id} value={m.id}>
                    {movieDuration
                      ? `${movieTitle} (${movieDuration} ${tx("min", "phút")})`
                      : movieTitle}
                  </option>
                );
              })}
            </select>
            {errors.movieId ? (
              <span className="text-xs text-rose">{errors.movieId}</span>
            ) : null}
          </label>

          {/* Cinema */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Cinema", "Rạp")}
            </span>
            <select
              value={values.cinemaId}
              onChange={handleFieldChange("cinemaId")}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.cinemaId ? "border-rose" : ""
              }`}
            >
              <option value="">
                {tx("-- Select cinema --", "-- Chọn rạp --")}
              </option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.cinemaId ? (
              <span className="text-xs text-rose">{errors.cinemaId}</span>
            ) : null}
          </label>

          {/* Primary Room (optional) */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Primary Room (optional)", "Phòng ưu tiên (tuỳ chọn)")}
            </span>
            <select
              value={values.primaryRoomId}
              onChange={handleFieldChange("primaryRoomId")}
              disabled={!values.cinemaId || roomsLoading}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                !values.cinemaId ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <option value="">
                {roomsLoading
                  ? tx("Loading rooms...", "Đang tải phòng...")
                  : tx("-- Auto assign --", "-- Tự động phân phòng --")}
              </option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          {/* Format */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Format", "Định dạng")}
            </span>
            <select
              value={values.format}
              onChange={handleFieldChange("format")}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.format ? "border-rose" : ""
              }`}
            >
              {formatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.format ? (
              <span className="text-xs text-rose">{errors.format}</span>
            ) : null}
          </label>

          {/* Start Date */}
          <Input
            type="date"
            label={tx("Start Date", "Ngày bắt đầu")}
            value={values.startDate}
            onChange={handleFieldChange("startDate")}
            error={errors.startDate}
          />

          {/* End Date */}
          <Input
            type="date"
            label={tx("End Date", "Ngày kết thúc")}
            value={values.endDate}
            onChange={handleFieldChange("endDate")}
            error={errors.endDate}
          />

          {/* Pre-show minutes */}
          <Input
            type="number"
            label={tx("Pre-show (min)", "QC/Trailer (phút)")}
            value={values.preShowMinutes}
            onChange={handleFieldChange("preShowMinutes")}
          />

          {/* Post-movie buffer */}
          <Input
            type="number"
            label={tx("Post-movie buffer (min)", "Buffer sau phim (phút)")}
            value={values.postMovieBufferMinutes}
            onChange={handleFieldChange("postMovieBufferMinutes")}
          />
        </div>

        {/* ── Time Slots ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone">
              {tx("Screening Time Slots", "Khung giờ chiếu")}
            </span>
            <button
              type="button"
              onClick={handleAddTimeSlot}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-stone/40 px-2.5 py-1 text-xs font-medium text-charcoal transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              <span className="text-base leading-none">+</span>
              {tx("Add slot", "Thêm giờ")}
            </button>
          </div>

          {errors.timeSlots ? (
            <p className="text-xs text-rose">{errors.timeSlots}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {values.timeSlots.map((slot, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 rounded-lg border-base bg-cream/60 px-2 py-1.5"
              >
                <input
                  type="time"
                  value={slot}
                  onChange={(e) => handleTimeSlotChange(idx, e.target.value)}
                  className="border-none bg-transparent text-sm font-medium text-charcoal outline-none"
                  style={{ width: '5.5rem' }}
                />
                {values.timeSlots.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeSlot(idx)}
                    className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs text-stone transition-colors hover:bg-rose/20 hover:text-rose"
                    title={tx("Remove", "Xóa")}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* ── Preview ── */}
        {preview ? (
          <div className="rounded-md border-base bg-cream/60 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-stone">
              {tx("Preview", "Xem trước")}
            </p>
            <p className="mt-1 text-sm text-charcoal">
              <strong>{preview.dayCount}</strong>{" "}
              {tx("day(s)", "ngày")} × <strong>{preview.slotCount}</strong>{" "}
              {tx("slot(s)", "khung giờ")} ={" "}
              <strong className="text-accent">{preview.total}</strong>{" "}
              {tx("showtime(s) expected", "suất chiếu dự kiến")}
            </p>
          </div>
        ) : null}

        {/* ── Submit error ── */}
        {submitError ? (
          <p className="text-sm text-rose">{submitError}</p>
        ) : null}

        {/* ── Buttons ── */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={submitting}
          >
            {tx("Cancel", "Hủy")}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? tx("Creating...", "Đang tạo...")
              : tx("Create bulk showtimes", "Tạo hàng loạt")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default BulkCreateShowtimeModal;

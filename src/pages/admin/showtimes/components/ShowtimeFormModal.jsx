import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useShowtimeFormModal from '@/features/admin/showtimes/hooks/useShowtimeFormModal';

/**
 * @param {{
 *  open: boolean,
 *  mode: 'create' | 'edit',
 *  showtime?: any,
 *  onClose: () => void,
 *  onSubmit: (values: any) => Promise<{ ok: boolean, error?: string }>
 * }} props
 */
function ShowtimeFormModal({ open, mode = 'create', showtime = null, onClose, onSubmit }) {
  const { tx } = useLanguage();
  const {
    values,
    errors,
    submitError,
    submitting,
    modalTitle,
    isEditMode,
    movies,
    cinemas,
    rooms,
    roomsLoading,
    formatOptions,
    handleValueChange,
    handleSubmit,
  } = useShowtimeFormModal({
    mode,
    showtime,
    onClose,
    onSubmit,
    tx,
  });

  return (
    <Modal isOpen={open} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Movie */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Movie', 'Phim')}</span>
            <select
              value={values.movieId}
              onChange={handleValueChange('movieId')}
              disabled={isEditMode}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.movieId ? 'border-rose' : ''
              } ${isEditMode ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <option value="">{tx('-- Select movie --', '-- Chọn phim --')}</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.durationMinutes} {tx('min', 'phút')})
                </option>
              ))}
            </select>
            {errors.movieId ? <span className="text-xs text-rose">{errors.movieId}</span> : null}
          </label>

          {/* Cinema */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Cinema', 'Rạp')}</span>
            <select
              value={values.cinemaId}
              onChange={handleValueChange('cinemaId')}
              disabled={isEditMode}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.cinemaId ? 'border-rose' : ''
              } ${isEditMode ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <option value="">{tx('-- Select cinema --', '-- Chọn rạp --')}</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.cinemaId ? <span className="text-xs text-rose">{errors.cinemaId}</span> : null}
          </label>

          {/* Room */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Room', 'Phòng')}</span>
            <select
              value={values.roomId}
              onChange={handleValueChange('roomId')}
              disabled={isEditMode || !values.cinemaId || roomsLoading}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.roomId ? 'border-rose' : ''
              } ${isEditMode || !values.cinemaId ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <option value="">
                {roomsLoading
                  ? tx('Loading rooms...', 'Đang tải phòng...')
                  : tx('-- Select room --', '-- Chọn phòng --')}
              </option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.roomId ? <span className="text-xs text-rose">{errors.roomId}</span> : null}
          </label>

          {/* Format */}
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Format', 'Định dạng')}</span>
            <select
              value={values.format}
              onChange={handleValueChange('format')}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.format ? 'border-rose' : ''
              }`}
            >
              {formatOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {errors.format ? <span className="text-xs text-rose">{errors.format}</span> : null}
          </label>

          {/* Public Start Time */}
          <Input
            type="datetime-local"
            label={tx('Start Time', 'Giờ bắt đầu')}
            value={values.publicStartTime}
            onChange={handleValueChange('publicStartTime')}
            error={errors.publicStartTime}
          />

          {/* Pre-show minutes */}
          <Input
            type="number"
            label={tx('Pre-show (min)', 'QC/Trailer (phút)')}
            value={values.preShowMinutes}
            onChange={handleValueChange('preShowMinutes')}
          />

          {/* Post-movie buffer */}
          <Input
            type="number"
            label={tx('Post-movie buffer (min)', 'Buffer sau phim (phút)')}
            value={values.postMovieBufferMinutes}
            onChange={handleValueChange('postMovieBufferMinutes')}
          />
        </div>

        {/* Time preview */}
        <div className="rounded-md border-base bg-cream/60 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-widest text-stone">
            {tx('Time Preview', 'Xem trước thời gian')}
          </p>
          <p className="mt-1 text-xs text-charcoal">
            {tx('Public Start', 'Bắt đầu')}: <strong>{values.publicStartTime || '-'}</strong>
            {' → '}
            {tx('Pre-show', 'QC')}: <strong>{values.preShowMinutes} {tx('min', 'phút')}</strong>
            {' → '}
            {tx('Movie duration from DB', 'Thời lượng phim từ DB')}
            {' → '}
            {tx('Buffer', 'Buffer')}: <strong>{values.postMovieBufferMinutes} {tx('min', 'phút')}</strong>
          </p>
        </div>

        {submitError ? <p className="text-sm text-rose">{submitError}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            {tx('Cancel', 'Hủy')}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? tx('Saving...', 'Đang lưu...')
              : isEditMode
                ? tx('Update showtime', 'Cập nhật lịch chiếu')
                : tx('Create showtime', 'Tạo lịch chiếu')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ShowtimeFormModal;

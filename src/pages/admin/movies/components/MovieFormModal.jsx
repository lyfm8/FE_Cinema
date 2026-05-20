import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useMovieFormModal from '@/features/admin/movies/hooks/useMovieFormModal';

/**
 * @param {{
 *  open: boolean,
 *  mode: 'create' | 'edit',
 *  movie?: any,
 *  onClose: () => void,
 *  onSubmit: (payload: { values: any, posterFile: File | null }) => Promise<{ ok: boolean, error?: string }>
 * }} props
 */
function MovieFormModal({ open, mode = 'create', movie = null, onClose, onSubmit }) {
  const { tx } = useLanguage();
  const {
    values,
    errors,
    previewUrl,
    submitError,
    submitting,
    modalTitle,
    statusOptions,
    isEditMode,
    handleValueChange,
    handlePosterChange,
    handleSubmit,
  } = useMovieFormModal({
    mode,
    movie,
    onClose,
    onSubmit,
    tx,
  });

  return (
    <Modal isOpen={open} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={tx('Movie title', 'Tên phim')}
            value={values.title}
            onChange={handleValueChange('title')}
            error={errors.title}
          />
          <Input
            label={tx('Genre', 'Thể loại')}
            value={values.genre}
            onChange={handleValueChange('genre')}
            error={errors.genre}
          />
          <Input
            type="number"
            label={tx('Duration (minutes)', 'Thời lượng (phút)')}
            value={values.durationMinutes}
            onChange={handleValueChange('durationMinutes')}
            error={errors.durationMinutes}
          />
          <Input
            label={tx('Director', 'Đạo diễn')}
            value={values.director}
            onChange={handleValueChange('director')}
            error={errors.director}
          />
          <Input
            label={tx('Cast', 'Diễn viên')}
            value={values.cast}
            onChange={handleValueChange('cast')}
          />
          <Input
            type="date"
            label={tx('Release date', 'Ngày phát hành')}
            value={values.releaseDate}
            onChange={handleValueChange('releaseDate')}
            error={errors.releaseDate}
          />
          <Input
            label={tx('Language', 'Ngôn ngữ')}
            value={values.language}
            onChange={handleValueChange('language')}
            error={errors.language}
          />
          <Input
            type="number"
            label={tx('Age limit', 'Giới hạn tuổi')}
            value={values.ageLimit}
            onChange={handleValueChange('ageLimit')}
            error={errors.ageLimit}
          />
          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Status', 'Trạng thái')}</span>
            <select
              value={values.status}
              onChange={handleValueChange('status')}
              className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none ${
                errors.status ? 'border-rose' : ''
              }`}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
            {errors.status ? <span className="text-xs text-rose">{errors.status}</span> : null}
          </label>
          <Input
            type="url"
            label={tx('Trailer URL', 'Link trailer')}
            value={values.trailerUrl}
            onChange={handleValueChange('trailerUrl')}
          />
        </div>

        <label className="flex w-full flex-col gap-1">
          <span className="text-xs font-medium text-stone">{tx('Description', 'Mô tả')}</span>
          <textarea
            value={values.description}
            onChange={handleValueChange('description')}
            rows={4}
            className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal placeholder:text-fog transition-colors focus:border-selected focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex w-full flex-col gap-1">
          <span className="text-xs font-medium text-stone">{tx('Poster', 'Poster')}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePosterChange}
            className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-1 file:text-xs file:text-charcoal ${
              errors.poster ? 'border-rose' : ''
            }`}
          />
          {errors.poster ? <span className="text-xs text-rose">{errors.poster}</span> : null}
        </label>

        {previewUrl ? (
          <div className="space-y-2">
            <p className="section-label">{tx('Poster Preview', 'Xem trước poster')}</p>
            <img src={previewUrl} alt="Poster preview" className="h-48 w-32 rounded border-base object-cover" />
          </div>
        ) : null}

        {submitError ? <p className="text-sm text-rose">{submitError}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            {tx('Cancel', 'Hủy')}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? tx('Saving...', 'Đang lưu...')
              : isEditMode
                ? tx('Update movie', 'Cập nhật phim')
                : tx('Create movie', 'Tạo phim')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default MovieFormModal;

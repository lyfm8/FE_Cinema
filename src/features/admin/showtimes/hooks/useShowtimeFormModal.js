import { useCallback, useEffect, useState } from 'react';
import {
  getCinemas,
  getRoomsByCinema,
  getMovies,
} from '@/features/admin/services/showtimeService';
import { extractList, MOVIE_FORMAT } from '@/features/admin/showtimes/utils/showtimeAdapter';

const EMPTY_FORM = {
  movieId: '',
  roomId: '',
  cinemaId: '',
  publicStartTime: '',
  preShowMinutes: 10,
  postMovieBufferMinutes: 15,
  format: '2D',
};

/**
 * @param {{
 *  mode: 'create' | 'edit',
 *  showtime?: any,
 *  onClose: () => void,
 *  onSubmit: (values: any) => Promise<{ ok: boolean, error?: string }>,
 *  tx: (en: string, vi: string) => string
 * }} options
 */
function useShowtimeFormModal({ mode, showtime, onClose, onSubmit, tx }) {
  const isEditMode = mode === 'edit';

  // ── Dropdown data ──
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // ── Form state ──
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load movies & cinemas on mount
  useEffect(() => {
    (async () => {
      try {
        const [movieRes, cinemaRes] = await Promise.all([getMovies(), getCinemas()]);
        setMovies(extractList(movieRes));
        setCinemas(extractList(cinemaRes));
      } catch {
        // Keep empty lists on failure
      }
    })();
  }, []);

  // Populate form for edit mode
  useEffect(() => {
    if (isEditMode && showtime) {
      const cinemaId = showtime.room?.cinemaId ?? showtime.cinemaId ?? '';
      setValues({
        movieId: String(showtime.movieId ?? ''),
        roomId: String(showtime.roomId ?? ''),
        cinemaId: String(cinemaId),
        publicStartTime: showtime.publicStartTime
          ? new Date(showtime.publicStartTime).toISOString().slice(0, 16)
          : '',
        preShowMinutes: showtime.preShowMinutes ?? 10,
        postMovieBufferMinutes: showtime.postMovieBufferMinutes ?? 15,
        format: showtime.format ?? '2D',
      });

      // Pre-load rooms for the selected cinema
      if (cinemaId) {
        loadRooms(cinemaId);
      }
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
    setSubmitError('');
  }, [isEditMode, showtime]);

  // Load rooms when cinema changes
  const loadRooms = useCallback(async (cinemaId) => {
    if (!cinemaId) {
      setRooms([]);
      return;
    }
    setRoomsLoading(true);
    try {
      const res = await getRoomsByCinema(cinemaId);
      setRooms(extractList(res));
    } catch {
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  // ── Field change handler ──
  const handleValueChange = useCallback(
    (field) => (event) => {
      const val = event.target.value;
      setValues((prev) => {
        const next = { ...prev, [field]: val };

        // If cinema changes, reset room and load new rooms
        if (field === 'cinemaId') {
          next.roomId = '';
          loadRooms(val);
        }

        return next;
      });

      // Clear field error
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [loadRooms],
  );

  // ── Validation ──
  const validate = useCallback(() => {
    const errs = {};
    if (!values.movieId) errs.movieId = tx('Required', 'Bắt buộc');
    if (!values.cinemaId) errs.cinemaId = tx('Required', 'Bắt buộc');
    if (!values.roomId) errs.roomId = tx('Required', 'Bắt buộc');
    if (!values.publicStartTime) errs.publicStartTime = tx('Required', 'Bắt buộc');
    if (!values.format) errs.format = tx('Required', 'Bắt buộc');
    return errs;
  }, [values, tx]);

  // ── Submit ──
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      setSubmitting(true);
      setSubmitError('');

      const payload = {
        movieId: Number(values.movieId),
        roomId: Number(values.roomId),
        publicStartTime: new Date(values.publicStartTime).toISOString(),
        preShowMinutes: Number(values.preShowMinutes),
        postMovieBufferMinutes: Number(values.postMovieBufferMinutes),
        format: values.format,
      };

      const result = await onSubmit(payload);

      setSubmitting(false);
      if (result.ok) {
        onClose();
      } else {
        setSubmitError(result.error || tx('An error occurred.', 'Đã xảy ra lỗi.'));
      }
    },
    [values, validate, onSubmit, onClose, tx],
  );

  const modalTitle = isEditMode
    ? tx('Edit Showtime', 'Sửa lịch chiếu')
    : tx('Create Showtime', 'Tạo lịch chiếu');

  const formatOptions = Object.values(MOVIE_FORMAT);

  return {
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
  };
}

export default useShowtimeFormModal;

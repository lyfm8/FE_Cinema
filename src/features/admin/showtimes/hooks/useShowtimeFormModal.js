import { useCallback, useEffect, useState } from 'react';
import { showtimeService } from '@/features/admin/showtimes/services/showtimeService';
import {
  MOVIE_FORMAT,
  MOVIE_FORMAT_LABEL,
  SHOWTIME_STATUS,
} from '@/features/admin/showtimes/constants/showtimeConstants';

const EMPTY_FORM = {
  movieId: '',
  roomId: '',
  cinemaId: '',
  publicStartTime: '',
  preShowMinutes: 10,
  postMovieBufferMinutes: 15,
  format: MOVIE_FORMAT.FORMAT_2D,
  status: SHOWTIME_STATUS.SCHEDULED,
};

function useShowtimeFormModal({ mode, showtime, onClose, onSubmit, tx }) {
  const isEditMode = mode === 'edit';

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRooms = useCallback(async (cinemaId) => {
    if (!cinemaId) {
      setRooms([]);
      return;
    }
    setRoomsLoading(true);
    try {
      const res = await showtimeService.getRoomsByCinema(cinemaId);
      setRooms(res.data ?? []);
    } catch {
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [movieRes, cinemaRes] = await Promise.all([
          showtimeService.getMovies({ pageSize: 100 }),
          showtimeService.getCinemas({ pageSize: 100 }),
        ]);
        setMovies(movieRes.data ?? []);
        setCinemas(cinemaRes.data ?? []);
      } catch {
        setMovies([]);
        setCinemas([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEditMode && showtime) {
      const cinemaId = showtime.room?.cinemaId ?? showtime.cinemaId ?? '';
      setValues({
        movieId: String(showtime.movieId ?? showtime.movie?.id ?? ''),
        roomId: String(showtime.roomId ?? showtime.room?.id ?? ''),
        cinemaId: String(cinemaId),
        publicStartTime: showtime.publicStartTime
          ? (() => {
              const d = new Date(showtime.publicStartTime);
              const pad = (n) => String(n).padStart(2, '0');
              return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            })()
          : '',
        preShowMinutes: showtime.preShowMinutes ?? 10,
        postMovieBufferMinutes: showtime.postMovieBufferMinutes ?? 15,
        format: showtime.format ?? MOVIE_FORMAT.FORMAT_2D,
        status: showtime.status ?? SHOWTIME_STATUS.SCHEDULED,
      });

      if (cinemaId) {
        loadRooms(cinemaId);
      }
    } else {
      setValues(EMPTY_FORM);
      setRooms([]);
    }

    setErrors({});
    setSubmitError('');
  }, [isEditMode, showtime, loadRooms]);

  const handleValueChange = useCallback(
    (field) => (event) => {
      const val = event.target.value;

      setValues((prev) => {
        const next = { ...prev, [field]: val };
        if (field === 'cinemaId') {
          next.roomId = '';
          loadRooms(val);
        }
        return next;
      });

      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [loadRooms],
  );

  const validate = useCallback(() => {
    const errs = {};
    if (!values.movieId) errs.movieId = tx('Required', 'Bắt buộc');
    if (!values.cinemaId) errs.cinemaId = tx('Required', 'Bắt buộc');
    if (!values.roomId) errs.roomId = tx('Required', 'Bắt buộc');
    if (!values.publicStartTime) errs.publicStartTime = tx('Required', 'Bắt buộc');
    if (!values.format) errs.format = tx('Required', 'Bắt buộc');
    if (!values.status) errs.status = tx('Required', 'Bắt buộc');
    return errs;
  }, [values, tx]);

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
        status: values.status,
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

  const formatOptions = Object.values(MOVIE_FORMAT).map((value) => ({
    value,
    label: MOVIE_FORMAT_LABEL[value] ?? value,
  }));

  const statusOptions = Object.values(SHOWTIME_STATUS).map((value) => ({
    value,
    label:
      value === SHOWTIME_STATUS.SCHEDULED
        ? tx('Scheduled', 'Đã lên lịch')
        : value === SHOWTIME_STATUS.ACTIVE
          ? tx('Active', 'Đang chiếu')
          : value === SHOWTIME_STATUS.COMPLETED
            ? tx('Completed', 'Hoàn tất')
            : tx('Cancelled', 'Đã hủy'),
  }));

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
    statusOptions,
    handleValueChange,
    handleSubmit,
  };
}

export default useShowtimeFormModal;

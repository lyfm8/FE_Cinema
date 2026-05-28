import { useCallback, useEffect, useState } from 'react';
import { showtimeService } from '@/features/admin/showtimes/services/showtimeService';
import {
  MOVIE_FORMAT,
  MOVIE_FORMAT_LABEL,
} from '@/features/admin/showtimes/constants/showtimeConstants';
import { getErrorMessage } from '@/core/utils/errorUtils';

const EMPTY_FORM = {
  movieId: '',
  cinemaId: '',
  primaryRoomId: '',
  startDate: '',
  endDate: '',
  timeSlots: ['09:00', '14:00', '19:00'],
  format: MOVIE_FORMAT.FORMAT_2D,
  preShowMinutes: 10,
  postMovieBufferMinutes: 15,
};

/**
 * Hook quản lý form Bulk Create Showtime.
 * @param {{ onClose: () => void, onSuccess: () => void, tx: Function }} opts
 */
function useBulkCreateShowtime({ onClose, onSuccess, tx }) {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Result after successful submit
  const [result, setResult] = useState(null);

  // Load movies & cinemas on mount
  useEffect(() => {
    (async () => {
      try {
        const [movieRes, cinemaRes] = await Promise.all([
          showtimeService.getMovies({ pageSize: 200 }),
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

  // Load rooms when cinemaId changes
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

  // ── Field change handlers ──

  const handleFieldChange = useCallback(
    (field) => (event) => {
      const val = event.target.value;
      setValues((prev) => {
        const next = { ...prev, [field]: val };
        if (field === 'cinemaId') {
          next.primaryRoomId = '';
          loadRooms(val);
        }
        return next;
      });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [loadRooms],
  );

  // ── Time slots management ──

  const handleAddTimeSlot = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, '12:00'],
    }));
  }, []);

  const handleRemoveTimeSlot = useCallback((index) => {
    setValues((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTimeSlotChange = useCallback((index, value) => {
    setValues((prev) => {
      const next = [...prev.timeSlots];
      next[index] = value;
      return { ...prev, timeSlots: next };
    });
    setErrors((prev) => ({ ...prev, timeSlots: undefined }));
  }, []);

  // ── Validation ──

  const validate = useCallback(() => {
    const errs = {};
    if (!values.movieId) errs.movieId = tx('Required', 'Bắt buộc');
    if (!values.cinemaId) errs.cinemaId = tx('Required', 'Bắt buộc');
    if (!values.startDate) errs.startDate = tx('Required', 'Bắt buộc');
    if (!values.endDate) errs.endDate = tx('Required', 'Bắt buộc');
    if (values.startDate && values.endDate && values.startDate > values.endDate) {
      errs.endDate = tx(
        'End date must be after start date',
        'Ngày kết thúc phải sau ngày bắt đầu',
      );
    }
    if (!values.timeSlots || values.timeSlots.length === 0) {
      errs.timeSlots = tx(
        'At least one time slot required',
        'Cần ít nhất một khung giờ',
      );
    }
    if (!values.format) errs.format = tx('Required', 'Bắt buộc');
    return errs;
  }, [values, tx]);

  // ── Preview calculation ──

  const preview = (() => {
    if (!values.startDate || !values.endDate || values.timeSlots.length === 0) {
      return null;
    }
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return null;
    }
    const diffTime = end.getTime() - start.getTime();
    const dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const slotCount = values.timeSlots.length;
    return {
      dayCount,
      slotCount,
      total: dayCount * slotCount,
    };
  })();

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
      setResult(null);

      try {
        const payload = {
          movieId: Number(values.movieId),
          cinemaId: Number(values.cinemaId),
          startDate: values.startDate,
          endDate: values.endDate,
          timeSlots: values.timeSlots,
          format: values.format,
          preShowMinutes: Number(values.preShowMinutes),
          postMovieBufferMinutes: Number(values.postMovieBufferMinutes),
        };

        if (values.primaryRoomId) {
          payload.primaryRoomId = Number(values.primaryRoomId);
        }

        const res = await showtimeService.bulkCreateShowtime(payload);
        setResult(res.data);

        // Also trigger parent refresh
        if (onSuccess) onSuccess();
      } catch (error) {
        setSubmitError(
          getErrorMessage(error, tx('Bulk create failed.', 'Tạo hàng loạt thất bại.')),
        );
      } finally {
        setSubmitting(false);
      }
    },
    [values, validate, onSuccess, tx],
  );

  // ── Reset & close ──

  const handleClose = useCallback(() => {
    setValues(EMPTY_FORM);
    setErrors({});
    setSubmitError('');
    setResult(null);
    onClose();
  }, [onClose]);

  // ── Derived data ──

  const formatOptions = Object.values(MOVIE_FORMAT).map((value) => ({
    value,
    label: MOVIE_FORMAT_LABEL[value] ?? value,
  }));

  return {
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
  };
}

export default useBulkCreateShowtime;

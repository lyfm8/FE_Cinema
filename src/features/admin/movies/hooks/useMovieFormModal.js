import { useEffect, useMemo, useState } from 'react';
import { MOVIE_STATUS } from '@/features/admin/movies/utils/movieManagementAdapter';

const MOVIE_STATUS_OPTIONS = Object.values(MOVIE_STATUS);

const DEFAULT_VALUES = {
  title: '',
  genre: '',
  durationMinutes: '',
  director: '',
  cast: '',
  releaseDate: '',
  description: '',
  language: '',
  ageLimit: '',
  trailerUrl: '',
  status: MOVIE_STATUS.COMING_SOON,
};

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildInitialValues(movie) {
  if (!movie) {
    return DEFAULT_VALUES;
  }

  return {
    title: movie.title ?? '',
    genre: movie.genre ?? '',
    durationMinutes: movie.durationMinutes ? String(movie.durationMinutes) : '',
    director: movie.director ?? '',
    cast: movie.cast ?? '',
    releaseDate: toDateInputValue(movie.releaseDate),
    description: movie.description ?? '',
    language: movie.language ?? '',
    ageLimit: movie.ageLimit !== undefined && movie.ageLimit !== null ? String(movie.ageLimit) : '',
    trailerUrl: movie.trailerUrl ?? '',
    status: movie.status ?? MOVIE_STATUS.COMING_SOON,
  };
}

function validateMovieForm(values, requirePoster) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Movie title is required.';
  }

  if (!values.genre.trim()) {
    errors.genre = 'Genre is required.';
  }

  if (!values.durationMinutes || Number(values.durationMinutes) <= 0) {
    errors.durationMinutes = 'Duration must be greater than 0.';
  }

  if (!values.director.trim()) {
    errors.director = 'Director is required.';
  }

  if (!values.releaseDate) {
    errors.releaseDate = 'Release date is required.';
  }

  if (!values.language.trim()) {
    errors.language = 'Language is required.';
  }

  if (values.ageLimit && Number(values.ageLimit) < 0) {
    errors.ageLimit = 'Age limit must be 0 or greater.';
  }

  if (!MOVIE_STATUS_OPTIONS.includes(values.status)) {
    errors.status = 'Invalid status.';
  }

  if (requirePoster) {
    errors.poster = 'Poster image is required.';
  }

  return errors;
}

function formatPayload(values) {
  return {
    ...values,
    durationMinutes: Number(values.durationMinutes),
    ageLimit: values.ageLimit ? Number(values.ageLimit) : 0,
  };
}

/**
 * @param {{
 *  mode: 'create' | 'edit',
 *  movie?: any,
 *  onClose: () => void,
 *  onSubmit: (payload: { values: any, posterFile: File | null }) => Promise<{ ok: boolean, error?: string }>,
 *  tx: (en: string, vi: string) => string
 * }} params
 */
function useMovieFormModal({ mode = 'create', movie = null, onClose, onSubmit, tx }) {
  const [values, setValues] = useState(() => buildInitialValues(movie));
  const [errors, setErrors] = useState({});
  const [posterFile, setPosterFile] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = mode === 'edit';
  const initialPosterUrl = movie?.posterUrl ?? '';

  const previewUrl = useMemo(
    () => (posterFile ? URL.createObjectURL(posterFile) : initialPosterUrl),
    [posterFile, initialPosterUrl],
  );

  useEffect(() => {
    if (!posterFile || !previewUrl) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [posterFile, previewUrl]);

  const modalTitle = useMemo(
    () => (isEditMode ? tx('Edit movie', 'Chỉnh sửa phim') : tx('Create movie', 'Thêm phim')),
    [isEditMode, tx],
  );

  const handleValueChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handlePosterChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setPosterFile(nextFile);
    setErrors((current) => ({ ...current, poster: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requirePoster = !isEditMode && !posterFile;
    const nextErrors = validateMovieForm(values, requirePoster);

    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await onSubmit({
        values: formatPayload(values),
        posterFile,
      });

      if (!result?.ok) {
        setSubmitError(result?.error ?? 'Failed to save movie.');
        return;
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    errors,
    previewUrl,
    submitError,
    submitting,
    modalTitle,
    statusOptions: MOVIE_STATUS_OPTIONS,
    isEditMode,
    handleValueChange,
    handlePosterChange,
    handleSubmit,
  };
}

export default useMovieFormModal;

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  updateMovie,
} from '@/features/movies/services/movieService';
import {
  MOVIE_STATUS,
  buildMovieFormData,
  extractMovie,
  extractMovieList,
  getErrorMessage,
  normalizeMovie,
} from '@/features/admin/movies/utils/movieManagementAdapter';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useMovieManagement(tx) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingMovie, setEditingMovie] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailMovie, setDetailMovie] = useState(null);

  const [deletingMovieId, setDeletingMovieId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    tone: 'info',
  });

  const showToast = useCallback((message, tone = 'info') => {
    setToast({
      visible: true,
      message,
      tone,
    });
  }, []);

  useEffect(() => {
    if (!toast.visible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast.visible]);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setFetchError('');

    try {
      const result = await getMovies();
      const movieList = extractMovieList(result)
        .map(normalizeMovie)
        .filter((movie) => movie && !Number.isNaN(movie.id));

      setMovies(movieList);
    } catch (error) {
      setMovies([]);
      setFetchError(getErrorMessage(error, 'Unable to load movie list.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadMovies();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadMovies]);

  const handleOpenCreateForm = () => {
    setFormMode('create');
    setEditingMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (movie) => {
    setFormMode('edit');
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  const handleSubmitMovie = async ({ values, posterFile }) => {
    try {
      const formData = buildMovieFormData(values, posterFile, editingMovie);

      if (formMode === 'edit' && editingMovie) {
        await updateMovie(editingMovie.id, formData);
        showToast(tx('Movie updated successfully.', 'Cập nhật phim thành công.'), 'success');
      } else {
        await createMovie(formData);
        showToast(tx('Movie created successfully.', 'Tạo phim thành công.'), 'success');
      }

      await loadMovies();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error, 'Failed to save movie.'),
      };
    }
  };

  const handleViewMovie = async (movie) => {
    setIsDetailOpen(true);
    setDetailMovie(movie);
    setDetailLoading(true);

    try {
      const result = await getMovieById(movie.id);
      const movieDetail = normalizeMovie(extractMovie(result));

      if (movieDetail) {
        setDetailMovie(movieDetail);
      }
    } catch {
      // Keep list item data as detail fallback.
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRequestDelete = (movie) => {
    setDeleteTarget(movie);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingMovieId(deleteTarget.id);

    try {
      await deleteMovie(deleteTarget.id);
      showToast(tx('Movie deleted successfully.', 'Xóa phim thành công.'), 'success');
      await loadMovies();
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to delete movie.'), 'error');
    } finally {
      setDeletingMovieId(null);
      setDeleteTarget(null);
    }
  };

  const nowShowingCount = useMemo(
    () => movies.filter((movie) => movie.status === MOVIE_STATUS.NOW_SHOWING).length,
    [movies],
  );

  const comingSoonCount = useMemo(
    () => movies.filter((movie) => movie.status === MOVIE_STATUS.COMING_SOON).length,
    [movies],
  );

  return {
    movies,
    loading,
    fetchError,
    isFormOpen,
    formMode,
    editingMovie,
    isDetailOpen,
    detailLoading,
    detailMovie,
    deletingMovieId,
    deleteTarget,
    toast,
    nowShowingCount,
    comingSoonCount,
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,
    handleSubmitMovie,
    handleViewMovie,
    handleRequestDelete,
    handleCancelDelete,
    handleCloseDetail,
    handleConfirmDelete,
  };
}

export default useMovieManagement;

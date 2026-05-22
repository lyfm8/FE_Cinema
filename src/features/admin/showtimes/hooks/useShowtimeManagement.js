import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from '@/features/admin/services/showtimeService';
import {
  extractList,
  normalizeShowtime,
  getErrorMessage,
  SHOWTIME_STATUS,
} from '@/features/admin/showtimes/utils/showtimeAdapter';

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useShowtimeManagement(tx) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingShowtime, setEditingShowtime] = useState(null);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', tone: 'info' });

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const id = window.setTimeout(() => {
      setToast((c) => ({ ...c, visible: false }));
    }, 2500);
    return () => window.clearTimeout(id);
  }, [toast.visible]);

  // ── Load showtimes ──
  const loadShowtimes = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const result = await getShowtimes({ pageSize: 100 });
      const list = extractList(result)
        .map(normalizeShowtime)
        .filter((s) => s && !Number.isNaN(s.id));
      setShowtimes(list);
    } catch (error) {
      setShowtimes([]);
      setFetchError(getErrorMessage(error, 'Unable to load showtimes.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => loadShowtimes(), 0);
    return () => window.clearTimeout(id);
  }, [loadShowtimes]);

  // ── Form handlers ──
  const handleOpenCreateForm = () => {
    setFormMode('create');
    setEditingShowtime(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (showtime) => {
    setFormMode('edit');
    setEditingShowtime(showtime);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShowtime(null);
  };

  const handleSubmitShowtime = async (values) => {
    try {
      if (formMode === 'edit' && editingShowtime) {
        await updateShowtime(editingShowtime.id, values);
        showToast(tx('Showtime updated successfully.', 'Cập nhật lịch chiếu thành công.'), 'success');
      } else {
        await createShowtime(values);
        showToast(tx('Showtime created successfully.', 'Tạo lịch chiếu thành công.'), 'success');
      }
      await loadShowtimes();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, 'Failed to save showtime.') };
    }
  };

  // ── Delete handlers ──
  const handleRequestDelete = (showtime) => {
    setDeleteTarget(showtime);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteShowtime(deleteTarget.id);
      showToast(tx('Showtime deleted successfully.', 'Xóa lịch chiếu thành công.'), 'success');
      await loadShowtimes();
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to delete showtime.'), 'error');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  // ── Summary stats ──
  const scheduledCount = useMemo(
    () => showtimes.filter((s) => s.status === SHOWTIME_STATUS.SCHEDULED).length,
    [showtimes],
  );

  const activeCount = useMemo(
    () => showtimes.filter((s) => s.status === SHOWTIME_STATUS.ACTIVE).length,
    [showtimes],
  );

  return {
    showtimes,
    loading,
    fetchError,
    isFormOpen,
    formMode,
    editingShowtime,
    deletingId,
    deleteTarget,
    toast,
    scheduledCount,
    activeCount,
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,
    handleSubmitShowtime,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
  };
}

export default useShowtimeManagement;

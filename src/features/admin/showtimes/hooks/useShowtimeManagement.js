import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getCinemas,
  getRoomsByCinema,
} from "@/features/admin/services/showtimeService";
import {
  extractList,
  normalizeShowtime,
  getErrorMessage,
  SHOWTIME_STATUS,
  buildTimelineRows,
  getTodayDateKey,
  TIMELINE_DEFAULT_START_HOUR,
  TIMELINE_DEFAULT_END_HOUR,
} from "@/features/admin/showtimes/utils/showtimeAdapter";

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useShowtimeManagement(tx) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingShowtime, setEditingShowtime] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    tone: "info",
  });

  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getTodayDateKey());
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const timelineStartHour = TIMELINE_DEFAULT_START_HOUR;
  const timelineEndHour = TIMELINE_DEFAULT_END_HOUR;

  const showToast = useCallback((message, tone = "info") => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const id = window.setTimeout(() => {
      setToast((c) => ({ ...c, visible: false }));
    }, 2500);
    return () => window.clearTimeout(id);
  }, [toast.visible]);

  const loadShowtimes = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const result = await getShowtimes({ page: 1, pageSize: 1000 });
      const list = extractList(result)
        .map(normalizeShowtime)
        .filter((s) => s && !Number.isNaN(s.id));
      setShowtimes(list);
    } catch (error) {
      setShowtimes([]);
      setFetchError(getErrorMessage(error, "Unable to load showtimes."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCinemasForTimeline = useCallback(async () => {
    try {
      const result = await getCinemas({ page: 1, pageSize: 100 });
      const list = extractList(result);
      setCinemas(list);

      setSelectedCinemaId((current) => {
        if (current) return current;
        if (list.length === 0) return "";
        return String(list[0].id);
      });
    } catch {
      setCinemas([]);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => loadShowtimes(), 0);
    return () => window.clearTimeout(id);
  }, [loadShowtimes]);

  useEffect(() => {
    const id = window.setTimeout(() => loadCinemasForTimeline(), 0);
    return () => window.clearTimeout(id);
  }, [loadCinemasForTimeline]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedCinemaId) {
      setRooms([]);
      setSelectedRoomId("");
      return undefined;
    }

    setRoomsLoading(true);

    (async () => {
      try {
        const result = await getRoomsByCinema(selectedCinemaId);
        const list = extractList(result);

        if (cancelled) return;
        setRooms(list);

        setSelectedRoomId((current) => {
          if (!current) return "";
          const exists = list.some(
            (room) => String(room.id) === String(current),
          );
          return exists ? current : "";
        });
      } catch {
        if (!cancelled) {
          setRooms([]);
          setSelectedRoomId("");
        }
      } finally {
        if (!cancelled) setRoomsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCinemaId]);

  const handleOpenCreateForm = () => {
    setFormMode("create");
    setEditingShowtime(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (showtime) => {
    setFormMode("edit");
    setEditingShowtime(showtime);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShowtime(null);
  };

  const handleSubmitShowtime = async (values) => {
    try {
      if (formMode === "edit" && editingShowtime) {
        await updateShowtime(editingShowtime.id, values);
        showToast(
          tx(
            "Showtime updated successfully.",
            "Cập nhật lịch chiếu thành công.",
          ),
          "success",
        );
      } else {
        await createShowtime(values);
        showToast(
          tx("Showtime created successfully.", "Tạo lịch chiếu thành công."),
          "success",
        );
      }
      await loadShowtimes();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error, "Failed to save showtime."),
      };
    }
  };

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
      showToast(
        tx("Showtime deleted successfully.", "Xóa lịch chiếu thành công."),
        "success",
      );
      await loadShowtimes();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to delete showtime."), "error");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleTimelineDateChange = useCallback((event) => {
    const next = event.target.value;
    setSelectedDate(next || getTodayDateKey());
  }, []);

  const handleTimelineCinemaChange = useCallback((event) => {
    setSelectedCinemaId(event.target.value);
    setSelectedRoomId("");
  }, []);

  const handleTimelineRoomChange = useCallback((event) => {
    setSelectedRoomId(event.target.value);
  }, []);

  const timelineRows = useMemo(
    () =>
      buildTimelineRows({
        showtimes,
        rooms,
        selectedDate,
        selectedCinemaId,
        selectedRoomId,
        startHour: timelineStartHour,
        endHour: timelineEndHour,
      }),
    [
      showtimes,
      rooms,
      selectedDate,
      selectedCinemaId,
      selectedRoomId,
      timelineStartHour,
      timelineEndHour,
    ],
  );

  const timelineBusyCount = useMemo(
    () => timelineRows.reduce((sum, row) => sum + row.blocks.length, 0),
    [timelineRows],
  );

  const timelineRoomCount = timelineRows.length;

  const scheduledCount = useMemo(
    () =>
      showtimes.filter((s) => s.status === SHOWTIME_STATUS.SCHEDULED).length,
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
    cinemas,
    rooms,
    roomsLoading,
    selectedDate,
    selectedCinemaId,
    selectedRoomId,
    timelineRows,
    timelineStartHour,
    timelineEndHour,
    timelineBusyCount,
    timelineRoomCount,
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,
    handleSubmitShowtime,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
    handleTimelineDateChange,
    handleTimelineCinemaChange,
    handleTimelineRoomChange,
  };
}

export default useShowtimeManagement;

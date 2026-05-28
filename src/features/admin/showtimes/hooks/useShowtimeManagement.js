import { useCallback, useEffect, useMemo, useState } from "react";
import { showtimeService } from "@/features/admin/showtimes/services/showtimeService";
import {
  SHOWTIME_STATUS,
  TIMELINE_DEFAULT_START_HOUR,
  TIMELINE_DEFAULT_END_HOUR,
} from "@/features/admin/showtimes/constants/showtimeConstants";
import {
  normalizeShowtime,
  buildTimelineRows,
  getTodayDateKey,
} from "@/features/admin/showtimes/utils/showtimeUtils";
import { getErrorMessage } from "@/core/utils/errorUtils";

const TABLE_PAGE_SIZE = 8;

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useShowtimeManagement(tx) {
  // ── Table data (paginated) ──
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ── Timeline data (separate, loaded by cinema) ──
  const [timelineShowtimes, setTimelineShowtimes] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingShowtime, setEditingShowtime] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

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

  // ── Table: paginated load ──
  const loadShowtimes = useCallback(async (page = 1) => {
    setLoading(true);
    setFetchError("");
    try {
      const result = await showtimeService.getShowtimes({
        page,
        pageSize: TABLE_PAGE_SIZE,
      });
      const list = (result.data ?? [])
        .map(normalizeShowtime)
        .filter((s) => s && !Number.isNaN(s.id));
      setShowtimes(list);

      const pag = result.pagination;
      if (pag) {
        setCurrentPage(Number(pag.page) || 1);
        setTotalPages(Number(pag.totalPages) || 1);
        setTotalItems(Number(pag.totalItems) || 0);
      }
    } catch (error) {
      setShowtimes([]);
      setFetchError(getErrorMessage(error, "Unable to load showtimes."));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Timeline: load by cinema (all showtimes for that cinema) ──
  const loadTimelineData = useCallback(async (cinemaId) => {
    if (!cinemaId) {
      setTimelineShowtimes([]);
      return;
    }
    setTimelineLoading(true);
    try {
      const result = await showtimeService.getShowtimesByCinema(cinemaId);
      // API returns data grouped by date: { "2026-05-29": [...], ... }
      // Flatten into a single array and normalize
      const grouped = result.data ?? {};
      const flat = Object.values(grouped).flat();
      const normalized = flat
        .map(normalizeShowtime)
        .filter((s) => s && !Number.isNaN(s.id));
      setTimelineShowtimes(normalized);
    } catch {
      setTimelineShowtimes([]);
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  const loadCinemasForTimeline = useCallback(async () => {
    try {
      const result = await showtimeService.getCinemas({ page: 1, pageSize: 100 });
      const list = result.data ?? [];
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

  // Initial load
  useEffect(() => {
    const id = window.setTimeout(() => loadShowtimes(1), 0);
    return () => window.clearTimeout(id);
  }, [loadShowtimes]);

  useEffect(() => {
    const id = window.setTimeout(() => loadCinemasForTimeline(), 0);
    return () => window.clearTimeout(id);
  }, [loadCinemasForTimeline]);

  // Load rooms + timeline data when cinema changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedCinemaId) {
      setRooms([]);
      setSelectedRoomId("");
      setTimelineShowtimes([]);
      return undefined;
    }

    setRoomsLoading(true);

    (async () => {
      try {
        console.log("Fetching rooms for cinemaId:", selectedCinemaId);
        const result = await showtimeService.getRoomsByCinema(selectedCinemaId);
        console.log("getRoomsByCinema result:", result);
        const list = result.data ?? [];
        console.log("Extracted rooms list:", list);

        if (cancelled) return;
        setRooms(list);

        setSelectedRoomId((current) => {
          if (!current) return "";
          const exists = list.some(
            (room) => String(room.id) === String(current),
          );
          return exists ? current : "";
        });
      } catch (err) {
        console.error("getRoomsByCinema error:", err);
        if (!cancelled) {
          setRooms([]);
          setSelectedRoomId("");
        }
      } finally {
        if (!cancelled) setRoomsLoading(false);
      }
    })();

    // Also load timeline data for this cinema
    loadTimelineData(selectedCinemaId);

    return () => {
      cancelled = true;
    };
  }, [selectedCinemaId, loadTimelineData]);

  // ── Pagination handlers ──
  const handlePagePrev = useCallback(() => {
    if (currentPage > 1) loadShowtimes(currentPage - 1);
  }, [currentPage, loadShowtimes]);

  const handlePageNext = useCallback(() => {
    if (currentPage < totalPages) loadShowtimes(currentPage + 1);
  }, [currentPage, totalPages, loadShowtimes]);

  // ── Form handlers ──
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

  const handleOpenBulkCreate = () => {
    setIsBulkFormOpen(true);
  };

  const handleCloseBulkCreate = () => {
    setIsBulkFormOpen(false);
  };

  const handleBulkCreateSuccess = () => {
    loadShowtimes(currentPage);
    if (selectedCinemaId) loadTimelineData(selectedCinemaId);
    showToast(
      tx(
        "Bulk showtimes created successfully.",
        "Tạo hàng loạt lịch chiếu thành công.",
      ),
      "success",
    );
  };

  const handleSubmitShowtime = async (values) => {
    try {
      if (formMode === "edit" && editingShowtime) {
        await showtimeService.updateShowtime(editingShowtime.id, values);
        showToast(
          tx(
            "Showtime updated successfully.",
            "Cập nhật lịch chiếu thành công.",
          ),
          "success",
        );
      } else {
        await showtimeService.createShowtime(values);
        showToast(
          tx("Showtime created successfully.", "Tạo lịch chiếu thành công."),
          "success",
        );
      }
      await loadShowtimes(currentPage);
      if (selectedCinemaId) loadTimelineData(selectedCinemaId);
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
      await showtimeService.deleteShowtime(deleteTarget.id);
      showToast(
        tx("Showtime deleted successfully.", "Xóa lịch chiếu thành công."),
        "success",
      );
      await loadShowtimes(currentPage);
      if (selectedCinemaId) loadTimelineData(selectedCinemaId);
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to delete showtime."), "error");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  // ── Timeline filter handlers ──
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

  // ── Timeline rows (built from timeline-specific data) ──
  const timelineRows = useMemo(
    () =>
      buildTimelineRows({
        showtimes: timelineShowtimes,
        rooms,
        selectedDate,
        selectedCinemaId,
        selectedRoomId,
        startHour: timelineStartHour,
        endHour: timelineEndHour,
      }),
    [
      timelineShowtimes,
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

  // ── Stats (from current page data) ──
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
    isBulkFormOpen,
    formMode,
    editingShowtime,
    deletingId,
    deleteTarget,
    toast,
    scheduledCount,
    activeCount,
    totalItems,
    currentPage,
    totalPages,
    cinemas,
    rooms,
    roomsLoading,
    timelineLoading,
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
    handleOpenBulkCreate,
    handleCloseBulkCreate,
    handleBulkCreateSuccess,
    handlePagePrev,
    handlePageNext,
  };
}

export default useShowtimeManagement;

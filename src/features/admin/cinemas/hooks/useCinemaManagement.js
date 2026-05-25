import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
  getRoomsByCinema,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/features/admin/services/cinemaService";
import {
  CINEMA_STATUS,
  ROOM_STATUS,
  ROOM_TYPE,
  extractList,
  normalizeCinema,
  normalizeRoom,
  getErrorMessage,
} from "@/features/admin/cinemas/utils/cinemaAdapter";

const EMPTY_CINEMA_FORM = {
  name: "",
  address: "",
  phone: "",
  email: "",
  status: CINEMA_STATUS.ACTIVE,
};

const EMPTY_ROOM_FORM = {
  name: "",
  totalSeats: 100,
  roomType: ROOM_TYPE.STANDARD,
  status: ROOM_STATUS.ACTIVE,
};

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useCinemaManagement(tx) {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [isCinemaFormOpen, setIsCinemaFormOpen] = useState(false);
  const [cinemaFormMode, setCinemaFormMode] = useState("create");
  const [editingCinemaId, setEditingCinemaId] = useState(null);
  const [cinemaForm, setCinemaForm] = useState(EMPTY_CINEMA_FORM);
  const [cinemaFormError, setCinemaFormError] = useState("");
  const [savingCinema, setSavingCinema] = useState(false);

  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [roomFormMode, setRoomFormMode] = useState("create");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM_FORM);
  const [roomFormError, setRoomFormError] = useState("");
  const [savingRoom, setSavingRoom] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'cinema'|'room', item: any }
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    tone: "info",
  });

  const selectedCinema = useMemo(
    () => cinemas.find((item) => item.id === selectedCinemaId) ?? null,
    [cinemas, selectedCinemaId],
  );

  const summary = useMemo(() => {
    const totalRooms = cinemas.reduce(
      (sum, item) => sum + Number(item.roomsCount || 0),
      0,
    );
    const activeCinemas = cinemas.filter(
      (item) => item.status === CINEMA_STATUS.ACTIVE,
    ).length;
    return {
      totalCinemas: cinemas.length,
      totalRooms,
      activeCinemas,
    };
  }, [cinemas]);

  const showToast = useCallback((message, tone = "info") => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const id = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 2500);
    return () => window.clearTimeout(id);
  }, [toast.visible]);

  const loadCinemas = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const result = await getCinemas({ page: 1, pageSize: 100 });
      const list = extractList(result)
        .map(normalizeCinema)
        .filter((item) => item && !Number.isNaN(item.id));

      setCinemas(list);
      setSelectedCinemaId((current) => {
        if (current && list.some((item) => item.id === current)) return current;
        return list[0]?.id ?? null;
      });
    } catch (error) {
      setCinemas([]);
      setSelectedCinemaId(null);
      setFetchError(getErrorMessage(error, "Unable to load cinemas."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRooms = useCallback(
    async (cinemaId) => {
      if (!cinemaId) {
        setRooms([]);
        return;
      }

      setRoomsLoading(true);
      try {
        const result = await getRoomsByCinema(cinemaId);
        const list = extractList(result)
          .map(normalizeRoom)
          .filter((item) => item && !Number.isNaN(item.id));

        setRooms(list);

        // update roomsCount of selected cinema in list
        setCinemas((current) =>
          current.map((item) =>
            item.id === cinemaId ? { ...item, roomsCount: list.length } : item,
          ),
        );
      } catch (error) {
        setRooms([]);
        showToast(getErrorMessage(error, "Unable to load rooms."), "error");
      } finally {
        setRoomsLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      loadCinemas();
    }, 0);
    return () => window.clearTimeout(id);
  }, [loadCinemas]);

  useEffect(() => {
    if (!selectedCinemaId) {
      setRooms([]);
      return;
    }
    loadRooms(selectedCinemaId);
  }, [selectedCinemaId, loadRooms]);

  const handleSelectCinema = (cinemaId) => {
    setSelectedCinemaId(Number(cinemaId));
  };

  const handleOpenCreateCinema = () => {
    setCinemaFormMode("create");
    setEditingCinemaId(null);
    setCinemaForm(EMPTY_CINEMA_FORM);
    setCinemaFormError("");
    setIsCinemaFormOpen(true);
  };

  const handleOpenEditCinema = (cinema) => {
    setCinemaFormMode("edit");
    setEditingCinemaId(cinema.id);
    setCinemaForm({
      name: cinema.name ?? "",
      address: cinema.address ?? "",
      phone: cinema.phone ?? "",
      email: cinema.email ?? "",
      status: cinema.status ?? CINEMA_STATUS.ACTIVE,
    });
    setCinemaFormError("");
    setIsCinemaFormOpen(true);
  };

  const handleCloseCinemaForm = () => {
    setIsCinemaFormOpen(false);
    setEditingCinemaId(null);
    setCinemaFormError("");
  };

  const handleCinemaFormChange = (field) => (event) => {
    const value = event.target.value;
    setCinemaForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmitCinema = async (event) => {
    event.preventDefault();

    if (!cinemaForm.name.trim()) {
      setCinemaFormError(
        tx("Cinema name is required.", "Tên rạp là bắt buộc."),
      );
      return;
    }

    if (!cinemaForm.address.trim()) {
      setCinemaFormError(
        tx("Cinema address is required.", "Địa chỉ rạp là bắt buộc."),
      );
      return;
    }

    setSavingCinema(true);
    setCinemaFormError("");

    const payload = {
      name: cinemaForm.name.trim(),
      address: cinemaForm.address.trim(),
      phone: cinemaForm.phone.trim() || undefined,
      email: cinemaForm.email.trim() || undefined,
      status: cinemaForm.status,
    };

    try {
      if (cinemaFormMode === "edit" && editingCinemaId) {
        await updateCinema(editingCinemaId, payload);
        showToast(
          tx("Cinema updated successfully.", "Cập nhật rạp thành công."),
          "success",
        );
      } else {
        await createCinema(payload);
        showToast(
          tx("Cinema created successfully.", "Tạo rạp thành công."),
          "success",
        );
      }

      await loadCinemas();
      setIsCinemaFormOpen(false);
    } catch (error) {
      setCinemaFormError(getErrorMessage(error, "Failed to save cinema."));
    } finally {
      setSavingCinema(false);
    }
  };

  const handleOpenCreateRoom = () => {
    if (!selectedCinemaId) return;
    setRoomFormMode("create");
    setEditingRoomId(null);
    setRoomForm(EMPTY_ROOM_FORM);
    setRoomFormError("");
    setIsRoomFormOpen(true);
  };

  const handleOpenEditRoom = (room) => {
    setRoomFormMode("edit");
    setEditingRoomId(room.id);
    setRoomForm({
      name: room.name ?? "",
      totalSeats: room.totalSeats ?? 100,
      roomType: room.roomType ?? ROOM_TYPE.STANDARD,
      status: room.status ?? ROOM_STATUS.ACTIVE,
    });
    setRoomFormError("");
    setIsRoomFormOpen(true);
  };

  const handleCloseRoomForm = () => {
    setIsRoomFormOpen(false);
    setEditingRoomId(null);
    setRoomFormError("");
  };

  const handleRoomFormChange = (field) => (event) => {
    const value = event.target.value;
    setRoomForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmitRoom = async (event) => {
    event.preventDefault();

    if (!selectedCinemaId) {
      setRoomFormError(
        tx("Please choose a cinema first.", "Vui lòng chọn rạp trước."),
      );
      return;
    }

    if (!roomForm.name.trim()) {
      setRoomFormError(tx("Room name is required.", "Tên phòng là bắt buộc."));
      return;
    }

    if (!Number(roomForm.totalSeats) || Number(roomForm.totalSeats) <= 0) {
      setRoomFormError(
        tx("Total seats must be greater than 0.", "Số ghế phải lớn hơn 0."),
      );
      return;
    }

    setSavingRoom(true);
    setRoomFormError("");

    const payload = {
      name: roomForm.name.trim(),
      totalSeats: Number(roomForm.totalSeats),
      roomType: roomForm.roomType,
      status: roomForm.status,
    };

    try {
      if (roomFormMode === "edit" && editingRoomId) {
        await updateRoom(editingRoomId, payload);
        showToast(
          tx("Room updated successfully.", "Cập nhật phòng thành công."),
          "success",
        );
      } else {
        await createRoom(selectedCinemaId, payload);
        showToast(
          tx("Room created successfully.", "Tạo phòng thành công."),
          "success",
        );
      }

      await loadRooms(selectedCinemaId);
      setIsRoomFormOpen(false);
    } catch (error) {
      setRoomFormError(getErrorMessage(error, "Failed to save room."));
    } finally {
      setSavingRoom(false);
    }
  };

  const handleRequestDeleteCinema = (cinema) => {
    setDeleteTarget({ type: "cinema", item: cinema });
  };

  const handleRequestDeleteRoom = (room) => {
    setDeleteTarget({ type: "room", item: room });
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "cinema") {
        await deleteCinema(deleteTarget.item.id);
        showToast(
          tx("Cinema deleted successfully.", "Xóa rạp thành công."),
          "success",
        );
        await loadCinemas();
      } else {
        await deleteRoom(deleteTarget.item.id);
        showToast(
          tx("Room deleted successfully.", "Xóa phòng thành công."),
          "success",
        );
        if (selectedCinemaId) {
          await loadRooms(selectedCinemaId);
        }
      }
    } catch (error) {
      showToast(getErrorMessage(error, "Delete failed."), "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cinemaStatusOptions = Object.values(CINEMA_STATUS);
  const roomStatusOptions = Object.values(ROOM_STATUS);
  const roomTypeOptions = Object.values(ROOM_TYPE);

  return {
    cinemas,
    rooms,
    selectedCinema,
    selectedCinemaId,
    loading,
    roomsLoading,
    fetchError,
    summary,
    toast,

    isCinemaFormOpen,
    cinemaFormMode,
    cinemaForm,
    cinemaFormError,
    savingCinema,

    isRoomFormOpen,
    roomFormMode,
    roomForm,
    roomFormError,
    savingRoom,

    deleteTarget,

    cinemaStatusOptions,
    roomStatusOptions,
    roomTypeOptions,

    handleSelectCinema,

    handleOpenCreateCinema,
    handleOpenEditCinema,
    handleCloseCinemaForm,
    handleCinemaFormChange,
    handleSubmitCinema,

    handleOpenCreateRoom,
    handleOpenEditRoom,
    handleCloseRoomForm,
    handleRoomFormChange,
    handleSubmitRoom,

    handleRequestDeleteCinema,
    handleRequestDeleteRoom,
    handleCancelDelete,
    handleConfirmDelete,
  };
}

export default useCinemaManagement;

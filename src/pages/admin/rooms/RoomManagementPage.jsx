import DataTable from "@/components/shared/DataTable";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useCinemaManagement from "@/features/admin/cinemas/hooks/useCinemaManagement";

function RoomManagementPage() {
  const { tx } = useLanguage();
  const {
    cinemas,
    rooms,
    selectedCinema,
    selectedCinemaId,
    loading,
    roomsLoading,
    fetchError,
    toast,

    isRoomFormOpen,
    roomFormMode,
    roomForm,
    roomFormError,
    savingRoom,

    deleteTarget,

    roomStatusOptions,
    roomTypeOptions,

    handleSelectCinema,

    handleOpenCreateRoom,
    handleOpenEditRoom,
    handleCloseRoomForm,
    handleRoomFormChange,
    handleSubmitRoom,

    handleRequestDeleteRoom,
    handleCancelDelete,
    handleConfirmDelete,
  } = useCinemaManagement(tx);

  const roomColumns = [
    { key: "id", label: tx("ID", "Mã") },
    { key: "name", label: tx("Room", "Phòng") },
    { key: "roomType", label: tx("Type", "Loại phòng") },
    { key: "status", label: tx("Status", "Trạng thái") },
    { key: "actions", label: tx("Actions", "Hành động") },
  ];

  const roomRows = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    roomType: room.roomType,
    status: room.status,
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs"
          onClick={() => handleOpenEditRoom(room)}
        >
          {tx("Edit", "Sửa")}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => handleRequestDeleteRoom(room)}
        >
          {tx("Delete", "Xóa")}
        </Button>
      </div>
    ),
  }));

  return (
    <div className="space-y-5">

      <section className="surface-card space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex w-full max-w-md flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Cinema branch", "Chi nhánh rạp")}
            </span>
            <select
              value={selectedCinemaId ?? ""}
              onChange={(event) => handleSelectCinema(event.target.value)}
              className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-selected focus:border-ink focus:outline-none"
            >
              <option value="" disabled>
                {tx("Select a cinema", "Chọn rạp")}
              </option>
              {cinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </label>

          <Button onClick={handleOpenCreateRoom} disabled={!selectedCinema}>
            {tx("Add room", "Thêm phòng")}
          </Button>
        </div>

        {loading ? (
          <p className="text-xs text-stone">{tx("Loading...", "Đang tải...")}</p>
        ) : null}
        {fetchError ? (
          <p className="text-sm text-rose">{fetchError}</p>
        ) : null}
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="section-label">
            {selectedCinema
              ? tx(
                  `Rooms of ${selectedCinema.name}`,
                  `Phòng của ${selectedCinema.name}`,
                )
              : tx("Room List", "Danh sách phòng")}
          </p>
        </div>

        {!selectedCinema ? (
          <p className="text-sm text-stone">
            {tx("Please select a cinema first.", "Vui lòng chọn rạp trước.")}
          </p>
        ) : roomsLoading ? (
          <p className="text-sm text-stone">
            {tx("Loading rooms...", "Đang tải phòng...")}
          </p>
        ) : roomRows.length === 0 ? (
          <p className="text-sm text-stone">
            {tx("No rooms found.", "Chưa có phòng nào.")}
          </p>
        ) : (
          <DataTable columns={roomColumns} rows={roomRows} />
        )}
      </section>

      <Modal
        isOpen={isRoomFormOpen}
        onClose={handleCloseRoomForm}
        title={
          roomFormMode === "edit"
            ? tx("Edit Room", "Sửa phòng")
            : tx("Create Room", "Tạo phòng")
        }
      >
        <form onSubmit={handleSubmitRoom} className="space-y-3">
          <Input
            label={tx("Room name", "Tên phòng")}
            value={roomForm.name}
            onChange={handleRoomFormChange("name")}
          />

          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Room type", "Loại phòng")}
            </span>
            <select
              value={roomForm.roomType}
              onChange={handleRoomFormChange("roomType")}
              className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-selected focus:border-ink focus:outline-none"
            >
              {roomTypeOptions.map((roomType) => (
                <option key={roomType} value={roomType}>
                  {roomType}
                </option>
              ))}
            </select>
          </label>

          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Status", "Trạng thái")}
            </span>
            <select
              value={roomForm.status}
              onChange={handleRoomFormChange("status")}
              className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-selected focus:border-ink focus:outline-none"
            >
              {roomStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          {roomFormError ? (
            <p className="text-sm text-rose">{roomFormError}</p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseRoomForm}
              disabled={savingRoom}
            >
              {tx("Cancel", "Hủy")}
            </Button>
            <Button type="submit" disabled={savingRoom}>
              {savingRoom ? tx("Saving...", "Đang lưu...") : tx("Save", "Lưu")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx("Delete room", "Xóa phòng")}
        description={tx(
          `Do you want to delete room "${deleteTarget?.item?.name ?? ""}"?`,
          `Bạn có chắc muốn xóa phòng "${deleteTarget?.item?.name ?? ""}"?`,
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        tone={toast.tone}
      />
    </div>
  );
}

export default RoomManagementPage;


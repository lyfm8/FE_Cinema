import DataTable from "@/components/shared/DataTable";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useCinemaManagement from "@/features/admin/cinemas/hooks/useCinemaManagement";

function CinemaManagementPage() {
  const { tx } = useLanguage();
  const {
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
  } = useCinemaManagement(tx);

  const cinemaColumns = [
    { key: "id", label: tx("ID", "Mã") },
    { key: "name", label: tx("Cinema", "Rạp") },
    { key: "address", label: tx("Address", "Địa chỉ") },
    { key: "phone", label: tx("Phone", "SĐT") },
    { key: "status", label: tx("Status", "Trạng thái") },
    { key: "roomsCount", label: tx("Rooms", "Số phòng") },
    { key: "actions", label: tx("Actions", "Hành động") },
  ];

  const cinemaRows = cinemas.map((cinema) => ({
    id: cinema.id,
    name: (
      <button
        type="button"
        className={`text-left underline ${selectedCinemaId === cinema.id ? "text-ink" : "text-stone"}`}
        onClick={() => handleSelectCinema(cinema.id)}
      >
        {cinema.name}
      </button>
    ),
    address: cinema.address || "-",
    phone: cinema.phone || "-",
    status: cinema.status,
    roomsCount: cinema.roomsCount,
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs"
          onClick={() => handleOpenEditCinema(cinema)}
        >
          {tx("Edit", "Sửa")}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => handleRequestDeleteCinema(cinema)}
        >
          {tx("Delete", "Xóa")}
        </Button>
      </div>
    ),
  }));

  const roomColumns = [
    { key: "id", label: tx("ID", "Mã") },
    { key: "name", label: tx("Room", "Phòng") },
    { key: "totalSeats", label: tx("Total Seats", "Số ghế") },
    { key: "roomType", label: tx("Type", "Loại phòng") },
    { key: "status", label: tx("Status", "Trạng thái") },
    { key: "actions", label: tx("Actions", "Hành động") },
  ];

  const roomRows = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    totalSeats: room.totalSeats,
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx("Admin", "Quản trị")}
          </p>
          <h1 className="text-3xl font-medium text-ink">
            {tx("Cinema Management", "Quản lý rạp")}
          </h1>
        </div>

        <Button onClick={handleOpenCreateCinema}>
          {tx("Add cinema", "Thêm rạp")}
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">
            {tx("Total Cinemas", "Tổng rạp")}
          </p>
          <p className="movie-title text-xl">{summary.totalCinemas}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">
            {tx("Total Rooms", "Tổng phòng")}
          </p>
          <p className="movie-title text-xl">{summary.totalRooms}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">
            {tx("Active Cinemas", "Rạp hoạt động")}
          </p>
          <p className="movie-title text-xl">{summary.activeCinemas}</p>
        </article>
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-label">{tx("Cinema List", "Danh sách rạp")}</p>
          {loading ? (
            <p className="text-xs text-stone">
              {tx("Loading...", "Đang tải...")}
            </p>
          ) : null}
        </div>

        {fetchError ? (
          <p className="mb-3 text-sm text-rose">{fetchError}</p>
        ) : null}
        {!loading && !fetchError && cinemaRows.length === 0 ? (
          <p className="text-sm text-stone">
            {tx("No cinemas found.", "Chưa có rạp nào.")}
          </p>
        ) : (
          <DataTable columns={cinemaColumns} rows={cinemaRows} />
        )}
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
          <Button onClick={handleOpenCreateRoom} disabled={!selectedCinema}>
            {tx("Add room", "Thêm phòng")}
          </Button>
        </div>

        {!selectedCinema ? (
          <p className="text-sm text-stone">
            {tx(
              "Please select a cinema first.",
              "Vui lòng chọn một rạp trước.",
            )}
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
        isOpen={isCinemaFormOpen}
        onClose={handleCloseCinemaForm}
        title={
          cinemaFormMode === "edit"
            ? tx("Edit Cinema", "Sửa rạp")
            : tx("Create Cinema", "Tạo rạp")
        }
      >
        <form onSubmit={handleSubmitCinema} className="space-y-3">
          <Input
            label={tx("Cinema name", "Tên rạp")}
            value={cinemaForm.name}
            onChange={handleCinemaFormChange("name")}
          />
          <Input
            label={tx("Address", "Địa chỉ")}
            value={cinemaForm.address}
            onChange={handleCinemaFormChange("address")}
          />
          <Input
            label={tx("Phone", "SĐT")}
            value={cinemaForm.phone}
            onChange={handleCinemaFormChange("phone")}
          />
          <Input
            label={tx("Email", "Email")}
            value={cinemaForm.email}
            onChange={handleCinemaFormChange("email")}
          />

          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx("Status", "Trạng thái")}
            </span>
            <select
              value={cinemaForm.status}
              onChange={handleCinemaFormChange("status")}
              className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-selected focus:border-ink focus:outline-none"
            >
              {cinemaStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          {cinemaFormError ? (
            <p className="text-sm text-rose">{cinemaFormError}</p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseCinemaForm}
              disabled={savingCinema}
            >
              {tx("Cancel", "Hủy")}
            </Button>
            <Button type="submit" disabled={savingCinema}>
              {savingCinema
                ? tx("Saving...", "Đang lưu...")
                : tx("Save", "Lưu")}
            </Button>
          </div>
        </form>
      </Modal>

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
          <Input
            label={tx("Total seats", "Tổng số ghế")}
            type="number"
            value={String(roomForm.totalSeats)}
            onChange={handleRoomFormChange("totalSeats")}
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
        title={
          deleteTarget?.type === "cinema"
            ? tx("Delete cinema", "Xóa rạp")
            : tx("Delete room", "Xóa phòng")
        }
        description={
          deleteTarget?.type === "cinema"
            ? tx(
                `Do you want to delete cinema "${deleteTarget?.item?.name ?? ""}"?`,
                `Bạn có chắc muốn xóa rạp "${deleteTarget?.item?.name ?? ""}"?`,
              )
            : tx(
                `Do you want to delete room "${deleteTarget?.item?.name ?? ""}"?`,
                `Bạn có chắc muốn xóa phòng "${deleteTarget?.item?.name ?? ""}"?`,
              )
        }
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

export default CinemaManagementPage;

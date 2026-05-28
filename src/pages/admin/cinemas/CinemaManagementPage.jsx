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
    selectedCinemaId,
    loading,
    fetchError,
    summary,
    toast,

    isCinemaFormOpen,
    cinemaFormMode,
    cinemaForm,
    cinemaFormError,
    savingCinema,

    deleteTarget,

    cinemaStatusOptions,

    handleSelectCinema,

    handleOpenCreateCinema,
    handleOpenEditCinema,
    handleCloseCinemaForm,
    handleCinemaFormChange,
    handleSubmitCinema,

    handleRequestDeleteCinema,
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-end gap-3">
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx("Delete cinema", "Xóa rạp")}
        description={tx(
          `Do you want to delete cinema "${deleteTarget?.item?.name ?? ""}"?`,
          `Bạn có chắc muốn xóa rạp "${deleteTarget?.item?.name ?? ""}"?`,
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

export default CinemaManagementPage;

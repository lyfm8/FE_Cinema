import ShowtimeTable from "@/pages/admin/showtimes/components/ShowtimeTable";
import ShowtimeFormModal from "@/pages/admin/showtimes/components/ShowtimeFormModal";
import ShowtimeTimeline from "@/pages/admin/showtimes/components/ShowtimeTimeline";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useShowtimeManagement from "@/features/admin/showtimes/hooks/useShowtimeManagement";

function ShowtimeManagementPage() {
  const { tx } = useLanguage();
  const {
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
  } = useShowtimeManagement(tx);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx("Admin", "Quản trị")}
          </p>
          <h1 className="text-3xl font-medium text-ink">
            {tx("Showtime Management", "Quản lý lịch chiếu")}
          </h1>
        </div>

        <Button onClick={handleOpenCreateForm}>
          {tx("Add showtime", "Thêm lịch chiếu")}
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">
            {tx("Total Showtimes", "Tổng lịch chiếu")}
          </p>
          <p className="movie-title text-xl">{showtimes.length}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx("Scheduled", "Đã lên lịch")}</p>
          <p className="movie-title text-xl">{scheduledCount}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx("Active", "Đang chiếu")}</p>
          <p className="movie-title text-xl">{activeCount}</p>
        </article>
      </section>

      <section className="surface-card space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="section-label">
            {tx("Calendar / Timeline", "Calendar / Timeline (Gantt)")}
          </p>
          <p className="text-xs text-stone">
            {tx(
              `Rooms: ${timelineRoomCount} · Showtimes: ${timelineBusyCount}`,
              `Phòng: ${timelineRoomCount} · Suất chiếu: ${timelineBusyCount}`,
            )}
          </p>
        </div>

        <ShowtimeTimeline
          tx={tx}
          selectedDate={selectedDate}
          selectedCinemaId={selectedCinemaId}
          selectedRoomId={selectedRoomId}
          cinemaOptions={cinemas}
          roomOptions={rooms}
          roomsLoading={roomsLoading}
          timelineRows={timelineRows}
          startHour={timelineStartHour}
          endHour={timelineEndHour}
          onChangeDate={handleTimelineDateChange}
          onChangeCinema={handleTimelineCinemaChange}
          onChangeRoom={handleTimelineRoomChange}
        />
      </section>

      <section className="surface-card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="section-label">
            {tx("Schedule Table", "Bảng lịch chiếu")}
          </p>
          {loading ? (
            <p className="text-xs text-stone">
              {tx("Loading...", "Đang tải...")}
            </p>
          ) : null}
        </div>

        {fetchError ? <p className="text-sm text-rose">{fetchError}</p> : null}

        {!loading && !fetchError && showtimes.length === 0 ? (
          <p className="text-sm text-stone">
            {tx("No showtimes found.", "Chưa có lịch chiếu nào.")}
          </p>
        ) : (
          <ShowtimeTable
            showtimes={showtimes}
            deletingId={deletingId}
            onEdit={handleOpenEditForm}
            onDelete={handleRequestDelete}
          />
        )}
      </section>

      {isFormOpen ? (
        <ShowtimeFormModal
          open={isFormOpen}
          mode={formMode}
          showtime={editingShowtime}
          onClose={handleCloseForm}
          onSubmit={handleSubmitShowtime}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx("Delete showtime", "Xóa lịch chiếu")}
        description={tx(
          `Do you want to delete showtime #${deleteTarget?.id ?? ""}?`,
          `Bạn có chắc muốn xóa lịch chiếu #${deleteTarget?.id ?? ""}?`,
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

export default ShowtimeManagementPage;

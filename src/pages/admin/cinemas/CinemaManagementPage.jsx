import CinemaTable from '@/pages/admin/cinemas/components/CinemaTable';
import CinemaFormModal from '@/pages/admin/cinemas/components/CinemaFormModal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Pagination from '@/components/shared/Pagination';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useCinemaManagement from '@/features/admin/cinemas/hooks/useCinemaManagement';

function CinemaManagementPage() {
  const { tx } = useLanguage();
  const {
    useMock,
    cinemas,
    existingCinemas,
    loading,
    fetchError,
    page,
    totalPages,
    searchName,
    searchAddress,
    searchPhone,
    searchEmail,
    isFormOpen,
    formMode,
    editingCinema,
    deleteTarget,
    deletingId,
    toast,
    summary,
    handleSearchNameChange,
    handleSearchAddressChange,
    handleSearchPhoneChange,
    handleSearchEmailChange,
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,
    handleSubmitCinema,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
    handlePrevPage,
    handleNextPage,
  } = useCinemaManagement(tx);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx('Admin', 'Quản trị')}
          </p>
          <h1 className="text-3xl font-medium text-ink">{tx('Cinema Management', 'Quản lý rạp')}</h1>
        </div>
        <Button onClick={handleOpenCreateForm}>{tx('Add cinema', 'Thêm rạp')}</Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Total Branches', 'Tổng chi nhánh')}</p>
          <p className="movie-title text-xl">{summary.totalBranches}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('With Phone', 'Có số điện thoại')}</p>
          <p className="movie-title text-xl">{summary.phoneCount}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('With Email', 'Có email')}</p>
          <p className="movie-title text-xl">{summary.emailCount}</p>
        </article>
      </section>

      <section className="surface-card space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="section-label">{tx('Branch List', 'Danh sách chi nhánh')}</p>
          <div className="text-xs text-stone">
            {useMock ? tx('Mock mode', 'Chế độ mock') : tx('Live data', 'Dữ liệu thật')}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label={tx('Search by name', 'Tìm theo tên')}
            value={searchName}
            onChange={(event) => handleSearchNameChange(event.target.value)}
          />
          <Input
            label={tx('Search by address', 'Tìm theo địa chỉ')}
            value={searchAddress}
            onChange={(event) => handleSearchAddressChange(event.target.value)}
          />
          <Input
            label={tx('Search by phone', 'Tìm theo số điện thoại')}
            value={searchPhone}
            onChange={(event) => handleSearchPhoneChange(event.target.value)}
          />
          <Input
            label={tx('Search by email', 'Tìm theo email')}
            value={searchEmail}
            onChange={(event) => handleSearchEmailChange(event.target.value)}
          />
        </div>

        {loading ? <p className="text-xs text-stone">{tx('Loading...', 'Đang tải...')}</p> : null}
        {fetchError ? <p className="text-sm text-rose">{fetchError}</p> : null}

        {!loading && !fetchError && cinemas.length === 0 ? (
          <p className="text-sm text-stone">{tx('No cinemas found.', 'Không có rạp phù hợp.')}</p>
        ) : (
          <CinemaTable
            cinemas={cinemas}
            deletingId={deletingId}
            onEdit={handleOpenEditForm}
            onDelete={handleRequestDelete}
          />
        )}

        <div className="flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPrev={handlePrevPage} onNext={handleNextPage} />
        </div>
      </section>

      {isFormOpen ? (
        <CinemaFormModal
          key={`${formMode}-${editingCinema?.id ?? 'new'}`}
          open={isFormOpen}
          mode={formMode}
          cinema={editingCinema}
          existingCinemas={existingCinemas}
          onClose={handleCloseForm}
          onSubmit={handleSubmitCinema}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx('Delete cinema', 'Xóa rạp')}
        description={tx(
          `Do you want to delete cinema #${deleteTarget?.id ?? ''}?`,
          `Bạn có chắc muốn xóa rạp #${deleteTarget?.id ?? ''}?`,
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast visible={toast.visible} message={toast.message} tone={toast.tone} />
    </div>
  );
}

export default CinemaManagementPage;

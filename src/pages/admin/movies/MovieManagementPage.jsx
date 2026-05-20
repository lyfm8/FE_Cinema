import MovieTable from '@/pages/admin/movies/components/MovieTable';
import MovieFormModal from '@/pages/admin/movies/components/MovieFormModal';
import MovieDetailModal from '@/pages/admin/movies/components/MovieDetailModal';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useMovieManagement from '@/features/admin/movies/hooks/useMovieManagement';

function MovieManagementPage() {
  const { tx } = useLanguage();
  const {
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
  } = useMovieManagement(tx);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx('Admin', 'Quản trị')}
          </p>
          <h1 className="text-3xl font-medium text-ink">{tx('Movie Management', 'Quản lý phim')}</h1>
        </div>

        <Button onClick={handleOpenCreateForm}>{tx('Add movie', 'Thêm phim')}</Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Total Movies', 'Tổng phim')}</p>
          <p className="movie-title text-xl">{movies.length}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Now Showing', 'Đang chiếu')}</p>
          <p className="movie-title text-xl">{nowShowingCount}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Coming Soon', 'Sắp chiếu')}</p>
          <p className="movie-title text-xl">{comingSoonCount}</p>
        </article>
      </section>

      <section className="surface-card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="section-label">{tx('Movie List', 'Danh sách phim')}</p>
          {loading ? <p className="text-xs text-stone">{tx('Loading...', 'Đang tải...')}</p> : null}
        </div>

        {fetchError ? <p className="text-sm text-rose">{fetchError}</p> : null}

        {!loading && !fetchError && movies.length === 0 ? (
          <p className="text-sm text-stone">{tx('No movies found.', 'Chưa có phim nào.')}</p>
        ) : (
          <MovieTable
            movies={movies}
            deletingMovieId={deletingMovieId}
            onView={handleViewMovie}
            onEdit={handleOpenEditForm}
            onDelete={handleRequestDelete}
          />
        )}
      </section>

      {isFormOpen ? (
        <MovieFormModal
          open={isFormOpen}
          mode={formMode}
          movie={editingMovie}
          onClose={handleCloseForm}
          onSubmit={handleSubmitMovie}
        />
      ) : null}

      <MovieDetailModal
        open={isDetailOpen}
        loading={detailLoading}
        movie={detailMovie}
        onClose={handleCloseDetail}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx('Delete movie', 'Xóa phim')}
        description={tx(
          `Do you want to delete "${deleteTarget?.title ?? ''}"?`,
          `Bạn có chắc muốn xóa phim "${deleteTarget?.title ?? ''}"?`,
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast visible={toast.visible} message={toast.message} tone={toast.tone} />
    </div>
  );
}

export default MovieManagementPage;

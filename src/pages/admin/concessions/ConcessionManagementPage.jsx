import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import useConcessionManagement from '@/features/admin/concessions/hooks/useConcessionManagement';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import formatCurrency from '@/utils/formatCurrency';

function StockBadge({ value }) {
  const stock = Number(value) || 0;
  const toneClass =
    stock === 0
      ? 'bg-red-100 text-red-700'
      : stock <= 5
        ? 'bg-orange-100 text-orange-700'
        : 'bg-green-100 text-green-700';

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
      {stock}
    </span>
  );
}

function ConcessionManagementPage() {
  const { tx } = useLanguage();
  const {
    products,
    loading,
    fetchError,
    isFormOpen,
    formMode,
    form,
    formError,
    saving,
    deleteTarget,
    toast,
    summary,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useConcessionManagement(tx);

  const columns = [
    { key: 'id', label: tx('ID', 'Mã') },
    { key: 'name', label: tx('Product', 'Sản phẩm') },
    { key: 'price', label: tx('Price', 'Giá') },
    {
      key: 'stockQuantity',
      label: tx('Stock', 'Tồn kho'),
      render: (value) => <StockBadge value={value} />,
    },
    { key: 'actions', label: tx('Actions', 'Hành động') },
  ];

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatCurrency(product.price),
    stockQuantity: product.stockQuantity,
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs"
          onClick={() => openEditForm(product)}
        >
          {tx('Edit', 'Sửa')}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => requestDelete(product)}
        >
          {tx('Delete', 'Xóa')}
        </Button>
      </div>
    ),
  }));

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Products', 'Sản phẩm')}</p>
          <p className="movie-title text-xl">{summary.total}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Low stock', 'Sắp hết')}</p>
          <p className="movie-title text-xl">{summary.lowStock}</p>
        </article>
        <article className="surface-card p-3">
          <p className="section-label mb-1">{tx('Out of stock', 'Hết hàng')}</p>
          <p className="movie-title text-xl">{summary.outOfStock}</p>
        </article>
      </section>

      <section className="surface-card space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label mb-1">{tx('Concession Products', 'Quản lý bắp nước')}</p>
            <p className="text-sm text-stone">
              {tx(
                'Manage popcorn, drinks, combo price and available stock.',
                'Quản lý bắp, nước, combo, giá bán và số lượng tồn kho.',
              )}
            </p>
          </div>
          <Button onClick={openCreateForm}>{tx('Add product', 'Thêm sản phẩm')}</Button>
        </div>

        {loading ? <p className="text-xs text-stone">{tx('Loading...', 'Đang tải...')}</p> : null}
        {fetchError ? <p className="text-sm text-rose">{fetchError}</p> : null}

        {!loading && !fetchError && rows.length === 0 ? (
          <p className="text-sm text-stone">
            {tx('No concession products found.', 'Chưa có sản phẩm bắp nước nào.')}
          </p>
        ) : null}

        {rows.length > 0 ? <DataTable columns={columns} rows={rows} /> : null}
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          formMode === 'edit'
            ? tx('Edit concession product', 'Sửa sản phẩm bắp nước')
            : tx('Add concession product', 'Thêm sản phẩm bắp nước')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label={tx('Product name', 'Tên sản phẩm')}
            value={form.name}
            onChange={handleFormChange('name')}
          />
          <Input
            label={tx('Price', 'Giá')}
            type="number"
            value={form.price}
            onChange={handleFormChange('price')}
          />
          <Input
            label={tx('Stock quantity', 'Số lượng tồn kho')}
            type="number"
            value={form.stockQuantity}
            onChange={handleFormChange('stockQuantity')}
          />

          {formError ? <p className="text-sm text-rose">{formError}</p> : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={closeForm} disabled={saving}>
              {tx('Cancel', 'Hủy')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? tx('Saving...', 'Đang lưu...') : tx('Save', 'Lưu')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={tx('Delete product', 'Xóa sản phẩm')}
        description={tx(
          `Do you want to delete "${deleteTarget?.name ?? ''}"?`,
          `Bạn có chắc muốn xóa "${deleteTarget?.name ?? ''}"?`,
        )}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Toast visible={toast.visible} message={toast.message} tone={toast.tone} />
    </div>
  );
}

export default ConcessionManagementPage;

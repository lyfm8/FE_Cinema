import DataTable from '@/components/shared/DataTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import useTicketPriceManagement from '@/features/admin/ticket-prices/hooks/useTicketPriceManagement';
import { DAY_TYPE } from '@/features/admin/ticket-prices/constants/ticketPriceConstants';
import formatCurrency from '@/utils/formatCurrency';

function TicketPriceManagementPage() {
  const { tx } = useLanguage();
  const {
    loading,
    fetchError,
    isFormOpen,
    form,
    formError,
    saving,
    toast,
    roomTypes,
    priceMap,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
  } = useTicketPriceManagement(tx);

  const columns = [
    { key: 'roomType', label: tx('Room type', 'Loại phòng') },
    { key: 'weekdayPrice', label: tx('Weekday price', 'Giá ngày thường') },
    { key: 'weekendPrice', label: tx('Weekend price', 'Giá cuối tuần') },
    { key: 'actions', label: tx('Actions', 'Hành động') },
  ];

  const rows = roomTypes.map((roomType) => {
    const weekdayValue = priceMap[roomType]?.[DAY_TYPE.WEEKDAY];
    const weekendValue = priceMap[roomType]?.[DAY_TYPE.WEEKEND];

    const weekdayPrice =
      typeof weekdayValue === 'number' && weekdayValue > 0
        ? formatCurrency(weekdayValue)
        : tx('Not set', 'Chưa cấu hình');

    const weekendPrice =
      typeof weekendValue === 'number' && weekendValue > 0
        ? formatCurrency(weekendValue)
        : tx('Not set', 'Chưa cấu hình');

    return {
      roomType,
      weekdayPrice,
      weekendPrice,
      actions: (
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs"
          onClick={() => openEditForm(roomType)}
        >
          {tx('Edit', 'Sửa')}
        </Button>
      ),
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium text-ink">
            {tx('Ticket Prices', 'Quản lý giá vé')}
          </h1>
        </div>
      </div>

      <section className="surface-card space-y-3 p-4">
        {loading ? (
          <p className="text-xs text-stone">{tx('Loading...', 'Đang tải...')}</p>
        ) : null}
        {fetchError ? (
          <p className="text-sm text-rose">{fetchError}</p>
        ) : null}

        {!loading && !fetchError && rows.length === 0 ? (
          <p className="text-sm text-stone">
            {tx('No ticket prices found.', 'Chưa có giá vé nào.')}
          </p>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={tx('Update prices', 'Cập nhật giá vé')}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">
              {tx('Room type', 'Loại phòng')}
            </span>
            <p className="rounded-md border-base bg-cream px-3 py-2 text-sm text-charcoal">
              {form.roomType}
            </p>
          </div>

          <Input
            label={tx('Weekday price', 'Giá ngày thường')}
            type="number"
            value={form.weekdayPrice}
            onChange={handleFormChange('weekdayPrice')}
          />

          <Input
            label={tx('Weekend price', 'Giá cuối tuần')}
            type="number"
            value={form.weekendPrice}
            onChange={handleFormChange('weekendPrice')}
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

      <Toast visible={toast.visible} message={toast.message} tone={toast.tone} />
    </div>
  );
}

export default TicketPriceManagementPage;

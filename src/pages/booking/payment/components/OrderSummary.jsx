import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/** @param {{ totalPrice: number, loading: boolean, onSubmit: (event: import('react').FormEvent<HTMLFormElement>) => void }} props */
function OrderSummary({ totalPrice, loading, onSubmit }) {
  const { tx } = useLanguage();

  return (
    <aside className="surface-card h-fit p-4 lg:sticky lg:top-6">
      <p className="section-label mb-3">{tx('Order Summary', 'Tóm tắt đơn hàng')}</p>
      <div className="mb-4 rounded-md border-base bg-cream p-3">
        <p className="mb-2 text-xs text-stone">{tx('Ticket total', 'Tổng tiền vé')}</p>
        <p className="movie-title text-xl">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="mb-5 text-xs text-stone">
        {tx(
          'By continuing, you confirm your booking information is correct.',
          'Khi tiếp tục, bạn xác nhận thông tin đặt vé là chính xác.',
        )}
      </p>

      <Button className="w-full" onClick={onSubmit} disabled={loading}>
        {loading ? tx('Processing...', 'Đang xử lý...') : tx('Pay now', 'Thanh toán ngay')}
      </Button>
    </aside>
  );
}

export default OrderSummary;


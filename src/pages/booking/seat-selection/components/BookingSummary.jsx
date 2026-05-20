import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/**
 * @param {{
 *  selectedSeats: string[],
 *  totalPrice: number,
 *  onContinue: () => void
 * }} props
 */
function BookingSummary({ selectedSeats, totalPrice, onContinue }) {
  const { tx } = useLanguage();

  return (
    <aside className="surface-card h-fit p-4 lg:sticky lg:top-6">
      <p className="section-label mb-3">{tx('Summary', 'Tóm tắt')}</p>
      <div className="mb-4 space-y-2 rounded-md border-base bg-cream p-3">
        <p className="text-xs text-stone">{tx('Selected seats', 'Ghế đã chọn')}</p>
        <p className="text-sm text-charcoal">{selectedSeats.join(', ') || tx('No seat selected', 'Chưa chọn ghế')}</p>
        <span className="inline-flex rounded-full border-base bg-paper px-2.5 py-1 text-xs text-stone">
          {tx(`${selectedSeats.length} seats`, `${selectedSeats.length} ghe`)}
        </span>
      </div>
      <p className="section-label mb-1">{tx('Total', 'Tổng cộng')}</p>
      <p className="movie-title mb-4 text-xl">{formatCurrency(totalPrice)}</p>
      <Button className="w-full" onClick={onContinue} disabled={selectedSeats.length === 0}>
        {tx('Continue', 'Tiếp tục')}
      </Button>
    </aside>
  );
}

export default BookingSummary;


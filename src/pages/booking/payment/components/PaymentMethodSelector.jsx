import useLanguage from '@/features/i18n/hooks/useLanguage';

const METHODS = [
  { value: 'CARD', label: 'Card' },
  { value: 'EWALLET', label: 'E-Wallet' },
  { value: 'BANK', label: 'Bank transfer' },
];

/** @param {{ selectedMethod: string, onChange: (value: string) => void }} props */
function PaymentMethodSelector({ selectedMethod, onChange }) {
  const { tx } = useLanguage();

  return (
    <div className="space-y-2.5">
      <p className="section-label">{tx('Payment Method', 'Phương thức thanh toán')}</p>
      {METHODS.map((method) => (
        <label
          key={method.value}
          className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
            selectedMethod === method.value ? 'border-selected bg-cream text-ink' : 'border-base text-stone hover:border-charcoal'
          }`}
        >
          <span>
            {tx(
              method.label,
              method.label === 'Card'
                ? 'Thẻ'
                : method.label === 'E-Wallet'
                  ? 'Ví điện tử'
                  : 'Chuyển khoản ngân hàng',
            )}
          </span>
          <input
            type="radio"
            name="payment-method"
            value={method.value}
            checked={selectedMethod === method.value}
            onChange={() => onChange(method.value)}
            className="h-4 w-4 accent-ink"
          />
        </label>
      ))}
    </div>
  );
}

export default PaymentMethodSelector;


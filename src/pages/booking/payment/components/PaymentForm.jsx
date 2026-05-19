import Input from '@/components/ui/Input';
import useLanguage from '@/hooks/useLanguage';

/** @param {{ customerName: string, onCustomerNameChange: (value: string) => void }} props */
function PaymentForm({ customerName, onCustomerNameChange }) {
  const { tx } = useLanguage();

  return (
    <div className="space-y-3">
      <p className="section-label">{tx('Card Details', 'Thông tin thẻ')}</p>
      <Input
        label={tx('Card holder', 'Chủ thẻ')}
        value={customerName}
        placeholder={tx('Full name', 'Họ và tên')}
        onChange={(event) => onCustomerNameChange(event.target.value)}
      />
      <p className="text-xs text-stone">
        {tx(
          'Card information is encrypted and processed by payment gateway.',
          'Thông tin thẻ duoc ma hoa va xu ly boi cong thanh toan.',
        )}
      </p>
    </div>
  );
}

export default PaymentForm;


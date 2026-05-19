import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '@/pages/booking/payment/components/PaymentForm';
import OrderSummary from '@/pages/booking/payment/components/OrderSummary';
import PaymentMethodSelector from '@/pages/booking/payment/components/PaymentMethodSelector';
import useBooking from '@/features/booking/hooks/useBooking';
import useLanguage from '@/hooks/useLanguage';
import { confirmPayment } from '@/features/booking/services/paymentService';

function PaymentPage() {
  const navigate = useNavigate();
  const { tx } = useLanguage();
  const { selectedSeats } = useBooking();
  const [method, setMethod] = useState('CARD');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = useMemo(() => selectedSeats.length * 90000, [selectedSeats]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmPayment({
        method,
        customerName,
        seats: selectedSeats,
      });

      navigate('/booking/confirmation');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? tx('Payment failed.', 'Thanh toán thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <p className="section-label eyebrow-row">
          <span className="kicker-dot" />
          {tx('Booking', 'Đặt vé')}
        </p>
        <h1 className="text-2xl font-medium text-ink">{tx('Payment', 'Thanh toán')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="surface-card space-y-5 p-4 md:p-6">
          <PaymentMethodSelector selectedMethod={method} onChange={setMethod} />
          <PaymentForm customerName={customerName} onCustomerNameChange={setCustomerName} />
          {error ? <p className="rounded-md border-base border-rose bg-rose/10 px-3 py-2 text-xs text-rose">{error}</p> : null}
        </form>

        <OrderSummary totalPrice={totalPrice} loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default PaymentPage;




import PaymentForm from '@/pages/booking/payment/components/PaymentForm';
import OrderSummary from '@/pages/booking/payment/components/OrderSummary';
import PaymentMethodSelector from '@/pages/booking/payment/components/PaymentMethodSelector';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import usePaymentPage from '@/features/booking/payment/hooks/usePaymentPage';

function PaymentPage() {
  const { tx } = useLanguage();
  const {
    method,
    customerName,
    loading,
    error,
    totalPrice,
    setMethod,
    setCustomerName,
    handleSubmit,
  } = usePaymentPage(tx);

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
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

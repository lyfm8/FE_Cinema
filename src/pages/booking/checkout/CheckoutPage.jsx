import { useEffect } from 'react';
import useCheckoutPage from '@/features/booking/checkout/hooks/useCheckoutPage';

const PAYMENT_METHODS = [
  {
    id: 'MOMO',
    label: 'MoMo',
    color: '#ae2070',
    textColor: '#fff',
    logo: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <circle cx="20" cy="20" r="20" fill="#ae2070" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">MoMo</text>
      </svg>
    ),
  },
  {
    id: 'VNPAY',
    label: 'VNPay',
    color: '#0063a5',
    textColor: '#fff',
    logo: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <circle cx="20" cy="20" r="20" fill="#0063a5" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">VNPay</text>
      </svg>
    ),
  },
  {
    id: 'PAYPAL',
    label: 'PayPal',
    color: '#003087',
    textColor: '#fff',
    logo: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <circle cx="20" cy="20" r="20" fill="#003087" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="sans-serif">PayPal</text>
      </svg>
    ),
  },
];

function TimerBadge({ secondsLeft, formatTime }) {
  const isUrgent = secondsLeft <= 60;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold"
      style={{
        background: isUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(250,204,21,0.12)',
        color: isUrgent ? '#ef4444' : '#d97706',
        border: `1.5px solid ${isUrgent ? '#ef4444' : '#d97706'}`,
        animation: isUrgent ? 'pulse 1s ease-in-out infinite' : 'none',
      }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      {formatTime(secondsLeft)}
    </div>
  );
}

function ComboCard({ product, quantity, onIncrease, onDecrease }) {
  const isActive = quantity > 0;
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isActive ? 'border-[#f26b38]/40 bg-[#f26b38]/5' : 'border-base bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gray-50 border border-base">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
          ) : (
            <span>🍿</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{product.name}</p>
          <p className="text-xs font-medium text-[#f26b38]">
            {product.price.toLocaleString('vi-VN')}₫
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          disabled={quantity === 0}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            isActive ? 'bg-[#f26b38]/10 text-[#f26b38] hover:bg-[#f26b38]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-bold text-ink">
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#f26b38]/10 text-[#f26b38] hover:bg-[#f26b38]/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const {
    checkoutData,
    concessionProducts,
    selectedCombos,
    selectedMethod,
    loading,
    submitting,
    error,
    secondsLeft,
    comboTotal,
    ticketPrice,
    grandTotal,
    updateCombo,
    setSelectedMethod,
    handleSubmit,
    formatTime,
  } = useCheckoutPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/30">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 mx-auto border-[#f26b38] border-r-transparent animate-spin" />
          <p className="text-stone font-medium">Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-cream/30 font-sans text-ink">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .checkout-card { animation: fadeUp 0.4s ease forwards; }
        .method-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .method-btn { transition: all 0.2s ease; }
        .pay-btn:active { transform: scale(0.98); }
        .pay-btn:hover { filter: brightness(1.05); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(242,107,56,0.3); }
        .pay-btn { transition: all 0.2s ease; }
      `}</style>

      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1 text-[#f26b38]">
              Hoàn tất đặt vé
            </p>
            <h1 className="text-2xl font-bold text-ink">Thanh toán</h1>
          </div>
          {secondsLeft > 0 && <TimerBadge secondsLeft={secondsLeft} formatTime={formatTime} />}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Combo Selection */}
            {concessionProducts.length > 0 && (
              <div className="checkout-card rounded-2xl p-6 bg-white border border-base shadow-sm">
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2 text-ink">
                  <span className="text-lg">🍿</span>
                  Đồ ăn & Thức uống
                  <span className="text-xs px-2 py-0.5 rounded-full ml-1 bg-[#f26b38]/10 text-[#f26b38] font-semibold">
                    Tùy chọn
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {concessionProducts.map(product => (
                    <ComboCard
                      key={product.id}
                      product={product}
                      quantity={selectedCombos[product.id] || 0}
                      onIncrease={() => updateCombo(product.id, +1)}
                      onDecrease={() => updateCombo(product.id, -1)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="checkout-card rounded-2xl p-6 bg-white border border-base shadow-sm" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-semibold text-base mb-4 text-ink">
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(method => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`method-btn rounded-2xl p-4 flex flex-col items-center gap-2 border transition-all ${
                        isSelected ? 'bg-white shadow-sm border-2' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                      }`}
                      style={{
                        borderColor: isSelected ? method.color : undefined,
                      }}
                    >
                      {method.logo}
                      <span
                        className="text-xs font-bold"
                        style={{ color: isSelected ? method.color : '#6b7280' }}
                      >
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-stone">
                Sau khi nhấn Thanh toán, bạn sẽ được chuyển đến cổng thanh toán {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}. Không đóng trình duyệt cho đến khi giao dịch hoàn tất.
              </p>
            </div>
          </div>

          {/* Right Column – Order Summary */}
          <div
            className="checkout-card rounded-2xl p-6 h-fit bg-white border border-base shadow-sm sticky top-6"
            style={{ animationDelay: '0.15s' }}
          >
            <h2 className="font-semibold text-base mb-5 text-ink">
              Tóm tắt đơn hàng
            </h2>

            {checkoutData && (
              <div className="space-y-4">
                {/* Movie info */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs mb-1 text-stone font-medium uppercase tracking-wide">Phim</p>
                  <p className="font-bold text-sm text-ink">
                    {checkoutData.showtime?.movie || '—'}
                  </p>
                  <p className="text-xs mt-1 text-stone">
                    {checkoutData.showtime?.room} · {checkoutData.showtime?.publicStartTime
                      ? new Date(checkoutData.showtime.publicStartTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
                      : ''}
                  </p>
                </div>

                {/* Seats */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs mb-2 text-stone font-medium uppercase tracking-wide">Ghế đã chọn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {checkoutData.seats?.map(seat => (
                      <span
                        key={seat.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#034ea2]/10 text-[#034ea2] border border-[#034ea2]/20"
                      >
                        {seat.row}{seat.column}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone font-medium">Vé ({checkoutData.seats?.length} ghế)</span>
                    <span className="font-semibold text-ink">
                      {ticketPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  {comboTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone font-medium">Đồ ăn & Thức uống</span>
                      <span className="font-semibold text-ink">{comboTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  {checkoutData.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">Giảm giá</span>
                      <span className="font-semibold text-green-600">−{checkoutData.discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                    <span className="font-bold text-base text-ink uppercase tracking-wide">Tổng cộng</span>
                    <span className="font-bold text-2xl text-[#f26b38] leading-normal pb-1">
                      {grandTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-600">
                    {error}
                  </div>
                )}

                {secondsLeft === 0 ? (
                  <div className="rounded-xl px-4 py-3 text-sm text-center bg-red-50 border border-red-200 text-red-600 font-medium">
                    Phiên đặt vé đã hết hạn
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`pay-btn w-full py-3.5 rounded-xl font-bold text-sm text-white mt-4 ${
                      submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f26b38]'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Đang xử lý...
                      </span>
                    ) : (
                      `Thanh toán qua ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}`
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

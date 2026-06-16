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
  const stockQuantity = Number(product.stockQuantity ?? 0);
  const isOutOfStock = stockQuantity === 0;
  const isMaxSelected = quantity >= stockQuantity;

  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl"
      style={{
        background: quantity > 0 ? 'rgba(242,107,56,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${quantity > 0 ? 'rgba(242,107,56,0.4)' : 'rgba(255,255,255,0.08)'}`,
        transition: 'all 0.2s ease',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
          ) : (
            <span>🍿</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f0ede8' }}>{product.name}</p>
          <p className="text-[11px]" style={{ color: isOutOfStock ? '#ef4444' : '#8b9bbf' }}>
            {isOutOfStock ? 'Hết hàng' : `Còn ${stockQuantity}`}
          </p>
          <p className="text-xs" style={{ color: '#f26b38' }}>
            {product.price.toLocaleString('vi-VN')}₫
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          disabled={quantity === 0}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
          style={{
            background: quantity > 0 ? 'rgba(242,107,56,0.2)' : 'rgba(255,255,255,0.06)',
            color: quantity > 0 ? '#f26b38' : '#666',
            cursor: quantity === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-bold" style={{ color: '#f0ede8' }}>
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          disabled={isOutOfStock || isMaxSelected}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
          style={{
            background: isOutOfStock || isMaxSelected ? 'rgba(255,255,255,0.06)' : 'rgba(242,107,56,0.2)',
            color: isOutOfStock || isMaxSelected ? '#666' : '#f26b38',
            cursor: isOutOfStock || isMaxSelected ? 'not-allowed' : 'pointer',
          }}
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 100%)' }}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 mx-auto" style={{ borderColor: '#f26b38 transparent transparent transparent', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#8b9bbf' }}>Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .checkout-card { animation: fadeUp 0.4s ease forwards; }
        .method-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .method-btn { transition: all 0.2s ease; }
        .combo-row { transition: all 0.2s ease; }
        .pay-btn:active { transform: scale(0.98); }
        .pay-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
        .pay-btn { transition: all 0.2s ease; }
      `}</style>

      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#f26b38' }}>
              Hoàn tất đặt vé
            </p>
            <h1 className="text-2xl font-bold" style={{ color: '#f0ede8' }}>Thanh toán</h1>
          </div>
          {secondsLeft > 0 && <TimerBadge secondsLeft={secondsLeft} formatTime={formatTime} />}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Combo Selection */}
            {concessionProducts.length > 0 && (
              <div
                className="checkout-card rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
              >
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#f0ede8' }}>
                  <span className="text-lg">🍿</span>
                  Đồ ăn & Thức uống
                  <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'rgba(242,107,56,0.15)', color: '#f26b38' }}>
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
            <div
              className="checkout-card rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', animationDelay: '0.1s' }}
            >
              <h2 className="font-semibold text-base mb-4" style={{ color: '#f0ede8' }}>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className="method-btn rounded-2xl p-4 flex flex-col items-center gap-2"
                    style={{
                      background: selectedMethod === method.id ? `${method.color}22` : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${selectedMethod === method.id ? method.color : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {method.logo}
                    <span
                      className="text-xs font-semibold"
                      style={{ color: selectedMethod === method.id ? method.color : '#8b9bbf' }}
                    >
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs" style={{ color: '#5a6a8a' }}>
                Sau khi nhấn Thanh toán, bạn sẽ được chuyển đến cổng thanh toán {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}. Không đóng trình duyệt cho đến khi giao dịch hoàn tất.
              </p>
            </div>
          </div>

          {/* Right Column – Order Summary */}
          <div
            className="checkout-card rounded-2xl p-6 h-fit"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              animationDelay: '0.15s',
              position: 'sticky',
              top: '1.5rem',
            }}
          >
            <h2 className="font-semibold text-base mb-5" style={{ color: '#f0ede8' }}>
              Tóm tắt đơn hàng
            </h2>

            {checkoutData && (
              <div className="space-y-4">
                {/* Movie info */}
                <div className="pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs mb-1" style={{ color: '#5a6a8a' }}>Phim</p>
                  <p className="font-semibold text-sm" style={{ color: '#f0ede8' }}>
                    {checkoutData.showtime?.movie || '—'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#8b9bbf' }}>
                    {checkoutData.showtime?.room} · {checkoutData.showtime?.publicStartTime
                      ? new Date(checkoutData.showtime.publicStartTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
                      : ''}
                  </p>
                </div>

                {/* Seats */}
                <div className="pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs mb-2" style={{ color: '#5a6a8a' }}>Ghế đã chọn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {checkoutData.seats?.map(seat => (
                      <span
                        key={seat.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(3,78,162,0.25)', color: '#7eb3f7', border: '1px solid rgba(3,78,162,0.4)' }}
                      >
                        {seat.row}{seat.column}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#8b9bbf' }}>Vé ({checkoutData.seats?.length} ghế)</span>
                    <span style={{ color: '#f0ede8' }}>
                      {ticketPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  {comboTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#8b9bbf' }}>Đồ ăn & Thức uống</span>
                      <span style={{ color: '#f0ede8' }}>{comboTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  {checkoutData.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#10b981' }}>Giảm giá</span>
                      <span style={{ color: '#10b981' }}>−{checkoutData.discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <span className="font-bold text-base" style={{ color: '#f0ede8' }}>Tổng cộng</span>
                    <span className="font-bold text-xl" style={{ color: '#f26b38' }}>
                      {grandTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    {error}
                  </div>
                )}

                {secondsLeft === 0 ? (
                  <div className="rounded-xl px-4 py-3 text-sm text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    Phiên đặt vé đã hết hạn
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="pay-btn w-full py-3.5 rounded-2xl font-bold text-sm"
                    style={{
                      background: submitting ? '#4a4a5a' : 'linear-gradient(135deg, #f26b38 0%, #fb9440 100%)',
                      color: '#fff',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      border: 'none',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 inline-block" style={{ borderColor: '#fff transparent transparent transparent', animation: 'spin 0.8s linear infinite' }} />
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

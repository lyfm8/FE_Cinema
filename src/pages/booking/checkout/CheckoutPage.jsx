import { useEffect } from 'react';
import useCheckoutPage from '@/features/booking/checkout/hooks/useCheckoutPage';

/* ── Payment Method Logos (real images) ── */
const LOGO_URLS = {
  MOMO: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539296/Momo-logo_eiizlh.webp',
  VNPAY: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539297/VNPay-logo_g0z5tx.png',
  PAYPAL: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539297/Paypal-logo_sanlso.png',
};

function PaymentLogo({ src, alt, size = 56 }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl overflow-hidden bg-white border border-gray-100"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: size - 8, height: size - 8, objectFit: 'contain' }}
        loading="lazy"
      />
    </div>
  );
}

const PAYMENT_METHODS = [
  {
    id: 'MOMO',
    label: 'MoMo',
    desc: 'Ví điện tử MoMo',
    color: '#ae2070',
    bgLight: 'rgba(174,32,112,0.06)',
    logoUrl: LOGO_URLS.MOMO,
  },
  {
    id: 'VNPAY',
    label: 'VNPay',
    desc: 'Cổng thanh toán VNPay',
    color: '#0063a5',
    bgLight: 'rgba(0,99,165,0.06)',
    logoUrl: LOGO_URLS.VNPAY,
  },
  {
    id: 'PAYPAL',
    label: 'PayPal',
    desc: 'Thanh toán quốc tế',
    color: '#003087',
    bgLight: 'rgba(0,48,135,0.06)',
    logoUrl: LOGO_URLS.PAYPAL,
  },
];

/* ── Timer Badge ── */
function TimerBadge({ secondsLeft, formatTime }) {
  const isUrgent = secondsLeft <= 60;
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono font-bold backdrop-blur-sm"
      style={{
        background: isUrgent ? 'rgba(239,68,68,0.1)' : 'rgba(250,204,21,0.1)',
        color: isUrgent ? '#ef4444' : '#d97706',
        border: `1.5px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(217,119,6,0.3)'}`,
        animation: isUrgent ? 'pulse 1s ease-in-out infinite' : 'none',
      }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      <span style={{ letterSpacing: '0.05em' }}>{formatTime(secondsLeft)}</span>
    </div>
  );
}

/* ── Checkout Page ── */
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

  const selectedMethodObj = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/30">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 mx-auto border-[#034ea2] border-r-transparent animate-spin" />
          <p className="text-stone font-medium text-sm">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream/30 font-sans text-ink">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .checkout-card { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .method-card { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); cursor: pointer; }
        .method-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .method-card.selected { transform: translateY(-3px); }
        .pay-btn { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(242,107,56,0.35); filter: brightness(1.05); }
        .pay-btn:active:not(:disabled) { transform: scale(0.98); }
        .checkout-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.06) 80%, transparent); }
      `}</style>

      <div className="page-container py-8">
        {/* ── Page Header ── */}
        <div className="checkout-card flex items-center justify-between mb-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#034ea2] uppercase tracking-wider">
              Bước cuối cùng
            </p>
            <h1 className="text-2xl font-semibold text-ink">Thanh toán</h1>
          </div>
          {secondsLeft > 0 && <TimerBadge secondsLeft={secondsLeft} formatTime={formatTime} />}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          {/* ═══ Left Column ═══ */}
          <div className="space-y-6">
            {/* ── Payment Methods ── */}
            <div className="checkout-card rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ animationDelay: '0.08s' }}>
              <div className="px-6 pt-6 pb-4">
                <h2 className="font-semibold text-base text-ink flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#034ea2]/10 text-[#034ea2]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </span>
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="px-6 pb-6 space-y-3">
                {PAYMENT_METHODS.map(method => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`method-card w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left ${isSelected ? 'selected shadow-md' : 'bg-white hover:bg-gray-50'
                        }`}
                      style={{
                        borderColor: isSelected ? method.color : '#e5e7eb',
                        background: isSelected ? method.bgLight : undefined,
                      }}
                    >
                      <PaymentLogo src={method.logoUrl} alt={method.label} size={56} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink">{method.label}</p>
                        <p className="text-xs text-stone mt-0.5">{method.desc}</p>
                      </div>
                      <div
                        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: isSelected ? method.color : '#d1d5db',
                          background: isSelected ? method.color : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-6 pb-6">
                <div className="flex items-start gap-2.5 rounded-xl p-3.5 bg-gray-50 border border-gray-100">
                  <svg className="flex-shrink-0 mt-0.5 text-stone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p className="text-xs text-stone leading-relaxed">
                    Sau khi nhấn thanh toán, bạn sẽ được chuyển đến cổng <span className="font-semibold text-ink">{selectedMethodObj?.label}</span>. Không đóng trình duyệt cho đến khi hoàn tất.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Right Column – Order Summary ═══ */}
          <div
            className="checkout-card rounded-2xl bg-white border border-gray-100 shadow-sm h-fit sticky top-6 overflow-hidden"
            style={{ animationDelay: '0.15s' }}
          >
            {/* Summary Header */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="font-semibold text-base text-ink flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f26b38]/10 text-[#f26b38]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </span>
                Đơn hàng của bạn
              </h2>
            </div>

            {checkoutData && (
              <div className="px-6 pb-6 space-y-5">
                {/* Movie Info */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#034ea2]/10 flex items-center justify-center text-[#034ea2]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                      <line x1="7" y1="2" x2="7" y2="22" />
                      <line x1="17" y1="2" x2="17" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="2" y1="7" x2="7" y2="7" />
                      <line x1="2" y1="17" x2="7" y2="17" />
                      <line x1="17" y1="7" x2="22" y2="7" />
                      <line x1="17" y1="17" x2="22" y2="17" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-ink leading-snug">
                      {checkoutData.showtime?.movie || '—'}
                    </p>
                    <p className="text-xs text-stone mt-1">
                      {checkoutData.showtime?.room} · {checkoutData.showtime?.publicStartTime
                        ? new Date(checkoutData.showtime.publicStartTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
                        : ''}
                    </p>
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <p className="text-xs text-stone font-semibold uppercase tracking-wider mb-2">Ghế đã chọn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {checkoutData.seats?.map(seat => (
                      <span
                        key={seat.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#034ea2]/8 text-[#034ea2] border border-[#034ea2]/15"
                      >
                        {seat.row}{seat.column}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="checkout-divider" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone">Vé xem phim ({checkoutData.seats?.length} ghế)</span>
                    <span className="font-semibold text-ink">{ticketPrice.toLocaleString('vi-VN')}₫</span>
                  </div>

                  {comboTotal > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone">Đồ ăn & Thức uống</span>
                        <span className="font-semibold text-ink">{comboTotal.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="pl-3.5 space-y-1.5 border-l border-gray-200">
                        {concessionProducts
                          .filter(product => selectedCombos[product.id] > 0)
                          .map(product => {
                            const qty = selectedCombos[product.id];
                            return (
                              <div key={product.id} className="flex justify-between items-center text-xs text-stone">
                                <span className="flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-stone/40" />
                                  {product.name} <span className="font-bold text-ink">x{qty}</span>
                                </span>
                                <span className="font-medium text-stone/85">{(product.price * qty).toLocaleString('vi-VN')}₫</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {checkoutData.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">Giảm giá</span>
                      <span className="font-semibold text-green-600">−{checkoutData.discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                </div>

                <div className="checkout-divider" />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-ink uppercase tracking-wider">Tổng cộng</span>
                  <span className="font-bold text-xl" style={{ color: '#f26b38' }}>
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-red-50 border border-red-100 text-red-600 flex items-center gap-2">
                    <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Pay Button */}
                {secondsLeft === 0 ? (
                  <div className="rounded-xl px-4 py-3.5 text-sm text-center bg-red-50 border border-red-100 text-red-600 font-semibold">
                    Phiên đặt vé đã hết hạn
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`pay-btn w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 ${submitting ? 'bg-gray-400 cursor-not-allowed' : ''
                      }`}
                    style={{
                      background: submitting
                        ? undefined
                        : `linear-gradient(135deg, ${selectedMethodObj?.color || '#f26b38'}, ${selectedMethodObj?.color || '#f26b38'}dd)`,
                      boxShadow: submitting
                        ? undefined
                        : `0 4px 14px ${selectedMethodObj?.color || '#f26b38'}40`,
                    }}
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Thanh toán qua {selectedMethodObj?.label}
                      </>
                    )}
                  </button>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <svg className="text-green-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <span className="text-[11px] text-stone">Giao dịch được bảo mật & mã hóa SSL</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

import { useEffect } from 'react';
import useStaffCheckoutPage from './hooks/useStaffCheckoutPage';

/* ── Payment Method Logos (real images) ── */
const LOGO_URLS = {
  MOMO: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539296/Momo-logo_eiizlh.webp',
  VNPAY: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539297/VNPay-logo_g0z5tx.png',
  PAYPAL: 'https://res.cloudinary.com/dn4vjsers/image/upload/q_auto/f_auto/v1781539297/Paypal-logo_sanlso.png',
};

function PaymentLogo({ src, alt, size = 56 }) {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-xl overflow-hidden bg-white border border-gray-100 text-3xl"
        style={{ width: size, height: size }}
      >
        💵
      </div>
    );
  }
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
    id: 'CASH',
    label: 'Tiền mặt',
    desc: 'Thanh toán tại quầy',
    color: '#059669',
    bgLight: 'rgba(5,150,105,0.06)',
    logoUrl: '',
  },
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

/* ── Loyalty Points Section ── */
function LoyaltySection({
  loyaltyInfo,
  concessionProducts,
  pointsInputValue,
  redeemConcessionId,
  pointsDiscountAmount,
  comboRedeemAmount,
  actualPointsUsed,
  estimatedPointsEarned,
  onPointsInputChange,
  onUseAllPoints,
  onRedeemCombo,
  subTotal,
}) {
  if (!loyaltyInfo) return null;

  const { loyaltyPoints } = loyaltyInfo;
  const maxDiscountPoints = Math.floor(subTotal * 0.20);
  const hasPoints = loyaltyPoints > 0;

  return (
    <div
      className="checkout-card rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
        borderColor: 'rgba(234,179,8,0.3)',
        animationDelay: '0.12s',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        <h2 className="font-semibold text-base flex items-center gap-2.5" style={{ color: '#92400e' }}>
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'rgba(234,179,8,0.2)', color: '#d97706' }}
          >
            ⭐
          </span>
          Điểm tích lũy
        </h2>
        <div className="text-right">
          <p className="text-xs" style={{ color: '#92400e' }}>Số điểm hiện có</p>
          <p className="font-bold text-lg" style={{ color: '#d97706' }}>
            {loyaltyPoints.toLocaleString('vi-VN')} điểm
          </p>
        </div>
      </div>

      <div className="px-6 pb-5 space-y-4">
        {!hasPoints && (
          <div className="text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(234,179,8,0.1)', color: '#92400e' }}>
            💡 Bạn chưa có điểm tích lũy. Mua vé hôm nay để nhận{' '}
            <strong>{estimatedPointsEarned.toLocaleString()}</strong> điểm!
          </div>
        )}

        {hasPoints && (
          <>
            {/* Option 1: Giảm giá trực tiếp */}
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#92400e' }}>
                Dùng điểm giảm giá đơn hàng (tối đa 20%)
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    max={Math.min(loyaltyPoints, maxDiscountPoints)}
                    value={pointsInputValue}
                    onChange={e => onPointsInputChange(e.target.value)}
                    disabled={!!redeemConcessionId}
                    placeholder={`Tối đa ${Math.min(loyaltyPoints, maxDiscountPoints).toLocaleString()} điểm`}
                    className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition-all"
                    style={{
                      borderColor: redeemConcessionId ? '#d1d5db' : 'rgba(234,179,8,0.5)',
                      background: redeemConcessionId ? '#f9fafb' : '#fffbeb',
                      color: '#92400e',
                      opacity: redeemConcessionId ? 0.5 : 1,
                    }}
                  />
                </div>
                <button
                  onClick={onUseAllPoints}
                  disabled={!!redeemConcessionId}
                  className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    borderColor: redeemConcessionId ? '#d1d5db' : 'rgba(234,179,8,0.6)',
                    background: redeemConcessionId ? '#f9fafb' : 'rgba(234,179,8,0.15)',
                    color: redeemConcessionId ? '#9ca3af' : '#d97706',
                    cursor: redeemConcessionId ? 'not-allowed' : 'pointer',
                  }}
                >
                  Dùng tối đa
                </button>
              </div>
              {pointsDiscountAmount > 0 && !redeemConcessionId && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: '#15803d' }}>
                  ✓ Tiết kiệm {pointsDiscountAmount.toLocaleString('vi-VN')}₫ từ {actualPointsUsed.toLocaleString()} điểm
                </p>
              )}
            </div>

            {/* Divider */}
            {concessionProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(234,179,8,0.3)' }} />
                <span className="text-xs font-semibold" style={{ color: '#b45309' }}>HOẶC</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(234,179,8,0.3)' }} />
              </div>
            )}

            {/* Option 2: Đổi combo */}
            {concessionProducts.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#92400e' }}>
                  Đổi điểm lấy combo bắp nước (free)
                </p>
                <div className="space-y-2">
                  {concessionProducts.map(product => {
                    const canRedeem = loyaltyPoints >= product.price;
                    const isSelected = redeemConcessionId === product.id;
                    return (
                      <button
                        key={product.id}
                        onClick={() => canRedeem && onRedeemCombo(product.id)}
                        disabled={!canRedeem}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left"
                        style={{
                          borderColor: isSelected ? '#d97706' : canRedeem ? 'rgba(234,179,8,0.4)' : '#e5e7eb',
                          background: isSelected ? 'rgba(234,179,8,0.2)' : canRedeem ? 'rgba(234,179,8,0.06)' : '#f9fafb',
                          cursor: canRedeem ? 'pointer' : 'not-allowed',
                          opacity: canRedeem ? 1 : 0.6,
                          transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{product.imageUrl ? <img src={product.imageUrl} className="w-7 h-7 rounded object-cover" alt={product.name} /> : '🍿'}</span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#92400e' }}>{product.name}</p>
                            <p className="text-xs" style={{ color: '#b45309' }}>
                              {product.price.toLocaleString('vi-VN')} điểm
                              {!canRedeem && (
                                <span style={{ color: '#ef4444' }}>
                                  {' '}(cần thêm {(product.price - loyaltyPoints).toLocaleString()} điểm)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canRedeem && (
                            <span className="text-xs px-2 py-1 rounded-lg font-bold"
                              style={{ background: isSelected ? '#d97706' : 'rgba(234,179,8,0.2)', color: isSelected ? '#fff' : '#b45309' }}>
                              {isSelected ? '✓ Đã chọn' : 'Chọn'}
                            </span>
                          )}
                          <span className="text-xs line-through" style={{ color: '#9ca3af' }}>
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                          <span className="text-xs font-bold" style={{ color: '#16a34a' }}>FREE</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {comboRedeemAmount > 0 && (
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#15803d' }}>
                    ✓ Đổi combo miễn phí, tiết kiệm {comboRedeemAmount.toLocaleString('vi-VN')}₫ ({actualPointsUsed.toLocaleString()} điểm)
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Estimate points earned after purchase */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-2"
          style={{ background: 'rgba(234,179,8,0.12)', borderLeft: '3px solid #d97706' }}
        >
          <span>🎁</span>
          <p className="text-xs" style={{ color: '#92400e' }}>
            Sau khi thanh toán, bạn sẽ nhận được{' '}
            <strong style={{ color: '#d97706' }}>+{estimatedPointsEarned.toLocaleString()} điểm</strong>
            {' '}tích lũy (10% giá trị đơn hàng).
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Checkout Page ── */
function StaffCheckoutPage() {
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
    // Loyalty
    loyaltyInfo,
    pointsInputValue,
    redeemConcessionId,
    redeemConcessionProduct,
    pointsDiscountAmount,
    comboRedeemAmount,
    actualPointsUsed,
    estimatedPointsEarned,
    handlePointsInputChange,
    handleUseAllPoints,
    handleRedeemCombo,
  } = useStaffCheckoutPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedMethodObj = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  const subTotal = ticketPrice + comboTotal - (checkoutData?.discountAmount || 0);

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

            {/* ── Loyalty Points Section ── */}
            <LoyaltySection
              loyaltyInfo={loyaltyInfo}
              concessionProducts={concessionProducts}
              pointsInputValue={pointsInputValue}
              redeemConcessionId={redeemConcessionId}
              pointsDiscountAmount={pointsDiscountAmount}
              comboRedeemAmount={comboRedeemAmount}
              actualPointsUsed={actualPointsUsed}
              estimatedPointsEarned={estimatedPointsEarned}
              onPointsInputChange={handlePointsInputChange}
              onUseAllPoints={handleUseAllPoints}
              onRedeemCombo={handleRedeemCombo}
              subTotal={subTotal}
            />
          </div>

          {/* ═══ Right Column ─ Order Summary ═══ */}
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
                      <span className="text-green-600 font-medium">Giảm giá (mã KM)</span>
                      <span className="font-semibold text-green-600">−{checkoutData.discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  {/* Loyalty discount */}
                  {pointsDiscountAmount > 0 && !redeemConcessionId && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium" style={{ color: '#d97706' }}>
                        ⭐ Điểm tích lũy ({actualPointsUsed.toLocaleString()} điểm)
                      </span>
                      <span className="font-semibold" style={{ color: '#d97706' }}>
                        −{pointsDiscountAmount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}

                  {/* Combo redemption */}
                  {comboRedeemAmount > 0 && redeemConcessionId && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium" style={{ color: '#d97706' }}>
                        ⭐ Đổi combo ({actualPointsUsed.toLocaleString()} điểm)
                      </span>
                      <span className="font-semibold" style={{ color: '#d97706' }}>
                        −{comboRedeemAmount.toLocaleString('vi-VN')}₫
                      </span>
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

                {/* Points earned preview */}
                {estimatedPointsEarned > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(234,179,8,0.08)' }}>
                    <span className="text-sm">⭐</span>
                    <p className="text-xs" style={{ color: '#92400e' }}>
                      Bạn sẽ nhận <strong>+{estimatedPointsEarned.toLocaleString()}</strong> điểm sau khi thanh toán
                    </p>
                  </div>
                )}

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

export default StaffCheckoutPage;

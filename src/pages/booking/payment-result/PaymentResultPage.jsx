import usePaymentResultPage from '@/features/booking/payment-result/hooks/usePaymentResultPage';

function StatusIcon({ status }) {
  if (status === 'PAID') {
    return (
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
        style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid #10b981' }}
      >
        <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
          <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" />
          <path d="M8 12l3 3 5-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (status === 'FAILED' || status === 'EXPIRED') {
    return (
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
        style={{ background: 'rgba(239,68,68,0.12)', border: '2px solid #ef4444' }}
      >
        <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
      style={{ background: 'rgba(250,204,21,0.12)', border: '2px solid #d97706' }}
    >
      <div
        className="w-10 h-10 rounded-full border-4"
        style={{ borderColor: '#d97706 transparent transparent transparent', animation: 'spin 0.9s linear infinite' }}
      />
    </div>
  );
}

function PaymentResultPage() {
  const { status, bookingData, error, searchParams } = usePaymentResultPage();
  const from = searchParams?.get('from');

  const statusConfig = {
    PAID: {
      title: 'Thanh toán thành công!',
      desc: 'Vé của bạn đã được xác nhận. Kiểm tra email hoặc mục "Vé của tôi" để xem chi tiết.',
      color: '#10b981',
    },
    FAILED: {
      title: 'Thanh toán thất bại',
      desc: 'Giao dịch không thành công. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.',
      color: '#ef4444',
    },
    EXPIRED: {
      title: 'Phiên đặt vé đã hết hạn',
      desc: 'Đơn đặt vé đã hết hạn sau 5 phút. Vui lòng bắt đầu lại từ đầu.',
      color: '#ef4444',
    },
    PENDING: {
      title: 'Đang xử lý thanh toán...',
      desc: 'Hệ thống đang chờ xác nhận từ cổng thanh toán. Vui lòng không đóng trang này.',
      color: '#d97706',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .result-card { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div
        className="result-card w-full max-w-md rounded-3xl p-8 text-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="mb-6">
          <StatusIcon status={status} />
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ color: config.color }}>
          {config.title}
        </h1>

        <p className="text-sm mb-6" style={{ color: '#8b9bbf' }}>
          {config.desc}
        </p>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {bookingData && status === 'PAID' && (
          <div className="rounded-2xl p-4 text-left mb-6 space-y-2" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#5a6a8a' }}>Mã đặt vé</span>
              <span className="font-mono font-bold" style={{ color: '#10b981' }}>{bookingData.bookingCode}</span>
            </div>
            {bookingData.transactionCode && (
              <div className="flex justify-between text-sm">
                <span style={{ color: '#5a6a8a' }}>Mã giao dịch</span>
                <span className="font-mono text-xs" style={{ color: '#f0ede8' }}>{bookingData.transactionCode}</span>
              </div>
            )}
            {bookingData.paymentDate && (
              <div className="flex justify-between text-sm">
                <span style={{ color: '#5a6a8a' }}>Thời gian</span>
                <span style={{ color: '#f0ede8' }}>
                  {new Date(bookingData.paymentDate).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {status === 'PAID' && (
            <a
              href={from === 'staff' ? "/staff/ticket-sale" : "/booking-history"}
              className="w-full py-3 rounded-2xl font-bold text-sm text-center block"
              style={{ background: 'linear-gradient(135deg, #f26b38 0%, #fb9440 100%)', color: '#fff' }}
            >
              {from === 'staff' ? "Tiếp tục bán vé" : "Xem vé của tôi"}
            </a>
          )}

          {(status === 'FAILED' || status === 'EXPIRED') && (
            <a
              href={from === 'staff' ? "/staff/ticket-sale" : "/"}
              className="w-full py-3 rounded-2xl font-bold text-sm text-center block"
              style={{ background: 'rgba(242,107,56,0.15)', color: '#f26b38', border: '1px solid rgba(242,107,56,0.3)' }}
            >
              {from === 'staff' ? "Bán vé lại" : "Đặt vé lại"}
            </a>
          )}

          <a
            href={from === 'staff' ? "/staff/dashboard" : "/"}
            className="w-full py-3 rounded-2xl text-sm text-center block"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#8b9bbf', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {from === 'staff' ? "Về Dashboard" : "Về trang chủ"}
          </a>
        </div>

        {status === 'PENDING' && (
          <p className="mt-4 text-xs" style={{ color: '#5a6a8a' }}>
            Trang này sẽ tự động cập nhật...
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentResultPage;

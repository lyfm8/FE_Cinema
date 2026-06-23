import { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function LoyaltyInfoCard({ profile }) {
  const { tx } = useLanguage();
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/loyalty-info');
        if (response.data?.success) {
          setLoyaltyInfo(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch loyalty info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyaltyInfo();
  }, []);

  const currentPoints = profile?.loyaltyPoints || 0;

  return (
    <section 
      className="surface-card p-6 border relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
        borderColor: 'rgba(234,179,8,0.3)',
      }}
    >
      {/* Background decoration */}
      <div 
        className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-20 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="flex items-center justify-center w-10 h-10 rounded-xl" 
              style={{ background: 'rgba(234,179,8,0.2)', color: '#d97706', fontSize: '1.25rem' }}
            >
              ⭐
            </span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#92400e' }}>
                {tx('Loyalty Points', 'Điểm thành viên')}
              </h2>
              <p className="text-xs" style={{ color: '#b45309' }}>
                {tx('Your current balance', 'Số dư hiện tại của bạn')}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-4xl font-extrabold tracking-tight" style={{ color: '#d97706' }}>
              {currentPoints.toLocaleString('vi-VN')} <span className="text-lg font-semibold" style={{ color: '#b45309' }}>điểm</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: '#92400e' }}>
            {tx('How to earn and use points?', 'Cách tích & Tiêu điểm')}
          </p>
          
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-amber-200/50 rounded w-full"></div>
              <div className="h-3 bg-amber-200/50 rounded w-5/6"></div>
              <div className="h-3 bg-amber-200/50 rounded w-4/6"></div>
            </div>
          ) : loyaltyInfo ? (
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm" style={{ color: '#92400e' }}>
                <span className="mt-0.5 text-[#d97706]">🎁</span>
                <span>
                  <strong>Tích lũy:</strong> Nhận ngay <strong style={{ color: '#d97706' }}>{loyaltyInfo.earnRate * 100}%</strong> giá trị đơn hàng vào điểm tích lũy sau mỗi lần thanh toán thành công.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: '#92400e' }}>
                <span className="mt-0.5 text-[#d97706]">💳</span>
                <span>
                  <strong>Giảm giá trực tiếp:</strong> Có thể dùng điểm để giảm giá trực tiếp tối đa <strong style={{ color: '#d97706' }}>{loyaltyInfo.maxDiscountRate * 100}%</strong> tổng giá trị vé & bắp nước ({loyaltyInfo.pointValue} điểm = {loyaltyInfo.pointValue} VNĐ).
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: '#92400e' }}>
                <span className="mt-0.5 text-[#d97706]">🍿</span>
                <span>
                  <strong>Đổi quà tặng:</strong> Có thể dùng điểm để mua lẻ quy đổi các Combo bắp nước hoàn toàn miễn phí.
                </span>
              </li>
            </ul>
          ) : (
             <p className="text-sm text-stone">Không thể tải thông tin ưu đãi.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default LoyaltyInfoCard;

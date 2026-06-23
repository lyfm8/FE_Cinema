import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { prepareCheckout, createPaymentUrl } from '@/features/booking/services/paymentService';
import axiosInstance from '@/services/axiosInstance';

/** 1 điểm = 1 VNĐ */
const POINT_VALUE = 1;
/** Giới hạn giảm giá tối đa bằng điểm: 20% */
const MAX_DISCOUNT_RATE = 0.20;

function useCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetBooking } = useBooking();

  const bookingId = location.state?.bookingId;

  const [checkoutData, setCheckoutData] = useState(null);
  const [concessionProducts, setConcessionProducts] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});
  const [selectedMethod, setSelectedMethod] = useState('MOMO');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  // ── Loyalty points state ──
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);   // { loyaltyPoints, pointValue, earnRate, maxDiscountRate }
  const [pointsToUse, setPointsToUse] = useState(0);       // số điểm người dùng muốn dùng (giảm giá tổng)
  const [redeemConcessionId, setRedeemConcessionId] = useState(null); // ID combo muốn đổi bằng điểm
  const [pointsInputValue, setPointsInputValue] = useState('');

  const fetchCheckoutData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await prepareCheckout(bookingId);
      if (response.success) {
        setCheckoutData(response.data);
        setSecondsLeft(response.data.secondsRemaining);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải thông tin đặt vé');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  const fetchConcessionProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/concessions?pageSize=100');
      if (response.data?.data) {
        setConcessionProducts(response.data.data);
      }
    } catch {
      // combo products load failure không block checkout
    }
  }, []);

  const fetchLoyaltyInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/loyalty-info');
      if (response.data?.success) {
        setLoyaltyInfo(response.data.data);
      }
    } catch {
      // không block checkout nếu không lấy được điểm
    }
  }, []);

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    fetchCheckoutData();
    fetchConcessionProducts();
    fetchLoyaltyInfo();
  }, [bookingId, fetchCheckoutData, fetchConcessionProducts, fetchLoyaltyInfo, navigate]);

  useEffect(() => {
    if (!loading && !checkoutData) {
      navigate('/');
    }
  }, [loading, checkoutData, navigate]);

  // Đếm ngược timeout 5 phút
  useEffect(() => {
    if (!checkoutData?.expiredAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(checkoutData.expiredAt).getTime() - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setError('Phiên đặt vé đã hết hạn. Vui lòng bắt đầu lại.');
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [checkoutData?.expiredAt]);

  const updateCombo = useCallback((productId, delta) => {
    setSelectedCombos(prev => {
      const current = prev[productId] || 0;
      const product = concessionProducts.find(item => item.id === productId);
      const maxQuantity = Number(product?.stockQuantity ?? 0);
      const next = Math.min(maxQuantity, Math.max(0, current + delta));
      if (next === 0) {
        const nextCombos = { ...prev };
        delete nextCombos[productId];
        return nextCombos;
      }
      return { ...prev, [productId]: next };
    });
  }, [concessionProducts]);

  const comboTotal = useMemo(() => {
    return concessionProducts.reduce((sum, product) => {
      const qty = selectedCombos[product.id] || 0;
      return sum + product.price * qty;
    }, 0);
  }, [selectedCombos, concessionProducts]);

  const ticketPrice = useMemo(() => {
    if (!checkoutData) return 0;
    const backendConcessionsTotal = checkoutData.concessions?.reduce((sum, c) => sum + c.subtotal, 0) || 0;
    return (checkoutData.totalAmount || 0) + (checkoutData.discountAmount || 0) - backendConcessionsTotal;
  }, [checkoutData]);

  // ── Tính toán điểm tích lũy ──────────────────────────────────────────────

  /** Combo được đổi bằng điểm (nếu có chọn redeemConcessionId) */
  const redeemConcessionProduct = useMemo(() => {
    if (!redeemConcessionId) return null;
    return concessionProducts.find(p => p.id === redeemConcessionId) || null;
  }, [redeemConcessionId, concessionProducts]);

  /** Số điểm cần để đổi combo đã chọn */
  const pointsRequiredForCombo = useMemo(() => {
    return redeemConcessionProduct ? redeemConcessionProduct.price : 0;
  }, [redeemConcessionProduct]);

  /** Tổng phụ (ticket + combo thường được chọn) trước khi áp điểm */
  const subTotal = useMemo(() => {
    return ticketPrice + comboTotal - (checkoutData?.discountAmount || 0);
  }, [ticketPrice, comboTotal, checkoutData]);

  /** Số tiền được giảm khi dùng điểm giảm giá trực tiếp */
  const pointsDiscountAmount = useMemo(() => {
    if (!pointsToUse || pointsToUse <= 0) return 0;
    const maxDiscount = Math.floor(subTotal * MAX_DISCOUNT_RATE);
    const requested = Math.floor(pointsToUse * POINT_VALUE);
    return Math.min(requested, maxDiscount);
  }, [pointsToUse, subTotal]);

  /** Số tiền combo được đổi bằng điểm (trả free) */
  const comboRedeemAmount = useMemo(() => {
    return redeemConcessionProduct ? redeemConcessionProduct.price : 0;
  }, [redeemConcessionProduct]);

  /** Grand total cuối cùng sau tất cả giảm giá */
  const grandTotal = useMemo(() => {
    if (!checkoutData) return 0;
    const base = ticketPrice + comboTotal - (checkoutData.discountAmount || 0);
    return Math.max(0, base - pointsDiscountAmount - comboRedeemAmount);
  }, [ticketPrice, comboTotal, checkoutData, pointsDiscountAmount, comboRedeemAmount]);

  /** Số điểm sẽ thực sự được sử dụng */
  const actualPointsUsed = useMemo(() => {
    if (redeemConcessionId) return pointsRequiredForCombo;
    if (pointsToUse > 0) {
      const maxDiscount = Math.floor(subTotal * MAX_DISCOUNT_RATE);
      const requested = Math.floor(pointsToUse * POINT_VALUE);
      return Math.min(requested, maxDiscount, loyaltyInfo?.loyaltyPoints || 0);
    }
    return 0;
  }, [redeemConcessionId, pointsRequiredForCombo, pointsToUse, subTotal, loyaltyInfo]);

  /** Điểm sẽ được tích sau khi đơn thanh toán thành công */
  const estimatedPointsEarned = useMemo(() => {
    return Math.floor(grandTotal * 0.10);
  }, [grandTotal]);

  const handlePointsInputChange = useCallback((val) => {
    setPointsInputValue(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setPointsToUse(num);
    } else if (val === '') {
      setPointsToUse(0);
    }
  }, []);

  const handleUseAllPoints = useCallback(() => {
    if (!loyaltyInfo) return;
    const maxByRate = Math.floor(subTotal * MAX_DISCOUNT_RATE);
    const actualUse = Math.min(loyaltyInfo.loyaltyPoints, maxByRate);
    setPointsToUse(actualUse);
    setPointsInputValue(String(actualUse));
    setRedeemConcessionId(null);
  }, [loyaltyInfo, subTotal]);

  const handleRedeemCombo = useCallback((productId) => {
    if (redeemConcessionId === productId) {
      // Bỏ chọn nếu đã chọn rồi
      setRedeemConcessionId(null);
    } else {
      setRedeemConcessionId(productId);
      setPointsToUse(0);
      setPointsInputValue('');
    }
  }, [redeemConcessionId]);

  const handleSubmit = async () => {
    if (!bookingId) return;
    if (secondsLeft === 0) {
      setError('Phiên đặt vé đã hết hạn. Vui lòng bắt đầu lại.');
      return;
    }

    // Validate điểm
    if (redeemConcessionId && loyaltyInfo) {
      const product = concessionProducts.find(p => p.id === redeemConcessionId);
      if (product && loyaltyInfo.loyaltyPoints < product.price) {
        setError(`Không đủ điểm để đổi "${product.name}". Cần ${product.price.toLocaleString()} điểm.`);
        return;
      }
    }
    if (pointsToUse > 0 && loyaltyInfo && pointsToUse > loyaltyInfo.loyaltyPoints) {
      setError(`Bạn chỉ có ${loyaltyInfo.loyaltyPoints.toLocaleString()} điểm.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Cập nhật concessions vào booking trước khi lấy URL thanh toán
      const concessionsToUpdate = Object.entries(selectedCombos).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity
      }));
      await axiosInstance.put(`/bookings/${bookingId}/concessions`, {
        concessions: concessionsToUpdate
      });

      // 2. Tạo link thanh toán (với thông tin điểm nếu có)
      const paymentPayload = {
        bookingId: Number(bookingId),
        method: selectedMethod,
      };

      if (redeemConcessionId) {
        paymentPayload.redeemConcessionId = redeemConcessionId;
      } else if (pointsToUse > 0) {
        paymentPayload.pointsToUse = actualPointsUsed;
      }

      const response = await createPaymentUrl(paymentPayload);

      if (response.success && response.data?.payUrl) {
        resetBooking();
        window.location.href = response.data.payUrl;
      } else {
        setError('Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi khi tạo thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
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
    pointsToUse,
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
    MAX_DISCOUNT_RATE,
    POINT_VALUE,
  };
}

export default useCheckoutPage;

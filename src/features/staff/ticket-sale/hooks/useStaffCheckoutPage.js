import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { prepareCheckout, createPaymentUrl } from '@/features/booking/services/paymentService';
import axiosInstance from '@/services/axiosInstance';

/** 1 điểm = 1 VNĐ */
const POINT_VALUE = 1;
/** Giới hạn giảm giá tối đa bằng điểm: 20% */
const MAX_DISCOUNT_RATE = 0.20;

function useCheckoutPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { resetBooking } = useBooking();

  const [checkoutData, setCheckoutData] = useState(null);
  const [concessionProducts, setConcessionProducts] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});
  const [selectedMethod, setSelectedMethod] = useState('CASH');
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
        
        if (response.data.concessions && response.data.concessions.length > 0) {
          const combos = {};
          response.data.concessions.forEach(c => {
            combos[c.productId] = c.quantity;
          });
          setSelectedCombos(combos);
        }

        // Setup loyalty from backend checkoutData
        if (response.data.customerId) {
          setLoyaltyInfo({
            loyaltyPoints: response.data.loyaltyPoints || 0
          });
        }
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



  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    fetchCheckoutData();
    fetchConcessionProducts();
  }, [bookingId, fetchCheckoutData, fetchConcessionProducts, navigate]);

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

  // ── Gọi API tính toán (Lưu trực tiếp vào CSDL nháp) ────────────────────────
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!bookingId || !checkoutData) return;

    const timer = setTimeout(async () => {
      try {
        const concessionsToUpdate = Object.entries(selectedCombos).map(([productId, quantity]) => ({
          productId: Number(productId),
          quantity
        }));
        
        const payload = {
          concessions: concessionsToUpdate,
          pointsToUse: redeemConcessionId ? 0 : (pointsToUse || 0),
          redeemConcessionId: redeemConcessionId || undefined
        };

        const response = await axiosInstance.put(`/bookings/${bookingId}/concessions`, payload);
        if (response.data?.success) {
          setSummary(response.data.data);
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật concessions', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [bookingId, checkoutData, selectedCombos, pointsToUse, redeemConcessionId]);

  const backendConcessionsTotal = checkoutData?.concessions?.reduce((sum, c) => sum + c.subtotal, 0) || 0;
  const initialTicketPrice = (checkoutData?.totalAmount || 0) + (checkoutData?.discountAmount || 0) - backendConcessionsTotal;

  // Nếu chưa có summary từ backend, tự tính tạm để giao diện không bị giật (nhảy số)
  const comboTotal = summary?.concessionTotal ?? concessionProducts.reduce((sum, product) => {
    return sum + product.price * (selectedCombos[product.id] || 0);
  }, 0);
  const ticketPrice = summary?.ticketTotal ?? initialTicketPrice;
  const pointsDiscountAmount = summary?.pointsDiscountAmount ?? 0;
  const comboRedeemAmount = summary?.comboRedeemAmount ?? 0;
  const actualPointsUsed = summary?.pointsUsed ?? 0;

  const base = ticketPrice + comboTotal - (checkoutData?.discountAmount || 0);
  const fallbackGrandTotal = Math.max(0, base - pointsDiscountAmount - comboRedeemAmount);

  const grandTotal = summary?.totalAmount ?? fallbackGrandTotal;
  const estimatedPointsEarned = summary?.estimatedPointsEarned ?? Math.floor(grandTotal * 0.10);

  const subTotal = ticketPrice + comboTotal - (checkoutData?.discountAmount || 0);

  /** Combo được đổi bằng điểm (nếu có chọn redeemConcessionId) */
  const redeemConcessionProduct = useMemo(() => {
    if (!redeemConcessionId) return null;
    return concessionProducts.find(p => p.id === redeemConcessionId) || null;
  }, [redeemConcessionId, concessionProducts]);

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
      // 1. Cập nhật concessions và điểm vào booking trước khi lấy URL thanh toán
      const concessionsToUpdate = Object.entries(selectedCombos).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity
      }));
      const payload = {
        concessions: concessionsToUpdate,
        pointsToUse: redeemConcessionId ? 0 : (pointsToUse || 0),
        redeemConcessionId: redeemConcessionId || undefined
      };

      await axiosInstance.put(`/bookings/${bookingId}/concessions`, payload);

      // 2. Tạo link thanh toán
      const paymentPayload = {
        bookingId: Number(bookingId),
        method: selectedMethod,
      };

      const response = await createPaymentUrl(paymentPayload);

      if (response.success) {
        resetBooking();
        if (selectedMethod === 'CASH') {
          navigate(`/booking/payment-result?bookingCode=${checkoutData.bookingCode}&from=staff`);
        } else if (response.data?.payUrl) {
          window.location.href = response.data.payUrl;
        }
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

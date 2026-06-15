import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useBooking from '@/features/booking/hooks/useBooking';
import { prepareCheckout, createPaymentUrl } from '@/features/booking/services/paymentService';
import axiosInstance from '@/services/axiosInstance';

const CONCESSION_TTL_MS = 5 * 60 * 1000; // đồng bộ 5 phút với backend

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

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    fetchCheckoutData();
    fetchConcessionProducts();
  }, [bookingId]);

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

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const response = await prepareCheckout(bookingId);
      if (response.success) {
        setCheckoutData(response.data);
        setSecondsLeft(response.data.secondsRemaining);
        
        // Khởi tạo state bắp nước từ dữ liệu đặt vé trước đó
        if (response.data.concessions && response.data.concessions.length > 0) {
          const initialCombos = {};
          response.data.concessions.forEach(c => {
            initialCombos[c.productId] = c.quantity;
          });
          setSelectedCombos(initialCombos);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải thông tin đặt vé');
    } finally {
      setLoading(false);
    }
  };

  const fetchConcessionProducts = async () => {
    try {
      const response = await axiosInstance.get('/concessions?pageSize=100');
      if (response.data?.data) {
        setConcessionProducts(response.data.data);
      }
    } catch {
      // combo products load failure không block checkout
    }
  };

  const updateCombo = useCallback((productId, delta) => {
    setSelectedCombos(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  }, []);

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

  const grandTotal = useMemo(() => {
    if (!checkoutData) return 0;
    return ticketPrice + comboTotal - (checkoutData.discountAmount || 0);
  }, [ticketPrice, comboTotal, checkoutData]);

  const handleSubmit = async () => {
    if (!bookingId) return;
    if (secondsLeft === 0) {
      setError('Phiên đặt vé đã hết hạn. Vui lòng bắt đầu lại.');
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

      // 2. Tạo link thanh toán
      const response = await createPaymentUrl({
        bookingId: Number(bookingId),
        method: selectedMethod,
      });

      if (response.success && response.data?.payUrl) {
        resetBooking();
        // Frontend chỉ redirect, không xử lý gì thêm
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
  };
}

export default useCheckoutPage;

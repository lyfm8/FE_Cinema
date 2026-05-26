import { useCallback, useEffect, useMemo, useState } from 'react';
import { ticketPriceService } from '@/features/admin/ticket-prices/services/ticketPriceService';
import { ROOM_TYPE } from '@/features/admin/cinemas/constants/cinemaConstants';
import {
  DAY_TYPE,
  DEFAULT_TICKET_PRICES,
} from '@/features/admin/ticket-prices/constants/ticketPriceConstants';
import { getErrorMessage } from '@/core/utils/errorUtils';

const EMPTY_FORM = {
  roomType: ROOM_TYPE.STANDARD,
  weekdayPrice: '',
  weekendPrice: '',
};

/**
 * @param {(en: string, vi: string) => string} tx
 */
function useTicketPriceManagement(tx) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    tone: 'info',
  });

  const roomTypes = useMemo(() => Object.values(ROOM_TYPE), []);

  const priceMap = useMemo(() => {
    const base = Object.fromEntries(
      roomTypes.map((type) => [
        type,
        { [DAY_TYPE.WEEKDAY]: null, [DAY_TYPE.WEEKEND]: null },
      ]),
    );

    prices.forEach((price) => {
      if (!price?.roomType || !price?.dayType) return;
      if (!base[price.roomType]) {
        base[price.roomType] = { [DAY_TYPE.WEEKDAY]: null, [DAY_TYPE.WEEKEND]: null };
      }
      base[price.roomType][price.dayType] = Number(price.price);
    });

    return base;
  }, [prices, roomTypes]);

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const id = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 2500);
    return () => window.clearTimeout(id);
  }, [toast.visible]);

  const loadPrices = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const result = await ticketPriceService.getTicketPrices();
      setPrices(result.data ?? []);
    } catch (error) {
      setPrices([]);
      setFetchError(getErrorMessage(error, 'Unable to load ticket prices.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      loadPrices();
    }, 0);
    return () => window.clearTimeout(id);
  }, [loadPrices]);

  const openEditForm = (roomType) => {
    const current = priceMap[roomType] || {};
    const defaults = DEFAULT_TICKET_PRICES[roomType] || {};

    setForm({
      roomType,
      weekdayPrice: String(current[DAY_TYPE.WEEKDAY] ?? defaults[DAY_TYPE.WEEKDAY] ?? ''),
      weekendPrice: String(current[DAY_TYPE.WEEKEND] ?? defaults[DAY_TYPE.WEEKEND] ?? ''),
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (field) => (event) => {
    const nextValue = event.target.value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const weekday = Number(form.weekdayPrice);
    const weekend = Number(form.weekendPrice);

    if (!form.roomType) {
      setFormError(tx('Room type is required.', 'Loai phong bat buoc.'));
      return;
    }
    if (!Number.isFinite(weekday) || weekday <= 0) {
      setFormError(tx('Weekday price must be greater than 0.', 'Gia ngay thuong phai lon hon 0.'));
      return;
    }
    if (!Number.isFinite(weekend) || weekend <= 0) {
      setFormError(tx('Weekend price must be greater than 0.', 'Gia cuoi tuan phai lon hon 0.'));
      return;
    }

    setSaving(true);
    try {
      await ticketPriceService.bulkUpsertPrices({
        prices: [
          { roomType: form.roomType, dayType: DAY_TYPE.WEEKDAY, price: weekday },
          { roomType: form.roomType, dayType: DAY_TYPE.WEEKEND, price: weekend },
        ],
      });
      showToast(tx('Prices updated successfully.', 'Cap nhat gia ve thanh cong.'), 'success');
      await loadPrices();
      closeForm();
    } catch (error) {
      setFormError(getErrorMessage(error, 'Failed to update prices.'));
    } finally {
      setSaving(false);
    }
  };



  return {
    prices,
    loading,
    fetchError,
    isFormOpen,
    form,
    formError,
    saving,
    toast,
    roomTypes,
    priceMap,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
  };
}

export default useTicketPriceManagement;



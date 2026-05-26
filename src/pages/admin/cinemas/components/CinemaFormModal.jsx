import { useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function CinemaFormModal({ open, mode = 'create', cinema = null, existingCinemas = [], onClose, onSubmit }) {
  const { tx } = useLanguage();
  const isEditMode = mode === 'edit';

  const [values, setValues] = useState(() => ({
    name: cinema?.name ?? '',
    address: cinema?.address ?? '',
    phone: cinema?.phone ?? '',
    email: cinema?.email ?? '',
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modalTitle = useMemo(
    () => (isEditMode ? tx('Edit cinema', 'Chỉnh sửa rạp') : tx('Add cinema', 'Thêm rạp')),
    [isEditMode, tx],
  );

  const handleValueChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    const nameValue = values.name.trim();
    const addressValue = values.address.trim();
    const phoneValue = values.phone.trim();
    const emailValue = values.email.trim();

    if (!nameValue) {
      nextErrors.name = tx('Cinema name is required.', 'Tên rạp là bắt buộc.');
    }
    if (!addressValue) {
      nextErrors.address = tx('Address is required.', 'Địa chỉ là bắt buộc.');
    }
    if (!phoneValue) {
      nextErrors.phone = tx('Phone number is required.', 'Số điện thoại là bắt buộc.');
    } else if (!/^[0-9]{8,15}$/.test(phoneValue)) {
      nextErrors.phone = tx('Phone number is invalid.', 'Số điện thoại không hợp lệ.');
    }
    if (!emailValue) {
      nextErrors.email = tx('Email is required.', 'Email là bắt buộc.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = tx('Email is invalid.', 'Email không hợp lệ.');
    }

    const hasDuplicate = existingCinemas.some((item) => {
      if (!item?.name) return false;
      if (cinema && item.id === cinema.id) return false;
      return item.name.trim().toLowerCase() === nameValue.toLowerCase();
    });

    if (nameValue && hasDuplicate) {
      nextErrors.name = tx('Cinema name already exists.', 'Tên rạp đã tồn tại.');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    setSubmitError('');

    const payload = {
      name: values.name.trim(),
      address: values.address.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    };

    const result = await onSubmit(payload);
    if (!result.ok) {
      setSubmitError(result.error || tx('Failed to save cinema.', 'Không thể lưu rạp.'));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={tx('Cinema name', 'Tên rạp')}
            value={values.name}
            onChange={handleValueChange('name')}
            error={errors.name}
          />
          <Input
            label={tx('Phone', 'Số điện thoại')}
            value={values.phone}
            onChange={handleValueChange('phone')}
            error={errors.phone}
          />
          <Input
            label={tx('Address', 'Địa chỉ')}
            value={values.address}
            onChange={handleValueChange('address')}
            error={errors.address}
          />
          <Input
            label={tx('Email', 'Email')}
            value={values.email}
            onChange={handleValueChange('email')}
            error={errors.email}
          />
        </div>

        {submitError ? <p className="text-sm text-rose">{submitError}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            {tx('Cancel', 'Hủy')}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? tx('Saving...', 'Đang lưu...')
              : isEditMode
                ? tx('Update cinema', 'Cập nhật rạp')
                : tx('Create cinema', 'Tạo rạp')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CinemaFormModal;

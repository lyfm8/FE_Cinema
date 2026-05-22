import { useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatDate } from '@/utils/formatDate';

function toDateInput(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

/**
 * @param {{
 *  profile: { fullName?: string, name?: string, email?: string, phone?: string, gender?: string, dateOfBirth?: string, role?: string, status?: string, loyaltyPoints?: number, createdAt?: string },
 *  saving?: boolean,
 *  saveMessage?: string,
 *  saveError?: string,
 *  onSave?: (values: { fullName: string, phone: string, gender: string, dateOfBirth: string }) => Promise<{ ok: boolean }>
 * }} props
 */
function ProfileInfo({ profile, saving = false, saveMessage = '', saveError = '', onSave }) {
  const { tx } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [draft, setDraft] = useState({
    fullName: profile?.fullName || profile?.name || '',
    phone: profile?.phone || '',
    gender: profile?.gender || '',
    dateOfBirth: toDateInput(profile?.dateOfBirth),
  });

  const genderLabel = useMemo(() => {
    if (profile?.gender === 'MALE') return tx('Male', 'Nam');
    if (profile?.gender === 'FEMALE') return tx('Female', 'Nữ');
    return profile?.gender || tx('Updating', 'Đang cập nhật');
  }, [profile?.gender, tx]);

  const startEditing = () => {
    setDraft({
      fullName: profile?.fullName || profile?.name || '',
      phone: profile?.phone || '',
      gender: profile?.gender || '',
      dateOfBirth: toDateInput(profile?.dateOfBirth),
    });
    setFieldError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFieldError('');
    setIsEditing(false);
  };

  const handleChange = (field) => (event) => {
    setFieldError('');
    setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!draft.fullName.trim()) {
      setFieldError(tx('Full name is required.', 'Vui lòng nhập họ và tên.'));
      return;
    }

    if (!onSave) {
      return;
    }

    const result = await onSave(draft);
    if (result?.ok) {
      setIsEditing(false);
    }
  };

  return (
    <section className="surface-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="section-label">{tx('Profile', 'Hồ sơ')}</p>
        {!isEditing ? (
          <Button variant="secondary" onClick={startEditing}>
            {tx('Edit', 'Chỉnh sửa')}
          </Button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-stone">{tx('Full name', 'Họ và tên')}</p>
            <p className="movie-title text-xl">{profile?.fullName || profile?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-stone">Email</p>
            <p className="text-sm text-charcoal">{profile?.email || 'N/A'}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-stone">{tx('Phone', 'Số điện thoại')}</p>
              <p className="text-sm text-charcoal">{profile?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-stone">{tx('Gender', 'Giới tính')}</p>
              <p className="text-sm text-charcoal">{genderLabel}</p>
            </div>
            <div>
              <p className="text-xs text-stone">{tx('Date of birth', 'Ngày sinh')}</p>
              <p className="text-sm text-charcoal">{profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-stone">{tx('Role', 'Vai trò')}</p>
              <p className="text-sm text-charcoal">{profile?.role || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-stone">{tx('Status', 'Trạng thái')}</p>
              <p className="text-sm text-charcoal">{profile?.status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-stone">{tx('Loyalty points', 'Điểm tích lũy')}</p>
              <p className="text-sm text-charcoal">{profile?.loyaltyPoints ?? 0}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-stone">{tx('Joined at', 'Ngày tham gia')}</p>
            <p className="text-sm text-charcoal">{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</p>
          </div>
          {saveMessage ? <p className="text-xs text-success-green">{saveMessage}</p> : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="fullName"
            label={tx('Full name', 'Họ và tên')}
            value={draft.fullName}
            onChange={handleChange('fullName')}
          />

          <Input
            name="phone"
            label={tx('Phone', 'Số điện thoại')}
            value={draft.phone}
            onChange={handleChange('phone')}
          />

          <label className="flex w-full flex-col gap-1">
            <span className="text-xs font-medium text-stone">{tx('Gender', 'Giới tính')}</span>
            <select
              name="gender"
              value={draft.gender}
              onChange={handleChange('gender')}
              className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal transition-colors focus:border-selected focus:border-ink focus:outline-none"
            >
              <option value="">{tx('Select gender', 'Chọn giới tính')}</option>
              <option value="MALE">{tx('Male', 'Nam')}</option>
              <option value="FEMALE">{tx('Female', 'Nữ')}</option>
            </select>
          </label>

          <Input
            name="dateOfBirth"
            type="date"
            label={tx('Date of birth', 'Ngày sinh')}
            value={draft.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
          />

          <div>
            <p className="text-xs text-stone">Email</p>
            <p className="text-sm text-charcoal">{profile?.email || 'N/A'}</p>
          </div>

          {fieldError ? <p className="text-xs text-rose">{fieldError}</p> : null}
          {saveError ? <p className="text-xs text-rose">{saveError}</p> : null}

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? tx('Saving...', 'Đang lưu...') : tx('Save', 'Lưu')}
            </Button>
            <Button type="button" variant="ghost" onClick={cancelEditing} disabled={saving}>
              {tx('Cancel', 'Hủy')}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

export default ProfileInfo;

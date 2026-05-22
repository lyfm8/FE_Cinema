import useLanguage from '@/features/i18n/hooks/useLanguage';
import { formatDate } from '@/utils/formatDate';

/** @param {{ profile: { name?: string, email?: string, phone?: string, role?: string, status?: string, loyaltyPoints?: number, createdAt?: string } }} props */
function ProfileInfo({ profile }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4">
      <p className="section-label mb-3">{tx('Profile', 'Hồ sơ')}</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-stone">{tx('Full name', 'Họ và tên')}</p>
          <p className="movie-title text-xl">{profile?.name || 'N/A'}</p>
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
      </div>
    </section>
  );
}

export default ProfileInfo;


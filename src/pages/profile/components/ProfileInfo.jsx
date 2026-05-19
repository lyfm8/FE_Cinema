import useLanguage from '@/hooks/useLanguage';

/** @param {{ profile: { name?: string, email?: string } }} props */
function ProfileInfo({ profile }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4">
      <p className="section-label mb-3">{tx('Profile', 'Hồ sơ')}</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-stone">{tx('Full name', 'Họ và tên')}</p>
          <p className="movie-title text-xl">{profile?.name ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-stone">Email</p>
          <p className="text-sm text-charcoal">{profile?.email ?? 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}

export default ProfileInfo;


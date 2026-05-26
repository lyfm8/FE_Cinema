import HeroBanner from '@/pages/home/components/HeroBanner';
import NowShowingSection from '@/pages/home/components/NowShowingSection';
import ComingSoonSection from '@/pages/home/components/ComingSoonSection';
import PromotionsSection from '@/pages/home/components/PromotionsSection';
import useHomePage from '@/features/home/hooks/useHomePage';
import Spinner from '@/components/ui/Spinner';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function HomePage() {
  const {
    nowShowing,
    comingSoon,
    stats,
    upcomingShowtimes,
    activePromotions,
    audiencePick,
    loading,
    error,
    canAccessAdminDashboard,
    handleExploreMovies,
    handleGoToAdminDashboard,
    refetch,
  } = useHomePage();

  const { tx } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-stone">{tx('Loading...', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="surface-card max-w-md space-y-4 p-8 text-center">
          <p className="text-lg text-charcoal">{tx('Unable to load data', 'Không thể tải dữ liệu')}</p>
          <p className="text-sm text-stone">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-md border-base bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-charcoal"
          >
            {tx('Try again', 'Thử lại')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-10 pb-12">
      <HeroBanner
        onExplore={handleExploreMovies}
        showAdminAccess={canAccessAdminDashboard}
        onGoAdmin={handleGoToAdminDashboard}
        stats={stats}
        upcomingShowtimes={upcomingShowtimes}
        audiencePick={audiencePick}
      />

      {nowShowing.length > 0 && (
        <NowShowingSection movies={nowShowing} />
      )}

      {activePromotions.length > 0 && (
        <PromotionsSection promotions={activePromotions} />
      )}

      {comingSoon.length > 0 && (
        <ComingSoonSection movies={comingSoon} />
      )}
    </div>
  );
}

export default HomePage;

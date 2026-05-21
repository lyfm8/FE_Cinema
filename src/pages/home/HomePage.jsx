import HeroBanner from '@/pages/home/components/HeroBanner';
import NowShowingSection from '@/pages/home/components/NowShowingSection';
import ComingSoonSection from '@/pages/home/components/ComingSoonSection';
import useHomePage from '@/features/home/hooks/useHomePage';

function HomePage() {
  const {
    nowShowing,
    comingSoon,
    canAccessAdminDashboard,
    handleExploreMovies,
    handleGoToAdminDashboard,
  } = useHomePage();

  return (
    <div className="page-container space-y-10">
      <HeroBanner
        onExplore={handleExploreMovies}
        showAdminAccess={canAccessAdminDashboard}
        onGoAdmin={handleGoToAdminDashboard}
      />
      <NowShowingSection movies={nowShowing} />
      <ComingSoonSection movies={comingSoon} />
    </div>
  );
}

export default HomePage;

import HeroBanner from '@/pages/home/components/HeroBanner';
import NowShowingSection from '@/pages/home/components/NowShowingSection';
import ComingSoonSection from '@/pages/home/components/ComingSoonSection';
import useHomePage from '@/features/home/hooks/useHomePage';

function HomePage() {
  const { nowShowing, comingSoon, handleExploreMovies } = useHomePage();

  return (
    <div className="page-container space-y-10">
      <HeroBanner onExplore={handleExploreMovies} />
      <NowShowingSection movies={nowShowing} />
      <ComingSoonSection movies={comingSoon} />
    </div>
  );
}

export default HomePage;

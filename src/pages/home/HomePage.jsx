import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '@/pages/home/components/HeroBanner';
import NowShowingSection from '@/pages/home/components/NowShowingSection';
import ComingSoonSection from '@/pages/home/components/ComingSoonSection';
import { mockMovies } from '@/utils/mockData';

function HomePage() {
  const navigate = useNavigate();

  const nowShowing = useMemo(() => mockMovies.slice(0, 4), []);
  const comingSoon = useMemo(() => mockMovies.slice(4, 8), []);

  return (
    <div className="page-container space-y-10">
      <HeroBanner onExplore={() => navigate('/movies')} />
      <NowShowingSection movies={nowShowing} />
      <ComingSoonSection movies={comingSoon} />
    </div>
  );
}

export default HomePage;



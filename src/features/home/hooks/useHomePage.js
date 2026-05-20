import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMovies } from '@/utils/mockData';

function useHomePage() {
  const navigate = useNavigate();

  const nowShowing = useMemo(() => mockMovies.slice(0, 4), []);
  const comingSoon = useMemo(() => mockMovies.slice(4, 8), []);

  const handleExploreMovies = () => {
    navigate('/movies');
  };

  return {
    nowShowing,
    comingSoon,
    handleExploreMovies,
  };
}

export default useHomePage;

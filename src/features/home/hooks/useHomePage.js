import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { mockMovies } from '@/utils/mockData';
import { USER_ROLES } from '@/utils/constants';

function useHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const nowShowing = useMemo(() => mockMovies.slice(0, 4), []);
  const comingSoon = useMemo(() => mockMovies.slice(4, 8), []);
  const canAccessAdminDashboard = isAuthenticated && user?.role === USER_ROLES.ADMIN;

  const handleExploreMovies = () => {
    navigate('/movies');
  };

  const handleGoToAdminDashboard = () => {
    navigate('/admin');
  };

  return {
    nowShowing,
    comingSoon,
    canAccessAdminDashboard,
    handleExploreMovies,
    handleGoToAdminDashboard,
  };
}

export default useHomePage;

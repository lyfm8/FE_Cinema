import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { getHomePageData } from '@/features/home/api/homeApi';
import { USER_ROLES } from '@/utils/constants';

function useHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [stats, setStats] = useState({
    totalCinemas: 0,
    todayShowtimes: 0,
    totalNowShowing: 0,
    totalComingSoon: 0,
  });
  const [upcomingShowtimes, setUpcomingShowtimes] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [audiencePick, setAudiencePick] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canAccessAdminDashboard = isAuthenticated && user?.role === USER_ROLES.ADMIN;

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getHomePageData();

      if (result.success && result.data) {
        setNowShowing(result.data.nowShowing || []);
        setComingSoon(result.data.comingSoon || []);
        setStats(result.data.stats || {
          totalCinemas: 0,
          todayShowtimes: 0,
          totalNowShowing: 0,
          totalComingSoon: 0,
        });
        setUpcomingShowtimes(result.data.upcomingShowtimes || []);
        setActivePromotions(result.data.activePromotions || []);
        setAudiencePick(result.data.audiencePick || null);
      }
    } catch (err) {
      console.error('Failed to fetch home page data:', err);
      setError(err?.response?.data?.message || 'Không thể tải dữ liệu trang chủ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const handleExploreMovies = () => {
    navigate('/movies');
  };

  const handleGoToAdminDashboard = () => {
    navigate('/admin');
  };

  return {
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
    refetch: fetchHomeData,
  };
}

export default useHomePage;

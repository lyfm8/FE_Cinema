import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import useMovies from "@/features/movies/hooks/useMovies";
import { USER_ROLES } from "@/utils/constants";

function useHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { movies, loading, error, setFilters } = useMovies({
    page: 1,
    pageSize: 8,
  });

  const nowShowing = useMemo(() => movies.slice(0, 4), [movies]);
  const comingSoon = useMemo(() => movies.slice(4, 8), [movies]);
  const stats = useMemo(
    () => ({
      totalCinemas: 0,
      todayShowtimes: 0,
      totalNowShowing: nowShowing.length,
      totalComingSoon: comingSoon.length,
    }),
    [comingSoon.length, nowShowing.length],
  );
  const upcomingShowtimes = useMemo(() => [], []);
  const activePromotions = useMemo(() => [], []);
  const audiencePick = useMemo(() => nowShowing[0] ?? null, [nowShowing]);
  const canAccessAdminDashboard =
    isAuthenticated && user?.role === USER_ROLES.ADMIN;
  const refetch = useCallback(() => {
    setFilters((current) => ({ ...current }));
  }, [setFilters]);

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
    handleExploreMovies: () => navigate("/movies"),
    handleGoToAdminDashboard: () => navigate("/admin"),
    refetch,
  };
}

export default useHomePage;

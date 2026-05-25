import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import useMovies from "@/features/movies/hooks/useMovies";
import { USER_ROLES } from "@/utils/constants";

function useHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { movies, loading, error } = useMovies({ page: 1, pageSize: 8 });

  const nowShowing = useMemo(() => movies.slice(0, 4), [movies]);
  const comingSoon = useMemo(() => movies.slice(4, 8), [movies]);
  const canAccessAdminDashboard =
    isAuthenticated && user?.role === USER_ROLES.ADMIN;

  return {
    nowShowing,
    comingSoon,
    loading,
    error,
    canAccessAdminDashboard,
    handleExploreMovies: () => navigate("/movies"),
    handleGoToAdminDashboard: () => navigate("/admin"),
  };
}

export default useHomePage;

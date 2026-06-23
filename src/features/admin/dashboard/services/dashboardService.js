import { apiClient } from "@/core/api/apiClient";

export const dashboardService = {
  getRevenueStatistics: (timeFrame = 'month') => {
    return apiClient.get('/statistics/revenue', {
      params: { timeFrame },
    });
  },

  getMoviePerformance: () => {
    return apiClient.get('/statistics/movies');
  },
};

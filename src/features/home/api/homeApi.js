import axiosInstance from '@/services/axiosInstance';

/**
 * Lấy dữ liệu trang chủ: phim đang chiếu, sắp chiếu, thống kê, suất chiếu sắp tới, khuyến mãi
 */
export async function getHomePageData() {
  const response = await axiosInstance.get('/home');
  return response.data;
}

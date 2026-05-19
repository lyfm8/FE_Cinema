import DashboardPage from '@/pages/admin/dashboard';
import MovieManagementPage from '@/pages/admin/movies';
import CinemaManagementPage from '@/pages/admin/cinemas';
import ShowtimeManagementPage from '@/pages/admin/showtimes';
import BookingManagementPage from '@/pages/admin/bookings';
import UserManagementPage from '@/pages/admin/users';

const adminRoutes = [
  { element: <DashboardPage />, index: true },
  { path: 'movies', element: <MovieManagementPage /> },
  { path: 'cinemas', element: <CinemaManagementPage /> },
  { path: 'showtimes', element: <ShowtimeManagementPage /> },
  { path: 'bookings', element: <BookingManagementPage /> },
  { path: 'users', element: <UserManagementPage /> },
];

export default adminRoutes;



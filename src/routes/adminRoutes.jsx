import DashboardPage from '@/pages/admin/dashboard';
import MovieManagementPage from '@/pages/admin/movies';
import CinemaManagementPage from '@/pages/admin/cinemas';
import RoomManagementPage from '@/pages/admin/rooms';
import ShowtimeManagementPage from '@/pages/admin/showtimes';
import BookingManagementPage from '@/pages/admin/bookings';
import UserManagementPage from '@/pages/admin/users';
import TicketPriceManagementPage from '@/pages/admin/ticket-prices';

const adminRoutes = [
  { element: <DashboardPage />, index: true },
  { path: 'movies', element: <MovieManagementPage /> },
  { path: 'cinemas', element: <CinemaManagementPage /> },
  { path: 'rooms', element: <RoomManagementPage /> },
  { path: 'ticket-prices', element: <TicketPriceManagementPage /> },
  { path: 'showtimes', element: <ShowtimeManagementPage /> },
  { path: 'bookings', element: <BookingManagementPage /> },
  { path: 'users', element: <UserManagementPage /> },
];

export default adminRoutes;

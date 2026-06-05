import HomePage from '@/pages/home';
import MovieListPage from '@/pages/movies/movie-list';
import MovieDetailPage from '@/pages/movies/movie-detail';
import PaymentPage from '@/pages/booking/payment';
import ConfirmationPage from '@/pages/booking/confirmation';
import ProfilePage from '@/pages/profile';
import CinemasPage from '@/pages/cinemas/CinemasPage';

const userRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/movies', element: <MovieListPage /> },
  { path: '/movies/:id', element: <MovieDetailPage /> },
  { path: '/cinemas', element: <CinemasPage /> },
  { path: '/booking/payment', element: <PaymentPage /> },
  { path: '/booking/confirmation', element: <ConfirmationPage /> },
  { path: '/profile', element: <ProfilePage />, protected: true },
];

export default userRoutes;



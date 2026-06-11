import HomePage from '@/pages/home';
import MovieListPage from '@/pages/movies/movie-list';
import MovieDetailPage from '@/pages/movies/movie-detail';
import CheckoutPage from '@/pages/booking/checkout';
import PaymentResultPage from '@/pages/booking/payment-result';
import ConfirmationPage from '@/pages/booking/confirmation';
import ProfilePage from '@/pages/profile';
import CinemasPage from '@/pages/cinemas/CinemasPage';
import SeatSelectionPage from '@/pages/booking/seat-selection';

const userRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/movies', element: <MovieListPage /> },
  { path: '/movies/:id', element: <MovieDetailPage /> },
  { path: '/cinemas', element: <CinemasPage /> },
  { path: '/booking/seats/:showtimeId', element: <SeatSelectionPage />, protected: true },
  { path: '/booking/checkout', element: <CheckoutPage />, protected: true },
  { path: '/booking/payment-result', element: <PaymentResultPage /> },
  { path: '/booking/confirmation', element: <ConfirmationPage /> },
  { path: '/profile', element: <ProfilePage />, protected: true },
];

export default userRoutes;

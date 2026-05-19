import { SEAT_STATUS } from '@/utils/constants';

export const mockMovies = [
  { id: 'm1', title: 'The Silent Frame', genre: 'Drama', duration: '124 min', rating: 8.7, price: 89000 },
  { id: 'm2', title: 'Orbit of Ash', genre: 'Sci-Fi', duration: '116 min', rating: 8.3, price: 99000 },
  { id: 'm3', title: 'Paper City Nights', genre: 'Thriller', duration: '109 min', rating: 7.9, price: 85000 },
  { id: 'm4', title: 'Goldline', genre: 'Action', duration: '131 min', rating: 8.5, price: 109000 },
  { id: 'm5', title: 'Parallel Summer', genre: 'Romance', duration: '103 min', rating: 7.8, price: 84000 },
  { id: 'm6', title: 'Cobalt Horizon', genre: 'Adventure', duration: '127 min', rating: 8.2, price: 102000 },
  { id: 'm7', title: 'Night Broadcast', genre: 'Mystery', duration: '118 min', rating: 8.1, price: 92000 },
  { id: 'm8', title: 'Echoes of Marble', genre: 'Historical', duration: '136 min', rating: 8.6, price: 112000 },
  { id: 'm9', title: 'Crowd Zero', genre: 'Action', duration: '114 min', rating: 7.6, price: 87000 },
  { id: 'm10', title: 'Aurora Drive', genre: 'Animation', duration: '98 min', rating: 8.4, price: 79000 },
  { id: 'm11', title: 'Twelve Seats Left', genre: 'Comedy', duration: '101 min', rating: 7.7, price: 81000 },
  { id: 'm12', title: 'Brass Avenue', genre: 'Crime', duration: '122 min', rating: 8.0, price: 94000 },
];

export const mockShowtimes = [
  { id: 'st1', day: 'Today', time: '09:30', room: 'Room A', format: '2D', availability: 'Many seats' },
  { id: 'st2', day: 'Today', time: '11:50', room: 'Room D', format: '3D', availability: 'Many seats' },
  { id: 'st3', day: 'Today', time: '14:20', room: 'VIP 1', format: 'IMAX', availability: 'Few seats' },
  { id: 'st4', day: 'Today', time: '18:45', room: 'Room C', format: '2D', availability: 'Few seats' },
  { id: 'st5', day: 'Tomorrow', time: '10:10', room: 'Room B', format: '2D', availability: 'Many seats' },
  { id: 'st6', day: 'Tomorrow', time: '13:40', room: 'VIP 2', format: 'IMAX', availability: 'Many seats' },
  { id: 'st7', day: 'Tomorrow', time: '16:30', room: 'Room E', format: '3D', availability: 'Few seats' },
  { id: 'st8', day: 'Tomorrow', time: '20:15', room: 'Room A', format: '2D', availability: 'Many seats' },
];

export const mockSeats = Array.from({ length: 64 }, (_, index) => {
  const seatNumber = index + 1;

  if (seatNumber % 11 === 0) {
    return { id: `S${seatNumber}`, status: SEAT_STATUS.SOLD };
  }

  if (seatNumber % 7 === 0) {
    return { id: `S${seatNumber}`, status: SEAT_STATUS.VIP };
  }

  return { id: `S${seatNumber}`, status: SEAT_STATUS.AVAILABLE };
});

export const mockProfileBookings = [
  { id: 'BK9012', createdAt: '2026-05-10', status: 'CONFIRMED' },
  { id: 'BK8921', createdAt: '2026-05-02', status: 'CONFIRMED' },
  { id: 'BK8848', createdAt: '2026-04-25', status: 'USED' },
  { id: 'BK8732', createdAt: '2026-04-16', status: 'REFUNDED' },
];

export const mockAdminBookings = [
  {
    id: 'BK1001',
    customer: 'Anh Tuan',
    movie: 'The Silent Frame',
    seats: 'A4,A5',
    amount: '250,000',
    status: 'PAID',
    createdAt: '2026-05-19 08:20',
  },
  {
    id: 'BK1002',
    customer: 'Linh Nguyen',
    movie: 'Orbit of Ash',
    seats: 'C7,C8,C9',
    amount: '390,000',
    status: 'PAID',
    createdAt: '2026-05-19 09:03',
  },
  {
    id: 'BK1003',
    customer: 'Minh Tran',
    movie: 'Goldline',
    seats: 'E2,E3',
    amount: '210,000',
    status: 'PENDING',
    createdAt: '2026-05-19 09:40',
  },
  {
    id: 'BK1004',
    customer: 'Thu Ha',
    movie: 'Aurora Drive',
    seats: 'B1,B2,B3',
    amount: '237,000',
    status: 'PAID',
    createdAt: '2026-05-19 10:11',
  },
  {
    id: 'BK1005',
    customer: 'Khoa Le',
    movie: 'Brass Avenue',
    seats: 'D10,D11',
    amount: '188,000',
    status: 'REFUND',
    createdAt: '2026-05-19 10:45',
  },
  {
    id: 'BK1006',
    customer: 'Vy Dang',
    movie: 'Cobalt Horizon',
    seats: 'F4,F5,F6',
    amount: '306,000',
    status: 'PAID',
    createdAt: '2026-05-19 11:19',
  },
];

export const mockCinemas = [
  { name: 'CINEPLEX Riverside', city: 'Ho Chi Minh', rooms: 9, occupancy: '78%', manager: 'Ngoc Anh' },
  { name: 'CINEPLEX Landmark', city: 'Ho Chi Minh', rooms: 12, occupancy: '82%', manager: 'Tuan Le' },
  { name: 'CINEPLEX Downtown', city: 'Da Nang', rooms: 7, occupancy: '69%', manager: 'Mai Huong' },
  { name: 'CINEPLEX Pearl', city: 'Ha Noi', rooms: 11, occupancy: '74%', manager: 'Thanh Binh' },
];

export const mockShowtimeRows = [
  { movie: 'The Silent Frame', cinema: 'Riverside', time: '09:30', room: 'A', format: '2D', seats: '132/180' },
  { movie: 'Orbit of Ash', cinema: 'Landmark', time: '11:50', room: 'D', format: '3D', seats: '88/160' },
  { movie: 'Goldline', cinema: 'Pearl', time: '14:20', room: 'VIP1', format: 'IMAX', seats: '42/60' },
  { movie: 'Aurora Drive', cinema: 'Downtown', time: '16:30', room: 'B', format: '2D', seats: '104/150' },
  { movie: 'Brass Avenue', cinema: 'Riverside', time: '20:15', room: 'C', format: '2D', seats: '93/170' },
];

export const mockUsers = [
  { name: 'Anh Tuan', email: 'anhtuan@email.com', role: 'USER', status: 'ACTIVE', joined: '2026-01-12' },
  { name: 'Linh Nguyen', email: 'linhnguyen@email.com', role: 'USER', status: 'ACTIVE', joined: '2026-02-09' },
  { name: 'Minh Tran', email: 'minhtran@email.com', role: 'ADMIN', status: 'ACTIVE', joined: '2025-11-04' },
  { name: 'Thu Ha', email: 'thuha@email.com', role: 'USER', status: 'LOCKED', joined: '2026-03-18' },
  { name: 'Khoa Le', email: 'khoale@email.com', role: 'USER', status: 'ACTIVE', joined: '2026-04-02' },
  { name: 'Vy Dang', email: 'vydang@email.com', role: 'USER', status: 'ACTIVE', joined: '2026-04-28' },
];


import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SOCKET_URL = new URL(API_URL).origin;

// Khởi tạo connection tới namespace /notification
// autoConnect: false để ta chủ động gọi socket.connect() khi đã có token/đăng nhập
export const socket = io(`${SOCKET_URL}/notification`, {
  autoConnect: false, 
  withCredentials: true,
});

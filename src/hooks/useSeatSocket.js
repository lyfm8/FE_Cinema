import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * Custom hook to manage socket connection for real-time seat updates
 * @param {string | number} showtimeId 
 * @returns {{ unavailableSeatIds: number[], isConnected: boolean }}
 */
function useSeatSocket(showtimeId) {
  const [unavailableSeatIds, setUnavailableSeatIds] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!showtimeId) return;

    // Connect to the /seat namespace
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000/seat';
    const socket = io(socketUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Join the room for this showtime
      socket.emit('join-showtime', { showtimeId: Number(showtimeId) });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen to real-time seat updates
    socket.on('seat-update', (data) => {
      if (data && data.allUnavailableSeatIds) {
        setUnavailableSeatIds(data.allUnavailableSeatIds);
      }
    });

    socket.on('joined', (data) => {
      console.log('Socket joined:', data.message);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    // Cleanup on unmount or showtimeId change
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-showtime', { showtimeId: Number(showtimeId) });
        socketRef.current.disconnect();
      }
    };
  }, [showtimeId]);

  return {
    unavailableSeatIds,
    isConnected,
  };
}

export default useSeatSocket;

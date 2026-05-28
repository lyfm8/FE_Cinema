import { useState, useCallback, useEffect } from 'react';
import { publicCinemaService } from '../services/cinemaService';

export default function useCinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [rooms, setRooms] = useState([]);
  
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState(null);

  const fetchCinemas = useCallback(async () => {
    try {
      setLoadingCinemas(true);
      const result = await publicCinemaService.getAllCinemas();
      const fetchedCinemas = result.data || [];
      setCinemas(fetchedCinemas);
      
      if (fetchedCinemas.length > 0 && !selectedCinema) {
        setSelectedCinema(fetchedCinemas[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cinemas:', err);
      setError('Không thể tải danh sách rạp. Vui lòng thử lại sau.');
    } finally {
      setLoadingCinemas(false);
    }
  }, [selectedCinema]);

  const fetchRooms = useCallback(async (cinemaId) => {
    if (!cinemaId) {
      setRooms([]);
      return;
    }
    try {
      setLoadingRooms(true);
      const result = await publicCinemaService.getRoomsByCinemaId(cinemaId);
      setRooms(result.data || []);
      setError(null);
    } catch (err) {
      console.error(`Failed to fetch rooms for cinema ${cinemaId}:`, err);
      setError('Không thể tải danh sách phòng chiếu. Vui lòng thử lại sau.');
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    fetchCinemas();
  }, [fetchCinemas]);

  useEffect(() => {
    if (selectedCinema) {
      fetchRooms(selectedCinema.id);
    }
  }, [selectedCinema, fetchRooms]);

  return {
    cinemas,
    selectedCinema,
    setSelectedCinema,
    rooms,
    loadingCinemas,
    loadingRooms,
    error,
    refetch: fetchCinemas
  };
}

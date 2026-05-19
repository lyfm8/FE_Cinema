import { useEffect, useMemo, useState } from 'react';
import { getMovies } from '@/features/movies/services/movieService';
import { mockMovies } from '@/utils/mockData';

function useMovies(initialFilters = {}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      setLoading(true);
      setError('');

      try {
        const result = await getMovies(filters);
        const records = Array.isArray(result?.data) ? result.data : result;

        if (mounted) {
          setMovies(Array.isArray(records) ? records : []);
        }
      } catch {
        if (mounted) {
          setError('Unable to load movies from API. Showing mock data.');
          setMovies(mockMovies);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      mounted = false;
    };
  }, [filters]);

  const hasData = useMemo(() => movies.length > 0, [movies]);

  return {
    movies,
    loading,
    error,
    hasData,
    filters,
    setFilters,
  };
}

export default useMovies;


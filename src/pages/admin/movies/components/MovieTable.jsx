import DataTable from '@/components/shared/DataTable';
import useLanguage from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';

/** @param {{ movies: Array<{ id: string, title: string, genre: string, duration: string, price: number }> }} props */
function MovieTable({ movies }) {
  const { tx } = useLanguage();

  const columns = [
    { key: 'title', label: tx('Title', 'Tiêu đề') },
    { key: 'genre', label: tx('Genre', 'Thể loại') },
    { key: 'duration', label: tx('Duration', 'Thời lượng') },
    { key: 'price', label: tx('Price', 'Giá') },
  ];

  const rows = movies.map((movie) => ({
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    price: formatCurrency(movie.price),
  }));

  return <DataTable columns={columns} rows={rows} />;
}

export default MovieTable;


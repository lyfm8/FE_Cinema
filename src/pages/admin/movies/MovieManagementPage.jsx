import { useState } from 'react';
import MovieTable from '@/pages/admin/movies/components/MovieTable';
import MovieFormModal from '@/pages/admin/movies/components/MovieFormModal';
import Button from '@/components/ui/Button';
import useLanguage from '@/hooks/useLanguage';
import { mockMovies } from '@/utils/mockData';

function MovieManagementPage() {
  const { tx } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="section-label eyebrow-row">
            <span className="kicker-dot" />
            {tx('Admin', 'Quản trị')}
          </p>
          <h1 className="text-3xl font-medium text-ink">{tx('Movie Management', 'Quản lý phim')}</h1>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>{tx('Add movie', 'Thêm phim')}</Button>
      </div>

      <MovieTable movies={mockMovies} />
      <MovieFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default MovieManagementPage;




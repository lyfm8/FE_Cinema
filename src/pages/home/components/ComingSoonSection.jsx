import MovieCard from '@/pages/movies/movie-list/components/MovieCard';
import useLanguage from '@/hooks/useLanguage';

/** @param {{ movies: Array<{id: string, title: string, genre: string, duration: string, rating: number, price: number}> }} props */
function ComingSoonSection({ movies }) {
  const { tx } = useLanguage();

  return (
    <section className="space-y-4">
      <div>
        <p className="section-label mb-2">{tx('Coming Soon', 'Sắp chiếu')}</p>
        <h2 className="text-xl font-medium text-ink">{tx('Early previews and next releases', 'Preview sớm và phim sắp ra mắt')}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default ComingSoonSection;




import { Link } from "react-router-dom";
import useLanguage from "@/features/i18n/hooks/useLanguage";

/** @param {{ movie: any }} props */
function MovieCard({ movie }) {
  const { tx } = useLanguage();

  const durationText = movie.durationMinutes ? `${movie.durationMinutes} ${tx('min', 'phút')}` : "-";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList?.remove('hidden');
            }}
          />
        ) : null}
        
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${movie.posterUrl ? 'hidden' : ''}`}>
          <span className="text-gray-400 text-4xl">🎬</span>
        </div>

        {/* Hover Overlay with Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-galaxyBlue/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-sm">
          <Link to={`/movies/${movie.id}#showtimes`} className="w-3/4 text-center rounded bg-galaxyOrange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-galaxyOrangeHover shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {tx('Buy Ticket', 'Mua Vé')}
          </Link>
          <Link to={`/movies/${movie.id}`} className="w-3/4 text-center rounded border-2 border-white px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-galaxyBlue shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {tx('Details', 'Xem Chi Tiết')}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-3 pb-2 px-2">
        <div className="flex items-start gap-2">
          <Link
            to={`/movies/${movie.id}`}
            className="movie-title block text-lg font-bold uppercase transition-colors hover:text-galaxyBlue line-clamp-2"
          >
            {movie.title}
          </Link>
        </div>
        
        <div className="mt-2 flex flex-wrap items-center text-sm font-medium text-stone">
          <span>{movie.genre || "-"}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{durationText}</span>
          {movie.ageLimit && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-galaxyOrange font-bold">{movie.ageLimit}+</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
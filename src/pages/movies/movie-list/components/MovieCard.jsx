import { Link } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import { formatCurrency } from "@/utils/formatCurrency";

/** @param {{ movie: { id: string|number, title: string, genre?: string, duration?: string, durationMinutes?: number, rating?: number, price?: number|string, posterUrl?: string } }} props */
function MovieCard({ movie }) {
  const { tx } = useLanguage();

  const durationText =
    movie.duration ??
    (movie.durationMinutes ? `${movie.durationMinutes} min` : "-");

  const ratingText =
    movie.rating !== undefined && movie.rating !== null ? movie.rating : "N/A";

  const parsedPrice = Number(movie.price);
  const priceText = Number.isFinite(parsedPrice)
    ? formatCurrency(parsedPrice)
    : "-";

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-colors hover:border-charcoal">
      <div className="relative h-48 border-b border-ash bg-cream">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-stone">
            No poster
          </div>
        )}

        <span className="section-label absolute left-3 top-3">
          {tx("Poster", "Áp phích")}
        </span>

        <span className="absolute left-3 bottom-3 rounded-full border-base bg-paper px-2 py-0.5 text-[11px] text-stone">
          {movie.genre || "-"}
        </span>

        <span className="absolute bottom-3 right-3 rounded-full border-base bg-gold px-2 py-0.5 text-[11px] text-charcoal">
          {ratingText}
        </span>
      </div>

      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <Badge tone="outline">{durationText}</Badge>
          <span className="text-xs text-stone">
            {tx("2D • Sub", "2D • Phụ đề")}
          </span>
        </div>

        <Link
          to={`/movies/${movie.id}`}
          className="movie-title block text-lg leading-tight transition-colors group-hover:text-charcoal"
        >
          {movie.title}
        </Link>

        <div className="flex items-center justify-between text-xs text-stone">
          <span>{tx("From", "Từ")}</span>
          <span className="movie-title text-sm">{priceText}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;

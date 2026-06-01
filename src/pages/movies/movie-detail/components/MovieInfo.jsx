import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import useLanguage from "@/features/i18n/hooks/useLanguage";

function formatDate(dateStr) {
  if (!dateStr) return "—";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isSuspiciousSynopsis(text) {
  if (!text) return false;

  const normalized = String(text).toLowerCase();
  const suspiciousTokens = [
    "@echo off",
    "cmd /k",
    "npm run",
    "start \"",
    "cd /d",
    "&&",
  ];

  let hitCount = 0;
  for (const token of suspiciousTokens) {
    if (normalized.includes(token)) hitCount += 1;
  }

  return hitCount >= 2;
}

function pickSynopsis(movie) {
  const candidates = [
    movie?.description,
    movie?.synopsis,
    movie?.content,
    movie?.overview,
  ]
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (candidates.length === 0) return "";

  const firstSafeCandidate = candidates.find((value) => !isSuspiciousSynopsis(value));
  return firstSafeCandidate || "";
}

/** @param {{ movie: any, onOpenTrailer: () => void }} props */
function MovieInfo({ movie, onOpenTrailer }) {
  const { tx } = useLanguage();
  const synopsis = pickSynopsis(movie);
  const synopsisText =
    synopsis || tx("Synopsis is being updated.", "Nội dung phim đang được cập nhật.");

  return (
    <section className="flex flex-col gap-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
      <div className="w-full shrink-0 space-y-4 md:w-[320px]">
        <div className="relative flex h-[480px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-inner">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.target.style.display = "none";
                event.target.nextElementSibling?.classList?.remove("hidden");
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${movie.posterUrl ? "hidden" : ""}`}>
            <span className="text-4xl text-gray-300">🎬</span>
          </div>
        </div>

        {movie.trailerUrl ? (
          <Button variant="secondary" onClick={onOpenTrailer} className="w-full">
            {tx("Watch trailer", "Xem trailer")}
          </Button>
        ) : null}
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">{movie.genre || "—"}</Badge>
          <Badge tone="muted">
            {movie.durationMinutes || movie.duration
              ? `${movie.durationMinutes || movie.duration} ${tx("min", "phút")}`
              : "—"}
          </Badge>
          {movie.ageLimit ? (
            <Badge tone="outline">{movie.ageLimit}+</Badge>
          ) : null}
        </div>

        <div className="space-y-4 text-sm text-stone">
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {tx("Release", "Khởi chiếu")}
              </span>
              <p className="text-base font-medium text-ink">{formatDate(movie.releaseDate)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {tx("Language", "Ngôn ngữ")}
              </span>
              <p className="text-base font-medium text-ink">{movie.language || "—"}</p>
            </div>
          </div>

          {movie.director || movie.cast ? (
            <div className="mt-6 space-y-4">
              {movie.director ? (
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                    {tx("Director", "Đạo diễn")}
                  </span>
                  <p className="text-base font-medium text-ink">{movie.director}</p>
                </div>
              ) : null}
              {movie.cast ? (
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                    {tx("Cast", "Diễn viên")}
                  </span>
                  <p className="text-base font-medium leading-relaxed text-ink">{movie.cast}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="pt-4">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              {tx("Synopsis", "Nội dung phim")}
            </span>
            <p className="text-base leading-relaxed text-ink">{synopsisText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieInfo;

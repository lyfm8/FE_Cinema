import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function HeroBanner({ featuredMovies = [] }) {
  const { tx } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    if (featuredMovies.length <= 1) return;
    goToSlide((currentIndex + 1) % featuredMovies.length);
  }, [currentIndex, featuredMovies.length, goToSlide]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, featuredMovies.length]);

  if (featuredMovies.length === 0) {
    return (
      <section className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#1a0a2e] flex items-center justify-center">
        <div className="text-center text-white space-y-4 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">{tx('Welcome to CINEPLEX', 'Chào mừng đến CINEPLEX')}</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            {tx(
              'Your premium cinema booking experience. Browse movies, select seats, and book tickets — all in one place.',
              'Trải nghiệm đặt vé rạp phim cao cấp. Duyệt phim, chọn ghế, và đặt vé — tất cả tại một nơi.'
            )}
          </p>
          <Link
            to="/movies"
            className="inline-block rounded-lg bg-[#f26b38] px-8 py-3 text-white font-semibold shadow-lg shadow-[#f26b38]/30 transition-all hover:bg-[#fb9440] hover:shadow-xl hover:-translate-y-0.5"
          >
            {tx('Explore Movies', 'Khám phá phim')}
          </Link>
        </div>
      </section>
    );
  }

  const movie = featuredMovies[currentIndex];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#0a1628]">
      {/* Background poster with parallax effect */}
      {featuredMovies.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0, zIndex: i === currentIndex ? 1 : 0 }}
        >
          <img
            src={m.posterUrl}
            alt={m.title}
            className="h-full w-full object-cover object-top scale-110 blur-sm"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full page-container flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center w-full">
          {/* Left: Movie info */}
          <div className="space-y-5 max-w-xl">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-wide shadow-lg ${
                movie.status === 'COMING_SOON'
                  ? 'bg-[#034ea2] shadow-[#034ea2]/30'
                  : 'bg-[#f26b38] shadow-[#f26b38]/30'
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                {movie.status === 'COMING_SOON'
                  ? tx('Coming Soon', 'Sắp chiếu')
                  : tx('Now Showing', 'Đang chiếu')}
              </span>
              {movie.ageLimit && (
                <span className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                  {movie.ageLimit}+
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {movie.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              {movie.genre && (
                <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
                  {movie.genre}
                </span>
              )}
              {movie.durationMinutes && (
                <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
                  🕐 {movie.durationMinutes} {tx('min', 'phút')}
                </span>
              )}
              {movie.language && (
                <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
                  🌐 {movie.language}
                </span>
              )}
            </div>

            {/* Description */}
            {movie.description && (
              <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
                {movie.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to={`/booking/${movie.id}/seats`}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#f26b38] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#f26b38]/30 transition-all hover:bg-[#fb9440] hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {tx('Buy Ticket', 'Mua vé ngay')}
              </Link>
              <Link
                to={`/movies/${movie.id}`}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/50 hover:-translate-y-0.5"
              >
                {tx('Details', 'Chi tiết')}
              </Link>
            </div>
          </div>

          {/* Right: Movie poster card */}
          <div className="hidden md:block">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f26b38]/20 to-[#034ea2]/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="relative w-[280px] lg:w-[300px] rounded-xl shadow-2xl shadow-black/50 transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ aspectRatio: '2/3', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-8 bg-[#f26b38]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroBanner;

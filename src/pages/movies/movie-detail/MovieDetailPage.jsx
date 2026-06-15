import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieInfo from "@/pages/movies/movie-detail/components/MovieInfo";
import ShowtimeList from "@/pages/movies/movie-detail/components/ShowtimeList";
import TrailerModal from "@/pages/movies/movie-detail/components/TrailerModal";
import InlineSeatBooking from "@/pages/movies/movie-detail/components/InlineSeatBooking";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useMovieDetailPage from "@/features/movies/movie-detail/hooks/useMovieDetailPage";
import useInlineSeatBooking from "@/features/movies/movie-detail/hooks/useInlineSeatBooking";

function MovieDetailPage() {
  const { id } = useParams();
  const { tx } = useLanguage();
  const {
    movie,
    showtimes,
    loadingMovie,
    loadingShowtimes,
    error,
    showtimesError,
  } = useMovieDetailPage(id);
  const [openTrailer, setOpenTrailer] = useState(false);

  const {
    activeShowtime,
    showtimeDetail,
    loadingSeatMap,
    seatMapError,
    selectedSeats,
    selectedSeatLabels,
    pricePerSeat,
    totalPrice,
    selectShowtime,
    handleToggleSeat,
    handleBackToShowtimes,
    handleBookTickets,
    showConfirmModal,
    setShowConfirmModal,
    confirmBooking,
    bookingLoading,
    concessionProducts,
    selectedConcessions,
    handleConcessionChange,
    concessionTotal,
    grandTotal,
  } = useInlineSeatBooking();

  useEffect(() => {
    if (window.location.hash === "#showtimes" && !loadingMovie && !loadingShowtimes) {
      setTimeout(() => {
        const el = document.getElementById("showtimes");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [loadingMovie, loadingShowtimes]);

  if (loadingMovie) {
    return (
      <div className="page-container py-12 text-center text-sm font-medium text-stone">
        {tx("Loading movie...", "Đang tải phim...")}
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="page-container py-12 text-center text-sm font-medium text-rose">
        {error || tx("Movie not found", "Không tìm thấy phim")}
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      <div className="mb-4 space-y-2">
        <p className="text-sm font-bold uppercase tracking-widest text-galaxyBlue">
          {tx("Movie Detail", "Chi tiết phim")}
        </p>
        <div className="flex items-center gap-3">
          {movie.ageLimit ? (
            <span className="shrink-0 rounded bg-galaxyOrange px-2 py-1 text-sm font-bold text-white shadow-sm">
              {movie.ageLimit}+
            </span>
          ) : null}
          <h1 className="movie-title text-3xl">{movie.title}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <MovieInfo movie={movie} onOpenTrailer={() => setOpenTrailer(true)} />

        <div id="showtimes">
          {activeShowtime ? (
          <InlineSeatBooking
            showtime={activeShowtime}
            showtimeDetail={showtimeDetail}
            loading={loadingSeatMap}
            error={seatMapError}
            selectedSeatIds={selectedSeats}
            selectedSeatLabels={selectedSeatLabels}
            pricePerSeat={pricePerSeat}
            totalPrice={totalPrice}
            onBack={handleBackToShowtimes}
            onToggleSeat={handleToggleSeat}
            onBookTickets={handleBookTickets}
            showConfirmModal={showConfirmModal}
            onCloseConfirmModal={() => setShowConfirmModal(false)}
            onConfirmBooking={confirmBooking}
            bookingLoading={bookingLoading}
            concessionProducts={concessionProducts}
            selectedConcessions={selectedConcessions}
            onConcessionChange={handleConcessionChange}
            concessionTotal={concessionTotal}
            grandTotal={grandTotal}
          />
        ) : (
          <ShowtimeList
            showtimes={showtimes}
            loading={loadingShowtimes}
            error={showtimesError}
            onSelectShowtime={selectShowtime}
          />
        )}
        </div>
      </div>

      <TrailerModal
        isOpen={openTrailer}
        onClose={() => setOpenTrailer(false)}
        title={movie.title}
        trailerUrl={movie.trailerUrl}
      />
    </div>
  );
}

export default MovieDetailPage;

import HeroBanner from '@/pages/home/components/HeroBanner';
import QuickBooking from '@/pages/home/components/QuickBooking';
import NowShowingSection from '@/pages/home/components/NowShowingSection';
import ComingSoonSection from '@/pages/home/components/ComingSoonSection';
import useHomePage from '@/features/home/hooks/useHomePage';
import Spinner from '@/components/ui/Spinner';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function HomePage() {
  const {
    movies,
    nowShowing,
    comingSoon,
    featuredMovies,
    loading,
    error,
    refetch,
  } = useHomePage();

  const { tx } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-stone">{tx('Loading...', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="surface-card max-w-md space-y-4 p-8 text-center">
          <p className="text-lg text-charcoal">{tx('Unable to load data', 'Không thể tải dữ liệu')}</p>
          <p className="text-sm text-stone">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-md border-base bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-charcoal"
          >
            {tx('Try again', 'Thử lại')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-galaxyBg">
      {/* Hero Banner — Full width */}
      <HeroBanner featuredMovies={featuredMovies} />

      {/* Quick Booking Bar */}
      <QuickBooking movies={nowShowing.length > 0 ? nowShowing : movies} />

      {/* Now Showing */}
      {nowShowing.length > 0 && (
        <NowShowingSection movies={nowShowing} />
      )}

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <ComingSoonSection movies={comingSoon} />
      )}

      {/* Promotions — hidden when empty */}
    </div>
  );
}

export default HomePage;

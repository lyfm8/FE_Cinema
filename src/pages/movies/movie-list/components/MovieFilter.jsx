import SearchBar from '@/components/shared/SearchBar';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const QUICK_FILTERS = ['All', '2D', 'IMAX', 'Subbed', 'VN Dub'];

/** @param {{ keyword: string, onKeywordChange: (value: string) => void }} props */
function MovieFilter({ keyword, onKeywordChange }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4">
      <p className="section-label mb-3">{tx('Filter', 'Bộ lọc')}</p>
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <SearchBar value={keyword} onChange={onKeywordChange} placeholder={tx('Search by movie title', 'Tìm theo tên phim')} />
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((item) => (
            <span key={item} className="rounded-full border-base bg-cream px-3 py-1 text-xs text-stone">
              {tx(item, item === 'All' ? 'Tất cả' : item === 'Subbed' ? 'Phụ đề' : item === 'VN Dub' ? 'Lồng tiếng Việt' : item)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieFilter;


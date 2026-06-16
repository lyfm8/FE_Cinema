import SearchBar from '@/components/shared/SearchBar';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ keyword: string, onKeywordChange: (value: string) => void, selectedGenre: string, onGenreChange: (value: string) => void, genres: string[] }} props */
function MovieFilter({ keyword, onKeywordChange, selectedGenre, onGenreChange, genres = [] }) {
  const { tx } = useLanguage();

  return (
    <section className="surface-card p-4">
      <div className="flex flex-col gap-4">
        <SearchBar value={keyword} onChange={onKeywordChange} placeholder={tx('Search by movie title', 'Tìm kiếm phim...')} />
        
        <div>
          <p className="text-xs font-medium text-stone mb-2">{tx('Genres', 'Thể loại')}</p>
          <div className="flex flex-wrap gap-2">
            {['All', ...genres].map((item) => (
              <button 
                key={item} 
                type="button"
                onClick={() => onGenreChange(item)}
                className={`rounded-full border border-base px-3 py-1 text-xs transition-colors ${selectedGenre === item ? 'bg-charcoal text-white border-charcoal shadow-sm' : 'bg-cream text-stone hover:bg-stone-200'}`}
              >
                {item === 'All' ? tx('All', 'Tất cả') : item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieFilter;


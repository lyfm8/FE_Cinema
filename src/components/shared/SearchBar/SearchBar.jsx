import useLanguage from '@/features/i18n/hooks/useLanguage';
import { Search } from '@/components/shared/Icons';

/**
 * @param {{
 *  value: string,
 *  onChange: (value: string) => void,
 *  placeholder?: string
 * }} props
 */
function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const { tx } = useLanguage();

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder === 'Search...' ? tx('Search...', 'Tìm kiếm...') : placeholder}
        className="w-full rounded-md border-base bg-paper pl-3 pr-10 py-2 text-sm text-charcoal placeholder:text-fog transition-colors focus:border-selected focus:border-ink focus:outline-none"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone">
        <Search className="h-4 w-4" />
      </div>
    </div>
  );
}

export default SearchBar;


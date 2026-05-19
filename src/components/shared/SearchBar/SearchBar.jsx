import useLanguage from '@/hooks/useLanguage';

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
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder === 'Search...' ? tx('Search...', 'Tìm kiếm...') : placeholder}
      className="w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal placeholder:text-fog transition-colors focus:border-selected focus:border-ink focus:outline-none"
    />
  );
}

export default SearchBar;


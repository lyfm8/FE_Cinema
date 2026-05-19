/**
 * @param {{
 *  id?: string,
 *  name?: string,
 *  label?: string,
 *  type?: string,
 *  value?: string,
 *  placeholder?: string,
 *  error?: string,
 *  onChange?: (event: import('react').ChangeEvent<HTMLInputElement>) => void
 * }} props
 */
function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  error,
  onChange,
}) {
  return (
    <label className="flex w-full flex-col gap-1">
      {label ? <span className="text-xs font-medium text-stone">{label}</span> : null}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal placeholder:text-fog transition-colors focus:border-selected focus:border-ink focus:outline-none ${
          error ? 'border-rose' : ''
        }`}
      />
      {error ? <span className="text-xs text-rose">{error}</span> : null}
    </label>
  );
}

export default Input;

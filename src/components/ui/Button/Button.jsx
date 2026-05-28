/**
 * @param {{
 *  children: import('react').ReactNode,
 *  type?: 'button' | 'submit' | 'reset',
 *  variant?: 'primary' | 'secondary' | 'ghost',
 *  className?: string,
 *  disabled?: boolean,
 *  onClick?: () => void
 * }} props
 */
function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
}) {
  const baseClass =
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-galaxyOrange focus-visible:ring-offset-1';

  const variantClassMap = {
    primary: 'bg-[#f26b38] text-white border border-[#fb9440] hover:bg-[#fb9440] shadow-md active:scale-95',
    secondary: 'bg-white text-[#034ea2] border border-[#034ea2] hover:bg-blue-50 active:scale-95',
    ghost: 'bg-transparent text-stone border border-transparent hover:bg-gray-100 hover:text-[#034ea2] active:scale-95',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${variantClassMap[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

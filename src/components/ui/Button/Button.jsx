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
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-selected focus-visible:border-ink';

  const variantClassMap = {
    primary: 'bg-ink text-paper border-base border-ink hover:bg-charcoal active:translate-y-px',
    secondary: 'bg-transparent text-ink border-base border-charcoal hover:bg-cream active:translate-y-px',
    ghost: 'bg-transparent text-stone border-base border-ash hover:bg-cream active:translate-y-px',
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

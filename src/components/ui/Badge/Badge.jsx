/**
 * @param {{
 *  children: import('react').ReactNode,
 *  tone?: 'dark' | 'outline' | 'muted' | 'gold' | 'rose'
 * }} props
 */
function Badge({ children, tone = 'muted' }) {
  const toneClassMap = {
    dark: 'bg-charcoal text-cream border-base border-charcoal',
    outline: 'bg-transparent text-charcoal border-base border-charcoal',
    muted: 'bg-cream text-stone border-base border-ash',
    gold: 'bg-gold text-charcoal border-base border-gold-dark',
    rose: 'bg-rose/10 text-rose border-base border-rose',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClassMap[tone]}`}>
      {children}
    </span>
  );
}

export default Badge;

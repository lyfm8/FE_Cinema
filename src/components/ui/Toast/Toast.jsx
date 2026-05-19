/**
 * @param {{
 *  message: string,
 *  tone?: 'success' | 'error' | 'info',
 *  visible?: boolean
 * }} props
 */
function Toast({ message, tone = 'info', visible = false }) {
  if (!visible) {
    return null;
  }

  const toneClassMap = {
    success: 'border-success-green text-success-green bg-success-green/10',
    error: 'border-rose text-rose bg-rose/10',
    info: 'border-stone text-charcoal bg-cream',
  };

  return (
    <div className={`fixed bottom-4 right-4 rounded-md border-base px-4 py-2 text-sm ${toneClassMap[tone]}`}>
      {message}
    </div>
  );
}

export default Toast;

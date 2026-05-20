import useLanguage from '@/features/i18n/hooks/useLanguage';

function QRCode() {
  const { tx } = useLanguage();

  return (
    <div className="mx-auto space-y-2">
      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-md border-base bg-cream text-xs text-stone">
        {tx('QR CODE', 'MÃ QR')}
      </div>
      <p className="text-xs text-stone">{tx('Booking ID', 'Mã đặt vé')}: BK-23981</p>
    </div>
  );
}

export default QRCode;


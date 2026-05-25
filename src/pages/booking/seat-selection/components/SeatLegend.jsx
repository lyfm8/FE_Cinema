import useLanguage from '@/features/i18n/hooks/useLanguage';

const LEGENDS = [
  { label: 'Available', className: 'bg-paper border-base border-ash', viLabel: 'Trống' },
  { label: 'Selected', className: 'bg-ink border-selected border-ink', viLabel: 'Đang chọn' },
  { label: 'Reserved', className: 'bg-gold border-base border-gold-dark opacity-80', viLabel: 'Giữ chỗ' },
  { label: 'Sold', className: 'bg-fog border-base border-stone opacity-50', viLabel: 'Đã đặt' },
];

function SeatLegend() {
  const { tx } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 rounded-md border-base bg-paper p-4 shadow-sm mt-6">
      {LEGENDS.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2.5 text-sm font-medium text-stone">
          <span className={`h-5 w-5 rounded-t-lg rounded-b-sm border-b-2 ${legend.className}`} />
          <span>{tx(legend.label, legend.viLabel)}</span>
        </div>
      ))}
    </div>
  );
}

export default SeatLegend;


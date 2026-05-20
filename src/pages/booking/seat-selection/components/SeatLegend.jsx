import useLanguage from '@/features/i18n/hooks/useLanguage';

const LEGENDS = [
  { label: 'Available', className: 'bg-cream border-base border-ash' },
  { label: 'Selected', className: 'bg-ink border-selected border-ink' },
  { label: 'VIP', className: 'bg-gold border-base border-gold-dark' },
  { label: 'Sold', className: 'bg-fog border-base border-stone' },
];

function SeatLegend() {
  const { tx } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-md border-base bg-paper p-3">
      {LEGENDS.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2 text-xs text-stone">
          <span className={`h-4 w-5 rounded-md ${legend.className}`} />
          <span>{tx(legend.label, legend.label === 'Available' ? 'Còn trống' : legend.label === 'Selected' ? 'Đã chọn' : legend.label === 'Sold' ? 'Đã bán' : legend.label)}</span>
        </div>
      ))}
    </div>
  );
}

export default SeatLegend;


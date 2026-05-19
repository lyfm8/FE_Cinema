import useLanguage from '@/hooks/useLanguage';

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 58 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 61 },
  { month: 'Apr', value: 74 },
  { month: 'May', value: 82 },
  { month: 'Jun', value: 77 },
];

function RevenueChart() {
  const { tx } = useLanguage();

  return (
    <article className="surface-card p-4">
      <p className="section-label mb-3">{tx('Revenue Trend', 'Xu hướng doanh thu')}</p>

      <div className="rounded-md border-base bg-cream p-4">
        <div className="flex h-40 items-end gap-3">
          {MONTHLY_REVENUE.map((item) => (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-sm border-base border-charcoal bg-paper" style={{ height: `${item.value}%` }} />
              <span className="text-[11px] text-stone">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default RevenueChart;

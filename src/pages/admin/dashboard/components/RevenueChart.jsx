/**
 * @param {{
 *  title: string,
 *  data: Array<{ month: string, value: number }>
 * }} props
 */
function RevenueChart({ title, data }) {
  return (
    <article className="surface-card p-4">
      <p className="section-label mb-3">{title}</p>

      <div className="rounded-md border-base bg-cream p-4">
        <div className="flex h-40 items-end gap-3">
          {data.map((item) => (
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

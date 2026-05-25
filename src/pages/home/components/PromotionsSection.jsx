import useLanguage from '@/features/i18n/hooks/useLanguage';

function PromotionCard({ promotion }) {
  const { tx } = useLanguage();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const discountLabel =
    promotion.discountType === 'PERCENTAGE'
      ? `-${promotion.discountValue}%`
      : `-${new Intl.NumberFormat('vi-VN').format(promotion.discountValue)}đ`;

  return (
    <article className="group overflow-hidden rounded-lg border-base bg-paper transition-all duration-200 hover:border-gold hover:shadow-sm">
      {/* Discount banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gold/20 to-gold/5 px-4 py-3">
        <span className="movie-title text-xl text-charcoal">{discountLabel}</span>
        <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-medium text-charcoal">
          {promotion.code}
        </span>
      </div>

      <div className="space-y-2 p-4">
        {promotion.description && (
          <p className="text-sm text-charcoal">{promotion.description}</p>
        )}

        {promotion.movie && (
          <p className="truncate text-xs text-stone">
            {tx('For movie', 'Áp dụng cho phim')}: <span className="font-medium text-charcoal">{promotion.movie.title}</span>
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-stone">
          <span>
            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
          </span>
          <span className="inline-flex items-center gap-1 text-success-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-green" />
            {tx('Active', 'Đang hoạt động')}
          </span>
        </div>
      </div>
    </article>
  );
}

/** @param {{ promotions: Array<any> }} props */
function PromotionsSection({ promotions }) {
  const { tx } = useLanguage();

  return (
    <section className="space-y-4">
      <div>
        <p className="section-label mb-2 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose" />
          {tx('Promotions', 'Khuyến mãi')}
        </p>
        <h2 className="text-xl font-medium text-ink">
          {tx('Current deals and offers', 'Ưu đãi đang có')}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </section>
  );
}

export default PromotionsSection;

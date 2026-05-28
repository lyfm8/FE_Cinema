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
    <article className="group overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Discount banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f26b38] to-[#ff8f5e] px-5 py-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-2xl font-extrabold text-white">{discountLabel}</span>
          <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white border border-white/30">
            {promotion.code}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {promotion.description && (
          <p className="text-sm text-charcoal leading-relaxed line-clamp-2">{promotion.description}</p>
        )}

        {promotion.movie && (
          <p className="truncate text-xs text-gray-500">
            {tx('For movie', 'Áp dụng cho phim')}: <span className="font-semibold text-ink">{promotion.movie.title}</span>
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span className="font-medium">
            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
    <section className="page-container py-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1.5 rounded-full bg-[#f26b38]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#f26b38] mb-1">
            {tx('Promotions', 'Khuyến mãi')}
          </p>
          <h2 className="text-2xl font-bold text-ink">
            {tx('Current deals and offers', 'Ưu đãi đang có')}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </section>
  );
}

export default PromotionsSection;

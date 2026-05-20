import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/**
 * @param {{
 *  page: number,
 *  totalPages: number,
 *  onPrev: () => void,
 *  onNext: () => void
 * }} props
 */
function Pagination({ page, totalPages, onPrev, onNext }) {
  const { tx } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border-base bg-paper px-2 py-1">
      <Button variant="ghost" onClick={onPrev} disabled={page <= 1}>
        {tx('Prev', 'Trước')}
      </Button>
      <span className="min-w-14 text-center text-sm text-stone">
        {page} / {totalPages}
      </span>
      <Button variant="ghost" onClick={onNext} disabled={page >= totalPages}>
        {tx('Next', 'Sau')}
      </Button>
    </div>
  );
}

export default Pagination;


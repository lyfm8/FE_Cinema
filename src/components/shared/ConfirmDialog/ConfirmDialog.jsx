import Button from '@/components/ui/Button';
import useLanguage from '@/hooks/useLanguage';

/**
 * @param {{
 *  open: boolean,
 *  title: string,
 *  description: string,
 *  onConfirm: () => void,
 *  onCancel: () => void
 * }} props
 */
function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
  const { tx } = useLanguage();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/20 p-4">
      <div className="w-full max-w-sm rounded-lg border-base bg-paper p-6">
        <h3 className="mb-2 text-lg font-medium text-ink">{title}</h3>
        <p className="mb-6 text-sm text-stone">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {tx('Cancel', 'Hủy')}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {tx('Confirm', 'Xác nhận')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;


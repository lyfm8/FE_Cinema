import Button from '@/components/ui/Button';
import useLanguage from '@/hooks/useLanguage';

/**
 * @param {{
 *  isOpen: boolean,
 *  title?: string,
 *  children?: import('react').ReactNode,
 *  onClose: () => void
 * }} props
 */
function Modal({ isOpen, title, children, onClose }) {
  const { tx } = useLanguage();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/20 p-4">
      <div className="w-full max-w-lg rounded-lg border-base bg-paper p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-ink">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            {tx('Close', 'Đóng')}
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;


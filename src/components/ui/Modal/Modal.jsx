import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/**
 * @param {{
 *  isOpen: boolean,
 *  title?: string,
 *  children?: import('react').ReactNode,
 *  onClose: () => void,
 *  maxWidthClass?: string
 * }} props
 */
function Modal({ isOpen, title, children, onClose, maxWidthClass = 'max-w-lg' }) {
  const { tx } = useLanguage();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidthClass} rounded-lg border-base bg-paper p-6 shadow-2xl`}>
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


import Modal from '@/components/ui/Modal';
import useLanguage from '@/hooks/useLanguage';

/** @param {{ isOpen: boolean, onClose: () => void, title: string }} props */
function TrailerModal({ isOpen, onClose, title }) {
  const { tx } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tx(`${title} trailer`, `Trailer ${title}`)}>
      <div className="rounded-md border-base bg-cream p-10 text-center text-sm text-stone">
        {tx('Trailer player placeholder', 'Khung phát trailer')}
      </div>
    </Modal>
  );
}

export default TrailerModal;


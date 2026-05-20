import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ open: boolean, onClose: () => void }} props */
function MovieFormModal({ open, onClose }) {
  const { tx } = useLanguage();
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={tx('Create movie', 'Tạo phim mới')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label={tx('Movie title', 'Tên phim')} value={title} onChange={(event) => setTitle(event.target.value)} />
        <Button type="submit">{tx('Save', 'Lưu')}</Button>
      </form>
    </Modal>
  );
}

export default MovieFormModal;


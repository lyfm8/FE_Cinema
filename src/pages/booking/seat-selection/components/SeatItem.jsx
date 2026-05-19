import { SEAT_STATUS } from '@/utils/constants';

/** @param {{ seatId: string, status: string, onToggle: (seatId: string) => void }} props */
function SeatItem({ seatId, status, onToggle }) {
  const statusClassMap = {
    [SEAT_STATUS.AVAILABLE]: 'bg-paper border-base border-ash cursor-pointer hover:border-charcoal',
    [SEAT_STATUS.SELECTED]: 'bg-ink border-selected border-ink text-paper cursor-pointer',
    [SEAT_STATUS.VIP]: 'bg-gold border-base border-gold-dark cursor-pointer text-charcoal',
    [SEAT_STATUS.SOLD]: 'bg-fog border-base border-stone opacity-60 cursor-not-allowed',
  };

  const disabled = status === SEAT_STATUS.SOLD;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(seatId)}
      className={`h-8 rounded-md text-[10px] transition-colors ${statusClassMap[status]}`}
      title={seatId}
    >
      {seatId}
    </button>
  );
}

export default SeatItem;

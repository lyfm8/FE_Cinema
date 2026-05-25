import { SEAT_STATUS } from '@/utils/constants';

/** @param {{ seatId: string, status: string, col: number, onToggle: (seatId: string) => void }} props */
function SeatItem({ seatId, status, col, onToggle }) {
  const statusClassMap = {
    [SEAT_STATUS.AVAILABLE]: 'bg-paper border-base border-ash cursor-pointer hover:border-charcoal hover:bg-ash/20',
    [SEAT_STATUS.SELECTED]: 'bg-ink border-selected border-ink text-paper cursor-pointer shadow-sm',
    [SEAT_STATUS.RESERVED]: 'bg-gold border-base border-gold-dark cursor-not-allowed text-charcoal opacity-80',
    [SEAT_STATUS.VIP]: 'bg-gold border-base border-gold-dark cursor-pointer text-charcoal hover:brightness-95',
    [SEAT_STATUS.SOLD]: 'bg-fog border-base border-stone opacity-50 cursor-not-allowed',
  };

  const disabled = status === SEAT_STATUS.SOLD || status === SEAT_STATUS.RESERVED;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(seatId)}
      className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-t-lg rounded-b-sm border-b-[1px] md:border-b-2 text-[8px] sm:text-[9px] md:text-[10px] font-medium transition-all ${statusClassMap[status]}`}
      title={seatId}
    >
      {col}
    </button>
  );
}

export default SeatItem;

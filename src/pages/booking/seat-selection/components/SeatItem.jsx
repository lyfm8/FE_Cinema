import { SEAT_STATUS } from '@/utils/constants';

/** @param {{ seatId: string, status: string, col: number, onToggle: (seatId: string) => void }} props */
function SeatItem({ seatId, status, col, onToggle }) {
  const statusClassMap = {
    [SEAT_STATUS.AVAILABLE]: 'bg-white border-base border-gray-300 cursor-pointer hover:border-galaxyOrange text-gray-500 hover:text-galaxyOrange',
    [SEAT_STATUS.SELECTED]: 'bg-galaxyOrange border-galaxyOrangeHover text-white cursor-pointer shadow-md',
    [SEAT_STATUS.RESERVED]: 'bg-gray-300 border-gray-400 cursor-not-allowed text-white opacity-80',
    [SEAT_STATUS.VIP]: 'bg-red-500 border-red-600 cursor-pointer text-white hover:brightness-95',
    [SEAT_STATUS.SOLD]: 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50 text-transparent',
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

import SeatItem from '@/pages/booking/seat-selection/components/SeatItem';
import { SEAT_STATUS } from '@/utils/constants';

/**
 * @param {{
 *  seats: Array<{ id: string, status: string }>,
 *  selectedSeats: string[],
 *  onToggleSeat: (seatId: string) => void
 * }} props
 */
function SeatMap({ seats, selectedSeats, onToggleSeat }) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg border-base bg-cream/50 p-3">
      <div className="grid grid-cols-8 gap-2">
        {seats.map((seat) => {
          const status = selectedSeats.includes(seat.id) ? SEAT_STATUS.SELECTED : seat.status;

          return <SeatItem key={seat.id} seatId={seat.id} status={status} onToggle={onToggleSeat} />;
        })}
      </div>
    </div>
  );
}

export default SeatMap;



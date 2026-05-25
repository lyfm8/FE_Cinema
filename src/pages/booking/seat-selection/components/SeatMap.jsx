import SeatItem from '@/pages/booking/seat-selection/components/SeatItem';
import { SEAT_STATUS } from '@/utils/constants';

/**
 * @param {{
 *  seats: Array<{ rowLabel: string, seats: Array<{ id: string, status: string, row: string, col: number }> }>,
 *  selectedSeats: string[],
 *  onToggleSeat: (seatId: string) => void
 * }} props
 */
function SeatMap({ seats, selectedSeats, onToggleSeat }) {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-auto rounded-lg border-base bg-cream/50 p-3 sm:p-4 md:p-6 shadow-inner">
      <div className="mx-auto flex w-max flex-col gap-2 sm:gap-3">
        {seats.map((rowObj) => (
          <div key={rowObj.rowLabel} className="flex items-center justify-center gap-1.5 sm:gap-3">
            {/* Left Row Label */}
            <div className="flex w-4 sm:w-6 shrink-0 items-center justify-center text-[11px] sm:text-[13px] md:text-sm font-bold text-stone">
              {rowObj.rowLabel}
            </div>

            {/* Left Seats (1-8) */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
              {rowObj.seats.slice(0, 8).map((seat) => {
                const status = selectedSeats.includes(seat.id) ? SEAT_STATUS.SELECTED : seat.status;
                return <SeatItem key={seat.id} seatId={seat.id} status={status} col={seat.col} onToggle={onToggleSeat} />;
              })}
            </div>

            {/* Aisle */}
            <div className="w-4 sm:w-6 md:w-8 shrink-0 border-x border-dashed border-ash/30 bg-ash/5"></div>

            {/* Right Seats (9-16) */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
              {rowObj.seats.slice(8, 16).map((seat) => {
                const status = selectedSeats.includes(seat.id) ? SEAT_STATUS.SELECTED : seat.status;
                return <SeatItem key={seat.id} seatId={seat.id} status={status} col={seat.col} onToggle={onToggleSeat} />;
              })}
            </div>

            {/* Right Row Label */}
            <div className="flex w-6 shrink-0 items-center justify-center text-sm font-bold text-stone">
              {rowObj.rowLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatMap;



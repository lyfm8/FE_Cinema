export const BOOKING_ACTION_TYPES = {
  SET_SHOWTIME: 'SET_SHOWTIME',
  TOGGLE_SEAT: 'TOGGLE_SEAT',
  RESET_BOOKING: 'RESET_BOOKING',
};

export const initialBookingState = {
  showtimeId: null,
  selectedSeats: [],
};

function bookingReducer(state, action) {
  switch (action.type) {
    case BOOKING_ACTION_TYPES.SET_SHOWTIME:
      return {
        ...state,
        showtimeId: action.payload,
        selectedSeats: [],
      };

    case BOOKING_ACTION_TYPES.TOGGLE_SEAT: {
      const seatId = action.payload;
      const exists = state.selectedSeats.includes(seatId);

      return {
        ...state,
        selectedSeats: exists
          ? state.selectedSeats.filter((id) => id !== seatId)
          : [...state.selectedSeats, seatId],
      };
    }

    case BOOKING_ACTION_TYPES.RESET_BOOKING:
      return {
        ...initialBookingState,
      };

    default:
      return state;
  }
}

export default bookingReducer;
